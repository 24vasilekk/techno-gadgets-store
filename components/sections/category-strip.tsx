import Link from 'next/link';

import type { Category } from '@/types/catalog';

export function CategoryStrip({ categories }: { categories: Category[] }): JSX.Element {
  return (
    <section className="container py-4">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalog?category=${category.slug}`}
            className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
