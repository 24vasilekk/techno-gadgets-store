import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Techno Agents',
    short_name: 'Techno Agents',
    description: 'Современный магазин iPhone, Apple Watch, аксессуаров и смартфонов.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e0f14',
    theme_color: '#0e0f14',
    lang: 'ru',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      },
      {
        src: '/apple-touch-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml'
      }
    ]
  };
}
