import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({
  eyebrow = "Training workspace",
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium text-emerald-800">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}
