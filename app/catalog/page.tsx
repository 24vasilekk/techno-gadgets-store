import { Suspense } from 'react';
import type { Metadata } from 'next';

import { CatalogClient } from '@/components/catalog/catalog-client';
import { getCategories, getProducts } from '@/lib/catalog';
import { BRAND_NAME, DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/seo';
import CatalogLoading from '@/app/catalog/loading';

export const metadata: Metadata = {
  alternates: { canonical: '/catalog' },
  title: 'Каталог',
  description: 'Каталог Techno Agents: iPhone, Apple Watch, аксессуары и флагманские смартфоны в актуальных конфигурациях.',
  keywords: ['каталог техники', 'iPhone цены', 'Apple Watch купить', 'смартфоны'],
  openGraph: {
    title: `${BRAND_NAME} — Каталог`,
    description: 'Каталог техники с фильтрами по бренду, цене и наличию.',
    url: '/catalog',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${BRAND_NAME} — каталог` }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} — Каталог`,
    description: 'Каталог техники с фильтрами по бренду, цене и наличию.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function CatalogPage(): JSX.Element {
  const products = getProducts();
  const categories = getCategories();
  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Каталог — ${BRAND_NAME}`,
    url: `${SITE_URL}/catalog`,
    description: 'Каталог техники с фильтрацией по бренду, цене, наличию и характеристикам.'
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }} />
      <Suspense fallback={<CatalogLoading />}>
        <CatalogClient products={products} categories={categories} />
      </Suspense>
    </>
  );
}
