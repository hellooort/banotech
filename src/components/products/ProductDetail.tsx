'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Download, FileText, FileImage, FileCode } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { getProductName, getProductDescription } from '@/lib/i18n/helpers';
import type { Product, ProductImage as ProductImageType, Document as DocType } from '@/types/database';

const PdfFlipbook = dynamic(() => import('@/components/pdf/PdfFlipbook'), { ssr: false });

interface ProductDetailProps {
  product: Product;
  images: ProductImageType[];
  documents: DocType[];
  categorySlug: string;
}

const SPEC_FIELDS = [
  { key: 'model_number', label: '품 번', label_en: 'Model No.' },
  { key: 'product_name', label: '품 명', label_en: 'Product' },
  { key: 'finish_color', label: '마감색상', label_en: 'Finish' },
  { key: 'size', label: '사이즈', label_en: 'Size' },
  { key: 'brand', label: '브랜드', label_en: 'Brand' },
  { key: 'manufacturer', label: '제조사', label_en: 'Manufacturer' },
] as const;

export default function ProductDetail({ product, images, documents, categorySlug }: ProductDetailProps) {
  const { locale, t } = useI18n();
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);

  const displayName = getProductName(product, locale);
  const displayDesc = getProductDescription(product, locale);
  const specs = product.specs ?? {};

  const getSpecValue = (key: string) => {
    if (locale === 'en' && specs[`${key}_en`]) return specs[`${key}_en`];
    return specs[key] || '';
  };

  const hasModelFallback = !specs['model_number'] && product.model_name;
  const hasNameFallback = !specs['product_name'] && product.name;

  const getDisplaySpec = (key: string) => {
    const val = getSpecValue(key);
    if (val) return val;
    if (key === 'model_number' && hasModelFallback) return product.model_name!;
    if (key === 'product_name' && hasNameFallback) {
      return locale === 'en' && product.name_en ? product.name_en : product.name;
    }
    return '';
  };

  const hasAnySpec = SPEC_FIELDS.some(f => getDisplaySpec(f.key));

  const drawings = [
    { label: 'IMG', displayLabel: locale === 'en' ? 'Image' : '이미지', icon: FileImage, url: product.drawing_img_url },
    { label: 'PDF', displayLabel: 'PDF', icon: FileText, url: product.drawing_pdf_url },
    { label: 'DWG', displayLabel: 'DWG', icon: FileCode, url: product.drawing_dwg_url },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1px_3fr] lg:gap-0">
        {/* Images */}
        <div className="lg:pr-10 pt-2">
          <Link
            href={`/products/${categorySlug}`}
            className="mb-6 inline-flex items-center gap-1 text-[15px] text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> {t.products.backToList}
          </Link>
          <div className="relative aspect-square overflow-hidden border border-border bg-background">
            {product.thumbnail_url ? (
              <Image
                src={product.thumbnail_url}
                alt={displayName}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted text-sm">
                No Image
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden border border-border bg-background">
                  <Image src={img.image_url} alt="" fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block bg-border" />

        {/* Info */}
        <div className="lg:pl-10 pt-2 lg:pt-[2.5rem] flex flex-col">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {product.model_name || displayName}
            </h1>

            {/* Spec Table */}
            {hasAnySpec && (
              <table className="mt-8 text-base">
                <tbody>
                  {SPEC_FIELDS.map((field) => {
                    const val = getDisplaySpec(field.key);
                    if (!val) return null;
                    return (
                      <tr key={field.key}>
                        <td className="whitespace-nowrap py-2 pr-6 text-[15px] font-semibold text-foreground/70">
                          {locale === 'en' ? field.label_en : (
                            <span className="inline-flex w-[4em] justify-between">
                              {field.label.split('').map((ch, i) => <span key={i}>{ch}</span>)}
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-[16px] font-medium text-foreground">{val}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Drawing Downloads */}
          <div className="mt-auto grid grid-cols-3 gap-0">
            {drawings.map((d) => {
              const downloadUrl = d.url ? (d.url.includes('supabase') ? `${d.url}?download=` : d.url) : '#';
              return (
                <a
                  key={d.label}
                  href={downloadUrl}
                  {...(d.url && !d.url.includes('supabase') ? { download: true } : {})}
                  onClick={d.url ? undefined : (e) => e.preventDefault()}
                  className="group flex flex-col items-center justify-center border border-r-0 last:border-r border-black px-4 py-4 transition-all hover:bg-brand hover:border-brand"
                >
                  <span className="text-[17px] font-bold text-black group-hover:text-white">{d.displayLabel}</span>
                  <span className="mt-1 text-[13px] text-black/60 group-hover:text-white/80">[DOWNLOAD]</span>
                </a>
              );
            })}
          </div>

          {/* PDF Flipbook Viewer Modal */}
          {pdfViewerUrl && (
            <Suspense fallback={null}>
              <PdfFlipbook url={pdfViewerUrl} onClose={() => setPdfViewerUrl(null)} />
            </Suspense>
          )}

          {/* Other Documents */}
          {documents.length > 0 && (
            <div className="mt-8">
              <div className="h-px bg-border mb-4" />
              <h2 className="text-base font-medium text-foreground mb-3">{t.products.relatedDocs}</h2>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border px-4 py-3 text-[15px] text-secondary hover:text-foreground hover:border-brand transition-colors"
                  >
                    <Download size={16} className="text-muted" />
                    {doc.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
