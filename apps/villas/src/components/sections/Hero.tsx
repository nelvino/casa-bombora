import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { VILLAS } from '@/lib/data/villas'
import { blurFor } from '@/lib/data/image-blur'

function ChevronDown({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function Hero() {
  const heroImage = VILLAS[0]?.image ?? ''

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden text-alabaster">
      {heroImage && (
        <Image
          src={heroImage}
          alt="Private pool villa in Uluwatu, Bali"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurFor(heroImage)}
          className="object-cover"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gunmetal/90 via-gunmetal/55 to-gunmetal/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gunmetal/70 via-transparent to-gunmetal/20" />

      <Container size="large" className="relative z-10 w-full pt-28 md:pt-32">
        <div className="max-w-2xl">
          <p
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-alabaster/20 bg-alabaster/10 px-4 py-1.5 font-sans text-sm uppercase tracking-widest text-alabaster/90 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-green" />
            Casa Bombora
          </p>

          <h1
            className="mb-6 text-4xl leading-[1.1] text-alabaster drop-shadow-sm md:text-5xl lg:text-7xl opacity-0 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Private villas in Uluwatu, Bali
          </h1>

          <p
            className="mb-10 max-w-xl text-lg leading-relaxed text-alabaster/90 drop-shadow-sm md:text-xl opacity-0 animate-fade-up"
            style={{ animationDelay: '0.35s' }}
          >
            Minimal, design-forward stays on a quiet lane in Uluwatu — minutes
            from the Bukit&apos;s famous surf breaks and clifftop sunsets. Two
            boutique villas, each with a private pool.
          </p>

          <div
            className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            <Button
              size="lg"
              asChild
              className="rounded-full bg-blue-green px-8 py-4 text-alabaster shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-green/90"
            >
              <Link href="#villas">Book your stay</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full border-alabaster/40 bg-alabaster/10 px-8 py-4 text-alabaster shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-alabaster hover:text-gunmetal"
            >
              <Link href="#villas">Explore villas</Link>
            </Button>
          </div>
        </div>
      </Container>

      <Link
        href="#villas"
        aria-label="Scroll to villas"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-alabaster/70 transition-colors hover:text-alabaster"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </Link>
    </section>
  )
}
