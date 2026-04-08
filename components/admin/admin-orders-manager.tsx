'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ORDER_STATUS_LABELS,
  type AdminOrderRecord,
  type AdminOrderStatus
} from '@/features/admin/orders';
import { storeRepository } from '@/features/data-layer/repository';
import { formatPrice } from '@/lib/format';

const STATUS_OPTIONS: Array<{ value: 'all' | AdminOrderStatus; label: string }> = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: ORDER_STATUS_LABELS.new },
  { value: 'processing', label: ORDER_STATUS_LABELS.processing },
  { value: 'confirmed', label: ORDER_STATUS_LABELS.confirmed },
  { value: 'completed', label: ORDER_STATUS_LABELS.completed },
  { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled }
];

const DELIVERY_LABELS = {
  pickup: 'Самовывоз',
  delivery: 'Доставка'
} as const;

const PAYMENT_LABELS = {
  cash: 'Наличные',
  card: 'Карта / безнал',
  other: 'Иной способ'
} as const;

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function getStatusClass(status: AdminOrderStatus): string {
  if (status === 'new') return 'border-sky-400/40 bg-sky-500/10 text-sky-200';
  if (status === 'processing') return 'border-amber-400/40 bg-amber-500/10 text-amber-200';
  if (status === 'confirmed') return 'border-violet-400/40 bg-violet-500/10 text-violet-200';
  if (status === 'completed') return 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200';
  return 'border-rose-400/40 bg-rose-500/10 text-rose-200';
}

export function AdminOrdersManager(): JSX.Element {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | AdminOrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const seed = storeRepository.getOrders();
    setOrders(seed.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    storeRepository.saveOrders(orders);
  }, [orders, ready]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (!q) return true;
      const text = `${order.customerName} ${order.phone} ${order.telegramUsername ?? ''}`.toLowerCase();
      return text.includes(q);
    });
  }, [orders, statusFilter, search]);

  const selectedOrder = filtered.find((order) => order.id === selectedOrderId) ?? orders.find((order) => order.id === selectedOrderId) ?? null;

  const updateStatus = (orderId: string, status: AdminOrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
  };

  if (!ready) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-muted-foreground">Загружаем заявки...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl">Заказы / заявки</h2>
        <p className="text-sm text-muted-foreground">
          Рабочая таблица заявок с поиском, фильтрацией по статусу и детальным просмотром состава заказа.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 md:grid-cols-[220px,1fr]">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminOrderStatus)}
          className="h-12 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Поиск по имени, телефону, Telegram"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
        <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Заявка</th>
                  <th className="px-4 py-3 font-medium">Клиент</th>
                  <th className="px-4 py-3 font-medium">Оплата / Получение</th>
                  <th className="px-4 py-3 font-medium">Сумма</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className={`cursor-pointer border-b border-white/5 transition hover:bg-white/[0.03] ${
                      selectedOrderId === order.id ? 'bg-white/[0.05]' : ''
                    }`}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <td className="px-4 py-3 align-top">
                      <p className="font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p>{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p>{PAYMENT_LABELS[order.paymentMethod]}</p>
                      <p className="text-xs text-muted-foreground">{DELIVERY_LABELS[order.deliveryMethod]}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="font-medium">{formatPrice(order.totals.grandTotal)}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${getStatusClass(order.status)}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filtered.length ? (
            <div className="p-6 text-center">
              <p className="font-medium">Ничего не найдено</p>
              <p className="text-sm text-muted-foreground">Измените фильтр статуса или поисковый запрос.</p>
            </div>
          ) : null}
        </section>

        <aside className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-heading text-xl">{selectedOrder.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(selectedOrder.createdAt)} • обновлено {formatDateTime(selectedOrder.updatedAt)}
                  </p>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(event) => updateStatus(selectedOrder.id, event.target.value as AdminOrderStatus)}
                  className="h-10 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
                >
                  {STATUS_OPTIONS.filter((item) => item.value !== 'all').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm">
                <p className="font-medium">Контактные данные</p>
                <p className="mt-2">Имя: {selectedOrder.customerName}</p>
                <p>Телефон: {selectedOrder.phone}</p>
                {selectedOrder.telegramUsername ? <p>Telegram: {selectedOrder.telegramUsername}</p> : null}
              </div>

              <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm">
                <p className="font-medium">Оплата и получение</p>
                <p className="mt-2">Оплата: {PAYMENT_LABELS[selectedOrder.paymentMethod]}</p>
                <p>Получение: {DELIVERY_LABELS[selectedOrder.deliveryMethod]}</p>
                {selectedOrder.deliveryAddress ? <p>Адрес: {selectedOrder.deliveryAddress}</p> : null}
              </div>

              <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm">
                <p className="font-medium">Состав заказа</p>
                <div className="mt-2 space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="rounded-md border border-white/10 bg-white/[0.02] p-2.5">
                      <p className="text-sm font-medium">
                        {index + 1}. {item.productName} × {item.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Наличные: {formatPrice(item.unitPriceCash)} / шт • Карта: {formatPrice(item.unitPriceCard)} / шт
                      </p>
                      {item.selectedOptions.length ? (
                        <p className="mt-1 text-xs text-muted-foreground">Опции: {item.selectedOptions.join(' • ')}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm">
                <p className="font-medium">Итоги</p>
                <div className="mt-2 space-y-1 text-muted-foreground">
                  <p>Товары (наличные): {formatPrice(selectedOrder.totals.subtotalCash)}</p>
                  <p>Товары (по оплате): {formatPrice(selectedOrder.totals.totalByPayment)}</p>
                  <p>Доставка: {selectedOrder.totals.deliveryFee > 0 ? formatPrice(selectedOrder.totals.deliveryFee) : 'Бесплатно'}</p>
                  <p className="font-medium text-foreground">Итого: {formatPrice(selectedOrder.totals.grandTotal)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm">
                <p className="font-medium">Комментарий клиента</p>
                <p className="mt-2 text-muted-foreground">{selectedOrder.comment?.trim() || 'Комментарий не оставлен.'}</p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[240px] place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.01] p-4 text-center">
              <div>
                <p className="font-medium">Выберите заявку из таблицы</p>
                <p className="text-sm text-muted-foreground">Здесь появятся детали заказа и управление статусом.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
