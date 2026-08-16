import { describe, it, expect } from 'vitest'
import { format } from 'date-fns'
import {
  isRangeAvailable,
  nightsBetween,
  calculateTotal,
  generateNights,
} from '../availability'

const night = (iso: string) => new Date(`${iso}T00:00:00`)

describe('isRangeAvailable', () => {
  it('returns true when no blockers overlap', () => {
    const checkIn = night('2025-06-01')
    const checkOut = night('2025-06-04')
    const blocked = [night('2025-06-10'), night('2025-06-11')]
    expect(isRangeAvailable(blocked, checkIn, checkOut)).toBe(true)
  })

  it('returns false when one blocked date is inside the range', () => {
    const checkIn = night('2025-06-01')
    const checkOut = night('2025-06-05')
    const blocked = [night('2025-06-03')]
    expect(isRangeAvailable(blocked, checkIn, checkOut)).toBe(false)
  })
})

describe('nightsBetween', () => {
  it('counts exact start/end difference', () => {
    expect(nightsBetween(night('2025-06-01'), night('2025-06-04'))).toBe(3)
    expect(nightsBetween(night('2025-06-01'), night('2025-06-01'))).toBe(0)
  })
})

describe('calculateTotal', () => {
  it('returns subtotal, discount and total with a 10% discount', () => {
    const result = calculateTotal(3, 10000, 10)
    expect(result.subtotal).toBe(30000)
    expect(result.discount).toBe(3000)
    expect(result.total).toBe(27000)
  })

  it('handles 0% discount', () => {
    const result = calculateTotal(5, 20000, 0)
    expect(result.discount).toBe(0)
    expect(result.total).toBe(100000)
  })

  it('handles 100% discount', () => {
    const result = calculateTotal(2, 15000, 100)
    expect(result.discount).toBe(30000)
    expect(result.total).toBe(0)
  })
})

describe('generateNights', () => {
  it('generates the correct nights for a range', () => {
    const nights = generateNights(night('2025-06-01'), night('2025-06-04'))
    expect(nights).toHaveLength(3)
    expect(format(nights[0], 'yyyy-MM-dd')).toBe('2025-06-01')
    expect(format(nights[2], 'yyyy-MM-dd')).toBe('2025-06-03')
  })
})
