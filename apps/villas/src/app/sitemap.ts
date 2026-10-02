import { MetadataRoute } from 'next'
import { VILLAS } from '@/lib/data/villas'

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
  ]
}
