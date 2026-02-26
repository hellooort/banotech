'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/admin/FileUpload';
import CategoryCascadeSelect from '@/components/admin/CategoryCascadeSelect';
import type { Category, Product } from '@/types/database';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    name_en: '',
    model_name: '',
    category_id: '',
    description: '',
    description_en: '',
    thumbnail_url: '',
    drawing_pdf_url: '',
    drawing_dwg_url: '',
    drawing_img_url: '',
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*').eq('id', id).single(),
      ]);
      setCategories(catRes.data ?? []);
      if (prodRes.data) {
        const p = prodRes.data as Product;
        setForm({
          name: p.name,
          name_en: p.name_en ?? '',
          model_name: p.model_name ?? '',
          category_id: p.category_id,
          description: p.description ?? '',
          description_en: p.description_en ?? '',
          thumbnail_url: p.thumbnail_url ?? '',
          drawing_pdf_url: p.drawing_pdf_url ?? '',
          drawing_dwg_url: p.drawing_dwg_url ?? '',
          drawing_img_url: p.drawing_img_url ?? '',
        });
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category_id) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from('products').update({
      name: form.name,
      name_en: form.name_en || null,
      model_name: form.model_name || null,
      category_id: form.category_id,
      description: form.description || null,
      description_en: form.description_en || null,
      thumbnail_url: form.thumbnail_url || null,
      drawing_pdf_url: form.drawing_pdf_url || null,
      drawing_dwg_url: form.drawing_dwg_url || null,
      drawing_img_url: form.drawing_img_url || null,
    }).eq('id', id);

    if (!error) router.push('/admin/products');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">제품 수정</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <CategoryCascadeSelect
          categories={categories}
          value={form.category_id}
          onChange={(id) => setForm({ ...form, category_id: id })}
        />

        <Input id="name" label="제품명 (한글)" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />

        <Input id="name_en" label="제품명 (영문)" placeholder="Product name in English" value={form.name_en}
          onChange={(e) => setForm({ ...form, name_en: e.target.value })} />

        <Input id="model_name" label="모델명" value={form.model_name}
          onChange={(e) => setForm({ ...form, model_name: e.target.value })} />

        <Textarea id="description" label="설명 (한글)" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <Textarea id="description_en" label="설명 (영문)" placeholder="Product description in English" value={form.description_en}
          onChange={(e) => setForm({ ...form, description_en: e.target.value })} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">대표 이미지</label>
          <FileUpload bucket="products" folder="thumbnails"
            onUploaded={(url) => setForm({ ...form, thumbnail_url: url })}
            currentUrl={form.thumbnail_url || undefined} />
        </div>

        {/* Drawing Files */}
        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">도면 파일</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wide">PDF 도면</label>
              <FileUpload bucket="documents" folder="drawings/pdf" accept=".pdf"
                onUploaded={(url) => setForm({ ...form, drawing_pdf_url: url })}
                currentUrl={form.drawing_pdf_url || undefined} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wide">DWG 도면</label>
              <FileUpload bucket="documents" folder="drawings/dwg" accept=".dwg,.dxf"
                onUploaded={(url) => setForm({ ...form, drawing_dwg_url: url })}
                currentUrl={form.drawing_dwg_url || undefined} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wide">이미지 도면</label>
              <FileUpload bucket="documents" folder="drawings/img" accept="image/*"
                onUploaded={(url) => setForm({ ...form, drawing_img_url: url })}
                currentUrl={form.drawing_img_url || undefined} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        </div>
      </form>
    </div>
  );
}
