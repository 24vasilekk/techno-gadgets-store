# Techno Agents Store

Премиальный e-commerce storefront на `Next.js 14` (App Router) с акцентом на технику и конфигурируемые товары.

## Стек

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Компонентный UI (`shadcn/ui`-style primitives)
- Локальное состояние корзины через React Context + `localStorage`

## Быстрый старт

```bash
npm install
cp .env.example .env.local
npm run dev
```

Открыть: `http://localhost:3000`

Production-проверка:

```bash
npm run build
npm run start
```

## Основные возможности

- Главная страница с premium hero-композицией, категориями и соцблоком
- Каталог с:
  - поиском
  - фильтрами (категория, бренд, цвет, цена, наличие)
  - сортировкой
  - query params в URL
  - mobile drawer для фильтров
- Страница товара:
  - галерея
  - характеристики
  - конфигуратор (цвет, память, состояние, SIM и т.д.)
  - динамический пересчет цены
  - похожие товары
- Двойная цена:
  - наличные
  - карта/безнал (наценка)
- Корзина:
  - добавление с выбранной конфигурацией
  - изменение количества
  - удаление
  - выбор оплаты/доставки
  - пересчет итогов
  - persistence в `localStorage`
- Оформление заказа:
  - форма с валидацией
  - отправка заявки в Telegram через server-side API route (`/api/order`)
  - статусы отправки: loading / success / error
- SEO-база:
  - metadata, Open Graph, Twitter
  - `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon (`app/icon.svg`)
- Состояния:
  - loading / error / empty для ключевых маршрутов

## Структура проекта (основная)

```text
app/
  layout.tsx
  page.tsx
  about/page.tsx
  catalog/page.tsx
  catalog/[slug]/page.tsx
  cart/page.tsx
  error.tsx
  loading.tsx
  robots.ts
  sitemap.ts
  manifest.ts
components/
  cart/
  catalog/
  product/
  sections/
  layout/
  ui/
data/
  mock/
    categories.ts
    products.ts
    cart.ts
    index.ts
features/
  cart/cart-context.tsx
lib/
  catalog.ts
  pricing.ts
  repositories.ts
  format.ts
types/
  catalog.ts
```

## Данные и расширяемость

Mock-данные расположены в `data/mock/*`:

- `categories.ts` — категории
- `products.ts` — товары + конфигурации
- `cart.ts` — seed корзины (по умолчанию пустой)
- `index.ts` — агрегированные экспорты (`mockCatalogData`, `mockCartSeed`)

Это позволяет безболезненно заменить моки на backend-источник.

## Подключение backend (план интеграции)

В проекте уже есть интерфейс репозитория: `lib/repositories.ts`.

1. Создать, например, `ApiCatalogRepository`, реализующий `CatalogRepository`.
2. Заменить источник данных в `catalogRepository` на API-реализацию.
3. Перенести функции из `lib/catalog.ts` на слой сервиса/репозитория (или использовать server actions / route handlers).
4. Для корзины:
   - оставить локальный optimistic state на клиенте,
   - добавить синхронизацию с backend API (user cart / checkout).

## Telegram Bot API (заявки)

Для отправки заявок заполните переменные окружения:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

Где:
- `TELEGRAM_BOT_TOKEN` — токен бота от `@BotFather`
- `TELEGRAM_CHAT_ID` — ID чата/группы, куда приходят заявки

Важно:
- токен используется только на сервере в `app/api/order/route.ts`
- клиент не получает секретные данные

## Quality checklist (что уже закрыто)

- strict TypeScript и успешная production сборка
- non-interactive ESLint конфиг (`.eslintrc.json`)
- mobile-first UX и адаптивность
- a11y: фокус-состояния, aria-атрибуты на интерактивных элементах
- логическая целостность цены/оплаты/доставки/конфигурации
- localStorage persistence с базовой валидацией структуры

## Скрипты

- `npm run dev` — запуск в режиме разработки
- `npm run build` — production build
- `npm run start` — запуск production сервера
- `npm run lint` — ESLint проверка
