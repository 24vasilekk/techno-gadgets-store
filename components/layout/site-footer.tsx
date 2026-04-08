'use client';

import Link from 'next/link';

import { useStoreSettings } from '@/features/admin/store-settings';

export function SiteFooter(): JSX.Element {
  const year = new Date().getFullYear();
  const settings = useStoreSettings();
  const footerText = settings.footerText.replace('{year}', String(year));

  return (
    <footer className="mt-14 border-t border-border/70 md:mt-20">
      <div className="container grid gap-8 py-8 sm:py-10 md:grid-cols-3">
        <div>
          <div className="font-heading text-lg font-semibold">
            {settings.logoTextMain} <span className="text-primary">{settings.logoTextAccent}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {settings.footerDescription}
          </p>
        </div>
        <div>
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-muted-foreground">Разделы</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/catalog"
                className="inline-flex rounded-full px-2 py-1 text-muted-foreground transition-all duration-300 ease-premium hover:bg-black/[0.05] hover:text-foreground"
              >
                Каталог
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="inline-flex rounded-full px-2 py-1 text-muted-foreground transition-all duration-300 ease-premium hover:bg-black/[0.05] hover:text-foreground"
              >
                О нас
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="inline-flex rounded-full px-2 py-1 text-muted-foreground transition-all duration-300 ease-premium hover:bg-black/[0.05] hover:text-foreground"
              >
                Корзина
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-muted-foreground">Связь</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{settings.contactPhone}</li>
            <li>{settings.contactEmail}</li>
            <li>
              <Link href={settings.socialLinks.telegram} target="_blank" rel="noreferrer noopener" className="hover:text-foreground">
                Telegram
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5">
        <div className="container py-4 text-xs text-muted-foreground">{footerText}</div>
      </div>
    </footer>
  );
}
