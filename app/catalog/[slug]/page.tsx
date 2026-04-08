import type { Metadata } from 'next';

import { ProductPageClient } from '@/components/catalog/product-page-client';
import { getProducts } from '@/lib/catalog';
import { BRAND_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams(): { slug: string }[] {
  return getProducts().map((product) => ({
    slug: product.slug
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProducts().find((item) => item.slug === params.slug);
  if (!product) {
    return { title: 'Карточка недоступна' };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${BRAND_NAME}`,
      description: product.shortDescription,
      url: `/catalog/${product.slug}`,
      images: [{ url: product.image || DEFAULT_OG_IMAGE, alt: product.name }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ${BRAND_NAME}`,
      description: product.shortDescription,
      images: [product.image || DEFAULT_OG_IMAGE]
    }
  };
}

export default function ProductPage({ params }: ProductPageProps): JSX.Element {
  return <ProductPageClient slug={params.slug} />;
}

