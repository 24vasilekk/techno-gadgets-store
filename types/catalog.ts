export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  available?: boolean;
};

export type ProductOptionValue = {
  id: string;
  label: string;
  priceModifier: number;
  priceModifierCash?: number;
  priceModifierCard?: number;
  visualType?: 'text' | 'color' | 'chip';
  visualValue?: string;
  enabled?: boolean;
  order?: number;
  available?: boolean;
  description?: string;
};

export type ProductOptionGroup = {
  id: string;
  label: string;
  enabled?: boolean;
  required?: boolean;
  order?: number;
  values: ProductOptionValue[];
};

export type ProductAvailabilityStatus = 'in_stock' | 'low_stock' | 'preorder' | 'out_of_stock';
export type HomeMainCategory = 'apple' | 'accessories' | 'smartphones' | 'other';

export type ProductPricing = {
  cash: number;
  card: number;
  cardRate: number;
  cardMarkupType: 'percent' | 'fixed';
  cardMarkupValue: number;
  note?: string;
};

export type ProductConfigurationRules = {
  priceFormula: string;
  optionalGroups?: string[];
  disabledGroups?: string[];
};

export type Product = {
  id: string;
  slug: string;
  category: string;
  subcategory?: string;
  mainCategory: HomeMainCategory;
  title?: string;
  name: string;
  brand: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  cashPrice?: number;
  cardPrice?: number;
  pricing: ProductPricing;
  inStock: boolean;
  availabilityStatus: ProductAvailabilityStatus;
  stockInfo?: {
    status: ProductAvailabilityStatus;
    count?: number;
    note?: string;
  };
  popularity: number;
  createdAt: string;
  stockCount?: number;
  compareAtPrice?: number;
  badge?: string;
  badges?: string[];
  tags?: string[];
  image: string;
  gallery: string[];
  images?: {
    cover: string;
    gallery: string[];
  };
  specifications?: Record<string, string>;
  specs: Record<string, string>;
  isFeatured?: boolean;
  configuration: {
    colors: ProductColor[];
    optionGroups?: ProductOptionGroup[];
  };
  configurationRules?: ProductConfigurationRules;
};

export type PaymentMethod = 'cash' | 'card';
export type DeliveryMethod = 'pickup' | 'delivery';

export type CartItem = {
  productId: string;
  quantity: number;
  selectedColorId?: string;
  selectedOptionValues?: Record<string, string>;
};
