import { describe, it, expect, vi } from 'vitest'

describe('getPaymentProvider', () => {
  it('returns the demo provider when no Stripe key is set', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '')
    vi.resetModules()
    const { getPaymentProvider } = await import('../index')
    const { demoProvider } = await import('../demo')
    expect(getPaymentProvider()).toBe(demoProvider)
  })

  it('returns the demo provider when the placeholder key is set', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_placeholder')
    vi.resetModules()
    const { getPaymentProvider } = await import('../index')
    const { demoProvider } = await import('../demo')
    expect(getPaymentProvider()).toBe(demoProvider)
  })

  it('returns the Stripe provider when a real test key is set', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_1234567890')
    vi.resetModules()
    const { getPaymentProvider } = await import('../index')
    const { stripeProvider } = await import('../stripe')
    expect(getPaymentProvider()).toBe(stripeProvider)
  })
})
