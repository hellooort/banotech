'use client';

import { useI18n } from '@/lib/i18n/context';

export interface LocationInfo {
  address?: string;
  address_en?: string;
  phone?: string;
  phone_en?: string;
  fax?: string;
  fax_en?: string;
  email?: string;
  map_embed_url?: string;
}

interface Props {
  info: LocationInfo;
}

const FALLBACK = {
  ko: {
    address: '경기도 남양주시 진접읍 금강로 1881-37',
    phone: '031-529-1224',
    fax: '031-529-1225',
    email: 'vanovano@naver.com',
  },
  en: {
    address: '#1881-37 Geumgang-ro, Jinjeop-eup, Namyangju-si, Gyeonggi-do Republic of Korea',
    phone: '+82-31-529-1224',
    fax: '+82-31-529-1225',
    email: 'vanovano@naver.com',
  },
} as const;

export default function LocationContent({ info }: Props) {
  const { locale } = useI18n();

  const labels = locale === 'ko'
    ? { title: '오시는 길', address: '주소', phone: '전화', fax: '팩스', email: '이메일', mapPlaceholder: '지도 영역' }
    : { title: 'Location', address: 'Address', phone: 'TEL.', fax: 'FAX.', email: 'E-mail', mapPlaceholder: 'Map area' };

  const fb = FALLBACK[locale];
  const address = locale === 'en' ? (info.address_en || fb.address) : (info.address || fb.address);
  const phone = locale === 'en' ? (info.phone_en || fb.phone) : (info.phone || fb.phone);
  const fax = locale === 'en' ? (info.fax_en || fb.fax) : (info.fax || fb.fax);
  const email = info.email || fb.email;

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-8">{labels.title}</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden border border-border bg-background">
          {info.map_embed_url ? (
            <iframe
              src={info.map_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              {labels.mapPlaceholder}
            </div>
          )}
        </div>

        <div>
          <table className="w-full text-base">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium w-20">{labels.address}</td>
                <td className="py-3 text-foreground">{address}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium">{labels.phone}</td>
                <td className="py-3 text-foreground">{phone}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium">{labels.fax}</td>
                <td className="py-3 text-foreground">{fax}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium">{labels.email}</td>
                <td className="py-3 text-foreground">{email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
