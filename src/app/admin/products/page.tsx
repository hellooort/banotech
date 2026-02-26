'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { Plus, Trash2, Search, Package } from 'lucide-react';
import type { Product, Category } from '@/types/database';
import { formatDate } from '@/lib/utils';

interface ProductWithCat extends Product {
  categories?: Category;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });
    setProducts((data as ProductWithCat[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.name_en?.toLowerCase().includes(q)) ||
      (p.model_name?.toLowerCase().includes(q)) ||
      (p.categories?.name?.toLowerCase().includes(q))
    );
  }, [products, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('이 제품을 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">제품 관리</h1>
          <p className="mt-1 text-sm text-muted">
            총 {products.length}개 제품{search && ` · 검색결과 ${filteredProducts.length}개`}
          </p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus size={16} className="mr-1" /> 새 제품
        </Button>
      </div>

      {/* Search */}
      <div className="mt-5 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제품명, 모델명, 카테고리로 검색..."
          className="h-10 w-full border border-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
        />
      </div>

      {/* Product List */}
      <div className="mt-4">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted">로딩 중...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">
            {search ? '검색 결과가 없습니다' : '등록된 제품이 없습니다'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/admin/products/${item.id}`)}
                className="border border-border bg-surface hover:border-brand/40 hover:shadow-sm cursor-pointer transition-all group relative"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-background overflow-hidden">
                  {item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted">
                      <Package size={36} />
                    </div>
                  )}

                  {/* Delete button overlay */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm text-muted hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 rounded-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 text-center">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  {item.model_name && (
                    <p className="text-xs text-muted mt-0.5 truncate">{item.model_name}</p>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {item.categories?.name && (
                      <span className="inline-block rounded bg-brand-light px-1.5 py-0.5 text-[10px] text-brand-dark truncate max-w-[70%]">
                        {item.categories.name}
                      </span>
                    )}
                    <span className="text-[10px] text-muted">{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
