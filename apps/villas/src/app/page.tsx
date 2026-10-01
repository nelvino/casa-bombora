import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { VillaList } from '@/components/sections/VillaList'
import { LocationSection } from '@/components/sections/LocationSection'
import { Testimonials } from '@/components/sections/Testimonials'
import { WhyBookDirect } from '@/components/sections/WhyBookDirect'

export const metadata: Metadata = {
  title: 'Boutique Villas in Uluwatu, Bali',
  description:
    'Book direct with Casa Bombora. Two private pool villas in Uluwatu with secure checkout and local support.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <VillaList />
      <LocationSection />
      <Testimonials />
      <WhyBookDirect />
    </>
  )
}
