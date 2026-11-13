export const CONTACT_EMAIL = 'info@casabombora.com'
export const WHATSAPP_NUMBER = '61415164208'

// V1: browse-only site — bookings are taken over WhatsApp.
// Flip to true when the booking engine + payments go live (V2).
export const BOOKING_ENGINE_LIVE = false

export function whatsappLink(message: string): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
    message
  )}`
}

export function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
