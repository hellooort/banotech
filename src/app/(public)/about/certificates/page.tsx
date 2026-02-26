import { createClient } from '@/lib/supabase/server';
import CertificatesContent from '@/components/about/CertificatesContent';
import type { Certificate } from '@/types/database';

export const revalidate = 60;

export default async function CertificatesPage() {
  let certificates: Certificate[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order');
    certificates = data ?? [];
  } catch {
    // fallback
  }

  return <CertificatesContent certificates={certificates} />;
}
