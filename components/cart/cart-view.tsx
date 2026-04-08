'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { storeRepository } from '@/features/data-layer/repository';
import { useStoreSettings } from '@/features/admin/store-settings';
import { useCart } from '@/features/cart/cart-context';
import { getProductPricesWithOptions } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { motionTokens } from '@/lib/motion';

export function CartView(): JSX.Element {
  const settings = useStoreSettings();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    subtotalCash,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    deliveryFee,
    grandTotal,
    getItemKey
  } = useCart();
  const products = storeRepository.getPublicProducts();
  const deliveryLabelMap = new Map(settings.deliveryMethods.map((method) => [method.id, method.label]));
  const paymentLabelMap = new Map(settings.paymentMethods.map((method) => [method.id, method.label]));
  const pickupEnabled = settings.deliveryMethods.some((method) => method.id === 'pickup' && method.enabled);
  const deliveryEnabled = settings.deliveryMethods.some((method) => method.id === 'delivery' && method.enabled);
  const cashEnabled = settings.paymentMethods.some((method) => method.id === 'cash' && method.enabled);
  const cardEnabled = settings.paymentMethods.some((method) => method.id === 'card' && method.enabled);
  const reduceMotion = useReducedMotion();

  const enriched = items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;

      const selectedOptionLabels = (product.configuration.optionGroups ?? [])
        .map((group) => {
          const selectedValueId = item.selectedOptionValues?.[group.id];
          if (!selectedValueId) return null;

          const selectedValue = group.values.find((value) => value.id === selectedValueId);
          if (!selectedValue) return null;

          return `${group.label}: ${selectedValue.label}`;
        })
        .filter(Boolean) as string[];
      const selectedColor = product.configuration.colors.find((color) => color.id === item.selectedColorId);
      if (selectedColor) {
        selectedOptionLabels.unshift(`Цвет корпуса: ${selectedColor.name}`);
      }

      const prices = getProductPricesWithOptions(product, item.selectedOptionValues);

      return {
        item,
        itemKey: getItemKey(item),
        product,
        selectedOptionLabels,
        lineCashPrice: prices.cash * item.quantity,
        lineCardPrice: prices.card * item.quantity
      };
    })
    .filter(Boolean);

  if (!enriched.length) {
    return (
      <section className="container py-10 md:py-12">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-premium sm:p-10">
          <h1 className="font-heading text-3xl">Пока ничего не выбрано</h1>
          <p className="mt-2 text-muted-foreground">
            Добавьте в корзину нужные модели и конфигурации — мы сразу пересчитаем итог.
          </p>
          <Link href="/catalog" className="mt-6 inline-flex">
            <Button>Выбрать технику</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container grid gap-5 py-6 md:gap-6 md:py-10 lg:grid-cols-[1fr,340px]">
      <motion.div className="space-y-3" layout>
        <AnimatePresence mode="popLayout">
          {enriched.map((entry) => {
          if (!entry) return null;
          return (
            <motion.article
              key={entry.itemKey}
              className="rounded-xl border border-black/10 bg-white p-4 shadow-premiumSm"
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
            >
              <div className="flex gap-3 sm:gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-black/10 sm:h-24 sm:w-24">
                  <Image src={entry.product.image} alt={entry.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <Link href={`/catalog/${entry.product.slug}`} className="block font-heading text-base leading-tight hover:text-primary sm:text-lg">
                    {entry.product.name}
                  </Link>
                  {entry.selectedOptionLabels.length ? (
                    <p className="text-xs text-muted-foreground">{entry.selectedOptionLabels.join(' • ')}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Наличные: {formatPrice(entry.lineCashPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Карта/безнал: {formatPrice(entry.lineCardPrice)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(entry.itemKey, entry.item.quantity - 1)} aria-label="Уменьшить количество">
                      -
                    </Button>
                    <span className="min-w-8 text-center text-sm">{entry.item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(entry.itemKey, entry.item.quantity + 1)} aria-label="Увеличить количество">
                      +
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto sm:ml-0" onClick={() => removeItem(entry.itemKey)}>
                      Убрать
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
          })}
        </AnimatePresence>
      </motion.div>

      <motion.aside
        className="h-fit rounded-xl border border-black/10 bg-white p-4 shadow-premium sm:p-5 lg:sticky lg:top-24"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.durations.slow, ease: motionTokens.easing }}
      >
        <h2 className="font-heading text-xl">Сводка заказа</h2>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">Получение</p>
          <div className="grid grid-cols-2 gap-2">
            {pickupEnabled ? (
              <Button
                type="button"
                variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeliveryMethod('pickup')}
              >
                <Icon name="pickup" size={14} className="mr-1.5" />
                {deliveryLabelMap.get('pickup') ?? 'Самовывоз'}
              </Button>
            ) : null}
            {deliveryEnabled ? (
              <Button
                type="button"
                variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeliveryMethod('delivery')}
              >
                <Icon name="delivery" size={14} className="mr-1.5" />
                {deliveryLabelMap.get('delivery') ?? 'Доставка'}
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Срок и доступность подтверждаются после резерва.</p>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">Оплата</p>
          <div className="grid grid-cols-2 gap-2">
            {cashEnabled ? (
              <Button
                type="button"
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('cash')}
              >
                <Icon name="cash" size={14} className="mr-1.5" />
                {paymentLabelMap.get('cash') ?? 'Наличные'}
              </Button>
            ) : null}
            {cardEnabled ? (
              <Button
                type="button"
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('card')}
              >
                <Icon name="card" size={14} className="mr-1.5" />
                {paymentLabelMap.get('card') ?? 'Карта / безнал'}
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Разница цены учитывается автоматически и отображается прозрачно.</p>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Товары (наличные)</span>
          <span>{formatPrice(subtotalCash)}</span>
        </div>
        {paymentMethod === 'card' ? (
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>Карта / безнал</span>
            <span>{formatPrice(totalPrice - subtotalCash)}</span>
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Доставка</span>
          <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Бесплатно'}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg">Итого к оплате</span>
          <span className="font-heading text-xl">{formatPrice(grandTotal)}</span>
        </div>
        <Link href="/checkout" className="mt-5 block">
          <Button className="w-full">Продолжить к оформлению</Button>
        </Link>
        <Button variant="ghost" className="mt-2 w-full" onClick={clearCart}>
          Очистить список
        </Button>
      </motion.aside>
    </section>
  );
}
