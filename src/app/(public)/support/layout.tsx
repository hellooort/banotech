'use client';

import { useI18n } from '@/lib/i18n/context';
import SubSidebar from '@/components/layout/SubSidebar';

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  const items = [
    { label: t.mega.notices, href: '/support' },
    { label: t.mega.inquiry, href: '/support/inquiry' },
  ];

  return (
    <div className="mx-auto flex max-w-[1280px] gap-8 px-6 py-10">
      <SubSidebar title={t.nav.contactUs} items={items} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
