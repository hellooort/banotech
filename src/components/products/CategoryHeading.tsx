'use client';

import { useI18n } from '@/lib/i18n/context';
import type { Category } from '@/types/database';

interface CategoryHeadingProps {
  category: Category;
  parentCategory: { name: string; name_en: string | null } | null;
}

export default function CategoryHeading({ category, parentCategory }: CategoryHeadingProps) {
  const { locale } = useI18n();

  const getName = (item: { name: string; name_en?: string | null }) =>
    locale === 'en' && item.name_en ? item.name_en : item.name;

  const displayName = parentCategory
    ? `${getName(parentCategory)} - ${getName(category)}`
    : getName(category);

  return (
    <h2 className="mb-6 text-base font-medium text-foreground">{displayName}</h2>
  );
}
