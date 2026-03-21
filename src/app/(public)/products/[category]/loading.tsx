export default function CategoryLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-5 w-40 rounded bg-border/50" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border p-4">
            <div className="aspect-square rounded-lg bg-border/40" />
            <div className="h-4 w-3/4 rounded bg-border/50" />
            <div className="h-3 w-1/2 rounded bg-border/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
