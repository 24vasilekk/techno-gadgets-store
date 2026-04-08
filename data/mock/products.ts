import type { Product, ProductColor, ProductOptionGroup } from '@/types/catalog';

const CARD_RATE = 1.08;

function getCardPrice(cash: number, rate = CARD_RATE): number {
  return Math.round((cash * rate) / 10) * 10;
}

function buildPricing(cash: number, cardRate = CARD_RATE): Product['pricing'] {
  const card = getCardPrice(cash, cardRate);
  return {
    cash,
    card,
    cardRate,
    cardMarkupType: 'percent',
    cardMarkupValue: Number((cardRate - 1).toFixed(2)),
    note: 'Цена по карте включает расходы на обработку безналичного платежа.'
  };
}

const simGroup: ProductOptionGroup = {
  id: 'sim',
  label: 'SIM',
  values: [
    { id: 'dual-physical-esim', label: 'Physical + eSIM', priceModifier: 0 },
    { id: 'esim-only', label: 'eSIM only', priceModifier: -2500 }
  ]
};

const conditionGroup: ProductOptionGroup = {
  id: 'condition',
  label: 'Состояние',
  values: [
    { id: 'new', label: 'Новый', priceModifier: 0 },
    { id: 'open-box', label: 'Open Box', priceModifier: -7000 },
    { id: 'cpo', label: 'Certified Pre-Owned', priceModifier: -14000 }
  ]
};

const packageGroup: ProductOptionGroup = {
  id: 'package',
  label: 'Комплектация',
  values: [
    { id: 'full-kit', label: 'Полный комплект', priceModifier: 0 },
    { id: 'device-cable', label: 'Устройство + кабель', priceModifier: -3000 },
    { id: 'device-only', label: 'Только устройство', priceModifier: -5500 }
  ]
};

function memoryGroup(values: Array<{ id: string; label: string; priceModifier: number; available?: boolean }>): ProductOptionGroup {
  return {
    id: 'memory',
    label: 'Память',
    values
  };
}

const proColors: ProductColor[] = [
  { id: 'black-titanium', name: 'Black Titanium', hex: '#1f2024' },
  { id: 'natural-titanium', name: 'Natural Titanium', hex: '#c4c0b9' },
  { id: 'white-titanium', name: 'White Titanium', hex: '#efefee' },
  { id: 'desert-titanium', name: 'Desert Titanium', hex: '#bfa992' }
];

const baseColors: ProductColor[] = [
  { id: 'black', name: 'Black', hex: '#18191d' },
  { id: 'white', name: 'White', hex: '#f1f2f5' },
  { id: 'pink', name: 'Pink', hex: '#ff6ab2' },
  { id: 'blue', name: 'Blue', hex: '#87a8ff' },
  { id: 'teal', name: 'Teal', hex: '#8be4d6' }
];

const legacyColors: ProductColor[] = [
  { id: 'midnight', name: 'Midnight', hex: '#1d1f24' },
  { id: 'starlight', name: 'Starlight', hex: '#ede9df' },
  { id: 'red', name: 'Product Red', hex: '#d11a2a' },
  { id: 'blue', name: 'Blue', hex: '#5b79c8' }
];

function iphoneProduct({
  id,
  slug,
  name,
  shortDescription,
  description,
  cashPrice,
  stockCount,
  popularity,
  createdAt,
  badge,
  tags,
  image,
  gallery,
  specs,
  colors,
  optionGroups,
  subcategory,
  compareAtPrice
}: {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  cashPrice: number;
  stockCount: number;
  popularity: number;
  createdAt: string;
  badge?: string;
  tags?: string[];
  image: string;
  gallery: string[];
  specs: Record<string, string>;
  colors: ProductColor[];
  optionGroups: ProductOptionGroup[];
  subcategory: string;
  compareAtPrice?: number;
}): Product {
  const inStock = stockCount > 0;
  const availabilityStatus = !inStock ? 'out_of_stock' : stockCount <= 3 ? 'low_stock' : 'in_stock';
  const pricing = buildPricing(cashPrice);

  return {
    id,
    slug,
    category: 'iPhone',
    subcategory,
    mainCategory: 'apple',
    title: name,
    name,
    brand: 'Apple',
    categoryId: 'iphone',
    shortDescription,
    description,
    price: pricing.cash,
    cashPrice: pricing.cash,
    cardPrice: pricing.card,
    pricing,
    inStock,
    availabilityStatus,
    stockInfo: {
      status: availabilityStatus,
      count: stockCount,
      note: inStock ? 'Доступно для резерва' : 'Поставка под заказ'
    },
    popularity,
    createdAt,
    stockCount,
    compareAtPrice,
    badge,
    badges: badge ? [badge] : undefined,
    tags,
    image,
    gallery,
    images: {
      cover: image,
      gallery
    },
    specifications: specs,
    specs,
    isFeatured: popularity >= 94,
    configuration: {
      colors,
      optionGroups
    },
    configurationRules: {
      priceFormula: 'totalCash = baseCash + Σ(option.priceModifier)',
      optionalGroups: optionGroups.filter((group) => group.id !== 'memory').map((group) => group.id)
    }
  };
}

function watchSizeGroup(values: Array<{ id: string; label: string; priceModifier: number; available?: boolean }>): ProductOptionGroup {
  return {
    id: 'case-size',
    label: 'Размер корпуса',
    values
  };
}

