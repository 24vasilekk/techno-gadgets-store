'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { AddToCartButton } from '@/components/cards/add-to-cart-button';
import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/features/admin/store-settings';
import { usePreferences } from '@/features/preferences/preferences-context';
import { formatPrice } from '@/lib/format';
import {
  getDefaultSelectedOptions,
  getEnabledOptionGroups,
  getProductPricesWithOptions,
  isOptionValueEnabled
} from '@/lib/catalog';
import { motionTokens } from '@/lib/motion';
import type { Product } from '@/types/catalog';

type ProductPurchasePanelProps = {
  product: Product;
};

type DeliveryMethod = 'pickup' | 'delivery';

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps): JSX.Element {
  const settings = useStoreSettings();
  const { isFavorite, isInCompare, toggleFavorite, toggleCompare, compareCount, maxCompareItems } = usePreferences();
  const [selectedColorId, setSelectedColorId] = useState(
    product.configuration.colors.find((color) => color.available !== false)?.id
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(getDefaultSelectedOptions(product));
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const reduceMotion = useReducedMotion();
  const pickupEnabled = settings.deliveryMethods.some((method) => method.id === 'pickup' && method.enabled);
  const deliveryEnabled = settings.deliveryMethods.some((method) => method.id === 'delivery' && method.enabled);
  const pickupLabel = settings.deliveryMethods.find((method) => method.id === 'pickup')?.label ?? 'Самовывоз';
  const deliveryLabel = settings.deliveryMethods.find((method) => method.id === 'delivery')?.label ?? 'Доставка';

  const prices = useMemo(
    () => getProductPricesWithOptions(product, selectedOptions),
    [product, selectedOptions]
  );
  const optionGroups = useMemo(() => getEnabledOptionGroups(product), [product]);

  const selectOption = (groupId: string, valueId: string, available?: boolean) => {
    if (available === false) return;
    setSelectedOptions((prev) => ({ ...prev, [groupId]: valueId }));
  };
  const clearOption = (groupId: string) => {
    setSelectedOptions((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  };
  const requiredGroupsSatisfied = optionGroups
    .filter((group) => group.required !== false)
    .every((group) => Boolean(selectedOptions[group.id]));
  const canAddToCart =
    product.inStock &&
    (product.configuration.colors.length === 0 || Boolean(selectedColorId)) &&
    requiredGroupsSatisfied;
  const favoriteActive = isFavorite(product.id);
  const compareActive = isInCompare(product.id);
  const compareLimitReached = !compareActive && compareCount >= maxCompareItems;

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-[linear-gradient(170deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] p-4 shadow-premium sm:p-5 md:p-6">
      <div className="flex items-center gap-2">
        <Badge variant={product.inStock ? 'default' : 'outline'}>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="stock" size={14} />
            {product.inStock ? 'В наличии' : 'Под заказ'}
          </span>
        </Badge>
        <span className="text-xs text-muted-foreground">{product.brand}</span>
      </div>

      <div className="space-y-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={prices.cash}
            className="font-heading text-[1.9rem] leading-none sm:text-3xl"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
          >
            {formatPrice(prices.cash)}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-muted-foreground">{settings.pricingNotes.cash}</p>
        <motion.p
          key={prices.card}
          className="text-sm leading-relaxed text-muted-foreground"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: motionTokens.durations.base, ease: motionTokens.easing }}
        >
          {settings.pricingNotes.card}{' '}
          <span className="font-medium text-foreground">{formatPrice(prices.card)}</span>
        </motion.p>
        <p className="text-xs text-muted-foreground">
          Нейтральное уточнение: разница связана с условиями обработки платежа и способом расчета.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Цвет</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {product.configuration.colors.map((color) => {
            const isDisabled = color.available === false;
            const isSelected = selectedColorId === color.id;

            return (
              <button
                key={color.id}
                type="button"
                disabled={isDisabled}
                onClick={() => setSelectedColorId(color.id)}
                aria-pressed={isSelected}
                className={`inline-flex min-h-11 items-center rounded-xl border px-3 py-2 text-sm transition-all duration-300 ease-premium ${
                  isSelected
                    ? 'border-primary bg-primary/12 text-foreground shadow-glowPinkSoft'
                    : 'border-white/12 bg-white/[0.03] text-muted-foreground hover:text-foreground'
                } ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
              >
                <span className="mr-2 inline-block h-3.5 w-3.5 rounded-full border border-white/25" style={{ backgroundColor: color.hex }} />
                <span className="truncate">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {optionGroups.map((group, index) => (
        <div key={group.id} className="space-y-3">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            {index === 0 ? <Icon name="config" size={15} /> : null}
            {group.label}
          </p>
          {group.required === false ? (
            <button
              type="button"
              onClick={() => clearOption(group.id)}
              className="rounded-md border border-white/12 px-2 py-1 text-xs text-muted-foreground hover:border-white/20 hover:text-foreground"
            >
              Пропустить параметр
            </button>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            {group.values.map((value) => {
              const isSelected = selectedOptions[group.id] === value.id;
              const isDisabled = !isOptionValueEnabled(value);
              const cashModifier = value.priceModifierCash ?? value.priceModifier ?? 0;

              return (
                <button
                  key={value.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => selectOption(group.id, value.id, value.available)}
                  aria-pressed={isSelected}
                  className={`min-h-11 rounded-xl border px-3 py-2 text-sm transition-all duration-300 ease-premium ${
                    isSelected
                      ? 'border-primary bg-primary/12 text-foreground shadow-glowPinkSoft'
                      : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:text-foreground'
                  } ${isDisabled ? 'cursor-not-allowed opacity-45' : ''}`}
                >
                  <span className="inline-flex items-center gap-2 truncate">
                    {value.visualType === 'color' ? (
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full border border-white/25"
                        style={{ backgroundColor: value.visualValue || '#888' }}
                      />
                    ) : null}
                    <span className="truncate">{value.visualType === 'chip' && value.visualValue ? value.visualValue : value.label}</span>
                  </span>
                  {cashModifier !== 0 ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {cashModifier > 0 ? `+${formatPrice(cashModifier)}` : formatPrice(cashModifier)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Получение</p>
        <div className="grid grid-cols-2 gap-2">
          {pickupEnabled ? (
            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              aria-pressed={deliveryMethod === 'pickup'}
              className={`min-h-16 rounded-xl border px-3 py-3 text-left transition-all duration-300 ease-premium ${
                deliveryMethod === 'pickup'
                  ? 'border-primary bg-primary/12 shadow-glowPinkSoft'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                <Icon name="pickup" size={15} />
                {pickupLabel}
              </p>
              <p className="text-xs text-muted-foreground">Готово сегодня</p>
            </button>
          ) : null}

          {deliveryEnabled ? (
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              aria-pressed={deliveryMethod === 'delivery'}
              className={`min-h-16 rounded-xl border px-3 py-3 text-left transition-all duration-300 ease-premium ${
                deliveryMethod === 'delivery'
                  ? 'border-primary bg-primary/12 shadow-glowPinkSoft'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                <Icon name="delivery" size={15} />
                {deliveryLabel}
              </p>
              <p className="text-xs text-muted-foreground">1–2 дня</p>
            </button>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">Точные сроки подтверждаются после резерва.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant={favoriteActive ? 'default' : 'outline'}
          onClick={() => toggleFavorite(product.id)}
          className="gap-2"
        >
          <Icon name="favorite" size={15} />
          {favoriteActive ? 'В избранном' : 'Добавить в избранное'}
        </Button>
        <Button
          type="button"
          variant={compareActive ? 'default' : 'outline'}
          onClick={() => toggleCompare(product.id)}
          disabled={compareLimitReached}
          className="gap-2"
        >
          <Icon name="sort" size={15} />
          {compareActive ? 'Добавлено в сравнение' : 'Добавить в сравнение'}
        </Button>
      </div>
      {compareLimitReached ? (
        <p className="text-xs text-muted-foreground">Для сравнения доступно максимум {maxCompareItems} товара одновременно.</p>
      ) : null}

      <AddToCartButton
        className="w-full"
        productId={product.id}
        selectedColorId={selectedColorId}
        selectedOptionValues={selectedOptions}
        disabled={!canAddToCart}
      />
    </div>
  );
}
