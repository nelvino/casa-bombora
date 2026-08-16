import Link from 'next/link'

interface FooterProps {
  isAdmin?: boolean
}

export function Footer({ isAdmin }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gunmetal/10 bg-gunmetal text-alabaster/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-serif text-lg text-alabaster">Casa Bombora Villas</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>&copy; {year}</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-alabaster/70 hover:text-blue-green transition-colors">
              Home
            </Link>
            <Link href="/#villas" className="text-alabaster/70 hover:text-blue-green transition-colors">
              Villas
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-blue-green transition-colors hover:text-blue-green/80">
                Admin
              </Link>
            )}
          </div>

          <p className="text-sm italic text-alabaster/50">Powered by Casa Bombora</p>
        </div>
      </div>
    </footer>
  )
}
