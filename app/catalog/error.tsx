'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

type CatalogErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CatalogError({ reset }: CatalogErrorProps): JSX.Element {
  return (
    <section className="container py-10 md:py-12">
      <div className="rounded-2xl border border-white/10 bg-[#101116] p-6 text-center sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Служебное сообщение</p>
        <h1 className="mt-2 font-heading text-2xl sm:text-3xl">Каталог временно недоступен</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Попробуйте обновить страницу. Если ошибка повторится, вернитесь на главную.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Обновить каталог</Button>
          <Link href="/" className="inline-flex">
            <Button variant="outline">Перейти на главную</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
