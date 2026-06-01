'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import ProductSortableList from '@/components/admin/ProductSortableList';
import { Plus, Search, Save, Loader2 } from 'lucide-react';
import type { Product, Category } from '@/types/database';
import { cn } from '@/lib/utils';
import { revalidateProducts } from '@/app/actions/revalidate';

interface ProductWithCat extends Product {
  categories?: Category;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<ProductWithCat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [primaryCatId, setPrimaryCatId] = useState<string | null>(null);
  const [secondaryCatId, setSecondaryCatId] = useState<string | null>(null);
  const [orderedProducts, setOrderedProducts] = useState<ProductWithCat[]>([]);
  const [orderDirty, setOrderDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, categories(*)').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setAllProducts((prodRes.data as ProductWithCat[]) ?? []);
    setCategories(catRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const primaryCategories = useMemo(
    () => categories.filter((c) => !c.parent_id),
    [categories],
  );

  const secondaryCategories = useMemo(
    () => (primaryCatId ? categories.filter((c) => c.parent_id === primaryCatId) : []),
    [categories, primaryCatId],
  );

  const isSpecificCategory = !!secondaryCatId;
  const isGlobalView = !secondaryCatId; // 전체 또는 1차 카테고리 선택 시

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (secondaryCatId) {
      result = result.filter((p) => p.category_id === secondaryCatId);
    } else if (primaryCatId) {
      const childIds = categories
        .filter((c) => c.parent_id === primaryCatId)
        .map((c) => c.id);
      const ids = [primaryCatId, ...childIds];
      result = result.filter((p) => ids.includes(p.category_id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.name_en?.toLowerCase().includes(q) ||
          p.model_name?.toLowerCase().includes(q) ||
          p.categories?.name?.toLowerCase().includes(q),
      );
    }

    // 2차 카테고리 선택 시 sort_order, 전체/1차 선택 시 global_sort_order로 정렬
    const sortField = secondaryCatId ? 'sort_order' : 'global_sort_order';
    result = [...result].sort((a, b) => (a[sortField] ?? 0) - (b[sortField] ?? 0));

    return result;
  }, [allProducts, categories, primaryCatId, secondaryCatId, search]);

  useEffect(() => {
    setOrderedProducts(filteredProducts);
    setOrderDirty(false);
  }, [filteredProducts]);

  const handlePrimaryClick = (catId: string | null) => {
    setPrimaryCatId(catId);
    setSecondaryCatId(null);
    setSearch('');
  };

  const handleSecondaryClick = (catId: string | null) => {
    setSecondaryCatId(catId);
    setSearch('');
  };

  const handleReorder = (reordered: ProductWithCat[]) => {
    setOrderedProducts(reordered);
    setOrderDirty(true);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    const supabase = createClient();

    // 2차 카테고리 선택 시 sort_order, 그 외(전체/1차)는 global_sort_order 업데이트
    const fieldToUpdate = isSpecificCategory ? 'sort_order' : 'global_sort_order';
    const updates = orderedProducts.map((p, i) =>
      supabase.from('products').update({ [fieldToUpdate]: i }).eq('id', p.id),
    );
    await Promise.all(updates);
    await revalidateProducts();

    setAllProducts((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      orderedProducts.forEach((p, i) => {
        const existing = map.get(p.id);
        if (existing) map.set(p.id, { ...existing, [fieldToUpdate]: i });
      });
      return Array.from(map.values()).sort((a, b) => a.sort_order - b.sort_order);
    });

    setOrderDirty(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 제품을 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    await revalidateProducts();
    fetchData();
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 -mx-8 -mt-8 bg-background px-8 pt-8 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">제품 관리</h1>
            <p className="mt-1 text-sm text-muted">
              총 {allProducts.length}개 제품
              {(primaryCatId || search) &&
                ` · 표시 ${orderedProducts.length}개`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {orderDirty && (
              <Button onClick={handleSaveOrder} disabled={saving}>
                {saving ? (
                  <Loader2 size={16} className="mr-1 animate-spin" />
                ) : (
                  <Save size={16} className="mr-1" />
                )}
                순서 저장
              </Button>
            )}
            <Button onClick={() => router.push('/admin/products/new')}>
              <Plus size={16} className="mr-1" /> 새 제품
            </Button>
          </div>
        </div>

        {/* 1차 카테고리 필터 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handlePrimaryClick(null)}
            className={cn(
              'px-3 py-1.5 text-sm border transition-colors',
              !primaryCatId
                ? 'border-brand bg-brand text-white'
                : 'border-border bg-surface text-secondary hover:text-foreground hover:border-brand/40',
            )}
          >
            전체
          </button>
          {primaryCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handlePrimaryClick(cat.id)}
              className={cn(
                'px-3 py-1.5 text-sm border transition-colors',
                primaryCatId === cat.id
                  ? 'border-brand bg-brand text-white'
                  : 'border-border bg-surface text-secondary hover:text-foreground hover:border-brand/40',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 2차 카테고리 필터 */}
        {secondaryCategories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSecondaryClick(null)}
              className={cn(
                'px-2.5 py-1 text-xs border transition-colors',
                !secondaryCatId
                  ? 'border-brand/60 bg-brand/10 text-brand-dark'
                  : 'border-border bg-surface text-muted hover:text-foreground',
              )}
            >
              전체
            </button>
            {secondaryCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSecondaryClick(cat.id)}
                className={cn(
                  'px-2.5 py-1 text-xs border transition-colors',
                  secondaryCatId === cat.id
                    ? 'border-brand/60 bg-brand/10 text-brand-dark'
                    : 'border-border bg-surface text-muted hover:text-foreground',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mt-3 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색할 품번이나 품명을 입력하세요"
            className="h-10 w-full border border-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      {/* 순서 변경 안내 */}
      {!search && (
        <p className="mt-3 text-xs text-muted">
          드래그하여 순서를 변경할 수 있습니다. 변경 후 &ldquo;순서 저장&rdquo; 버튼을 눌러주세요.
          {isGlobalView && <span className="ml-1 text-brand">(전체 보기 순서)</span>}
          {isSpecificCategory && <span className="ml-1 text-brand">(카테고리 내 순서)</span>}
        </p>
      )}

      {/* Product List */}
      <div className="mt-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted">로딩 중...</div>
        ) : (
          <ProductSortableList
            products={orderedProducts}
            isDragEnabled={!search}
            onReorder={handleReorder}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
