// Prices are stored and charged in IDR (Indonesian regulation requires
// advertising in local currency). USD/AUD are approximate display
// conversions only — guests are always billed in IDR and their card
// handles the conversion.
export type DisplayCurrency = 'IDR' | 'USD' | 'AUD'

// Fallback rates (IDR per 1 unit). Live rates are fetched client-side.
export const FALLBACK_IDR_RATES: Record<Exclude<DisplayCurrency, 'IDR'>, number> = {
  USD: 16200,
  AUD: 10600,
}

export function formatIdr(rupiah: number): string {
  return `IDR ${rupiah.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function formatApprox(
  rupiah: number,
  currency: DisplayCurrency,
  rates = FALLBACK_IDR_RATES
): string {
  if (currency === 'IDR') return formatIdr(rupiah)
  const converted = rupiah / rates[currency]
  const symbol = currency === 'AUD' ? 'A$' : 'US$'
  return `${symbol}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}
