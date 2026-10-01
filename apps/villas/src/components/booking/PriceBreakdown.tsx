import { calculateTotal } from '@/lib/booking/availability'
import { formatIdr } from '@/lib/currency'

interface PriceBreakdownProps {
  nights: number
  pricePerNightIdr: number
  discountPercent?: number
  showNightly?: boolean
}

export function PriceBreakdown({
  nights,
  pricePerNightIdr,
  discountPercent = 0,
  showNightly = false,
}: PriceBreakdownProps) {
  const { subtotal, discount, total } = calculateTotal(nights, pricePerNightIdr, discountPercent)

  return (
    <div className="space-y-3 text-sm">
      {showNightly && (
        <div className="flex justify-between text-gunmetal/70">
          <span>Nightly rate</span>
          <span>{formatIdr(pricePerNightIdr)}</span>
        </div>
      )}
      <div className="flex justify-between text-gunmetal/70">
        <span>
          {formatIdr(pricePerNightIdr)} &times; {nights} nights
        </span>
        <span>{formatIdr(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-blue-green">
          <span>Discount ({discountPercent}%)</span>
          <span>-{formatIdr(discount)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-gunmetal/10 pt-3 font-serif text-lg text-gunmetal">
        <span>Total</span>
        <span>{formatIdr(total)}</span>
      </div>
    </div>
  )
}
