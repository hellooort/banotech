'use client';

import { useI18n } from '@/lib/i18n/context';

export default function ProductsHeader() {
  const { t } = useI18n();

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-0">
        <p className="text-sm tracking-[0.2em] uppercase text-brand mb-2">{t.products.label}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t.products.title}</h1>
      </div>
    </div>
  );
}
