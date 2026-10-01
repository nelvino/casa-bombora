import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const SECRET = 'xnd_test_secret'
const CALLBACK_TOKEN = 'xen-callback-token-abc'

async function loadXendit(env: Record<string, string> = {}) {
  vi.resetModules()
  vi.stubEnv('XENDIT_SECRET_KEY', SECRET)
  vi.stubEnv('XENDIT_CALLBACK_TOKEN', CALLBACK_TOKEN)
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value)
  }
  return import('../xendit')
}

const baseSession = {
  villa: { name: 'Villa Teduh', slug: 'villa-teduh' },
  booking: {
    id: 'hold_123',
    token: 'hold-token-abc',
    guestName: 'Jane Guest',
    guestEmail: 'jane@example.com',
  },
  amountIdr: 8700000,
  successUrl: 'https://stay.casabombora.com/villa/villa-teduh/book?success=1',
  cancelUrl: 'https://stay.casabombora.com/villa/villa-teduh/book?token=t',
}

beforeEach(() => {
  vi.unstubAllEnvs()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('xenditProvider.createSession', () => {
  it('creates an invoice with the hold token as external_id and IDR amount', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ id: 'inv_1', invoice_url: 'https://checkout.xendit.co/web/inv_1' }),
        { status: 200 }
      )
    )
    vi.stubGlobal('fetch', fetchMock)

    const { xenditProvider } = await loadXendit()
    const result = await xenditProvider.createSession(baseSession)

    expect(result).toEqual({
      sessionId: 'inv_1',
      url: 'https://checkout.xendit.co/web/inv_1',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.xendit.co/v2/invoices')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe(
      'Basic ' + Buffer.from(`${SECRET}:`).toString('base64')
    )

    const body = JSON.parse(init.body)
    expect(body.external_id).toBe('hold-token-abc')
    expect(body.amount).toBe(8700000)
    expect(body.currency).toBe('IDR')
    expect(body.payer_email).toBe('jane@example.com')
    expect(body.success_redirect_url).toBe(baseSession.successUrl)
    expect(body.failure_redirect_url).toBe(baseSession.cancelUrl)
    expect(body.description).toContain('Villa Teduh')
  })

  it('throws when Xendit returns a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('unauthorized', { status: 401 }))
    )
    const { xenditProvider } = await loadXendit()
    await expect(xenditProvider.createSession(baseSession)).rejects.toThrow(
      '401'
    )
  })

  it('throws when Xendit is not configured', async () => {
    vi.resetModules()
    vi.stubEnv('XENDIT_SECRET_KEY', '')
    vi.stubEnv('XENDIT_CALLBACK_TOKEN', '')
    const { xenditProvider } = await import('../xendit')
    await expect(xenditProvider.createSession(baseSession)).rejects.toThrow(
      'not configured'
    )
  })
})

describe('xenditProvider.verifyWebhook', () => {
  const paidPayload = JSON.stringify({
    id: 'inv_1',
    external_id: 'hold-token-abc',
    status: 'PAID',
    payer_email: 'jane@example.com',
    payment_method: 'CREDIT_CARD',
  })

  it('returns booking info for a valid PAID callback', async () => {
    const { xenditProvider } = await loadXendit()
    const result = await xenditProvider.verifyWebhook(paidPayload, CALLBACK_TOKEN)
    expect(result).toEqual({
      bookingId: 'hold-token-abc',
      status: 'paid',
      guestEmail: 'jane@example.com',
      guestName: undefined,
      paymentIntentId: 'inv_1',
    })
  })

  it('rejects a callback with the wrong token', async () => {
    const { xenditProvider } = await loadXendit()
    expect(
      await xenditProvider.verifyWebhook(paidPayload, 'wrong-token')
    ).toBeNull()
  })

  it('rejects a callback when no token is configured', async () => {
    vi.resetModules()
    vi.stubEnv('XENDIT_SECRET_KEY', SECRET)
    vi.stubEnv('XENDIT_CALLBACK_TOKEN', '')
    const { xenditProvider } = await import('../xendit')
    expect(
      await xenditProvider.verifyWebhook(paidPayload, CALLBACK_TOKEN)
    ).toBeNull()
  })

  it.each(['PENDING', 'EXPIRED', 'SETTLED'])(
    'ignores non-PAID status "%s"',
    async (status) => {
      const { xenditProvider } = await loadXendit()
      const payload = JSON.stringify({
        id: 'inv_1',
        external_id: 'hold-token-abc',
        status,
      })
      expect(
        await xenditProvider.verifyWebhook(payload, CALLBACK_TOKEN)
      ).toBeNull()
    }
  )

  it('rejects payloads without external_id', async () => {
    const { xenditProvider } = await loadXendit()
    const payload = JSON.stringify({ id: 'inv_1', status: 'PAID' })
    expect(
      await xenditProvider.verifyWebhook(payload, CALLBACK_TOKEN)
    ).toBeNull()
  })

  it('rejects malformed JSON', async () => {
    const { xenditProvider } = await loadXendit()
    expect(
      await xenditProvider.verifyWebhook('not-json{', CALLBACK_TOKEN)
    ).toBeNull()
  })
})
