'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/features/admin/store-settings';
import { usePreferences } from '@/features/preferences/preferences-context';
import { getDefaultSelectedOptions, getProductPricesWithOptions } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { motionTokens } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/catalog';

type ProductCardProps = {
  product: Product;
  mode?: 'catalog' | 'recommendation';
};

function getStockBadge(product: Product): { label: string; variant: 'default' | 'outline' } {
  if (!product.inStock) return { label: 'Под заказ', variant: 'outline' };
  if (typeof product.stockCount === 'number' && product.stockCount <= 3) return { label: 'Осталось мало', variant: 'default' };
  return { label: 'Доступно', variant: 'outline' };
}

function getMarketingBadge(product: Product): string | null {
  if (!product.badge) return null;
  if (product.badge.toLowerCase() === 'new') return 'Новинка';
  if (product.badge.toLowerCase() === 'хит') return 'Хит';
  return product.badge;
}

export function ProductCard({ product, mode = 'catalog' }: ProductCardProps): JSX.Element {
  const settings = useStoreSettings();
  const { isFavorite, isInCompare, toggleFavorite, toggleCompare, compareCount, maxCompareItems } = usePreferences();
  const prices = getProductPricesWithOptions(product, getDefaultSelectedOptions(product));
  const stockBadge = getStockBadge(product);
  const marketingBadge = getMarketingBadge(product);
  const isCompact = mode === 'recommendation';
  const reduceMotion = useReducedMotion();
  const favoriteActive = isFavorite(product.id);
  const compareActive = isInCompare(product.id);
  const compareLimitReached = !compareActive && compareCount >= maxCompareItems;

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-premium transition-colors duration-300 ease-premium hover:border-primary/35"
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={motionTokens.spring}
      layout
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />
      </div>

      <Link href={`/catalog/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-black/10">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-500 ease-premium group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,#f8fafc,#edf2f7)]">
              <div className="h-10 w-10 rounded-xl border border-black/15" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            {marketingBadge ? <Badge>{marketingBadge}</Badge> : null}
            <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
          </div>
        </div>
      </Link>

      <div className={cn('space-y-2.5 p-3 sm:space-y-3 sm:p-5', isCompact && 'space-y-2')}>
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</p>
          <Link href={`/catalog/${product.slug}`} className="block font-heading text-sm leading-tight hover:text-primary focus-visible:text-primary sm:text-lg">
            {product.name}
          </Link>
          <p className="line-clamp-1 text-xs leading-relaxed text-muted-foreground sm:line-clamp-2 sm:text-sm">{product.shortDescription}</p>
        </div>

        <div className="space-y-1">
          <p className="text-base font-semibold sm:text-lg">{formatPrice(prices.cash)}</p>
          <p className="text-[11px] text-muted-foreground">{settings.pricingNotes.cash}</p>
          <p className="text-[10px] text-muted-foreground sm:text-[11px]">
            Карта / безнал: <span className="text-foreground">{formatPrice(prices.card)}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={favoriteActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleFavorite(product.id)}
            className="h-9 gap-1 px-2 text-[11px] sm:h-10 sm:gap-1.5 sm:px-3 sm:text-xs"
          >
            <Icon name="favorite" size={14} />
            <span className="hidden sm:inline">{favoriteActive ? 'В избранном' : 'В избранное'}</span>
            <span className="sm:hidden">{favoriteActive ? 'В избр.' : 'Избр.'}</span>
          </Button>
          <Button
            type="button"
            variant={compareActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleCompare(product.id)}
            disabled={compareLimitReached}
            className="h-9 gap-1 px-2 text-[11px] sm:h-10 sm:gap-1.5 sm:px-3 sm:text-xs"
          >
            <Icon name="sort" size={14} />
            <span className="hidden sm:inline">{compareActive ? 'В сравнении' : 'Сравнить'}</span>
            <span className="sm:hidden">{compareActive ? 'В срав.' : 'Сравн.'}</span>
          </Button>
        </div>
        {compareLimitReached ? (
          <p className="text-[11px] text-muted-foreground">В сравнении может быть не более {maxCompareItems} товаров.</p>
        ) : null}

        <Link href={`/catalog/${product.slug}`} className="block">
          <Button variant="outline" size="sm" className="h-9 w-full justify-between px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">
            Подробнее
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton(): JSX.Element {
  return (
    <div className="skeleton-shimmer overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="aspect-[4/3] bg-black/[0.04]" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 rounded bg-black/[0.08]" />
        <div className="h-5 w-3/4 rounded bg-black/[0.08]" />
        <div className="h-4 w-full rounded bg-black/[0.06]" />
        <div className="h-4 w-5/6 rounded bg-black/[0.06]" />
        <div className="h-10 w-full rounded-xl bg-black/[0.08]" />
      </div>
    </div>
  );
}
