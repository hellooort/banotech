'use client';

import { useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, BookOpen, Building2, History, MapPin, FileText, PenTool, ShieldCheck, FileCheck, FolderOpen, Bell, MessageSquare, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

const PdfFlipbook = dynamic(() => import('@/components/pdf/PdfFlipbook'), { ssr: false });

type MegaKey = 'company' | 'products' | 'download' | 'contactUs';

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<MegaKey | null>(null);
  const [mobileSection, setMobileSection] = useState<MegaKey | null>(null);
  const { locale, setLocale, t } = useI18n();
  const [catalogPdfUrl, setCatalogPdfUrl] = useState<string | null>(null);
  const [ecatalogueLoading, setEcatalogueLoading] = useState(false);

  const openEcatalogueFlipbook = useCallback(async () => {
    setEcatalogueLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('documents')
        .select('file_url')
        .eq('type', 'catalog')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data?.file_url) {
        window.alert(
          locale === 'ko'
            ? '등록된 카탈로그 PDF가 없습니다. 관리자 > 자료 관리에서 카탈로그를 등록해 주세요.'
            : 'No catalog PDF found. Please upload one in Admin > Documents.'
        );
        return;
      }
      setCatalogPdfUrl(data.file_url);
    } finally {
      setEcatalogueLoading(false);
    }
  }, [locale]);

  const TOP_MENUS: { key: MegaKey; label: string; href: string }[] = [
    { key: 'company', label: t.nav.company, href: '/about' },
    { key: 'products', label: t.nav.products, href: '/products' },
    { key: 'download', label: t.nav.download, href: '/resources' },
    { key: 'contactUs', label: t.nav.contactUs, href: '/support/inquiry' },
  ];

  const PRODUCT_GROUPS = useMemo(() => {
    if (locale === 'ko') {
      return [
        { title: t.mega.productsGroup1, items: ['수건걸이', '휴지걸이[노출형]', '컵대/비누대', '옷걸이'] },
        { title: t.mega.productsGroup2, items: ['휴지걸이[매립형]/잡지꽂이', '선반', '면도경', '청소솔'] },
        { title: t.mega.productsGroup3, items: ['물비누 분배기', '욕조손잡이', '샤워부스도어손잡이', '스톱퍼'] },
        { title: t.mega.productsGroup4, items: ['편의품', '기타', t.mega.newProducts] },
      ];
    }
    return [
      { title: t.mega.productsGroup1, items: ['Towel Rack', 'Paper Holder [Wall]', 'Tumbler/Soap Dish', 'Robe Hook'] },
      { title: t.mega.productsGroup2, items: ['Paper Holder [Recessed]', 'Shelves', 'Shaving Mirror', 'Toilet Brush'] },
      { title: t.mega.productsGroup3, items: ['Soap Dispenser', 'Grab Bar', 'Shower Door Handle', 'Stopper'] },
      { title: t.mega.productsGroup4, items: ['Utility Products', 'Others', t.mega.newProducts] },
    ];
  }, [locale, t.mega]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-white backdrop-blur-md transition-[box-shadow,border-color] duration-150',
        openMega ? 'border-b border-transparent shadow-none' : 'border-b border-border/70 shadow-[0_1px_8px_rgba(0,0,0,0.03)]'
      )}
      onMouseLeave={() => setOpenMega(null)}
    >
      <div className="mx-auto grid h-[72px] max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-0 px-6 lg:grid-cols-[auto_1fr_160px] lg:gap-4">
        {/* 1열: 로고 */}
        <Link href="/" className="relative block h-8 w-24 shrink-0">
          <Image
            src="/logo_black.png"
            alt="BANO"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* 2열: 데스크톱 메뉴 (모바일에선 빈 공간) */}
        <nav className="hidden min-w-0 items-center justify-end gap-2 overflow-hidden lg:flex">
          {TOP_MENUS.map((item) => (
            <Link
              href={item.href}
              key={item.key}
              onMouseEnter={() => setOpenMega(item.key)}
              className={cn(
                'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-3 py-2.5 text-[13px] tracking-wide transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-brand text-white font-semibold shadow-sm [&_svg]:text-white/90'
                  : 'text-secondary hover:bg-hover hover:text-foreground'
              )}
            >
              {item.label}
              <ChevronDown size={12} className="opacity-50" />
            </Link>
          ))}
          <button
            type="button"
            onClick={openEcatalogueFlipbook}
            disabled={ecatalogueLoading}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-brand px-3 py-2.5 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            <BookOpen size={14} className="opacity-95" />
            {ecatalogueLoading ? '…' : t.nav.ecatalogue}
          </button>
        </nav>

        {/* 3열: 언어 토글 + 모바일 햄버거 */}
        <div className="flex items-center justify-end gap-3">
          {/* 데스크톱 언어 토글 */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
            className="hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium tracking-wide transition-colors lg:inline-flex"
          >
            <span className={cn('rounded-full px-2 py-0.5', locale === 'ko' ? 'bg-brand font-bold text-white' : 'text-muted')}>{t.nav.langKo}</span>
            <span className="text-border">/</span>
            <span className={cn('rounded-full px-2 py-0.5', locale === 'en' ? 'bg-brand font-bold text-white' : 'text-muted')}>{t.nav.langEn}</span>
          </button>

          {/* 모바일 언어 토글 */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
            className="shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium tracking-wide text-muted lg:hidden"
          >
            {locale === 'ko' ? t.nav.langEn : t.nav.langKo}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop Mega Panel */}
      {openMega && (
        <div className="absolute left-0 right-0 top-full z-50 hidden border-b border-border/70 bg-white shadow-[0_12px_24px_-6px_rgba(0,0,0,0.08)] lg:block">
          <div className="mx-auto max-w-[1280px] px-6 py-5">

          {openMega === 'company' && (
            <div className="flex gap-6">
              {[
                { icon: Building2, label: t.navSub.greeting, desc: locale === 'ko' ? '바노테크를 소개합니다' : 'About BANO', href: '/about' },
                { icon: History, label: t.navSub.history, desc: locale === 'ko' ? '1999년부터 이어온 여정' : 'Our journey since 1999', href: '/about/history' },
                { icon: MapPin, label: t.navSub.location, desc: locale === 'ko' ? '본사 및 공장 위치 안내' : 'Office & factory location', href: '/about/location' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-1 items-start gap-3 rounded-xl border border-transparent p-4 transition-all hover:border-brand/30 hover:bg-brand-light/60"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <item.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{item.label}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {openMega === 'products' && (
            <div className="grid grid-cols-[1fr_auto] gap-6">
              <div className="grid grid-cols-4 gap-4">
                {PRODUCT_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 border-b border-border pb-2 text-[13px] font-bold text-foreground">{group.title}</p>
                    <div className="space-y-1.5">
                      {group.items.map((item) => (
                        <Link key={item} href="/products" className="block rounded-md px-2 py-1.5 text-[12.5px] text-secondary transition-colors hover:bg-brand-light hover:text-brand">
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex w-[200px] flex-col justify-between rounded-xl bg-gradient-to-br from-brand-light to-brand-light/40 p-5">
                <div>
                  <p className="text-[13px] font-bold text-foreground">{t.nav.products}</p>
                  <p className="mt-1.5 text-[12px] leading-snug text-muted">{t.mega.productsDesc}</p>
                </div>
                <Link href="/products" className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:text-brand-dark">
                  {t.mega.viewAllProducts} <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}

          {openMega === 'download' && (
            <div className="flex gap-4">
              {[
                { icon: BookOpen, label: t.mega.catalog, desc: locale === 'ko' ? '제품 전체 카탈로그 PDF' : 'Full product catalog PDF', href: '/resources#catalog' },
                { icon: PenTool, label: t.mega.drawingManual, desc: locale === 'ko' ? 'CAD 도면 및 설치 설명서' : 'CAD drawings & manuals', href: '/resources#drawing' },
                { icon: ShieldCheck, label: t.mega.certificates, desc: locale === 'ko' ? 'KS 인증서, 시험성적서' : 'KS certificates & test reports', href: '/resources#certificate' },
                { icon: FileCheck, label: t.mega.approvalDocs, desc: locale === 'ko' ? '관급공사 승인서류' : 'Government project approvals', href: '/resources#approval' },
                { icon: FolderOpen, label: t.mega.otherResources, desc: locale === 'ko' ? '기타 참고 자료' : 'Other reference materials', href: '/resources#other' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-1 items-start gap-3 rounded-xl border border-transparent p-4 transition-all hover:border-brand/30 hover:bg-brand-light/60"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <item.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{item.label}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {openMega === 'contactUs' && (
            <div className="flex gap-4">
              {[
                { icon: Bell, label: t.mega.notices, desc: locale === 'ko' ? '공지사항 및 소식 확인' : 'Latest notices & news', href: '/support' },
                { icon: MessageSquare, label: t.mega.inquiry, desc: locale === 'ko' ? '제품·거래 문의 접수' : 'Submit product & business inquiry', href: '/support/inquiry' },
                { icon: Mail, label: t.mega.emailInquiry, desc: locale === 'ko' ? 'vanovano@naver.com' : 'vanovano@naver.com', href: 'mailto:vanovano@naver.com', external: true },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-1 items-start gap-3 rounded-xl border border-transparent p-4 transition-all hover:border-brand/30 hover:bg-brand-light/60"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <item.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{item.label}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface">
          <nav className="mx-auto max-w-[1280px] px-6 py-4">
            {TOP_MENUS.map((item) => (
              <div key={item.key} className="border-b border-border last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block rounded-md py-3 px-1 text-sm -mx-1',
                    pathname.startsWith(item.href)
                      ? 'bg-brand px-3 text-white font-semibold shadow-sm'
                      : 'text-secondary'
                  )}
                >
                  {item.label}
                </Link>
                <button
                  onClick={() => setMobileSection(mobileSection === item.key ? null : item.key)}
                  className="mb-2 w-full rounded-md border border-border px-3 py-2 text-left text-xs text-muted"
                >
                  {mobileSection === item.key ? (locale === 'ko' ? '닫기' : 'Close') : (locale === 'ko' ? '하위 메뉴 보기' : 'Show sub menu')}
                </button>
                {mobileSection === item.key && item.key === 'company' && (
                  <div className="pb-2 pl-4">
                    <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.navSub.greeting}</Link>
                    <Link href="/about/history" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.navSub.history}</Link>
                    <Link href="/about/location" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.navSub.location}</Link>
                  </div>
                )}
                {mobileSection === item.key && item.key === 'products' && (
                  <div className="pb-2 pl-4">
                    {PRODUCT_GROUPS.flatMap((group) => group.items).slice(0, 8).map((itemText) => (
                      <Link key={itemText} href="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">
                        {itemText}
                      </Link>
                    ))}
                  </div>
                )}
                {mobileSection === item.key && item.key === 'download' && (
                  <div className="pb-2 pl-4">
                    <Link href="/resources#catalog" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.catalog}</Link>
                    <Link href="/resources#drawing" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.drawingManual}</Link>
                    <Link href="/resources#certificate" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.certificates}</Link>
                    <Link href="/resources#approval" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.approvalDocs}</Link>
                    <Link href="/resources#other" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.otherResources}</Link>
                  </div>
                )}
                {mobileSection === item.key && item.key === 'contactUs' && (
                  <div className="pb-2 pl-4">
                    <Link href="/support" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.notices}</Link>
                    <Link href="/support/inquiry" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.inquiry}</Link>
                    <a href="mailto:vanovano@naver.com" className="block py-2 text-sm text-muted hover:text-foreground">{t.mega.emailInquiry}</a>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={async () => {
                setMobileOpen(false);
                await openEcatalogueFlipbook();
              }}
              disabled={ecatalogueLoading}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-brand px-3.5 py-2.5 text-[12px] font-semibold text-white shadow-sm hover:bg-brand-dark disabled:opacity-60"
            >
              <BookOpen size={14} />
              {ecatalogueLoading ? '…' : t.nav.ecatalogue}
            </button>
          </nav>
        </div>
      )}

      {catalogPdfUrl && (
        <PdfFlipbook url={catalogPdfUrl} onClose={() => setCatalogPdfUrl(null)} />
      )}
    </header>
  );
}
