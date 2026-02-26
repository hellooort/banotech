import { createClient } from '@/lib/supabase/server';
import HomeContent from '@/components/home/HomeContent';
import type { Category, Product, Notice } from '@/types/database';

export const revalidate = 60;

export default async function HomePage() {
  let categories: Category[] = [];
  let recentProducts: Product[] = [];
  let notices: Notice[] = [];

  try {
    const supabase = await createClient();
    const [catRes, prodRes, noticeRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8),
      supabase.from('notices').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(4),
    ]);
    categories = catRes.data ?? [];
    recentProducts = prodRes.data ?? [];
    notices = noticeRes.data ?? [];
  } catch {
    // fallback
  }

  const catSlugMap: Record<string, string> = {};
  categories.forEach(c => { catSlugMap[c.id] = c.slug; });

  return (
    <HomeContent
      categories={categories}
      recentProducts={recentProducts}
      notices={notices}
      catSlugMap={catSlugMap}
    />
  );
}
