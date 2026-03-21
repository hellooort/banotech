'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useI18n } from '@/lib/i18n/context';
import { getCategoryName } from '@/lib/i18n/helpers';
import type { Category, Product } from '@/types/database';

interface HomeContentProps {
  categories: Category[];
  recentProducts: Product[];
  catSlugMap: Record<string, string>;
}

const DEFAULT_CATEGORIES: { name: string; name_en: string }[] = [
  { name: '수건걸이', name_en: 'Towel Rack' },
  { name: '휴지걸이[노출형]', name_en: 'Paper Holder [Wall]' },
  { name: '컵대/비누대', name_en: 'Tumbler/Soap Dish' },
  { name: '옷걸이', name_en: 'Robe Hook' },
  { name: '선반', name_en: 'Shelves' },
  { name: '면도경', name_en: 'Mirror' },
  { name: '청소솔', name_en: 'Brush' },
  { name: '편의품', name_en: 'Utility' },
  { name: '기타', name_en: 'Others' },
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
    <section className="mt-14">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-muted mb-2">{t.home.newArrivalsLabel}</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.home.newArrivals}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition-colors hover:border-foreground hover:text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition-colors hover:border-foreground hover:text-foreground"
            >
              <ChevronRight size={18} />
            </button>
            <Link href="/products" className="ml-2 flex items-center gap-1 text-sm tracking-wider text-foreground uppercase transition-colors hover:text-secondary">
              {t.home.viewAll} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-5">
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
      </div>
    </section>
  );
}

const BANNER_IMAGES = [
  '/images/1.png',
  '/images/2.png',
  '/images/3.png',
  '/images/4.png',
  '/images/5.png',
  '/images/6.png',
];

export default function HomeContent({ categories, recentProducts, catSlugMap }: HomeContentProps) {
  const { locale, t } = useI18n();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 배너 이미지 전부 미리 로드 (6→1 전환 시 디코딩 지연으로 흰 화면 나오는 것 방지)
  useEffect(() => {
    BANNER_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const topCategories = categories.filter(c => !c.parent_id);
  const catList = topCategories.length > 0
    ? topCategories
    : DEFAULT_CATEGORIES.map((c, i) => ({
        id: String(i), parent_id: null, name: c.name, name_en: c.name_en, slug: c.name, icon_url: null, sort_order: i, created_at: '',
      }));

  const categoryMid = Math.ceil(catList.length / 2);
  const categoryRow1 = catList.slice(0, categoryMid);
  const categoryRow2 = catList.slice(categoryMid);

  return (
    <>
      {/* Hero — two-tone: brand color left + product image right */}
      <section className="relative">
        <div className="relative min-h-[560px] overflow-hidden md:min-h-[600px]">
          {/* Left half — brand color */}
          <div className="absolute inset-0 bg-[#f59e02]" />
          {/* Right half — white for product image */}
          <div className="absolute right-0 top-0 bottom-0 hidden w-1/2 bg-white md:block" />

          {/* Right half — 화면 오른쪽 50% 전체에 꽉 차게 (max-width 밖으로 분리) + 살짝 확대 크롭 */}
          <div className="absolute right-0 top-0 bottom-0 z-[5] hidden w-1/2 overflow-hidden md:block">
            {BANNER_IMAGES.map((src, index) => {
              const active = index === currentImageIndex;
              return (
              <Image
                key={src}
                src={src}
                alt={`VANO Product ${index + 1}`}
                fill
                sizes="50vw"
                className={`object-cover object-center origin-center scale-[1.15] transition-opacity duration-700 ${
                  active ? 'z-10 opacity-100' : 'z-0 opacity-0'
                }`}
                priority={index === 0}
                loading="eager"
              />
              );
            })}
          </div>

          <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1280px] items-center px-6 md:min-h-[600px]">
            {/* Left — text on brand color (right column is only images above, full half-vw) */}
            <div className="w-full max-w-xl py-20 md:max-w-[min(100%,36rem)] md:pr-8">
              <Image
                src="/logo.png"
                alt="VANO"
                width={300}
                height={90}
                className="object-contain brightness-0 invert md:w-[340px]"
                priority
              />
              <p className="mt-8 max-w-lg whitespace-pre-line text-xl leading-relaxed text-white/90 font-medium">
                {t.hero.description}
              </p>
              <Link
                href="/products"
                className="mt-12 inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-base tracking-wider text-[#f59e02] uppercase font-bold transition-all hover:-translate-y-0.5 hover:bg-white/90 shadow-lg"
              >
                {t.hero.cta}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Category bar — 2 balanced rows (split by count, not by width) */}
        <div className="relative z-20 mx-auto -mt-7 max-w-[1280px] px-6">
          <div className="rounded-2xl border border-border/70 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.05)] px-3 py-3">
            <div className="flex flex-col items-stretch gap-2">
              {[categoryRow1, categoryRow2].filter((row) => row.length > 0).map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1"
                >
                  {row.map((cat) => (
                    <Link
                      key={cat.id}
                      href={topCategories.length > 0 ? `/products/${cat.slug}` : '/products'}
                      className="group rounded-full px-4 py-2 transition-colors hover:bg-brand-light"
                    >
                      <span className="text-sm text-foreground group-hover:text-brand font-medium transition-colors whitespace-nowrap">
                        {getCategoryName(cat as Category, locale)}
                      </span>
                    </Link>
                  ))}
                </div>
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

    </>
  );
}
