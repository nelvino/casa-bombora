export interface Villa {
  slug: string
  name: string
  tagline: string
  shortDescription: string
  description: string
  location: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  pricePerNight: number // IDR rupiah (canonical; guests are billed in IDR)
  image: string
  galleryImages: string[]
  amenities: string[]
}

export const VILLAS: Villa[] = [
  {
    slug: 'villa-teduh',
    name: 'Villa Teduh',
    tagline: 'A cool, shaded retreat in quiet Uluwatu',
    shortDescription:
      'A light-filled one-bedroom loft villa with private pool, outdoor plunge bath, and open-plan living.',
    description:
      'Villa Teduh pairs a soaring mezzanine bedroom with an open-plan living room and kitchen that flows straight onto your private pool deck. After the beach, sink into the pool or brave a plunge in the garden bath \u2014 then retreat to air-conditioned comfort. Set on a peaceful lane in Pecatu, it is made for couples who want a calm base minutes from Uluwatu\u2019s surf breaks and clifftop sunsets.',
    location: 'Pecatu, Uluwatu, Bali',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    pricePerNight: 2900000,
    image: '/images/villa-teduh/hero.webp',
    galleryImages: [
      '/images/villa-teduh/facade.webp',
      '/images/villa-teduh/pool-aerial.webp',
      '/images/villa-teduh/living.webp',
      '/images/villa-teduh/kitchen.webp',
      '/images/villa-teduh/dining.webp',
      '/images/villa-teduh/stairs.webp',
      '/images/villa-teduh/bedroom-mezzanine.webp',
      '/images/villa-teduh/bedroom.webp',
      '/images/villa-teduh/bathroom.webp',
      '/images/villa-teduh/terrace.webp',
      '/images/villa-teduh/night-bath.webp',
    ],
    amenities: [
      'Private pool',
      'Outdoor plunge bath',
      'Mezzanine Queen bedroom',
      'Open living & kitchen',
      'Air conditioning',
      'Fast Wi-Fi',
      'Daily cleaning',
      'Free parking',
    ],
  },
  {
    slug: 'villa-langit',
    name: 'Villa Langit',
    tagline: 'Open, airy living on a quiet Uluwatu lane',
    shortDescription:
      'A spacious one-bedroom villa with private pool, outdoor plunge bath, and an airy mezzanine lounge.',
    description:
      'Villa Langit pairs a soaring mezzanine bedroom with an airy open-plan living room and kitchen that opens onto your private pool. An outdoor plunge bath sits in the garden for slow evenings. On a peaceful lane in Pecatu, it suits couples who want space, relaxation, and easy drives to every Uluwatu beach.',
    location: 'Pecatu, Uluwatu, Bali',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    pricePerNight: 2900000,
    image: '/images/villa-langit/hero.webp',
    galleryImages: [
      '/images/villa-langit/facade.webp',
      '/images/villa-langit/pool-aerial.webp',
      '/images/villa-langit/living.webp',
      '/images/villa-langit/living-alt.webp',
      '/images/villa-langit/kitchen.webp',
      '/images/villa-langit/dining.webp',
      '/images/villa-langit/stairs.webp',
      '/images/villa-langit/bedroom-mezzanine.webp',
      '/images/villa-langit/bedroom.webp',
      '/images/villa-langit/bathroom.webp',
      '/images/villa-langit/vanity.webp',
      '/images/villa-langit/terrace.webp',
      '/images/villa-langit/detail.webp',
      '/images/villa-langit/night-arches.webp',
      '/images/villa-langit/night-pool.webp',
      '/images/villa-langit/bamboo-night.webp',
    ],
    amenities: [
      'Private pool',
      'Outdoor plunge bath',
      'Mezzanine Queen bedroom',
      'Open living & kitchen',
      'Air conditioning',
      'Fast Wi-Fi',
      'Daily cleaning',
      'Free parking',
    ],
  },
]
