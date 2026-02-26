import ProductCard from './ProductCard';
import type { Product } from '@/types/database';

interface ProductGridProps {
  products: Product[];
  categorySlug: string;
}

export default function ProductGrid({ products, categorySlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted">
        등록된 제품이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} categorySlug={categorySlug} />
      ))}
    </div>
  );
}
