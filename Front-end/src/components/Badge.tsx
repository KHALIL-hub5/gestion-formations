import type { FormationStatus } from "../types";

interface BadgeProps {
  status: FormationStatus;
}

const statusClasses: Record<FormationStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  planned: "bg-blue-50 text-blue-800",
  finished: "bg-emerald-50 text-emerald-800",
};

const statusNames: Record<FormationStatus, string> = {
  pending: "Pending",
  planned: "Planned",
  finished: "Finished",
};

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {statusNames[status]}
    </span>
  );
}
