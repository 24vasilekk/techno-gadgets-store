import type {
  PaymentKind,
  PriceDelta,
  ProductPriceResult,
  ProductSelection,
  TechStoreProduct
} from '@/types/product-model';

function applyDelta(base: number, delta?: PriceDelta): number {
  if (!delta) return base;
  if (delta.kind === 'fixed') return base + delta.value;
  return Math.round(base * (1 + delta.value));
}

function matchesRule(
  selection: ProductSelection,
  when: Record<string, string>
): boolean {
  return Object.entries(when).every(([groupKey, valueId]) => selection[groupKey] === valueId);
}

function getCardFromCash(cash: number, product: TechStoreProduct): number {
  return applyDelta(cash, product.pricing.cardMarkup);
}

function findOptionDelta(
  product: TechStoreProduct,
  selection: ProductSelection
): Array<{ source: string; cashDelta: number; cardDelta: number }> {
  const result: Array<{ source: string; cashDelta: number; cardDelta: number }> = [];
  for (const group of product.optionGroups ?? []) {
    const selectedId = selection[group.key];
    if (!selectedId) continue;

    const value = group.values.find((item) => item.id === selectedId);
    if (!value || value.enabled === false) continue;

    const cashDelta = value.deltas?.cash?.kind === 'percent'
      ? Math.round(product.pricing.baseCashPrice * value.deltas.cash.value)
      : value.deltas?.cash?.value ?? 0;
    const cardDelta = value.deltas?.card?.kind === 'percent'
      ? Math.round(getCardFromCash(product.pricing.baseCashPrice, product) * value.deltas.card.value)
      : value.deltas?.card?.value ?? 0;

    result.push({
      source: `${group.key}:${value.id}`,
      cashDelta,
      cardDelta
    });
  }

  return result;
}

function getMatchedCombinationRule(product: TechStoreProduct, selection: ProductSelection) {
  const rules = product.combinationRules ?? [];
  const matched = rules.filter((rule) => matchesRule(selection, rule.when));

  if (!matched.length) return undefined;
  return matched.sort((a, b) => Object.keys(b.when).length - Object.keys(a.when).length)[0];
}

export function isSelectionComplete(product: TechStoreProduct, selection: ProductSelection): boolean {
  for (const group of product.optionGroups ?? []) {
    if (group.enabled === false) continue;
    if (group.required && !selection[group.key]) return false;
  }
  return true;
}

export function getOptionValueState(
  product: TechStoreProduct,
  selection: ProductSelection,
  groupKey: string,
  valueId: string
): { enabled: boolean; reason?: string } {
  const group = (product.optionGroups ?? []).find((item) => item.key === groupKey);
  if (!group || group.enabled === false) return { enabled: false, reason: 'Группа отключена' };

  const value = group.values.find((item) => item.id === valueId);
  if (!value || value.enabled === false) return { enabled: false, reason: 'Опция отключена' };

  const previewSelection = { ...selection, [groupKey]: valueId };
  const rule = getMatchedCombinationRule(product, previewSelection);

  if (rule?.available === false) {
    return { enabled: false, reason: rule.note ?? 'Комбинация недоступна' };
  }

  return { enabled: true };
}

export function checkSelectionAvailability(
  product: TechStoreProduct,
  selection: ProductSelection
): {
  available: boolean;
  stockStatus: TechStoreProduct['inventory']['status'];
  stockCount?: number;
  reason?: string;
} {
  if (!isSelectionComplete(product, selection)) {
    return {
      available: false,
      stockStatus: 'out_of_stock',
      reason: 'Выбраны не все обязательные параметры.'
    };
  }

  const rule = getMatchedCombinationRule(product, selection);
  if (rule?.available === false) {
    return {
      available: false,
      stockStatus: rule.stockStatus ?? 'out_of_stock',
      stockCount: rule.stockCount,
      reason: rule.note ?? 'Комбинация недоступна.'
    };
  }

  const stockStatus = rule?.stockStatus ?? product.inventory.status;
  const stockCount = rule?.stockCount ?? product.inventory.quantity;
  const available = stockStatus !== 'out_of_stock' || Boolean(product.inventory.allowBackorder);

  return {
    available,
    stockStatus,
    stockCount
  };
}

