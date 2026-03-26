'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

const IMAGES = [
  '/images/국내생산라인_1.jpg',
  '/images/국내생산라인_2.jpg',
  '/images/국내생산라인_3.jpg',
];

export default function ProductionLinePage() {
  const { locale } = useI18n();

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        {locale === 'ko' ? '국내생산라인' : 'Production Line'}
      </h2>

      <div className="space-y-6">
        {IMAGES.map((src, i) => (
          <div key={i} className="relative w-full overflow-hidden border border-border bg-background">
            <Image
              src={src}
              alt={`${locale === 'ko' ? '국내생산라인' : 'Production Line'} ${i + 1}`}
              width={1200}
              height={675}
              className="w-full h-auto object-contain"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
