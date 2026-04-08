import type { Metadata } from 'next';

import { CategoryShowcase } from '@/components/sections/category-showcase';
import { FaqSection } from '@/components/sections/faq-section';
import { FeaturedWeek } from '@/components/sections/featured-week';
import { Hero } from '@/components/sections/hero';
import { LatestNews } from '@/components/sections/latest-news';
import { SocialStrip } from '@/components/sections/social-strip';
import { BRAND_NAME, DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: 'Главная',
  description: 'Techno Agents — технологичный бутик: iPhone, Apple Watch, аксессуары и флагманские смартфоны.',
  keywords: ['магазин техники', 'купить iPhone', 'Apple Watch', 'смартфоны', 'аксессуары'],
  openGraph: {
    title: `${BRAND_NAME} — Главная`,
    description: 'iPhone, Apple Watch, аксессуары и смартфоны в актуальных конфигурациях.',
    url: '/',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${BRAND_NAME} — главная` }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} — Главная`,
    description: 'iPhone, Apple Watch, аксессуары и смартфоны в актуальных конфигурациях.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function HomePage(): JSX.Element {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_NAME,
    url: SITE_URL,
    inLanguage: 'ru-RU',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/catalog?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND_NAME,
      url: SITE_URL
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <Hero />
      <LatestNews />
      <CategoryShowcase />
      <SocialStrip />
      <FeaturedWeek />
      <FaqSection />
    </>
  );
}
