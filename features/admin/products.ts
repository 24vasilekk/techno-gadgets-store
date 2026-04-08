import { categories as seedCategories, products as seedProducts } from '@/data/mock';
import type {
  Category,
  HomeMainCategory,
  Product,
  ProductAvailabilityStatus,
  ProductOptionGroup
} from '@/types/catalog';

export const ADMIN_PRODUCTS_STORAGE_KEY = 'techno-agents-admin-products';

export type AdminProductFlags = {
  isNew: boolean;
  isHit: boolean;
  recommended: boolean;
};

export type EditableOptionValue = {
  id: string;
  label: string;
  enabled: boolean;
  visualType: 'text' | 'color' | 'chip';
  visualValue: string;
  priceModifierCash: number;
  priceModifierCard: number;
};

export type EditableOptionGroup = {
  id: string;
  label: string;
  enabled: boolean;
  required: boolean;
  values: EditableOptionValue[];
};

export type AdminManagedProduct = {
  id: string;
  product: Product;
  hidden: boolean;
  flags: AdminProductFlags;
  updatedAt: string;
};

export type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  subcategory: string;
  mainCategory: HomeMainCategory;
  stockStatus: ProductAvailabilityStatus;
  stockCount: number;
  cashPrice: number;
  cardPrice: number;
  shortDescription: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  specs: Array<{ key: string; value: string }>;
  hidden: boolean;
  flags: AdminProductFlags;
  optionGroups: EditableOptionGroup[];
};

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toFlags(product: Product): AdminProductFlags {
  const badge = (product.badge ?? '').toLowerCase();
  return {
    isNew: badge === 'new' || badge === 'новинка',
    isHit: badge === 'хит' || badge === 'hit',
    recommended: Boolean(product.isFeatured)
  };
}

function toEditableOptionGroups(optionGroups: ProductOptionGroup[] | undefined): EditableOptionGroup[] {
  return (optionGroups ?? [])
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((group) => ({
      id: group.id,
      label: group.label,
      enabled: group.enabled !== false,
      required: group.required !== false,
      values: [...group.values]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((value) => ({
          id: value.id,
          label: value.label,
          enabled: value.enabled !== false && value.available !== false,
          visualType: value.visualType ?? 'text',
          visualValue: value.visualValue ?? '',
          priceModifierCash: value.priceModifierCash ?? value.priceModifier ?? 0,
          priceModifierCard: value.priceModifierCard ?? value.priceModifierCash ?? value.priceModifier ?? 0
        }))
    }));
}

export function createSeedAdminProducts(): AdminManagedProduct[] {
  return seedProducts.map((product) => ({
    id: product.id,
    product,
    hidden: false,
    flags: toFlags(product),
    updatedAt: new Date().toISOString()
  }));
}

export function parseManagedProducts(raw: string | null): AdminManagedProduct[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminManagedProduct[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((entry) => Boolean(entry?.id && entry?.product?.id));
  } catch {
    return null;
  }
}

export function getCategoryOptions(): Category[] {
  return seedCategories;
}

export function buildInitialForm(categoryId?: string): ProductFormState {
  return {
    name: '',
    slug: '',
    brand: 'Apple',
    categoryId: categoryId ?? 'iphone',
    subcategory: '',
    mainCategory: 'apple',
    stockStatus: 'in_stock',
    stockCount: 1,
    cashPrice: 100000,
    cardPrice: 108000,
    shortDescription: '',
    description: '',
    coverImage: '',
    galleryImages: [],
    specs: [{ key: '', value: '' }],
    hidden: false,
    flags: {
      isNew: false,
      isHit: false,
      recommended: false
    },
    optionGroups: []
  };
}

export function toFormState(entry: AdminManagedProduct): ProductFormState {
  const specs = Object.entries(entry.product.specs).map(([key, value]) => ({ key, value }));

  return {
    id: entry.id,
    name: entry.product.name,
    slug: entry.product.slug,
    brand: entry.product.brand,
    categoryId: entry.product.categoryId,
    subcategory: entry.product.subcategory ?? '',
    mainCategory: entry.product.mainCategory,
    stockStatus: entry.product.availabilityStatus,
    stockCount: entry.product.stockCount ?? entry.product.stockInfo?.count ?? 0,
    cashPrice: entry.product.cashPrice ?? entry.product.price,
    cardPrice: entry.product.cardPrice ?? entry.product.pricing.card,
    shortDescription: entry.product.shortDescription,
    description: entry.product.description,
    coverImage: entry.product.image,
    galleryImages: entry.product.gallery,
    specs: specs.length ? specs : [{ key: '', value: '' }],
    hidden: entry.hidden,
    flags: entry.flags,
    optionGroups: toEditableOptionGroups(entry.product.configuration.optionGroups)
  };
}

