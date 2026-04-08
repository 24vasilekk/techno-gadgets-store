'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { Icon, type IconName } from '@/components/icons';
import { Reveal } from '@/components/motion/reveal';
import { useStoreSettings } from '@/features/admin/store-settings';
import { motionTokens } from '@/lib/motion';
import { cn } from '@/lib/utils';

type SocialItem = {
  name: 'Threads' | 'Telegram' | 'Instagram' | 'Max';
  href: string;
  iconName: IconName;
};

function SocialCard({ item }: { item: SocialItem }): JSX.Element {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div whileHover={reduceMotion ? undefined : { y: -3 }} transition={motionTokens.spring}>
      <Link
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={item.name}
        className={cn(
          'group relative block min-h-[64px] overflow-hidden rounded-xl border border-black/10 bg-white px-4 py-3 shadow-premium transition-all duration-300 ease-premium hover:border-primary/35 hover:shadow-glowPinkSoft'
        )}
      >
        <div className="pointer-events-none absolute -right-6 -top-8 h-16 w-16 rounded-full bg-primary/20 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-[#fff2f9] text-foreground transition-colors group-hover:text-primary">
            <Icon name={item.iconName} size={20} />
          </span>
          <span className="font-heading text-sm tracking-wide sm:text-base">{item.name}</span>
        </div>
      </Link>
    </motion.div>
  );
}

export function SocialStrip(): JSX.Element {
  const settings = useStoreSettings();
  const socials: SocialItem[] = [
    { name: 'Threads', href: settings.socialLinks.threads, iconName: 'threads' },
    { name: 'Telegram', href: settings.socialLinks.telegram, iconName: 'telegram' },
    { name: 'Instagram', href: settings.socialLinks.instagram, iconName: 'instagram' },
    { name: 'Max', href: settings.socialLinks.max, iconName: 'max' }
  ];

  return (
    <section className="container pb-8 pt-1 sm:pb-10 md:pb-12">
      <Reveal className="rounded-2xl border border-black/10 bg-[linear-gradient(165deg,#ffffff,#fff6fc)] p-4 shadow-premium md:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:items-end sm:justify-between md:mb-5 md:flex-row">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">На связи</p>
            <h2 className="font-heading text-lg md:text-2xl">Наши социальные сети</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Актуальные новинки, обновления ассортимента и последние тренды в мире техники
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {socials.map((item) => (
            <SocialCard key={item.name} item={item} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
