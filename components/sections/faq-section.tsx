'use client';

import { ChevronDown } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';

const FAQ_ITEMS = [
  {
    question: 'Вся техника на сайте оригинальная?',
    answer:
      'Да, работаем только с официальными поставками и проверяем устройства перед выдачей. В комплекте всегда полный набор документов.'
  },
  {
    question: 'Какая гарантия на устройства?',
    answer:
      'Стандартная гарантия 12 месяцев. Для части моделей доступно расширение гарантии и сервисные планы с приоритетной поддержкой.'
  },
  {
    question: 'Как работает доставка по Москве?',
    answer:
      'Доставляем в день заказа или на удобный слот. Курьер привозит устройство запечатанным, можно проверить серийный номер на месте.'
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer:
      'Принимаем наличные, карту, безналичный расчет и оплату по счету для юрлиц. Условия и итоговая цена прозрачны до оформления.'
  }
];

export function FaqSection(): JSX.Element {
  return (
    <section className="container py-8 sm:py-10">
      <Reveal className="overflow-hidden rounded-3xl border border-primary/25 bg-[linear-gradient(165deg,#ff9fce,#ffc1df)] p-6 text-white shadow-premium sm:p-8">
        <div className="mb-5 space-y-1 sm:mb-6">
          <p className="text-3xl font-heading leading-none sm:text-4xl">FAQ</p>
          <p className="text-sm text-white/78 sm:text-base">Часто задаваемые вопросы</p>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group rounded-xl border border-white/30 bg-white/16 px-4 py-3 open:bg-white/22">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-xl leading-tight marker:content-none sm:text-2xl">
                <span>{item.question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-white/84 sm:text-base">{item.answer}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
