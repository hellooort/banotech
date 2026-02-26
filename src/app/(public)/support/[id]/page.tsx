import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { formatDate } from '@/lib/utils';
import type { Notice } from '@/types/database';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;

  let notice: Notice | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('notices')
      .select('*')
      .eq('id', id)
      .single();

    if (!data) return notFound();
    notice = data;
  } catch {
    return notFound();
  }

  return (
    <>
      <PageHeader title="공지사항" />
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <Link
          href="/support"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> 목록으로
        </Link>

        <article className="max-w-3xl">
          <h1 className="text-lg font-semibold text-foreground">{notice?.title}</h1>
          <p className="mt-2 text-xs text-muted">{notice && formatDate(notice.created_at)}</p>
          <div className="mt-8 text-sm leading-relaxed text-secondary whitespace-pre-line border-t border-border pt-6">
            {notice?.content}
          </div>
        </article>
      </div>
    </>
  );
}