export function calculateConfiguredPrice(
  product: TechStoreProduct,
  selection: ProductSelection
): ProductPriceResult {
  let cash = product.pricing.baseCashPrice;
  let card = getCardFromCash(cash, product);
  const breakdown: ProductPriceResult['breakdown'] = [
    { source: 'base', cashDelta: 0, cardDelta: 0 }
  ];

  for (const delta of findOptionDelta(product, selection)) {
    cash += delta.cashDelta;
    card += delta.cardDelta;
    breakdown.push(delta);
  }

  const rule = getMatchedCombinationRule(product, selection);
  if (rule?.priceDeltaCash) {
    const value = rule.priceDeltaCash.kind === 'percent'
      ? Math.round(product.pricing.baseCashPrice * rule.priceDeltaCash.value)
      : rule.priceDeltaCash.value;
    cash += value;
    breakdown.push({ source: `rule:${rule.id}:cash`, cashDelta: value, cardDelta: 0 });
  }

  if (rule?.priceDeltaCard) {
    const baseCard = getCardFromCash(product.pricing.baseCashPrice, product);
    const value = rule.priceDeltaCard.kind === 'percent'
      ? Math.round(baseCard * rule.priceDeltaCard.value)
      : rule.priceDeltaCard.value;
    card += value;
    breakdown.push({ source: `rule:${rule.id}:card`, cashDelta: 0, cardDelta: value });
  } else {
    card = getCardFromCash(cash, product);
  }

  return { cash, card, breakdown };
}

export function getDisplayPrice(
  product: TechStoreProduct,
  selection: ProductSelection,
  payment: PaymentKind
): number {
  const price = calculateConfiguredPrice(product, selection);
  return payment === 'cash' ? price.cash : price.card;
}

export type ProductSortKey = 'popular' | 'new' | 'price_cash_asc' | 'price_cash_desc';

export function sortProducts(
  items: TechStoreProduct[],
  sortKey: ProductSortKey
): TechStoreProduct[] {
  const next = [...items];
  switch (sortKey) {
    case 'new':
      return next.sort((a, b) => +new Date(b.sortMeta.createdAt) - +new Date(a.sortMeta.createdAt));
    case 'price_cash_asc':
      return next.sort((a, b) => a.pricing.baseCashPrice - b.pricing.baseCashPrice);
    case 'price_cash_desc':
      return next.sort((a, b) => b.pricing.baseCashPrice - a.pricing.baseCashPrice);
    case 'popular':
    default:
      return next.sort((a, b) => b.sortMeta.popularity - a.sortMeta.popularity);
  }
}

export function filterProducts(
  items: TechStoreProduct[],
  filters: {
    showcaseBlock?: TechStoreProduct['showcaseBlock'];
    categorySlug?: string;
    brand?: string;
    tags?: string[];
    minCashPrice?: number;
    maxCashPrice?: number;
    inStockOnly?: boolean;
    q?: string;
  }
): TechStoreProduct[] {
  const q = filters.q?.trim().toLowerCase();

  return items.filter((product) => {
    if (filters.showcaseBlock && product.showcaseBlock !== filters.showcaseBlock) return false;
    if (filters.categorySlug && !product.categories.some((item) => item.slug === filters.categorySlug)) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.tags?.length && !filters.tags.every((tag) => product.filterMeta.tags.includes(tag))) return false;
    if (typeof filters.minCashPrice === 'number' && product.pricing.baseCashPrice < filters.minCashPrice) return false;
    if (typeof filters.maxCashPrice === 'number' && product.pricing.baseCashPrice > filters.maxCashPrice) return false;
    if (filters.inStockOnly && product.inventory.status === 'out_of_stock' && !product.inventory.allowBackorder) return false;
    if (q) {
      const haystack = `${product.title} ${product.shortDescription} ${product.description} ${product.brand}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

