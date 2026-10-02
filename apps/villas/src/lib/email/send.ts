// Transactional email via Resend (https://resend.com) — plain HTTPS API, no
// SDK needed. Free tier covers our volume easily (3,000 emails/month).
//
// Env vars:
//   RESEND_API_KEY  — API key from the Resend dashboard
//   EMAIL_FROM      — verified sender, e.g. 'Casa Bombora <bookings@casabombora.com>'
//   ADMIN_EMAIL     — where enquiry alerts go (defaults to CONTACT_EMAIL)
//
// When RESEND_API_KEY is unset (local dev), emails are logged to the console
// and skipped — sending never throws, so email problems can't break a booking.

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export interface EmailMessage {
  to: string
  subject: string
  html: string
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const from =
    process.env.EMAIL_FROM ?? 'Casa Bombora Villas <bookings@casabombora.com>'

  if (!apiKey) {
    console.log(
      `[email skipped — RESEND_API_KEY not set] To: ${message.to} | Subject: ${message.subject}`
    )
    return false
  }

  // One retry for transient failures (network error or Resend 5xx); 4xx is
  // permanent (bad key, unverified sender) so it returns immediately.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: message.to,
          subject: message.subject,
          html: message.html,
        }),
      })

      if (res.ok) return true
      console.error(`[email] Resend returned ${res.status} for "${message.subject}"`)
      if (res.status < 500) return false
    } catch (error) {
      console.error('[email] send failed:', error)
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 800))
  }
  return false
}

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL ?? 'info@casabombora.com'
}

// Operational alert to the admin inbox for failures the guest never sees —
// a lost enquiry, a failed payment session, a webhook conversion error.
// Never throws: alerting must not break the code path that failed.
export async function alertAdmin(
  subject: string,
  detail: string
): Promise<void> {
  // Error text can embed connection strings or quoted input — redact
  // credential URLs and HTML-escape before mailing.
  const safe = detail
    .replace(/postgres(ql)?:\/\/\S+/g, '[database-url-redacted]')
    .replace(/[<>&]/g, (c) => `&#${c.charCodeAt(0)};`)
    .slice(0, 2000)

  await sendEmail({
    to: adminEmail(),
    subject: `[Casa Bombora alert] ${subject}`,
    html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;color:#1D2632">
      <h2 style="margin:0 0 8px">${subject}</h2>
      <p style="color:#777;font-size:13px">${new Date().toISOString()}</p>
      <pre style="background:#EEEAE0;padding:14px;border-radius:8px;white-space:pre-wrap;font-size:13px">${safe}</pre>
    </div>`,
  })
}
