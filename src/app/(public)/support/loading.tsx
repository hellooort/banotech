export default function SupportLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-24 rounded bg-border/60" />
        <div className="h-4 w-20 rounded bg-border/40" />
      </div>
      <div className="divide-y divide-border border-t border-b border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-2 py-4">
            <div className="h-4 flex-1 rounded bg-border/40" />
            <div className="h-3 w-20 rounded bg-border/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
