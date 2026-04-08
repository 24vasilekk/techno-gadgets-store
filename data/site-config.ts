export const siteConfig = {
  storeName: 'Techno Agents',
  logoTextMain: 'techno',
  logoTextAccent: 'agents',
  logoUrl: '',
  contactPhone: '+7 (495) 555-00-77',
  contactEmail: 'hello@technoagents.store',
  footerText: '© {year} Techno Agents. Технологичный retail с человеческим сервисом.',
  footerDescription:
    'Современный магазин техники с точной селекцией, прозрачными условиями и сервисом без лишнего шума.',
  hero: {
    eyebrow: 'Techno Agents',
    title: 'Оригинальная техника от мировых брендов',
    description:
      'Apple, Dyson, Sony, Canon, DJI, Whoop и другие проверенные бренды. Смартфоны, гаджеты, фото- и видеотехника, аксессуары и умные устройства с гарантией и сервисом.',
    ctaPrimary: 'Перейти в каталог',
    ctaSecondary: 'Узнать о магазине',
    stats: [
      { value: '5 лет', label: 'Работаем на рынке техники' },
      { value: '100%', label: 'Оригинальная продукция' },
      { value: 'Пн-Пт', label: 'Выдача с 10:00 до 20:00' },
      { value: 'Москва', label: 'Быстрая доставка и самовывоз' }
    ]
  },
  pricingNotes: {
    cash: 'Цена указана при оплате наличными',
    card: 'При оплате картой, по безналу и другими способами цена может быть выше.'
  },
  socialLinks: {
    threads: 'https://www.threads.com/@agentstechno?igshid=NTc4MTIwNjQ2YQ==',
    telegram: 'https://t.me/AGENTSTECHNO',
    instagram: 'https://www.instagram.com/agentstechno?igsh=MW9rcThpbnVjaWI4bw==',
    max: 'https://max.ru/join/CKFbqYs_mLgEnrrRG_PIWqGO5NllxkryU33wt_MM4hU'
  },
  deliveryMethods: [
    { id: 'pickup', label: 'Самовывоз', enabled: true },
    { id: 'delivery', label: 'Доставка', enabled: true }
  ],
  paymentMethods: [
    { id: 'cash', label: 'Наличные', enabled: true },
    { id: 'card', label: 'Карта / безнал', enabled: true },
    { id: 'other', label: 'Иной способ', enabled: true }
  ],
  seo: {
    defaultTitle: 'Techno Agents — премиальный магазин техники',
    defaultDescription:
      'iPhone, Apple Watch, аксессуары и флагманские смартфоны в продуманной конфигурации.',
    defaultKeywords: 'магазин техники, iPhone, Apple Watch, смартфоны, аксессуары',
    defaultOgImage: '/og-image.svg'
  }
} as const;
