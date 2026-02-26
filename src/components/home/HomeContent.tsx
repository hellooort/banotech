'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Factory, Handshake, ShieldCheck } from 'lucide-react';
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
      {/* Hero + Category Bar overlay */}
      <section className="relative">
        <div className="relative flex h-[70vh] min-h-[520px] items-center justify-center bg-accent overflow-hidden pb-12">
          <Image
            src="/main_banner.png"
            alt="메인 배너"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          <div className="relative z-10 text-center px-6">
            <p className="text-sm tracking-[0.3em] uppercase text-white/80 mb-4">
              {t.hero.subtitle}
            </p>
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="BANO"
                width={200}
                height={68}
                className="object-contain brightness-0 invert md:w-[260px]"
                priority
              />
            </div>
            <p className="mt-5 text-base tracking-wide text-white max-w-lg mx-auto leading-relaxed whitespace-pre-line">
              {t.hero.description}
            </p>
            <Link
              href="/products"
              className="mt-10 inline-flex items-center gap-2.5 bg-brand px-8 py-3.5 text-sm tracking-wider uppercase text-white font-medium transition-all hover:bg-brand-dark"
            >
              {t.hero.cta}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-[1280px] px-6 -mt-14">
          <div className="bg-surface border border-border shadow-lg">
            <div className="flex items-center justify-center overflow-x-auto scrollbar-hide">
              {catList.map((cat) => (
                <Link
                  key={cat.id}
                  href={topCategories.length > 0 ? `/products/${cat.slug}` : '/products'}
                  className="group shrink-0 px-5 py-4 transition-colors hover:bg-hover hover:text-brand md:px-6"
                >
                  <span className="text-sm text-secondary group-hover:text-brand transition-colors whitespace-nowrap">
                    {getCategoryName(cat as Category, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="mt-16">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-brand mb-2">{t.home.newArrivalsLabel}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.home.newArrivals}</h2>
            </div>
            <Link href="/products" className="text-sm text-brand hover:text-brand-dark transition-colors flex items-center gap-1 tracking-wider uppercase">
              {t.home.viewAll} <ArrowRight size={14} />
            </Link>
          </div>

          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {recentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categorySlug={catSlugMap[product.category_id] ?? ''}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="border border-border bg-surface">
                  <div className="aspect-square bg-background" />
                  <div className="p-3">
                    <div className="h-3.5 w-24 bg-border" />
                    <div className="mt-1.5 h-3 w-16 bg-border" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Company Stats */}
      <section className="bg-accent">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-brand/30">
                <Factory size={22} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-white tracking-tight">25<span className="text-xl">+</span></p>
              <p className="mt-1.5 text-sm tracking-wider text-white/40 uppercase">{t.stats.yearsLabel}</p>
              <p className="mt-0.5 text-sm text-white/60">{t.stats.years}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-brand/30">
                <ShieldCheck size={22} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-white tracking-tight">100<span className="text-xl">%</span></p>
              <p className="mt-1.5 text-sm tracking-wider text-white/40 uppercase">{t.stats.koreaLabel}</p>
              <p className="mt-0.5 text-sm text-white/60">{t.stats.korea}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-brand/30">
                <Award size={22} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-white tracking-tight">R&D</p>
              <p className="mt-1.5 text-sm tracking-wider text-white/40 uppercase">{t.stats.rdLabel}</p>
              <p className="mt-0.5 text-sm text-white/60">{t.stats.rd}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-brand/30">
                <Handshake size={22} className="text-brand" />
              </div>
              <p className="text-4xl font-light text-white tracking-tight">B2B</p>
              <p className="mt-1.5 text-sm tracking-wider text-white/40 uppercase">{t.stats.b2bLabel}</p>
              <p className="mt-0.5 text-sm text-white/60">{t.stats.b2b}</p>
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
