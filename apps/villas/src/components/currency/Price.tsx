'use client'

import { formatApprox, formatIdr } from '@/lib/currency'
import { useCurrency } from './CurrencyProvider'
import { cn } from '@/lib/utils/cn'

interface PriceProps {
  amountIdr: number
  suffix?: string
  className?: string
  approxClassName?: string
}

export function Price({ amountIdr, suffix, className, approxClassName }: PriceProps) {
  const { display, rates } = useCurrency()

  return (
    <span className={className}>
      {formatIdr(amountIdr)}
      {suffix && <span className="opacity-70"> {suffix}</span>}
      {display !== 'IDR' && (
        <span className={cn('block text-[0.7em] font-normal opacity-60', approxClassName)}>
          &asymp; {formatApprox(amountIdr, display, rates)}
        </span>
      )}
    </span>
  )
}
