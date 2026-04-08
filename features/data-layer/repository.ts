'use client';

import { categories } from '@/data/mock';
import type { Category, Product } from '@/types/catalog';
import {
  ADMIN_PRODUCTS_STORAGE_KEY,
  createSeedAdminProducts,
  parseManagedProducts,
  type AdminManagedProduct
} from '@/features/admin/products';
import {
  ADMIN_HOME_BLOCKS_STORAGE_KEY,
  createSeedHomeBlocks,
  parseManagedHomeBlocks,
  type HomeBlockConfig
} from '@/features/admin/home-blocks';
import {
  ADMIN_ORDERS_STORAGE_KEY,
  createSeedAdminOrders,
  parseAdminOrders,
  type AdminOrderRecord
} from '@/features/admin/orders';
import {
  ADMIN_STORE_SETTINGS_STORAGE_KEY,
  getDefaultStoreSettings,
  parseStoreSettings,
  type StoreSettings
} from '@/features/admin/store-settings';

export type StoreRepository = {
  getCategories(): Category[];
  getManagedProducts(): AdminManagedProduct[];
  saveManagedProducts(value: AdminManagedProduct[]): void;
  getPublicProducts(): Product[];
  getHomeBlocks(): HomeBlockConfig[];
  saveHomeBlocks(value: HomeBlockConfig[]): void;
  getStoreSettings(): StoreSettings;
  saveStoreSettings(value: StoreSettings): void;
  getOrders(): AdminOrderRecord[];
  saveOrders(value: AdminOrderRecord[]): void;
};

class LocalStorageStoreRepository implements StoreRepository {
  getCategories(): Category[] {
    return categories;
  }

  getManagedProducts(): AdminManagedProduct[] {
    if (typeof window === 'undefined') return createSeedAdminProducts();
    const parsed = parseManagedProducts(window.localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY));
    return parsed && parsed.length ? parsed : createSeedAdminProducts();
  }

  saveManagedProducts(value: AdminManagedProduct[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(value));
  }

  getPublicProducts(): Product[] {
    return this.getManagedProducts().filter((item) => !item.hidden).map((item) => item.product);
  }

  getHomeBlocks(): HomeBlockConfig[] {
    if (typeof window === 'undefined') return createSeedHomeBlocks().blocks;
    const parsed = parseManagedHomeBlocks(window.localStorage.getItem(ADMIN_HOME_BLOCKS_STORAGE_KEY));
    return (parsed?.blocks ?? createSeedHomeBlocks().blocks).sort((a, b) => a.order - b.order);
  }

  saveHomeBlocks(value: HomeBlockConfig[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      ADMIN_HOME_BLOCKS_STORAGE_KEY,
      JSON.stringify({ blocks: value, updatedAt: new Date().toISOString() })
    );
  }

  getStoreSettings(): StoreSettings {
    if (typeof window === 'undefined') return getDefaultStoreSettings();
    const parsed = parseStoreSettings(window.localStorage.getItem(ADMIN_STORE_SETTINGS_STORAGE_KEY));
    return parsed ?? getDefaultStoreSettings();
  }

  saveStoreSettings(value: StoreSettings): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ADMIN_STORE_SETTINGS_STORAGE_KEY, JSON.stringify(value));
  }

  getOrders(): AdminOrderRecord[] {
    if (typeof window === 'undefined') return createSeedAdminOrders();
    const parsed = parseAdminOrders(window.localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY));
    return parsed && parsed.length ? parsed : createSeedAdminOrders();
  }

  saveOrders(value: AdminOrderRecord[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ADMIN_ORDERS_STORAGE_KEY, JSON.stringify(value));
  }
}

export const storeRepository: StoreRepository = new LocalStorageStoreRepository();

