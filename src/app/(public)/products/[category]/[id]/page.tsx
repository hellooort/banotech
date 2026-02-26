import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import type { Product, ProductImage, Document as DocType } from '@/types/database';

export const dynamic = 'force-dynamic';

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

    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!prodData) return notFound();
    product = prodData;

    const [imgRes, docRes] = await Promise.all([
      supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
      supabase.from('documents').select('*').eq('product_id', id).order('created_at', { ascending: false }),
    ]);

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
