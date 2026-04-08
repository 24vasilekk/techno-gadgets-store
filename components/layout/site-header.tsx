'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Icon } from '@/components/icons';
import { useStoreSettings } from '@/features/admin/store-settings';
import { Button, buttonVariants } from '@/components/ui/button';
import { useCart } from '@/features/cart/cart-context';
import { usePreferences } from '@/features/preferences/preferences-context';
import { useBodyScrollLock } from '@/lib/hooks/use-body-scroll-lock';
import { motionTokens } from '@/lib/motion';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О нас' }
];

const menuItems = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О нас' },
  { href: '/checkout', label: 'Оформление' },
  { href: '/cart', label: 'Корзина', counter: 'cart' as const },
  { href: '/favorites', label: 'Избранное', counter: 'favorites' as const },
  { href: '/compare', label: 'Сравнение', counter: 'compare' as const }
];
type MenuCounter = 'cart' | 'favorites' | 'compare';

type NavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
};

function NavLink({ href, label, active, onClick }: NavLinkProps): JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        'min-h-10 rounded-full px-3 py-2 text-sm',
        'border-transparent text-muted-foreground transition-all duration-300 ease-premium hover:border-black/12 hover:bg-black/[0.04] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
        active && 'border-black/12 bg-black/[0.06] text-foreground'
      )}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { favoritesCount, compareCount } = usePreferences();
  const settings = useStoreSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActiveRoute = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useBodyScrollLock(menuOpen);

  const getCounterValue = (counter?: MenuCounter): number => {
    if (counter === 'cart') return totalItems;
    if (counter === 'favorites') return favoritesCount;
    if (counter === 'compare') return compareCount;
    return 0;
  };

  return (
    <header className="sticky top-0 z-50 px-2 py-2 sm:px-3 md:py-3">
      <div className="glass-header glass-header-premium container relative flex h-14 items-center justify-between gap-3 rounded-2xl px-3 sm:px-4 md:h-16 md:px-6">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

        <Link href="/" className="relative rounded-md font-heading text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
          {settings.logoTextMain} <span className="text-primary">{settings.logoTextAccent}</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} active={isActiveRoute(item.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            aria-label="Избранное"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'relative hidden border border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.04] md:inline-flex'
            )}
          >
            <Icon name="favorite" size={18} />
            {favoritesCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-glowPinkSoft">
                {favoritesCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/compare"
            aria-label="Сравнение"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'relative hidden border border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.04] md:inline-flex'
            )}
          >
            <Icon name="sort" size={18} />
            {compareCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-glowPinkSoft">
                {compareCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/cart"
            aria-label="Корзина"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'relative border border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.04]'
            )}
          >
            <Icon name="cart" size={20} />
            {totalItems > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-glowPinkSoft">
                {totalItems}
              </span>
            ) : null}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="border border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.04]"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            aria-controls="side-nav"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]"
              aria-label="Закрыть меню"
              onClick={() => setMenuOpen(false)}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
            />

            <div className="fixed inset-y-0 left-0 z-50">
              <motion.div
                id="side-nav"
                className="flex h-full w-[min(88vw,380px)] flex-col border-r border-black/12 bg-[linear-gradient(170deg,rgba(255,255,255,0.99),rgba(255,255,255,0.94))] pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-premiumLg backdrop-blur-2xl"
                initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
              >
                <div className="flex h-16 items-center justify-between border-b border-black/10 px-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Меню</p>
                  <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex min-h-12 items-center justify-between rounded-xl px-4 text-base text-foreground transition-all duration-300 ease-premium hover:bg-black/[0.04]',
                        isActiveRoute(item.href) ? 'bg-black/[0.06] font-semibold' : 'font-medium'
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      <span className="inline-flex items-center gap-2">
                        {getCounterValue(item.counter) > 0 ? (
                          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            {getCounterValue(item.counter)}
                          </span>
                        ) : null}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </span>
                    </Link>
                  ))}
                </nav>

                <div className="space-y-2 border-t border-black/10 px-5 py-4 text-sm text-muted-foreground">
                  <p>{settings.contactPhone}</p>
                  <p>{settings.contactEmail}</p>
                  <Link
                    href={settings.socialLinks.telegram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex text-foreground transition hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Telegram
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
