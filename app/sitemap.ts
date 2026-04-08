import type { MetadataRoute } from 'next';

import { getCategories, getProducts } from '@/lib/catalog';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/catalog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 }
  ];

  const categoryPages: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: `${SITE_URL}/catalog/category/${category.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8
  }));

  const productPages: MetadataRoute.Sitemap = getProducts().map((product) => ({
    url: `${SITE_URL}/catalog/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
