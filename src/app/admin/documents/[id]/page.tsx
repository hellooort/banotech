'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/admin/FileUpload';
import type { Product, Document as DocType } from '@/types/database';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditDocumentPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: '', type: 'catalog', product_id: '', file_url: '',
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [prodRes, docRes] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('documents').select('*').eq('id', id).single(),
      ]);
      setProducts(prodRes.data ?? []);
      if (docRes.data) {
        const d = docRes.data as DocType;
        setForm({
          title: d.title,
          type: d.type,
          product_id: d.product_id ?? '',
          file_url: d.file_url,
        });
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from('documents').update({
      title: form.title,
      type: form.type,
      product_id: form.product_id || null,
      file_url: form.file_url,
    }).eq('id', id);
    router.push('/admin/documents');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">자료 수정</h1>
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
          <label className="mb-1.5 block text-sm font-medium text-foreground">연결 제품</label>
          <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            className="h-10 w-full border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="">없음</option>
            {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">파일</label>
          <FileUpload bucket="documents" accept=".pdf,.doc,.docx,.dwg,.dxf,.zip"
            onUploaded={(url) => setForm({ ...form, file_url: url })}
            currentUrl={form.file_url || undefined} />
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        </div>
      </form>
    </div>
  );
}
