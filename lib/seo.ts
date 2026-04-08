import { siteConfig } from '@/data/site-config';

export const SITE_URL = 'https://technoagents.store';

export const BRAND_NAME = siteConfig.storeName;

export const DEFAULT_KEYWORDS = siteConfig.seo.defaultKeywords
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

export const DEFAULT_OG_IMAGE = siteConfig.seo.defaultOgImage;

export function toAbsoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildProductKeywords(name: string, brand: string, category: string): string[] {
  return [
    name,
    `${brand} ${category}`,
    `${category} цена`,
    'купить технику',
    ...DEFAULT_KEYWORDS
  ];
}
