import type { Metadata } from 'next';
import { CompareClient } from '@/components/compare/compare-client';

export const metadata: Metadata = {
  title: 'Сравнение',
  alternates: { canonical: '/compare' }
};

export default function ComparePage(): JSX.Element {
  return <CompareClient />;
}
