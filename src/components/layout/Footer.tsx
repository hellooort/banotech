'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

export default memo(function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-[#25282d] text-white/80">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div>
            <Image src="/logo.png" alt="VANO" width={94} height={32} className="object-contain brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed text-white/55 whitespace-pre-line">
              {t.footer.companyDesc}
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white">{t.nav.company}</h4>
            <ul className="mt-3 space-y-2.5">
              <li><Link href="/about" className="text-sm text-white/50 hover:text-brand transition-colors">{t.navSub.greeting}</Link></li>
              <li><Link href="/about/history" className="text-sm text-white/50 hover:text-brand transition-colors">{t.navSub.history}</Link></li>
              <li><Link href="/about/location" className="text-sm text-white/50 hover:text-brand transition-colors">{t.navSub.location}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white">{t.nav.products}</h4>
            <ul className="mt-3 space-y-2.5">
              <li><Link href="/products" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.viewAllProducts}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white">{t.nav.download}</h4>
            <ul className="mt-3 space-y-2.5">
              <li><Link href="/resources?tab=catalog" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.catalog}</Link></li>
              <li><Link href="/resources?tab=drawing" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.drawingManual}</Link></li>
              <li><Link href="/resources?tab=certificate" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.certificates}</Link></li>
              <li><Link href="/resources?tab=approval" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.approvalDocs}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white">{t.nav.contactUs}</h4>
            <ul className="mt-3 space-y-2.5">
              <li><Link href="/support" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.notices}</Link></li>
              <li><Link href="/support/inquiry" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.inquiry}</Link></li>
              <li><a href="mailto:vanovano@naver.com" className="text-sm text-white/50 hover:text-brand transition-colors">{t.mega.emailInquiry}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-sm text-white/45">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
});
