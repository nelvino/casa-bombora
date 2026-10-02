// HTML email templates. Copy lives here — edit these functions to change
// wording; table-based layout + inline styles for maximum email-client support.
//
// Brand: gunmetal #1D2632, blue-green #009CBC, lion #BF9880, alabaster #EEEAE0.
// Fonts: custom web fonts (Playfair/Inter) aren't reliable in email clients —
// Georgia stands in for the serif headings, Helvetica/Arial for body text.
import { formatIdr } from '@/lib/currency'

const BRAND = {
  name: 'Casa Bombora Villas',
  site: 'https://stay.casabombora.com',
  email: 'info@casabombora.com',
  gunmetal: '#1D2632',
  blueGreen: '#009CBC',
  lion: '#BF9880',
  alabaster: '#EEEAE0',
  muted: '#8a8578',
  serif: "Georgia,'Times New Roman',serif",
  sans: 'Helvetica,Arial,sans-serif',
}

export interface BookingEmailData {
  guestName: string
  villaName: string
  checkIn: string // yyyy-mm-dd
  checkOut: string
  nights?: number
  totalIdr?: number
  reference?: string // hold token or booking id
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.alabaster};font-family:${BRAND.sans};color:${BRAND.gunmetal};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.alabaster};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr><td style="background:${BRAND.gunmetal};padding:24px 28px;" align="center">
            <img src="${BRAND.site}/apple-icon.png" width="40" height="40" alt="Casa Bombora" style="display:block;margin:0 auto 10px;border-radius:10px;" />
            <span style="font-family:${BRAND.serif};font-size:20px;letter-spacing:2.5px;color:${BRAND.alabaster};text-transform:uppercase;">Casa Bombora</span><br />
            <span style="font-family:${BRAND.sans};font-size:10px;letter-spacing:3px;color:${BRAND.lion};text-transform:uppercase;">Villas &middot; Uluwatu &middot; Bali</span>
          </td></tr>
          <tr><td style="padding:36px 32px 28px;">
            <h1 style="font-family:${BRAND.serif};font-size:24px;margin:0 0 18px;font-weight:normal;color:${BRAND.gunmetal};">${title}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:20px 32px;border-top:1px solid ${BRAND.alabaster};font-family:${BRAND.sans};font-size:12px;line-height:1.6;color:${BRAND.muted};">
            Casa Bombora Villas &middot; Pecatu, Uluwatu, Bali<br />
            <a href="${BRAND.site}" style="color:${BRAND.blueGreen};text-decoration:none;">stay.casabombora.com</a> &middot; <a href="mailto:${BRAND.email}" style="color:${BRAND.blueGreen};text-decoration:none;">${BRAND.email}</a>
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
  if (d.reference) rows.push(['Reference', d.reference])

  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 20px 7px 0;font-family:${BRAND.sans};font-size:13px;color:${BRAND.muted};vertical-align:top;">${k}</td><td style="padding:7px 0;font-family:${BRAND.sans};font-size:14px;color:${BRAND.gunmetal};">${v}</td></tr>`
    )
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;background:${BRAND.alabaster};border-radius:10px;padding:12px 18px;" width="100%">${trs}</table>`
}

const p = (text: string) =>
  `<p style="font-family:${BRAND.sans};font-size:14px;line-height:1.7;margin:0 0 16px;color:${BRAND.gunmetal};">${text}</p>`

const link = (href: string, text: string) =>
  `<a href="${href}" style="color:${BRAND.blueGreen};">${text}</a>`

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
      p(`<strong>${d.guestName}</strong> (${link(`mailto:${d.guestEmail}`, d.guestEmail)}) requested the following stay. A 72-hour hold is active — confirm or release it in the ${link(`${BRAND.site}/admin`, 'admin dashboard')}.`) +
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
        p(`Check-in is from 3pm. Need an airport pickup, scooter, or anything else arranged? Just reply to this email.`)
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

export function holdDeclinedGuest(d: BookingEmailData) {
  return {
    subject: `Your booking request — ${d.villaName}`,
    html: layout(
      `Sorry, ${d.guestName} — those dates aren't available`,
      p(`Unfortunately we can't accommodate <strong>${d.villaName}</strong> for ${d.checkIn} → ${d.checkOut} — the hold has been released.`) +
        p(`If your dates are flexible, reply to this email or ${link(`${BRAND.site}/#villas`, 'browse the villas')} and we'll find you an alternative that works.`)
    ),
  }
}
