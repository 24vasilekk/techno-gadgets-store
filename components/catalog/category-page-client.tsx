'use client';

import Link from 'next/link';

import { ProductGrid } from '@/components/sections/product-grid';
import { storeRepository } from '@/features/data-layer/repository';
import { BRAND_NAME, SITE_URL } from '@/lib/seo';

export function CategoryPageClient({ categorySlug }: { categorySlug: string }): JSX.Element {
  const categories = storeRepository.getCategories();
  const category = categories.find((item) => item.slug === categorySlug);

  if (!category) {
    return (
      <section className="container py-6 md:py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="font-heading text-3xl">Категория не найдена</h1>
          <p className="mt-2 text-sm text-muted-foreground">Проверьте адрес или вернитесь в общий каталог.</p>
          <Link href="/catalog" className="mt-5 inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-primary/40 hover:text-primary">
            Перейти в каталог
          </Link>
        </div>
      </section>
    );
  }

  const products = storeRepository.getPublicProducts().filter((product) => product.categoryId === category.id);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — ${BRAND_NAME}`,
    description: category.description,
    url: `${SITE_URL}/catalog/category/${category.slug}`
  };

  return (
    <section className="container py-6 md:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="mb-6 space-y-3 md:mb-8">
        <div className="text-sm text-muted-foreground">
          <Link href="/catalog" className="hover:text-foreground">
            Каталог
          </Link>{' '}
          / <span className="text-foreground">{category.name}</span>
        </div>
        <h1 className="font-heading text-[1.9rem] leading-tight md:text-4xl">{category.name}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{category.description}</p>
      </div>

      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h2 className="font-heading text-2xl">В этой категории пока нет товаров</h2>
          <p className="mt-2 text-sm text-muted-foreground">Загляните в общий каталог, чтобы посмотреть доступные позиции.</p>
          <Link href="/catalog" className="mt-5 inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-primary/40 hover:text-primary">
            Перейти в каталог
          </Link>
        </div>
      )}
    </section>
  );
}

