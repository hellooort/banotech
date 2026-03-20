'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { locale, setLocale, t } = useI18n();

  const isHome = pathname === '/';
  const isActive = (href: string) => pathname.startsWith(href);

  const NAV_ITEMS = [
    {
      label: t.nav.about,
      href: '/about',
      children: [
        { label: t.navSub.greeting, href: '/about' },
        { label: t.navSub.history, href: '/about/history' },
        { label: t.navSub.certificates, href: '/about/certificates' },
        { label: t.navSub.location, href: '/about/location' },
      ],
    },
    { label: t.nav.products, href: '/products' },
    { label: t.nav.projects, href: '/projects' },
    { label: t.nav.resources, href: '/resources' },
    {
      label: t.nav.support,
      href: '/support',
      children: [
        { label: t.navSub.notices, href: '/support' },
        { label: t.navSub.inquiry, href: '/support/inquiry' },
      ],
    },
  ];

  return (
    <header className={cn(
      'sticky top-0 z-40 border-b backdrop-blur-sm transition-colors',
      isHome
        ? 'border-border/40 bg-[#f5f0eb]/95'
        : 'border-border bg-surface/95'
    )}>
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="relative block h-8 w-24">
          <Image
            src="/logo_black.png"
            alt="BANO"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-1 px-4 py-5 text-sm tracking-wide transition-colors',
                  isActive(item.href) ? 'text-brand font-medium' : 'text-secondary hover:text-brand'
                )}
              >
                {item.label}
                {item.children && <ChevronDown size={12} className="opacity-50" />}
              </Link>

              {item.children && openDropdown === item.href && (
                <div className="absolute left-0 top-full w-36 border border-border bg-surface py-1.5 shadow-lg">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block px-4 py-2 text-sm transition-colors',
                        pathname === child.href
                          ? 'text-brand font-medium'
                          : 'text-secondary hover:text-brand hover:bg-hover'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Language Toggle */}
          <div className="ml-4 flex items-center border-l border-current/10 pl-4">
            <button
              onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium tracking-wider transition-colors',
                'text-muted hover:text-foreground'
              )}
            >
              <span className={cn(locale === 'ko' ? 'text-brand font-bold' : 'text-muted')}>KOREA</span>
              <span className="text-border">/</span>
              <span className={cn(locale === 'en' ? 'text-brand font-bold' : 'text-muted')}>ENGLISH</span>
            </button>
          </div>
        </nav>

        {/* Mobile: Language + Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
            className="text-[10px] font-medium tracking-wider text-muted"
          >
            {locale === 'ko' ? 'ENGLISH' : 'KOREA'}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface">
          <nav className="mx-auto max-w-[1280px] px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="border-b border-border last:border-0">
                <Link
                  href={item.href}
                  onClick={() => !item.children && setMobileOpen(false)}
                  className={cn(
                    'block py-3 text-sm',
                    isActive(item.href) ? 'text-brand font-medium' : 'text-secondary'
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pb-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'block py-2 text-sm',
                          pathname === child.href ? 'text-brand' : 'text-muted hover:text-foreground'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
