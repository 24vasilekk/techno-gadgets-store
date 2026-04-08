import type { Product } from '@/types/catalog';

export function resolveProductsByIds(ids: string[], products: Product[]): Product[] {
  if (!ids.length) return [];

  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}
