import { ProductCardSkeleton } from '@/components/product/product-card';

export default function CatalogLoading(): JSX.Element {
  return (
    <section className="container py-6 md:py-10">
      <div className="mb-5 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Каталог</p>
        <p className="text-sm text-muted-foreground">Обновляем наличие и конфигурации.</p>
        <div className="skeleton-shimmer h-3 w-36 rounded bg-white/[0.08]" />
        <div className="skeleton-shimmer h-10 w-64 rounded bg-white/[0.08]" />
      </div>

      <div className="grid gap-5 md:gap-6 lg:grid-cols-[290px,1fr]">
        <aside className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:block">
          <div className="space-y-3">
            <div className="skeleton-shimmer h-10 rounded bg-white/[0.08]" />
            <div className="skeleton-shimmer h-28 rounded bg-white/[0.06]" />
            <div className="skeleton-shimmer h-24 rounded bg-white/[0.06]" />
          </div>
        </aside>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
