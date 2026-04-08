import { categories, products } from '@/data/mock';
import { getPriceByPaymentMethod } from '@/lib/pricing';
import type { PaymentMethod } from '@/types/catalog';
import type { Category, Product } from '@/types/catalog';

export function getCategories(): Category[] {
  return categories;
}

export function getProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isFeatured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategorySlug(categorySlug?: string): Product[] {
  if (!categorySlug) {
    return products;
  }

  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) {
    return products;
  }

  return products.filter((product) => product.categoryId === category.id);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((category) => category.id === categoryId);
}

export function getSimilarProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, limit);
}

export function getDefaultSelectedOptions(product: Product): Record<string, string> {
  const selected: Record<string, string> = {};

  for (const group of getEnabledOptionGroups(product)) {
    const isRequired = group.required !== false;
    if (!isRequired) continue;

    const firstAvailable = group.values.find((value) => isOptionValueEnabled(value));
    if (firstAvailable) {
      selected[group.id] = firstAvailable.id;
    }
  }

  return selected;
}

export function getEnabledOptionGroups(product: Product) {
  return (product.configuration.optionGroups ?? [])
    .filter((group) => group.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function isOptionValueEnabled(value: { enabled?: boolean; available?: boolean }): boolean {
  return value.enabled !== false && value.available !== false;
}

function getValueModifierByPayment(
  value: { priceModifier?: number; priceModifierCash?: number; priceModifierCard?: number },
  paymentMethod: PaymentMethod
): number {
  if (paymentMethod === 'cash') {
    return value.priceModifierCash ?? value.priceModifier ?? 0;
  }
  return value.priceModifierCard ?? value.priceModifierCash ?? value.priceModifier ?? 0;
}

function getBasePrices(product: Product): { cash: number; card: number } {
  const cash = product.cashPrice ?? product.price;
  const card = product.cardPrice ?? product.pricing?.card ?? getPriceByPaymentMethod(cash, 'card');
  return { cash, card };
}

export function getProductPricesWithOptions(
  product: Product,
  selectedOptionValues?: Record<string, string>
): { cash: number; card: number } {
  const base = getBasePrices(product);
  if (!selectedOptionValues) {
    return base;
  }

  const groups = getEnabledOptionGroups(product);
  const modifier = groups.reduce(
    (sum, group) => {
      const selectedValueId = selectedOptionValues[group.id];
      if (!selectedValueId) return sum;

      const selectedValue = group.values.find((value) => value.id === selectedValueId && isOptionValueEnabled(value));
      if (!selectedValue) return sum;

      return {
        cash: sum.cash + getValueModifierByPayment(selectedValue, 'cash'),
        card: sum.card + getValueModifierByPayment(selectedValue, 'card')
      };
    },
    { cash: 0, card: 0 }
  );

  return {
    cash: base.cash + modifier.cash,
    card: base.card + modifier.card
  };
}

export function getProductPriceWithOptions(product: Product, selectedOptionValues?: Record<string, string>): number {
  return getProductPricesWithOptions(product, selectedOptionValues).cash;
}
