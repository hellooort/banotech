import { createClient } from '@/lib/supabase/server';
import LocationContent, { type LocationInfo } from '@/components/about/LocationContent';

export const revalidate = 60;

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

  return <LocationContent info={locationInfo} />;
}
