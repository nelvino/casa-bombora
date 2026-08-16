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
  pricePerNight: number
  image: string
  galleryImages: string[]
  amenities: string[]
}

export const VILLAS: Villa[] = [
  {
    slug: 'villa-teduh',
    name: 'Villa Teduh',
    tagline: 'A cool, shaded retreat from the Bali heat',
    shortDescription:
      'A light-filled one-bedroom villa with private pool, garden views, and modern Balinese design.',
    description:
      'Villa Teduh offers an open-plan living space, king-size suite, fully equipped kitchen, and a private terrace overlooking the Bukit Peninsula. Perfect for couples seeking a cool, private escape from the heat of Bali in Uluwatu.',
    location: 'Uluwatu, Bali',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    pricePerNight: 18000,
    image: '/images/villa-teduh/hero.webp',
    galleryImages: [
      '/images/villa-teduh/living.webp',
      '/images/villa-teduh/bedroom.webp',
      '/images/villa-teduh/bathroom.webp',
      '/images/villa-teduh/terrace.webp',
    ],
    amenities: [
      'Private pool',
      'Garden views',
      'King-size bed',
      'Air conditioning',
      'Kitchenette',
      'Wi-Fi',
      'Daily cleaning',
      'Free parking',
    ],
  },
  {
    slug: 'villa-langit',
    name: 'Villa Langit',
    tagline: 'Open, airy living beneath the Bali sky',
    shortDescription:
      'A spacious two-bedroom villa with private pool, tropical garden, and an open, airy feel.',
    description:
      'Villa Langit features two elegant bedrooms, ensuite bathrooms, an airy mezzanine lounge, and a private plunge pool. Set in a quiet corner of Uluwatu, it is ideal for friends or families looking for an open, island-feeling Bali escape.',
    location: 'Uluwatu, Bali',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    pricePerNight: 26000,
    image: '/images/villa-langit/hero.webp',
    galleryImages: [
      '/images/villa-langit/living.webp',
      '/images/villa-langit/bedroom.webp',
      '/images/villa-langit/bathroom.webp',
      '/images/villa-langit/terrace.webp',
    ],
    amenities: [
      'Private pool',
      'Two bedrooms',
      'Tropical garden',
      'Air conditioning',
      'Full kitchen',
      'Wi-Fi',
      'Daily cleaning',
      'Free parking',
    ],
  },
]
