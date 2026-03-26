'use client';

import { memo } from 'react';
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

export default memo(function ProductCard({ product, categorySlug, slugMap }: ProductCardProps) {
  const { locale } = useI18n();
  const displayName = getProductName(product, locale);

  return (
    <Link
      href={`/products/${categorySlug || slugMap?.[product.category_id] || 'all'}/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-border/80 bg-surface transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#faf9f7]">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="truncate text-lg font-semibold text-foreground transition-colors group-hover:text-brand">
          {displayName}
        </h3>
        {product.model_name && (
          <p className="mt-1 text-[15px] text-muted truncate">{product.model_name}</p>
        )}
      </div>
    </Link>
  );
});
