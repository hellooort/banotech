'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED = ['catalog', 'drawing', 'certificate', 'approval', 'other'];

export default function ResourcesHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (ALLOWED.includes(hash)) {
      router.replace(`/resources?tab=${hash}`);
    }
  }, [router]);

  return null;
}
