import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { VILLAS } from '@/lib/data/villas'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BackLink } from '@/components/ui/BackLink'
import { Gallery } from '@/components/sections/Gallery'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return VILLAS.map((villa) => ({ slug: villa.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!villa) return { title: 'Villa' }

  const title = villa.name
  const description = `${villa.tagline}. ${villa.shortDescription} Book direct in Uluwatu, Bali.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/villa/${villa.slug}`,
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
      canonical: `/villa/${villa.slug}`,
    },
  }
}

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

const houseRules = [
  { term: 'Check-in', detail: '3:00 PM' },
  { term: 'Check-out', detail: '11:00 AM' },
  { term: 'Quiet hours', detail: '10:00 PM – 7:00 AM' },
  { term: 'Smoking', detail: 'Not permitted inside' },
  { term: 'Pets', detail: 'Not allowed' },
  { term: 'Cancellation', detail: 'Free before payment is completed' },
]

const faq = [
  {
    q: 'Is breakfast included?',
    a: 'Breakfast is not included, but each villa has a full kitchen and our team can recommend local cafés and delivery options.',
  },
  {
    q: 'How close is the beach?',
    a: 'The villas are a short drive or scooter ride from the Uluwatu cliff beaches and surf breaks.',
  },
  {
    q: 'Can I book airport pickup?',
    a: 'Yes. Add a note after booking or contact us directly and we can arrange a trusted local driver.',
  },
]

export default function VillaPage({ params }: Props) {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!villa) notFound()

  const price = villa.pricePerNight / 100

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: villa.name,
    description: villa.description,
    url: `https://stay.casabombora.com/villa/${villa.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Uluwatu',
      addressRegion: 'Bali',
      addressCountry: 'ID',
    },
    numberOfRooms: villa.bedrooms,
    numberOfBathroomsTotal: villa.bathrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      value: villa.maxGuests,
    },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'USD',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: `https://stay.casabombora.com/villa/${villa.slug}/book`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container size="large" className="py-10 md:py-16">
        <div className="mb-8">
          <BackLink href="/" label="Villas" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr,380px]">
          <article className="space-y-10">
            <header>
              <p className="mb-1 font-serif text-lion">{villa.location}</p>
              <h1 className="mb-2 text-gunmetal">{villa.name}</h1>
              <p className="font-sans text-xl text-blue-green">{villa.tagline}</p>
            </header>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gunmetal/5">
              {villa.image ? (
                <Image
                  src={villa.image}
                    alt={villa.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    unoptimized={villa.image.startsWith('http')}
                  />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-lion/20">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gunmetal/70">
                    Photo coming soon
                  </span>
                </div>
              )}
            </div>

            <Gallery images={villa.galleryImages} alt={villa.name} />

            <section>
              <h2 className="mb-4 font-serif text-2xl text-gunmetal">About this villa</h2>
              <p className="mb-0 text-gunmetal/80 leading-relaxed">{villa.description}</p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl text-gunmetal">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {villa.amenities.map((amenity) => (
                  <Badge key={amenity} variant="blue">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl text-gunmetal">Location</h2>
              <p className="mb-0 text-gunmetal/80">
                {villa.name} is located in {villa.location}, on Bali&apos;s Bukit Peninsula. The area is
                known for its cliffs, surf breaks, and quiet residential lanes.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl text-gunmetal">House rules</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {houseRules.map((rule) => (
                  <div key={rule.term} className="rounded-lg border border-gunmetal/10 p-4">
                    <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-gunmetal/60">
                      {rule.term}
                    </dt>
                    <dd className="font-serif text-gunmetal">{rule.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl text-gunmetal">Questions & answers</h2>
              <div className="space-y-4">
                {faq.map((item) => (
                  <div key={item.q} className="rounded-lg border border-gunmetal/10 p-4">
                    <h3 className="mb-1 font-serif text-lg text-gunmetal">{item.q}</h3>
                    <p className="mb-0 text-sm text-gunmetal/70">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="h-fit lg:sticky lg:top-8">
            <div className="rounded-2xl border border-gunmetal/10 bg-white p-6 shadow-sm">
              <p className="mb-1 font-serif text-lion">{villa.location}</p>
              <h2 className="mb-4 text-2xl text-gunmetal">{villa.name}</h2>

              <div className="mb-6 flex flex-wrap gap-2">
                <Badge>{villa.bedrooms} bedrooms</Badge>
                <Badge>{villa.bathrooms} bathrooms</Badge>
                <Badge>Up to {villa.maxGuests} guests</Badge>
              </div>

              <p className="mb-6 font-serif text-3xl text-gunmetal">
                {formatCents(villa.pricePerNight)}{' '}
                <span className="text-base font-sans text-gunmetal/60">/ night</span>
              </p>

              <Button asChild size="lg" className="w-full">
                <Link href={`/villa/${villa.slug}/book`}>Book now</Link>
              </Button>

              <p className="mt-4 text-center text-xs text-gunmetal/50">
                Best price guaranteed. No hidden fees.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
