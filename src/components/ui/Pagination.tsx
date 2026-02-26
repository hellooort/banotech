'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  const buildHref = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  return (
    <nav className="flex items-center justify-center gap-1 py-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center text-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
      )}

      {visiblePages.map((page, i) => {
        const prevPage = visiblePages[i - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <span key={page} className="flex items-center">
            {showEllipsis && <span className="px-2 text-muted">...</span>}
            <Link
              href={buildHref(page)}
              className={cn(
                'flex h-9 w-9 items-center justify-center text-sm transition-colors',
                page === currentPage
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-foreground'
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center text-muted hover:text-foreground transition-colors"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}
