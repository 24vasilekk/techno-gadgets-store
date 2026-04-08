export type ID = string;

export type MainShowcaseBlock = 'apple' | 'accessories' | 'smartphones' | 'other';
export type PaymentKind = 'cash' | 'card';
export type StockStatus = 'in_stock' | 'low_stock' | 'preorder' | 'out_of_stock';

export type PriceDelta =
  | { kind: 'fixed'; value: number }
  | { kind: 'percent'; value: number };

export type ProductImage = {
  id: ID;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
};

export type ProductCategoryRef = {
  id: ID;
  slug: string;
  name: string;
};

export type ProductBadge = {
  id: ID;
  label: string;
  tone?: 'neutral' | 'accent' | 'success' | 'warning';
};

export type ProductPricingPolicy = {
  baseCashPrice: number;
  cardMarkup: PriceDelta;
  legalNote?: string;
};

export type ProductOptionValue = {
  id: ID;
  label: string;
  swatchHex?: string;
  enabled?: boolean;
  deltas?: {
    cash?: PriceDelta;
    card?: PriceDelta;
  };
};

export type ProductOptionGroup = {
  id: ID;
  key: string;
  label: string;
  type: 'memory' | 'color' | 'size' | 'band' | 'material' | 'condition' | 'sim' | 'custom';
  required?: boolean;
  enabled?: boolean;
  maxSelect?: number;
  values: ProductOptionValue[];
};

export type ProductCombinationRule = {
  id: ID;
  when: Record<string, ID>;
  available?: boolean;
  stockCount?: number;
  stockStatus?: StockStatus;
  priceDeltaCash?: PriceDelta;
  priceDeltaCard?: PriceDelta;
  note?: string;
};

export type ProductInventory = {
  status: StockStatus;
  quantity?: number;
  allowBackorder?: boolean;
};

export type ProductSortMeta = {
  popularity: number;
  createdAt: string;
};

export type ProductFilterMeta = {
  brand: string;
  tags: string[];
  priceRangeHint?: [number, number];
};

export type TechStoreProduct = {
  id: ID;
  slug: string;
  sku?: string;
  title: string;
  shortDescription: string;
  description: string;
  brand: string;
  categories: ProductCategoryRef[];
  subcategories?: ProductCategoryRef[];
  showcaseBlock: MainShowcaseBlock;
  specs: Record<string, string>;
  images: ProductImage[];
  badges?: ProductBadge[];
  pricing: ProductPricingPolicy;
  inventory: ProductInventory;
  optionGroups?: ProductOptionGroup[];
  combinationRules?: ProductCombinationRule[];
  filterMeta: ProductFilterMeta;
  sortMeta: ProductSortMeta;
};

export type ProductSelection = Record<string, ID | undefined>;

export type ProductPriceResult = {
  cash: number;
  card: number;
  breakdown: Array<{
    source: string;
    cashDelta: number;
    cardDelta: number;
  }>;
};

