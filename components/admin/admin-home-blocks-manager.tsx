'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type HomeBlockConfig, type HomeBlockIconName } from '@/features/admin/home-blocks';
import { storeRepository } from '@/features/data-layer/repository';

const ICON_OPTIONS: Array<{ value: HomeBlockIconName; label: string }> = [
  { value: 'apple', label: 'Apple' },
  { value: 'accessories', label: 'Аксессуары' },
  { value: 'smartphones', label: 'Смартфоны' },
  { value: 'other', label: 'Другое' }
];

export function AdminHomeBlocksManager(): JSX.Element {
  const [blocks, setBlocks] = useState<HomeBlockConfig[]>([]);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const seed = storeRepository.getHomeBlocks();
    setBlocks(seed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    storeRepository.saveHomeBlocks(blocks);
  }, [blocks, ready]);

  const products = useMemo(() => {
    return storeRepository
      .getManagedProducts()
      .filter((entry) => !entry.hidden)
      .map((entry) => entry.product)
      .sort((a, b) => a.name.localeCompare(b.name, 'ru-RU'));
  }, []);

  const updateBlock = (blockId: HomeBlockConfig['id'], patch: Partial<HomeBlockConfig>) => {
    setBlocks((prev) => prev.map((block) => (block.id === blockId ? { ...block, ...patch } : block)));
  };

  const toggleFeaturedProduct = (blockId: HomeBlockConfig['id'], productId: string) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) return block;
        const exists = block.featuredProductIds.includes(productId);
        return {
          ...block,
          featuredProductIds: exists
            ? block.featuredProductIds.filter((id) => id !== productId)
            : [...block.featuredProductIds, productId]
        };
      })
    );
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    setBlocks((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const current = next[index];
      next[index] = next[nextIndex];
      next[nextIndex] = current;
      return next.map((block, idx) => ({ ...block, order: idx }));
    });
  };

  const addFeaturedFromMainCategory = (blockId: HomeBlockConfig['id']) => {
    const block = blocks.find((item) => item.id === blockId);
    if (!block) return;
    const candidates = products.filter((product) => product.mainCategory === block.id).map((product) => product.id);
    const unique = Array.from(new Set([...block.featuredProductIds, ...candidates])).slice(0, 12);
    updateBlock(blockId, { featuredProductIds: unique });
    setStatus(`Для блока "${block.title}" добавлены товары из соответствующей главной категории.`);
  };

  const removeAllFeatured = (blockId: HomeBlockConfig['id']) => {
    updateBlock(blockId, { featuredProductIds: [] });
  };

  if (!ready) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-muted-foreground">Загружаем конфигурацию главных блоков...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="font-heading text-2xl">Главные блоки</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Управляйте 4 ключевыми блоками главной: название, описание, иконка/SVG, порядок, активность и featured товары.
        </p>
      </div>

      {status ? <p className="text-sm text-emerald-300">{status}</p> : null}

      <div className="space-y-3">
        {blocks.map((block, index) => {
          const blockProducts = products.filter((product) => product.mainCategory === block.id);
          return (
            <article key={block.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-heading text-lg">
                  {block.title} <span className="text-sm text-muted-foreground">({block.id})</span>
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => moveBlock(index, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => moveBlock(index, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Название блока</span>
                  <Input value={block.title} onChange={(event) => updateBlock(block.id, { title: event.target.value })} />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm text-muted-foreground">Иконка (preset)</span>
                  <select
                    value={block.iconName}
                    onChange={(event) => updateBlock(block.id, { iconName: event.target.value as HomeBlockIconName })}
                    className="h-12 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
                  >
                    {ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm text-muted-foreground">Описание блока</span>
                  <Input
                    value={block.description}
                    onChange={(event) => updateBlock(block.id, { description: event.target.value })}
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm text-muted-foreground">Переопределить SVG (необязательно)</span>
                  <textarea
                    rows={4}
                    value={block.customSvg}
                    onChange={(event) => updateBlock(block.id, { customSvg: event.target.value })}
                    placeholder="<svg viewBox='0 0 24 24' ...>...</svg>"
                    className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-foreground"
                  />
                </label>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateBlock(block.id, { enabled: !block.enabled })}
                  className={`inline-flex min-h-9 items-center rounded-md border px-3 text-xs ${
                    block.enabled
                      ? 'border-primary/50 bg-primary/10 text-foreground'
                      : 'border-white/12 bg-white/[0.02] text-muted-foreground'
                  }`}
                >
                  {block.enabled ? 'Блок включен' : 'Блок выключен'}
                </button>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">Featured товары блока</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => addFeaturedFromMainCategory(block.id)}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Добавить из категории
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => removeAllFeatured(block.id)}>
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Очистить
                    </Button>
                  </div>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Отмечено: {block.featuredProductIds.length}. Эти товары будут приоритетными в каталоге при входе из блока.
                </p>
                <div className="max-h-56 space-y-1 overflow-auto rounded-md border border-white/10 bg-white/[0.01] p-2">
                  {blockProducts.length ? (
                    blockProducts.map((product) => {
                      const selected = block.featuredProductIds.includes(product.id);
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => toggleFeaturedProduct(block.id, product.id)}
                          className={`flex min-h-9 w-full items-center justify-between rounded-md border px-3 text-left text-xs transition ${
                            selected
                              ? 'border-primary/45 bg-primary/10 text-foreground'
                              : 'border-transparent bg-white/[0.02] text-muted-foreground hover:border-white/15 hover:text-foreground'
                          }`}
                        >
                          <span className="truncate">{product.name}</span>
                          <span className="ml-2 shrink-0 text-[10px] uppercase tracking-[0.14em]">
                            {selected ? 'Featured' : 'Обычный'}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Пока нет товаров, привязанных к этому главному блоку. Назначьте им блок в разделе &quot;Товары&quot;.
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
