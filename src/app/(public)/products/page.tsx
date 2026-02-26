import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/products/ProductGrid';
import type { Product, Category } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  let products: Product[] = [];
  const slugMap: Record<string, string> = {};

  try {
    const supabase = await createClient();
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*').order('sort_order').limit(40),
      supabase.from('categories').select('id, slug'),
    ]);
    products = prodRes.data ?? [];
    (catRes.data as Pick<Category, 'id' | 'slug'>[] ?? []).forEach(c => {
      slugMap[c.id] = c.slug;
    });
  } catch {
    // fallback
  }

  return (
    <div>
      <h2 className="mb-6 text-base font-medium text-foreground">전체 제품</h2>
      <ProductGrid products={products} slugMap={slugMap} />
    </div>
  );
}
