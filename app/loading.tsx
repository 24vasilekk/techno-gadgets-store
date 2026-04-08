function SkeletonCard(): JSX.Element {
  return (
    <div className="skeleton-shimmer overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))]">
      <div className="aspect-[4/3] bg-white/[0.06]" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-24 rounded bg-white/[0.08]" />
        <div className="h-6 w-2/3 rounded bg-white/[0.08]" />
        <div className="h-4 w-full rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}

export default function Loading(): JSX.Element {
  return (
    <section className="container py-8 md:py-10">
      <div className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Загрузка</p>
        <p className="text-sm text-muted-foreground">Подготавливаем витрину и актуальные предложения.</p>
        <div className="skeleton-shimmer h-3 w-28 rounded bg-white/[0.08]" />
        <div className="skeleton-shimmer h-10 w-72 rounded bg-white/[0.08]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
}
