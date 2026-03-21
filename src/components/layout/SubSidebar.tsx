'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
            { label: t.navSub.location, href: '/about/location' },
          ],
        };
      case 'resources':
        return {
          title: t.nav.download,
          items: [
            { label: t.mega.catalog, href: '/resources#catalog' },
            { label: t.mega.drawingManual, href: '/resources#drawing' },
            { label: t.mega.certificates, href: '/resources#certificate' },
            { label: t.mega.approvalDocs, href: '/resources#approval' },
            { label: t.mega.otherResources, href: '/resources#other' },
          ],
        };
      case 'support':
        return {
          title: t.nav.contactUs,
          items: [
            { label: t.mega.notices, href: '/support' },
            { label: t.mega.inquiry, href: '/support/inquiry' },
          ],
        };
    }
  }, [variant, t]);
}

export default function SubSidebar({ variant }: SubSidebarProps) {
  const pathname = usePathname();
  const hash = useHash();
  const { title, items } = useMenuConfig(variant);

  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-3">{title}</h3>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const [path, hashPart] = item.href.split('#');
          const itemHash = hashPart ? `#${hashPart}` : '';
          const hashForCompare =
            pathname === '/resources' && !hash ? '#catalog' : hash;
          const isActive =
            pathname === path &&
            (itemHash ? hashForCompare === itemHash : !item.href.includes('#'));

          return (
            <Link
              key={`${path}-${item.label}`}
              href={item.href}
              scroll={false}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors border-l-2',
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
