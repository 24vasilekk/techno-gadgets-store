'use client';

import Link from 'next/link';

import { useStoreSettings } from '@/features/admin/store-settings';

export function AboutContactChannels(): JSX.Element {
  const settings = useStoreSettings();
  const socials = [
    { label: 'Threads', href: settings.socialLinks.threads },
    { label: 'Telegram', href: settings.socialLinks.telegram },
    { label: 'Instagram', href: settings.socialLinks.instagram },
    { label: 'Max', href: settings.socialLinks.max }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
      {socials.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex min-h-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm transition-all duration-300 ease-premium hover:border-primary/45 hover:bg-white/[0.07] hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

