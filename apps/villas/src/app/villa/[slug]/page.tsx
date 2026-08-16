import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { VILLAS } from '@/lib/data/villas'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils/cn'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return VILLAS.map((villa) => ({ slug: villa.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  return { title: villa ? villa.name : 'Villa' }
}

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export default function VillaPage({ params }: Props) {
  const villa = VILLAS.find((v) => v.slug === params.slug)
  if (!villa) notFound()

  return (
    <Container size="large" className="py-16">
      <article className="max-w-3xl">
        <p className="mb-2 font-serif italic text-lion">{villa.location}</p>
        <h1 className="mb-4 text-gunmetal">{villa.name}</h1>
        <p className="mb-6 font-serif text-xl text-blue-green">
          {villa.tagline}
        </p>
        <p className="mb-8 text-gunmetal/80">{villa.description}</p>

        <div
          className="mb-8 aspect-[4/3] w-full bg-lion/20"
          aria-hidden="true"
        />

        <dl className="mb-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-sans uppercase tracking-wide text-gunmetal/60">
              Bedrooms
            </dt>
            <dd className="font-serif text-lg">{villa.bedrooms}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-wide text-gunmetal/60">
              Bathrooms
            </dt>
            <dd className="font-serif text-lg">{villa.bathrooms}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-wide text-gunmetal/60">
              Max guests
            </dt>
            <dd className="font-serif text-lg">{villa.maxGuests}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-wide text-gunmetal/60">
              From
            </dt>
            <dd className="font-serif text-lg">
              {formatCents(villa.pricePerNight)} / night
            </dd>
          </div>
        </dl>

        <Link
          href={`/villa/${villa.slug}/book`}
          className={cn(
            'inline-flex items-center justify-center rounded-none bg-blue-green px-6 py-3 font-sans font-medium text-alabaster transition-colors duration-200 hover:bg-blue-green/90 focus:outline-none focus:ring-2 focus:ring-blue-green focus:ring-offset-2'
          )}
        >
          Book now
        </Link>
      </article>
    </Container>
  )
}
