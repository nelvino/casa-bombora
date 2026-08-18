import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { isAdmin } from '@/lib/auth/session'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Bombora Villas',
    description: 'Book boutique villas in Uluwatu, Bali.',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header isAdmin={admin} />
        <main className="flex-1">{children}</main>
        <Footer isAdmin={admin} />
      </body>
    </html>
  )
}
