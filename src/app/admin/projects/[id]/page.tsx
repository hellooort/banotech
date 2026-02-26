'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/admin/FileUpload';
import type { Project } from '@/types/database';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', location: '', year: '', thumbnail_url: '',
  });

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase.from('projects').select('*').eq('id', id).single();
      if (data) {
        const p = data as Project;
        setForm({
          title: p.title,
          description: p.description ?? '',
          location: p.location ?? '',
          year: p.year?.toString() ?? '',
          thumbnail_url: p.thumbnail_url ?? '',
        });
      }
    }
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('projects').update({
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      year: form.year ? parseInt(form.year) : null,
      thumbnail_url: form.thumbnail_url || null,
    }).eq('id', id);
    if (!error) router.push('/admin/projects');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">프로젝트 수정</h1>
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
          <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        </div>
      </form>
    </div>
  );
}
