import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { GUIDES } from '@/lib/data/guides'

export const metadata: Metadata = {
  title: 'Uluwatu guides — where to surf, eat, and go out',
  description:
    'Our local guides to Uluwatu and the Bukit Peninsula: the best surf breaks, cafés, gyms, nightlife and practical tips — curated by your Casa Bombora hosts.',
  alternates: { canonical: '/guide' },
}

export default function GuidesPage() {
  return (
    <Container size="large" className="pt-28 pb-24 md:pt-32">
      <Reveal className="mb-14 text-center">
        <p className="mb-3 font-sans text-sm uppercase tracking-widest text-blue-green">
          Local knowledge
        </p>
        <h1 className="mb-4 text-gunmetal">Uluwatu, from people who live here</h1>
        <p className="mx-auto max-w-2xl text-gunmetal/70">
          Honest guides to the Bukit Peninsula — the surf breaks, cafés, temples
          and sunset spots we send our own guests to. All within about fifteen
          minutes of the villas.
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide, index) => (
          <Reveal key={guide.slug} delay={index * 80} className="h-full">
            <Link
              href={`/guide/${guide.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-gunmetal/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="mb-3 font-sans text-xs font-medium uppercase tracking-wide text-blue-green">
                {guide.readTime}
              </p>
              <h2 className="mb-2 font-serif text-xl text-gunmetal transition-colors group-hover:text-blue-green">
                {guide.title}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-gunmetal/70">
                {guide.excerpt}
              </p>
              <span className="font-sans text-sm font-medium text-blue-green">
                Read the guide →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Container>
  )
}
