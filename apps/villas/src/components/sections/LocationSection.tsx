import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { NEARBY_SPOTS } from '@/lib/data/nearby'

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const spots = NEARBY_SPOTS.slice(0, 4)

export function LocationSection() {
  return (
    <section className="bg-alabaster py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 font-sans text-sm uppercase tracking-widest text-blue-green">
              The neighbourhood
            </p>
            <h2 className="mb-4 text-gunmetal">
              A calm corner of the Bukit Peninsula
            </h2>
            <p className="mb-6 max-w-xl text-gunmetal/70">
              The villas sit on a quiet residential lane in Pecatu, Uluwatu —
              peaceful and private, yet only about 7 minutes&apos; drive from
              the famous Uluwatu surf breaks and clifftop sunsets. Our team can
              arrange scooters, drivers, and day trips.
            </p>
            <ul className="space-y-2 font-sans text-sm text-gunmetal/80">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-green" />
                ~45 min from Ngurah Rai International Airport
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-green" />
                ~7 min to the Uluwatu surf breaks
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-green" />
                Quiet residential lane — no through traffic
              </li>
            </ul>
            <Link
              href="/guide"
              className="mt-6 inline-block font-sans text-sm font-medium text-blue-green transition-colors hover:text-blue-green/80"
            >
              Read our local guides →
            </Link>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {spots.map((spot, index) => (
              <Reveal key={spot.name} delay={index * 80}>
                <div className="h-full rounded-2xl border border-gunmetal/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-3 flex items-center gap-2 text-blue-green">
                    <PinIcon className="h-5 w-5" />
                    <span className="font-sans text-xs font-medium uppercase tracking-wide text-gunmetal/60">
                      {spot.distance}
                    </span>
                  </div>
                  <h3 className="mb-1 font-serif text-lg text-gunmetal">
                    {spot.name}
                  </h3>
                  <p className="mb-0 text-sm text-gunmetal/70">{spot.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
