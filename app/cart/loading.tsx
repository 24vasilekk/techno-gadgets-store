export default function CartLoading(): JSX.Element {
  return (
    <section className="container py-6 md:py-10">
      <div className="mb-5 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Корзина</p>
        <p className="text-sm text-muted-foreground">Собираем выбранные позиции и итоговый расчет.</p>
        <div className="skeleton-shimmer h-3 w-28 rounded bg-white/[0.08]" />
        <div className="skeleton-shimmer h-10 w-40 rounded bg-white/[0.08]" />
      </div>

      <div className="grid gap-5 md:gap-6 lg:grid-cols-[1fr,340px]">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton-shimmer h-36 rounded-xl border border-black/10 bg-white" />
          ))}
        </div>
        <div className="skeleton-shimmer h-72 rounded-xl border border-black/10 bg-white" />
      </div>
    </section>
  );
}
