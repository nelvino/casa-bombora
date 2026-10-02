import { MetadataRoute } from 'next'
import { VILLAS } from '@/lib/data/villas'
import { GUIDES } from '@/lib/data/guides'

const BASE = 'https://stay.casabombora.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...VILLAS.map(
      (villa): MetadataRoute.Sitemap[number] => ({
        url: `${BASE}/villa/${villa.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    ),
    {
      url: `${BASE}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...GUIDES.map(
      (guide): MetadataRoute.Sitemap[number] => ({
        url: `${BASE}/guide/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    ),
  ]
}
