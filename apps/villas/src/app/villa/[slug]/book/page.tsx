import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { VILLAS } from '@/lib/data/villas'
import BookingPageClient from '@/components/booking/BookingPageClient'

interface Props {
  params: { slug: string }
  searchParams: { success?: string; token?: string }
}

export function generateStaticParams() {
  return VILLAS.map((villa) => ({ slug: villa.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!villa) return { title: 'Book' }

  const title = `Book ${villa.name}`
  const description = `Reserve ${villa.name} in ${villa.location}. Check live availability and pay securely.`

  return {
    title,
    description,
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

export default function BookPage({ params, searchParams }: Props) {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!villa) notFound()

  return (
    <BookingPageClient
      slug={params.slug}
      success={searchParams.success}
      token={searchParams.token}
    />
  )
}
