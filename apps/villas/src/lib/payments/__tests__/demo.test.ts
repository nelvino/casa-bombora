import { describe, it, expect } from 'vitest'
import { demoProvider } from '../demo'

describe('demoProvider', () => {
  it('creates a session pointing at the demo-pay page', async () => {
    const result = await demoProvider.createSession({
      villa: { name: 'Villa Teduh', slug: 'villa-teduh' },
      booking: { id: 'h1', token: 'tok_1' },
      amountIdr: 2900000,
      successUrl: 'https://x.co/ok',
      cancelUrl: 'https://x.co/no',
    })

    expect(result.sessionId).toBe('demo_session_tok_1')
    expect(result.url).toBe(
      '/villa/villa-teduh/book/demo-pay?token=tok_1'
    )
  })

  it('always verifies as paid (demo only)', async () => {
    const result = await demoProvider.verifyWebhook('{}', '')
    expect(result?.status).toBe('paid')
  })
})
