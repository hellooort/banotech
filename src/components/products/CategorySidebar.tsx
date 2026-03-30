'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import { getCategoryName } from '@/lib/i18n/helpers';
import type { Category } from '@/types/database';

interface CategorySidebarProps {
  categories: Category[];
}

export default function CategorySidebar({ categories }: CategorySidebarProps) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const [openParent, setOpenParent] = useState<string | null>(null);

  const topCategories = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  /**
   * URL 첫 세그먼트 슬러그로 카테고리를 찾고, 2차면 부모를 따라 올라가 1차(탑)만 반환.
   * startsWith('/products/1차슬러그') 방식은 paper-holder vs paper-holder-single 같은 접두사 충돌로
   * 잘못된 1차가 잡히거나, paper-holder-wall 자식 URL에서 1차를 못 찾아 서브 패널이 사라짐.
   */
  const activeParent = (() => {
    const m = pathname.match(/^\/products\/([^/]+)/);
    if (!m) return undefined;
    const slug = decodeURIComponent(m[1]);
    let current: Category | undefined = categories.find((c) => c.slug === slug);
    if (!current) return undefined;
    while (current?.parent_id) {
      const pid: string = current.parent_id;
      const p = categories.find((c) => c.id === pid);
      if (!p) break;
      current = p;
    }
    return current && current.parent_id === null ? current : undefined;
  })();

  /** 다른 1차 카테고리로 이동했을 때만 열린 서브 패널 초기화 (같은 1차 내 2차 이동은 유지) */
  useEffect(() => {
    if (openParent && activeParent?.id && openParent !== activeParent.id) {
      setOpenParent(null);
    }
  }, [pathname, activeParent?.id, openParent]);

  const selectedId = openParent ?? activeParent?.id ?? null;
  const selectedChildren = selectedId ? getChildren(selectedId) : [];

  return (
    <aside
      className={cn(
        'hidden shrink-0 lg:flex',
        selectedChildren.length > 0 ? 'w-[656px]' : 'w-[336px]'
      )}
    >
      {/* 1차 카테고리 */}
      <div className="w-[336px] shrink-0 border-r border-border pr-2">
        <h3 className="px-2 pb-3 text-[18px] font-bold text-foreground tracking-tight">
          {t.products.category}
        </h3>
        <nav>
          {topCategories.map((cat) => {
            const href = `/products/${cat.slug}`;
            const children = getChildren(cat.id);
            const isActive = activeParent?.id === cat.id;
            const isSelected = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                className={cn(
                  'flex w-full items-center rounded-md text-[15px] font-medium transition-colors',
                  isActive
                    ? 'bg-brand text-white shadow-sm'
                    : isSelected && children.length > 0
                      ? 'text-foreground bg-hover'
                      : 'text-secondary hover:text-foreground hover:bg-hover'
                )}
              >
                <Link href={href} className="flex-1 truncate px-2 py-1.5">
                  {getCategoryName(cat, locale)}
                </Link>
                {children.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setOpenParent((prev) => (prev === cat.id ? null : cat.id))}
                    className="flex h-full items-center px-2 py-1.5 shrink-0"
                  >
                    <ChevronRight size={14} className={cn('opacity-50 transition-transform', isSelected && 'rotate-90')} />
                  </button>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>

      {/* 2차 서브카테고리 — 1차에 하위가 있을 때만 영역 표시 */}
      {selectedChildren.length > 0 && (
        <div className="w-[320px] shrink-0 pl-3">
          <nav className="pt-7">
            {selectedChildren.map((child) => {
              const childHref = `/products/${child.slug}`;
              const decodedPathname = decodeURIComponent(pathname);
              const childActive = decodedPathname === childHref;
              return (
                <Link
                  key={child.id}
                  href={childHref}
                  className={cn(
                    'block rounded-md px-2 py-1.5 text-[15px] font-bold transition-colors',
                    childActive
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-foreground hover:text-brand hover:bg-hover'
                  )}
                >
                  {getCategoryName(child, locale)}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </aside>
  );
}
