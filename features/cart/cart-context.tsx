'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initialCartItems } from '@/data/mock';
import { getProductPricesWithOptions } from '@/lib/catalog';
import { storeRepository } from '@/features/data-layer/repository';
import { getDeliveryFee } from '@/lib/pricing';
import type { CartItem, DeliveryMethod, PaymentMethod } from '@/types/catalog';

type AddToCartPayload = {
  productId: string;
  quantity?: number;
  selectedColorId?: string;
  selectedOptionValues?: Record<string, string>;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  getItemKey: (item: CartItem) => string;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalCash: number;
  totalPrice: number; // subtotal adjusted by payment method
  deliveryFee: number;
  grandTotal: number;
};

const CART_STORAGE_KEY = 'techno-agents-cart';
const PAYMENT_STORAGE_KEY = 'techno-agents-payment-method';
const DELIVERY_STORAGE_KEY = 'techno-agents-delivery-method';

const CartContext = createContext<CartContextValue | undefined>(undefined);

function normalizeOptionValues(values?: Record<string, string>): Record<string, string> {
  if (!values) return {};

  return Object.keys(values)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      const value = values[key];
      if (value) acc[key] = value;
      return acc;
    }, {});
}

function createItemKey(item: Pick<CartItem, 'productId' | 'selectedColorId' | 'selectedOptionValues'>): string {
  return JSON.stringify({
    productId: item.productId,
    selectedColorId: item.selectedColorId ?? null,
    selectedOptionValues: normalizeOptionValues(item.selectedOptionValues)
  });
}

type ParsedCartItem = CartItem & { selectedStorageId?: string };

function isParsedCartItem(value: unknown): value is ParsedCartItem {
  if (!value || typeof value !== 'object') return false;

  const item = value as Partial<ParsedCartItem>;
  return typeof item.productId === 'string' && typeof item.quantity === 'number' && item.quantity > 0;
}

export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ParsedCartItem[];
        const migrated = parsed
          .filter(isParsedCartItem)
          .map((item) => {
            if (item.selectedOptionValues) return item;
            if (!item.selectedStorageId) return item;

            return {
              ...item,
              selectedOptionValues: { memory: item.selectedStorageId }
            };
          });
        setItems(migrated);
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (saved === 'cash' || saved === 'card') {
      setPaymentMethod(saved);
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (saved === 'pickup' || saved === 'delivery') {
      setDeliveryMethod(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(PAYMENT_STORAGE_KEY, paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    window.localStorage.setItem(DELIVERY_STORAGE_KEY, deliveryMethod);
  }, [deliveryMethod]);

  const addItem = ({ productId, quantity = 1, selectedColorId, selectedOptionValues }: AddToCartPayload) => {
    const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.trunc(quantity)) : 1;

    setItems((prev) => {
      const normalizedOptions = normalizeOptionValues(selectedOptionValues);
      const nextItemKey = createItemKey({
        productId,
        selectedColorId,
        selectedOptionValues: normalizedOptions
      });
      const index = prev.findIndex((item) => createItemKey(item) === nextItemKey);

      if (index >= 0) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + safeQuantity
        };
        return next;
      }

      return [...prev, { productId, quantity: safeQuantity, selectedColorId, selectedOptionValues: normalizedOptions }];
    });
  };

  const removeItem = (itemKey: string) => {
    setItems((prev) => prev.filter((item) => createItemKey(item) !== itemKey));
  };

  const updateQuantity = (itemKey: string, quantity: number) => {
    const nextQuantity = Number.isFinite(quantity) ? Math.trunc(quantity) : 1;

    setItems((prev) =>
      prev
        .map((item) =>
          createItemKey(item) === itemKey
            ? {
                ...item,
                quantity: nextQuantity
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const subtotalCash = useMemo(() => {
    const products = storeRepository.getPublicProducts();

    return items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        return sum;
      }

      const prices = getProductPricesWithOptions(product, item.selectedOptionValues);
      return sum + prices.cash * item.quantity;
    }, 0);
  }, [items]);

  const subtotalCard = useMemo(() => {
    const products = storeRepository.getPublicProducts();

    return items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        return sum;
      }

      const prices = getProductPricesWithOptions(product, item.selectedOptionValues);
      return sum + prices.card * item.quantity;
    }, 0);
  }, [items]);

  const totalPrice = useMemo(
    () => (paymentMethod === 'cash' ? subtotalCash : subtotalCard),
    [subtotalCash, subtotalCard, paymentMethod]
  );
  const deliveryFee = useMemo(() => getDeliveryFee(deliveryMethod), [deliveryMethod]);
  const grandTotal = useMemo(() => totalPrice + deliveryFee, [totalPrice, deliveryFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        getItemKey: createItemKey,
        deliveryMethod,
        setDeliveryMethod,
        paymentMethod,
        setPaymentMethod,
        clearCart,
        totalItems,
        subtotalCash,
        totalPrice,
        deliveryFee,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
