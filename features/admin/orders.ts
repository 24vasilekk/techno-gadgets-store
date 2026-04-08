import type { OrderRequestPayload } from '@/lib/order';

export const ADMIN_ORDERS_STORAGE_KEY = 'techno-agents-admin-orders';

export type AdminOrderStatus = 'new' | 'processing' | 'confirmed' | 'completed' | 'cancelled';
export type AdminOrderSource = 'checkout' | 'telegram' | 'manual';

export type AdminOrderRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: AdminOrderStatus;
  source: AdminOrderSource;
  customerName: string;
  phone: string;
  telegramUsername?: string;
  deliveryMethod: OrderRequestPayload['deliveryMethod'];
  deliveryAddress?: string;
  paymentMethod: OrderRequestPayload['paymentMethod'];
  comment?: string;
  items: OrderRequestPayload['items'];
  totals: OrderRequestPayload['totals'];
};

export const ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  new: 'Новая',
  processing: 'В обработке',
  confirmed: 'Подтверждена',
  completed: 'Завершена',
  cancelled: 'Отменена'
};

export function parseAdminOrders(raw: string | null): AdminOrderRecord[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminOrderRecord[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((order) => Boolean(order?.id && order?.createdAt && order?.customerName && order?.phone));
  } catch {
    return null;
  }
}

export function createSeedAdminOrders(): AdminOrderRecord[] {
  const now = Date.now();
  return [
    {
      id: 'TG-DEMO-001',
      createdAt: new Date(now - 1000 * 60 * 55).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 35).toISOString(),
      status: 'new',
      source: 'checkout',
      customerName: 'Алексей П.',
      phone: '+79991234567',
      telegramUsername: '@alexp',
      deliveryMethod: 'delivery',
      deliveryAddress: 'Москва, Пресненская наб., 8, ап. 71',
      paymentMethod: 'card',
      comment: 'Связаться после 18:00',
      items: [
        {
          productId: 'iphone-16-pro-max',
          productName: 'iPhone 16 Pro Max',
          productSlug: 'iphone-16-pro-max',
          quantity: 1,
          unitPriceCash: 149990,
          unitPriceCard: 159990,
          selectedOptions: ['Память: 512GB', 'Цвет: Natural Titanium']
        }
      ],
      totals: {
        subtotalCash: 149990,
        totalByPayment: 159990,
        deliveryFee: 1200,
        grandTotal: 161190,
        currency: 'RUB'
      }
    },
    {
      id: 'TG-DEMO-002',
      createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      status: 'processing',
      source: 'telegram',
      customerName: 'Марина С.',
      phone: '+79035557766',
      deliveryMethod: 'pickup',
      paymentMethod: 'cash',
      comment: '',
      items: [
        {
          productId: 'apple-watch-series-10',
          productName: 'Apple Watch Series 10',
          productSlug: 'apple-watch-series-10',
          quantity: 1,
          unitPriceCash: 53990,
          unitPriceCard: 57500,
          selectedOptions: ['Размер: 46mm', 'Ремешок: Sport Band']
        },
        {
          productId: 'airpods-pro-2',
          productName: 'AirPods Pro 2',
          productSlug: 'airpods-pro-2',
          quantity: 1,
          unitPriceCash: 23990,
          unitPriceCard: 25500,
          selectedOptions: []
        }
      ],
      totals: {
        subtotalCash: 77980,
        totalByPayment: 77980,
        deliveryFee: 0,
        grandTotal: 77980,
        currency: 'RUB'
      }
    }
  ];
}

export function persistAdminOrders(orders: AdminOrderRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function readAdminOrders(): AdminOrderRecord[] {
  if (typeof window === 'undefined') return createSeedAdminOrders();
  const parsed = parseAdminOrders(window.localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY));
  return parsed && parsed.length ? parsed : createSeedAdminOrders();
}

export function appendAdminOrderFromCheckout(
  orderId: string,
  createdAt: string,
  payload: OrderRequestPayload,
  source: AdminOrderSource = 'checkout'
): AdminOrderRecord[] {
  const current = readAdminOrders();
  const nextOrder: AdminOrderRecord = {
    id: orderId,
    createdAt,
    updatedAt: createdAt,
    status: 'new',
    source,
    customerName: payload.customerName,
    phone: payload.phone,
    telegramUsername: payload.telegramUsername,
    deliveryMethod: payload.deliveryMethod,
    deliveryAddress: payload.deliveryAddress,
    paymentMethod: payload.paymentMethod,
    comment: payload.comment,
    items: payload.items,
    totals: payload.totals
  };

  const withoutDuplicate = current.filter((order) => order.id !== orderId);
  const next = [nextOrder, ...withoutDuplicate].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  persistAdminOrders(next);
  return next;
}
