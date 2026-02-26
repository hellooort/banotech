'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import type { Notice } from '@/types/database';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditNoticePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', is_pinned: false });

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase.from('notices').select('*').eq('id', id).single();
      if (data) {
        const n = data as Notice;
        setForm({ title: n.title, content: n.content, is_pinned: n.is_pinned });
      }
    }
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from('notices').update(form).eq('id', id);
    router.push('/admin/notices');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">공지사항 수정</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Input id="title" label="제목" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Textarea id="content" label="내용" value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_pinned}
            onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
            className="h-4 w-4 border-border" />
          상단 고정
        </label>
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        </div>
      </form>
    </div>
  );
}