function watchBandGroup(values: Array<{ id: string; label: string; priceModifier: number; available?: boolean }>): ProductOptionGroup {
  return {
    id: 'band',
    label: 'Тип ремешка',
    values
  };
}

function watchMaterialGroup(values: Array<{ id: string; label: string; priceModifier: number; available?: boolean }>): ProductOptionGroup {
  return {
    id: 'case-material',
    label: 'Материал корпуса',
    values
  };
}

const watchConditionGroup: ProductOptionGroup = {
  id: 'condition',
  label: 'Состояние',
  values: [
    { id: 'new', label: 'Новый', priceModifier: 0 },
    { id: 'open-box', label: 'Open Box', priceModifier: -5000 },
    { id: 'cpo', label: 'Certified Pre-Owned', priceModifier: -9000 }
  ]
};

const watchConnectivityGroup: ProductOptionGroup = {
  id: 'connectivity',
  label: 'Связь',
  values: [
    { id: 'gps', label: 'GPS', priceModifier: 0 },
    { id: 'gps-cellular', label: 'GPS + Cellular', priceModifier: 12000 }
  ]
};

function appleWatchProduct({
  id,
  slug,
  name,
  shortDescription,
  description,
  cashPrice,
  stockCount,
  popularity,
  createdAt,
  badge,
  tags,
  image,
  gallery,
  specs,
  colors,
  optionGroups,
  subcategory,
  compareAtPrice
}: {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  cashPrice: number;
  stockCount: number;
  popularity: number;
  createdAt: string;
  badge?: string;
  tags?: string[];
  image: string;
  gallery: string[];
  specs: Record<string, string>;
  colors: ProductColor[];
  optionGroups: ProductOptionGroup[];
  subcategory: string;
  compareAtPrice?: number;
}): Product {
  const inStock = stockCount > 0;
  const availabilityStatus = !inStock ? 'out_of_stock' : stockCount <= 2 ? 'low_stock' : 'in_stock';
  const pricing = buildPricing(cashPrice);

  return {
    id,
    slug,
    category: 'Apple Watch',
    subcategory,
    mainCategory: 'other',
    title: name,
    name,
    brand: 'Apple',
    categoryId: 'watch',
    shortDescription,
    description,
    price: pricing.cash,
    cashPrice: pricing.cash,
    cardPrice: pricing.card,
    pricing,
    inStock,
    availabilityStatus,
    stockInfo: {
      status: availabilityStatus,
      count: stockCount,
      note: inStock ? 'Доступно для резерва' : 'Ожидается поставка'
    },
    popularity,
    createdAt,
    stockCount,
    compareAtPrice,
    badge,
    badges: badge ? [badge] : undefined,
    tags,
    image,
    gallery,
    images: {
      cover: image,
      gallery
    },
    specifications: specs,
    specs,
    isFeatured: popularity >= 90,
    configuration: {
      colors,
      optionGroups
    },
    configurationRules: {
      priceFormula: 'totalCash = baseCash + Σ(option.priceModifier)',
      optionalGroups: optionGroups
        .filter((group) => group.id !== 'case-size' && group.id !== 'band')
        .map((group) => group.id)
    }
  };
}

