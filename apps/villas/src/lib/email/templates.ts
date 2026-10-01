// HTML email templates. Copy lives here — edit these functions to change
// wording; table-based layout + inline styles for maximum email-client support.
import { formatIdr } from '@/lib/currency'

const BRAND = {
  name: 'Casa Bombora Villas',
  site: 'https://stay.casabombora.com',
  email: 'info@casabombora.com',
  gunmetal: '#26413c',
  lion: '#a4763a',
  alabaster: '#f7f5f0',
}

export interface BookingEmailData {
  guestName: string
  villaName: string
  checkIn: string // yyyy-mm-dd
  checkOut: string
  nights?: number
  totalIdr?: number
  reference: string // hold token or booking id
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.alabaster};font-family:Georgia,'Times New Roman',serif;color:${BRAND.gunmetal};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.alabaster};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="background:${BRAND.gunmetal};padding:20px 28px;">
            <span style="font-family:Georgia,serif;font-size:18px;letter-spacing:2px;color:${BRAND.alabaster};text-transform:uppercase;">Casa Bombora</span>
          </td></tr>
          <tr><td style="padding:32px 28px;">
            <h1 style="font-size:22px;margin:0 0 16px;font-weight:normal;">${title}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:20px 28px;border-top:1px solid #eee;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#888;">
            Casa Bombora Villas · Pecatu, Uluwatu, Bali · <a href="${BRAND.site}" style="color:${BRAND.lion};">stay.casabombora.com</a> · <a href="mailto:${BRAND.email}" style="color:${BRAND.lion};">${BRAND.email}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

function detailsTable(d: BookingEmailData): string {
  const rows: Array<[string, string]> = [
    ['Villa', d.villaName],
    ['Check-in', d.checkIn],
    ['Check-out', d.checkOut],
  ]
  if (d.nights) rows.push(['Nights', String(d.nights)])
  if (d.totalIdr) rows.push(['Total', formatIdr(d.totalIdr)])
  rows.push(['Reference', d.reference])

  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#888;vertical-align:top;">${k}</td><td style="padding:6px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;">${v}</td></tr>`
    )
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">${trs}</table>`
}

const p = (text: string) =>
  `<p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;margin:0 0 14px;">${text}</p>`

export function bookingRequestGuest(d: BookingEmailData) {
  return {
    subject: `We received your booking request — ${d.villaName}`,
    html: layout(
      `Thanks, ${d.guestName} — we've got your request`,
      p(`Your dates at <strong>${d.villaName}</strong> are held for 72 hours while we confirm availability on our side.`) +
        detailsTable(d) +
        p(`We'll reply within 24 hours to confirm your stay and arrange payment. If anything looks wrong, just reply to this email.`)
    ),
  }
}

export function bookingRequestAdmin(d: BookingEmailData & { guestEmail: string }) {
  return {
    subject: `New booking enquiry — ${d.villaName} (${d.checkIn} → ${d.checkOut})`,
    html: layout(
      'New booking enquiry',
      p(`<strong>${d.guestName}</strong> (<a href="mailto:${d.guestEmail}" style="color:${BRAND.lion};">${d.guestEmail}</a>) requested the following stay. A 72-hour hold is active — confirm or release it in the <a href="${BRAND.site}/admin" style="color:${BRAND.lion};">admin dashboard</a>.`) +
        detailsTable(d)
    ),
  }
}

export function bookingConfirmedGuest(d: BookingEmailData) {
  return {
    subject: `Booking confirmed — ${d.villaName}`,
    html: layout(
      `You're booked, ${d.guestName}`,
      p(`Great news — your stay at <strong>${d.villaName}</strong> is confirmed. We can't wait to host you in Uluwatu.`) +
        detailsTable(d) +
        p(`Check-in is from 2pm. Need an airport pickup, scooter, or anything else arranged? Just reply to this email.`)
    ),
  }
}

export function bookingCancelledGuest(d: BookingEmailData) {
  return {
    subject: `Booking cancelled — ${d.villaName}`,
    html: layout(
      `Your booking was cancelled`,
      p(`Hi ${d.guestName} — your booking at <strong>${d.villaName}</strong> (${d.checkIn} → ${d.checkOut}) has been cancelled.`) +
        p(`If this wasn't expected, or you'd like to rebook other dates, reply to this email and we'll sort it out.`)
    ),
  }
}
