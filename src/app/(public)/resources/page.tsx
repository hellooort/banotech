import { createClient } from '@/lib/supabase/server';
import { Download, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Document as DocType } from '@/types/database';
import ResourcesHashRedirect from '@/components/resources/ResourcesHashRedirect';

export const revalidate = 60;

type TabKey = 'catalog' | 'drawing' | 'certificate' | 'approval' | 'other';

const ALLOWED_TABS: TabKey[] = ['catalog', 'drawing', 'certificate', 'approval', 'other'];

function typesForTab(tab: TabKey): string[] {
  if (tab === 'drawing') return ['drawing', 'manual'];
  return [tab];
}

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const { tab: rawTab } = await searchParams;
  const activeTab: TabKey = ALLOWED_TABS.includes(rawTab as TabKey)
    ? (rawTab as TabKey)
    : 'catalog';

  let documents: DocType[] = [];

  try {
    const supabase = await createClient();
    const types = typesForTab(activeTab);
    const { data } = await supabase
      .from('documents')
      .select('*')
      .in('type', types)
      .order('created_at', { ascending: false });
    documents = data ?? [];
  } catch {
    // fallback
  }

  return (
    <div>
      <ResourcesHashRedirect />
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 border border-border bg-surface px-5 py-4 transition-colors hover:border-primary/30"
            >
              <FileText size={20} className="text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">{doc.title}</h3>
                <p className="text-xs text-muted mt-0.5">{formatDate(doc.created_at)}</p>
              </div>
              <Download size={18} className="text-muted shrink-0" />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted py-12 text-center">등록된 자료가 없습니다.</p>
      )}
    </div>
  );
}
