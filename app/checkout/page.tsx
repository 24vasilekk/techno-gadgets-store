import type { Metadata } from 'next';

import { CheckoutForm } from '@/components/checkout/checkout-form';
import { BRAND_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/checkout' },
  title: 'Оформление заказа',
  description: 'Оформление заказа в Techno Agents: подтверждение состава корзины, способа получения и оплаты.',
  keywords: ['оформление заказа техника', 'checkout techno agents'],
  robots: { index: false, follow: false },
  openGraph: {
    title: `${BRAND_NAME} — Оформление заказа`,
    description: 'Подтверждение параметров заказа перед финальным оформлением.',
    url: '/checkout'
  },
  twitter: {
    card: 'summary',
    title: `${BRAND_NAME} — Оформление заказа`,
    description: 'Подтверждение параметров заказа перед финальным оформлением.'
  }
};

export default function CheckoutPage(): JSX.Element {
  return <CheckoutForm />;
}
