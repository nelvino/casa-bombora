import Image from 'next/image'
import Link from 'next/link'
import { VILLAS } from '@/lib/data/villas'
import { blurFor } from '@/lib/data/image-blur'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { AvailabilityHint } from '@/components/booking/AvailabilityHint'
import { Price } from '@/components/currency/Price'
import { cn } from '@/lib/utils/cn'

export function VillaList() {
  return (
    <section id="villas" className="scroll-mt-24 bg-alabaster py-20 md:py-28">
      <Container>
        <Reveal className="mb-14 text-center">
          <p className="mb-3 font-sans text-sm uppercase tracking-widest text-blue-green">
            Your stay
          </p>
          <h2 className="mb-4 text-gunmetal">
            Choose your stay
          </h2>
          <p className="mx-auto max-w-2xl text-gunmetal/70">
            Two quiet, private retreats in Uluwatu. Each villa is fully equipped,
            with a private pool and dedicated support.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          {VILLAS.map((villa, index) => (
            <Reveal key={villa.slug} delay={index * 100} className="h-full">
              <Link
                href={`/villa/${villa.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gunmetal/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gunmetal/5">
                  {villa.image ? (
                    <>
                      <Image
                        src={villa.image}
                        alt={`${villa.name} — ${villa.tagline}`}
                        fill
                        placeholder="blur"
                        blurDataURL={blurFor(villa.image)}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/60 via-gunmetal/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </>
                  ) : (
                    <div
                      className={cn(
                        'flex h-full w-full items-center justify-center',
                        index % 2 === 0 ? 'bg-lion/20' : 'bg-blue-green/10',
                      )}
                    >
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gunmetal/70">
                        Photo coming soon
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-1 text-gunmetal transition-colors group-hover:text-blue-green">
                    {villa.name}
                  </h3>
                  <p className="mb-3 font-serif text-lion">{villa.tagline}</p>
                  <p className="mb-4 line-clamp-2 text-gunmetal/70">
                    {villa.shortDescription}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    <Badge variant="lion">
                      {villa.bedrooms} bedroom{villa.bedrooms === 1 ? '' : 's'}
                    </Badge>
                    <Badge variant="lion">
                      {villa.bathrooms} bathroom{villa.bathrooms === 1 ? '' : 's'}
                    </Badge>
                    <Badge variant="lion">Up to {villa.maxGuests} guests</Badge>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="font-sans text-gunmetal">
                        <span className="font-medium">
                          <Price amountIdr={villa.pricePerNight} />
                        </span>
                        <span className="text-gunmetal/60"> / night</span>
                      </p>
                      <AvailabilityHint slug={villa.slug} />
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-green px-5 py-2.5 font-sans text-sm font-medium text-alabaster transition-transform duration-200 group-hover:scale-105 group-hover:bg-blue-green/90">
                      View & Book
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
