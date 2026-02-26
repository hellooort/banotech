'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';
import type { Document as DocType } from '@/types/database';
import { formatDate } from '@/lib/utils';

const COLUMNS = [
  { type: 'catalog', label: '카탈로그', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { type: 'drawing', label: '도면 및 설명서', color: 'text-green-600', bgColor: 'bg-green-50' },
  { type: 'other', label: '기타 자료', color: 'text-gray-600', bgColor: 'bg-gray-50' },
];

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingType, setAddingType] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', file_url: '' });
  const [saving, setSaving] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    setDocuments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchDocuments(); }, []);

  const getDocsByType = (type: string) => {
    if (type === 'drawing') return documents.filter(d => d.type === 'drawing' || d.type === 'manual');
    return documents.filter(d => d.type === type);
  };

  const handleAdd = async (type: string) => {
    if (!form.title.trim() || !form.file_url) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('documents').insert({
      title: form.title,
      type: type === 'drawing' ? 'drawing' : type,
      file_url: form.file_url,
      product_id: null,
    });
    setForm({ title: '', file_url: '' });
    setAddingType(null);
    setSaving(false);
    fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 자료를 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('documents').delete().eq('id', id);
    fetchDocuments();
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">자료 관리</h1>
        <p className="mt-1 text-sm text-muted">카탈로그, 도면 및 설명서, 기타 자료를 관리합니다</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const docs = getDocsByType(col.type);
          const isAdding = addingType === col.type;

          return (
            <div key={col.type} className="border border-border flex flex-col">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b border-border ${col.bgColor}`}>
                <div className="flex items-center gap-2">
                  <h2 className={`text-sm font-semibold ${col.color}`}>{col.label}</h2>
                  <span className="text-xs text-muted">{docs.length}건</span>
                </div>
                <button
                  onClick={() => {
                    setAddingType(isAdding ? null : col.type);
                    setForm({ title: '', file_url: '' });
                  }}
                  className={`p-1 transition-colors ${isAdding ? 'text-muted hover:text-foreground' : `${col.color} hover:opacity-70`}`}
                  title="자료 등록"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add Form */}
              {isAdding && (
                <div className="p-3 border-b border-border bg-surface space-y-3">
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Escape') setAddingType(null); }}
                    placeholder="자료명을 입력하세요"
                    className="h-9 w-full border border-border bg-background px-3 text-sm text-foreground focus:border-brand focus:outline-none"
                    autoFocus
                  />
                  <FileUpload
                    bucket="documents"
                    folder={col.type}
                    accept=".pdf,.doc,.docx,.dwg,.dxf,.zip,.jpg,.png"
                    onUploaded={(url) => setForm({ ...form, file_url: url })}
                    currentUrl={form.file_url || undefined}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdd(col.type)}
                      disabled={saving || !form.title.trim() || !form.file_url}
                      className="flex-1 h-8 bg-brand text-white text-xs font-medium hover:bg-brand-dark disabled:bg-muted disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? '등록 중...' : '등록'}
                    </button>
                    <button
                      onClick={() => { setAddingType(null); setForm({ title: '', file_url: '' }); }}
                      className="h-8 px-3 border border-border text-xs text-muted hover:text-foreground transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {/* Document List */}
              <div className="flex-1 divide-y divide-border">
                {loading ? (
                  <div className="py-8 text-center text-xs text-muted">로딩 중...</div>
                ) : docs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted">등록된 자료가 없습니다</div>
                ) : (
                  docs.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 px-3 py-2.5 group hover:bg-hover transition-colors">
                      <FileText size={15} className={col.color} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{doc.title}</p>
                        <p className="text-[10px] text-muted">{formatDate(doc.created_at)}</p>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-muted hover:text-brand transition-colors opacity-0 group-hover:opacity-100"
                        title="다운로드"
                      >
                        <Download size={14} />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1 text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
