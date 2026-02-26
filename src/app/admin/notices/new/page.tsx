'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

export default function NewNoticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', is_pinned: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from('notices').insert([form]);
    if (!error) router.push('/admin/notices');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground">새 공지사항</h1>
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
          <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>취소</Button>
        </div>
      </form>
    </div>
  );
}
