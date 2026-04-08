import type { Category } from '@/types/catalog';

export const categories: Category[] = [
  {
    id: 'iphone',
    name: 'iPhone',
    slug: 'iphone',
    description: 'Флагманская линейка Apple: мощность, камера, премиум-сборка.'
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    slug: 'apple-watch',
    description: 'Умные часы с точным трекингом, стилем и экосистемой Apple.'
  },
  {
    id: 'smartphones',
    name: 'Смартфоны',
    slug: 'smartphones',
    description: 'Лучшие Android- и флагманские модели для работы и развлечений.'
  },
  {
    id: 'accessories',
    name: 'Аксессуары',
    slug: 'accessories',
    description: 'Премиальные аксессуары: зарядка, защита, звук и удобство.'
  }
];
