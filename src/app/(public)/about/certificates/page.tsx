import { redirect } from 'next/navigation';

export default function CertificatesRedirectPage() {
  redirect('/resources?tab=certificate');
}
