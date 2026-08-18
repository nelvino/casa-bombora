import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gunmetal text-alabaster">
      <Container size="large" className="pt-32 pb-20 text-center">
        <p className="mb-4 font-serif text-lg text-lion">Casa Bombora Villas</p>
        <h1 className="mb-6 max-w-3xl text-alabaster">
          Something beautiful is on its way
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-alabaster/80">
          Our direct booking experience for Villa Teduh and Villa Langit is
          almost ready. For now, please get in touch to reserve your stay.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="mailto:info@casabombora.com"
            className="rounded-lg bg-blue-green px-8 py-3 font-sans font-medium text-alabaster transition-colors hover:bg-blue-green/90"
          >
            Email us
          </Link>
          <Link
            href="https://wa.me/61415164208"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-alabaster/30 px-8 py-3 font-sans font-medium text-alabaster transition-colors hover:bg-alabaster/10"
          >
            WhatsApp
          </Link>
        </div>
      </Container>
    </div>
  )
}
