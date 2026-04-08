'use client';

import { useMemo } from 'react';

import { ProductGrid } from '@/components/sections/product-grid';
import { Reveal } from '@/components/motion/reveal';
import { storeRepository } from '@/features/data-layer/repository';

export function FeaturedWeek(): JSX.Element {
  const products = useMemo(() => {
    return storeRepository
      .getPublicProducts()
      .filter((product) => product.isFeatured)
      .slice(0, 6);
  }, []);

  if (!products.length) return <></>;

  return (
    <Reveal className="container py-8 sm:py-10">
      <div className="mb-4 flex items-end justify-between sm:mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Подборка недели</p>
          <h2 className="font-heading text-2xl sm:text-3xl">Техника, которую выбирают сейчас</h2>
        </div>
      </div>
      <ProductGrid products={products} className="grid-cols-2 lg:grid-cols-3" />
    </Reveal>
  );
}
