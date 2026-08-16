import Link from 'next/link'
import { VILLAS } from '@/lib/data/villas'
import { Container } from '@/components/ui/Container'

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function VillaList() {
  return (
    <Container>
      <h2 className="mb-2">Choose your stay</h2>
      <p className="mb-10 text-gunmetal/70">
        Two quiet, private retreats in Uluwatu.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {VILLAS.map((villa) => (
          <Link
            key={villa.slug}
            href={`/villa/${villa.slug}`}
            className="group block border border-gunmetal/10 bg-white p-6 transition-colors hover:border-blue-green"
          >
            <div
              className="mb-4 aspect-[4/3] w-full bg-lion/20"
              aria-hidden="true"
            />
            <h3 className="mb-1 text-gunmetal group-hover:text-blue-green">
              {villa.name}
            </h3>
            <p className="mb-3 font-serif text-lion">{villa.tagline}</p>
            <p className="mb-4 line-clamp-2 text-gunmetal/70">
              {villa.shortDescription}
            </p>
            <p className="font-sans text-gunmetal">
              <span className="font-medium">
                {formatCents(villa.pricePerNight)}
              </span>
              <span className="text-gunmetal/60"> / night</span>
            </p>
          </Link>
        ))}
      </div>
    </Container>
  )
}
