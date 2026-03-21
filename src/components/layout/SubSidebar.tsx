'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SubSidebarProps {
  title: string;
  items: { label: string; href: string }[];
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

export default function SubSidebar({ title, items }: SubSidebarProps) {
  const pathname = usePathname();
  const hash = useHash();

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
