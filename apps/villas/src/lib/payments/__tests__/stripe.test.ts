import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FALLBACK_IDR_RATES } from '@/lib/currency'

const createMock = vi.hoisted(() => vi.fn())

vi.mock('stripe', () => ({
  default: class {
    checkout = { sessions: { create: createMock } }
    webhooks = { constructEvent: vi.fn() }
  },
}))

const baseSession = {
  villa: { name: 'Villa Teduh', slug: 'villa-teduh' },
  booking: { id: 'hold_1', token: 'tok_1', guestEmail: 'j@x.co' },
  successUrl: 'https://x.co/ok',
  cancelUrl: 'https://x.co/cancel',
}

beforeEach(async () => {
  vi.unstubAllEnvs()
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_dummy')
  vi.resetModules()
  createMock.mockReset()
})

describe('stripeProvider.createSession', () => {
  it('converts the IDR total to approximate USD cents', async () => {
    createMock.mockResolvedValue({ id: 'cs_1', url: 'https://stripe.co/pay' })
    const { stripeProvider } = await import('../stripe')

    const amountIdr = 2900000
    const result = await stripeProvider.createSession({ ...baseSession, amountIdr })

    expect(result.url).toBe('https://stripe.co/pay')

    const args = createMock.mock.calls[0][0]
    const item = args.line_items[0]
    expect(item.price_data.currency).toBe('usd')
    const expected = Math.round((amountIdr / FALLBACK_IDR_RATES.USD) * 100)
    expect(item.price_data.unit_amount).toBe(expected)
    expect(args.mode).toBe('payment')
    expect(args.metadata.holdToken).toBe('tok_1')
    expect(args.success_url).toBe(baseSession.successUrl)
    expect(args.cancel_url).toBe(baseSession.cancelUrl)
  })
})
