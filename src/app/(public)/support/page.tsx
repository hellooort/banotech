import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Notice } from '@/types/database';

export const revalidate = 60;

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">공지사항</h2>
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
                <span className="flex-1 text-[15px] text-foreground truncate">{notice.title}</span>
                <span className="shrink-0 text-sm text-muted">{formatDate(notice.created_at)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted py-12 text-center">등록된 공지사항이 없습니다.</p>
        )}
    </div>
  );
}
