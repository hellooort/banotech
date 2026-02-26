'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/admin/FileUpload';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    year: '',
    thumbnail_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from('projects').insert([{
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      year: form.year ? parseInt(form.year) : null,
      thumbnail_url: form.thumbnail_url || null,
    }]);

    if (!error) router.push('/admin/projects');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">새 프로젝트 등록</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Input id="title" label="프로젝트명" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <Input id="location" label="위치" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input id="year" label="연도" type="number" value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })} />
        </div>
        <Textarea id="description" label="설명" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">대표 이미지</label>
          <FileUpload bucket="projects" folder="thumbnails"
            onUploaded={(url) => setForm({ ...form, thumbnail_url: url })}
            currentUrl={form.thumbnail_url || undefined} />
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        </div>
      </form>
    </div>
  );
}
