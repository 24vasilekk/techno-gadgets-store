'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Layers, ListTree, LogOut, Menu, Package, Settings2, ShoppingCart, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ADMIN_SESSION_STORAGE_KEY, parseAdminSession } from '@/features/admin/auth';
import { cn } from '@/lib/utils';

type AdminShellProps = {
  children: React.ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/categories', label: 'Категории', icon: ListTree },
  { href: '/admin/home-blocks', label: 'Главные блоки', icon: Layers },
  { href: '/admin/orders', label: 'Заказы / заявки', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Настройки', icon: Settings2 }
];

export function AdminShell({ children }: AdminShellProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [login, setLogin] = useState('');

  useEffect(() => {
    const session = parseAdminSession(window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY));
    if (!session) {
      router.replace('/admin/login');
      return;
    }
    setLogin(session.login);
    setReady(true);
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const activeLabel = useMemo(
    () => navItems.find((item) => (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)))?.label ?? 'Admin',
    [pathname]
  );

  const logout = () => {
    window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    router.replace('/admin/login');
  };

  if (!ready) {
    return (
      <section className="container py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-muted-foreground">Проверяем доступ к admin-зоне...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0d0e13]">
      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 md:px-6 lg:grid-cols-[260px,1fr]">
        <aside className="hidden h-[calc(100vh-2rem)] rounded-2xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-4 lg:flex lg:flex-col">
          <Link href="/admin" className="mb-4 block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
            <p className="font-heading text-lg">Techno Agents</p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Admin Panel</p>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex min-h-11 items-center gap-3 rounded-lg border px-3 text-sm transition',
                    active
                      ? 'border-primary/45 bg-primary/10 text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-white/10 hover:bg-white/[0.04] hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-xs text-muted-foreground">Вход выполнен как</p>
            <p className="truncate text-sm">{login}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={logout}>
              <LogOut className="mr-1.5 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </aside>

        <div className="space-y-4">
          <header className="sticky top-2 z-30 rounded-2xl border border-white/10 bg-black/55 p-3 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Admin</p>
                <h1 className="font-heading text-xl">{activeLabel}</h1>
              </div>
              <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen((prev) => !prev)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            {mobileOpen ? (
              <div className="mt-3 space-y-1 border-t border-white/10 pt-3 lg:hidden">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex min-h-11 items-center gap-3 rounded-lg border px-3 text-sm transition',
                        active
                          ? 'border-primary/45 bg-primary/10 text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-white/10 hover:bg-white/[0.04] hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={logout}>
                  <LogOut className="mr-1.5 h-4 w-4" />
                  Выйти
                </Button>
              </div>
            ) : null}
          </header>

          <main className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4 shadow-premium md:p-6">
            {children}
          </main>
        </div>
      </div>
    </section>
  );
}