export const iphoneProducts: Product[] = [
  iphoneProduct({
    id: 'iphone-16-pro-max',
    slug: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    shortDescription: 'Максимальный дисплей, Pro-камера и титановый корпус.',
    description:
      'Флагман для мобильного продакшна, съемки и интенсивной ежедневной нагрузки. Стабильная производительность и высокая автономность.',
    cashPrice: 162990,
    stockCount: 6,
    popularity: 99,
    createdAt: '2026-03-25',
    badge: 'Хит',
    tags: ['A18 Pro', '5x Telephoto', 'Titanium', 'USB-C'],
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484bce71?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      Дисплей: '6.9" Super Retina XDR',
      Процессор: 'A18 Pro',
      Камера: '48MP + UltraWide + 5x Telephoto',
      Аккумулятор: 'до 33 часов видео'
    },
    colors: proColors,
    optionGroups: [
      memoryGroup([
        { id: '256', label: '256 GB', priceModifier: 0 },
        { id: '512', label: '512 GB', priceModifier: 22000 },
        { id: '1tb', label: '1 TB', priceModifier: 47000 }
      ]),
      simGroup,
      conditionGroup,
      packageGroup
    ],
    subcategory: 'Pro Max'
  }),
  iphoneProduct({
    id: 'iphone-16-pro',
    slug: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    shortDescription: 'Компактный Pro-формат с фокусом на камеру и скорость.',
    description:
      'Сбалансированный выбор для тех, кому нужен флагманский уровень камер и производительности в более удобном размере.',
    cashPrice: 141990,
    stockCount: 9,
    popularity: 98,
    createdAt: '2026-03-24',
    badge: 'Хит',
    tags: ['A18 Pro', 'ProMotion', 'Titanium'],
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      Дисплей: '6.3" Super Retina XDR',
      Процессор: 'A18 Pro',
      Камера: '48MP + UltraWide + Telephoto',
      Аккумулятор: 'до 27 часов видео'
    },
    colors: proColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 16000 },
        { id: '512', label: '512 GB', priceModifier: 36000 },
        { id: '1tb', label: '1 TB', priceModifier: 54000, available: false }
      ]),
      simGroup,
      conditionGroup
    ],
    subcategory: 'Pro'
  }),
  iphoneProduct({
    id: 'iphone-16-plus',
    slug: 'iphone-16-plus',
    name: 'iPhone 16 Plus',
    shortDescription: 'Большой экран и автономность в базовой линейке.',
    description:
      'Удобный выбор для тех, кто часто смотрит контент, работает с документами и хочет большой дисплей без перехода в Pro-сегмент.',
    cashPrice: 112990,
    stockCount: 8,
    popularity: 93,
    createdAt: '2026-03-22',
    tags: ['Большой экран', 'Автономность'],
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      Дисплей: '6.7" OLED',
      Процессор: 'A18',
      Камера: '48MP Dual Camera',
      Аккумулятор: 'до 29 часов видео'
    },
    colors: baseColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 14000 },
        { id: '512', label: '512 GB', priceModifier: 32000 }
      ]),
      simGroup,
      conditionGroup
    ],
    subcategory: 'Plus'
  }),
  iphoneProduct({
    id: 'iphone-16',
    slug: 'iphone-16',
    name: 'iPhone 16',
    shortDescription: 'Базовый флагман с актуальным чипом и сильной камерой.',
    description:
      'Надежный повседневный iPhone с хорошим запасом производительности и качественной камерой для фото и видео.',
    cashPrice: 98990,
    stockCount: 12,
    popularity: 95,
    createdAt: '2026-03-20',
    badge: 'Новинка',
    tags: ['A18', 'OLED', 'Dual Camera'],
    image: 'https://images.unsplash.com/photo-1696947159304-f40366f0c572?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1694686110798-1017f9e4f3d4?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.1" OLED',
      Процессор: 'A18',
      Камера: '48MP Dual Camera',
      Защита: 'Ceramic Shield + IP68'
    },
    colors: baseColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 12000 },
        { id: '512', label: '512 GB', priceModifier: 29000 }
      ]),
      simGroup
    ],
    subcategory: 'Base'
  }),
  iphoneProduct({
    id: 'iphone-15-pro-max',
    slug: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    shortDescription: 'Pro-съемка и высокая производительность прошлого флагмана.',
    description:
      'По-прежнему сильный выбор для фото, видео и работы с тяжелыми задачами. Стабильный флагман по более доступной цене.',
    cashPrice: 132990,
    stockCount: 5,
    popularity: 90,
    createdAt: '2025-12-20',
    tags: ['A17 Pro', '5x Telephoto'],
    image: 'https://images.unsplash.com/photo-1592286638140-80c8b9a9f5f9?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.7" ProMotion',
      Процессор: 'A17 Pro',
      Камера: '48MP + 5x Telephoto',
      Порт: 'USB-C'
    },
    colors: proColors,
    optionGroups: [
      memoryGroup([
        { id: '256', label: '256 GB', priceModifier: 0 },
        { id: '512', label: '512 GB', priceModifier: 18000 },
        { id: '1tb', label: '1 TB', priceModifier: 38000 }
      ]),
      simGroup,
      conditionGroup
    ],
    subcategory: 'Pro Max',
    compareAtPrice: 149990
  }),
  iphoneProduct({
    id: 'iphone-15-pro',
    slug: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    shortDescription: 'Флагманский корпус и камера в компактном формате.',
    description:
      'Оптимальный баланс мобильности и производительности для тех, кто предпочитает Pro-функции без увеличенного корпуса.',
    cashPrice: 118990,
    stockCount: 4,
    popularity: 88,
    createdAt: '2025-12-18',
    tags: ['A17 Pro', 'Titanium'],
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1510557880182-3f8cbf84f5f4?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.1" ProMotion',
      Процессор: 'A17 Pro',
      Камера: '48MP + 3x Telephoto',
      Материал: 'Titanium'
    },
    colors: proColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 14000 },
        { id: '512', label: '512 GB', priceModifier: 30000 }
      ]),
      simGroup,
      conditionGroup
    ],
    subcategory: 'Pro'
  }),
  iphoneProduct({
    id: 'iphone-15-plus',
    slug: 'iphone-15-plus',
    name: 'iPhone 15 Plus',
    shortDescription: 'Большой экран, яркие цвета и уверенная батарея.',
    description:
      'Подходит тем, кто выбирает увеличенный формат и удобство просмотра без переплаты за Pro-набор функций.',
    cashPrice: 89990,
    stockCount: 7,
    popularity: 83,
    createdAt: '2025-11-27',
    tags: ['6.7"', 'Dynamic Island'],
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.7" OLED',
      Процессор: 'A16 Bionic',
      Камера: '48MP Dual Camera',
      Аккумулятор: 'до 26 часов видео'
    },
    colors: baseColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 10000 },
        { id: '512', label: '512 GB', priceModifier: 25000 }
      ]),
      simGroup,
      conditionGroup
    ],
    subcategory: 'Plus'
  }),
  iphoneProduct({
    id: 'iphone-15',
    slug: 'iphone-15',
    name: 'iPhone 15',
    shortDescription: 'Сбалансированный iPhone для повседневной эксплуатации.',
    description:
      'Актуальный базовый вариант с качественной камерой и отличной оптимизацией системы для длительной ежедневной работы.',
    cashPrice: 79990,
    stockCount: 10,
    popularity: 86,
    createdAt: '2025-11-25',
    tags: ['OLED', 'USB-C'],
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.1" OLED',
      Процессор: 'A16 Bionic',
      Камера: '48MP Dual Camera',
      Интерфейс: 'USB-C'
    },
    colors: baseColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 9000 },
        { id: '512', label: '512 GB', priceModifier: 22000 }
      ]),
      simGroup
    ],
    subcategory: 'Base'
  }),
  iphoneProduct({
    id: 'iphone-14-pro-max',
    slug: 'iphone-14-pro-max',
    name: 'iPhone 14 Pro Max',
    shortDescription: 'Классический Pro Max с высокой автономностью.',
    description:
      'Проверенный вариант для съемки и повседневной работы, если нужен большой экран и стабильная производительность.',
    cashPrice: 99990,
    stockCount: 3,
    popularity: 80,
    createdAt: '2025-10-11',
    badge: 'Ограничено',
    tags: ['Always-On', 'ProMotion'],
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.7" ProMotion',
      Процессор: 'A16 Bionic',
      Камера: '48MP + Telephoto',
      Интерфейс: 'Lightning'
    },
    colors: proColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 8500 },
        { id: '512', label: '512 GB', priceModifier: 21000 }
      ]),
      simGroup,
      conditionGroup,
      packageGroup
    ],
    subcategory: 'Pro Max'
  }),
  iphoneProduct({
    id: 'iphone-14',
    slug: 'iphone-14',
    name: 'iPhone 14',
    shortDescription: 'Надежный iPhone для ежедневных рабочих сценариев.',
    description:
      'Сильный вариант для коммуникаций, съемки и рабочих приложений, когда важны стабильность и знакомый форм-фактор.',
    cashPrice: 66990,
    stockCount: 5,
    popularity: 76,
    createdAt: '2025-10-05',
    tags: ['A15 Bionic', 'Dual Camera'],
    image: 'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.1" OLED',
      Процессор: 'A15 Bionic',
      Камера: '12MP Dual Camera',
      Интерфейс: 'Lightning'
    },
    colors: legacyColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 7000 },
        { id: '512', label: '512 GB', priceModifier: 17000 }
      ]),
      simGroup,
      conditionGroup
    ],
    subcategory: 'Base'
  }),
  iphoneProduct({
    id: 'iphone-13',
    slug: 'iphone-13',
    name: 'iPhone 13',
    shortDescription: 'Оптимальный баланс цены, камеры и ресурса.',
    description:
      'Один из самых практичных iPhone для повседневного использования и перехода на экосистему Apple.',
    cashPrice: 53990,
    stockCount: 9,
    popularity: 74,
    createdAt: '2025-09-14',
    tags: ['Компактный', 'A15 Bionic'],
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.1" OLED',
      Процессор: 'A15 Bionic',
      Камера: '12MP Dual Camera',
      'Face ID': 'Да'
    },
    colors: legacyColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 6000 }
      ]),
      conditionGroup
    ],
    subcategory: 'Base'
  }),
  iphoneProduct({
    id: 'iphone-13-mini',
    slug: 'iphone-13-mini',
    name: 'iPhone 13 mini',
    shortDescription: 'Компактный формат для тех, кто ценит эргономику.',
    description:
      'Редкий компактный iPhone с сильной производительностью, подходящий для использования одной рукой.',
    cashPrice: 49990,
    stockCount: 2,
    popularity: 68,
    createdAt: '2025-08-21',
    badge: 'Осталось мало',
    tags: ['Compact', 'A15 Bionic'],
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '5.4" OLED',
      Процессор: 'A15 Bionic',
      Камера: '12MP Dual Camera',
      Вес: '140 г'
    },
    colors: legacyColors,
    optionGroups: [
      memoryGroup([
        { id: '128', label: '128 GB', priceModifier: 0 },
        { id: '256', label: '256 GB', priceModifier: 5500 }
      ]),
      conditionGroup
    ],
    subcategory: 'Mini'
  }),
  iphoneProduct({
    id: 'iphone-se-3',
    slug: 'iphone-se-3',
    name: 'iPhone SE (3rd Gen)',
    shortDescription: 'Классический корпус и быстрый чип по доступной цене.',
    description:
      'Компактный iPhone с Touch ID и производительным чипом для базовых задач и комфортной работы в экосистеме Apple.',
    cashPrice: 42990,
    stockCount: 5,
    popularity: 64,
    createdAt: '2025-07-09',
    tags: ['Touch ID', 'Компактный'],
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '4.7" Retina HD',
      Процессор: 'A15 Bionic',
      Камера: '12MP Wide',
      Биометрия: 'Touch ID'
    },
    colors: [
      { id: 'midnight', name: 'Midnight', hex: '#1a1a1f' },
      { id: 'starlight', name: 'Starlight', hex: '#ece6d9' },
      { id: 'red', name: 'Product Red', hex: '#d01f34' }
    ],
    optionGroups: [
      memoryGroup([
        { id: '64', label: '64 GB', priceModifier: 0 },
        { id: '128', label: '128 GB', priceModifier: 4500 },
        { id: '256', label: '256 GB', priceModifier: 11000 }
      ]),
      conditionGroup
    ],
    subcategory: 'SE'
  }),
  iphoneProduct({
    id: 'iphone-12',
    slug: 'iphone-12',
    name: 'iPhone 12',
    shortDescription: 'Проверенная модель для повседневных задач.',
    description:
      'Хороший выбор для базовых сценариев: связь, медиа, приложения и стабильная работа в iOS.',
    cashPrice: 42990,
    stockCount: 4,
    popularity: 60,
    createdAt: '2025-06-17',
    tags: ['OLED', '5G'],
    image: 'https://images.unsplash.com/photo-1603898037225-1a89b84d8f8a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.1" OLED',
      Процессор: 'A14 Bionic',
      Камера: '12MP Dual Camera',
      Сеть: '5G'
    },
    colors: legacyColors,
    optionGroups: [
      memoryGroup([
        { id: '64', label: '64 GB', priceModifier: 0 },
        { id: '128', label: '128 GB', priceModifier: 4000 },
        { id: '256', label: '256 GB', priceModifier: 9000 }
      ]),
      conditionGroup,
      packageGroup
    ],
    subcategory: 'Base'
  }),
  iphoneProduct({
    id: 'iphone-12-refurbished',
    slug: 'iphone-12-refurbished',
    name: 'iPhone 12 (Refurbished)',
    shortDescription: 'Восстановленный iPhone с проверкой и гарантией магазина.',
    description:
      'Экономичный вход в экосистему Apple. Устройство проходит диагностику, замену расходников и финальную проверку.',
    cashPrice: 35990,
    stockCount: 6,
    popularity: 66,
    createdAt: '2025-06-25',
    badge: 'Refurb',
    tags: ['Refurbished', 'Проверено', 'Гарантия'],
    image: 'https://images.unsplash.com/photo-1510557880182-3f8cbf84f5f4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.1" OLED',
      Процессор: 'A14 Bionic',
      Камера: '12MP Dual Camera',
      Статус: 'Refurbished Grade A'
    },
    colors: [
      { id: 'black', name: 'Black', hex: '#1a1b20' },
      { id: 'white', name: 'White', hex: '#f2f2f2' }
    ],
    optionGroups: [
      memoryGroup([
        { id: '64', label: '64 GB', priceModifier: 0 },
        { id: '128', label: '128 GB', priceModifier: 3000 }
      ]),
      {
        id: 'condition',
        label: 'Класс состояния',
        values: [
          { id: 'grade-a', label: 'Grade A', priceModifier: 0 },
          { id: 'grade-b', label: 'Grade B', priceModifier: -3500 }
        ]
      },
      packageGroup
    ],
    subcategory: 'Refurbished'
  })
];

