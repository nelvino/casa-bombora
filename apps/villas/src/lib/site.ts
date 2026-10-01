export const CONTACT_EMAIL = 'info@casabombora.com'
export const WHATSAPP_NUMBER = '61415164208'

export function whatsappLink(message: string): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
    message
  )}`
}
