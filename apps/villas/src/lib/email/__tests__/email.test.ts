import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendEmail, adminEmail, alertAdmin } from '../send'
import {
  bookingRequestGuest,
  bookingRequestAdmin,
  bookingConfirmedGuest,
  bookingCancelledGuest,
  holdDeclinedGuest,
} from '../templates'

const data = {
  guestName: 'Jane Doe',
  guestEmail: 'jane@example.com',
  villaName: 'Villa Teduh',
  checkIn: '2026-12-01',
  checkOut: '2026-12-05',
  nights: 4,
  totalIdr: 11600000,
  reference: 'ref_123',
}

beforeEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('sendEmail', () => {
  it('skips sending when RESEND_API_KEY is not set', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const ok = await sendEmail({ to: 'a@b.co', subject: 'hi', html: '<p>x</p>' })
    expect(ok).toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('posts to the Resend API with the key when configured', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('EMAIL_FROM', 'Casa Bombora <bookings@casabombora.com>')
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"id":"e1"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const ok = await sendEmail({
      to: 'guest@x.co',
      subject: 'Booking confirmed',
      html: '<p>hi</p>',
    })

    expect(ok).toBe(true)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(init.headers.Authorization).toBe('Bearer re_test')
    const body = JSON.parse(init.body)
    expect(body.from).toBe('Casa Bombora <bookings@casabombora.com>')
    expect(body.to).toBe('guest@x.co')
  })

  it('returns false (does not throw) when the API errors', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('bad', { status: 422 }))
    )
    const ok = await sendEmail({ to: 'x', subject: 's', html: 'h' })
    expect(ok).toBe(false)
  })

  it('returns false (does not throw) on network failure', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const ok = await sendEmail({ to: 'x', subject: 's', html: 'h' })
    expect(ok).toBe(false)
  })

  it('retries once on a 5xx and succeeds', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('err', { status: 500 }))
      .mockResolvedValueOnce(new Response('{"id":"e2"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const ok = await sendEmail({ to: 'x', subject: 's', html: 'h' })
    expect(ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry a permanent 4xx failure', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('bad key', { status: 401 }))
    vi.stubGlobal('fetch', fetchMock)

    const ok = await sendEmail({ to: 'x', subject: 's', html: 'h' })
    expect(ok).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('alertAdmin', () => {
  it('emails the admin inbox with an alert subject', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('ADMIN_EMAIL', 'ops@casabombora.com')
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"id":"e3"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await alertAdmin('Enquiry submission failed', 'Villa: villa-teduh')

    const [, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(init.body)
    expect(body.to).toBe('ops@casabombora.com')
    expect(body.subject).toBe('[Casa Bombora alert] Enquiry submission failed')
    expect(body.html).toContain('Villa: villa-teduh')
  })

  it('redacts database URLs and escapes HTML in the detail', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"id":"e4"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await alertAdmin(
      'DB error',
      'connect postgresql://user:secret@host:5432/db failed <script>'
    )

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.html).not.toContain('secret@host')
    expect(body.html).toContain('[database-url-redacted]')
    expect(body.html).not.toContain('<script>')
  })

  it('does not throw when sending fails', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    await expect(alertAdmin('x', 'y')).resolves.toBeUndefined()
  })
})

describe('adminEmail', () => {
  it('defaults to the shared inbox', () => {
    expect(adminEmail()).toBe('info@casabombora.com')
  })

  it('uses ADMIN_EMAIL when set', () => {
    vi.stubEnv('ADMIN_EMAIL', 'ops@casabombora.com')
    expect(adminEmail()).toBe('ops@casabombora.com')
  })
})

describe('templates', () => {
  it.each([
    ['bookingRequestGuest', bookingRequestGuest(data)],
    ['bookingRequestAdmin', bookingRequestAdmin(data)],
    ['bookingConfirmedGuest', bookingConfirmedGuest(data)],
    ['bookingCancelledGuest', bookingCancelledGuest(data)],
    ['holdDeclinedGuest', holdDeclinedGuest(data)],
  ])('%s produces a subject and branded html', (_name, tpl) => {
    expect(tpl.subject.length).toBeGreaterThan(5)
    expect(tpl.html).toContain('Casa Bombora')
    expect(tpl.html).toContain(data.villaName)
  })

  it('guest request email includes the totals and reference', () => {
    const { html } = bookingRequestGuest(data)
    expect(html).toContain('IDR 11,600,000')
    expect(html).toContain('ref_123')
    expect(html).toContain('2026-12-01')
  })
})
