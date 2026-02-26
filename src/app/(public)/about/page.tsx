'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

function GreetingKo() {
  return (
    <div className="max-w-3xl">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground leading-snug">
          끊임없이 변화하는 기업, 창의적인 기업,
          <br />
          소통하는 기업
        </h2>
        <p className="mt-3 text-lg text-secondary">
          <span className="text-brand font-medium">&lsquo; (주)바노테크 &rsquo;</span>가 미래를 만들어 나아가겠습니다.
        </p>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10 space-y-6 text-base leading-[1.9] text-secondary">
        <p>당사 홈페이지를 방문해 주신 고객 여러분 진심으로 감사를 드립니다.</p>
        <div>
          <p>(주)바노테크는</p>
          <p>
            1999년말 욕실액세서리의 디자인 개발을 시작으로 현재까지 한계단 한계단 지속적으로 성장 발전해왔습니다.
            이렇게 지속적으로 성장 발전해온데는 당사 제품에 대한 고객 여러분의 두터운 신뢰가 밑바탕에 있었기에
            가능했다고 봅니다.
          </p>
        </div>
        <p>
          작은 나사하나까지도 국산만을 고집해온 &ldquo;vano&rdquo;는 원자재의 급등으로 여러 유혹과 어려움이 있었지만
          이에 현혹되지 않고, 여러분의 신뢰와 상도를 지키며 미래를 준비하고 있습니다.
        </p>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10">
        <h3 className="text-xl font-bold text-foreground mb-6">
          바노의 경영철학은 <span className="text-brand">魂(혼)</span>, <span className="text-brand">創(창)</span>, <span className="text-brand">通(통)</span>입니다.
        </h3>
        <div className="border-l-2 border-brand pl-6 space-y-2.5">
          <p className="text-base text-secondary leading-relaxed">
            <span className="text-foreground font-medium">바노의 모든 제품에는 모든 직원들의 혼이 담아 있습니다.</span>
          </p>
          <p className="text-base text-secondary leading-relaxed">
            <span className="text-foreground font-medium">바노는 남들과 경쟁하지 않습니다.</span>{' '}
            바노만의 경쟁력있는 창의적인 디자인 제품만을 연구합니다.
          </p>
          <p className="text-base text-secondary leading-relaxed">
            <span className="text-foreground font-medium">바노는 직원뿐만 아니라 고객 여러분과의 소통(Communication)을 중요시 합니다.</span>
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10">
        <h3 className="text-xl font-bold text-foreground mb-6">
          바노의 비전은 <span className="text-brand">고객만족 서비스 실천</span>,{' '}
          <span className="text-brand">R&D의 적극적인 투자</span>,{' '}
          <span className="text-brand">기업의 글로벌화제이션</span>입니다.
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <div className="text-base text-secondary leading-relaxed">
              <span className="text-foreground font-medium">바노는 &ldquo;고객만족 서비스를 실천하는 기업입니다.</span>
              <br />
              고객만족이라는 구호만을 외치는 것이 아니라 고객을 위한 서비스를 실천하는 기업입니다.
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <p className="text-base text-secondary leading-relaxed">
              <span className="text-foreground font-medium">바노는 욕실액세서리 브랜드를 리드하는 기업으로</span>{' '}
              끊임없이 R&D에 적극적으로 투자하는 기업입니다.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <p className="text-base text-secondary leading-relaxed">
              <span className="text-foreground font-medium">바노는 내수시장을 뛰어 넘어</span>{' '}
              기업이 글로벌화 하지 않으면 생존할 수 없다고 판단, 글로벌 네트워크형성을 지향하는 기업입니다.
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10">
        <p className="text-base leading-[1.9] text-secondary">
          바노는 영원히 초심을 잃지 않고 끝까지 최선을 다하는 좋은 기업, 착한기업으로 남겠습니다.
        </p>
        <p className="mt-2 text-base text-secondary">감사합니다.</p>
      </div>

      <div className="flex items-end justify-end gap-4 pb-4">
        <span className="text-base text-foreground font-medium">대표이사 허용</span>
        <Image src="/hungyong.png" alt="대표이사 서명" width={100} height={50} className="object-contain" />
      </div>
    </div>
  );
}

function GreetingEn() {
  return (
    <div className="max-w-3xl">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground leading-snug">
          A company that constantly evolves,
          <br />
          creates, and communicates
        </h2>
        <p className="mt-3 text-lg text-secondary">
          <span className="text-brand font-medium">&lsquo; BANO Tech Co., Ltd. &rsquo;</span> is building the future.
        </p>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10 space-y-6 text-base leading-[1.9] text-secondary">
        <p>Thank you for visiting our website.</p>
        <div>
          <p>BANO Tech Co., Ltd.</p>
          <p>
            Since late 1999, starting with bathroom accessory design development, we have been growing steadily step by step.
            This continued growth has been made possible by the deep trust our customers have placed in our products.
          </p>
        </div>
        <p>
          &ldquo;BANO&rdquo; has insisted on using only Korean-made materials, down to the smallest screw.
          Despite temptations from rising raw material costs, we have stayed true to our principles,
          maintaining your trust while preparing for the future.
        </p>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10">
        <h3 className="text-xl font-bold text-foreground mb-6">
          Our management philosophy: <span className="text-brand">Soul</span>, <span className="text-brand">Creativity</span>, <span className="text-brand">Communication</span>
        </h3>
        <div className="border-l-2 border-brand pl-6 space-y-2.5">
          <p className="text-base text-secondary leading-relaxed">
            <span className="text-foreground font-medium">Every BANO product contains the soul and dedication of our entire team.</span>
          </p>
          <p className="text-base text-secondary leading-relaxed">
            <span className="text-foreground font-medium">BANO does not compete with others.</span>{' '}
            We focus exclusively on researching our own uniquely competitive and creative designs.
          </p>
          <p className="text-base text-secondary leading-relaxed">
            <span className="text-foreground font-medium">BANO values communication — not only among employees, but with all our customers.</span>
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10">
        <h3 className="text-xl font-bold text-foreground mb-6">
          Our vision: <span className="text-brand">Customer Satisfaction</span>,{' '}
          <span className="text-brand">R&D Investment</span>,{' '}
          <span className="text-brand">Globalization</span>
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <div className="text-base text-secondary leading-relaxed">
              <span className="text-foreground font-medium">BANO is a company that practices customer satisfaction service.</span>
              <br />
              We don&apos;t just proclaim customer satisfaction — we practice it.
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <p className="text-base text-secondary leading-relaxed">
              <span className="text-foreground font-medium">As a leading bathroom accessory brand,</span>{' '}
              BANO continuously and actively invests in R&D.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <p className="text-base text-secondary leading-relaxed">
              <span className="text-foreground font-medium">BANO looks beyond the domestic market,</span>{' '}
              recognizing that globalization is essential for survival, and strives to build a global network.
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="py-10">
        <p className="text-base leading-[1.9] text-secondary">
          BANO will forever remain true to its founding spirit — a good company that gives its best until the end.
        </p>
        <p className="mt-2 text-base text-secondary">Thank you.</p>
      </div>

      <div className="flex items-end justify-end gap-4 pb-4">
        <span className="text-base text-foreground font-medium">CEO Huh Yong</span>
        <Image src="/hungyong.png" alt="CEO Signature" width={100} height={50} className="object-contain" />
      </div>
    </div>
  );
}

export default function GreetingPage() {
  const { locale } = useI18n();
  return locale === 'en' ? <GreetingEn /> : <GreetingKo />;
}
