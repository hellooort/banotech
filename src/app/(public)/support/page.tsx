import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import { formatDate } from '@/lib/utils';
import type { Notice } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  let notices: Notice[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('notices')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    notices = data ?? [];
  } catch {
    // fallback
  }

  return (
    <>
      <PageHeader title="고객지원" description="공지사항 및 문의" />
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-medium text-foreground">공지사항</h2>
          <Link
            href="/support/inquiry"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            문의하기 &rarr;
          </Link>
        </div>

        {notices.length > 0 ? (
          <div className="divide-y divide-border border-t border-b border-border">
            {notices.map((notice) => (
              <Link
                key={notice.id}
                href={`/support/${notice.id}`}
                className="flex items-center gap-4 px-2 py-4 hover:bg-hover transition-colors"
              >
                {notice.is_pinned && (
                  <span className="shrink-0 text-xs font-medium text-accent border border-accent px-1.5 py-0.5">
                    공지
                  </span>
                )}
                <span className="flex-1 text-sm text-foreground truncate">{notice.title}</span>
                <span className="shrink-0 text-xs text-muted">{formatDate(notice.created_at)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted py-12 text-center">등록된 공지사항이 없습니다.</p>
        )}
      </div>
    </>
  );
}
