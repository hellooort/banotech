'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/admin/FileUpload';
import type { Product } from '@/types/database';

export default function NewDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: '',
    type: 'catalog' as string,
    product_id: '',
    file_url: '',
  });

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();
      const { data } = await supabase.from('products').select('*').order('name');
      setProducts(data ?? []);
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.file_url) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from('documents').insert([{
      title: form.title,
      type: form.type,
      product_id: form.product_id || null,
      file_url: form.file_url,
    }]);

    if (!error) router.push('/admin/documents');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">새 자료 등록</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Input id="title" label="자료명" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} required />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">유형</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="h-10 w-full border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="catalog">카탈로그</option>
            <option value="drawing">도면</option>
            <option value="manual">설명서</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">연결 제품 (선택)</label>
          <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            className="h-10 w-full border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="">없음</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">파일</label>
          <FileUpload
            bucket="documents"
            accept=".pdf,.doc,.docx,.dwg,.dxf,.zip"
            onUploaded={(url) => setForm({ ...form, file_url: url })}
            currentUrl={form.file_url || undefined}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        </div>
      </form>
    </div>
  );
}
