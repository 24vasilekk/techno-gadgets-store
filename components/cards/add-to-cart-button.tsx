'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/cart-context';

type AddToCartButtonProps = {
  productId: string;
  selectedColorId?: string;
  selectedOptionValues?: Record<string, string>;
  className?: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  selectedColorId,
  selectedOptionValues,
  className,
  disabled
}: AddToCartButtonProps): JSX.Element {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    addItem({ productId, selectedColorId, selectedOptionValues });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="space-y-2">
      <Button className={className} onClick={handleClick} disabled={disabled} aria-live="polite">
        {disabled ? 'Недоступно для заказа' : added ? 'Товар добавлен в корзину' : 'Добавить в корзину'}
      </Button>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {added ? 'Конфигурация сохранена. Можно продолжить выбор или перейти в корзину.' : 'В корзину попадет текущая выбранная конфигурация.'}
      </p>
    </div>
  );
}
