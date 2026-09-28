import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="px-6 py-12 text-center">
      <div
        aria-hidden="true"
        className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-xl text-emerald-800"
      >
        ···
      </div>
      <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
