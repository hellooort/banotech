'use client';

import { useI18n } from '@/lib/i18n/context';

interface HistoryEvent {
  month: string;
  ko: string;
  en: string;
}

interface HistoryYear {
  year: string;
  events: HistoryEvent[];
}

const HISTORY_DATA: HistoryYear[] = [
  {
    year: '2026',
    events: [
      { month: '06', ko: '롯데호텔[명동] 납품', en: 'Supplied to Lotte Hotel [Myeongdong]' },
    ],
  },
  {
    year: '2025',
    events: [
      { month: '11', ko: '서울 파르나스_WESTIN SEOUL HOTEL 납품', en: 'Supplied to Parnas_WESTIN SEOUL HOTEL' },
    ],
  },
  {
    year: '2021',
    events: [
      { month: '03', ko: '롯데호텔[잠실] 납품', en: 'Supplied to Lotte Hotel [Jamsil]' },
    ],
  },
  {
    year: '2020',
    events: [
      { month: '11', ko: '그랜드 인터컨티넨탈_서울 파르나스호텔 납품', en: 'Supplied to Grand InterContinental_Seoul Parnas Hotel' },
    ],
  },
  {
    year: '2015',
    events: [
      { month: '01', ko: 'Shilla Stay Hotel 국내 15개현장 납품', en: 'Supplied to 15 Shilla Stay Hotel locations in Korea' },
    ],
  },
  {
    year: '2014',
    events: [
      { month: '11', ko: 'Vietnam Hanoi 수출', en: 'Export to Vietnam Hanoi' },
      { month: '07', ko: '한화건설 [Iraq 비즈마야 신도시 100,000세대 PROJECT 수주]', en: 'Hanwha E&C [Iraq Bismayah New City 100,000-unit PROJECT contract]' },
    ],
  },
  {
    year: '2013',
    events: [
      { month: '10', ko: '공장사옥 신축 및 이전 [남양주 진접]', en: 'New factory & headquarters construction and relocation [Jinjeop, Namyangju]' },
    ],
  },
  {
    year: '2010',
    events: [
      { month: '01', ko: 'KS인증획득 [수건걸이, 휴지걸이]', en: 'KS certification acquired [Towel rack, Paper holder]' },
    ],
  },
  {
    year: '2009',
    events: [
      { month: '10', ko: '중동지역(Jordan) 수출', en: 'Export to Middle East (Jordan)' },
    ],
  },
  {
    year: '2008',
    events: [
      { month: '09', ko: 'ISO 9001 : 2008 인증획득', en: 'ISO 9001:2008 certification acquired' },
      { month: '08', ko: '경기 남양주로 공장확장 이전 [남양주 진건]', en: 'Factory expansion & relocation to Namyangju [Jingeon]' },
    ],
  },
  {
    year: '2003',
    events: [
      { month: '10', ko: '욕실액세사리 공장등록', en: 'Bathroom accessories factory registration' },
      { month: '05', ko: '[주]바노테크 법인전환', en: 'Incorporated as Vano Tech Co., Ltd.' },
    ],
  },
  {
    year: '2000',
    events: [
      { month: '09', ko: "바노 회사설립 및 'vano' 브랜드 런칭 [서울 군자동]", en: "Founded BANO & launched 'vano' brand [Gunja-dong, Seoul]" },
    ],
  },
  {
    year: '1999',
    events: [
      { month: '05', ko: '욕실액세사리 디자인 개발 착수', en: 'Initiated bathroom accessories design & development' },
    ],
  },
];

export default function HistoryPage() {
  const { locale, t } = useI18n();

  const slogan = locale === 'ko'
    ? "독창이고 창의적인 디자인으로\n[주]바노테크는 HIGHEND제품을 만듭니다."
    : "With original and creative design,\nVano Tech creates HIGHEND products.";

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-foreground">
        {locale === 'ko' ? '회사 연혁' : 'Company History'}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-secondary whitespace-pre-line">{slogan}</p>

      <div className="mt-10 relative">
        {/* Timeline line */}
        <div className="absolute left-[60px] top-0 bottom-0 w-px bg-border" />

        {HISTORY_DATA.map((item) => (
          <div key={item.year} className="relative flex mb-8 last:mb-0">
            {/* Year */}
            <div className="w-[60px] flex-shrink-0 pt-0.5">
              <span className="text-lg font-bold text-brand">{item.year}</span>
            </div>

            {/* Dot */}
            <div className="absolute left-[56px] top-[10px] h-2.5 w-2.5 rounded-full border-2 border-brand bg-surface z-10" />

            {/* Events */}
            <div className="pl-8 pt-0.5 space-y-1.5">
              {item.events.map((event, i) => (
                <p key={i} className="text-sm text-secondary">
                  <span className="text-muted mr-1.5">{event.month}.</span>
                  {locale === 'ko' ? event.ko : event.en}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
