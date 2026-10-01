import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { VILLAS } from '@/lib/data/villas'
import { whatsappLink } from '@/lib/site'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BackLink } from '@/components/ui/BackLink'
import { Reveal } from '@/components/ui/Reveal'
import { Price } from '@/components/currency/Price'
import { NEARBY_SPOTS } from '@/lib/data/nearby'
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
  {
    q: 'Is the Wi-Fi good enough for remote work?',
    a: 'Yes — both villas have fast fibre Wi-Fi and quiet workspaces, popular with remote workers.',
  },
  {
    q: 'How do I get around?',
    a: 'Most guests rent a scooter or use drivers. We can arrange both on arrival — beaches, gyms, and cafés are all within about 15 minutes.',
  },
]

export default function VillaPage({ params }: Props) {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!villa) notFound()

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
      price: String(villa.pricePerNight),
      priceCurrency: 'IDR',
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
      <Container size="large" className="pt-28 pb-24 md:pt-32 lg:pb-16">
        <div className="mb-8">
          <BackLink href="/" label="Villas" />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr),380px]">
          <div className="order-1 min-w-0 space-y-6 lg:order-1">
            <header>
              <p className="mb-1 font-serif text-lion">{villa.location}</p>
              <h1 className="mb-2 text-3xl text-gunmetal md:text-4xl">{villa.name}</h1>
              <p className="font-sans text-lg text-blue-green md:text-xl">{villa.tagline}</p>
            </header>

            <Gallery images={[villa.image, ...villa.galleryImages]} alt={villa.name} />
          </div>

          <aside className="order-2 h-fit min-w-0 lg:sticky lg:top-32">
            <div className="rounded-2xl border border-gunmetal/10 bg-white p-5 shadow-lg sm:p-6">
              <p className="mb-1 font-serif text-lion">{villa.location}</p>
              <h2 className="mb-3 text-xl text-gunmetal sm:text-2xl">{villa.name}</h2>

              <div className="mb-5 flex flex-wrap gap-2">
                <Badge>
                  {villa.bedrooms} bedroom{villa.bedrooms === 1 ? '' : 's'}
                </Badge>
                <Badge>
                  {villa.bathrooms} bathroom{villa.bathrooms === 1 ? '' : 's'}
                </Badge>
                <Badge>Up to {villa.maxGuests} guests</Badge>
              </div>

              <p className="mb-5 font-serif text-2xl text-gunmetal sm:text-3xl">
                <Price amountIdr={villa.pricePerNight} />{' '}
                <span className="text-sm font-sans text-gunmetal/60 sm:text-base">/ night</span>
              </p>

              <Button asChild size="lg" className="w-full rounded-full bg-blue-green text-alabaster transition-transform duration-200 hover:scale-[1.02]">
                <Link href={`/villa/${villa.slug}/book`}>Book now</Link>
              </Button>

              <a
                href={whatsappLink(
                  `Hi Casa Bombora! I have a question about ${villa.name} in Uluwatu.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gunmetal/15 px-5 py-2.5 font-sans text-sm font-medium text-gunmetal transition-colors hover:border-blue-green hover:text-blue-green"
              >
                Questions? WhatsApp us
              </a>

              <p className="mt-4 text-center text-xs text-gunmetal/50">
                Best price guaranteed. No hidden fees.
              </p>
            </div>
          </aside>

          <div className="order-3 min-w-0 space-y-8 lg:col-span-1">
            <Reveal>
              <section>
                <h2 className="mb-4 font-serif text-2xl text-gunmetal">About this villa</h2>
                <p className="mb-0 leading-relaxed text-gunmetal/80">{villa.description}</p>
              </section>
            </Reveal>

            <Reveal>
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
            </Reveal>

            <Reveal>
              <section>
                <h2 className="mb-4 font-serif text-2xl text-gunmetal">Location</h2>
                <p className="mb-4 text-gunmetal/80">
                  {villa.name} sits on a quiet lane in Pecatu, Uluwatu — a
                  peaceful base about 7 minutes&apos; drive from the famous
                  Uluwatu surf breaks, and ~45 minutes from the airport.
                </p>
                <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {NEARBY_SPOTS.map((spot) => (
                    <li
                      key={spot.name}
                      className="flex items-baseline justify-between gap-3 border-b border-gunmetal/5 py-2 font-sans text-sm"
                    >
                      <span className="text-gunmetal/80">{spot.name}</span>
                      <span className="whitespace-nowrap text-xs text-gunmetal/50">
                        {spot.distance}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-sans text-xs text-gunmetal/50">
                  Approximate drive times by scooter or car.
                </p>
              </section>
            </Reveal>

            <Reveal>
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
            </Reveal>

            <Reveal>
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
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Sticky mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gunmetal/10 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="mb-0 font-serif text-lg leading-tight text-gunmetal">
              <Price amountIdr={villa.pricePerNight} />
            </p>
            <p className="mb-0 font-sans text-xs text-gunmetal/60">per night</p>
          </div>
          <Button
            asChild
            className="rounded-full bg-blue-green px-6 text-alabaster hover:bg-blue-green/90"
          >
            <Link href={`/villa/${villa.slug}/book`}>Book now</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
