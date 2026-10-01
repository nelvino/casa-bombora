import { describe, it, expect, vi, beforeEach } from 'vitest'

const xenditVerify = vi.hoisted(() => vi.fn())
const stripeVerify = vi.hoisted(() => vi.fn())
const convertHoldToBooking = vi.hoisted(() => vi.fn())
const headersGet = vi.hoisted(() => vi.fn())

vi.mock('next/headers', () => ({
  headers: () => ({ get: headersGet }),
}))

vi.mock('@/lib/payments/xendit', () => ({
  xenditProvider: { verifyWebhook: xenditVerify, createSession: vi.fn() },
}))

vi.mock('@/lib/payments/stripe', () => ({
  stripeProvider: { verifyWebhook: stripeVerify, createSession: vi.fn() },
}))

vi.mock('@/lib/booking/db', () => ({
  convertHoldToBooking,
}))

function req(payload: string) {
  return new Request('https://stay.casabombora.com/api/webhooks/payment', {
    method: 'POST',
    body: payload,
  })
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.unstubAllEnvs()
  headersGet.mockReturnValue(null)
})

describe('POST /api/webhooks/payment', () => {
  it('routes Xendit callbacks by x-callback-token and converts the hold', async () => {
    headersGet.mockImplementation((name: string) =>
      name === 'x-callback-token' ? 'tok' : null
    )
    xenditVerify.mockResolvedValue({
      bookingId: 'hold-abc',
      status: 'paid',
      guestEmail: 'jane@example.com',
      guestName: 'Jane',
      paymentIntentId: 'inv_1',
    })
    convertHoldToBooking.mockResolvedValue({ id: 'booking_1' })

    const { POST } = await import('../route')
    const res = await POST(req('{"status":"PAID"}'))

    expect(res.status).toBe(200)
    expect(xenditVerify).toHaveBeenCalledWith('{"status":"PAID"}', 'tok')
    expect(stripeVerify).not.toHaveBeenCalled()
    expect(convertHoldToBooking).toHaveBeenCalledWith(
      'hold-abc',
      { name: 'Jane', email: 'jane@example.com' },
      'inv_1'
    )
  })

  it('routes Stripe events by stripe-signature', async () => {
    headersGet.mockImplementation((name: string) =>
      name === 'stripe-signature' ? 'sig' : null
    )
    stripeVerify.mockResolvedValue({
      bookingId: 'hold-xyz',
      status: 'paid',
      paymentIntentId: 'pi_1',
    })
    convertHoldToBooking.mockResolvedValue({ id: 'booking_2' })

    const { POST } = await import('../route')
    const res = await POST(req('{"type":"checkout.session.completed"}'))

    expect(res.status).toBe(200)
    expect(stripeVerify).toHaveBeenCalled()
    expect(xenditVerify).not.toHaveBeenCalled()
    expect(convertHoldToBooking).toHaveBeenCalledWith(
      'hold-xyz',
      { name: 'Guest', email: '' },
      'pi_1'
    )
  })

  it('rejects when signature verification fails', async () => {
    headersGet.mockImplementation((name: string) =>
      name === 'x-callback-token' ? 'bad' : null
    )
    xenditVerify.mockResolvedValue(null)

    const { POST } = await import('../route')
    const res = await POST(req('{}'))

    expect(res.status).toBe(400)
    expect(convertHoldToBooking).not.toHaveBeenCalled()
  })

  it('rejects non-paid verification results', async () => {
    headersGet.mockImplementation((name: string) =>
      name === 'x-callback-token' ? 'tok' : null
    )
    xenditVerify.mockResolvedValue({ bookingId: 'hold-abc', status: 'pending' })

    const { POST } = await import('../route')
    const res = await POST(req('{}'))

    expect(res.status).toBe(400)
    expect(convertHoldToBooking).not.toHaveBeenCalled()
  })

  it('acknowledges unsigned requests only in demo mode (no provider keys)', async () => {
    vi.stubEnv('XENDIT_SECRET_KEY', '')
    vi.stubEnv('STRIPE_SECRET_KEY', '')

    const { POST } = await import('../route')
    const res = await POST(req('{}'))
    expect(res.status).toBe(200)
    expect(convertHoldToBooking).not.toHaveBeenCalled()
  })

  it('returns 500 when hold conversion fails', async () => {
    headersGet.mockImplementation((name: string) =>
      name === 'x-callback-token' ? 'tok' : null
    )
    xenditVerify.mockResolvedValue({
      bookingId: 'hold-abc',
      status: 'paid',
    })
    convertHoldToBooking.mockRejectedValue(new Error('db down'))

    const { POST } = await import('../route')
    const res = await POST(req('{}'))
    expect(res.status).toBe(500)
  })
})
