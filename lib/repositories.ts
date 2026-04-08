import { categories, products } from '@/data/mock';
import type { Category, Product } from '@/types/catalog';

export interface CatalogRepository {
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
}

export class MockCatalogRepository implements CatalogRepository {
  async getAllProducts(): Promise<Product[]> {
    return products;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return products.find((product) => product.slug === slug) ?? null;
  }

  async getCategories(): Promise<Category[]> {
    return categories;
  }
}

export const catalogRepository: CatalogRepository = new MockCatalogRepository();
