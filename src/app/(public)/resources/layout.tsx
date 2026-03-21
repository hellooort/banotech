'use client';

import { useI18n } from '@/lib/i18n/context';
import SubSidebar from '@/components/layout/SubSidebar';

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  const items = [
    { label: t.mega.catalog, href: '/resources#catalog' },
    { label: t.mega.drawingManual, href: '/resources#drawing' },
    { label: t.mega.certificates, href: '/resources#certificate' },
    { label: t.mega.approvalDocs, href: '/resources#approval' },
    { label: t.mega.otherResources, href: '/resources#other' },
  ];

  return (
    <div className="mx-auto flex max-w-[1280px] gap-8 px-6 py-10">
      <SubSidebar title={t.nav.download} items={items} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
