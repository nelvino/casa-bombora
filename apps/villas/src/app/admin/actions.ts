'use server'

import { revalidatePath } from 'next/cache'
import { BookingStatus, PaymentStatus, HoldStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

function revalidate() {
  revalidatePath('/admin')
}

export async function confirmBooking(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CONFIRMED },
  })

  revalidate()
}

export async function cancelBooking(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
  })

  revalidate()
}

export async function markBookingPaid(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.booking.update({
    where: { id },
    data: { paymentStatus: PaymentStatus.PAID },
  })

  revalidate()
}

export async function releaseHold(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.hold.update({
    where: { id },
    data: { status: HoldStatus.RELEASED },
  })

  revalidate()
}
