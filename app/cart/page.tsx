import type { Metadata } from 'next';

import { CartView } from '@/components/cart/cart-view';
import { BRAND_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/cart' },
  title: 'Корзина',
  description: 'Корзина Techno Agents: конфигурации товаров, получение и прозрачный расчет стоимости.',
  keywords: ['корзина магазина техники', 'оформление заказа техника'],
  robots: { index: false, follow: false },
  openGraph: {
    title: `${BRAND_NAME} — Корзина`,
    description: 'Проверьте выбранные товары и условия оплаты перед оформлением.',
    url: '/cart'
  },
  twitter: {
    card: 'summary',
    title: `${BRAND_NAME} — Корзина`,
    description: 'Проверьте выбранные товары и условия оплаты перед оформлением.'
  }
};

export default function CartPage(): JSX.Element {
  return (
    <>
      <section className="container pb-2 pt-6 md:pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order Review</p>
        <h1 className="font-heading text-3xl md:text-4xl">Корзина</h1>
      </section>
      <CartView />
    </>
  );
}
