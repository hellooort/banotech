import { createClient } from '@/lib/supabase/server';
import CategorySidebar from '@/components/products/CategorySidebar';
import CategoryTopBar from '@/components/products/CategoryTopBar';
import ProductsHeader from '@/components/products/ProductsHeader';
import type { Category } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    categories = data ?? [];
  } catch {
    // fallback
  }

  return (
    <>
      <ProductsHeader />
      <CategoryTopBar categories={categories} />
      <div className="mx-auto flex max-w-[1280px] gap-8 px-6 py-10">
        <CategorySidebar categories={categories} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}
