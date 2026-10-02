import { headers } from 'next/headers'
import { convertHoldToBooking } from '@/lib/booking/db'
import { alertAdmin } from '@/lib/email/send'
import { stripeProvider } from '@/lib/payments/stripe'
import { xenditProvider } from '@/lib/payments/xendit'

export async function POST(req: Request) {
  const payload = await req.text()
  const hdrs = headers()
  const callbackToken = hdrs.get('x-callback-token')
  const stripeSignature = hdrs.get('stripe-signature')

  // Route by the signature header each provider sends.
  const result = callbackToken
    ? await xenditProvider.verifyWebhook(payload, callbackToken)
    : stripeSignature
      ? await stripeProvider.verifyWebhook(payload, stripeSignature)
      : // No signature headers: only acknowledge in demo mode (no provider keys).
        !process.env.XENDIT_SECRET_KEY && !process.env.STRIPE_SECRET_KEY
        ? { bookingId: 'demo', status: 'paid' }
        : null

  if (!result || result.status !== 'paid') {
    return new Response('Invalid webhook payload', { status: 400 })
  }

  // Demo-mode acknowledgement path — no real hold to convert.
  if (result.bookingId === 'demo') {
    return Response.json({ ok: true })
  }

  try {
    await convertHoldToBooking(
      result.bookingId,
      {
        name: result.guestName ?? 'Guest',
        email: result.guestEmail ?? '',
      },
      result.paymentIntentId
    )
    return Response.json({ ok: true })
  } catch (error) {
    console.error('Webhook conversion failed', error)
    // A payment succeeded but the booking was not created — the guest paid and
    // the hold stays ACTIVE. Alert immediately so this is never missed.
    await alertAdmin(
      'Payment received but booking conversion failed',
      `Hold: ${result.bookingId}\nPayment intent: ${result.paymentIntentId ?? 'n/a'}\nGuest: ${result.guestName ?? 'n/a'} <${result.guestEmail ?? 'n/a'}>\n\nError: ${error instanceof Error ? error.message : String(error)}`
    )
    return new Response('Conversion failed', { status: 500 })
  }
}
