import type { BlockedDate, Booking, Hold, PromoCode } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import {
  generateNights,
  isRangeAvailable,
  nightsBetween,
  calculateTotal,
} from './availability'

export async function getBlockedDates(
  villaId: string,
  from: Date,
  to: Date
): Promise<BlockedDate[]> {
  return prisma.blockedDate.findMany({
    where: {
      villaId,
      date: {
        gte: from,
        lt: to,
      },
    },
  })
}

export async function getBookedDates(
  villaId: string,
  from: Date,
  to: Date
): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: {
      villaId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      checkIn: {
        lt: to,
      },
      checkOut: {
        gt: from,
      },
    },
  })
}

export async function createHold(input: {
  villaId: string
  checkIn: Date
  checkOut: Date
  token: string
  expiresAt: Date
  guestName?: string
  guestEmail?: string
}): Promise<Hold> {
  return prisma.hold.create({
    data: {
      villaId: input.villaId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      token: input.token,
      expiresAt: input.expiresAt,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
    },
  })
}

export async function getActiveHolds(
  villaId: string,
  from: Date,
  to: Date,
  excludeHoldId?: string
): Promise<Hold[]> {
  return prisma.hold.findMany({
    where: {
      villaId,
      status: 'ACTIVE',
      expiresAt: {
        gt: new Date(),
      },
      checkIn: {
        lt: to,
      },
      checkOut: {
        gt: from,
      },
      ...(excludeHoldId ? { id: { not: excludeHoldId } } : {}),
    },
  })
}

export async function releaseHoldByToken(token: string): Promise<void> {
  await prisma.hold.updateMany({
    where: { token },
    data: { status: 'RELEASED' },
  })
}

// holdToken is the opaque token shared with payment providers (external_id /
// client_reference_id). Never expose internal ids to webhooks.
export async function convertHoldToBooking(
  holdToken: string,
  guest: { name: string; email: string },
  paymentIntentId?: string,
  options?: { requireAvailable?: boolean }
): Promise<Booking> {
  const hold = await prisma.hold.findUnique({
    where: { token: holdToken },
    include: { villa: true },
  })

  if (!hold) {
    throw new Error('Hold not found')
  }

  // Atomic claim: flip ACTIVE -> CONVERTED exactly once. A duplicate webhook
  // or double-click loses the race (count === 0) and falls through to
  // returning the already-created booking instead of double-booking.
  const claimed = await prisma.hold.updateMany({
    where: { id: hold.id, status: 'ACTIVE' },
    data: { status: 'CONVERTED' },
  })

  if (claimed.count === 0) {
    const existing = await prisma.booking.findFirst({
      where: {
        villaId: hold.villaId,
        checkIn: hold.checkIn,
        checkOut: hold.checkOut,
      },
      orderBy: { createdAt: 'desc' },
    })
    if (existing) return existing
    throw new Error('Hold is no longer active')
  }

  if (options?.requireAvailable) {
    const stillAvailable = await isDateRangeAvailableForVilla(
      hold.villaId,
      hold.checkIn,
      hold.checkOut,
      hold.id
    )
    if (!stillAvailable) {
      await prisma.hold.update({
        where: { id: hold.id },
        data: { status: 'RELEASED' },
      })
      throw new Error('Dates are no longer available')
    }
  }

  const nights = nightsBetween(hold.checkIn, hold.checkOut)
  const { total } = calculateTotal(nights, hold.villa.pricePerNight)

  try {
    return await prisma.booking.create({
      data: {
        villaId: hold.villaId,
        checkIn: hold.checkIn,
        checkOut: hold.checkOut,
        guestEmail: guest.email,
        guestName: guest.name,
        totalAmount: total,
        status: 'PENDING',
        paymentStatus: paymentIntentId ? 'PAID' : 'UNPAID',
        paymentIntentId,
      },
    })
  } catch (error) {
    await prisma.hold.update({
      where: { id: hold.id },
      data: { status: 'ACTIVE' },
    })
    throw error
  }
}

export async function validatePromoCode(
  code: string
): Promise<PromoCode | null> {
  if (!code) return null

  const promo = await prisma.promoCode.findUnique({
    where: { code },
  })

  if (!promo || !promo.isActive) return null

  const now = new Date()
  if (promo.validFrom && now < promo.validFrom) return null
  if (promo.validTo && now > promo.validTo) return null
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) return null

  return promo
}

export async function isDateRangeAvailableForVilla(
  villaId: string,
  checkIn: Date,
  checkOut: Date,
  excludeHoldId?: string
): Promise<boolean> {
  const [blocked, holds, bookings] = await Promise.all([
    getBlockedDates(villaId, checkIn, checkOut),
    getActiveHolds(villaId, checkIn, checkOut, excludeHoldId),
    getBookedDates(villaId, checkIn, checkOut),
  ])

  const blockedNights = blocked.map((b) => b.date)
  const holdNights = holds.flatMap((h) => generateNights(h.checkIn, h.checkOut))
  const bookedNights = bookings.flatMap((b) =>
    generateNights(b.checkIn, b.checkOut)
  )

  return isRangeAvailable(
    [...blockedNights, ...holdNights, ...bookedNights],
    checkIn,
    checkOut
  )
}
