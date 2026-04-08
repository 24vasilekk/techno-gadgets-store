'use client';

import { useEffect, useState } from 'react';

import { siteConfig } from '@/data/site-config';
import type { CheckoutDeliveryMethod, CheckoutPaymentMethod } from '@/lib/order';

export const ADMIN_STORE_SETTINGS_STORAGE_KEY = 'techno-agents-store-settings';

export type StoreMethod<T extends string> = {
  id: T;
  label: string;
  enabled: boolean;
};

export type StoreSettings = {
  storeName: string;
  logoTextMain: string;
  logoTextAccent: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  footerText: string;
  footerDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Array<{ value: string; label: string }>;
  };
  pricingNotes: {
    cash: string;
    card: string;
  };
  socialLinks: {
    threads: string;
    telegram: string;
    instagram: string;
    max: string;
  };
  deliveryMethods: StoreMethod<CheckoutDeliveryMethod>[];
  paymentMethods: StoreMethod<CheckoutPaymentMethod>[];
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
    defaultOgImage: string;
  };
};

export function getDefaultStoreSettings(): StoreSettings {
  return {
    storeName: siteConfig.storeName,
    logoTextMain: siteConfig.logoTextMain,
    logoTextAccent: siteConfig.logoTextAccent,
    logoUrl: siteConfig.logoUrl,
    contactPhone: siteConfig.contactPhone,
    contactEmail: siteConfig.contactEmail,
    footerText: siteConfig.footerText,
    footerDescription: siteConfig.footerDescription,
    hero: {
      eyebrow: siteConfig.hero.eyebrow,
      title: siteConfig.hero.title,
      description: siteConfig.hero.description,
      ctaPrimary: siteConfig.hero.ctaPrimary,
      ctaSecondary: siteConfig.hero.ctaSecondary,
      stats: siteConfig.hero.stats.map((item) => ({ ...item }))
    },
    pricingNotes: {
      cash: siteConfig.pricingNotes.cash,
      card: siteConfig.pricingNotes.card
    },
    socialLinks: { ...siteConfig.socialLinks },
    deliveryMethods: siteConfig.deliveryMethods.map((method) => ({ ...method })),
    paymentMethods: siteConfig.paymentMethods.map((method) => ({ ...method })),
    seo: { ...siteConfig.seo }
  };
}

export function parseStoreSettings(raw: string | null): StoreSettings | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoreSettings>;
    const defaults = getDefaultStoreSettings();
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      ...defaults,
      ...parsed,
      hero: {
        ...defaults.hero,
        ...parsed.hero,
        stats:
          Array.isArray(parsed.hero?.stats) && parsed.hero?.stats.length
            ? parsed.hero.stats.slice(0, 4).map((stat, index) => ({
                value: stat?.value || defaults.hero.stats[index]?.value || '',
                label: stat?.label || defaults.hero.stats[index]?.label || ''
              }))
            : defaults.hero.stats
      },
      pricingNotes: { ...defaults.pricingNotes, ...parsed.pricingNotes },
      socialLinks: { ...defaults.socialLinks, ...parsed.socialLinks },
      deliveryMethods:
        Array.isArray(parsed.deliveryMethods) && parsed.deliveryMethods.length
          ? parsed.deliveryMethods.map((method) => ({
              id: method.id === 'pickup' || method.id === 'delivery' ? method.id : 'pickup',
              label: method.label || '',
              enabled: method.enabled !== false
            }))
          : defaults.deliveryMethods,
      paymentMethods:
        Array.isArray(parsed.paymentMethods) && parsed.paymentMethods.length
          ? parsed.paymentMethods.map((method) => ({
              id: method.id === 'cash' || method.id === 'card' || method.id === 'other' ? method.id : 'cash',
              label: method.label || '',
              enabled: method.enabled !== false
            }))
          : defaults.paymentMethods,
      seo: { ...defaults.seo, ...parsed.seo }
    };
  } catch {
    return null;
  }
}

export function readStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') return getDefaultStoreSettings();
  const parsed = parseStoreSettings(window.localStorage.getItem(ADMIN_STORE_SETTINGS_STORAGE_KEY));
  return parsed ?? getDefaultStoreSettings();
}

export function persistStoreSettings(settings: StoreSettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_STORE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function useStoreSettings(): StoreSettings {
  const [settings, setSettings] = useState<StoreSettings>(getDefaultStoreSettings());

  useEffect(() => {
    setSettings(readStoreSettings());
  }, []);

  return settings;
}
