import type { TechStoreProduct } from '@/types/product-model';

const iphoneCategory = { id: 'cat-iphone', slug: 'iphone', name: 'iPhone' };
const watchCategory = { id: 'cat-watch', slug: 'apple-watch', name: 'Apple Watch' };
const accessoriesCategory = { id: 'cat-accessories', slug: 'accessories', name: 'Аксессуары' };
const smartphonesCategory = { id: 'cat-smartphones', slug: 'smartphones', name: 'Смартфоны' };
const otherCategory = { id: 'cat-other', slug: 'other-tech', name: 'Другая техника' };

export const universalProductsMock: TechStoreProduct[] = [
  {
    id: 'p-iphone-16-pro',
    slug: 'iphone-16-pro',
    title: 'iPhone 16 Pro',
    shortDescription: 'Флагман Apple с Pro-камерой и титановым корпусом.',
    description: 'Премиальный смартфон для фото, видео и ресурсоемких задач.',
    brand: 'Apple',
    categories: [iphoneCategory],
    subcategories: [{ id: 'sub-pro', slug: 'pro', name: 'Pro' }],
    showcaseBlock: 'apple',
    specs: {
      Дисплей: '6.3" Super Retina XDR',
      Процессор: 'A18 Pro',
      Камера: '48MP + 3x Telephoto',
      Порт: 'USB-C'
    },
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1200&q=80',
        alt: 'iPhone 16 Pro front view',
        isPrimary: true
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=80',
        alt: 'iPhone 16 Pro angled view'
      }
    ],
    badges: [{ id: 'b-hit', label: 'Хит', tone: 'accent' }],
    pricing: {
      baseCashPrice: 141990,
      cardMarkup: { kind: 'percent', value: 0.08 },
      legalNote: 'Разница для карты связана с условиями обработки платежа.'
    },
    inventory: {
      status: 'in_stock',
      quantity: 9
    },
    optionGroups: [
      {
        id: 'g-memory',
        key: 'memory',
        label: 'Память',
        type: 'memory',
        required: true,
        values: [
          { id: 'm-128', label: '128 GB', deltas: { cash: { kind: 'fixed', value: 0 } } },
          { id: 'm-256', label: '256 GB', deltas: { cash: { kind: 'fixed', value: 16000 } } },
          { id: 'm-512', label: '512 GB', deltas: { cash: { kind: 'fixed', value: 36000 } } }
        ]
      },
      {
        id: 'g-color',
        key: 'color',
        label: 'Цвет',
        type: 'color',
        required: true,
        values: [
          { id: 'c-black', label: 'Black Titanium', swatchHex: '#1f2024' },
          { id: 'c-natural', label: 'Natural Titanium', swatchHex: '#c4c0b9' },
          { id: 'c-white', label: 'White Titanium', swatchHex: '#efefee' }
        ]
      },
      {
        id: 'g-condition',
        key: 'condition',
        label: 'Состояние',
        type: 'condition',
        required: false,
        values: [
          { id: 'cond-new', label: 'Новый' },
          { id: 'cond-open', label: 'Open Box', deltas: { cash: { kind: 'fixed', value: -7000 } } }
        ]
      }
    ],
    combinationRules: [
      {
        id: 'rule-1',
        when: { memory: 'm-512', color: 'c-natural' },
        stockStatus: 'low_stock',
        stockCount: 2
      }
    ],
    filterMeta: {
      brand: 'Apple',
      tags: ['5G', 'ProMotion', 'Titanium']
    },
    sortMeta: {
      popularity: 98,
      createdAt: '2026-03-20'
    }
  },
  {
    id: 'p-watch-ultra-2',
    slug: 'apple-watch-ultra-2',
    title: 'Apple Watch Ultra 2',
    shortDescription: 'Флагманские часы для спорта и сложных условий.',
    description: 'Титановый корпус, высокая яркость и расширенные спортивные метрики.',
    brand: 'Apple',
    categories: [watchCategory],
    subcategories: [{ id: 'sub-ultra', slug: 'ultra', name: 'Ultra' }],
    showcaseBlock: 'other',
    specs: {
      Дисплей: '49mm Always-On Retina',
      Корпус: 'Titanium',
      Защита: 'WR100',
      Аккумулятор: 'до 36 часов'
    },
    images: [
      {
        id: 'img-w-1',
        url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
        alt: 'Apple Watch Ultra 2',
        isPrimary: true
      }
    ],
    badges: [{ id: 'b-watch-hit', label: 'Хит', tone: 'accent' }],
    pricing: {
      baseCashPrice: 104990,
      cardMarkup: { kind: 'percent', value: 0.08 }
    },
    inventory: {
      status: 'in_stock',
      quantity: 4
    },
    optionGroups: [
      {
        id: 'g-size',
        key: 'size',
        label: 'Размер корпуса',
        type: 'size',
        required: true,
        values: [{ id: 's-49', label: '49 mm' }]
      },
      {
        id: 'g-band',
        key: 'band',
        label: 'Тип ремешка',
        type: 'band',
        required: true,
        values: [
          { id: 'b-trail', label: 'Trail Loop' },
          { id: 'b-ocean', label: 'Ocean Band', deltas: { cash: { kind: 'fixed', value: 2500 } } },
          { id: 'b-alpine', label: 'Alpine Loop', deltas: { cash: { kind: 'fixed', value: 3200 } } }
        ]
      },
      {
        id: 'g-material',
        key: 'material',
        label: 'Материал корпуса',
        type: 'material',
        required: false,
        values: [{ id: 'mat-titanium', label: 'Titanium' }]
      }
    ],
    filterMeta: {
      brand: 'Apple',
      tags: ['Ultra', 'Titanium', 'Sport']
    },
    sortMeta: {
      popularity: 93,
      createdAt: '2026-03-15'
    }
  },
  {
    id: 'p-airpods-pro-2',
    slug: 'airpods-pro-2',
    title: 'AirPods Pro (2nd Gen)',
    shortDescription: 'Шумоподавление и адаптивный звук в компактном формате.',
    description: 'Премиальные беспроводные наушники для поездок и ежедневного использования.',
    brand: 'Apple',
    categories: [accessoriesCategory],
    subcategories: [{ id: 'sub-audio', slug: 'audio', name: 'Аудио' }],
    showcaseBlock: 'accessories',
    specs: {
      Чип: 'H2',
      Функции: 'ANC + Adaptive Audio',
      Автономность: 'до 30 часов с кейсом'
    },
    images: [
      {
        id: 'img-a-1',
        url: 'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?auto=format&fit=crop&w=1200&q=80',
        alt: 'AirPods Pro 2 case',
        isPrimary: true
      }
    ],
    badges: [{ id: 'b-low', label: 'Осталось мало', tone: 'warning' }],
    pricing: {
      baseCashPrice: 26990,
      cardMarkup: { kind: 'percent', value: 0.08 }
    },
    inventory: {
      status: 'low_stock',
      quantity: 2
    },
    optionGroups: [],
    filterMeta: {
      brand: 'Apple',
      tags: ['Audio', 'ANC']
    },
    sortMeta: {
      popularity: 90,
      createdAt: '2025-11-20'
    }
  },
  {
    id: 'p-galaxy-s25-ultra',
    slug: 'galaxy-s25-ultra',
    title: 'Samsung Galaxy S25 Ultra',
    shortDescription: 'Флагман Android с камерой 200MP.',
    description: 'Производительный смартфон для работы, контента и мобильной съемки.',
    brand: 'Samsung',
    categories: [smartphonesCategory],
    subcategories: [{ id: 'sub-android-flagship', slug: 'android-flagship', name: 'Android Flagship' }],
    showcaseBlock: 'smartphones',
    specs: {
      Дисплей: '6.8” Dynamic AMOLED',
      Процессор: 'Snapdragon Elite',
      Камера: '200MP + Periscope Zoom'
    },
    images: [
      {
        id: 'img-s-1',
        url: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=1200&q=80',
        alt: 'Samsung Galaxy S25 Ultra',
        isPrimary: true
      }
    ],
    pricing: {
      baseCashPrice: 124990,
      cardMarkup: { kind: 'percent', value: 0.08 }
    },
    inventory: {
      status: 'in_stock',
      quantity: 7
    },
    optionGroups: [
      {
        id: 'g-mem-s',
        key: 'memory',
        label: 'Память',
        type: 'memory',
        required: true,
        values: [
          { id: 'm-256', label: '256 GB' },
          { id: 'm-512', label: '512 GB', deltas: { cash: { kind: 'fixed', value: 16000 } } }
        ]
      }
    ],
    filterMeta: {
      brand: 'Samsung',
      tags: ['Android', 'Flagship']
    },
    sortMeta: {
      popularity: 96,
      createdAt: '2026-03-02'
    }
  },
  {
    id: 'p-dji-osmo-pocket-3',
    slug: 'dji-osmo-pocket-3',
    title: 'DJI Osmo Pocket 3',
    shortDescription: 'Компактная камера для мобильного продакшна.',
    description: 'Стабилизированная камера для влогов, съемки в поездках и контент-задач.',
    brand: 'DJI',
    categories: [otherCategory],
    subcategories: [{ id: 'sub-camera', slug: 'camera', name: 'Камеры' }],
    showcaseBlock: 'other',
    specs: {
      Сенсор: '1-inch CMOS',
      Видео: '4K/120fps',
      Стабилизация: '3-axis gimbal'
    },
    images: [
      {
        id: 'img-o-1',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
        alt: 'DJI Osmo Pocket 3',
        isPrimary: true
      }
    ],
    badges: [{ id: 'b-new', label: 'Новинка', tone: 'accent' }],
    pricing: {
      baseCashPrice: 63990,
      cardMarkup: { kind: 'percent', value: 0.08 }
    },
    inventory: {
      status: 'preorder',
      quantity: 0,
      allowBackorder: true
    },
    optionGroups: [
      {
        id: 'g-kit',
        key: 'kit',
        label: 'Комплектация',
        type: 'custom',
        required: false,
        values: [
          { id: 'kit-standard', label: 'Standard', deltas: { cash: { kind: 'fixed', value: 0 } } },
          { id: 'kit-creator', label: 'Creator Combo', deltas: { cash: { kind: 'fixed', value: 18000 } } }
        ]
      }
    ],
    filterMeta: {
      brand: 'DJI',
      tags: ['Camera', 'Creator']
    },
    sortMeta: {
      popularity: 70,
      createdAt: '2026-02-01'
    }
  }
];

