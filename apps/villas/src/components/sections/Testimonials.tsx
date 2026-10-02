import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

function Stars() {
  return (
    <div className="mb-4 flex gap-1 text-lion" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

// Placeholder quotes until we collect real guest reviews — swap these out as
// soon as the first genuine ones come in.
const testimonials = [
  {
    quote:
      'Honestly couldn\u2019t fault it. Quiet little street, pool to ourselves, and the scooter ride down to Padang Padang took no time at all.',
    name: 'Sarah & Tom',
    origin: 'Melbourne, Australia',
  },
  {
    quote:
      'Such a relaxing base. We\u2019d surf in the morning then just hang by the pool in the afternoon. Hosts sorted everything we asked for.',
    name: 'Amelia R.',
    origin: 'London, UK',
  },
  {
    quote:
      'Great spot for exploring the Bukit. Airport pickup was organised for us and the local tips they sent over were genuinely useful.',
    name: 'Lena & Jonas',
    origin: 'Munich, Germany',
  },
]

export function Testimonials() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <Reveal className="mb-14 text-center">
          <p className="mb-3 font-sans text-sm uppercase tracking-widest text-blue-green">
            Guest stories
          </p>
          <h2 className="mb-4 text-gunmetal">Loved by our guests</h2>
          <p className="mx-auto max-w-2xl text-gunmetal/70">
            A small collection, cared for personally. Here is what staying with
            Casa Bombora feels like.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <Reveal key={t.name} delay={index * 100}>
              <figure className="flex h-full flex-col rounded-2xl border border-gunmetal/10 bg-alabaster/60 p-6">
                <Stars />
                <blockquote className="mb-5 flex-1 font-serif text-lg leading-relaxed text-gunmetal">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <p className="mb-0 font-sans text-sm font-medium text-gunmetal">
                    {t.name}
                  </p>
                  <p className="mb-0 font-sans text-xs text-gunmetal/60">
                    {t.origin}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
