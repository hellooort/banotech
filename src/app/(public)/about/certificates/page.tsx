'use client';

import { useEffect } from 'react';

/** 인증서 자료는 자료실(DOWNLOAD) → 인증서 탭으로 이동 */
export default function CertificatesRedirectPage() {
  useEffect(() => {
    window.location.replace('/resources#certificate');
  }, []);
  return (
    <div className="py-12 text-center text-sm text-muted">자료실로 이동 중…</div>
  );
}
