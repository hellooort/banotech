import SubSidebar from '@/components/layout/SubSidebar';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1280px] gap-8 px-6 py-10">
      <SubSidebar variant="about" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