export const appleWatchProducts: Product[] = [
  appleWatchProduct({
    id: 'apple-watch-ultra-2-titanium',
    slug: 'apple-watch-ultra-2-titanium',
    name: 'Apple Watch Ultra 2 Titanium',
    shortDescription: 'Экстремальная линейка с титановым корпусом и максимальной автономностью.',
    description:
      'Флагман Apple Watch для спорта, путешествий и сложных условий эксплуатации. Высокая яркость, точный GPS и расширенные метрики.',
    cashPrice: 104990,
    stockCount: 4,
    popularity: 93,
    createdAt: '2026-03-15',
    badge: 'Хит',
    tags: ['Ultra', 'Titanium', '49mm'],
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '49mm Always-On Retina',
      Корпус: 'Titanium',
      Защита: 'WR100 + EN13319',
      Аккумулятор: 'до 36 часов'
    },
    colors: [
      { id: 'ultra-natural', name: 'Natural Titanium', hex: '#c2beb7' },
      { id: 'ultra-black', name: 'Black Titanium', hex: '#202227' }
    ],
    optionGroups: [
      watchBandGroup([
        { id: 'trail-loop', label: 'Trail Loop', priceModifier: 0 },
        { id: 'ocean-band', label: 'Ocean Band', priceModifier: 2500 },
        { id: 'alpine-loop', label: 'Alpine Loop', priceModifier: 3200 }
      ]),
      watchConditionGroup
    ],
    subcategory: 'Ultra'
  }),
  appleWatchProduct({
    id: 'apple-watch-series-10-aluminum',
    slug: 'apple-watch-series-10-aluminum',
    name: 'Apple Watch Series 10 Aluminum',
    shortDescription: 'Легкий корпус, тонкий профиль и полный набор ежедневных функций.',
    description:
      'Универсальная модель для ежедневной активности, уведомлений, тренировок и контроля здоровья.',
    cashPrice: 46990,
    stockCount: 11,
    popularity: 92,
    createdAt: '2026-03-12',
    badge: 'Новинка',
    tags: ['Series 10', 'Aluminum'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Always-On LTPO OLED',
      Материал: 'Aluminum',
      Здоровье: 'ECG + SpO2 + Sleep',
      Защита: 'Water resistant 50m'
    },
    colors: [
      { id: 'midnight-aluminum', name: 'Midnight', hex: '#1a1d24' },
      { id: 'starlight-aluminum', name: 'Starlight', hex: '#ede8dc' },
      { id: 'pink-aluminum', name: 'Blush Pink', hex: '#efb7bc' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '42mm', label: '42 mm', priceModifier: 0 },
        { id: '46mm', label: '46 mm', priceModifier: 6000 }
      ]),
      watchBandGroup([
        { id: 'sport-band', label: 'Sport Band', priceModifier: 0 },
        { id: 'sport-loop', label: 'Sport Loop', priceModifier: 1800 },
        { id: 'braided-loop', label: 'Braided Solo Loop', priceModifier: 6500 }
      ]),
      watchConnectivityGroup
    ],
    subcategory: 'Series'
  }),
  appleWatchProduct({
    id: 'apple-watch-series-10-stainless',
    slug: 'apple-watch-series-10-stainless',
    name: 'Apple Watch Series 10 Stainless Steel',
    shortDescription: 'Премиальный корпус из стали и выразительный классический стиль.',
    description:
      'Версия Series 10 в стали для тех, кто ценит более строгий дизайн и повышенную устойчивость корпуса.',
    cashPrice: 69990,
    stockCount: 5,
    popularity: 87,
    createdAt: '2026-03-08',
    tags: ['Series 10', 'Stainless Steel'],
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Always-On LTPO OLED',
      Материал: 'Stainless Steel',
      Связь: 'GPS + Cellular',
      Защита: 'Sapphire front crystal'
    },
    colors: [
      { id: 'graphite-steel', name: 'Graphite', hex: '#4a4e54' },
      { id: 'silver-steel', name: 'Silver', hex: '#d9dde3' },
      { id: 'gold-steel', name: 'Gold', hex: '#b79a71' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '42mm', label: '42 mm', priceModifier: 0 },
        { id: '46mm', label: '46 mm', priceModifier: 7000 }
      ]),
      watchBandGroup([
        { id: 'sport-band', label: 'Sport Band', priceModifier: 0 },
        { id: 'milanese-loop', label: 'Milanese Loop', priceModifier: 9500 },
        { id: 'link-bracelet', label: 'Link Bracelet', priceModifier: 21500 }
      ]),
      watchConditionGroup
    ],
    subcategory: 'Series'
  }),
  appleWatchProduct({
    id: 'apple-watch-series-9-aluminum',
    slug: 'apple-watch-series-9-aluminum',
    name: 'Apple Watch Series 9 Aluminum',
    shortDescription: 'Проверенная серия для ежедневной активности и трекинга.',
    description: 'Сбалансированная модель с точным отслеживанием тренировок, сна и уведомлений.',
    cashPrice: 39990,
    stockCount: 8,
    popularity: 85,
    createdAt: '2025-12-24',
    tags: ['Series 9', 'S9 SiP'],
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Always-On Retina',
      Процессор: 'S9 SiP',
      Жесты: 'Double Tap',
      Защита: 'Water resistant 50m'
    },
    colors: [
      { id: 'midnight', name: 'Midnight', hex: '#1b1e25' },
      { id: 'starlight', name: 'Starlight', hex: '#efe8dc' },
      { id: 'red', name: 'Product Red', hex: '#c61f2f' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '41mm', label: '41 mm', priceModifier: 0 },
        { id: '45mm', label: '45 mm', priceModifier: 5200 }
      ]),
      watchBandGroup([
        { id: 'sport-band', label: 'Sport Band', priceModifier: 0 },
        { id: 'sport-loop', label: 'Sport Loop', priceModifier: 1700 }
      ]),
      watchConnectivityGroup
    ],
    subcategory: 'Series'
  }),
  appleWatchProduct({
    id: 'apple-watch-series-9-stainless',
    slug: 'apple-watch-series-9-stainless',
    name: 'Apple Watch Series 9 Stainless Steel',
    shortDescription: 'Серия 9 в стальном корпусе с акцентом на премиальную отделку.',
    description: 'Более строгий дизайн и расширенные варианты ремешков для делового и вечернего сценария.',
    cashPrice: 58990,
    stockCount: 3,
    popularity: 79,
    createdAt: '2025-12-18',
    tags: ['Series 9', 'Stainless Steel'],
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Always-On Retina',
      Материал: 'Stainless Steel',
      Связь: 'GPS + Cellular',
      'Переднее стекло': 'Sapphire'
    },
    colors: [
      { id: 'graphite', name: 'Graphite', hex: '#464a52' },
      { id: 'silver', name: 'Silver', hex: '#dbdfe4' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '41mm', label: '41 mm', priceModifier: 0 },
        { id: '45mm', label: '45 mm', priceModifier: 6200 }
      ]),
      watchBandGroup([
        { id: 'sport-band', label: 'Sport Band', priceModifier: 0 },
        { id: 'milanese-loop', label: 'Milanese Loop', priceModifier: 8400 }
      ]),
      watchConditionGroup
    ],
    subcategory: 'Series'
  }),
  appleWatchProduct({
    id: 'apple-watch-se-2-gps',
    slug: 'apple-watch-se-2-gps',
    name: 'Apple Watch SE (2nd Gen) GPS',
    shortDescription: 'Оптимальный вход в Apple Watch с базовым набором функций.',
    description: 'Легкая и быстрая модель для уведомлений, фитнеса и ежедневной активности.',
    cashPrice: 26990,
    stockCount: 12,
    popularity: 82,
    createdAt: '2025-11-11',
    tags: ['SE', 'GPS'],
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Retina LTPO OLED',
      Процессор: 'S8 SiP',
      Датчики: 'HR + Fall Detection',
      Защита: 'Water resistant 50m'
    },
    colors: [
      { id: 'midnight-se', name: 'Midnight', hex: '#1d2028' },
      { id: 'starlight-se', name: 'Starlight', hex: '#efe9de' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '40mm', label: '40 mm', priceModifier: 0 },
        { id: '44mm', label: '44 mm', priceModifier: 4200 }
      ]),
      watchBandGroup([
        { id: 'sport-band', label: 'Sport Band', priceModifier: 0 },
        { id: 'sport-loop', label: 'Sport Loop', priceModifier: 1200 }
      ])
    ],
    subcategory: 'SE'
  }),
  appleWatchProduct({
    id: 'apple-watch-se-2-cellular',
    slug: 'apple-watch-se-2-cellular',
    name: 'Apple Watch SE (2nd Gen) GPS + Cellular',
    shortDescription: 'SE с поддержкой eSIM для автономной связи.',
    description: 'Подходит для сценариев без постоянной привязки к iPhone — пробежки, тренировки, поездки.',
    cashPrice: 34990,
    stockCount: 7,
    popularity: 78,
    createdAt: '2025-11-09',
    tags: ['SE', 'Cellular'],
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Retina LTPO OLED',
      Связь: 'GPS + Cellular',
      Процессор: 'S8 SiP',
      eSIM: 'Поддерживается'
    },
    colors: [
      { id: 'midnight-se', name: 'Midnight', hex: '#1d2028' },
      { id: 'silver-se', name: 'Silver', hex: '#d9dee6' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '40mm', label: '40 mm', priceModifier: 0 },
        { id: '44mm', label: '44 mm', priceModifier: 4300 }
      ]),
      watchBandGroup([
        { id: 'sport-band', label: 'Sport Band', priceModifier: 0 },
        { id: 'braided-loop', label: 'Braided Solo Loop', priceModifier: 5400 }
      ]),
      watchConditionGroup
    ],
    subcategory: 'SE'
  }),
  appleWatchProduct({
    id: 'apple-watch-hermes-series-10',
    slug: 'apple-watch-hermes-series-10',
    name: 'Apple Watch Hermès Series 10',
    shortDescription: 'Коллаборация Hermès с авторскими ремешками и премиум-отделкой.',
    description: 'Коллекционная версия с фирменными ремешками Hermès для статусного повседневного образа.',
    cashPrice: 129990,
    stockCount: 2,
    popularity: 73,
    createdAt: '2026-02-02',
    badge: 'Limited',
    tags: ['Hermès', 'Limited'],
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Always-On Retina',
      Материал: 'Stainless Steel',
      Коллаборация: 'Hermès',
      Связь: 'GPS + Cellular'
    },
    colors: [
      { id: 'silver-hermes', name: 'Silver', hex: '#dcdfdf' },
      { id: 'space-black-hermes', name: 'Space Black', hex: '#1e2026' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '42mm', label: '42 mm', priceModifier: 0 },
        { id: '46mm', label: '46 mm', priceModifier: 8000 }
      ]),
      watchBandGroup([
        { id: 'hermes-single-tour', label: 'Hermès Single Tour', priceModifier: 0 },
        { id: 'hermes-double-tour', label: 'Hermès Double Tour', priceModifier: 14500 }
      ])
    ],
    subcategory: 'Hermès'
  }),
  appleWatchProduct({
    id: 'apple-watch-nike-series-10',
    slug: 'apple-watch-nike-series-10',
    name: 'Apple Watch Nike Series 10',
    shortDescription: 'Серия для тренировок с фирменными циферблатами Nike.',
    description: 'Версия для активного спорта с легкими ремешками и быстрым доступом к Nike Run Club.',
    cashPrice: 51990,
    stockCount: 6,
    popularity: 81,
    createdAt: '2026-01-28',
    tags: ['Nike', 'Sport'],
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Always-On LTPO OLED',
      Интеграция: 'Nike Run Club',
      Корпус: 'Aluminum',
      Защита: 'Water resistant 50m'
    },
    colors: [
      { id: 'nike-midnight', name: 'Midnight', hex: '#1a1c22' },
      { id: 'nike-silver', name: 'Silver', hex: '#dbdee5' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '42mm', label: '42 mm', priceModifier: 0 },
        { id: '46mm', label: '46 mm', priceModifier: 5500 }
      ]),
      watchBandGroup([
        { id: 'nike-sport-band', label: 'Nike Sport Band', priceModifier: 0 },
        { id: 'nike-sport-loop', label: 'Nike Sport Loop', priceModifier: 2100 }
      ]),
      watchConnectivityGroup
    ],
    subcategory: 'Nike'
  }),
  appleWatchProduct({
    id: 'apple-watch-series-8-refurbished',
    slug: 'apple-watch-series-8-refurbished',
    name: 'Apple Watch Series 8 (Refurbished)',
    shortDescription: 'Проверенная модель по более доступной стоимости.',
    description: 'Refurbished версия с тестированием и гарантийной поддержкой от магазина.',
    cashPrice: 29990,
    stockCount: 5,
    popularity: 69,
    createdAt: '2025-08-14',
    badge: 'Refurb',
    tags: ['Series 8', 'Refurbished'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: 'Always-On Retina',
      Процессор: 'S8 SiP',
      Статус: 'Refurbished Grade A/B',
      Защита: 'Water resistant 50m'
    },
    colors: [
      { id: 'midnight', name: 'Midnight', hex: '#1a1d24' },
      { id: 'starlight', name: 'Starlight', hex: '#efe9dd' }
    ],
    optionGroups: [
      watchSizeGroup([
        { id: '41mm', label: '41 mm', priceModifier: 0 },
        { id: '45mm', label: '45 mm', priceModifier: 3800 }
      ]),
      watchBandGroup([
        { id: 'sport-band', label: 'Sport Band', priceModifier: 0 },
        { id: 'sport-loop', label: 'Sport Loop', priceModifier: 1200 }
      ]),
      {
        id: 'condition',
        label: 'Класс состояния',
        values: [
          { id: 'grade-a', label: 'Grade A', priceModifier: 0 },
          { id: 'grade-b', label: 'Grade B', priceModifier: -3000 }
        ]
      },
      packageGroup
    ],
    subcategory: 'Refurbished'
  })
];

