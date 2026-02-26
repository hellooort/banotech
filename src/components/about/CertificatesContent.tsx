'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import type { Certificate } from '@/types/database';

interface Props {
  certificates: Certificate[];
}

export default function CertificatesContent({ certificates }: Props) {
  const { locale } = useI18n();

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-8">
        {locale === 'ko' ? '인증서' : 'Certificates'}
      </h2>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="border border-border bg-surface">
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                <Image
                  src={cert.image_url}
                  alt={cert.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-sm font-medium text-foreground">
                  {locale === 'ko' ? cert.name : (cert.name_en || cert.name)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          {locale === 'ko' ? '등록된 인증서가 없습니다.' : 'No certificates registered.'}
        </p>
      )}
    </div>
  );
}
