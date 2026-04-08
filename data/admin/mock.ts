export const adminDashboardStats = [
  { label: 'Заявки за сегодня', value: '12', note: '+3 к вчерашнему дню' },
  { label: 'Выручка (день)', value: '₽ 1 284 000', note: 'По подтвержденным заявкам' },
  { label: 'Товаров в каталоге', value: '37', note: '4 требуют обновления цены' },
  { label: 'Конверсия в заявку', value: '4.8%', note: 'За последние 7 дней' }
] as const;

export const adminRecentOrders = [
  {
    id: 'TG-MQ0A4Y',
    customer: 'Алексей Д.',
    total: '₽ 189 990',
    status: 'Новая',
    createdAt: 'Сегодня, 13:42'
  },
  {
    id: 'TG-MQ0A3R',
    customer: 'Мария К.',
    total: '₽ 78 490',
    status: 'Подтверждена',
    createdAt: 'Сегодня, 12:11'
  },
  {
    id: 'TG-MQ0A29',
    customer: 'Илья Р.',
    total: '₽ 322 700',
    status: 'В работе',
    createdAt: 'Сегодня, 10:08'
  }
] as const;

export const adminSections = [
  {
    title: 'Товары',
    description: 'Управление карточками, конфигурациями, ценами наличными и по карте.'
  },
  {
    title: 'Категории',
    description: 'Структура каталога, фильтры и SEO-friendly slug-ы разделов.'
  },
  {
    title: 'Главные блоки',
    description: 'Hero, категории на главной и визуальные акцентные секции.'
  },
  {
    title: 'Заказы / заявки',
    description: 'Заявки из checkout и Telegram-лента для оператора.'
  },
  {
    title: 'Настройки магазина',
    description: 'Контакты, соцсети, режим работы, ценовые правила и тексты.'
  }
] as const;
