import { products } from '@/data/mock';
import type { HomeMainCategory } from '@/types/catalog';

export const ADMIN_HOME_BLOCKS_STORAGE_KEY = 'techno-agents-admin-home-blocks';

export type HomeBlockIconName = 'apple' | 'accessories' | 'smartphones' | 'other';

export type HomeBlockConfig = {
  id: HomeMainCategory;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
  iconName: HomeBlockIconName;
  customSvg: string;
  featuredProductIds: string[];
};

export type AdminManagedHomeBlocks = {
  blocks: HomeBlockConfig[];
  updatedAt: string;
};

const SEED_BLOCKS: HomeBlockConfig[] = [
  {
    id: 'apple',
    title: 'Apple',
    description: 'iPhone и устройства экосистемы',
    enabled: true,
    order: 0,
    iconName: 'apple',
    customSvg: '',
    featuredProductIds: products.filter((product) => product.mainCategory === 'apple').slice(0, 4).map((product) => product.id)
  },
  {
    id: 'accessories',
    title: 'Аксессуары',
    description: 'Зарядка, аудио, защита',
    enabled: true,
    order: 1,
    iconName: 'accessories',
    customSvg: '',
    featuredProductIds: products
      .filter((product) => product.mainCategory === 'accessories')
      .slice(0, 4)
      .map((product) => product.id)
  },
  {
    id: 'smartphones',
    title: 'Смартфоны',
    description: 'Флагманы Android',
    enabled: true,
    order: 2,
    iconName: 'smartphones',
    customSvg: '',
    featuredProductIds: products
      .filter((product) => product.mainCategory === 'smartphones')
      .slice(0, 4)
      .map((product) => product.id)
  },
  {
    id: 'other',
    title: 'Другое',
    description: 'Носимые устройства и гаджеты',
    enabled: true,
    order: 3,
    iconName: 'other',
    customSvg: '',
    featuredProductIds: products.filter((product) => product.mainCategory === 'other').slice(0, 4).map((product) => product.id)
  }
];

function normalizeBlock(raw: Partial<HomeBlockConfig>, fallback: HomeBlockConfig): HomeBlockConfig {
  return {
    id: fallback.id,
    title: typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : fallback.title,
    description:
      typeof raw.description === 'string' && raw.description.trim() ? raw.description.trim() : fallback.description,
    enabled: raw.enabled !== false,
    order: typeof raw.order === 'number' ? raw.order : fallback.order,
    iconName:
      raw.iconName === 'apple' || raw.iconName === 'accessories' || raw.iconName === 'smartphones' || raw.iconName === 'other'
        ? raw.iconName
        : fallback.iconName,
    customSvg: typeof raw.customSvg === 'string' ? raw.customSvg : '',
    featuredProductIds: Array.isArray(raw.featuredProductIds)
      ? raw.featuredProductIds.filter((id): id is string => typeof id === 'string')
      : fallback.featuredProductIds
  };
}

export function createSeedHomeBlocks(): AdminManagedHomeBlocks {
  return {
    blocks: SEED_BLOCKS.map((block) => ({ ...block, featuredProductIds: [...block.featuredProductIds] })),
    updatedAt: new Date().toISOString()
  };
}

export function parseManagedHomeBlocks(raw: string | null): AdminManagedHomeBlocks | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AdminManagedHomeBlocks>;
    if (!parsed || !Array.isArray(parsed.blocks)) return null;

    const seed = createSeedHomeBlocks().blocks;
    const byId = new Map(parsed.blocks.map((block) => [block.id, block] as const));
    const blocks = seed.map((fallback) => normalizeBlock(byId.get(fallback.id) ?? {}, fallback));

    return {
      blocks: blocks.sort((a, b) => a.order - b.order),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export function getHomeBlocksForClient(): HomeBlockConfig[] {
  if (typeof window === 'undefined') {
    return createSeedHomeBlocks().blocks;
  }

  const parsed = parseManagedHomeBlocks(window.localStorage.getItem(ADMIN_HOME_BLOCKS_STORAGE_KEY));
  return (parsed?.blocks ?? createSeedHomeBlocks().blocks).sort((a, b) => a.order - b.order);
}
