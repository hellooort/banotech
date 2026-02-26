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
    year: '2021',
    events: [
      { month: '03', ko: '롯데호텔 월드 납품', en: 'Supplied to Lotte Hotel World' },
    ],
  },
  {
    year: '2020',
    events: [
      { month: '11', ko: '그랜드 인터컨티넨탈 서울 파르나스 납품', en: 'Supplied to Grand InterContinental Seoul Parnas' },
    ],
  },
  {
    year: '2019',
    events: [
      { month: '03', ko: '그랜드 하얏트 서울 납품', en: 'Supplied to Grand Hyatt Seoul' },
    ],
  },
  {
    year: '2015',
    events: [
      { month: '01', ko: 'Shilla Hotel, Shilla Stay 비지니스호텔 납품', en: 'Supplied to Shilla Hotel & Shilla Stay Business Hotel' },
    ],
  },
  {
    year: '2014',
    events: [
      { month: '07', ko: '한화건설(해외 신도시 PROJECT), 이라크(Iraq) 100,000세대 PROJECT 수주', en: 'Hanwha E&C overseas new city project, Iraq 100,000-unit project contract' },
      { month: '11', ko: '베트남(Hanoi) 수출', en: 'Export to Vietnam (Hanoi)' },
    ],
  },
  {
    year: '2013',
    events: [
      { month: '10', ko: '사옥 신축 및 이전 (남양주 진접)', en: 'New headquarters construction & relocation (Jinjeop, Namyangju)' },
    ],
  },
  {
    year: '2010',
    events: [
      { month: '01', ko: 'KS 인증획득 (수건걸이, 휴지걸이)', en: 'KS certification acquired (Towel rack, Paper holder)' },
      { month: '06', ko: '요르단 2차 수출', en: '2nd export to Jordan' },
    ],
  },
  {
    year: '2009',
    events: [
      { month: '10', ko: '중동지역(요르단) 수출', en: 'Export to Middle East (Jordan)' },
    ],
  },
  {
    year: '2008',
    events: [
      { month: '08', ko: '남양주로 공장 확장 이전', en: 'Factory expansion & relocation to Namyangju' },
      { month: '09', ko: 'ISO 9001 : 2008 인증획득', en: 'ISO 9001:2008 certification acquired' },
    ],
  },
  {
    year: '2003',
    events: [
      { month: '05', ko: '(주)바노테크 법인전환', en: 'Incorporated as Vano Tech Co., Ltd.' },
      { month: '05', ko: '욕실 액세서리 공장등록', en: 'Bathroom accessories factory registration' },
    ],
  },
  {
    year: '2000',
    events: [
      { month: '09', ko: "서울 군자동 'vano' 회사 설립", en: "Founded 'vano' in Gunja-dong, Seoul" },
    ],
  },
  {
    year: '1999',
    events: [
      { month: '05', ko: '욕실 액세서리 디자인 개발', en: 'Bathroom accessories design & development' },
    ],
  },
];

export default function HistoryPage() {
  const { locale, t } = useI18n();

  const slogan = locale === 'ko'
    ? "끊임없이 변화하는 기업, 창의적인 기업, 소통하는 기업\n'㈜바노테크'가 미래를 만들어 나아가겠습니다."
    : "A company that constantly evolves, innovates, and communicates.\nVano Tech Co., Ltd. will shape the future.";

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
