import { describe, it, expect, vi, beforeEach } from 'vitest'

async function loadPayments(env: Record<string, string>) {
  vi.resetModules()
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value)
  }
  return import('../index')
}

beforeEach(() => {
  vi.unstubAllEnvs()
})

describe('paymentsEnabled', () => {
  it('is true only when PAYMENTS_ENABLED === "true"', async () => {
    const { paymentsEnabled } = await loadPayments({ PAYMENTS_ENABLED: 'true' })
    expect(paymentsEnabled()).toBe(true)
  })

  it.each(['false', '', '1', 'TRUE'])(
    'is false for PAYMENTS_ENABLED="%s"',
    async (value) => {
      const { paymentsEnabled } = await loadPayments({ PAYMENTS_ENABLED: value })
      expect(paymentsEnabled()).toBe(false)
    }
  )
})

describe('getPaymentProvider', () => {
  it('returns the demo provider when no keys are set', async () => {
    const { getPaymentProvider } = await loadPayments({
      PAYMENT_PROVIDER: '',
      XENDIT_SECRET_KEY: '',
      STRIPE_SECRET_KEY: '',
    })
    const { demoProvider } = await import('../demo')
    expect(getPaymentProvider()).toBe(demoProvider)
  })

  it('returns the Xendit provider when XENDIT_SECRET_KEY is set', async () => {
    const { getPaymentProvider } = await loadPayments({
      PAYMENT_PROVIDER: '',
      XENDIT_SECRET_KEY: 'xnd_test_dummy',
      STRIPE_SECRET_KEY: '',
    })
    const { xenditProvider } = await import('../xendit')
    expect(getPaymentProvider()).toBe(xenditProvider)
  })

  it('returns the Stripe provider when only STRIPE_SECRET_KEY is set', async () => {
    const { getPaymentProvider } = await loadPayments({
      PAYMENT_PROVIDER: '',
      XENDIT_SECRET_KEY: '',
      STRIPE_SECRET_KEY: 'sk_test_dummy',
    })
    const { stripeProvider } = await import('../stripe')
    expect(getPaymentProvider()).toBe(stripeProvider)
  })

  it('prefers Xendit when both keys are set', async () => {
    const { getPaymentProvider } = await loadPayments({
      PAYMENT_PROVIDER: '',
      XENDIT_SECRET_KEY: 'xnd_test_dummy',
      STRIPE_SECRET_KEY: 'sk_test_dummy',
    })
    const { xenditProvider } = await import('../xendit')
    expect(getPaymentProvider()).toBe(xenditProvider)
  })

  it('honours PAYMENT_PROVIDER=stripe even when Xendit key exists', async () => {
    const { getPaymentProvider } = await loadPayments({
      PAYMENT_PROVIDER: 'stripe',
      XENDIT_SECRET_KEY: 'xnd_test_dummy',
      STRIPE_SECRET_KEY: 'sk_test_dummy',
    })
    const { stripeProvider } = await import('../stripe')
    expect(getPaymentProvider()).toBe(stripeProvider)
  })

  it('honours PAYMENT_PROVIDER=demo even when keys exist', async () => {
    const { getPaymentProvider } = await loadPayments({
      PAYMENT_PROVIDER: 'demo',
      XENDIT_SECRET_KEY: 'xnd_test_dummy',
      STRIPE_SECRET_KEY: 'sk_test_dummy',
    })
    const { demoProvider } = await import('../demo')
    expect(getPaymentProvider()).toBe(demoProvider)
  })

  it('falls back to auto-detect when PAYMENT_PROVIDER names an unconfigured provider', async () => {
    const { getPaymentProvider } = await loadPayments({
      PAYMENT_PROVIDER: 'stripe',
      XENDIT_SECRET_KEY: 'xnd_test_dummy',
      STRIPE_SECRET_KEY: '',
    })
    const { xenditProvider } = await import('../xendit')
    expect(getPaymentProvider()).toBe(xenditProvider)
  })
})
