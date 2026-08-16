import { calculateTotal } from '@/lib/booking/availability'

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

interface PriceBreakdownProps {
  nights: number
  pricePerNightCents: number
  discountPercent?: number
  showNightly?: boolean
}

export function PriceBreakdown({
  nights,
  pricePerNightCents,
  discountPercent = 0,
  showNightly = false,
}: PriceBreakdownProps) {
  const { subtotal, discount, total } = calculateTotal(nights, pricePerNightCents, discountPercent)

  return (
    <div className="space-y-3 text-sm">
      {showNightly && (
        <div className="flex justify-between text-gunmetal/70">
          <span>Nightly rate</span>
          <span>{formatCents(pricePerNightCents)}</span>
        </div>
      )}
      <div className="flex justify-between text-gunmetal/70">
        <span>
          {formatCents(pricePerNightCents)} &times; {nights} nights
        </span>
        <span>{formatCents(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-blue-green">
          <span>Discount ({discountPercent}%)</span>
          <span>-{formatCents(discount)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-gunmetal/10 pt-3 font-serif text-lg text-gunmetal">
        <span>Total</span>
        <span>{formatCents(total)}</span>
      </div>
    </div>
  )
}
