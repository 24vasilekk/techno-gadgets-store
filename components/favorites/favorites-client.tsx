'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { ProductGrid } from '@/components/sections/product-grid';
import { Button } from '@/components/ui/button';
import { storeRepository } from '@/features/data-layer/repository';
import { usePreferences } from '@/features/preferences/preferences-context';

export function FavoritesClient(): JSX.Element {
  const { favoriteIds, favoritesCount, clearFavorites } = usePreferences();
  const products = storeRepository.getPublicProducts();

  const favoriteProducts = useMemo(
    () =>
      favoriteIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is NonNullable<typeof product> => Boolean(product)),
    [favoriteIds, products]
  );

  if (!favoriteProducts.length) {
    return (
      <section className="container py-10 md:py-14">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-premium sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Избранное</p>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl">Пока нет сохраненных моделей</h1>
          <p className="mt-3 text-muted-foreground">
            Добавляйте товары сердцем из каталога и карточки товара, чтобы быстро вернуться к ним позже.
          </p>
          <Link href="/catalog" className="mt-5 inline-flex">
            <Button>Открыть каталог</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-8 md:py-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Избранное</p>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl">Ваши сохраненные товары</h1>
          <p className="mt-2 text-sm text-muted-foreground">Всего позиций: {favoritesCount}</p>
        </div>

        <Button variant="outline" onClick={clearFavorites}>
          Очистить избранное
        </Button>
      </div>

      <ProductGrid products={favoriteProducts} className="md:grid-cols-2 xl:grid-cols-3" />
    </section>
  );
}
