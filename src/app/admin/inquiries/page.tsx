'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Inquiry } from '@/types/database';
import { formatDate } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  pending: '대기',
  replied: '답변완료',
  closed: '종료',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50 border-amber-200',
  replied: 'text-green-600 bg-green-50 border-green-200',
  closed: 'text-muted bg-hover border-border',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('inquiries').select('*')
      .order('created_at', { ascending: false });
    setInquiries(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from('inquiries').update({ status }).eq('id', id);
    fetchInquiries();
    if (selected?.id === id) setSelected({ ...selected!, status: status as Inquiry['status'] });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">문의 관리</h1>
      <p className="mt-1 text-sm text-muted">고객 문의를 확인하고 관리합니다</p>

      <div className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted">로딩 중...</div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'status', label: '상태', width: '80px',
                render: (item: Inquiry) => (
                  <span className={`inline-block px-2 py-0.5 text-xs border ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                ),
              },
              { key: 'subject', label: '제목' },
              { key: 'company_name', label: '회사명', width: '150px' },
              { key: 'contact_name', label: '담당자', width: '100px' },
              {
                key: 'created_at', label: '일시', width: '120px',
                render: (item: Inquiry) => formatDate(item.created_at),
              },
            ]}
            data={inquiries}
            onRowClick={(item) => setSelected(item)}
          />
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="문의 상세"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted text-xs">회사명</p>
                <p className="font-medium">{selected.company_name}</p>
              </div>
              <div>
                <p className="text-muted text-xs">담당자</p>
                <p className="font-medium">{selected.contact_name}</p>
              </div>
              <div>
                <p className="text-muted text-xs">이메일</p>
                <p className="font-medium">{selected.email}</p>
              </div>
              <div>
                <p className="text-muted text-xs">전화</p>
                <p className="font-medium">{selected.phone || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-muted text-xs mb-1">제목</p>
              <p className="text-sm font-medium">{selected.subject}</p>
            </div>

            <div>
              <p className="text-muted text-xs mb-1">내용</p>
              <p className="text-sm whitespace-pre-line text-secondary border border-border p-3 bg-background">
                {selected.message}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant={selected.status === 'replied' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(selected.id, 'replied')}>
                답변완료
              </Button>
              <Button size="sm" variant={selected.status === 'closed' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(selected.id, 'closed')}>
                종료
              </Button>
              {selected.status !== 'pending' && (
                <Button size="sm" variant="ghost"
                  onClick={() => handleStatusChange(selected.id, 'pending')}>
                  대기로 변경
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
