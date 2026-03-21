import { createClient } from '@/lib/supabase/server';
import HomeContent from '@/components/home/HomeContent';
import type { Category, Product } from '@/types/database';

export const revalidate = 60;

export default async function HomePage() {
  let categories: Category[] = [];
  let recentProducts: Product[] = [];

  try {
    const supabase = await createClient();
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('created_at', { ascending: false }).limit(10),
    ]);
    categories = catRes.data ?? [];
    recentProducts = prodRes.data ?? [];
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
