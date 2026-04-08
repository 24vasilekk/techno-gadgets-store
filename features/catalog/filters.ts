import type { HomeMainCategory } from '@/types/catalog';

export type SortKey = 'popular' | 'new' | 'price';

export type CatalogFilterState = {
  q: string;
  category: string;
  mainBlock: '' | HomeMainCategory;
  brands: string[];
  colors: string[];
  inStock: boolean;
  minPrice: string;
  maxPrice: string;
  sort: SortKey;
};

const allowedMainBlocks = new Set<HomeMainCategory>(['apple', 'accessories', 'smartphones', 'other']);

export function parseCatalogFilters(searchParams: URLSearchParams): CatalogFilterState {
  const rawSort = searchParams.get('sort');
  const sort: SortKey = rawSort === 'new' || rawSort === 'price' ? rawSort : 'popular';

  const rawMainBlock = searchParams.get('mainBlock');
  const mainBlock: '' | HomeMainCategory =
    rawMainBlock && allowedMainBlocks.has(rawMainBlock as HomeMainCategory)
      ? (rawMainBlock as HomeMainCategory)
      : '';

  return {
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    mainBlock,
    brands: (searchParams.get('brands') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    colors: (searchParams.get('colors') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    inStock: searchParams.get('inStock') === '1',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    sort
  };
}

export function catalogFiltersToSearchParams(filters: CatalogFilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.mainBlock) params.set('mainBlock', filters.mainBlock);
  if (filters.brands.length) params.set('brands', filters.brands.join(','));
  if (filters.colors.length) params.set('colors', filters.colors.join(','));
  if (filters.inStock) params.set('inStock', '1');
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.sort !== 'popular') params.set('sort', filters.sort);

  return params;
}

export function createDefaultCatalogFilters(): CatalogFilterState {
  return {
    q: '',
    category: '',
    mainBlock: '',
    brands: [],
    colors: [],
    inStock: false,
    minPrice: '',
    maxPrice: '',
    sort: 'popular'
  };
}

export function toggleFilterValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
