'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { getProductName } from '@/lib/i18n/helpers';

interface ProductCardProps {
  product: Product;
  categorySlug?: string;
  slugMap?: Record<string, string>;
}

export default function ProductCard({ product, categorySlug, slugMap }: ProductCardProps) {
  const { locale } = useI18n();
  const displayName = getProductName(product, locale);

  return (
    <Link
      href={`/products/${categorySlug || slugMap?.[product.category_id] || 'all'}/${product.id}`}
      className="group block border border-border bg-surface transition-all hover:shadow-sm hover:border-brand/40"
    >
      <div className="relative aspect-square overflow-hidden bg-background">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-base font-medium text-foreground truncate group-hover:text-brand transition-colors">
          {displayName}
        </h3>
        {product.model_name && (
          <p className="mt-1 text-sm text-muted truncate">{product.model_name}</p>
        )}
      </div>
    </Link>
  );
}
