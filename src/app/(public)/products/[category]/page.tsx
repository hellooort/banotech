import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryHeading from '@/components/products/CategoryHeading';
import type { Product, Category } from '@/types/database';
import { notFound } from 'next/navigation';

export const revalidate = 300;
export const dynamicParams = true;

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('categories').select('name').eq('slug', slug).single();
    if (data) {
      return {
        title: `${data.name} | VANO`,
        description: `VANO ${data.name} 제품 목록`,
      };
    }
  } catch { /* fallback */ }
  return { title: '제품 카테고리 | VANO' };
}

export default async function CategoryPage({ params }: Props) {
  const { category: rawSlug } = await params;
  const categorySlug = decodeURIComponent(rawSlug);

  let category: Category | null = null;
  let products: Product[] = [];

  const supabase = await createClient();

  const [catRes, allCats] = await Promise.all([
    supabase.from('categories').select('*').eq('slug', categorySlug).single(),
    supabase.from('categories').select('id, parent_id, slug, name, name_en'),
  ]);

  if (!catRes.data) return notFound();
  category = catRes.data as Category;

  const allCategories = allCats.data ?? [];
  const parentCategory = category.parent_id
    ? allCategories.find(c => c.id === category!.parent_id)
    : null;

  const childIds = allCategories
    .filter(c => c.parent_id === category!.id)
    .map(c => c.id);
  const categoryIds = [category!.id, ...childIds];

  const { data: prodData } = await supabase
    .from('products')
    .select('*')
    .in('category_id', categoryIds)
    .order('sort_order');

  products = prodData ?? [];

  return (
    <div className="pt-6">
      <CategoryHeading category={category} parentCategory={parentCategory as { name: string; name_en: string | null } | null} />
      <ProductGrid products={products} categorySlug={categorySlug} />
    </div>
  );
}
