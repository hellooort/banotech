'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const SUB_NAV = [
  { label: '인사말', href: '/about' },
  { label: '연혁', href: '/about/history' },
  { label: '인증서', href: '/about/certificates' },
  { label: '오시는 길', href: '/about/location' },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">회사소개</h1>
          <nav className="mt-6 flex gap-6 overflow-x-auto">
            {SUB_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 border-b-2 pb-3 text-sm transition-colors',
                  pathname === item.href
                    ? 'border-accent text-accent font-medium'
                    : 'border-transparent text-muted hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-6 py-12">{children}</div>
    </>
  );
}
