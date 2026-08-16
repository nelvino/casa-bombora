import type { PaymentProvider } from './types'
import { demoProvider } from './demo'
import { stripeProvider } from './stripe'

export function getPaymentProvider(): PaymentProvider {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (secretKey && secretKey !== 'sk_test_placeholder') {
    return stripeProvider
  }
  return demoProvider
}
