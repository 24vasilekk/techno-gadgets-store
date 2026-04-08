'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container py-16 md:py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#0f1014] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Служебное сообщение</p>
        <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Страница временно недоступна</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Это обычно занимает несколько секунд. Обновите экран или повторите попытку позже.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={reset}>Обновить сейчас</Button>
          <Link href="/" className="inline-flex">
            <Button variant="outline">На главную</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
