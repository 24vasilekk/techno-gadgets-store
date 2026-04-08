import type { Metadata } from 'next';

import { Reveal } from '@/components/motion/reveal';
import { AboutContactChannels } from '@/components/sections/about-contact-channels';
import { Separator } from '@/components/ui/separator';
import { BRAND_NAME, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'О нас',
  description: 'Techno Agents: оригинальная смарт-техника, гарантия, сервис и удобные способы получения по Москве и регионам.',
  keywords: ['о магазине техники', 'Techno Agents', 'оригинальная техника', 'доставка техники'],
  openGraph: {
    title: `${BRAND_NAME} — О нас`,
    description: 'Кто мы, как работаем и почему клиенты выбирают Techno Agents.',
    url: '/about',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${BRAND_NAME} — о нас` }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} — О нас`,
    description: 'Кто мы, как работаем и почему клиенты выбирают Techno Agents.',
    images: [DEFAULT_OG_IMAGE]
  }
};

const strengths = [
  {
    title: 'Только оригинальная техника',
    text: 'Работаем с проверенными устройствами и прозрачными условиями покупки.'
  },
  {
    title: 'Гарантия и сервис',
    text: 'Сопровождаем покупку после выдачи: консультации, поддержка и аккуратное сервисное обслуживание.'
  },
  {
    title: 'Удобная логистика',
    text: 'Самовывоз в Москве, курьерская доставка и отправки по России удобной для вас службой.'
  }
];

const values = [
  'Apple, Dyson, Samsung, Sony и другие мировые бренды',
  'Смартфоны, гаджеты, фото- и видеоустройства, аксессуары',
  'Демократичные цены и актуальные новинки без компромиссов по качеству',
  '5 лет стабильной работы и внимания к клиентскому опыту'
];

export default function AboutPage(): JSX.Element {
  return (
    <section className="container py-8 md:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-[linear-gradient(165deg,#ffffff,#fff7fc)] p-5 shadow-premium md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-28 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 bottom-0 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

        <div className="relative grid gap-10">
          <Reveal className="max-w-4xl space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">О Techno Agents</p>
            <h1 className="font-heading text-3xl leading-tight sm:text-4xl md:text-5xl">
              Всем привет! На связи команда Techno.Agents
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Мы занимаемся продажей строго оригинальной смарт-техники и помогаем подобрать устройства под реальный
              сценарий использования. В фокусе команды: качество, понятные условия и комфорт на каждом этапе покупки.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="interactive-surface space-y-5 rounded-2xl border border-black/10 bg-white p-5 md:p-6">
              <h2 className="font-heading text-2xl">Чем мы занимаемся</h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                Мы продаем оригинальную технику и аксессуары, предоставляем гарантию и сервисное обслуживание. В
                ассортименте представлены Apple, Dyson, Samsung, Sony и другие бренды, а также фото- и видеотехника,
                умные устройства и сопутствующие товары.
              </p>
              <Separator />
              <ul className="space-y-2 text-sm text-muted-foreground md:text-base">
                {values.map((value) => (
                  <li key={value} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="interactive-surface space-y-4 rounded-2xl border border-black/10 bg-white p-5 md:p-6">
              <h2 className="font-heading text-2xl">Почему выбирают нас</h2>
              <div className="space-y-3">
                {strengths.map((item) => (
                  <article key={item.title} className="rounded-xl border border-black/10 bg-[#fff5fb] p-4 transition-colors duration-300 hover:border-primary/45">
                    <h3 className="font-heading text-lg">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 rounded-2xl border border-black/10 bg-white p-5 md:grid-cols-2 md:p-6">
            <article className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Выдача и график</p>
              <h2 className="font-heading text-2xl md:text-3xl">Пункт выдачи в Москве</h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                Выдача товаров осуществляется по адресу: Багратионовский проезд, 7к20В (бизнес-центр «Конвент Плюс»).
                Работаем с понедельника по пятницу с 10:00 до 20:00.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                В субботу и воскресенье пункт выдачи не работает: в эти дни доступны консультации, а прием и отправка
                заказов выполняются только в рабочие дни.
              </p>
            </article>

            <article className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Доставка и оплата</p>
              <h2 className="font-heading text-2xl md:text-3xl">Гибкие условия получения</h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                Доступна доставка курьером по Москве, а также отправки через Яндекс, CDEK и другие службы удобным для
                вас способом.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                Оплату можно осуществить при самовывозе в Москве или переводом перед доставкой в другие города.
              </p>
            </article>
          </div>

          <div className="grid gap-6 rounded-2xl border border-black/10 bg-white p-5 md:grid-cols-[1fr,auto] md:items-end md:p-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Связь</p>
              <h2 className="font-heading text-2xl md:text-3xl">Свяжитесь с нами в удобном канале</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Напишите в мессенджер или соцсеть: оперативно подскажем по наличию, моделям и условиям получения.
              </p>
            </div>

            <AboutContactChannels />
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-premium">
            <div className="border-b border-black/10 px-5 py-4 md:px-6">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Локация</p>
              <h2 className="mt-1 font-heading text-2xl md:text-3xl">Мы на Яндекс.Карте</h2>
            </div>
            <iframe
              title="Карта Techno Agents"
              src="https://yandex.ru/map-widget/v1/?ll=37.617644%2C55.755819&z=12"
              className="h-[320px] w-full md:h-[420px]"
              loading="lazy"
            />
          </div>

          <div className="pointer-events-none relative h-10 overflow-hidden">
            <svg viewBox="0 0 600 80" className="h-full w-full opacity-60" fill="none" aria-hidden>
              <path
                d="M10 62C95 20 190 20 280 52C360 80 450 80 590 18"
                stroke="url(#about-grad)"
                strokeWidth="1.2"
              />
              <defs>
                <linearGradient id="about-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(15,23,42,0.2)" />
                  <stop offset="50%" stopColor="rgba(238,37,150,0.55)" />
                  <stop offset="100%" stopColor="rgba(15,23,42,0.2)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
