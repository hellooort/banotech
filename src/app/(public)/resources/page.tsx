'use client';

import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import type { Document as DocType } from '@/types/database';

type TabKey = 'catalog' | 'drawing' | 'certificate' | 'approval' | 'other';

function tabFromHash(): TabKey {
  if (typeof window === 'undefined') return 'catalog';
  const h = window.location.hash.replace('#', '');
  const allowed: TabKey[] = ['catalog', 'drawing', 'certificate', 'approval', 'other'];
  if (allowed.includes(h as TabKey)) return h as TabKey;
  return 'catalog';
}

function typesForTab(tab: TabKey): string[] {
  if (tab === 'drawing') return ['drawing', 'manual'];
  return [tab];
}

export default function ResourcesPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(tabFromHash());
    const onHash = () => setActiveTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        const supabase = createClient();
        const types = typesForTab(activeTab);
        const { data } = await supabase
          .from('documents')
          .select('*')
          .in('type', types)
          .order('created_at', { ascending: false });
        setDocuments(data ?? []);
      } catch {
        setDocuments([]);
      }
      setLoading(false);
    }
    fetchDocuments();
  }, [activeTab]);

  return (
    <div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-muted">
          로딩 중...
        </div>
      ) : documents.length > 0 ? (
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
