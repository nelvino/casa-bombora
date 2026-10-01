import { describe, it, expect } from 'vitest'
import { formatIdr, formatApprox, FALLBACK_IDR_RATES } from '../currency'

describe('formatIdr', () => {
  it('formats whole rupiah with thousand separators', () => {
    expect(formatIdr(2900000)).toBe('IDR 2,900,000')
    expect(formatIdr(0)).toBe('IDR 0')
  })
})

describe('formatApprox', () => {
  it('returns IDR formatted when currency is IDR', () => {
    expect(formatApprox(2900000, 'IDR')).toBe('IDR 2,900,000')
  })

  it('converts to USD with US$ symbol', () => {
    expect(formatApprox(FALLBACK_IDR_RATES.USD, 'USD')).toBe('US$1')
    expect(formatApprox(2900000, 'USD')).toMatch(/^US\$\d+$/)
  })

  it('converts to AUD with A$ symbol', () => {
    expect(formatApprox(FALLBACK_IDR_RATES.AUD, 'AUD')).toBe('A$1')
  })
})
