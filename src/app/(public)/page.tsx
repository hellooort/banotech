import { createClient } from '@/lib/supabase/server';
import HomeContent from '@/components/home/HomeContent';
import type { Category, Product } from '@/types/database';

export const revalidate = 300;

export default async function HomePage() {
  let categories: Category[] = [];
  let recentProducts: Product[] = [];

  try {
    const supabase = await createClient();
    const catRes = await supabase.from('categories').select('*').order('sort_order');
    categories = catRes.data ?? [];

    // 신제품 카테고리(new-products) 및 하위 카테고리에서 제품 가져오기
    const newProductsCat = categories.find(c => c.slug === 'new-products');
    if (newProductsCat) {
      const childCatIds = categories
        .filter(c => c.parent_id === newProductsCat.id)
        .map(c => c.id);
      const categoryIds = [newProductsCat.id, ...childCatIds];
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('category_id', categoryIds)
        .order('sort_order')
        .limit(20);
      recentProducts = data ?? [];
    }

    // 신제품 카테고리에 제품이 없으면 최근 등록 제품으로 fallback
    if (recentProducts.length === 0) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      recentProducts = data ?? [];
    }
  } catch {
    // fallback
  }

  const catSlugMap: Record<string, string> = {};
  categories.forEach(c => { catSlugMap[c.id] = c.slug; });

  return (
    <HomeContent
      categories={categories}
      recentProducts={recentProducts}
      catSlugMap={catSlugMap}
    />
  );
}
