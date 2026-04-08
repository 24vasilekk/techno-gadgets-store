import type { PaymentMethod } from '@/types/catalog';
import type { DeliveryMethod } from '@/types/catalog';

export const PAYMENT_RATE = {
  cash: 1,
  card: 1.08
} as const;

export function getPriceByPaymentMethod(cashPrice: number, method: PaymentMethod): number {
  return Math.round(cashPrice * PAYMENT_RATE[method]);
}

export function getDualPrice(cashPrice: number): { cash: number; card: number } {
  return {
    cash: getPriceByPaymentMethod(cashPrice, 'cash'),
    card: getPriceByPaymentMethod(cashPrice, 'card')
  };
}

export function getDeliveryFee(method: DeliveryMethod): number {
  if (method === 'pickup') return 0;
  return 990;
}
