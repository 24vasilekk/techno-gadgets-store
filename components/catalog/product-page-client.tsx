'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { ProductGrid } from '@/components/sections/product-grid';
import { Reveal } from '@/components/motion/reveal';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { storeRepository } from '@/features/data-layer/repository';
import { toAbsoluteUrl, BRAND_NAME } from '@/lib/seo';

export function ProductPageClient({ slug }: { slug: string }): JSX.Element {
  const products = storeRepository.getPublicProducts();
  const categories = storeRepository.getCategories();
  const product = products.find((item) => item.slug === slug);

  const category = useMemo(
    () => (product ? categories.find((item) => item.id === product.categoryId) : undefined),
    [categories, product]
  );

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
      .slice(0, 3);
  }, [product, products]);

  if (!product) {
    return (
      <section className="container py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="font-heading text-3xl">Товар не найден</h1>
          <p className="mt-2 text-sm text-muted-foreground">Позиция могла быть скрыта или удалена в админке.</p>
          <Link href="/catalog" className="mt-4 inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-primary/40 hover:text-primary">
            Вернуться в каталог
          </Link>
        </div>
      </section>
    );
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [toAbsoluteUrl(product.image), ...product.gallery.map((image) => toAbsoluteUrl(image))],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    category: category?.name ?? product.category,
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: product.price,
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
        url: toAbsoluteUrl(`/catalog/${product.slug}`),
        seller: {
          '@type': 'Organization',
          name: BRAND_NAME
        },
        description: 'Цена при оплате наличными'
      },
      {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: product.cardPrice ?? product.pricing.card,
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
        url: toAbsoluteUrl(`/catalog/${product.slug}`),
        seller: {
          '@type': 'Organization',
          name: BRAND_NAME
        },
        description: 'Цена при оплате картой или безналичным способом'
      }
    ]
  };

  return (
    <>
      <section className="container py-6 md:py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        <div className="mb-4 flex items-center gap-2 overflow-hidden text-sm text-muted-foreground md:mb-5">
          <Link href="/catalog" className="hover:text-foreground">
            Каталог
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{product.name}</span>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-[1.05fr,0.95fr] xl:gap-10">
          <div className="space-y-6">
            <ProductGallery name={product.name} image={product.image} gallery={product.gallery} />
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-2xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] p-5 shadow-premium md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{category?.name ?? 'Техника'}</Badge>
                {product.badge ? <Badge>{product.badge}</Badge> : null}
              </div>

              <div className="space-y-3">
                <h1 className="font-heading text-[1.85rem] leading-tight md:text-4xl">{product.name}</h1>
                <p className="text-base leading-relaxed text-foreground/90">{product.shortDescription}</p>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{product.description}</p>
              </div>
            </div>

            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </section>

      <Reveal className="container pb-8">
        <div className="rounded-2xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] p-5 shadow-premium md:p-6">
          <h2 className="font-heading text-2xl md:text-3xl">Ключевые характеристики</h2>
          <Separator className="my-4" />
          <div className="space-y-3">
            {Object.entries(product.specs).map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-6 text-sm md:text-base">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {similarProducts.length ? (
        <Reveal className="container pb-12 pt-4 md:pb-14">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Также стоит посмотреть</p>
            <h2 className="font-heading text-2xl md:text-3xl">Близкие по классу модели</h2>
          </div>
          <ProductGrid products={similarProducts} />
        </Reveal>
      ) : null}
    </>
  );
}

