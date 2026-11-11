import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { VILLAS } from '@/lib/data/villas'
import { paymentsEnabled } from '@/lib/payments'
import { BOOKING_ENGINE_LIVE } from '@/lib/site'
import BookingPageClient from '@/components/booking/BookingPageClient'

interface Props {
  params: { slug: string }
  searchParams: { success?: string; token?: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!villa) return { title: 'Book' }

  const title = `Book ${villa.name}`
  const description = `Reserve ${villa.name} in ${villa.location}. Check live availability and send a booking request.`

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `/villa/${villa.slug}/book`,
      siteName: 'Casa Bombora Villas',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/villa/${villa.slug}/book`,
    },
  }
}

// V1: render on demand so the redirect below is a real 307, not a
// prerendered meta-refresh page.
export const dynamic = 'force-dynamic'

export default function BookPage({ params, searchParams }: Props) {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!BOOKING_ENGINE_LIVE) redirect(`/villa/${params.slug}`)
  if (!villa) notFound()

  return (
    <BookingPageClient
      slug={params.slug}
      success={searchParams.success}
      token={searchParams.token}
      paymentsEnabled={paymentsEnabled()}
    />
  )
}
