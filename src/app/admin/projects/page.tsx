'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import DataTable from '@/components/admin/DataTable';
import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('이 프로젝트를 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">프로젝트 관리</h1>
          <p className="mt-1 text-sm text-muted">납품 프로젝트를 등록하고 관리합니다</p>
        </div>
        <Button onClick={() => router.push('/admin/projects/new')}>
          <Plus size={16} className="mr-1" /> 새 프로젝트
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted">로딩 중...</div>
        ) : (
          <DataTable
            columns={[
              { key: 'title', label: '프로젝트명' },
              { key: 'location', label: '위치', width: '150px' },
              { key: 'year', label: '연도', width: '80px' },
              {
                key: 'created_at', label: '등록일', width: '120px',
                render: (item: Project) => formatDate(item.created_at),
              },
              {
                key: 'actions', label: '', width: '50px',
                render: (item: Project) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                ),
              },
            ]}
            data={projects}
            onRowClick={(item) => router.push(`/admin/projects/${item.id}`)}
          />
        )}
      </div>
    </div>
  );
}
