import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import type { Product, ProductImage, Document as DocType } from '@/types/database';

export const revalidate = 60;

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { category: categorySlug, id } = await params;

  let product: Product | null = null;
  let images: ProductImage[] = [];
  let documents: DocType[] = [];

  try {
    const supabase = await createClient();

    const [prodRes, imgRes, docRes] = await Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
      supabase.from('documents').select('*').eq('product_id', id).order('created_at', { ascending: false }),
    ]);

    if (!prodRes.data) return notFound();
    product = prodRes.data;
    images = imgRes.data ?? [];
    documents = docRes.data ?? [];
  } catch {
    return notFound();
  }

  if (!product) return notFound();

  return (
    <ProductDetail
      product={product}
      images={images}
      documents={documents}
      categorySlug={categorySlug}
    />
  );
}
