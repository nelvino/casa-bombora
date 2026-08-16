import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
} from 'date-fns'

export function isRangeAvailable(
  blockedDates: Date[],
  checkIn: Date,
  checkOut: Date
): boolean {
  const blockedSet = new Set(blockedDates.map((d) => d.toDateString()))
  const nights = generateNights(checkIn, checkOut)
  return !nights.some((night) => blockedSet.has(night.toDateString()))
}

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  return differenceInCalendarDays(checkOut, checkIn)
}

export function calculateTotal(
  nights: number,
  pricePerNightCents: number,
  discountPercent: number = 0
): { subtotal: number; discount: number; total: number } {
  const rawSubtotal = nights * pricePerNightCents
  const clampedDiscount = Math.max(0, Math.min(100, discountPercent))
  const discount = Math.round(rawSubtotal * (clampedDiscount / 100))
  const total = rawSubtotal - discount
  return { subtotal: rawSubtotal, discount, total }
}

export function generateNights(start: Date, endExclusive: Date): Date[] {
  if (endExclusive <= start) return []
  return eachDayOfInterval({
    start,
    end: addDays(endExclusive, -1),
  })
}
