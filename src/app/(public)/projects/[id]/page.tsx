import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import type { Project, ProjectImage } from '@/types/database';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('projects').select('title, location, thumbnail_url').eq('id', id).single();
    if (data) {
      return {
        title: `${data.title} | VANO 프로젝트`,
        description: data.location ? `VANO 프로젝트 - ${data.title} (${data.location})` : `VANO 프로젝트 - ${data.title}`,
        openGraph: data.thumbnail_url ? { images: [{ url: data.thumbnail_url }] } : undefined,
      };
    }
  } catch { /* fallback */ }
  return { title: '프로젝트 | VANO' };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  let project: Project | null = null;
  let images: ProjectImage[] = [];

  try {
    const supabase = await createClient();
    const [projRes, imgRes] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_images').select('*').eq('project_id', id).order('sort_order'),
    ]);

    if (!projRes.data) return notFound();
    project = projRes.data;
    images = imgRes.data ?? [];
  } catch {
    return notFound();
  }

  return (
    <>
      <PageHeader title={project?.title ?? ''} description={project?.location ?? ''} />
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> 목록으로
        </Link>

        {project?.description && (
          <p className="mb-8 text-sm leading-relaxed text-secondary max-w-2xl">
            {project.description}
          </p>
        )}

        {/* Main image */}
        {project?.thumbnail_url && (
          <div className="relative mb-6 aspect-[16/9] overflow-hidden border border-border bg-background">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-[4/3] overflow-hidden border border-border bg-background">
                <Image
                  src={img.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
