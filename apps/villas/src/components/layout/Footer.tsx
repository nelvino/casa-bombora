import Link from 'next/link'
import { VILLAS } from '@/lib/data/villas'
import { CONTACT_EMAIL, whatsappLink } from '@/lib/site'

interface FooterProps {
  isAdmin?: boolean
}

export function Footer({ isAdmin }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gunmetal/10 bg-gunmetal text-alabaster/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-2 font-serif text-lg text-alabaster">
              Casa Bombora Villas
            </p>
            <p className="mb-0 text-sm leading-relaxed">
              Two boutique private-pool villas on a quiet lane in Pecatu,
              Uluwatu, Bali. Book direct for the best rate.
            </p>
          </div>

          <nav aria-label="Villas">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-alabaster/50">
              Villas
            </p>
            <ul className="space-y-2 text-sm">
              {VILLAS.map((villa) => (
                <li key={villa.slug}>
                  <Link
                    href={`/villa/${villa.slug}`}
                    className="transition-colors hover:text-blue-green"
                  >
                    {villa.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-alabaster/50">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-blue-green">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#villas"
                  className="transition-colors hover:text-blue-green"
                >
                  Our villas
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="text-blue-green transition-colors hover:text-blue-green/80"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div>
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-alabaster/50">
              Contact
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-blue-green"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(
                    'Hi Casa Bombora! I have a question about your villas in Uluwatu.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-blue-green"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="pt-1 text-alabaster/50">Pecatu, Uluwatu, Bali</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-alabaster/10 pt-6 text-xs text-alabaster/50 md:flex-row">
          <p className="mb-0">&copy; {year} Casa Bombora Villas</p>
          <p className="mb-0 italic">Powered by Casa Bombora</p>
        </div>
      </div>
    </footer>
  )
}
