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

    if (!res.ok) {
      console.error(`[email] Resend returned ${res.status} for "${message.subject}"`)
      return false
    }
    return true
  } catch (error) {
    console.error('[email] send failed:', error)
    return false
  }
}

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL ?? 'info@casabombora.com'
}
