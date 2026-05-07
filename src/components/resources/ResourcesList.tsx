import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Download, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Document as DocType, Certificate } from '@/types/database';

type TabKey = 'catalog' | 'drawing' | 'certificate' | 'other';

function typesForTab(tab: TabKey): string[] {
  if (tab === 'drawing') return ['drawing', 'manual'];
  return [tab];
}

export default async function ResourcesList({ tab }: { tab: TabKey }) {
  if (tab === 'certificate') {
    let certificates: Certificate[] = [];
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('certificates')
        .select('*')
        .order('sort_order');
      certificates = data ?? [];
    } catch {
      // fallback
    }

    if (certificates.length === 0) {
      return <p className="text-sm text-muted py-12 text-center">등록된 인증서가 없습니다.</p>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {certificates.map((cert) => (
          <a
            key={cert.id}
            href={cert.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-border bg-surface transition-colors hover:border-primary/30"
          >
            <div className="relative aspect-[3/4] bg-background overflow-hidden">
              <Image
                src={cert.image_url}
                alt={cert.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-sm font-medium text-foreground truncate">{cert.name}</p>
              {cert.name_en && (
                <p className="text-xs text-muted mt-0.5 truncate">{cert.name_en}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    );
  }

  let documents: DocType[] = [];

  try {
    const supabase = await createClient();
    const types = typesForTab(tab);
    const { data } = await supabase
      .from('documents')
      .select('*')
      .in('type', types)
      .order('created_at', { ascending: false });
    documents = data ?? [];
  } catch {
    // fallback
  }

  if (documents.length === 0) {
    return <p className="text-sm text-muted py-12 text-center">등록된 자료가 없습니다.</p>;
  }

  return (
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
            <h3 className="text-[15px] font-medium text-foreground truncate">{doc.title}</h3>
            <p className="text-sm text-muted mt-0.5">{formatDate(doc.created_at)}</p>
          </div>
          <Download size={18} className="text-muted shrink-0" />
        </a>
      ))}
    </div>
  );
}
