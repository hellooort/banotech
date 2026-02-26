'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  const topCategories = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-4">
        {t.products.category}
      </h3>
      <nav className="space-y-1">
        {topCategories.map((cat) => {
          const href = `/products/${cat.slug}`;
          const children = getChildren(cat.id);
          const isParentActive = pathname === href || children.some(c => pathname === `/products/${c.slug}`);

          return (
            <div key={cat.id}>
              <Link
                href={href}
                className={cn(
                  'block px-3 py-2.5 text-sm font-medium transition-colors border-l-2',
                  isParentActive
                    ? 'border-brand text-brand bg-brand-light'
                    : 'border-transparent text-foreground hover:text-brand hover:bg-hover'
                )}
              >
                {getCategoryName(cat, locale)}
              </Link>
              {children.length > 0 && isParentActive && (
                <div className="ml-3 border-l border-border">
                  {children.map((child) => {
                    const childHref = `/products/${child.slug}`;
                    const childActive = pathname === childHref;
                    return (
                      <Link
                        key={child.id}
                        href={childHref}
                        className={cn(
                          'block px-3 py-1.5 text-sm transition-colors',
                          childActive
                            ? 'text-brand font-medium'
                            : 'text-secondary hover:text-foreground'
                        )}
                      >
                        {getCategoryName(child, locale)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
