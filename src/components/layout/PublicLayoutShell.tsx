'use client';

import { I18nProvider } from '@/lib/i18n/context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * 공개 페이지는 동일 클라이언트 트리 안에서 I18nProvider로 감싸야
 * HomeContent 등에서 useI18n이 항상 동작합니다 (루트 RSC 경계 이슈 방지).
 */
export default function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Header />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <Footer />
    </I18nProvider>
  );
}
