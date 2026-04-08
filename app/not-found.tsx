import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound(): JSX.Element {
  return (
    <section className="container py-16 md:py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0f1014] p-8 text-center sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Навигация</p>
        <h1 className="mt-2 font-heading text-5xl">404</h1>
        <p className="mt-3 text-muted-foreground">Эта страница недоступна или уже перемещена.</p>
        <Link href="/" className="mt-6 inline-flex">
          <Button>Открыть главную</Button>
        </Link>
      </div>
    </section>
  );
}
