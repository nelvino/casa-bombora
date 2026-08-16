import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Casa Bombora Villas',
    default: 'Casa Bombora Villas',
  },
  description:
    'Book boutique villas in Uluwatu, Bali. Minimal, private stays at Casa Bombora.',
  openGraph: {
    title: 'Casa Bombora Villas',
    description: 'Book boutique villas in Uluwatu, Bali.',
    url: 'https://stay.casabombora.com',
    siteName: 'Casa Bombora Villas',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
