'use client';

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, FileImage, FileCode, BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { getProductName, getProductDescription } from '@/lib/i18n/helpers';
import type { Product, ProductImage as ProductImageType, Document as DocType } from '@/types/database';

const PdfFlipbook = lazy(() => import('@/components/pdf/PdfFlipbook'));

interface ProductDetailProps {
  product: Product;
  images: ProductImageType[];
  documents: DocType[];
  categorySlug: string;
}

export default function ProductDetail({ product, images, documents, categorySlug }: ProductDetailProps) {
  const { locale, t } = useI18n();
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);

  const displayName = getProductName(product, locale);
  const displayDesc = getProductDescription(product, locale);
  const specs = product.specs ?? {};

  const drawings = [
    { label: 'PDF', icon: FileText, url: product.drawing_pdf_url, color: 'text-red-500' },
    { label: 'DWG', icon: FileCode, url: product.drawing_dwg_url, color: 'text-blue-500' },
    { label: 'IMG', icon: FileImage, url: product.drawing_img_url, color: 'text-green-600' },
  ].filter((d) => d.url);

  return (
    <div>
      <Link
        href={`/products/${categorySlug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} /> {t.products.backToList}
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
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

        {/* Info */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">{displayName}</h1>
          {product.model_name && (
            <p className="mt-1 text-sm text-muted">{product.model_name}</p>
          )}

          {displayDesc && (
            <p className="mt-4 text-sm leading-relaxed text-secondary">
              {displayDesc}
            </p>
          )}

          {/* Specs */}
          {Object.keys(specs).length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-foreground mb-3">{t.products.productInfo}</h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specs).map(([key, value]) => (
                    <tr key={key} className="border-b border-border">
                      <td className="py-2.5 pr-4 text-muted w-32">{key}</td>
                      <td className="py-2.5 text-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Drawing Downloads */}
          {drawings.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-foreground mb-3">{t.products.drawingDownload}</h2>
              <div className="grid grid-cols-3 gap-3">
                {drawings.map((d) => {
                  const Icon = d.icon;
                  const isPdf = d.label === 'PDF';
                  return (
                    <div key={d.label} className="flex flex-col border border-border bg-background transition-all hover:border-brand/40 hover:shadow-sm">
                      {isPdf ? (
                        <button
                          onClick={() => setPdfViewerUrl(d.url!)}
                          className="group flex flex-col items-center gap-2 px-4 pt-5 pb-3 cursor-pointer"
                        >
                          <Icon size={24} className={d.color} />
                          <span className="text-xs font-semibold text-foreground tracking-wide">{d.label}</span>
                          <span className="text-[10px] text-brand group-hover:text-brand-dark transition-colors flex items-center gap-1">
                            <BookOpen size={10} /> {locale === 'ko' ? '뷰어로 보기' : 'View'}
                          </span>
                        </button>
                      ) : (
                        <a
                          href={d.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col items-center gap-2 px-4 pt-5 pb-3"
                        >
                          <Icon size={24} className={d.color} />
                          <span className="text-xs font-semibold text-foreground tracking-wide">{d.label}</span>
                          <span className="text-[10px] text-muted group-hover:text-foreground transition-colors flex items-center gap-1">
                            <Download size={10} /> {t.products.download}
                          </span>
                        </a>
                      )}
                      {isPdf && (
                        <a
                          href={d.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-t border-border text-[10px] text-muted hover:text-foreground py-1.5 text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <Download size={9} /> {t.products.download}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PDF Flipbook Viewer Modal */}
          {pdfViewerUrl && (
            <Suspense fallback={null}>
              <PdfFlipbook url={pdfViewerUrl} onClose={() => setPdfViewerUrl(null)} />
            </Suspense>
          )}

          {/* Other Documents */}
          {documents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-foreground mb-3">{t.products.relatedDocs}</h2>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm text-secondary hover:text-foreground hover:border-brand transition-colors"
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
