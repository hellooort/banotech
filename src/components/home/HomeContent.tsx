'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Factory, Handshake, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { formatDate } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/context';
import { getCategoryName } from '@/lib/i18n/helpers';
import type { Category, Product, Notice } from '@/types/database';

interface HomeContentProps {
  categories: Category[];
  recentProducts: Product[];
  notices: Notice[];
  catSlugMap: Record<string, string>;
}

const DEFAULT_CATEGORIES: { name: string; name_en: string }[] = [
  { name: '수건걸이', name_en: 'Towel Rack' },
  { name: '휴지걸이', name_en: 'Paper Holder' },
  { name: '컵대 / 비누대', name_en: 'Tumbler / Soap Dish' },
  { name: '선반', name_en: 'Shelves' },
  { name: '옷걸이', name_en: 'Robe Hook' },
  { name: '욕실 액세서리', name_en: 'Accessories' },
  { name: '편의 / 공공 제품', name_en: 'Utility & Public' },
  { name: 'NEW PRODUCTS', name_en: 'New Products' },
];

function ProductCarousel({
  products,
  catSlugMap,
  t,
}: {
  products: Product[];
  catSlugMap: Record<string, string>;
  t: ReturnType<typeof useI18n>['t'];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || products.length === 0) return;

    let raf: number;
    let speed = 0.5;

    function step() {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, products.length]);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  const displayProducts = products.length > 0 ? [...products, ...products] : [];

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-brand mb-2">{t.home.newArrivalsLabel}</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.home.newArrivals}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-brand hover:text-brand transition-colors bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-brand hover:text-brand transition-colors bg-white"
            >
              <ChevronRight size={18} />
            </button>
            <Link href="/products" className="ml-2 text-sm text-brand hover:text-brand-dark transition-colors flex items-center gap-1 tracking-wider uppercase">
              {t.home.viewAll} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {displayProducts.length > 0 ? (
            displayProducts.map((product, i) => (
              <div key={`${product.id}-${i}`} className="w-[260px] shrink-0">
                <ProductCard
                  product={product}
                  categorySlug={catSlugMap[product.category_id] ?? ''}
                />
              </div>
            ))
          ) : (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-[260px] shrink-0 border border-border bg-surface rounded-lg">
                <div className="aspect-square bg-background rounded-t-lg" />
                <div className="p-3">
                  <div className="h-3.5 w-24 bg-border rounded" />
                  <div className="mt-1.5 h-3 w-16 bg-border rounded" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomeContent({ categories, recentProducts, notices, catSlugMap }: HomeContentProps) {
  const { locale, t } = useI18n();

  const topCategories = categories.filter(c => !c.parent_id);
  const catList = topCategories.length > 0
    ? topCategories
    : DEFAULT_CATEGORIES.map((c, i) => ({
        id: String(i), parent_id: null, name: c.name, name_en: c.name_en, slug: c.name, icon_url: null, sort_order: i, created_at: '',
      }));

  return (
    <>
      {/* Hero — two-tone: warm grey left + product image right */}
      <section className="relative">
        <div className="relative min-h-[560px] md:min-h-[600px] overflow-hidden">
          {/* Two-tone background */}
          <div className="absolute inset-0 bg-[#f5f0eb]" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#e8e2db] hidden md:block" />

          <div className="relative z-10 mx-auto flex max-w-[1280px] items-center min-h-[560px] md:min-h-[600px] px-6">
            {/* Left — text */}
            <div className="w-full md:w-1/2 py-20 md:pr-12">
              <p className="text-xs tracking-[0.3em] uppercase text-brand font-medium mb-5">
                {t.hero.subtitle}
              </p>
              <Image
                src="/logo_black.png"
                alt="BANO"
                width={180}
                height={60}
                className="object-contain md:w-[220px]"
                priority
              />
              <p className="mt-6 text-base leading-relaxed text-[#555] max-w-md whitespace-pre-line">
                {t.hero.description}
              </p>
              <Link
                href="/products"
                className="mt-10 inline-flex items-center gap-2.5 bg-[#333] px-8 py-3.5 text-sm tracking-wider uppercase text-white font-medium transition-all hover:bg-brand"
              >
                {t.hero.cta}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right — product image */}
            <div className="hidden md:block w-1/2 relative min-h-[500px]">
              <Image
                src="/main_banner.png"
                alt="BANO Products"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </div>
        </div>

        {/* Category bar */}
        <div className="relative z-20 mx-auto max-w-[1280px] px-6 -mt-7">
          <div className="bg-white border border-border/60 shadow-md rounded-sm">
            <div className="flex items-center justify-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {catList.map((cat) => (
                <Link
                  key={cat.id}
                  href={topCategories.length > 0 ? `/products/${cat.slug}` : '/products'}
                  className="group shrink-0 px-5 py-3.5 transition-colors hover:bg-brand-light md:px-6"
                >
                  <span className="text-sm text-[#666] group-hover:text-brand font-medium transition-colors whitespace-nowrap">
                    {getCategoryName(cat as Category, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Products — infinite carousel */}
      <ProductCarousel
        products={recentProducts}
        catSlugMap={catSlugMap}
        t={t}
      />

      {/* Company Stats */}
      <section className="bg-brand-light/50 border-y border-brand/10">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-brand/20">
                <Factory size={24} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-foreground tracking-tight">25<span className="text-xl">+</span></p>
              <p className="mt-1.5 text-xs tracking-wider text-brand uppercase font-medium">{t.stats.yearsLabel}</p>
              <p className="mt-0.5 text-sm text-secondary">{t.stats.years}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-brand/20">
                <ShieldCheck size={24} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-foreground tracking-tight">100<span className="text-xl">%</span></p>
              <p className="mt-1.5 text-xs tracking-wider text-brand uppercase font-medium">{t.stats.koreaLabel}</p>
              <p className="mt-0.5 text-sm text-secondary">{t.stats.korea}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-brand/20">
                <Award size={24} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-foreground tracking-tight">R&D</p>
              <p className="mt-1.5 text-xs tracking-wider text-brand uppercase font-medium">{t.stats.rdLabel}</p>
              <p className="mt-0.5 text-sm text-secondary">{t.stats.rd}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-brand/20">
                <Handshake size={24} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-foreground tracking-tight">TRUST</p>
              <p className="mt-1.5 text-xs tracking-wider text-brand uppercase font-medium">{t.stats.b2bLabel}</p>
              <p className="mt-0.5 text-sm text-secondary">{t.stats.b2b}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="bg-surface border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-brand mb-2">{t.home.noticeLabel}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.home.notice}</h2>
            </div>
            <Link href="/support" className="text-sm text-brand hover:text-brand-dark transition-colors flex items-center gap-1 tracking-wider uppercase">
              {t.home.viewAll} <ArrowRight size={14} />
            </Link>
          </div>

          {notices.length > 0 ? (
            <div className="divide-y divide-border border-t border-b border-border">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/support/${notice.id}`}
                  className="flex items-center gap-4 py-4 px-1 hover:bg-hover transition-colors"
                >
                  {notice.is_pinned && (
                    <span className="shrink-0 text-xs font-semibold text-brand border border-brand px-2 py-0.5 uppercase tracking-wide">
                      {t.home.pinned}
                    </span>
                  )}
                  <span className="flex-1 text-base text-foreground truncate">{notice.title}</span>
                  <span className="shrink-0 text-sm text-muted">{formatDate(notice.created_at)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border border-t border-b border-border">
              {[t.common.siteOpenNotice, t.common.catalogUpdate, t.common.holidayNotice].map((title, i) => (
                <div key={i} className="flex items-center gap-4 py-4 px-1">
                  {i === 0 && (
                    <span className="shrink-0 text-xs font-semibold text-brand border border-brand px-2 py-0.5 uppercase tracking-wide">
                      {t.home.pinned}
                    </span>
                  )}
                  <span className="flex-1 text-base text-foreground truncate">{title}</span>
                  <span className="shrink-0 text-sm text-muted">2026.02.25</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
