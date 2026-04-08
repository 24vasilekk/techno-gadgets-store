'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Reveal } from '@/components/motion/reveal';

type NewsItem = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
};

const NEWS: NewsItem[] = [
  {
    id: 'apple-pencil-ipad',
    date: '25 марта 2026',
    title: 'Apple Pencil и iPad: полное руководство по совместимости моделей',
    excerpt: 'Коротко разобрали, какие стилусы подходят к каждой линейке iPad и что важно перед покупкой.',
    image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'iphone17-cameras',
    date: '22 марта 2026',
    title: 'iPhone 17: обновления камеры и новые фоторежимы',
    excerpt: 'Что изменилось в сенсорах, кому это реально нужно и как выбрать версию под свои сценарии.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'watch-ultra-guide',
    date: '18 марта 2026',
    title: 'Apple Watch Ultra: кому подойдет в 2026 году',
    excerpt: 'Сравнили автономность, датчики и сценарии для спорта, путешествий и ежедневного использования.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80'
  }
];

function NewsCard({ item }: { item: NewsItem }): JSX.Element {
  return (
    <article className="min-w-[86%] snap-start overflow-hidden rounded-3xl border border-black/10 bg-white shadow-premium sm:min-w-[420px]">
      <div className="relative aspect-[16/10]">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 86vw, 420px" />
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">{item.date}</p>
        <h3 className="font-heading text-3xl leading-[1.05] sm:text-[2.05rem]">{item.title}</h3>
        <p className="text-base leading-relaxed text-muted-foreground">{item.excerpt}</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-lg font-semibold text-primary transition hover:opacity-80"
        >
          Читать далее
          <span aria-hidden>›</span>
        </Link>
      </div>
    </article>
  );
}

export function LatestNews(): JSX.Element {
  return (
    <section className="container py-8 sm:py-10">
      <Reveal className="mb-5 max-w-3xl space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Журнал Techno Agents</p>
        <h2 className="font-heading text-[2rem] leading-[1.05] sm:text-5xl">
          <span className="relative inline-block">
            Последние
            <span className="pointer-events-none absolute -bottom-2 left-0 h-2 w-full rounded-full bg-primary/80" />
          </span>{' '}
          новости
        </h2>
        <p className="text-lg leading-relaxed text-muted-foreground">Короткие разборы новинок и полезные гайды по выбору техники.</p>
      </Reveal>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NEWS.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
