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
}

export const VILLAS: Villa[] = [
  {
    slug: 'mezzanine-1',
    name: 'Mezzanine One',
    tagline: 'Sun-drenched clifftop retreat',
    shortDescription:
      'A light-filled mezzanine villa with ocean views, private pool, and modern Balinese design.',
    description:
      'Mezzanine One offers an open-plan living space, king-size suite, fully equipped kitchen, and a private terrace overlooking the Bukit Peninsula. Perfect for couples or small families seeking privacy and style in Uluwatu.',
    location: 'Uluwatu, Bali',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    pricePerNight: 18000,
    image: '',
  },
  {
    slug: 'mezzanine-2',
    name: 'Mezzanine Two',
    tagline: 'Elevated island living',
    shortDescription:
      'A spacious two-bedroom mezzanine villa with private pool and lush tropical gardens.',
    description:
      'Mezzanine Two features two elegant bedrooms, ensuite bathrooms, an airy mezzanine lounge, and a private plunge pool. Set in a quiet corner of Uluwatu, it is ideal for friends or families looking for a relaxing Bali escape.',
    location: 'Uluwatu, Bali',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    pricePerNight: 26000,
    image: '',
  },
]
