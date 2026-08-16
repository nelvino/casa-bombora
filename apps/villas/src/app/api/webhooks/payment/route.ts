import { headers } from 'next/headers'
import { convertHoldToBooking } from '@/lib/booking/db'
import { getPaymentProvider } from '@/lib/payments'

export async function POST(req: Request) {
  const isDemo =
    !process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder'

  if (isDemo) {
    return Response.json({ ok: true })
  }

  const payload = await req.text()
  const signature = headers().get('stripe-signature') ?? ''
  const provider = getPaymentProvider()

  const result = await provider.verifyWebhook(payload, signature)

  if (!result || result.status !== 'paid') {
    return new Response('Invalid webhook payload', { status: 400 })
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
    return new Response('Conversion failed', { status: 500 })
  }
}
