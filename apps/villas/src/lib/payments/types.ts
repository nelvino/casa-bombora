export interface PaymentProviderVilla {
  name: string
  slug: string
}

export interface PaymentProviderBooking {
  id: string
  token?: string
  guestEmail?: string
  guestName?: string
}

export interface WebhookVerificationResult {
  bookingId: string
  status: string
  guestEmail?: string
  guestName?: string
  paymentIntentId?: string
}

export interface PaymentProvider {
  // amountIdr is the canonical charge in whole Indonesian rupiah. Providers
  // that can't charge IDR convert for display/charging on their side.
  createSession(options: {
    villa: PaymentProviderVilla
    booking: PaymentProviderBooking
    amountIdr: number
    successUrl: string
    cancelUrl: string
  }): Promise<{ sessionId: string; url: string }>

  verifyWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<WebhookVerificationResult | null>
}
