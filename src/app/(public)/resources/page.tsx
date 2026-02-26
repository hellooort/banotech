'use client';

import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import PageHeader from '@/components/ui/PageHeader';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Document as DocType } from '@/types/database';

const TABS = [
  { key: 'catalog', label: '카탈로그' },
  { key: 'drawing', label: '도면 및 설명서' },
  { key: 'other', label: '기타 자료' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        const supabase = createClient();
        const types = activeTab === 'drawing' ? ['drawing', 'manual'] : [activeTab];
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
    <>
      <PageHeader title="자료실" description="제품 관련 카탈로그 및 자료를 다운로드하세요" />
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'pb-3 text-sm transition-colors border-b-2',
                activeTab === tab.key
                  ? 'border-accent text-accent font-medium'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Document List */}
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
    </>
  );
}
