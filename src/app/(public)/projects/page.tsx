import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import type { Project } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let projects: Project[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    projects = data ?? [];
  } catch {
    // fallback
  }

  return (
    <>
      <PageHeader title="프로젝트" description="납품 및 시공 프로젝트" />
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group border border-border bg-surface transition-all hover:shadow-sm hover:border-primary/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-background">
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {project.location}{project.year && ` · ${project.year}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted py-12 text-center">등록된 프로젝트가 없습니다.</p>
        )}
      </div>
    </>
  );
}
