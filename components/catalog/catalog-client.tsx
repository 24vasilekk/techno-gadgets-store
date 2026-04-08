'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Icon } from '@/components/icons';
import { MotionPanel } from '@/components/motion/primitives';
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type HomeBlockConfig } from '@/features/admin/home-blocks';
import { storeRepository } from '@/features/data-layer/repository';
import { useStoreSettings } from '@/features/admin/store-settings';
import { formatPrice } from '@/lib/format';
import { motionTokens } from '@/lib/motion';
import type { Category, HomeMainCategory, Product } from '@/types/catalog';

type CatalogClientProps = {
  products: Product[];
  categories: Category[];
};

type SortKey = 'popular' | 'new' | 'price';

type FilterState = {
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

function parseFilters(searchParams: URLSearchParams): FilterState {
  const rawSort = searchParams.get('sort');
  const sort: SortKey = rawSort === 'new' || rawSort === 'price' ? rawSort : 'popular';
  const rawMainBlock = searchParams.get('mainBlock');
  const mainBlock: '' | HomeMainCategory =
    rawMainBlock === 'apple' ||
    rawMainBlock === 'accessories' ||
    rawMainBlock === 'smartphones' ||
    rawMainBlock === 'other'
      ? rawMainBlock
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

export function CatalogClient({ products, categories }: CatalogClientProps): JSX.Element {
  const settings = useStoreSettings();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [runtimeProducts, setRuntimeProducts] = useState<Product[]>(products);
  const [homeBlocks, setHomeBlocks] = useState<HomeBlockConfig[]>([]);
  const reduceMotion = useReducedMotion();

  const derivedBrands = useMemo(
    () => Array.from(new Set(runtimeProducts.map((item) => item.brand))).sort((a, b) => a.localeCompare(b)),
    [runtimeProducts]
  );

  const derivedColors = useMemo(
    () =>
      Array.from(new Set(runtimeProducts.flatMap((item) => item.configuration.colors.map((color) => color.name)))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [runtimeProducts]
  );

  const [filters, setFilters] = useState<FilterState>(parseFilters(new URLSearchParams(searchParams.toString())));

  useEffect(() => {
    setRuntimeProducts(storeRepository.getPublicProducts());
    setHomeBlocks(storeRepository.getHomeBlocks());
  }, []);

  useEffect(() => {
    setFilters(parseFilters(new URLSearchParams(searchParams.toString())));
    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), 140);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const setUrlFilters = (next: FilterState) => {
    const params = new URLSearchParams();

    if (next.q) params.set('q', next.q);
    if (next.category) params.set('category', next.category);
    if (next.mainBlock) params.set('mainBlock', next.mainBlock);
    if (next.brands.length) params.set('brands', next.brands.join(','));
    if (next.colors.length) params.set('colors', next.colors.join(','));
    if (next.inStock) params.set('inStock', '1');
    if (next.minPrice) params.set('minPrice', next.minPrice);
    if (next.maxPrice) params.set('maxPrice', next.maxPrice);
    if (next.sort !== 'popular') params.set('sort', next.sort);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const updateFilters = (patch: Partial<FilterState>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    setUrlFilters(next);
  };

  const toggleMultiValue = (field: 'brands' | 'colors', value: string) => {
    const exists = filters[field].includes(value);
    const nextValues = exists ? filters[field].filter((item) => item !== value) : [...filters[field], value];
    updateFilters({ [field]: nextValues } as Partial<FilterState>);
  };

  const filteredProducts = useMemo(() => {
    const q = filters.q.toLowerCase().trim();
    const parsedMin = filters.minPrice ? Number(filters.minPrice) : null;
    const parsedMax = filters.maxPrice ? Number(filters.maxPrice) : null;
    const minPrice = typeof parsedMin === 'number' && Number.isFinite(parsedMin) ? parsedMin : null;
    const maxPrice = typeof parsedMax === 'number' && Number.isFinite(parsedMax) ? parsedMax : null;

    const activeMainBlockConfig = homeBlocks.find((block) => block.id === filters.mainBlock);
    const featuredSet = new Set(activeMainBlockConfig?.featuredProductIds ?? []);
    const result = runtimeProducts
      .filter((product) => {
        if (q) {
          const text = `${product.name} ${product.brand} ${product.shortDescription}`.toLowerCase();
          if (!text.includes(q)) return false;
        }
        if (filters.mainBlock && product.mainCategory !== filters.mainBlock) return false;
        if (filters.category) {
          const category = categories.find((item) => item.slug === filters.category);
          if (!category || product.categoryId !== category.id) return false;
        }
        if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
        if (filters.colors.length) {
          const productColors = product.configuration.colors.map((color) => color.name);
          if (!filters.colors.some((color) => productColors.includes(color))) return false;
        }
        if (filters.inStock && !product.inStock) return false;
        if (minPrice !== null && product.price < minPrice) return false;
        if (maxPrice !== null && product.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        const aFeatured = featuredSet.has(a.id) ? 1 : 0;
        const bFeatured = featuredSet.has(b.id) ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        if (filters.sort === 'price') return a.price - b.price;
        if (filters.sort === 'new') return +new Date(b.createdAt) - +new Date(a.createdAt);
        return b.popularity - a.popularity;
      });

    return result;
  }, [runtimeProducts, categories, filters, homeBlocks]);

  const clearFilters = () => {
    const reset: FilterState = {
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
    setFilters(reset);
    setUrlFilters(reset);
  };

  const FiltersContent = (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Поиск</p>
        <div className="relative">
          <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Модель, бренд или серия"
            value={filters.q}
            onChange={(event) => updateFilters({ q: event.target.value })}
          />
        </div>
        <p className="text-xs text-muted-foreground">Поиск работает по названию, бренду и краткому описанию.</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Главный блок</p>
        <motion.div className="flex flex-wrap gap-2" layout>
          <Button
            variant={filters.mainBlock ? 'outline' : 'default'}
            size="sm"
            className="min-h-10"
            onClick={() => updateFilters({ mainBlock: '' })}
          >
            Все блоки
          </Button>
          {homeBlocks.map((block) => (
            <Button
              key={block.id}
              variant={filters.mainBlock === block.id ? 'default' : 'outline'}
              size="sm"
              className="min-h-10"
              onClick={() => updateFilters({ mainBlock: block.id })}
            >
              {block.title}
            </Button>
          ))}
        </motion.div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Категория</p>
        <motion.div className="flex flex-wrap gap-2" layout>
          <Button
            variant={filters.category ? 'outline' : 'default'}
            size="sm"
            className="min-h-10"
            onClick={() => updateFilters({ category: '' })}
          >
            Все категории
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filters.category === category.slug ? 'default' : 'outline'}
              size="sm"
              className="min-h-10"
              onClick={() => updateFilters({ category: category.slug })}
            >
              {category.name}
            </Button>
          ))}
        </motion.div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Бренд</p>
        <motion.div className="flex flex-wrap gap-2" layout>
          {derivedBrands.map((brand) => (
            <Button
              key={brand}
              variant={filters.brands.includes(brand) ? 'default' : 'outline'}
              size="sm"
              className="min-h-10"
              onClick={() => toggleMultiValue('brands', brand)}
            >
              {brand}
            </Button>
          ))}
        </motion.div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Цвет</p>
        <motion.div className="flex flex-wrap gap-2" layout>
          {derivedColors.map((color) => (
            <Button
              key={color}
              variant={filters.colors.includes(color) ? 'default' : 'outline'}
              size="sm"
              className="min-h-10"
              onClick={() => toggleMultiValue('colors', color)}
            >
              {color}
            </Button>
          ))}
        </motion.div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Цена</p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Мин."
            value={filters.minPrice}
            onChange={(event) => updateFilters({ minPrice: event.target.value })}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Макс."
            value={filters.maxPrice}
            onChange={(event) => updateFilters({ maxPrice: event.target.value })}
          />
        </div>
        <p className="text-xs text-muted-foreground">{settings.pricingNotes.cash}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Наличие</p>
        <Button
          variant={filters.inStock ? 'default' : 'outline'}
          size="sm"
          className="min-h-10"
          onClick={() => updateFilters({ inStock: !filters.inStock })}
        >
          Только доступные сейчас
        </Button>
      </div>

      <Button variant="ghost" className="w-full" onClick={clearFilters}>
        Очистить фильтры
      </Button>
    </div>
  );

  return (
    <section className="container py-6 md:py-10">
      <div className="mb-5 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Каталог Techno Agents</p>
          <h1 className="font-heading text-[1.85rem] leading-tight md:text-4xl">Техника в актуальных конфигурациях</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Найдено моделей: <span className="text-foreground">{filteredProducts.length}</span>
          </p>
          {filters.mainBlock ? (
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-primary/85">
              Активный блок: {homeBlocks.find((block) => block.id === filters.mainBlock)?.title ?? filters.mainBlock}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <span className="hidden items-center text-muted-foreground sm:inline-flex">
            <Icon name="sort" size={16} />
          </span>
          <label htmlFor="catalog-sort" className="sr-only">
            Сортировка
          </label>
          <div className="relative w-full sm:w-auto">
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(event) => updateFilters({ sort: event.target.value as SortKey })}
              className="h-12 w-full appearance-none rounded-xl border border-black/12 bg-[linear-gradient(160deg,#ffffff,#fff5fb)] px-4 pr-11 text-base font-medium text-foreground shadow-premiumSm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 sm:min-w-[260px]"
            >
              <option value="popular">Сначала популярные</option>
              <option value="new">Сначала новинки</option>
              <option value="price">Сначала дешевле</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/80" aria-hidden>
              ▾
            </span>
          </div>

          <Button variant="outline" className="w-full lg:hidden sm:w-auto" onClick={() => setMobileFiltersOpen(true)}>
            <Icon name="filter" size={16} className="mr-2" />
            Фильтры
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:gap-6 lg:grid-cols-[290px,1fr]">
        <aside className="hidden h-fit rounded-2xl border border-black/10 bg-white p-4 shadow-premium lg:sticky lg:top-24 lg:block">
          {FiltersContent}
        </aside>

        <motion.div layout>
          {isFiltering ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length ? (
            <motion.div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3" layout>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                    transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
                  >
                    <ProductCard product={product} mode="catalog" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
              <p className="font-heading text-xl">По выбранным параметрам сейчас пусто</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Попробуйте расширить диапазон цены, убрать часть фильтров или изменить поисковый запрос.
              </p>
              <Button onClick={clearFilters} className="mt-4">
                Сбросить все параметры
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px] lg:hidden"
              aria-label="Закрыть фильтры"
              onClick={() => setMobileFiltersOpen(false)}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
            />
            <MotionPanel className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl border border-black/12 bg-[linear-gradient(165deg,#ffffff,#fff7fc)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-premiumLg lg:hidden">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-black/20" />
              <div className="mb-4 flex items-center justify-between">
                <p className="font-heading text-xl">Фильтры</p>
                <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)} aria-label="Закрыть">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {FiltersContent}
              <div className="mt-5 rounded-xl border border-black/10 bg-white p-3 text-sm text-muted-foreground">
                Рабочий диапазон по каталогу: {formatPrice(Math.min(...products.map((item) => item.price)))} -{' '}
                {formatPrice(Math.max(...products.map((item) => item.price)))}
              </div>
            </MotionPanel>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
