import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addDays } from 'date-fns'

const prisma = vi.hoisted(() => ({
  booking: {
    update: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  hold: {
    update: vi.fn(),
    updateMany: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  villa: { findUnique: vi.fn() },
  blockedDate: { createMany: vi.fn(), findMany: vi.fn(), delete: vi.fn() },
  $transaction: vi.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
}))

const isAdmin = vi.hoisted(() => vi.fn())
const revalidatePath = vi.hoisted(() => vi.fn())
const sendEmail = vi.hoisted(() => vi.fn())

vi.mock('@/lib/prisma', () => ({ prisma }))
vi.mock('@/lib/auth/session', () => ({ isAdmin }))
vi.mock('@/lib/email/send', () => ({ sendEmail }))
vi.mock('next/cache', () => ({ revalidatePath }))
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT ${url}`)
  },
}))

function form(data: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(data)) fd.set(k, v)
  return fd
}

beforeEach(() => {
  vi.resetAllMocks()
  isAdmin.mockResolvedValue(true)
  prisma.booking.update.mockResolvedValue({
    id: 'b1',
    guestName: 'Jane',
    guestEmail: 'jane@example.com',
    checkIn: new Date('2026-12-01'),
    checkOut: new Date('2026-12-05'),
    totalAmount: 11600000,
    villa: { name: 'Villa Teduh' },
  })
  prisma.hold.update.mockResolvedValue({})
  prisma.hold.updateMany.mockResolvedValue({ count: 1 })
  prisma.booking.create.mockImplementation(async ({ data }) => ({
    id: 'bk_1',
    ...data,
  }))
  prisma.booking.findFirst.mockResolvedValue(null)
  prisma.booking.findMany.mockResolvedValue([])
  prisma.hold.findMany.mockResolvedValue([])
  prisma.blockedDate.findMany.mockResolvedValue([])
  prisma.blockedDate.createMany.mockResolvedValue({ count: 0 })
  prisma.blockedDate.delete.mockResolvedValue({})
})

describe('admin action auth', () => {
  it.each([
    'confirmBooking',
    'cancelBooking',
    'markBookingPaid',
    'releaseHold',
    'convertHold',
    'blockDateRange',
    'unblockDate',
    'createManualBooking',
  ])('%s throws Unauthorized when not admin', async (fn) => {
    isAdmin.mockResolvedValue(false)
    const actions = await import('../actions')
    await expect(
      (actions as Record<string, (f: FormData) => Promise<unknown>>)[fn](
        form({ id: 'x' })
      )
    ).rejects.toThrow('Unauthorized')
  })
})

describe('confirmBooking / cancelBooking / markBookingPaid', () => {
  it('updates the booking status fields', async () => {
    const { confirmBooking, cancelBooking, markBookingPaid } = await import(
      '../actions'
    )

    await confirmBooking(form({ id: 'b1' }))
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'b1' },
        data: { status: 'CONFIRMED' },
      })
    )

    await cancelBooking(form({ id: 'b1' }))
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'CANCELLED' } })
    )

    await markBookingPaid(form({ id: 'b1' }))
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { paymentStatus: 'PAID' } })
    )
  })
})

describe('releaseHold', () => {
  const holdWithGuest = {
    id: 'h1',
    status: 'ACTIVE',
    guestName: 'Jane',
    guestEmail: 'jane@example.com',
    checkIn: new Date('2026-12-01'),
    checkOut: new Date('2026-12-05'),
    villa: { name: 'Villa Teduh' },
  }

  it('releases the hold and emails the guest a decline notice', async () => {
    prisma.hold.findUnique.mockResolvedValue(holdWithGuest)

    const { releaseHold } = await import('../actions')
    await releaseHold(form({ id: 'h1' }))

    expect(prisma.hold.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'h1' },
        data: { status: 'RELEASED' },
      })
    )
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'jane@example.com' })
    )
  })

  it('does not email when the hold has no guest details', async () => {
    prisma.hold.findUnique.mockResolvedValue({
      ...holdWithGuest,
      guestName: null,
      guestEmail: null,
    })

    const { releaseHold } = await import('../actions')
    await releaseHold(form({ id: 'h1' }))

    expect(prisma.hold.update).toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('is a no-op for an already-released or missing hold', async () => {
    prisma.hold.findUnique.mockResolvedValue({
      ...holdWithGuest,
      status: 'RELEASED',
    })

    const { releaseHold } = await import('../actions')
    await releaseHold(form({ id: 'h1' }))

    expect(prisma.hold.update).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })
})

describe('convertHold', () => {
  const holdFixture = {
    id: 'h1',
    villaId: 'v1',
    checkIn: addDays(new Date(), 10),
    checkOut: addDays(new Date(), 13),
    status: 'ACTIVE',
    expiresAt: addDays(new Date(), 1),
    villa: { id: 'v1', pricePerNight: 2900000 },
  }

  beforeEach(() => {
    prisma.hold.findUnique.mockResolvedValue(holdFixture)
    prisma.blockedDate.findMany.mockResolvedValue([])
  })

  it('claims the hold atomically and creates a booking', async () => {
    const { convertHold } = await import('../actions')
    await convertHold(
      form({ id: 'h1', guestName: 'Jane', guestEmail: 'jane@example.com' })
    )

    // atomic claim guards the conversion
    expect(prisma.hold.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'h1', status: 'ACTIVE' },
        data: { status: 'CONVERTED' },
      })
    )

    const created = prisma.booking.create.mock.calls[0][0].data
    expect(created.guestName).toBe('Jane')
    expect(created.guestEmail).toBe('jane@example.com')
    expect(created.totalAmount).toBe(3 * 2900000)
    expect(created.status).toBe('PENDING')
    expect(created.paymentStatus).toBe('UNPAID')
  })

  it('returns the existing booking on a duplicate call instead of double-booking', async () => {
    prisma.hold.updateMany.mockResolvedValue({ count: 0 }) // claim lost
    prisma.booking.findFirst.mockResolvedValue({ id: 'bk_existing' })

    const { convertHold } = await import('../actions')
    await convertHold(
      form({ id: 'h1', guestName: 'Jane', guestEmail: 'jane@example.com' })
    )

    expect(prisma.booking.create).not.toHaveBeenCalled()
  })

  it('refuses to convert when the dates are no longer available', async () => {
    // another active hold now overlaps
    prisma.hold.findMany.mockResolvedValue([
      {
        status: 'ACTIVE',
        expiresAt: addDays(new Date(), 1),
        checkIn: holdFixture.checkIn,
        checkOut: holdFixture.checkOut,
      },
    ])

    const { convertHold } = await import('../actions')
    // availability failure surfaces as an error-banner redirect, not a crash
    await expect(
      convertHold(
        form({ id: 'h1', guestName: 'Jane', guestEmail: 'jane@example.com' })
      )
    ).rejects.toThrow('REDIRECT /admin?error=')

    expect(prisma.booking.create).not.toHaveBeenCalled()
    // hold rolled out of the way so it stops blocking
    expect(prisma.hold.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'RELEASED' } })
    )
  })
})

describe('createManualBooking', () => {
  beforeEach(() => {
    prisma.villa.findUnique.mockResolvedValue({
      id: 'v1',
      name: 'Villa Teduh',
      pricePerNight: 2900000,
    })
  })

  it('creates a confirmed booking and emails the guest', async () => {
    const { createManualBooking } = await import('../actions')
    await expect(
      createManualBooking(
        form({
          villaId: 'v1',
          guestName: 'Jane',
          guestEmail: 'jane@example.com',
          checkIn: '2026-12-01',
          checkOut: '2026-12-04',
          paid: 'on',
        })
      )
    ).rejects.toThrow('REDIRECT /admin?notice=')

    const created = prisma.booking.create.mock.calls[0][0].data
    expect(created.status).toBe('CONFIRMED')
    expect(created.paymentStatus).toBe('PAID')
    expect(created.totalAmount).toBe(3 * 2900000)
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'jane@example.com' })
    )
  })

  it('refuses overlapping dates', async () => {
    prisma.booking.findMany.mockResolvedValue([
      {
        checkIn: new Date('2026-12-02'),
        checkOut: new Date('2026-12-06'),
      },
    ])

    const { createManualBooking } = await import('../actions')
    await expect(
      createManualBooking(
        form({
          villaId: 'v1',
          guestName: 'Jane',
          guestEmail: 'jane@example.com',
          checkIn: '2026-12-01',
          checkOut: '2026-12-04',
        })
      )
    ).rejects.toThrow('REDIRECT /admin?error=')

    expect(prisma.booking.create).not.toHaveBeenCalled()
  })
})

describe('blockDateRange / unblockDate', () => {
  it('creates a blocked date for each night in the range', async () => {
    const { blockDateRange } = await import('../actions')
    await blockDateRange(
      form({ villaId: 'v1', from: '2026-11-01', to: '2026-11-04' })
    )

    const rows = prisma.blockedDate.createMany.mock.calls[0][0].data
    // 3 nights: Nov 1, 2, 3 (checkout day not blocked)
    expect(rows).toHaveLength(3)
    for (const row of rows) {
      expect(row.villaId).toBe('v1')
      expect(row.source).toBe('manual')
    }
  })

  it('skips dates already blocked', async () => {
    // Prisma returns @db.Date values as UTC midnight — matching the
    // normalized dates produced by blockDateRange
    prisma.blockedDate.findMany.mockResolvedValue([
      { date: new Date(Date.UTC(2026, 10, 2)) },
    ])

    const { blockDateRange } = await import('../actions')
    await blockDateRange(
      form({ villaId: 'v1', from: '2026-11-01', to: '2026-11-04' })
    )

    const rows = prisma.blockedDate.createMany.mock.calls[0][0].data
    expect(rows).toHaveLength(2)
  })

  it('unblockDate removes the row', async () => {
    const { unblockDate } = await import('../actions')
    await unblockDate(form({ id: 'bd_1' }))
    expect(prisma.blockedDate.delete).toHaveBeenCalledWith({
      where: { id: 'bd_1' },
    })
  })
})
