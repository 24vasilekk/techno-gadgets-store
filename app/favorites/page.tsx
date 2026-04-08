import type { Metadata } from 'next';
import { FavoritesClient } from '@/components/favorites/favorites-client';

export const metadata: Metadata = {
  title: 'Избранное',
  alternates: { canonical: '/favorites' }
};

export default function FavoritesPage(): JSX.Element {
  return <FavoritesClient />;
}
