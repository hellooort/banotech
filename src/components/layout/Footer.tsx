'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Image src="/logo_black.png" alt="BANO" width={90} height={30} className="object-contain" />
            <p className="mt-3 text-sm leading-relaxed text-muted whitespace-pre-line">
              {t.footer.companyDesc}
            </p>
          </div>

          <div>
            <h4 className="text-base font-medium text-foreground">{t.nav.about}</h4>
            <ul className="mt-3 space-y-2.5">
              <li><Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">{t.navSub.greeting}</Link></li>
              <li><Link href="/about/history" className="text-sm text-muted hover:text-foreground transition-colors">{t.navSub.history}</Link></li>
              <li><Link href="/about/certificates" className="text-sm text-muted hover:text-foreground transition-colors">{t.navSub.certificates}</Link></li>
              <li><Link href="/about/location" className="text-sm text-muted hover:text-foreground transition-colors">{t.navSub.location}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-medium text-foreground">{t.footer.productsResources}</h4>
            <ul className="mt-3 space-y-2.5">
              <li><Link href="/products" className="text-sm text-muted hover:text-foreground transition-colors">{t.nav.products}</Link></li>
              <li><Link href="/projects" className="text-sm text-muted hover:text-foreground transition-colors">{t.nav.projects}</Link></li>
              <li><Link href="/resources" className="text-sm text-muted hover:text-foreground transition-colors">{t.nav.resources}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-medium text-foreground">{t.nav.support}</h4>
            <ul className="mt-3 space-y-2.5">
              <li><Link href="/support" className="text-sm text-muted hover:text-foreground transition-colors">{t.navSub.notices}</Link></li>
              <li><Link href="/support/inquiry" className="text-sm text-muted hover:text-foreground transition-colors">{t.navSub.inquiry}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
