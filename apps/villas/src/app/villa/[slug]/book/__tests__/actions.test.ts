import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addDays, addMinutes } from 'date-fns'

const prisma = vi.hoisted(() => ({
  villa: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  hold: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  blockedDate: { findMany: vi.fn() },
  booking: { findMany: vi.fn(), create: vi.fn() },
  promoCode: { findUnique: vi.fn() },
  $transaction: vi.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
}))

const fakeProvider = vi.hoisted(() => ({ createSession: vi.fn() }))
const redirectMock = vi.hoisted(() => vi.fn())
const revalidatePath = vi.hoisted(() => vi.fn())

vi.mock('@/lib/prisma', () => ({ prisma }))
vi.mock('next/cache', () => ({ revalidatePath }))
vi.mock('next/navigation', () => ({ redirect: redirectMock }))
vi.mock('@/lib/payments', () => ({
  getPaymentProvider: () => fakeProvider,
  paymentsEnabled: () => process.env.PAYMENTS_ENABLED === 'true',
}))

const VILLA = {
  id: 'villa_1',
  slug: 'villa-teduh',
  name: 'Villa Teduh',
  pricePerNight: 2900000, // matches VILLAS data — no price sync needed
}

function form(data: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(data)) fd.set(k, v)
  return fd
}

const nextWeek = () => addDays(new Date(), 7)
const isoDate = (d: Date) => d.toISOString().slice(0, 10)

async function loadActions() {
  return import('../actions')
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.unstubAllEnvs()

  prisma.villa.findUnique.mockResolvedValue(VILLA)
  prisma.villa.update.mockResolvedValue(VILLA)
  prisma.hold.create.mockImplementation(async ({ data }) => data)
  prisma.hold.findUnique.mockResolvedValue(null)
  prisma.blockedDate.findMany.mockResolvedValue([])
  prisma.booking.findMany.mockResolvedValue([])
  prisma.hold.findMany.mockResolvedValue([])
  prisma.promoCode.findUnique.mockResolvedValue(null)
  fakeProvider.createSession.mockResolvedValue({
    sessionId: 's1',
    url: 'https://pay.example.com',
  })
})

