import type { Metadata } from 'next';

import { CategoryPageClient } from '@/components/catalog/category-page-client';
import { getCategories } from '@/lib/catalog';
import { BRAND_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export function generateStaticParams(): { category: string }[] {
  return getCategories().map((category) => ({ category: category.slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategories().find((item) => item.slug === params.category);
  if (!category) {
    return {
      title: 'Категория не найдена'
    };
  }

  const canonical = `/catalog/category/${category.slug}`;
  return {
    title: `${category.name} — Категория`,
    description: `${category.description} Каталог ${BRAND_NAME} с актуальными моделями и прозрачными условиями оплаты.`,
    alternates: { canonical },
    openGraph: {
      title: `${BRAND_NAME} — ${category.name}`,
      description: category.description,
      url: canonical,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${BRAND_NAME} — ${category.name}` }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${BRAND_NAME} — ${category.name}`,
      description: category.description,
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default function CategoryPage({ params }: CategoryPageProps): JSX.Element {
  return <CategoryPageClient categorySlug={params.category} />;
}

