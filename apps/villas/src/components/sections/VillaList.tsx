import Image from 'next/image'
import Link from 'next/link'
import { VILLAS } from '@/lib/data/villas'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function VillaList() {
  return (
    <section id="villas" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-gunmetal">Choose your stay</h2>
          <p className="mx-auto max-w-2xl text-gunmetal/70">
            Two quiet, private retreats in Uluwatu. Each villa is fully equipped,
            with a private pool and dedicated support.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {VILLAS.map((villa, index) => (
            <Link
              key={villa.slug}
              href={`/villa/${villa.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gunmetal/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gunmetal/5">
                {villa.image ? (
                  <Image
                    src={villa.image}
                    alt={villa.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={villa.image.startsWith('http')}
                  />
                ) : (
                  <div
                    className={cn(
                      'flex h-full w-full items-center justify-center',
                      index % 2 === 0 ? 'bg-lion/20' : 'bg-blue-green/10'
                    )}
                  >
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gunmetal/70">
                      Photo coming soon
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-1 text-gunmetal group-hover:text-blue-green transition-colors">
                  {villa.name}
                </h3>
                <p className="mb-3 font-serif text-lion">{villa.tagline}</p>
                <p className="mb-4 line-clamp-2 text-gunmetal/70">
                  {villa.shortDescription}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                  <Badge variant="lion">{villa.bedrooms} bedrooms</Badge>
                  <Badge variant="lion">{villa.bathrooms} bathrooms</Badge>
                  <Badge variant="lion">Up to {villa.maxGuests} guests</Badge>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <p className="font-sans text-gunmetal">
                    <span className="font-medium">
                      {formatCents(villa.pricePerNight)}
                    </span>
                    <span className="text-gunmetal/60"> / night</span>
                  </p>
                  <span className="inline-flex items-center justify-center rounded-lg bg-blue-green px-5 py-2.5 font-sans text-sm font-medium text-alabaster transition-colors hover:bg-blue-green/90">
                    View & Book
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
