'use client';

import { ArrowDown, ArrowUp, Edit2, Eye, EyeOff, Plus, Star, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  type AdminManagedProduct,
  type EditableOptionGroup,
  type ProductFormState,
  buildInitialForm,
  fromFormState,
  getCategoryOptions,
  toFormState,
  validateProductForm
} from '@/features/admin/products';
import { storeRepository } from '@/features/data-layer/repository';
import type { HomeMainCategory, ProductAvailabilityStatus } from '@/types/catalog';

const mainCategoryOptions: Array<{ value: HomeMainCategory; label: string }> = [
  { value: 'apple', label: 'Apple' },
  { value: 'accessories', label: 'Аксессуары' },
  { value: 'smartphones', label: 'Смартфоны' },
  { value: 'other', label: 'Другое' }
];

const stockStatusOptions: Array<{ value: ProductAvailabilityStatus; label: string }> = [
  { value: 'in_stock', label: 'В наличии' },
  { value: 'low_stock', label: 'Мало осталось' },
  { value: 'preorder', label: 'Предзаказ' },
  { value: 'out_of_stock', label: 'Нет в наличии' }
];

type EditorMode = 'create' | 'edit';

export function AdminProductsManager(): JSX.Element {
  const categories = getCategoryOptions();
  const [items, setItems] = useState<AdminManagedProduct[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('create');
  const [form, setForm] = useState<ProductFormState>(buildInitialForm(categories[0]?.id));

  useEffect(() => {
    const seed = storeRepository.getManagedProducts();
    setItems(seed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    storeRepository.saveManagedProducts(items);
  }, [items, ready]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((entry) => {
      if (categoryFilter !== 'all' && entry.product.categoryId !== categoryFilter) return false;
      if (!q) return true;
      const text = `${entry.product.name} ${entry.product.slug} ${entry.product.brand}`.toLowerCase();
      return text.includes(q);
    });
  }, [items, search, categoryFilter]);

  const openCreate = () => {
    setEditorMode('create');
    setForm(buildInitialForm(categories[0]?.id));
    setError('');
    setEditorOpen(true);
  };

  const openEdit = (entry: AdminManagedProduct) => {
    setEditorMode('edit');
    setForm(toFormState(entry));
    setError('');
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setError('');
  };

  const save = () => {
    setError('');
    setSuccess('');

    const validation = validateProductForm(form, items);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    const existing = items.find((item) => item.id === form.id);
    const next = fromFormState(form, validation.normalizedSlug, existing);

    setItems((prev) => {
      if (existing) {
        return prev.map((item) => (item.id === existing.id ? next : item));
      }
      return [next, ...prev];
    });

    setSuccess(existing ? 'Товар обновлен.' : 'Товар создан.');
    setEditorOpen(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSuccess('Товар удален.');
  };

  const patch = (id: string, updater: (entry: AdminManagedProduct) => AdminManagedProduct) => {
    setItems((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const setSpec = (index: number, key: 'key' | 'value', value: string) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((row, idx) => (idx === index ? { ...row, [key]: value } : row))
    }));
  };

  const addSpecRow = () => setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }));
  const removeSpecRow = (index: number) =>
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.length <= 1 ? prev.specs : prev.specs.filter((_, idx) => idx !== index)
    }));

  const setGalleryImage = (index: number, value: string) =>
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((url, idx) => (idx === index ? value : url))
    }));

  const addGalleryImage = () => setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ''] }));
  const removeGalleryImage = (index: number) =>
    setForm((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, idx) => idx !== index) }));

  const addOptionGroup = () =>
    setForm((prev) => ({
      ...prev,
      optionGroups: [
        ...prev.optionGroups,
        {
          id: `param-${prev.optionGroups.length + 1}`,
          label: 'Новый параметр',
          enabled: true,
          required: false,
          values: [
                {
                  id: 'value-1',
                  label: 'Значение 1',
                  enabled: true,
                  visualType: 'text',
                  visualValue: '',
                  priceModifierCash: 0,
                  priceModifierCard: 0
                }
          ]
        }
      ]
    }));

  const patchOptionGroup = (index: number, patchData: Partial<EditableOptionGroup>) =>
    setForm((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, idx) => (idx === index ? { ...group, ...patchData } : group))
    }));

  const removeOptionGroup = (index: number) =>
    setForm((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.filter((_, idx) => idx !== index)
    }));

  const moveOptionGroup = (index: number, direction: -1 | 1) =>
    setForm((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.optionGroups.length) return prev;
      const next = [...prev.optionGroups];
      const current = next[index];
      next[index] = next[nextIndex];
      next[nextIndex] = current;
      return { ...prev, optionGroups: next };
    });

  const addOptionValue = (groupIndex: number) =>
    setForm((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, idx) =>
        idx === groupIndex
          ? {
              ...group,
              values: [
                ...group.values,
                {
                  id: `value-${group.values.length + 1}`,
                  label: `Значение ${group.values.length + 1}`,
                  enabled: true,
                  visualType: 'text',
                  visualValue: '',
                  priceModifierCash: 0,
                  priceModifierCard: 0
                }
              ]
            }
          : group
      )
    }));

  const patchOptionValue = (
    groupIndex: number,
    valueIndex: number,
    patchData: Partial<EditableOptionGroup['values'][number]>
  ) =>
    setForm((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, idx) =>
        idx === groupIndex
          ? {
              ...group,
              values: group.values.map((value, vIdx) => (vIdx === valueIndex ? { ...value, ...patchData } : value))
            }
          : group
      )
    }));

  const removeOptionValue = (groupIndex: number, valueIndex: number) =>
    setForm((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, idx) =>
        idx === groupIndex
          ? {
              ...group,
              values:
                group.values.length <= 1
                  ? group.values
                  : group.values.filter((_, vIdx) => vIdx !== valueIndex)
            }
          : group
      )
    }));

  const moveOptionValue = (groupIndex: number, valueIndex: number, direction: -1 | 1) =>
    setForm((prev) => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, idx) => {
        if (idx !== groupIndex) return group;
        const nextIndex = valueIndex + direction;
        if (nextIndex < 0 || nextIndex >= group.values.length) return group;
        const nextValues = [...group.values];
        const current = nextValues[valueIndex];
        nextValues[valueIndex] = nextValues[nextIndex];
        nextValues[nextIndex] = current;
        return { ...group, values: nextValues };
      })
    }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-heading text-2xl">Товары</h2>
          <p className="text-sm text-muted-foreground">Создание, редактирование и управление видимостью товаров на витрине.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          Добавить товар
        </Button>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 md:grid-cols-[1fr,220px]">
        <Input placeholder="Поиск по названию, slug, бренду" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-12 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
        >
          <option value="all">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

      <div className="space-y-3">
        {filtered.map((entry) => (
          <article key={entry.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-medium">{entry.product.name}</p>
                <p className="text-xs text-muted-foreground">/{entry.product.slug}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entry.product.brand} • {entry.product.category}
                  {entry.product.subcategory ? ` / ${entry.product.subcategory}` : ''}
                </p>
                <p className="mt-1 text-sm">
                  Наличные: {entry.product.cashPrice?.toLocaleString('ru-RU')} ₽ • Карта: {entry.product.cardPrice?.toLocaleString('ru-RU')} ₽
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    patch(entry.id, (item) => ({
                      ...item,
                      hidden: !item.hidden,
                      updatedAt: new Date().toISOString()
                    }))
                  }
                >
                  {entry.hidden ? <Eye className="mr-1.5 h-4 w-4" /> : <EyeOff className="mr-1.5 h-4 w-4" />}
                  {entry.hidden ? 'Показать' : 'Скрыть'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(entry)}>
                  <Edit2 className="mr-1.5 h-4 w-4" />
                  Редактировать
                </Button>
                <Button variant="outline" size="sm" onClick={() => remove(entry.id)}>
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Удалить
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <FlagToggle
                label="Новинка"
                active={entry.flags.isNew}
                onClick={() =>
                  patch(entry.id, (item) => ({
                    ...item,
                    flags: {
                      ...item.flags,
                      isNew: !item.flags.isNew,
                      isHit: !item.flags.isNew ? false : item.flags.isHit
                    },
                    updatedAt: new Date().toISOString()
                  }))
                }
              />
              <FlagToggle
                label="Хит"
                active={entry.flags.isHit}
                onClick={() =>
                  patch(entry.id, (item) => ({
                    ...item,
                    flags: {
                      ...item.flags,
                      isHit: !item.flags.isHit,
                      isNew: !item.flags.isHit ? false : item.flags.isNew
                    },
                    updatedAt: new Date().toISOString()
                  }))
                }
              />
              <FlagToggle
                label="Рекомендуемый"
                active={entry.flags.recommended}
                onClick={() =>
                  patch(entry.id, (item) => ({
                    ...item,
                    flags: { ...item.flags, recommended: !item.flags.recommended },
                    updatedAt: new Date().toISOString()
                  }))
                }
                icon={<Star className="h-3.5 w-3.5" />}
              />
            </div>
          </article>
        ))}
      </div>

      {editorOpen ? (
        <section className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-3">
          <div className="max-h-[94vh] w-full max-w-6xl overflow-auto rounded-2xl border border-white/10 bg-[#0f1015] p-5 shadow-premium md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-2xl">{editorMode === 'create' ? 'Новый товар' : 'Редактирование товара'}</h3>
                <p className="text-sm text-muted-foreground">Гибкая форма для контента, цен и конфигуратора.</p>
              </div>
              <Button variant="outline" size="sm" onClick={closeEditor}>
                Закрыть
              </Button>
            </div>

            <div className="space-y-5">
              <EditorSection title="1. Базовая информация">
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Название">
                    <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
                  </FormField>
                  <FormField label="Slug">
                    <Input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} />
                  </FormField>
                  <FormField label="Бренд">
                    <Input value={form.brand} onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))} />
                  </FormField>
                  <FormField label="Подкатегория">
                    <Input value={form.subcategory} onChange={(event) => setForm((prev) => ({ ...prev, subcategory: event.target.value }))} />
                  </FormField>
                </div>
              </EditorSection>

              <EditorSection title="2. Категории и витрина">
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Категория">
                    <select
                      value={form.categoryId}
                      onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                      className="h-12 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Главный блок">
                    <select
                      value={form.mainCategory}
                      onChange={(event) => setForm((prev) => ({ ...prev, mainCategory: event.target.value as HomeMainCategory }))}
                      className="h-12 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
                    >
                      {mainCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <FlagToggle label="Скрыт с сайта" active={form.hidden} onClick={() => setForm((prev) => ({ ...prev, hidden: !prev.hidden }))} />
                  <FlagToggle
                    label="Новинка"
                    active={form.flags.isNew}
                    onClick={() => setForm((prev) => ({ ...prev, flags: { ...prev.flags, isNew: !prev.flags.isNew, isHit: !prev.flags.isNew ? false : prev.flags.isHit } }))}
                  />
                  <FlagToggle
                    label="Хит"
                    active={form.flags.isHit}
                    onClick={() => setForm((prev) => ({ ...prev, flags: { ...prev.flags, isHit: !prev.flags.isHit, isNew: !prev.flags.isHit ? false : prev.flags.isNew } }))}
                  />
                  <FlagToggle
                    label="Рекомендуемый"
                    active={form.flags.recommended}
                    onClick={() => setForm((prev) => ({ ...prev, flags: { ...prev.flags, recommended: !prev.flags.recommended } }))}
                    icon={<Star className="h-3.5 w-3.5" />}
                  />
                </div>
              </EditorSection>

              <EditorSection title="3. Наличие и цены">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <FormField label="Статус наличия">
                    <select
                      value={form.stockStatus}
                      onChange={(event) => setForm((prev) => ({ ...prev, stockStatus: event.target.value as ProductAvailabilityStatus }))}
                      className="h-12 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
                    >
                      {stockStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Остаток">
                    <Input type="number" min={0} value={form.stockCount} onChange={(event) => setForm((prev) => ({ ...prev, stockCount: Number(event.target.value) || 0 }))} />
                  </FormField>
                  <FormField label="Цена наличными (₽)">
                    <Input type="number" min={0} value={form.cashPrice} onChange={(event) => setForm((prev) => ({ ...prev, cashPrice: Number(event.target.value) || 0 }))} />
                  </FormField>
                  <FormField label="Цена картой/безнал (₽)">
                    <Input type="number" min={0} value={form.cardPrice} onChange={(event) => setForm((prev) => ({ ...prev, cardPrice: Number(event.target.value) || 0 }))} />
                  </FormField>
                </div>
              </EditorSection>

              <EditorSection title="4. Описания">
                <div className="grid gap-3">
                  <FormField label="Краткое описание">
                    <textarea
                      rows={3}
                      value={form.shortDescription}
                      onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))}
                      className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm"
                    />
                  </FormField>
                  <FormField label="Полное описание">
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                      className="w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm"
                    />
                  </FormField>
                </div>
              </EditorSection>

              <EditorSection title="5. Изображения">
                <FormField label="Обложка (URL)">
                  <Input value={form.coverImage} onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))} />
                </FormField>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-muted-foreground">Галерея (URL)</p>
                  {form.galleryImages.map((url, index) => (
                    <div key={`${index}-${url}`} className="flex gap-2">
                      <Input value={url} onChange={(event) => setGalleryImage(index, event.target.value)} />
                      <Button variant="outline" size="sm" onClick={() => removeGalleryImage(index)}>
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addGalleryImage}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Добавить изображение
                  </Button>
                </div>
              </EditorSection>

              <EditorSection title="6. Характеристики">
                <div className="space-y-2">
                  {form.specs.map((row, index) => (
                    <div key={`${index}-${row.key}`} className="grid gap-2 md:grid-cols-[1fr,1fr,auto]">
                      <Input value={row.key} onChange={(event) => setSpec(index, 'key', event.target.value)} placeholder="Название" />
                      <Input value={row.value} onChange={(event) => setSpec(index, 'value', event.target.value)} placeholder="Значение" />
                      <Button variant="outline" size="sm" onClick={() => removeSpecRow(index)}>
                        Удалить
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addSpecRow}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Добавить характеристику
                  </Button>
                </div>
              </EditorSection>

              <EditorSection title="7. Конфигуратор и модификаторы цен">
                <div className="space-y-3">
                  {form.optionGroups.map((group, groupIndex) => (
                    <div key={`${group.id}-${groupIndex}`} className="rounded-xl border border-white/10 bg-black/25 p-3">
                      <div className="grid gap-2 md:grid-cols-[1fr,1fr,auto]">
                        <Input
                          value={group.id}
                          onChange={(event) => patchOptionGroup(groupIndex, { id: event.target.value })}
                          placeholder="id параметра, например memory"
                        />
                        <Input
                          value={group.label}
                          onChange={(event) => patchOptionGroup(groupIndex, { label: event.target.value })}
                          placeholder="Название параметра"
                        />
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => moveOptionGroup(groupIndex, -1)}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => moveOptionGroup(groupIndex, 1)}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => removeOptionGroup(groupIndex)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <FlagToggle
                          label="Включен"
                          active={group.enabled}
                          onClick={() => patchOptionGroup(groupIndex, { enabled: !group.enabled })}
                        />
                        <FlagToggle
                          label="Обязательный"
                          active={group.required}
                          onClick={() => patchOptionGroup(groupIndex, { required: !group.required })}
                        />
                      </div>

                      <div className="mt-3 space-y-2">
                        {group.values.map((value, valueIndex) => (
                          <div key={`${value.id}-${valueIndex}`} className="grid gap-2 md:grid-cols-[1fr,1fr,120px,140px,140px,120px,auto]">
                            <Input
                              value={value.id}
                              onChange={(event) => patchOptionValue(groupIndex, valueIndex, { id: event.target.value })}
                              placeholder="id"
                            />
                            <Input
                              value={value.label}
                              onChange={(event) => patchOptionValue(groupIndex, valueIndex, { label: event.target.value })}
                              placeholder="label"
                            />
                            <button
                              type="button"
                              onClick={() => patchOptionValue(groupIndex, valueIndex, { enabled: !value.enabled })}
                              className={`h-12 rounded-md border px-3 text-xs ${
                                value.enabled ? 'border-primary/45 bg-primary/10' : 'border-white/12 bg-white/[0.03]'
                              }`}
                            >
                              {value.enabled ? 'Вкл' : 'Выкл'}
                            </button>
                            <Input
                              type="number"
                              value={value.priceModifierCash}
                              onChange={(event) =>
                                patchOptionValue(groupIndex, valueIndex, {
                                  priceModifierCash: Number(event.target.value) || 0
                                })
                              }
                              placeholder="Cash Δ"
                            />
                            <Input
                              type="number"
                              value={value.priceModifierCard}
                              onChange={(event) =>
                                patchOptionValue(groupIndex, valueIndex, {
                                  priceModifierCard: Number(event.target.value) || 0
                                })
                              }
                              placeholder="Card Δ"
                            />
                            <select
                              value={value.visualType}
                              onChange={(event) =>
                                patchOptionValue(groupIndex, valueIndex, {
                                  visualType: event.target.value as 'text' | 'color' | 'chip'
                                })
                              }
                              className="h-12 rounded-md border border-white/12 bg-white/[0.03] px-3 text-sm"
                            >
                              <option value="text">Текст</option>
                              <option value="color">Цвет</option>
                              <option value="chip">Chip</option>
                            </select>
                            <Input
                              value={value.visualValue}
                              onChange={(event) =>
                                patchOptionValue(groupIndex, valueIndex, {
                                  visualValue: event.target.value
                                })
                              }
                              placeholder={value.visualType === 'color' ? '#A1B2C3' : 'Визуальный label'}
                            />
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => moveOptionValue(groupIndex, valueIndex, -1)}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => moveOptionValue(groupIndex, valueIndex, 1)}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => removeOptionValue(groupIndex, valueIndex)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addOptionValue(groupIndex)}>
                          <Plus className="mr-1.5 h-4 w-4" />
                          Добавить значение
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addOptionGroup}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Добавить параметр
                  </Button>
                </div>
              </EditorSection>
            </div>

            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={closeEditor}>
                Отмена
              </Button>
              <Button onClick={save}>{editorMode === 'create' ? 'Создать товар' : 'Сохранить изменения'}</Button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <h4 className="font-heading text-lg">{title}</h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
  return (
    <label className="space-y-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function FlagToggle({
  label,
  active,
  onClick,
  icon
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-md border px-3 text-xs transition ${
        active
          ? 'border-primary/50 bg-primary/10 text-foreground'
          : 'border-white/12 bg-white/[0.02] text-muted-foreground hover:border-white/25 hover:text-foreground'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
