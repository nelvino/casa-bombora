import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CurrencyProvider } from '@/components/currency/CurrencyProvider'
import { isAdmin } from '@/lib/auth/session'

// Self-hosted variable fonts — next/font/google fetches from Google at build
// time, which makes deploys depend on fonts.gstatic.com being reachable.
const inter = localFont({
  src: './fonts/InterVariable.woff2',
  variable: '--font-inter',
})
const playfair = localFont({
  src: './fonts/PlayfairVariable.woff2',
  variable: '--font-playfair-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://stay.casabombora.com'),
  title: {
    template: '%s | Casa Bombora Villas',
    default: 'Casa Bombora Villas — Boutique stays in Uluwatu, Bali',
  },
  description:
    'Book boutique villas in Uluwatu, Bali with Casa Bombora. Private pools, design-forward interiors, and direct, secure booking.',
  applicationName: 'Casa Bombora Villas',
  keywords: [
    'Bali villa',
    'Uluwatu villa',
    'private pool villa',
    'boutique stay Bali',
    'Casa Bombora',
    'villa rental Uluwatu',
    'luxury villa Bali',
    'Bukit Peninsula villa',
  ],
  authors: [{ name: 'Casa Bombora' }],
  creator: 'Casa Bombora',
  openGraph: {
    title: 'Casa Bombora Villas',
    description: 'Book boutique villas in Uluwatu, Bali.',
    url: '/',
    siteName: 'Casa Bombora Villas',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Casa Bombora Villas — private pool villas in Uluwatu, Bali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Bombora Villas',
    description: 'Book boutique villas in Uluwatu, Bali.',
    images: ['/images/og-cover.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteLive = process.env.SITE_LIVE !== 'false'
  const admin = siteLive ? await isAdmin() : false

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <CurrencyProvider>
          <Header isAdmin={admin} />
          <main className="flex-1">{children}</main>
          <Footer isAdmin={admin} />
        </CurrencyProvider>
      </body>
    </html>
  )
}
