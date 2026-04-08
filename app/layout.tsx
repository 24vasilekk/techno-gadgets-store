import type { Metadata, Viewport } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';

import './globals.css';
import { Providers } from '@/app/providers';
import { LayoutChrome } from '@/components/layout/layout-chrome';
import { siteConfig } from '@/data/site-config';
import { BRAND_NAME, DEFAULT_KEYWORDS, DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/seo';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s | ${BRAND_NAME}`
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [...DEFAULT_KEYWORDS],
  applicationName: 'Techno Agents',
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }]
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — Современный магазин техники`,
    description: 'iPhone, Apple Watch, аксессуары и смартфоны с прозрачными условиями оплаты и аккуратным сервисом.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} — магазин техники`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} — Современный магазин техники`,
    description: 'iPhone, Apple Watch, аксессуары и смартфоны с прозрачными условиями оплаты.',
    images: [DEFAULT_OG_IMAGE]
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0e0f14'
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans`}>
        <Providers>
          <div className="relative min-h-screen">
            <LayoutChrome>{children}</LayoutChrome>
          </div>
        </Providers>
      </body>
    </html>
  );
}
