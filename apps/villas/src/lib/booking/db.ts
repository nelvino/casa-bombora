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

export async function createHold(input: {
  villaId: string
  checkIn: Date
  checkOut: Date
  token: string
  expiresAt: Date
}): Promise<Hold> {
  return prisma.hold.create({
    data: {
      villaId: input.villaId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      token: input.token,
      expiresAt: input.expiresAt,
    },
  })
}

export async function getActiveHolds(
  villaId: string,
  from: Date,
  to: Date
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
    },
  })
}

export async function releaseHoldByToken(token: string): Promise<void> {
  await prisma.hold.updateMany({
    where: { token },
    data: { status: 'RELEASED' },
  })
}

export async function convertHoldToBooking(
  holdId: string,
  guest: { name: string; email: string },
  paymentIntentId?: string
): Promise<Booking> {
  const hold = await prisma.hold.findUnique({
    where: { id: holdId },
    include: { villa: true },
  })

  if (!hold) {
    throw new Error('Hold not found')
  }

  const nights = nightsBetween(hold.checkIn, hold.checkOut)
  const { total } = calculateTotal(nights, hold.villa.pricePerNight)

  const [booking] = await prisma.$transaction([
    prisma.booking.create({
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
    }),
    prisma.hold.update({
      where: { id: hold.id },
      data: { status: 'CONVERTED' },
    }),
  ])

  return booking
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
  checkOut: Date
): Promise<boolean> {
  const [blocked, holds] = await Promise.all([
    getBlockedDates(villaId, checkIn, checkOut),
    getActiveHolds(villaId, checkIn, checkOut),
  ])

  const blockedNights = blocked.map((b) => b.date)
  const holdNights = holds.flatMap((h) => generateNights(h.checkIn, h.checkOut))

  return isRangeAvailable([...blockedNights, ...holdNights], checkIn, checkOut)
}
