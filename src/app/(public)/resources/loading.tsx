export default function ResourcesLoading() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border border-border bg-surface px-5 py-4"
        >
          <div className="h-5 w-5 rounded bg-border/40 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-3/4 rounded bg-border/50" />
            <div className="h-3 w-24 rounded bg-border/30" />
          </div>
          <div className="h-4 w-4 rounded bg-border/30 shrink-0" />
        </div>
      ))}
    </div>
  );
}