const accessoryAndOtherProducts: Product[] = [
  {
    id: 'galaxy-s25-ultra',
    slug: 'galaxy-s25-ultra',
    category: 'Смартфоны',
    subcategory: 'Flagship',
    mainCategory: 'smartphones',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    categoryId: 'smartphones',
    shortDescription: 'Android-флагман с камерой 200MP и стилусом.',
    description: 'Производительный смартфон для контента, работы и мобильной съемки.',
    price: 124990,
    pricing: buildPricing(124990),
    inStock: true,
    availabilityStatus: 'in_stock',
    stockCount: 7,
    popularity: 96,
    createdAt: '2026-03-02',
    badge: 'New',
    badges: ['New'],
    tags: ['Android', 'S-Pen'],
    image: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Дисплей: '6.8” Dynamic AMOLED',
      Процессор: 'Snapdragon Elite',
      Память: '256GB / 512GB',
      Камера: '200MP + Periscope Zoom'
    },
    configuration: {
      colors: [
        { id: 'phantom-black', name: 'Phantom Black', hex: '#1b1c1f' },
        { id: 'titan-gray', name: 'Titan Gray', hex: '#91959e' }
      ],
      optionGroups: [
        memoryGroup([
          { id: '256', label: '256 GB', priceModifier: 0 },
          { id: '512', label: '512 GB', priceModifier: 16000 },
          { id: '1tb', label: '1 TB', priceModifier: 34000 }
        ]),
        conditionGroup
      ]
    },
    configurationRules: {
      priceFormula: 'totalCash = baseCash + Σ(option.priceModifier)',
      optionalGroups: ['condition']
    }
  },
  {
    id: 'airpods-pro-2',
    slug: 'airpods-pro-2',
    category: 'Аксессуары',
    subcategory: 'Audio',
    mainCategory: 'accessories',
    name: 'AirPods Pro (2nd Gen)',
    brand: 'Apple',
    categoryId: 'accessories',
    shortDescription: 'Шумоподавление и адаптивный звук в компактном формате.',
    description: 'Беспроводные наушники для повседневной работы и поездок.',
    price: 26990,
    pricing: buildPricing(26990),
    inStock: true,
    availabilityStatus: 'low_stock',
    stockCount: 2,
    popularity: 92,
    createdAt: '2025-11-20',
    tags: ['ANC', 'Spatial Audio'],
    image: 'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Чип: 'H2',
      Функции: 'ANC + Adaptive Audio',
      Автономность: 'до 30 часов с кейсом',
      Зарядка: 'USB-C / MagSafe'
    },
    configuration: {
      colors: [{ id: 'white', name: 'White', hex: '#f2f2f2' }],
      optionGroups: [conditionGroup]
    },
    configurationRules: {
      priceFormula: 'totalCash = baseCash + Σ(option.priceModifier)',
      optionalGroups: ['condition']
    }
  },
  {
    id: 'anker-3in1',
    slug: 'anker-3in1-charging-station',
    category: 'Аксессуары',
    subcategory: 'Charging',
    mainCategory: 'accessories',
    name: 'Anker 3-in-1 Charging Station',
    brand: 'Anker',
    categoryId: 'accessories',
    shortDescription: 'Одна станция для iPhone, Apple Watch и AirPods.',
    description: 'Продуманная зарядная станция для рабочего стола и дома.',
    price: 14990,
    pricing: buildPricing(14990),
    inStock: true,
    availabilityStatus: 'in_stock',
    stockCount: 6,
    popularity: 84,
    createdAt: '2025-10-08',
    tags: ['15W', '3-in-1'],
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1544894079-e81a9eb1da8b?auto=format&fit=crop&w=1200&q=80'],
    specs: {
      Мощность: '15W MagSafe',
      Формат: '3-in-1',
      Материал: 'Алюминий + soft-touch',
      Гарантия: '1 год'
    },
    configuration: {
      colors: [
        { id: 'graphite', name: 'Graphite', hex: '#2d2f36' },
        { id: 'silver', name: 'Silver', hex: '#d8dade' }
      ],
      optionGroups: []
    },
    configurationRules: {
      priceFormula: 'totalCash = baseCash'
    }
  }
];

export const products: Product[] = [...iphoneProducts, ...appleWatchProducts, ...accessoryAndOtherProducts];
