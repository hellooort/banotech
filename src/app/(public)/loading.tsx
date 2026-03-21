export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-48 rounded bg-border/60" />
        <div className="h-4 w-72 rounded bg-border/40" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border p-5">
              <div className="aspect-[4/3] rounded-lg bg-border/40" />
              <div className="h-4 w-3/4 rounded bg-border/50" />
              <div className="h-3 w-1/2 rounded bg-border/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
