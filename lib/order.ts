import { formatPrice } from '@/lib/format';

export type CheckoutDeliveryMethod = 'pickup' | 'delivery';
export type CheckoutPaymentMethod = 'cash' | 'card' | 'other';

export type OrderLineItemPayload = {
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPriceCash: number;
  unitPriceCard: number;
  selectedOptions: string[];
};

export type OrderRequestPayload = {
  customerName: string;
  phone: string;
  telegramUsername?: string;
  deliveryMethod: CheckoutDeliveryMethod;
  deliveryAddress?: string;
  paymentMethod: CheckoutPaymentMethod;
  comment?: string;
  items: OrderLineItemPayload[];
  totals: {
    subtotalCash: number;
    totalByPayment: number;
    deliveryFee: number;
    grandTotal: number;
    currency: 'RUB';
  };
};

const DELIVERY_LABELS: Record<CheckoutDeliveryMethod, string> = {
  pickup: 'Самовывоз',
  delivery: 'Доставка'
};

const PAYMENT_LABELS: Record<CheckoutPaymentMethod, string> = {
  cash: 'Наличные',
  card: 'Карта / безнал',
  other: 'Другой способ'
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

function isValidPhone(value: string): boolean {
  const normalized = normalizePhone(value);
  const digitsOnly = normalized.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function normalizeTelegramUsername(value: string): string {
  const normalized = value.trim().replace(/^@+/, '');
  return normalized ? `@${normalized}` : '';
}

function isValidTelegramUsername(value: string): boolean {
  const normalized = normalizeTelegramUsername(value);
  if (!normalized) return true;
  return /^@[a-zA-Z0-9_]{5,32}$/.test(normalized);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function validateOrderPayload(payload: unknown): { ok: true; data: OrderRequestPayload } | { ok: false; error: string } {
  if (!isObject(payload)) {
    return { ok: false, error: 'Некорректный формат заявки.' };
  }

  const customerName = typeof payload.customerName === 'string' ? payload.customerName.trim() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const telegramUsername = typeof payload.telegramUsername === 'string' ? payload.telegramUsername.trim() : '';
  const comment = typeof payload.comment === 'string' ? payload.comment.trim() : '';
  const deliveryMethod = payload.deliveryMethod;
  const deliveryAddress = typeof payload.deliveryAddress === 'string' ? payload.deliveryAddress.trim() : '';
  const paymentMethod = payload.paymentMethod;
  const items = payload.items;
  const totals = payload.totals;

  if (customerName.length < 2 || customerName.length > 80) {
    return { ok: false, error: 'Укажите корректное имя.' };
  }
  if (!isValidPhone(phone)) {
    return { ok: false, error: 'Укажите корректный телефон.' };
  }
  if (!isValidTelegramUsername(telegramUsername)) {
    return { ok: false, error: 'Укажите корректный Telegram username.' };
  }
  if (deliveryMethod !== 'pickup' && deliveryMethod !== 'delivery') {
    return { ok: false, error: 'Некорректный способ получения.' };
  }
  if (deliveryMethod === 'delivery' && (deliveryAddress.length < 6 || deliveryAddress.length > 220)) {
    return { ok: false, error: 'Укажите адрес доставки.' };
  }
  if (paymentMethod !== 'cash' && paymentMethod !== 'card' && paymentMethod !== 'other') {
    return { ok: false, error: 'Некорректный способ оплаты.' };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'Корзина пуста.' };
  }
  if (!isObject(totals)) {
    return { ok: false, error: 'Некорректные итоги заказа.' };
  }

  const normalizedItems: OrderLineItemPayload[] = [];
  for (const item of items) {
    if (!isObject(item)) return { ok: false, error: 'Некорректный состав корзины.' };

    const productId = typeof item.productId === 'string' ? item.productId : '';
    const productName = typeof item.productName === 'string' ? item.productName : '';
    const productSlug = typeof item.productSlug === 'string' ? item.productSlug : '';
    const quantity = typeof item.quantity === 'number' ? item.quantity : NaN;
    const unitPriceCash = typeof item.unitPriceCash === 'number' ? item.unitPriceCash : NaN;
    const unitPriceCard = typeof item.unitPriceCard === 'number' ? item.unitPriceCard : NaN;
    const selectedOptions = Array.isArray(item.selectedOptions)
      ? item.selectedOptions.filter((option): option is string => typeof option === 'string' && option.trim().length > 0)
      : [];

    if (!productId || !productName || !productSlug) return { ok: false, error: 'Некорректные данные товара.' };
    if (!Number.isFinite(quantity) || quantity <= 0) return { ok: false, error: 'Некорректное количество товара.' };
    if (!Number.isFinite(unitPriceCash) || unitPriceCash <= 0) return { ok: false, error: 'Некорректная цена товара.' };
    if (!Number.isFinite(unitPriceCard) || unitPriceCard <= 0) return { ok: false, error: 'Некорректная цена товара.' };

    normalizedItems.push({
      productId,
      productName: productName.trim(),
      productSlug,
      quantity: Math.trunc(quantity),
      unitPriceCash: Math.round(unitPriceCash),
      unitPriceCard: Math.round(unitPriceCard),
      selectedOptions
    });
  }

  const subtotalCash = typeof totals.subtotalCash === 'number' ? totals.subtotalCash : NaN;
  const totalByPayment = typeof totals.totalByPayment === 'number' ? totals.totalByPayment : NaN;
  const deliveryFee = typeof totals.deliveryFee === 'number' ? totals.deliveryFee : NaN;
  const grandTotal = typeof totals.grandTotal === 'number' ? totals.grandTotal : NaN;
  const currency = totals.currency;

  if (!Number.isFinite(subtotalCash) || subtotalCash < 0) return { ok: false, error: 'Некорректная сумма заказа.' };
  if (!Number.isFinite(totalByPayment) || totalByPayment < 0) return { ok: false, error: 'Некорректная сумма заказа.' };
  if (!Number.isFinite(deliveryFee) || deliveryFee < 0) return { ok: false, error: 'Некорректная стоимость доставки.' };
  if (!Number.isFinite(grandTotal) || grandTotal < 0) return { ok: false, error: 'Некорректный итог заказа.' };
  if (currency !== 'RUB') return { ok: false, error: 'Некорректная валюта.' };
  if (comment.length > 600) return { ok: false, error: 'Комментарий слишком длинный.' };

  return {
    ok: true,
    data: {
      customerName,
      phone: normalizePhone(phone),
      telegramUsername: normalizeTelegramUsername(telegramUsername) || undefined,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
      paymentMethod,
      comment,
      items: normalizedItems,
      totals: {
        subtotalCash: Math.round(subtotalCash),
        totalByPayment: Math.round(totalByPayment),
        deliveryFee: Math.round(deliveryFee),
        grandTotal: Math.round(grandTotal),
        currency: 'RUB'
      }
    }
  };
}

export function formatOrderTelegramMessage(order: OrderRequestPayload, orderId: string, createdAtIso: string): string {
  const createdAt = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow'
  }).format(new Date(createdAtIso));

  const lines: string[] = [];
  lines.push('<b>Новая заявка с сайта Techno Agents</b>');
  lines.push('');
  lines.push(`<b>Номер:</b> ${escapeHtml(orderId)}`);
  lines.push(`<b>Время:</b> ${escapeHtml(createdAt)} (МСК)`);
  lines.push('');
  lines.push('<b>Клиент</b>');
  lines.push(`<b>Имя:</b> ${escapeHtml(order.customerName)}`);
  lines.push(`<b>Телефон:</b> ${escapeHtml(order.phone)}`);
  if (order.telegramUsername) {
    lines.push(`<b>Telegram:</b> ${escapeHtml(order.telegramUsername)}`);
  }
  lines.push(`<b>Получение:</b> ${DELIVERY_LABELS[order.deliveryMethod]}`);
  if (order.deliveryAddress) {
    lines.push(`<b>Адрес:</b> ${escapeHtml(order.deliveryAddress)}`);
  }
  lines.push(`<b>Оплата:</b> ${PAYMENT_LABELS[order.paymentMethod]}`);
  lines.push('');
  lines.push('<b>Состав заказа</b>');

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. <b>${escapeHtml(item.productName)}</b> × ${item.quantity}`);
    lines.push(`   Наличные: ${escapeHtml(formatPrice(item.unitPriceCash))} / шт`);
    lines.push(`   Карта/безнал: ${escapeHtml(formatPrice(item.unitPriceCard))} / шт`);
    if (item.selectedOptions.length) {
      lines.push(`   Опции: ${escapeHtml(item.selectedOptions.join(' • '))}`);
    }
  });

  lines.push('');
  lines.push('<b>Итоги</b>');
  lines.push(`<b>Товары (наличные):</b> ${escapeHtml(formatPrice(order.totals.subtotalCash))}`);
  lines.push(`<b>Товары (по оплате):</b> ${escapeHtml(formatPrice(order.totals.totalByPayment))}`);
  lines.push(`<b>Доставка:</b> ${order.totals.deliveryFee > 0 ? escapeHtml(formatPrice(order.totals.deliveryFee)) : 'Бесплатно'}`);
  lines.push(`<b>Итого:</b> ${escapeHtml(formatPrice(order.totals.grandTotal))}`);

  if (order.comment) {
    lines.push('');
    lines.push('<b>Комментарий клиента</b>');
    lines.push(escapeHtml(order.comment));
  }

  return lines.join('\n');
}
