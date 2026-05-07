import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'VANO | 욕실 액세서리 전문제조업체',
  description: '1999년부터 이어온 욕실 액세서리 전문 제조업체 바노테크',
};

// 서버 컴포넌트/서버 액션을 서울 리전에서 실행 (Supabase ↔ Vercel 왕복 시간 최소화)
export const preferredRegion = 'icn1';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
