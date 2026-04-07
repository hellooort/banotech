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
import { revalidateProducts } from '@/app/actions/revalidate';

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
  const [originalFileUrls, setOriginalFileUrls] = useState({
    thumbnail_url: '',
    drawing_pdf_url: '',
    drawing_dwg_url: '',
    drawing_img_url: '',
  });
  const [specs, setSpecs] = useState({
    model_number: '', model_number_en: '',
    product_name: '', product_name_en: '',
    finish_color: '', finish_color_en: '',
    size: '', size_en: '',
    brand: '', brand_en: '',
    manufacturer: '', manufacturer_en: '',
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
        const fileUrls = {
          thumbnail_url: p.thumbnail_url ?? '',
          drawing_pdf_url: p.drawing_pdf_url ?? '',
          drawing_dwg_url: p.drawing_dwg_url ?? '',
          drawing_img_url: p.drawing_img_url ?? '',
        };
        setForm({
          name: p.name,
          name_en: p.name_en ?? '',
          model_name: p.model_name ?? '',
          category_id: p.category_id,
          description: p.description ?? '',
          description_en: p.description_en ?? '',
          ...fileUrls,
        });
        setOriginalFileUrls(fileUrls);
        const s = p.specs ?? {};
        setSpecs({
          model_number: s.model_number ?? '',
          model_number_en: s.model_number_en ?? '',
          product_name: s.product_name ?? '',
          product_name_en: s.product_name_en ?? '',
          finish_color: s.finish_color ?? '',
          finish_color_en: s.finish_color_en ?? '',
          size: s.size ?? '',
          size_en: s.size_en ?? '',
          brand: s.brand ?? '',
          brand_en: s.brand_en ?? '',
          manufacturer: s.manufacturer ?? '',
          manufacturer_en: s.manufacturer_en ?? '',
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
    const cleanSpecs: Record<string, string> = {};
    Object.entries(specs).forEach(([k, v]) => { if (v.trim()) cleanSpecs[k] = v.trim(); });

    const resolveFileUrl = (key: keyof typeof originalFileUrls) => {
      const current = form[key];
      const original = originalFileUrls[key];
      if (current === original) return original || null;
      return current || null;
    };

    const { error } = await supabase.from('products').update({
      name: form.name,
      name_en: form.name_en || null,
      model_name: form.model_name || null,
      category_id: form.category_id,
      description: form.description || null,
      description_en: form.description_en || null,
      thumbnail_url: resolveFileUrl('thumbnail_url'),
      drawing_pdf_url: resolveFileUrl('drawing_pdf_url'),
      drawing_dwg_url: resolveFileUrl('drawing_dwg_url'),
      drawing_img_url: resolveFileUrl('drawing_img_url'),
      specs: cleanSpecs,
    }).eq('id', id);

    if (!error) {
      await revalidateProducts();
      router.push('/admin/products');
    }
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
          onChange={(e) => {
            const v = e.target.value;
            setForm({ ...form, name: v });
            setSpecs((prev) => ({ ...prev, product_name: v }));
          }} required />

        <Input id="name_en" label="제품명 (영문)" placeholder="Product name in English" value={form.name_en}
          onChange={(e) => {
            const v = e.target.value;
            setForm({ ...form, name_en: v });
            setSpecs((prev) => ({ ...prev, product_name_en: v }));
          }} />

        <Input id="model_name" label="모델명" value={form.model_name}
          onChange={(e) => {
            const v = e.target.value;
            setForm({ ...form, model_name: v });
            setSpecs((prev) => ({ ...prev, model_number: v, model_number_en: v }));
          }} />

        <Textarea id="description" label="설명 (한글)" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <Textarea id="description_en" label="설명 (영문)" placeholder="Product description in English" value={form.description_en}
          onChange={(e) => setForm({ ...form, description_en: e.target.value })} />

        {/* 제품 스펙 */}
        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">제품 상세 정보</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input id="model_number" label="품번 (모델명에서 자동 입력)" value={specs.model_number} readOnly
                className="bg-hover cursor-not-allowed" />
              <Input id="product_name" label="품명 (제품명에서 자동 입력)" value={specs.product_name} readOnly
                className="bg-hover cursor-not-allowed" />
            </div>

            {([
              { key: 'finish_color', label: '마감색상' },
              { key: 'size', label: '사이즈' },
            ] as const).map(({ key, label }) => (
              <Input
                key={key}
                id={key}
                label={label}
                placeholder={label}
                value={specs[key]}
                onChange={(e) => setSpecs({ ...specs, [key]: e.target.value, [`${key}_en`]: e.target.value })}
              />
            ))}

            {([
              { key: 'brand', label: '브랜드' },
              { key: 'manufacturer', label: '제조사' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="grid grid-cols-2 gap-3">
                <Input
                  id={key}
                  label={`${label} (한글)`}
                  placeholder={label}
                  value={specs[key]}
                  onChange={(e) => setSpecs({ ...specs, [key]: e.target.value })}
                />
                <Input
                  id={`${key}_en`}
                  label={`${label} (영문)`}
                  placeholder={`${label} in English`}
                  value={specs[`${key}_en` as keyof typeof specs]}
                  onChange={(e) => setSpecs({ ...specs, [`${key}_en`]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">대표 이미지 / 이미지 도면</label>
          <p className="mb-2 text-xs text-muted">대표 이미지가 이미지 도면으로도 사용됩니다</p>
          <FileUpload bucket="products" folder="thumbnails"
            onUploaded={(url) => setForm({ ...form, thumbnail_url: url, drawing_img_url: url })}
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