describe('createBookingHold', () => {
  it('rejects invalid form data', async () => {
    const { createBookingHold } = await loadActions()
    const result = await createBookingHold(null, form({}))
    expect(result.ok).toBe(false)
  })

  it('rejects check-out before check-in', async () => {
    const { createBookingHold } = await loadActions()
    const inDate = nextWeek()
    const result = await createBookingHold(
      null,
      form({
        slug: 'villa-teduh',
        checkIn: isoDate(inDate),
        checkOut: isoDate(addDays(inDate, -1)),
      })
    )
    expect(result).toEqual({ ok: false, error: 'Check-out must be after check-in' })
  })

  it('rejects when a manual blocked date overlaps', async () => {
    const inDate = nextWeek()
    prisma.blockedDate.findMany.mockResolvedValue([{ date: inDate }])

    const { createBookingHold } = await loadActions()
    const result = await createBookingHold(
      null,
      form({
        slug: 'villa-teduh',
        checkIn: isoDate(inDate),
        checkOut: isoDate(addDays(inDate, 3)),
      })
    )
    expect(result.ok).toBe(false)
    expect(result.error).toContain('not available')
  })

  it('rejects when an active hold overlaps', async () => {
    const inDate = nextWeek()
    prisma.hold.findMany.mockResolvedValue([
      {
        status: 'ACTIVE',
        expiresAt: addMinutes(new Date(), 10),
        checkIn: inDate,
        checkOut: addDays(inDate, 2),
      },
    ])

    const { createBookingHold } = await loadActions()
    const result = await createBookingHold(
      null,
      form({
        slug: 'villa-teduh',
        checkIn: isoDate(inDate),
        checkOut: isoDate(addDays(inDate, 3)),
      })
    )
    expect(result.ok).toBe(false)
    expect(result.error).toContain('not available')
  })

  it('rejects when a confirmed/pending booking overlaps (double-booking guard)', async () => {
    const inDate = nextWeek()
    prisma.booking.findMany.mockResolvedValue([
      {
        status: 'CONFIRMED',
        checkIn: inDate,
        checkOut: addDays(inDate, 5),
      },
    ])

    const { createBookingHold } = await loadActions()
    const result = await createBookingHold(
      null,
      form({
        slug: 'villa-teduh',
        checkIn: isoDate(inDate),
        checkOut: isoDate(addDays(inDate, 3)),
      })
    )
    expect(result.ok).toBe(false)
    expect(result.error).toContain('not available')
  })

  it('creates a 72-hour hold in enquiry mode (payments disabled)', async () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'false')
    const { createBookingHold } = await loadActions()
    const inDate = nextWeek()
    const outDate = addDays(inDate, 3)

    const before = Date.now()
    const result = await createBookingHold(
      null,
      form({
        slug: 'villa-teduh',
        checkIn: isoDate(inDate),
        checkOut: isoDate(outDate),
        guestName: 'Jane',
        guestEmail: 'jane@example.com',
      })
    )

    expect(result.ok).toBe(true)
    expect(result.totalIdr).toBe(3 * 2900000)
    const expiresAt: Date = prisma.hold.create.mock.calls[0][0].data.expiresAt
    const minutes = (expiresAt.getTime() - before) / 60000
    expect(minutes).toBeGreaterThan(70 * 60)
    expect(minutes).toBeLessThanOrEqual(72 * 60 + 1)
  })

  it('creates a 15-minute hold when payments are enabled', async () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'true')
    const { createBookingHold } = await loadActions()
    const inDate = nextWeek()

    const before = Date.now()
    const result = await createBookingHold(
      null,
      form({
        slug: 'villa-teduh',
        checkIn: isoDate(inDate),
        checkOut: isoDate(addDays(inDate, 2)),
      })
    )

    expect(result.ok).toBe(true)
    const expiresAt: Date = prisma.hold.create.mock.calls[0][0].data.expiresAt
    const minutes = (expiresAt.getTime() - before) / 60000
    expect(minutes).toBeGreaterThan(14)
    expect(minutes).toBeLessThanOrEqual(15.5)
  })

  it('applies a valid promo code discount to the IDR total', async () => {
    prisma.promoCode.findUnique.mockResolvedValue({
      code: 'OPEN10',
      isActive: true,
      discountPercent: 10,
      validFrom: null,
      validTo: null,
      maxUses: null,
      usedCount: 0,
    })

    const { createBookingHold } = await loadActions()
    const inDate = nextWeek()
    const result = await createBookingHold(
      null,
      form({
        slug: 'villa-teduh',
        checkIn: isoDate(inDate),
        checkOut: isoDate(addDays(inDate, 2)),
        promoCode: 'OPEN10',
      })
    )

    expect(result.ok).toBe(true)
    // 2 nights x 2,900,000 = 5,800,000 minus 10% = 5,220,000
    expect(result.totalIdr).toBe(5220000)
    expect(result.discountPercent).toBe(10)
  })
})

describe('createPaymentSession', () => {
  const payForm = () =>
    form({
      slug: 'villa-teduh',
      token: 'tok_1',
      amount: '5800000',
      guestName: 'Jane',
      guestEmail: 'jane@example.com',
    })

  it('refuses when payments are disabled', async () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'false')
    const { createPaymentSession } = await loadActions()
    const result = await createPaymentSession(null, payForm())
    expect(result.ok).toBe(false)
    expect(fakeProvider.createSession).not.toHaveBeenCalled()
  })

  it('rejects an expired hold', async () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'true')
    prisma.hold.findUnique.mockResolvedValue({
      id: 'h1',
      status: 'ACTIVE',
      expiresAt: addMinutes(new Date(), -1), // expired
      villa: { name: 'Villa Teduh' },
    })

    const { createPaymentSession } = await loadActions()
    const result = await createPaymentSession(null, payForm())
    expect(result.ok).toBe(false)
    expect(result.error).toContain('expired')
    expect(fakeProvider.createSession).not.toHaveBeenCalled()
  })

  it('creates a provider session with the IDR amount and redirects', async () => {
    vi.stubEnv('PAYMENTS_ENABLED', 'true')
    prisma.hold.findUnique.mockResolvedValue({
      id: 'h1',
      status: 'ACTIVE',
      expiresAt: addMinutes(new Date(), 10),
      villa: { name: 'Villa Teduh' },
    })

    const { createPaymentSession } = await loadActions()
    await createPaymentSession(null, payForm())

    expect(fakeProvider.createSession).toHaveBeenCalledTimes(1)
    const args = fakeProvider.createSession.mock.calls[0][0]
    expect(args.amountIdr).toBe(5800000)
    expect(args.villa.slug).toBe('villa-teduh')
    expect(args.booking.token).toBe('tok_1')
    expect(redirectMock).toHaveBeenCalledWith('https://pay.example.com')
  })
})
