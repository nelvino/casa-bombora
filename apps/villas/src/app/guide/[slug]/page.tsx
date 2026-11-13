import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { GUIDES, type GuideImage } from '@/lib/data/guides'
import { VILLAS } from '@/lib/data/villas'
import { blurFor } from '@/lib/data/image-blur'
import { mapsLink } from '@/lib/site'

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
          url: guide.image.src,
          width: 1200,
          height: 630,
          alt: guide.image.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.metaDescription,
      images: [guide.image.src],
    },
    alternates: { canonical: `/guide/${guide.slug}` },
  }
}

function GuidePhoto({ image, priority }: { image: GuideImage; priority?: boolean }) {
  return (
    <figure>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gunmetal/5">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          placeholder="blur"
          blurDataURL={blurFor(image.src)}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </div>
      <figcaption className="mt-2 text-right font-sans text-xs text-gunmetal/40">
        Photo:{' '}
        {image.creditUrl ? (
          <a
            href={image.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gunmetal/20 underline-offset-2 hover:text-blue-green"
          >
            {image.credit}
          </a>
        ) : (
          image.credit
        )}
      </figcaption>
    </figure>
  )
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
    image: `${BASE}${guide.image.src}`,
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
          <header className="mb-8 max-w-2xl">
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

        <Reveal className="mb-12">
          <GuidePhoto image={guide.image} priority />
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
                {section.image && (
                  <div className="my-6">
                    <GuidePhoto image={section.image} />
                  </div>
                )}
                {section.places && (
                  <ul className="space-y-4">
                    {section.places.map((place) => (
                      <li
                        key={place.name}
                        className="rounded-xl border border-gunmetal/10 bg-white p-5 transition-shadow duration-300 hover:shadow-md"
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
                        <p className="mb-2 text-sm leading-relaxed text-gunmetal/70">
                          {place.text}
                        </p>
                        {place.mapsQuery && (
                          <a
                            href={mapsLink(place.mapsQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-blue-green transition-colors hover:text-gunmetal"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            Directions on Google Maps
                          </a>
                        )}
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
