'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { appendAdminOrderFromCheckout } from '@/features/admin/orders';
import { useStoreSettings } from '@/features/admin/store-settings';
import { storeRepository } from '@/features/data-layer/repository';
import { useCart } from '@/features/cart/cart-context';
import { getProductPricesWithOptions } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import type { CheckoutDeliveryMethod, CheckoutPaymentMethod, OrderLineItemPayload, OrderRequestPayload } from '@/lib/order';
import { getDeliveryFee } from '@/lib/pricing';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

function isPhoneValid(value: string): boolean {
  const normalized = value.replace(/\D/g, '');
  return normalized.length >= 10 && normalized.length <= 15;
}

function isTelegramValid(value: string): boolean {
  const normalized = value.trim().replace(/^@+/, '');
  if (!normalized) return true;
  return /^[a-zA-Z0-9_]{5,32}$/.test(normalized);
}

export function CheckoutForm(): JSX.Element {
  const settings = useStoreSettings();
  const {
    items,
    getItemKey,
    updateQuantity,
    removeItem,
    subtotalCash,
    deliveryMethod: cartDeliveryMethod,
    paymentMethod: cartPaymentMethod,
    clearCart
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<CheckoutDeliveryMethod>(cartDeliveryMethod);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>(cartPaymentMethod === 'cash' ? 'cash' : 'card');
  const [comment, setComment] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [orderReference, setOrderReference] = useState<string | null>(null);
  const deliveryOptions = useMemo(
    () => settings.deliveryMethods.filter((method) => method.enabled).map((method) => ({ value: method.id, label: method.label })),
    [settings.deliveryMethods]
  );
  const paymentOptions = useMemo(
    () => settings.paymentMethods.filter((method) => method.enabled).map((method) => ({ value: method.id, label: method.label })),
    [settings.paymentMethods]
  );

  const enrichedItems = useMemo(() => {
    const products = storeRepository.getPublicProducts();

    return items
      .map((item): (OrderLineItemPayload & { itemKey: string; lineCash: number; lineByPayment: number }) | null => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) return null;

        const selectedOptions = (product.configuration.optionGroups ?? [])
          .map((group) => {
            const valueId = item.selectedOptionValues?.[group.id];
            if (!valueId) return null;
            const value = group.values.find((option) => option.id === valueId);
            if (!value) return null;
            return `${group.label}: ${value.label}`;
          })
          .filter(Boolean) as string[];

        const selectedColor = product.configuration.colors.find((color) => color.id === item.selectedColorId);
        if (selectedColor) {
          selectedOptions.unshift(`Цвет: ${selectedColor.name}`);
        }

        const prices = getProductPricesWithOptions(product, item.selectedOptionValues);
        const unitPriceCash = prices.cash;
        const unitPriceCard = prices.card;
        const lineCash = unitPriceCash * item.quantity;
        const lineByPayment = paymentMethod === 'cash' ? lineCash : unitPriceCard * item.quantity;

        return {
          itemKey: getItemKey(item),
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          quantity: item.quantity,
          unitPriceCash,
          unitPriceCard,
          selectedOptions,
          lineCash,
          lineByPayment
        };
      })
      .filter(Boolean) as Array<OrderLineItemPayload & { itemKey: string; lineCash: number; lineByPayment: number }>;
  }, [items, getItemKey, paymentMethod]);

  const totalByPayment = useMemo(
    () =>
      paymentMethod === 'cash'
        ? enrichedItems.reduce((sum, line) => sum + line.lineCash, 0)
        : enrichedItems.reduce((sum, line) => sum + line.lineByPayment, 0),
    [enrichedItems, paymentMethod]
  );
  const deliveryFee = useMemo(() => getDeliveryFee(deliveryMethod), [deliveryMethod]);
  const grandTotal = useMemo(() => totalByPayment + deliveryFee, [totalByPayment, deliveryFee]);
  const canSubmit = enrichedItems.length > 0 && submitState !== 'loading';

  const validate = (): boolean => {
    if (customerName.trim().length < 2) {
      setFieldError('Укажите имя, чтобы мы могли обратиться к вам.');
      return false;
    }
    if (!isPhoneValid(phone)) {
      setFieldError('Проверьте номер телефона: нужно минимум 10 цифр.');
      return false;
    }
    if (!isTelegramValid(telegramUsername)) {
      setFieldError('Telegram username указан некорректно.');
      return false;
    }
    if (deliveryMethod === 'delivery' && deliveryAddress.trim().length < 6) {
      setFieldError('Укажите адрес доставки.');
      return false;
    }
    if (!enrichedItems.length) {
      setFieldError('Корзина пуста. Добавьте товары перед отправкой.');
      return false;
    }
    setFieldError(null);
    return true;
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitState('idle');

    if (!validate()) return;

    const payload: OrderRequestPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      telegramUsername: telegramUsername.trim(),
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress.trim() : undefined,
      paymentMethod,
      comment: comment.trim(),
      items: enrichedItems.map(({ itemKey: _itemKey, lineCash: _lineCash, lineByPayment: _lineByPayment, ...line }) => line),
      totals: {
        subtotalCash,
        totalByPayment,
        deliveryFee,
        grandTotal,
        currency: 'RUB'
      }
    };

    setSubmitState('loading');

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        orderId?: string;
        createdAt?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setSubmitState('error');
        setSubmitMessage(data?.error ?? 'Не удалось отправить заявку. Попробуйте позже.');
        return;
      }

      if (data.orderId && data.createdAt) {
        appendAdminOrderFromCheckout(data.orderId, data.createdAt, payload, 'checkout');
      }

      setOrderReference(data.orderId ?? null);
      setSubmitState('success');
      clearCart();
    } catch {
      setSubmitState('error');
      setSubmitMessage('Ошибка сети. Проверьте соединение и повторите отправку.');
    }
  }

  if (submitState === 'success') {
    return (
      <section className="container py-8 md:py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-black/10 bg-[linear-gradient(165deg,#ffffff,#fff7fc)] p-6 text-center shadow-premium md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Заявка отправлена</p>
          <h1 className="mt-2 font-heading text-3xl leading-tight md:text-4xl">Спасибо, заказ принят в работу</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {orderReference ? `Номер заявки: ${orderReference}. ` : ''}
            Мы свяжемся с вами для подтверждения деталей и времени получения.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/catalog">
              <Button>Продолжить выбор</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">На главную</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="container py-6 md:py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-6 text-center shadow-premium md:p-8">
          <h1 className="font-heading text-3xl">Корзина пуста</h1>
          <p className="mt-2 text-sm text-muted-foreground">Добавьте товары в корзину, и здесь появится оформление заказа.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/catalog">
              <Button>Перейти в каталог</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline">Открыть корзину</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-6 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-black/10 bg-white p-5 shadow-premium md:p-6">
          <header>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Checkout</p>
            <h1 className="mt-2 font-heading text-3xl leading-tight md:text-4xl">Оформление заказа</h1>
            <p className="mt-2 text-sm text-muted-foreground">Проверьте состав, заполните контакты и отправьте заявку в Telegram.</p>
          </header>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl">Состав заказа</h2>
            <div className="space-y-3">
              {enrichedItems.map((line) => (
                <article key={line.itemKey} className="rounded-xl border border-black/10 bg-[#fff9fc] p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{line.productName}</p>
                      {line.selectedOptions.length ? <p className="mt-1 text-xs text-muted-foreground">{line.selectedOptions.join(' • ')}</p> : null}
                    </div>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground transition hover:text-foreground"
                      onClick={() => removeItem(line.itemKey)}
                    >
                      Удалить
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-black/15 bg-white">
                      <button
                        type="button"
                        className="h-9 w-9 text-lg transition hover:bg-black/[0.04]"
                        onClick={() => updateQuantity(line.itemKey, line.quantity - 1)}
                        aria-label="Уменьшить количество"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        className="h-9 w-9 text-lg transition hover:bg-black/[0.04]"
                        onClick={() => updateQuantity(line.itemKey, line.quantity + 1)}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Итого по позиции</p>
                      <p className="font-medium">{formatPrice(line.lineByPayment)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-xl md:text-2xl">Контактные данные</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Имя</span>
                <Input autoComplete="name" placeholder="Например, Алексей" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Телефон</span>
                <Input autoComplete="tel" inputMode="tel" placeholder="+7 999 123-45-67" value={phone} onChange={(event) => setPhone(event.target.value)} required />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm text-muted-foreground">Telegram username (необязательно)</span>
                <Input placeholder="@username" value={telegramUsername} onChange={(event) => setTelegramUsername(event.target.value)} />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-xl md:text-2xl">Получение и оплата</h2>

            <fieldset className="space-y-2">
              <legend className="text-sm text-muted-foreground">Способ получения</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDeliveryMethod(option.value)}
                    className={`min-h-11 rounded-md border px-4 py-2 text-left text-sm transition ${
                      deliveryMethod === option.value
                        ? 'border-primary/60 bg-primary/10 text-foreground'
                        : 'border-black/15 bg-white text-muted-foreground hover:border-black/30 hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {deliveryMethod === 'delivery' ? (
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Адрес доставки</span>
                <Input
                  placeholder="Город, улица, дом, квартира/офис"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  required
                />
              </label>
            ) : null}

            <fieldset className="space-y-2">
              <legend className="text-sm text-muted-foreground">Способ оплаты</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentMethod(option.value)}
                    className={`min-h-11 rounded-md border px-4 py-2 text-left text-sm transition ${
                      paymentMethod === option.value
                        ? 'border-primary/60 bg-primary/10 text-foreground'
                        : 'border-black/15 bg-white text-muted-foreground hover:border-black/30 hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{settings.pricingNotes.card}</p>
            </fieldset>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl md:text-2xl">Комментарий</h2>
            <textarea
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Комментарий по времени связи, доставке или комплектации"
              className="w-full rounded-md border border-black/12 bg-white px-3 py-2 text-sm text-foreground outline-none transition hover:border-black/25 focus-visible:ring-2 focus-visible:ring-primary/70"
            />
          </section>

          {fieldError ? <p className="text-sm text-red-600">{fieldError}</p> : null}
          {submitMessage ? <p className="text-sm text-red-600">{submitMessage}</p> : null}

          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {submitState === 'loading' ? 'Отправляем заявку...' : 'Отправить заявку в Telegram'}
          </Button>
        </form>

        <aside className="h-fit rounded-2xl border border-black/10 bg-[linear-gradient(165deg,#ffffff,#fff7fc)] p-5 shadow-premium md:p-6 lg:sticky lg:top-24">
          <h2 className="font-heading text-2xl">Итоги заказа</h2>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Товары (наличные)</span>
              <span>{formatPrice(subtotalCash)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Товары ({paymentMethod === 'cash' ? 'наличные' : 'карта/иной'})</span>
              <span>{formatPrice(totalByPayment)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Доставка</span>
              <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Бесплатно'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-3 font-heading text-base text-foreground">
              <span>Итого</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <p className="mt-4 rounded-lg border border-black/10 bg-white p-3 text-xs leading-relaxed text-muted-foreground">
            Стоимость при оплате картой или иным безналичным способом может отличаться от наличной цены. Финальный расчет фиксируется при подтверждении заказа.
          </p>
        </aside>
      </div>
    </section>
  );
}
