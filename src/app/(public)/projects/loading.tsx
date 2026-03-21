export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-40 rounded bg-border/60" />
        <div className="h-4 w-64 rounded bg-border/40" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border">
              <div className="aspect-[4/3] bg-border/40" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-border/50" />
                <div className="h-3 w-1/2 rounded bg-border/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
