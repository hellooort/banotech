'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/admin/FileUpload';
import { Plus, Trash2, GripVertical, Award } from 'lucide-react';
import type { Certificate } from '@/types/database';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', name_en: '', image_url: '' });

  const fetchCertificates = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order');
    setCertificates(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCertificates(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.image_url) return;
    setSaving(true);

    const supabase = createClient();
    const nextOrder = certificates.length > 0
      ? Math.max(...certificates.map(c => c.sort_order)) + 1
      : 0;

    const { error } = await supabase.from('certificates').insert([{
      name: form.name,
      name_en: form.name_en || null,
      image_url: form.image_url,
      sort_order: nextOrder,
    }]);

    if (!error) {
      setForm({ name: '', name_en: '', image_url: '' });
      setShowForm(false);
      fetchCertificates();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 인증서를 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('certificates').delete().eq('id', id);
    fetchCertificates();
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const supabase = createClient();
    const curr = certificates[index];
    const prev = certificates[index - 1];
    await Promise.all([
      supabase.from('certificates').update({ sort_order: prev.sort_order }).eq('id', curr.id),
      supabase.from('certificates').update({ sort_order: curr.sort_order }).eq('id', prev.id),
    ]);
    fetchCertificates();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">인증서 관리</h1>
          <p className="mt-1 text-sm text-muted">인증서를 등록하고 관리합니다</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-1" /> 인증서 추가
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 border border-border bg-surface p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">새 인증서 등록</h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="cert-name"
              label="인증서명 (한글)"
              placeholder="예: KS 인증서"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              id="cert-name-en"
              label="인증서명 (영문)"
              placeholder="e.g. KS Certificate"
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">인증서 이미지</label>
            <FileUpload
              bucket="company"
              folder="certificates"
              onUploaded={(url) => setForm({ ...form, image_url: url })}
              currentUrl={form.image_url || undefined}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving || !form.name || !form.image_url}>
              {saving ? '등록 중...' : '등록'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm({ name: '', name_en: '', image_url: '' }); }}>
              취소
            </Button>
          </div>
        </form>
      )}

      {/* Certificate Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted">로딩 중...</div>
        ) : certificates.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">등록된 인증서가 없습니다</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {certificates.map((cert, index) => (
              <div key={cert.id} className="border border-border bg-surface group relative">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-background overflow-hidden">
                  <Image
                    src={cert.image_url}
                    alt={cert.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Overlay actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button
                        onClick={() => handleMoveUp(index)}
                        className="p-1.5 bg-white/80 backdrop-blur-sm text-muted hover:text-foreground transition-colors rounded-sm"
                        title="순서 올리기"
                      >
                        <GripVertical size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm text-muted hover:text-red-500 transition-colors rounded-sm"
                      title="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 text-center">
                  <p className="text-sm font-medium text-foreground">{cert.name}</p>
                  {cert.name_en && (
                    <p className="text-xs text-muted mt-0.5">{cert.name_en}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
