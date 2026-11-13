import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { GUIDES } from '@/lib/data/guides'
import { blurFor } from '@/lib/data/image-blur'

export const metadata: Metadata = {
  title: 'Uluwatu guides: where to surf, eat, and go out',
  description:
    'Our local guides to Uluwatu and the Bukit Peninsula: the best surf breaks, cafés, gyms, nightlife and practical tips, curated by your Casa Bombora hosts.',
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
          Honest guides to the Bukit Peninsula: the surf breaks, cafés, temples
          and sunset spots we send our own guests to. All within about fifteen
          minutes of the villas.
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide, index) => (
          <Reveal key={guide.slug} delay={index * 80} className="h-full">
            <Link
              href={`/guide/${guide.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gunmetal/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gunmetal/5">
                <Image
                  src={guide.image.src}
                  alt={guide.image.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={blurFor(guide.image.src)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute left-4 top-4 rounded-full bg-gunmetal/60 px-3 py-1 font-sans text-xs font-medium uppercase tracking-wide text-alabaster backdrop-blur-sm">
                  {guide.readTime}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="mb-2 font-serif text-xl text-gunmetal transition-colors group-hover:text-blue-green">
                  {guide.title}
                </h2>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gunmetal/70">
                  {guide.excerpt}
                </p>
                <span className="font-sans text-sm font-medium text-blue-green">
                  Read the guide →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Container>
  )
}
