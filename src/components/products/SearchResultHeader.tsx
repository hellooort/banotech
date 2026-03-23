'use client';

import { useI18n } from '@/lib/i18n/context';

interface Props {
  query: string;
  count: number;
}

export default function SearchResultHeader({ query, count }: Props) {
  const { t } = useI18n();

  if (!query) {
    return <h2 className="mb-6 text-base font-medium text-foreground">전체 제품</h2>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-base font-medium text-foreground">
        {t.search.resultCount}{' '}
        <span className="text-brand">&ldquo;{query}&rdquo;</span>
        <span className="ml-2 text-sm font-normal text-muted">({count})</span>
      </h2>
      {count === 0 && (
        <p className="mt-2 text-sm text-muted">{t.search.noResults}</p>
      )}
    </div>
  );
}
