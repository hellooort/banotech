export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-48 rounded bg-border/60" />
        <div className="h-4 w-80 rounded bg-border/40" />
        <div className="space-y-4 max-w-3xl">
          <div className="h-3 w-full rounded bg-border/30" />
          <div className="h-3 w-5/6 rounded bg-border/30" />
          <div className="h-3 w-4/6 rounded bg-border/30" />
        </div>
      </div>
    </div>
  );
}
