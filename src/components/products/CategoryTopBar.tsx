'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import { getCategoryName } from '@/lib/i18n/helpers';
import type { Category } from '@/types/database';

interface CategoryTopBarProps {
  categories: Category[];
}

export default function CategoryTopBar({ categories }: CategoryTopBarProps) {
  const pathname = usePathname();
  const { locale } = useI18n();

  const topCategories = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  if (topCategories.length === 0) return null;

  return (
    <div className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-16 z-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {topCategories.map((cat) => {
            const href = `/products/${cat.slug}`;
            const children = getChildren(cat.id);
            const active = pathname === href || children.some(c => pathname === `/products/${c.slug}`);

            return (
              <Link
                key={cat.id}
                href={href}
                className={cn(
                  'shrink-0 px-5 py-3 text-sm transition-all border-b-2',
                  active
                    ? 'border-brand text-brand font-medium'
                    : 'border-transparent text-secondary hover:text-brand hover:border-brand/30'
                )}
              >
                {getCategoryName(cat, locale)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
