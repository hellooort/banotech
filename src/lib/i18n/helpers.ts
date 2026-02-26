import type { Locale } from './translations';
import type { Product, Category } from '@/types/database';

export function getProductName(product: Product, locale: Locale): string {
  if (locale === 'en' && product.name_en) return product.name_en;
  return product.name;
}

export function getProductDescription(product: Product, locale: Locale): string | null {
  if (locale === 'en' && product.description_en) return product.description_en;
  return product.description;
}

export function getCategoryName(category: Category, locale: Locale): string {
  if (locale === 'en' && category.name_en) return category.name_en;
  return category.name;
}
