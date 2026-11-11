import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { blurFor } from '@/lib/data/image-blur'

const STEPS = [
  {
    src: '/images/shared/process-sketch.webp',
    label: 'The sketch',
    caption: 'Every villa begins on paper — the arch, the pool, the light.',
  },
  {
    src: '/images/shared/process-render.webp',
    label: 'The render',
    caption: 'Designed in-house down to the last hinge and pendant.',
  },
  {
    src: '/images/shared/process-built.webp',
    label: 'The build',
    caption: 'Built and finished by our own team in Uluwatu.',
  },
]

export function Story() {
  return (
    <section className="bg-alabaster py-20 md:py-28">
      <Container>
        <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Reveal>
            <p className="mb-3 font-sans text-sm uppercase tracking-widest text-blue-green">
              Our story
            </p>
            <h2 className="mb-5 text-gunmetal">
              Designed, built and cared for — by us
            </h2>
            <p className="max-w-xl text-gunmetal/70">
              Casa Bombora is a small design-and-build studio in Uluwatu. We
              found the land, drew these villas line by line, and built them
              with our own team — and we&apos;re still the ones who look after
              them. When you stay here, you&apos;re a guest of the people who
              made the place.
            </p>
          </Reveal>
          <Reveal delay={150} className="md:pb-2">
            <p className="font-serif text-lg italic leading-relaxed text-lion md:text-xl">
              From first sketch to the keys in your hand — nothing was left to
              chance.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3 md:mt-16">
          {STEPS.map((step, i) => (
            <Reveal key={step.src} delay={i * 120} className={i === 1 ? 'sm:mt-8' : ''}>
              <figure className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gunmetal/5">
                  <Image
                    src={step.src}
                    alt={step.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={blurFor(step.src)}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="mb-1 block font-sans text-xs uppercase tracking-widest text-blue-green">
                    {step.label}
                  </span>
                  <span className="text-sm text-gunmetal/70">{step.caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
