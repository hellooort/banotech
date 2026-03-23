import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/products/ProductGrid';
import SearchResultHeader from '@/components/products/SearchResultHeader';
import type { Product, Category } from '@/types/database';

export const revalidate = 300;

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  let products: Product[] = [];
  const slugMap: Record<string, string> = {};

  try {
    const supabase = await createClient();

    let prodQuery = supabase.from('products').select('*');

    if (query) {
      const pattern = `%${query}%`;
      prodQuery = prodQuery.or(`name.ilike.${pattern},name_en.ilike.${pattern},model_name.ilike.${pattern}`);
    }

    const [prodRes, catRes] = await Promise.all([
      prodQuery.order('sort_order').limit(query ? 100 : 40),
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
    <div className="pt-6">
      <SearchResultHeader query={query} count={products.length} />
      <ProductGrid products={products} slugMap={slugMap} />
    </div>
  );
}
