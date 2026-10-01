'use server'

import { revalidatePath } from 'next/cache'
import { BookingStatus, PaymentStatus, HoldStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth/session'
import { convertHoldToBooking } from '@/lib/booking/db'
import { generateNights } from '@/lib/booking/availability'
import { sendEmail } from '@/lib/email/send'
import {
  bookingConfirmedGuest,
  bookingCancelledGuest,
} from '@/lib/email/templates'

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error('Unauthorized')
  }
}

function revalidate() {
  revalidatePath('/admin')
}

function bookingEmailData(b: {
  guestName: string
  guestEmail: string
  checkIn: Date
  checkOut: Date
  totalAmount: number
  id: string
  villa: { name: string }
}) {
  return {
    guestName: b.guestName,
    villaName: b.villa.name,
    checkIn: b.checkIn.toISOString().slice(0, 10),
    checkOut: b.checkOut.toISOString().slice(0, 10),
    totalIdr: b.totalAmount,
    reference: b.id,
  }
}

export async function confirmBooking(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const booking = await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CONFIRMED },
    include: { villa: true },
  })

  await sendEmail({
    to: booking.guestEmail,
    ...bookingConfirmedGuest(bookingEmailData(booking)),
  })

  revalidate()
}

export async function cancelBooking(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const booking = await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
    include: { villa: true },
  })

  await sendEmail({
    to: booking.guestEmail,
    ...bookingCancelledGuest(bookingEmailData(booking)),
  })

  revalidate()
}

export async function markBookingPaid(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.booking.update({
    where: { id },
    data: { paymentStatus: PaymentStatus.PAID },
  })

  revalidate()
}

export async function releaseHold(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.hold.update({
    where: { id },
    data: { status: HoldStatus.RELEASED },
  })

  revalidate()
}

// Manual enquiry flow: turn an active hold into a real booking once payment
// has been arranged offline. Re-checks availability so an expired hold can't
// double-book dates someone else has since taken.
export async function convertHold(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const guestName = String(formData.get('guestName') ?? '').trim()
  const guestEmail = String(formData.get('guestEmail') ?? '').trim()
  if (!id || !guestName || !guestEmail) return

  const hold = await prisma.hold.findUnique({ where: { id } })
  if (!hold) return

  await convertHoldToBooking(
    hold.token,
    { name: guestName, email: guestEmail },
    undefined,
    { requireAvailable: true }
  )

  revalidate()
}

const dateInput = (v: FormDataEntryValue | null) => {
  const d = new Date(String(v ?? ''))
  return isNaN(d.getTime()) ? null : d
}

export async function blockDateRange(formData: FormData) {
  await requireAdmin()
  const villaId = String(formData.get('villaId') ?? '')
  const from = dateInput(formData.get('from'))
  const to = dateInput(formData.get('to'))
  if (!villaId || !from || !to || to < from) return

  const nights = generateNights(from, to)
  // normalize each night to a UTC calendar date — eachDayOfInterval produces
  // local-midnight dates which would shift a day under @db.Date in non-UTC TZs
  const dates = (nights.length ? nights : [from]).map(
    (d) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  )

  const existing = await prisma.blockedDate.findMany({
    where: { villaId, date: { in: dates } },
    select: { date: true },
  })
  const taken = new Set(existing.map((d) => d.date.getTime()))

  const rows = dates
    .filter((d) => !taken.has(d.getTime()))
    .map((date) => ({ villaId, date, source: 'manual' }))

  if (rows.length) {
    await prisma.blockedDate.createMany({ data: rows })
  }

  revalidate()
}

export async function unblockDate(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.blockedDate.delete({ where: { id } })

  revalidate()
}
