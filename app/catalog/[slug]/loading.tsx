export default function ProductLoading(): JSX.Element {
  return (
    <section className="container py-6 md:py-10">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Карточка товара</p>
      <p className="mb-4 text-sm text-muted-foreground">Готовим изображения, параметры и цену конфигурации.</p>
      <div className="skeleton-shimmer mb-4 h-5 w-56 rounded bg-white/[0.08]" />

      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1.05fr,0.95fr] xl:gap-10">
        <div className="space-y-3">
          <div className="skeleton-shimmer aspect-square rounded-2xl border border-white/10 bg-white/[0.05]" />
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton-shimmer aspect-square rounded-xl border border-white/10 bg-white/[0.04]" />
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5">
          <div className="skeleton-shimmer h-6 w-1/2 rounded bg-white/[0.08]" />
          <div className="skeleton-shimmer h-10 w-4/5 rounded bg-white/[0.08]" />
          <div className="skeleton-shimmer h-4 w-full rounded bg-white/[0.06]" />
          <div className="skeleton-shimmer h-4 w-5/6 rounded bg-white/[0.06]" />
          <div className="skeleton-shimmer h-44 rounded-xl bg-white/[0.04]" />
        </div>
      </div>
    </section>
  );
}
