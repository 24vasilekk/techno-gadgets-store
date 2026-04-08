'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { Reveal } from '@/components/motion/reveal';
import { createSeedHomeBlocks, type HomeBlockConfig } from '@/features/admin/home-blocks';
import { storeRepository } from '@/features/data-layer/repository';
import { motionTokens } from '@/lib/motion';
import { cn } from '@/lib/utils';

type CategoryItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  iconName: IconName | null;
  customSvg?: string;
};

function toCategoryItems(blocks: HomeBlockConfig[]): CategoryItem[] {
  return blocks
    .filter((block) => block.enabled)
    .sort((a, b) => a.order - b.order)
    .map((block) => ({
      id: block.id,
      title: block.title,
      subtitle: block.description,
      href: `/catalog?mainBlock=${block.id}`,
      iconName: block.customSvg.trim()
        ? null
        : (block.iconName as IconName),
      customSvg: block.customSvg
    }));
}

function CategoryCard({ item, index }: { item: CategoryItem; index: number }): JSX.Element {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal delay={index * 0.06}>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
        transition={motionTokens.spring}
      >
        <Link
          href={item.href}
          className={cn(
            'group relative block min-h-[166px] overflow-hidden rounded-2xl border border-black/10 bg-white p-4 text-left shadow-premium transition-all duration-300 ease-premium hover:border-primary/35 sm:min-h-[182px] sm:p-5'
          )}
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          </div>

          <div className="relative flex h-full flex-col justify-between gap-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-[#fff2f9] text-foreground/90 transition-colors duration-300 group-hover:text-primary sm:h-14 sm:w-14">
              {item.iconName ? (
                <Icon name={item.iconName} size={30} />
              ) : (
                <span
                  className="h-[30px] w-[30px] [&>svg]:h-full [&>svg]:w-full"
                  aria-hidden
                  dangerouslySetInnerHTML={{ __html: item.customSvg ?? '' }}
                />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-base leading-tight sm:text-lg">{item.title}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{item.subtitle}</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export function CategoryShowcase(): JSX.Element {
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    toCategoryItems(createSeedHomeBlocks().blocks)
  );

  useEffect(() => {
    setCategories(toCategoryItems(storeRepository.getHomeBlocks()));
  }, []);

  return (
    <section className="container pb-8 pt-4 sm:pb-10 sm:pt-5 md:pb-12 md:pt-8">
      <Reveal className="mb-5 max-w-2xl space-y-2 md:mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Категории</p>
        <h2 className="font-heading text-[1.75rem] leading-tight sm:text-4xl md:text-5xl">Выберите категорию</h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((item, index) => (
          <CategoryCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
