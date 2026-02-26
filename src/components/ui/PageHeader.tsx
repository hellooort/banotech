interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 text-base text-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
