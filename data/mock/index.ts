export { categories } from './categories';
export { products, iphoneProducts, appleWatchProducts } from './products';
export { universalProductsMock } from './universal-products';
export { initialCartItems } from './cart';

import { categories } from './categories';
import { products, iphoneProducts, appleWatchProducts } from './products';
import { universalProductsMock } from './universal-products';
import { initialCartItems } from './cart';

export const mockCatalogData = {
  categories,
  products
} as const;

export const mockIphoneCatalogData = {
  categoryId: 'iphone',
  total: iphoneProducts.length,
  products: iphoneProducts
} as const;

export const mockAppleWatchCatalogData = {
  categoryId: 'watch',
  total: appleWatchProducts.length,
  products: appleWatchProducts
} as const;

export const mockCartSeed = initialCartItems;

export const mockUniversalCatalogData = {
  total: universalProductsMock.length,
  products: universalProductsMock
} as const;
