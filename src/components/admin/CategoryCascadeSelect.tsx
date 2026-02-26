'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Category } from '@/types/database';

interface CategoryCascadeSelectProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
}

export default function CategoryCascadeSelect({ categories, value, onChange }: CategoryCascadeSelectProps) {
  const parentCategories = useMemo(
    () => categories.filter(c => !c.parent_id).sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  );

  const childrenMap = useMemo(() => {
    const map: Record<string, Category[]> = {};
    categories
      .filter(c => c.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .forEach(c => {
        if (!map[c.parent_id!]) map[c.parent_id!] = [];
        map[c.parent_id!].push(c);
      });
    return map;
  }, [categories]);

  const [parentId, setParentId] = useState('');

  useEffect(() => {
    if (!value || categories.length === 0) return;
    const selected = categories.find(c => c.id === value);
    if (selected?.parent_id) {
      setParentId(selected.parent_id);
    } else if (selected) {
      setParentId(selected.id);
    }
  }, [value, categories]);

  const childCategories = parentId ? childrenMap[parentId] ?? [] : [];
  const hasChildren = childCategories.length > 0;

  const handleParentChange = (newParentId: string) => {
    setParentId(newParentId);
    const children = childrenMap[newParentId] ?? [];
    if (children.length === 0) {
      onChange(newParentId);
    } else {
      onChange('');
    }
  };

  const handleChildChange = (childId: string) => {
    onChange(childId);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">1차 카테고리</label>
        <select
          value={parentId}
          onChange={(e) => handleParentChange(e.target.value)}
          className="h-10 w-full border border-border bg-surface px-3 text-sm text-foreground focus:border-brand focus:outline-none"
          required
        >
          <option value="">1차 카테고리 선택</option>
          {parentCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">2차 카테고리</label>
        <select
          value={hasChildren ? value : ''}
          onChange={(e) => handleChildChange(e.target.value)}
          className="h-10 w-full border border-border bg-surface px-3 text-sm text-foreground focus:border-brand focus:outline-none disabled:bg-hover disabled:text-muted disabled:cursor-not-allowed"
          disabled={!parentId || !hasChildren}
        >
          {!hasChildren ? (
            <option value="">{parentId ? '하위 카테고리 없음' : '1차 카테고리를 먼저 선택'}</option>
          ) : (
            <>
              <option value="">2차 카테고리 선택</option>
              {childCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </>
          )}
        </select>
      </div>
    </div>
  );
}
