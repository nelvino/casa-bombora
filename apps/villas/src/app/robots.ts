import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Match middleware semantics: live unless SITE_LIVE is exactly 'false'.
  // Baked at build time, so flipping SITE_LIVE requires a redeploy.
  if (process.env.SITE_LIVE === 'false') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/villa/*/book', '/coming-soon'],
    },
    sitemap: 'https://stay.casabombora.com/sitemap.xml',
  }
}
