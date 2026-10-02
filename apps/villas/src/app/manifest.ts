import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Casa Bombora Villas',
    short_name: 'Casa Bombora',
    description:
      'Two boutique private-pool villas in Pecatu, Uluwatu, Bali. Book direct.',
    start_url: '/',
    display: 'standalone',
    background_color: '#EEEAE0',
    theme_color: '#1D2632',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
