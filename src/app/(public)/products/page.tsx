import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/products/ProductGrid';
import type { Product } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('sort_order')
      .limit(20);
    products = data ?? [];
  } catch {
    // fallback
  }

  return (
    <div>
      <h2 className="mb-6 text-base font-medium text-foreground">전체 제품</h2>
      <ProductGrid products={products} categorySlug="" />
    </div>
  );
}
