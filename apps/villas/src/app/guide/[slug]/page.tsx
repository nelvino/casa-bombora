import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { GUIDES } from '@/lib/data/guides'
import { VILLAS } from '@/lib/data/villas'

const BASE = 'https://stay.casabombora.com'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = GUIDES.find((g) => g.slug === params.slug)
  if (!guide) return { title: 'Guide' }

  return {
    title: guide.title,
    description: guide.metaDescription,
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url: `/guide/${guide.slug}`,
      siteName: 'Casa Bombora Villas',
      locale: 'en_US',
      type: 'article',
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
      title: guide.title,
      description: guide.metaDescription,
      images: ['/images/og-cover.jpg'],
    },
    alternates: { canonical: `/guide/${guide.slug}` },
  }
}

export default function GuidePage({ params }: Props) {
  const guide = GUIDES.find((g) => g.slug === params.slug)
  if (!guide) notFound()

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    url: `${BASE}/guide/${guide.slug}`,
    image: `${BASE}/images/og-cover.jpg`,
    author: {
      '@type': 'Organization',
      name: 'Casa Bombora Villas',
      url: BASE,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Casa Bombora Villas',
      url: BASE,
    },
    about: {
      '@type': 'Place',
      name: 'Uluwatu, Bali',
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Villas', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE}/guide` },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.title,
        item: `${BASE}/guide/${guide.slug}`,
      },
    ],
  }

  return (
    <>
      {[articleLd, breadcrumbLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <Container size="default" className="pt-28 pb-24 md:pt-32">
        <div className="mb-8">
          <BackLink href="/guide" label="All guides" />
        </div>

        <Reveal>
          <header className="mb-12 max-w-2xl">
            <p className="mb-3 font-sans text-sm uppercase tracking-widest text-blue-green">
              {guide.readTime}
            </p>
            <h1 className="mb-4 text-3xl text-gunmetal md:text-4xl">
              {guide.title}
            </h1>
            <p className="font-serif text-lg leading-relaxed text-gunmetal/70">
              {guide.intro}
            </p>
          </header>
        </Reveal>

        <div className="max-w-2xl space-y-12">
          {guide.sections.map((section) => (
            <Reveal key={section.heading}>
              <section>
                <h2 className="mb-4 font-serif text-2xl text-gunmetal">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="mb-4 leading-relaxed text-gunmetal/80"
                  >
                    {p}
                  </p>
                ))}
                {section.places && (
                  <ul className="space-y-4">
                    {section.places.map((place) => (
                      <li
                        key={place.name}
                        className="rounded-xl border border-gunmetal/10 bg-white p-5"
                      >
                        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-serif text-lg text-gunmetal">
                            {place.name}
                          </h3>
                          {place.distance && (
                            <span className="font-sans text-xs font-medium uppercase tracking-wide text-blue-green">
                              {place.distance} from the villas
                            </span>
                          )}
                        </div>
                        <p className="mb-0 text-sm leading-relaxed text-gunmetal/70">
                          {place.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}

          <Reveal>
            <div className="rounded-2xl bg-gunmetal p-8 text-center">
              <h2 className="mb-2 font-serif text-2xl text-alabaster">
                Stay minutes from it all
              </h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-alabaster/70">
                Villa Teduh and Villa Langit sit on a quiet lane in Pecatu —
                close to everything in this guide, far from the noise.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {VILLAS.map((villa) => (
                  <Button
                    key={villa.slug}
                    asChild
                    variant="outline"
                    className="rounded-full border-alabaster/30 text-alabaster hover:bg-alabaster hover:text-gunmetal"
                  >
                    <Link href={`/villa/${villa.slug}`}>{villa.name}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  )
}
