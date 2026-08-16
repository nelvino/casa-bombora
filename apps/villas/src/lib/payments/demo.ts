import type { PaymentProvider } from './types'

export const demoProvider: PaymentProvider = {
  async createSession({ villa, booking }) {
    const token = booking.token ?? booking.id
    return {
      sessionId: `demo_session_${token}`,
      url: `/villa/${villa.slug}/book/demo-pay?token=${encodeURIComponent(token)}`,
    }
  },

  async verifyWebhook() {
    return {
      bookingId: 'demo',
      status: 'paid',
    }
  },
}
