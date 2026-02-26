'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Pencil, Trash2, ChevronRight, Plus, Check, X } from 'lucide-react';
import type { Category } from '@/types/database';

interface InlineForm {
  name: string;
  name_en: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingParent, setAddingParent] = useState<string | null>(null); // null = adding top-level, 'none' = not adding, parentId = adding child
  const [form, setForm] = useState<InlineForm>({ name: '', name_en: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data ?? []);
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if ((editingId || addingParent !== 'none') && nameRef.current) {
      nameRef.current.focus();
    }
  }, [editingId, addingParent]);

  const topCategories = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const cancelAll = () => {
    setEditingId(null);
    setAddingParent('none');
    setForm({ name: '', name_en: '', slug: '' });
  };

  const handleAdd = async (parentId: string | null) => {
    if (!form.name.trim()) return;
    setSaving(true);
    const slug = form.slug || autoSlug(form.name_en || form.name);
    const siblings = parentId
      ? categories.filter(c => c.parent_id === parentId)
      : topCategories;
    const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(c => c.sort_order)) + 1 : 0;

    await supabase.from('categories').insert({
      name: form.name,
      name_en: form.name_en || null,
      slug,
      parent_id: parentId,
      sort_order: maxOrder,
    });

    cancelAll();
    setSaving(false);
    fetchCategories();
  };

  const handleUpdate = async (id: string) => {
    if (!form.name.trim()) return;
    setSaving(true);
    const slug = form.slug || autoSlug(form.name_en || form.name);

    await supabase.from('categories').update({
      name: form.name,
      name_en: form.name_en || null,
      slug,
    }).eq('id', id);

    cancelAll();
    setSaving(false);
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setAddingParent('none');
    setEditingId(cat.id);
    setForm({ name: cat.name, name_en: cat.name_en ?? '', slug: cat.slug });
  };

  const startAddTop = () => {
    setEditingId(null);
    setAddingParent(null);
    setForm({ name: '', name_en: '', slug: '' });
  };

  const startAddChild = (parentId: string) => {
    setEditingId(null);
    setAddingParent(parentId);
    setForm({ name: '', name_en: '', slug: '' });
  };

  const handleDelete = async (id: string) => {
    const children = getChildren(id);
    const msg = children.length > 0
      ? '이 카테고리와 하위 카테고리, 연결된 제품이 모두 삭제됩니다.'
      : '이 카테고리를 삭제하시겠습니까?\n연결된 제품도 함께 삭제됩니다.';
    if (!confirm(msg)) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') { e.preventDefault(); action(); }
    if (e.key === 'Escape') cancelAll();
  };

  const InlineRow = ({ isChild, onSave }: { isChild: boolean; onSave: () => void }) => (
    <div className={`flex items-center gap-2 px-4 py-2 ${isChild ? 'pl-10 bg-background' : 'bg-brand-light/30'}`}>
      {isChild && <ChevronRight size={14} className="text-muted shrink-0" />}
      <input
        ref={nameRef}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        onKeyDown={(e) => handleKeyDown(e, onSave)}
        placeholder="카테고리명 (한글)"
        className="h-8 flex-1 min-w-0 border border-brand/40 bg-surface px-2 text-sm text-foreground focus:border-brand focus:outline-none"
      />
      <input
        value={form.name_en}
        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
        onKeyDown={(e) => handleKeyDown(e, onSave)}
        placeholder="영문명"
        className="h-8 flex-1 min-w-0 border border-border bg-surface px-2 text-sm text-foreground focus:border-brand focus:outline-none"
      />
      <input
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        onKeyDown={(e) => handleKeyDown(e, onSave)}
        placeholder="slug (자동)"
        className="h-8 w-36 shrink-0 border border-border bg-surface px-2 text-xs text-muted focus:border-brand focus:outline-none"
      />
      <button
        onClick={onSave}
        disabled={saving || !form.name.trim()}
        className="p-1.5 text-green-600 hover:text-green-700 disabled:text-muted transition-colors"
        title="저장"
      >
        <Check size={16} />
      </button>
      <button onClick={cancelAll} className="p-1.5 text-muted hover:text-foreground transition-colors" title="취소">
        <X size={16} />
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">카테고리 관리</h1>
          <p className="mt-1 text-sm text-muted">1단계(대분류)와 2단계(소분류) 카테고리를 관리합니다</p>
        </div>
        <button
          onClick={startAddTop}
          className="flex items-center gap-1.5 bg-brand px-4 py-2 text-sm text-white font-medium hover:bg-brand-dark transition-colors"
        >
          <Plus size={16} /> 1차 카테고리 추가
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {topCategories.map((cat) => {
          const children = getChildren(cat.id);
          const isEditingThis = editingId === cat.id;

          return (
            <div key={cat.id} className="border border-border">
              {/* Parent row */}
              {isEditingThis ? (
                <InlineRow isChild={false} onSave={() => handleUpdate(cat.id)} />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-surface group">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                    {cat.name_en && <span className="ml-2 text-xs text-muted">{cat.name_en}</span>}
                    <span className="ml-2 text-xs text-muted/50">/{cat.slug}</span>
                  </div>
                  <button
                    onClick={() => startAddChild(cat.id)}
                    className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Plus size={13} /> 하위 추가
                  </button>
                  <button onClick={() => startEdit(cat)} className="text-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={15} />
                  </button>
                </div>
              )}

              {/* Children */}
              {children.length > 0 && (
                <div className="divide-y divide-border border-t border-border">
                  {children.map((child) => {
                    const isEditingChild = editingId === child.id;
                    return isEditingChild ? (
                      <InlineRow key={child.id} isChild onSave={() => handleUpdate(child.id)} />
                    ) : (
                      <div key={child.id} className="flex items-center gap-3 px-4 py-2.5 pl-10 bg-background group">
                        <ChevronRight size={14} className="text-muted shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground">{child.name}</span>
                          {child.name_en && <span className="ml-2 text-xs text-muted">{child.name_en}</span>}
                          <span className="ml-2 text-xs text-muted/50">/{child.slug}</span>
                        </div>
                        <button onClick={() => startEdit(child)} className="text-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(child.id)} className="text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Inline add child for this parent */}
              {addingParent === cat.id && (
                <div className="border-t border-border">
                  <InlineRow isChild onSave={() => handleAdd(cat.id)} />
                </div>
              )}
            </div>
          );
        })}

        {/* Inline add top-level */}
        {addingParent === null && (
          <div className="border border-brand/40 border-dashed">
            <InlineRow isChild={false} onSave={() => handleAdd(null)} />
          </div>
        )}

        {topCategories.length === 0 && addingParent === 'none' && (
          <div className="border border-border px-4 py-8 text-center text-sm text-muted">
            등록된 카테고리가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
