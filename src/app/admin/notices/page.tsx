'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import DataTable from '@/components/admin/DataTable';
import { Plus, Trash2 } from 'lucide-react';
import type { Notice } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function AdminNoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('notices').select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    setNotices(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('이 공지사항을 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('notices').delete().eq('id', id);
    fetchNotices();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">공지사항 관리</h1>
        </div>
        <Button onClick={() => router.push('/admin/notices/new')}>
          <Plus size={16} className="mr-1" /> 새 공지
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted">로딩 중...</div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'title', label: '제목',
                render: (item: Notice) => (
                  <div className="flex items-center gap-2">
                    {item.is_pinned && (
                      <span className="shrink-0 text-xs font-medium text-accent border border-accent px-1 py-0.5">공지</span>
                    )}
                    <span>{item.title}</span>
                  </div>
                ),
              },
              {
                key: 'created_at', label: '등록일', width: '120px',
                render: (item: Notice) => formatDate(item.created_at),
              },
              {
                key: 'actions', label: '', width: '50px',
                render: (item: Notice) => (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                ),
              },
            ]}
            data={notices}
            onRowClick={(item) => router.push(`/admin/notices/${item.id}`)}
          />
        )}
      </div>
    </div>
  );
}
