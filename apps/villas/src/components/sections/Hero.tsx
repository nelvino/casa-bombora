import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative flex min-h-[75vh] items-center bg-gunmetal text-alabaster">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,156,188,0.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(191,152,128,0.08),transparent_40%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 font-serif text-lg text-lion md:text-xl">
          Casa Bombora
        </p>
        <h1 className="mb-6 max-w-3xl text-alabaster">
          Private villas in Uluwatu, Bali
        </h1>
        <p className="mb-10 max-w-2xl font-sans text-lg text-alabaster/80 md:text-xl">
          Minimal, design-forward stays a short walk from the cliffs of the Bukit
          Peninsula. Two boutique villas, each with a private pool.
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link href="#villas">Explore villas</Link>
        </Button>
      </div>
    </section>
  )
}
