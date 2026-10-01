'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { FALLBACK_IDR_RATES, type DisplayCurrency } from '@/lib/currency'

type Rates = typeof FALLBACK_IDR_RATES

interface CurrencyContextValue {
  display: DisplayCurrency
  setDisplay: (c: DisplayCurrency) => void
  rates: Rates
}

const CurrencyContext = createContext<CurrencyContextValue>({
  display: 'IDR',
  setDisplay: () => {},
  rates: FALLBACK_IDR_RATES,
})

const STORAGE_KEY = 'cb-currency'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [display, setDisplayState] = useState<DisplayCurrency>('IDR')
  const [rates, setRates] = useState<Rates>(FALLBACK_IDR_RATES)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'IDR' || saved === 'USD' || saved === 'AUD') {
      setDisplayState(saved)
    }

    async function loadRates() {
      try {
        const res = await fetch(
          'https://api.frankfurter.dev/v1/latest?base=IDR&symbols=USD,AUD'
        )
        const data = await res.json()
        const usd = data?.rates?.USD
        const aud = data?.rates?.AUD
        if (usd && aud) {
          setRates({ USD: 1 / usd, AUD: 1 / aud })
          return
        }
        throw new Error('bad rate payload')
      } catch {
        try {
          const res = await fetch('https://open.er-api.com/v6/latest/IDR')
          const data = await res.json()
          const usd = data?.rates?.USD
          const aud = data?.rates?.AUD
          if (usd && aud) setRates({ USD: 1 / usd, AUD: 1 / aud })
        } catch {
          // Keep static fallback rates.
        }
      }
    }

    loadRates()
  }, [])

  const setDisplay = (c: DisplayCurrency) => {
    setDisplayState(c)
    try {
      localStorage.setItem(STORAGE_KEY, c)
    } catch {}
  }

  return (
    <CurrencyContext.Provider value={{ display, setDisplay, rates }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
