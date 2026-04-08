'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { storeRepository } from '@/features/data-layer/repository';
import { usePreferences } from '@/features/preferences/preferences-context';
import { resolveProductsByIds } from '@/features/preferences/selection-utils';
import { formatPrice } from '@/lib/format';

export function CompareClient(): JSX.Element {
  const { compareIds, compareCount, maxCompareItems, removeCompare, clearCompare } = usePreferences();
  const products = storeRepository.getPublicProducts();

  const compareProducts = useMemo(
    () => resolveProductsByIds(compareIds, products),
    [compareIds, products]
  );

  const specKeys = useMemo(() => {
    const all = new Set<string>();
    compareProducts.forEach((product) => {
      Object.keys(product.specs).forEach((key) => all.add(key));
    });
    return Array.from(all);
  }, [compareProducts]);

  if (!compareProducts.length) {
    return (
      <section className="container py-10 md:py-14">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-premium sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Сравнение</p>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl">Сравнение характеристик</h1>
          <p className="mt-3 text-muted-foreground">
            Добавьте до {maxCompareItems} товаров в сравнение из каталога или карточки товара, чтобы увидеть ключевые отличия.
          </p>
          <Link href="/catalog" className="mt-5 inline-flex">
            <Button>Выбрать товары</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-8 md:py-12">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Сравнение</p>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl">Сравнение характеристик</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Выбрано {compareCount} из {maxCompareItems} товаров
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/catalog">
            <Button variant="outline">Добавить товар</Button>
          </Link>
          <Button variant="outline" onClick={clearCompare}>
            Очистить список
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-premium">
        <table className="min-w-[760px] w-full border-collapse">
          <thead>
            <tr className="border-b border-black/10 bg-[#fff8fc]">
              <th className="w-[240px] px-4 py-4 text-left text-sm font-medium text-muted-foreground">Параметр</th>
              {compareProducts.map((product) => (
                <th key={product.id} className="min-w-[240px] px-4 py-4 text-left align-top">
                  <Link href={`/catalog/${product.slug}`} className="font-heading text-base leading-tight hover:text-primary">
                    {product.name}
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground">{formatPrice(product.price)} наличными</p>
                  <button
                    type="button"
                    className="mt-2 text-xs text-muted-foreground transition hover:text-foreground"
                    onClick={() => removeCompare(product.id)}
                  >
                    Убрать из сравнения
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specKeys.map((key) => (
              <tr key={key} className="border-b border-black/10 last:border-b-0">
                <td className="px-4 py-3 text-sm text-muted-foreground">{key}</td>
                {compareProducts.map((product) => (
                  <td key={`${product.id}-${key}`} className="px-4 py-3 text-sm text-foreground">
                    {product.specs[key] ?? <span className="text-muted-foreground">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
