import { createClient } from '@/lib/supabase/server';
import type { CompanyInfo } from '@/types/database';

export const dynamic = 'force-dynamic';

interface LocationInfo {
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  map_embed_url?: string;
}

export default async function LocationPage() {
  let locationInfo: LocationInfo = {};

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('company_info')
      .select('*')
      .eq('section', 'location')
      .limit(1)
      .single();

    if (data) {
      locationInfo = data.content as unknown as LocationInfo;
    }
  } catch {
    // fallback
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-8">오시는 길</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Map */}
        <div className="aspect-[4/3] overflow-hidden border border-border bg-background">
          {locationInfo.map_embed_url ? (
            <iframe
              src={locationInfo.map_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              지도 영역
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium w-20">주소</td>
                <td className="py-3 text-foreground">
                  {locationInfo.address || '주소를 입력하세요'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium">전화</td>
                <td className="py-3 text-foreground">
                  {locationInfo.phone || '02-0000-0000'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium">팩스</td>
                <td className="py-3 text-foreground">
                  {locationInfo.fax || '02-0000-0000'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-6 text-muted font-medium">이메일</td>
                <td className="py-3 text-foreground">
                  {locationInfo.email || 'info@bano.co.kr'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
