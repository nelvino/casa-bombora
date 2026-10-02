import type { Metadata } from 'next'
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/site'
import { Hero } from '@/components/sections/Hero'
import { VillaList } from '@/components/sections/VillaList'
import { LocationSection } from '@/components/sections/LocationSection'
import { Testimonials } from '@/components/sections/Testimonials'
import { WhyBookDirect } from '@/components/sections/WhyBookDirect'

export const metadata: Metadata = {
  // Root-layout title.template does not apply to the root segment's index
  // page, so give the full title explicitly.
  title: {
    absolute:
      'Casa Bombora Villas — Boutique Private Pool Villas in Uluwatu, Bali',
  },
  description:
    'Two design-forward private pool villas in Pecatu, Uluwatu. Minutes from the Bukit\u2019s famous surf breaks and clifftop sunsets. Book direct for the best rate.',
  openGraph: {
    title: 'Casa Bombora Villas — Boutique Private Pool Villas in Uluwatu, Bali',
    description:
      'Two design-forward private pool villas in Pecatu, Uluwatu. Book direct for the best rate.',
    url: '/',
    siteName: 'Casa Bombora Villas',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Casa Bombora Villas — private pool villas in Uluwatu, Bali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Bombora Villas — Boutique Private Pool Villas in Uluwatu, Bali',
    description:
      'Two design-forward private pool villas in Pecatu, Uluwatu. Book direct for the best rate.',
    images: ['/images/og-cover.jpg'],
  },
}

const lodgingLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Casa Bombora Villas',
  description:
    'Two design-forward one-bedroom villas with private pools in Pecatu, Uluwatu, Bali. Direct booking only.',
  url: 'https://stay.casabombora.com',
  image: 'https://stay.casabombora.com/images/og-cover.jpg',
  email: CONTACT_EMAIL,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pecatu, Uluwatu',
    addressRegion: 'Bali',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -8.8257,
    longitude: 115.1077,
  },
  priceRange: 'IDR 2,900,000/night',
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingLd) }}
      />
      <Hero />
      <VillaList />
      <LocationSection />
      <Testimonials />
      <WhyBookDirect />
    </>
  )
}
