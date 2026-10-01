'use client'

import { type DisplayCurrency } from '@/lib/currency'
import { useCurrency } from './CurrencyProvider'
import { cn } from '@/lib/utils/cn'

const OPTIONS: DisplayCurrency[] = ['IDR', 'USD', 'AUD']

export function CurrencySwitcher({ dark }: { dark?: boolean }) {
  const { display, setDisplay } = useCurrency()

  return (
    <div
      role="group"
      aria-label="Currency"
      className={cn(
        'flex items-center gap-0.5 rounded-full border p-0.5 text-[11px] font-medium',
        dark ? 'border-alabaster/25 text-alabaster/80' : 'border-gunmetal/15 text-gunmetal/70'
      )}
    >
      {OPTIONS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setDisplay(c)}
          aria-pressed={display === c}
          className={cn(
            'rounded-full px-2 py-0.5 transition-colors',
            display === c
              ? 'bg-blue-green text-alabaster'
              : dark
                ? 'hover:bg-alabaster/10'
                : 'hover:bg-gunmetal/5'
          )}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
