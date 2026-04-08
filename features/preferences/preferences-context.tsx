'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type PreferencesContextValue = {
  favoriteIds: string[];
  compareIds: string[];
  favoritesCount: number;
  compareCount: number;
  maxCompareItems: number;
  isFavorite: (productId: string) => boolean;
  isInCompare: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  removeCompare: (productId: string) => void;
  clearFavorites: () => void;
  clearCompare: () => void;
};

const FAVORITES_STORAGE_KEY = 'techno-agents-favorites';
const COMPARE_STORAGE_KEY = 'techno-agents-compare';
const MAX_COMPARE_ITEMS = 4;

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

function normalizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const cleaned = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  return Array.from(new Set(cleaned));
}

export function PreferencesProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const parsedFavorites = normalizeIds(JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]'));
      const parsedCompare = normalizeIds(JSON.parse(window.localStorage.getItem(COMPARE_STORAGE_KEY) ?? '[]')).slice(0, MAX_COMPARE_ITEMS);
      setFavoriteIds(parsedFavorites);
      setCompareIds(parsedCompare);
    } catch {
      window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
      window.localStorage.removeItem(COMPARE_STORAGE_KEY);
      setFavoriteIds([]);
      setCompareIds([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      favoriteIds,
      compareIds,
      favoritesCount: favoriteIds.length,
      compareCount: compareIds.length,
      maxCompareItems: MAX_COMPARE_ITEMS,
      isFavorite: (productId) => favoriteIds.includes(productId),
      isInCompare: (productId) => compareIds.includes(productId),
      toggleFavorite: (productId) => {
        setFavoriteIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]));
      },
      toggleCompare: (productId) => {
        setCompareIds((prev) => {
          if (prev.includes(productId)) return prev.filter((id) => id !== productId);
          if (prev.length >= MAX_COMPARE_ITEMS) return prev;
          return [productId, ...prev];
        });
      },
      removeFavorite: (productId) => setFavoriteIds((prev) => prev.filter((id) => id !== productId)),
      removeCompare: (productId) => setCompareIds((prev) => prev.filter((id) => id !== productId)),
      clearFavorites: () => setFavoriteIds([]),
      clearCompare: () => setCompareIds([])
    }),
    [favoriteIds, compareIds]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }

  return context;
}
