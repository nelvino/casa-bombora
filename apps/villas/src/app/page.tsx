import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { VillaList } from '@/components/sections/VillaList'

export const metadata: Metadata = {
  title: 'Boutique Villas in Uluwatu',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="py-16 md:py-24">
        <VillaList />
      </section>
    </>
  )
}
