'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { addMinutes, format } from 'date-fns'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { VILLAS } from '@/lib/data/villas'
import {
  calculateTotal,
  nightsBetween,
} from '@/lib/booking/availability'
import {
  isDateRangeAvailableForVilla,
  createHold,
  validatePromoCode,
  getActiveHolds,
  convertHoldToBooking,
} from '@/lib/booking/db'
import { generateNights } from '@/lib/booking/availability'
import { getPaymentProvider } from '@/lib/payments'

const dateString = z.coerce.date().refine((d) => !isNaN(d.getTime()), {
  message: 'Invalid date',
})

const availabilitySchema = z.object({
  from: dateString,
  to: dateString,
})

const holdSchema = z.object({
  slug: z.string().min(1),
  checkIn: dateString,
  checkOut: dateString,
  promoCode: z.string().optional(),
  guestName: z.string().min(1).optional(),
  guestEmail: z.string().email().optional(),
})

const paymentSchema = z.object({
  slug: z.string().min(1),
  token: z.string().min(1),
  amount: z.coerce.number().int().positive(),
  guestName: z.string().min(1).optional(),
  guestEmail: z.string().email().optional(),
})

const confirmSchema = z.object({
  token: z.string().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
})

async function getOrCreateVillaBySlug(slug: string) {
  let villa = await prisma.villa.findUnique({
    where: { slug },
  })

  if (!villa) {
    const fallback = VILLAS.find((v) => v.slug === slug)
    if (!fallback) return null

    villa = await prisma.villa.create({
      data: {
        slug: fallback.slug,
        name: fallback.name,
        tagline: fallback.tagline,
        description: fallback.description,
        location: fallback.location,
        bedrooms: fallback.bedrooms,
        bathrooms: fallback.bathrooms,
        maxGuests: fallback.maxGuests,
        pricePerNight: fallback.pricePerNight,
      },
    })
  }

  return villa
}

export async function getAvailability(
  slug: string,
  from: string,
  to: string
) {
  const parsed = availabilitySchema.safeParse({ from, to })
  if (!parsed.success) {
    return { ok: false, error: 'Invalid date range', blockedDates: [] as string[] }
  }

  const { from: fromDate, to: toDate } = parsed.data

  const dbVilla = await prisma.villa.findUnique({
    where: { slug },
    include: {
      blockedDates: {
        where: {
          date: {
            gte: fromDate,
            lt: toDate,
          },
        },
      },
    },
  })

  const fallback = VILLAS.find((v) => v.slug === slug)
  if (!dbVilla && !fallback) {
    return { ok: false, error: 'Villa not found', blockedDates: [] as string[] }
  }

  const villa = dbVilla ?? fallback!
  const blocked = (dbVilla?.blockedDates ?? []).map((b) =>
    format(b.date, 'yyyy-MM-dd')
  )

  const holds = dbVilla
    ? await getActiveHolds(dbVilla.id, fromDate, toDate)
    : []
  const holdDates = holds
    .flatMap((h) => generateNights(h.checkIn, h.checkOut))
    .map((d) => format(d, 'yyyy-MM-dd'))

  return { ok: true, villa, blockedDates: blocked, holdDates }
}

export async function createBookingHold(
  prevState: unknown,
  formData: FormData
) {
  const raw = Object.fromEntries(formData)
  const parsed = holdSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: 'Invalid booking details' }
  }

  const { slug, checkIn, checkOut, promoCode, guestName, guestEmail } = parsed.data

  if (checkOut <= checkIn) {
    return { ok: false, error: 'Check-out must be after check-in' }
  }

  const villa = await getOrCreateVillaBySlug(slug)
  if (!villa) {
    return { ok: false, error: 'Villa not found' }
  }

  const available = await isDateRangeAvailableForVilla(villa.id, checkIn, checkOut)
  if (!available) {
    return { ok: false, error: 'Selected dates are not available' }
  }

  const promo = promoCode ? await validatePromoCode(promoCode) : null
  const discountPercent = promo?.discountPercent ?? 0

  const nights = nightsBetween(checkIn, checkOut)
  const { total } = calculateTotal(nights, villa.pricePerNight, discountPercent)

  const token = randomUUID()
  const expiresAt = addMinutes(new Date(), 15)

  await createHold({
    villaId: villa.id,
    checkIn,
    checkOut,
    token,
    expiresAt,
  })

  revalidatePath(`/villa/${slug}/book`)

  return {
    ok: true,
    token,
    totalCents: total,
    nights,
    discountPercent,
    guestName: guestName ?? '',
    guestEmail: guestEmail ?? '',
  }
}

export async function createPaymentSession(
  prevState: unknown,
  formData: FormData
) {
  const raw = Object.fromEntries(formData)
  const parsed = paymentSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: 'Invalid payment details' }
  }

  const { slug, token, amount, guestName, guestEmail } = parsed.data

  const hold = await prisma.hold.findUnique({
    where: { token },
    include: { villa: true },
  })

  if (!hold || hold.status !== 'ACTIVE' || hold.expiresAt < new Date()) {
    return { ok: false, error: 'Hold has expired or is invalid' }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'

  const isDemo = !process.env.STRIPE_SECRET_KEY

  const successUrl = isDemo
    ? `${baseUrl}/villa/${slug}/book/demo-pay?token=${encodeURIComponent(token)}`
    : `${baseUrl}/villa/${slug}/book?success=1`

  const cancelUrl = `${baseUrl}/villa/${slug}/book?token=${encodeURIComponent(
    token
  )}`

  const provider = getPaymentProvider()
  const { url } = await provider.createSession({
    villa: { name: hold.villa.name, slug },
    booking: {
      id: hold.id,
      token,
      guestName,
      guestEmail,
    },
    amount,
    currency: 'usd',
    successUrl,
    cancelUrl,
  })

  redirect(url)
}

export async function confirmDemoPayment(
  prevState: unknown,
  formData: FormData
) {
  const raw = Object.fromEntries(formData)
  const parsed = confirmSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: 'Please enter a valid name and email' }
  }

  const { token, guestName, guestEmail } = parsed.data

  const hold = await prisma.hold.findUnique({
    where: { token },
  })

  if (!hold || hold.status !== 'ACTIVE' || hold.expiresAt < new Date()) {
    return { ok: false, error: 'Hold has expired or is invalid' }
  }

  try {
    const booking = await convertHoldToBooking(
      hold.id,
      { name: guestName, email: guestEmail },
      'demo_payment'
    )
    return { ok: true, bookingId: booking.id }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Failed to confirm booking',
    }
  }
}
