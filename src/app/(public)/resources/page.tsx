import { Suspense } from 'react';
import ResourcesHashRedirect from '@/components/resources/ResourcesHashRedirect';
import ResourcesList from '@/components/resources/ResourcesList';
import ResourcesLoading from './loading';

export const revalidate = 120;

type TabKey = 'catalog' | 'drawing' | 'certificate' | 'approval' | 'other';

const ALLOWED_TABS: TabKey[] = ['catalog', 'drawing', 'certificate', 'approval', 'other'];

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const { tab: rawTab } = await searchParams;
  const activeTab: TabKey = ALLOWED_TABS.includes(rawTab as TabKey)
    ? (rawTab as TabKey)
    : 'catalog';

  return (
    <div>
      <ResourcesHashRedirect />
      <Suspense key={activeTab} fallback={<ResourcesLoading />}>
        <ResourcesList tab={activeTab} />
      </Suspense>
    </div>
  );
}
