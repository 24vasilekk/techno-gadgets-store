'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/features/admin/store-settings';

export function Hero(): JSX.Element {
  const settings = useStoreSettings();

  return (
    <section className="container py-10 md:py-16">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-luxe md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(238,37,150,0.18),transparent_40%)]" />
        <div className="relative">
          <div className="animate-fade-up space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{settings.hero.eyebrow}</p>
            <h1 className="max-w-3xl font-heading text-4xl leading-[1.05] md:text-6xl">{settings.hero.title}</h1>
            <p className="max-w-lg text-muted-foreground">{settings.hero.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalog">
                <Button size="lg">{settings.hero.ctaPrimary}</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  {settings.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
