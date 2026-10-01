import type { PaymentProvider } from './types'

const secretKey = process.env.XENDIT_SECRET_KEY
const callbackToken = process.env.XENDIT_CALLBACK_TOKEN

interface XenditInvoice {
  id: string
  invoice_url: string
}

// Xendit Invoices API: hosted checkout page supporting international cards,
// VA, and e-wallets. Settles in IDR to the merchant's Indonesian bank account.
// https://developers.xendit.co/api-reference/#create-invoice
export const xenditProvider: PaymentProvider = {
  async createSession({ villa, booking, amountIdr, successUrl, cancelUrl }) {
    if (!secretKey) {
      throw new Error('Xendit is not configured')
    }

    const res = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${secretKey}:`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: booking.token ?? booking.id,
        amount: amountIdr,
        currency: 'IDR',
        payer_email: booking.guestEmail,
        description: `${villa.name} — Casa Bombora Villas`,
        success_redirect_url: successUrl,
        failure_redirect_url: cancelUrl,
      }),
    })

    if (!res.ok) {
      throw new Error(`Xendit invoice creation failed: ${res.status}`)
    }

    const invoice = (await res.json()) as XenditInvoice
    return { sessionId: invoice.id, url: invoice.invoice_url }
  },

  // Xendit invoice callbacks send `x-callback-token` which must equal the
  // callback verification token from the Xendit dashboard.
  async verifyWebhook(payload, signature) {
    if (!callbackToken || signature !== callbackToken) {
      return null
    }

    try {
      const data = JSON.parse(payload.toString()) as {
        id?: string
        external_id?: string
        status?: string
        payer_email?: string
      }

      if (data.status !== 'PAID' || !data.external_id) {
        return null
      }

      return {
        bookingId: data.external_id,
        status: 'paid',
        guestEmail: data.payer_email,
        paymentIntentId: data.id,
      }
    } catch {
      return null
    }
  },
}
