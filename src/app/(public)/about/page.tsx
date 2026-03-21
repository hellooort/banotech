'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

function GreetingKo() {
  return (
    <div className="max-w-3xl">
      {/* Title */}
      <h2 className="text-2xl font-bold tracking-tight leading-snug mb-8">
        <span className="text-brand">끊임없이 연구개발하는 기업, 독창성을 추구하는 기업, 소통하는 기업</span>
      </h2>

      <p className="text-base leading-[1.9] text-foreground font-semibold mb-8">
        [주]바노테크&apos; 가 HIGHEND 욕실문화를 만들어 가겠습니다.
      </p>

      <div className="space-y-6 text-base leading-[2] text-secondary">
        <p>홈페이지를 방문해 주신 고객 여러분, 진심으로 감사드립니다.</p>

        <div>
          <p>[주]바노테크는</p>
          <p>
            1999년 말, 욕실액세사리의 디자인 개발을 시작으로 끊임없는 연구개발과 창의적이고 독창적인 디자인을 바탕으로
            고객의 NEEDS를 깊이 있게 반영한 HIGHEND급 제품만을 만들고 있습니다. 이러한 노력들이 밑거름이 되어 지금은
            욕실액세사리의 트렌드를 LEAD하는 기업으로 성장발전해왔습니다.
          </p>
        </div>
      </div>

      <div className="h-px bg-border my-10" />

      {/* Philosophy */}
      <h3 className="text-xl font-bold text-foreground mb-6">
        <span className="text-brand">魂</span>(혼), <span className="text-brand">創</span>(창), <span className="text-brand">通</span>(통)의 정신은 <strong>vano</strong>의 경영철학입니다.
      </h3>
      <div className="space-y-2 text-base leading-[2] text-secondary">
        <p><strong>vano</strong>는 전 제품에 제품을 만드는 분들의 혼(<span className="text-brand font-semibold">魂</span>)이 담겨져 있습니다.</p>
        <p><strong>vano</strong>는 동종사와 경쟁하지 않습니다., 바노만의 창의적 디자인으로 독창(<span className="text-brand font-semibold">創</span>)적인 제품만을 연구개발합니다.</p>
        <p><strong>vano</strong>는 고객 여러분과의 소통(<span className="text-brand font-semibold">通</span>)를 중요시 합니다.</p>
      </div>

      <div className="h-px bg-border my-10" />

      {/* Vision */}
      <h3 className="text-xl font-bold text-foreground mb-6">
        <span className="text-brand">고객만족</span>, <span className="text-brand">R&D투자</span>, <span className="text-brand">세계화</span>의 정신은 <strong>vano</strong>의 비젼입니다.
      </h3>
      <div className="space-y-2 text-base leading-[2] text-secondary">
        <p><strong>vano</strong>는 &lsquo;고객만족 서비스&rsquo;를 실천하는 기업입니다.</p>
        <p><strong>vano</strong>는 끊임없이 R&D에 투자하는 기업입니다.</p>
        <p><strong>vano</strong>는 세계화(globalization)를 추구하는 기업입니다.</p>
      </div>

      <div className="h-px bg-border my-10" />

      {/* Closing */}
      <div className="space-y-2 text-base leading-[2] text-secondary">
        <p>[주]바노테크는</p>
        <p>시작할 때의 마음가짐을 유지하면서 신뢰받는 기업, 착한기업으로 고객 여러분의 곁을 지키겠습니다.</p>
      </div>

      {/* Signature */}
      <div className="flex items-end justify-end gap-4 mt-12 pb-4">
        <span className="text-base text-foreground font-medium">[주]바노테크 임직원 일동</span>
        <Image src="/hungyong.png" alt="대표이사 서명" width={100} height={50} className="object-contain" />
      </div>
    </div>
  );
}

function GreetingEn() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight leading-snug mb-8">
        <span className="text-brand">A company that constantly innovates, pursues originality, and communicates</span>
      </h2>

      <p className="text-base leading-[1.9] text-foreground font-semibold mb-8">
        BANO Tech Co., Ltd. will create a HIGHEND bathroom culture.
      </p>

      <div className="space-y-6 text-base leading-[2] text-secondary">
        <p>Thank you sincerely for visiting our website.</p>

        <div>
          <p>BANO Tech Co., Ltd.</p>
          <p>
            Starting with bathroom accessory design development in late 1999, we have been creating only HIGHEND products
            that deeply reflect customer needs through relentless R&D and creative, original designs.
            These efforts have become the foundation for our growth as a company that now leads bathroom accessory trends.
          </p>
        </div>
      </div>

      <div className="h-px bg-border my-10" />

      <h3 className="text-xl font-bold text-foreground mb-6">
        The spirit of <span className="text-brand">Soul</span>, <span className="text-brand">Creativity</span>, <span className="text-brand">Communication</span> is <strong>VANO</strong>&apos;s management philosophy.
      </h3>
      <div className="space-y-2 text-base leading-[2] text-secondary">
        <p><strong>VANO</strong> puts the <span className="text-brand font-semibold">soul</span> of every person who makes our products into every item.</p>
        <p><strong>VANO</strong> does not compete with others. We develop only original products with <span className="text-brand font-semibold">creative</span> designs unique to BANO.</p>
        <p><strong>VANO</strong> values <span className="text-brand font-semibold">communication</span> with all our customers.</p>
      </div>

      <div className="h-px bg-border my-10" />

      <h3 className="text-xl font-bold text-foreground mb-6">
        <span className="text-brand">Customer satisfaction</span>, <span className="text-brand">R&D investment</span>, <span className="text-brand">Globalization</span> — <strong>VANO</strong>&apos;s vision.
      </h3>
      <div className="space-y-2 text-base leading-[2] text-secondary">
        <p><strong>VANO</strong> is a company that practices &lsquo;customer satisfaction service.&rsquo;</p>
        <p><strong>VANO</strong> is a company that constantly invests in R&D.</p>
        <p><strong>VANO</strong> is a company that pursues globalization.</p>
      </div>

      <div className="h-px bg-border my-10" />

      <div className="space-y-2 text-base leading-[2] text-secondary">
        <p>BANO Tech Co., Ltd.</p>
        <p>We will keep our founding spirit and stand by our customers as a trusted, responsible company.</p>
      </div>

      <div className="flex items-end justify-end gap-4 mt-12 pb-4">
        <span className="text-base text-foreground font-medium">BANO Tech Co., Ltd. All employees</span>
        <Image src="/hungyong.png" alt="CEO Signature" width={100} height={50} className="object-contain" />
      </div>
    </div>
  );
}

export default function GreetingPage() {
  const { locale } = useI18n();
  return locale === 'en' ? <GreetingEn /> : <GreetingKo />;
}
