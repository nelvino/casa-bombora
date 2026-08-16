import Stripe from 'stripe'
import type { PaymentProvider } from './types'

const secretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const stripe =
  secretKey && secretKey !== 'sk_test_placeholder'
    ? new Stripe(secretKey)
    : null

export const stripeProvider: PaymentProvider = {
  async createSession({
    villa,
    booking,
    amount,
    currency,
    successUrl,
    cancelUrl,
  }) {
    if (!stripe) {
      throw new Error('Stripe is not configured')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: villa.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: booking.id,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        holdToken: booking.token ?? '',
        villaSlug: villa.slug,
        guestEmail: booking.guestEmail ?? '',
        guestName: booking.guestName ?? '',
      },
    })

    return {
      sessionId: session.id,
      url: session.url ?? '',
    }
  },

  async verifyWebhook(payload, signature) {
    if (!stripe || !webhookSecret) {
      return null
    }

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      )

      if (event.type !== 'checkout.session.completed') {
        return null
      }

      const session = event.data.object as Stripe.Checkout.Session
      const holdToken = session.client_reference_id ?? session.metadata?.holdToken
      const guestEmail =
        session.customer_email ??
        session.customer_details?.email ??
        session.metadata?.guestEmail
      const guestName =
        session.customer_details?.name ?? session.metadata?.guestName ?? 'Guest'
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : undefined

      if (!holdToken) return null

      return {
        bookingId: holdToken,
        status: 'paid',
        guestEmail: guestEmail ?? undefined,
        guestName: guestName ?? undefined,
        paymentIntentId,
      }
    } catch {
      return null
    }
  },
}
