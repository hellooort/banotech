'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';

type Variant = 'about' | 'resources' | 'support';

interface SubSidebarProps {
  variant: Variant;
}

function useHash() {
  const [hash, setHash] = useState('');
  useEffect(() => {
    setHash(typeof window !== 'undefined' ? window.location.hash : '');
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

function useMenuConfig(variant: Variant) {
  const { t } = useI18n();

  return useMemo(() => {
    switch (variant) {
      case 'about':
        return {
          title: t.about.title,
          items: [
            { label: t.navSub.greeting, href: '/about' },
            { label: t.navSub.history, href: '/about/history' },
            { label: t.navSub.productionLine, href: '/about/production-line' },
            { label: t.navSub.location, href: '/about/location' },
          ],
        };
      case 'resources':
        return {
          title: t.nav.download,
          items: [
            { label: t.mega.catalog, href: '/resources?tab=catalog' },
            { label: t.mega.drawingManual, href: '/resources?tab=drawing' },
            { label: t.mega.certificates, href: '/resources?tab=certificate' },
            { label: t.mega.approvalDocs, href: '/resources?tab=approval' },
            { label: t.mega.otherResources, href: '/resources?tab=other' },
          ],
        };
      case 'support':
        return {
          title: t.nav.contactUs,
          items: [
            { label: t.mega.notices, href: '/support' },
          ],
        };
    }
  }, [variant, t]);
}

export default function SubSidebar({ variant }: SubSidebarProps) {
  const pathname = usePathname();
  const hash = useHash();
  const params = useSearchParams();
  const { title, items } = useMenuConfig(variant);

  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">{title}</h3>
      <nav className="space-y-0.5">
        {items.map((item) => {
          let isActive = false;
          const url = new URL(item.href, 'http://x');

          if (url.searchParams.has('tab')) {
            const currentTab = params.get('tab') ?? 'catalog';
            isActive = pathname === url.pathname && currentTab === url.searchParams.get('tab');
          } else {
            const [path, hashPart] = item.href.split('#');
            const itemHash = hashPart ? `#${hashPart}` : '';
            const hashForCompare =
              pathname === '/resources' && !hash ? '#catalog' : hash;
            isActive =
              pathname === path &&
              (itemHash ? hashForCompare === itemHash : !item.href.includes('#'));
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={false}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors border-l-2',
                isActive
                  ? 'border-l-4 border-l-white bg-brand text-white shadow-sm'
                  : 'border-transparent text-secondary hover:text-foreground hover:bg-hover'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
