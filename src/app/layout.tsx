import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BANO | 욕실 액세서리 전문제조업체',
  description: '1999년부터 이어온 욕실 액세서리 전문 제조업체 바노테크',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
