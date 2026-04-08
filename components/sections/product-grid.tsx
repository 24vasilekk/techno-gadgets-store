import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/catalog';

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  className?: string;
};

export function ProductGrid({ products, loading, className }: ProductGridProps): JSX.Element {
  const gridClassName = cn('grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3', className);

  if (loading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} mode="recommendation" />
      ))}
    </div>
  );
}
