import type { PaymentProvider } from './types'
import { demoProvider } from './demo'
import { stripeProvider } from './stripe'
import { xenditProvider } from './xendit'

// Online payments are only offered when PAYMENTS_ENABLED=true. Otherwise the
// booking flow ends in an email/WhatsApp enquiry and dates are held longer so
// the team can arrange payment manually.
export function paymentsEnabled(): boolean {
  return process.env.PAYMENTS_ENABLED === 'true'
}

// Provider resolution: PAYMENT_PROVIDER ('xendit' | 'stripe' | 'demo') wins
// when set; otherwise auto-detects from configured keys (Xendit preferred
// since it settles IDR to the PT PMA's Indonesian bank account), and falls
// back to the demo provider when no keys exist.
export function getPaymentProvider(): PaymentProvider {
  const preferred = process.env.PAYMENT_PROVIDER
  const hasXendit = Boolean(process.env.XENDIT_SECRET_KEY)
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY)

  if (preferred === 'xendit' && hasXendit) return xenditProvider
  if (preferred === 'stripe' && hasStripe) return stripeProvider
  if (preferred === 'demo') return demoProvider

  if (hasXendit) return xenditProvider
  if (hasStripe) return stripeProvider
  return demoProvider
}