export function validateProductForm(
  form: ProductFormState,
  managedProducts: AdminManagedProduct[]
): { ok: true; normalizedSlug: string } | { ok: false; error: string } {
  if (form.name.trim().length < 2) return { ok: false, error: 'Укажите название товара.' };
  if (form.brand.trim().length < 2) return { ok: false, error: 'Укажите бренд.' };
  if (form.shortDescription.trim().length < 8) return { ok: false, error: 'Краткое описание слишком короткое.' };
  if (form.description.trim().length < 20) return { ok: false, error: 'Полное описание слишком короткое.' };
  if (!form.coverImage.trim()) return { ok: false, error: 'Укажите хотя бы одно изображение товара.' };
  if (form.cashPrice <= 0 || form.cardPrice <= 0) return { ok: false, error: 'Цена должна быть больше нуля.' };
  if (form.stockCount < 0) return { ok: false, error: 'Остаток не может быть отрицательным.' };

  const normalizedSlug = normalizeSlug(form.slug || form.name);
  if (!normalizedSlug) return { ok: false, error: 'Слаг должен содержать латиницу/цифры.' };

  const slugTaken = managedProducts.some((entry) => entry.product.slug === normalizedSlug && entry.id !== form.id);
  if (slugTaken) return { ok: false, error: 'Товар с таким slug уже существует.' };

  const hasAnySpec = form.specs.some((spec) => spec.key.trim() && spec.value.trim());
  if (!hasAnySpec) return { ok: false, error: 'Добавьте хотя бы одну характеристику.' };

  for (const group of form.optionGroups) {
    if (!group.id.trim() || !group.label.trim()) return { ok: false, error: 'Параметр должен иметь id и название.' };
    if (!group.values.length) return { ok: false, error: `Добавьте хотя бы одно значение для параметра "${group.label}".` };

    const hasDuplicates = new Set(group.values.map((value) => value.id.trim())).size !== group.values.length;
    if (hasDuplicates) return { ok: false, error: `В параметре "${group.label}" есть дубли id значений.` };

    for (const value of group.values) {
      if (!value.id.trim() || !value.label.trim()) {
        return { ok: false, error: `Укажите id и label для всех значений параметра "${group.label}".` };
      }
      if (value.visualType === 'color' && value.visualValue.trim() && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.visualValue.trim())) {
        return { ok: false, error: `Для цветового значения "${value.label}" укажите корректный HEX (например #A1B2C3).` };
      }
    }
  }

  return { ok: true, normalizedSlug };
}

function buildOptionGroups(form: ProductFormState): ProductOptionGroup[] {
  return form.optionGroups.map((group, groupIndex) => ({
    id: group.id.trim(),
    label: group.label.trim(),
    enabled: group.enabled,
    required: group.required,
    order: groupIndex,
    values: group.values.map((value, valueIndex) => ({
      id: value.id.trim(),
      label: value.label.trim(),
      enabled: value.enabled,
      available: value.enabled,
      visualType: value.visualType,
      visualValue: value.visualValue.trim() || undefined,
      order: valueIndex,
      priceModifier: Math.round(value.priceModifierCash),
      priceModifierCash: Math.round(value.priceModifierCash),
      priceModifierCard: Math.round(value.priceModifierCard)
    }))
  }));
}

export function fromFormState(
  form: ProductFormState,
  normalizedSlug: string,
  existing?: AdminManagedProduct
): AdminManagedProduct {
  const category = seedCategories.find((item) => item.id === form.categoryId) ?? seedCategories[0];
  const now = new Date().toISOString();
  const specs = form.specs.reduce<Record<string, string>>((acc, row) => {
    const key = row.key.trim();
    const value = row.value.trim();
    if (key && value) acc[key] = value;
    return acc;
  }, {});
  const gallery = [form.coverImage.trim(), ...form.galleryImages.map((url) => url.trim()).filter(Boolean)];
  const cashPrice = Math.round(form.cashPrice);
  const cardPrice = Math.round(form.cardPrice);
  const stockCount = Math.trunc(form.stockCount);
  const inStock = form.stockStatus === 'in_stock' || form.stockStatus === 'low_stock';
  const cardRate = cashPrice > 0 ? Number((cardPrice / cashPrice).toFixed(3)) : 1;
  const markup = Math.max(0, cardPrice - cashPrice);

  const baseProduct = existing?.product;
  const productId = baseProduct?.id ?? `admin-${Date.now().toString(36)}`;
  const optionGroups = buildOptionGroups(form);

  const product: Product = {
    id: productId,
    slug: normalizedSlug,
    title: form.name.trim(),
    name: form.name.trim(),
    category: category.name,
    subcategory: form.subcategory.trim() || undefined,
    mainCategory: form.mainCategory,
    brand: form.brand.trim(),
    categoryId: category.id,
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    price: cashPrice,
    cashPrice,
    cardPrice,
    pricing: {
      cash: cashPrice,
      card: cardPrice,
      cardRate,
      cardMarkupType: 'fixed',
      cardMarkupValue: markup,
      note: 'Цена по карте включает расходы на обработку безналичного платежа.'
    },
    inStock,
    availabilityStatus: form.stockStatus,
    stockInfo: {
      status: form.stockStatus,
      count: stockCount,
      note: inStock ? 'Доступно для заказа' : 'Сейчас недоступно'
    },
    popularity: baseProduct?.popularity ?? 60,
    createdAt: baseProduct?.createdAt ?? now,
    stockCount,
    compareAtPrice: baseProduct?.compareAtPrice,
    badge: form.flags.isHit ? 'Хит' : form.flags.isNew ? 'Новинка' : undefined,
    badges: form.flags.isHit ? ['Хит'] : form.flags.isNew ? ['Новинка'] : undefined,
    tags: baseProduct?.tags ?? [],
    image: form.coverImage.trim(),
    gallery,
    images: {
      cover: form.coverImage.trim(),
      gallery
    },
    specifications: specs,
    specs,
    isFeatured: form.flags.recommended,
    configuration: {
      colors:
        baseProduct?.configuration.colors ??
        [
          {
            id: 'black',
            name: 'Black',
            hex: '#1b1d22'
          }
        ],
      optionGroups
    },
    configurationRules: {
      priceFormula: 'cash = baseCash + Σ(value.cashModifier), card = baseCard + Σ(value.cardModifier)',
      optionalGroups: optionGroups.filter((group) => group.required === false).map((group) => group.id)
    }
  };

  return {
    id: existing?.id ?? product.id,
    product,
    hidden: form.hidden,
    flags: form.flags,
    updatedAt: now
  };
}
