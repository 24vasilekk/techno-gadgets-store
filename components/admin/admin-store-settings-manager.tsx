'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getDefaultStoreSettings,
  type StoreSettings
} from '@/features/admin/store-settings';
import { storeRepository } from '@/features/data-layer/repository';
import type { CheckoutDeliveryMethod, CheckoutPaymentMethod } from '@/lib/order';

function Section({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="font-heading text-lg">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function MethodEditor<T extends string>({
  methods,
  onChange
}: {
  methods: Array<{ id: T; label: string; enabled: boolean }>;
  onChange: (next: Array<{ id: T; label: string; enabled: boolean }>) => void;
}): JSX.Element {
  return (
    <div className="space-y-2">
      {methods.map((method, index) => (
        <div key={`${method.id}-${index}`} className="grid gap-2 md:grid-cols-[1fr,auto]">
          <Input
            value={method.label}
            onChange={(event) =>
              onChange(methods.map((item, idx) => (idx === index ? { ...item, label: event.target.value } : item)))
            }
          />
          <button
            type="button"
            onClick={() =>
              onChange(methods.map((item, idx) => (idx === index ? { ...item, enabled: !item.enabled } : item)))
            }
            className={`min-h-11 rounded-md border px-3 text-xs ${
              method.enabled ? 'border-primary/45 bg-primary/10' : 'border-white/12 bg-white/[0.03]'
            }`}
          >
            {method.enabled ? 'Включено' : 'Отключено'}
          </button>
        </div>
      ))}
    </div>
  );
}

export function AdminStoreSettingsManager(): JSX.Element {
  const [form, setForm] = useState<StoreSettings>(getDefaultStoreSettings());
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setForm(storeRepository.getStoreSettings());
    setReady(true);
  }, []);

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    storeRepository.saveStoreSettings(form);
    setStatus('Настройки сохранены и применены на публичных клиентских секциях.');
  };

  const reset = () => {
    const defaults = getDefaultStoreSettings();
    setForm(defaults);
    storeRepository.saveStoreSettings(defaults);
    setStatus('Настройки сброшены к значениям по умолчанию.');
  };

  if (!ready) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-muted-foreground">Загружаем настройки магазина...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl">Настройки магазина</h2>
        <p className="text-sm text-muted-foreground">
          Единый центр управления брендом, текстами, контактами, методами оплаты/доставки и базовыми SEO-полями.
        </p>
      </div>

      {status ? <p className="text-sm text-emerald-300">{status}</p> : null}

      <Section title="Бренд и контакты">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Название магазина</span>
            <Input value={form.storeName} onChange={(event) => update('storeName', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Логотип (URL, опционально)</span>
            <Input value={form.logoUrl} onChange={(event) => update('logoUrl', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Текст логотипа: часть 1</span>
            <Input value={form.logoTextMain} onChange={(event) => update('logoTextMain', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Текст логотипа: акцент</span>
            <Input value={form.logoTextAccent} onChange={(event) => update('logoTextAccent', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Контактный телефон</span>
            <Input value={form.contactPhone} onChange={(event) => update('contactPhone', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Контактный email</span>
            <Input value={form.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} />
          </label>
        </div>
      </Section>

      <Section title="Соцсети">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Threads</span>
            <Input value={form.socialLinks.threads} onChange={(event) => update('socialLinks', { ...form.socialLinks, threads: event.target.value })} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Telegram</span>
            <Input value={form.socialLinks.telegram} onChange={(event) => update('socialLinks', { ...form.socialLinks, telegram: event.target.value })} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Instagram</span>
            <Input value={form.socialLinks.instagram} onChange={(event) => update('socialLinks', { ...form.socialLinks, instagram: event.target.value })} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-muted-foreground">Max</span>
            <Input value={form.socialLinks.max} onChange={(event) => update('socialLinks', { ...form.socialLinks, max: event.target.value })} />
          </label>
        </div>
      </Section>

      <Section title="Тексты главной страницы">
        <div className="grid gap-3">
          <Input value={form.hero.eyebrow} onChange={(event) => update('hero', { ...form.hero, eyebrow: event.target.value })} />
          <textarea
            rows={2}
            value={form.hero.title}
            onChange={(event) => update('hero', { ...form.hero, title: event.target.value })}
            className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm"
          />
          <textarea
            rows={3}
            value={form.hero.description}
            onChange={(event) => update('hero', { ...form.hero, description: event.target.value })}
            className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={form.hero.ctaPrimary} onChange={(event) => update('hero', { ...form.hero, ctaPrimary: event.target.value })} />
            <Input value={form.hero.ctaSecondary} onChange={(event) => update('hero', { ...form.hero, ctaSecondary: event.target.value })} />
          </div>
        </div>
      </Section>

      <Section title="Тексты цены и юридические заметки">
        <div className="grid gap-3">
          <Input
            value={form.pricingNotes.cash}
            onChange={(event) => update('pricingNotes', { ...form.pricingNotes, cash: event.target.value })}
          />
          <textarea
            rows={2}
            value={form.pricingNotes.card}
            onChange={(event) => update('pricingNotes', { ...form.pricingNotes, card: event.target.value })}
            className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm"
          />
        </div>
      </Section>

      <Section title="Способы доставки">
        <MethodEditor<CheckoutDeliveryMethod>
          methods={form.deliveryMethods}
          onChange={(next) => update('deliveryMethods', next)}
        />
      </Section>

      <Section title="Способы оплаты">
        <MethodEditor<CheckoutPaymentMethod>
          methods={form.paymentMethods}
          onChange={(next) => update('paymentMethods', next)}
        />
      </Section>

      <Section title="Footer и SEO">
        <div className="grid gap-3">
          <textarea
            rows={2}
            value={form.footerDescription}
            onChange={(event) => update('footerDescription', event.target.value)}
            className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm"
          />
          <Input value={form.footerText} onChange={(event) => update('footerText', event.target.value)} />
          <Input value={form.seo.defaultTitle} onChange={(event) => update('seo', { ...form.seo, defaultTitle: event.target.value })} />
          <textarea
            rows={2}
            value={form.seo.defaultDescription}
            onChange={(event) => update('seo', { ...form.seo, defaultDescription: event.target.value })}
            className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm"
          />
          <Input value={form.seo.defaultKeywords} onChange={(event) => update('seo', { ...form.seo, defaultKeywords: event.target.value })} />
          <Input value={form.seo.defaultOgImage} onChange={(event) => update('seo', { ...form.seo, defaultOgImage: event.target.value })} />
        </div>
      </Section>

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={reset}>
          Сбросить по умолчанию
        </Button>
        <Button onClick={save}>Сохранить настройки</Button>
      </div>
    </div>
  );
}
