import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/products/ProductGrid';
import type { Product, Category } from '@/types/database';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;

  let category: Category | null = null;
  let products: Product[] = [];

  try {
    const supabase = await createClient();

    const [catRes, allCats] = await Promise.all([
      supabase.from('categories').select('*').eq('slug', categorySlug).single(),
      supabase.from('categories').select('id, parent_id, slug'),
    ]);

    if (!catRes.data) return notFound();
    category = catRes.data as Category;

    const childIds = (allCats.data ?? [])
      .filter(c => c.parent_id === category!.id)
      .map(c => c.id);
    const categoryIds = [category!.id, ...childIds];

    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .in('category_id', categoryIds)
      .order('sort_order');

    products = prodData ?? [];
  } catch {
    return notFound();
  }

  return (
    <div>
      <h2 className="mb-6 text-base font-medium text-foreground">{category?.name}</h2>
      <ProductGrid products={products} categorySlug={categorySlug} />
    </div>
  );
}
