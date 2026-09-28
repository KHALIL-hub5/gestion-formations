import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getDivisions, getEmployees, getFormations, getInstitutes } from "../api";
import { useAuth } from "../features/auth/useAuth";
import type { FormationStatus } from "../types";

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const statusStyles: Record<FormationStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  planned: "bg-blue-50 text-blue-800",
  finished: "bg-emerald-50 text-emerald-800",
};

const statusLabels: Record<FormationStatus, string> = {
  pending: "Pending",
  planned: "Planned",
  finished: "Finished",
};

export function PlanningPage() {
  const { session } = useAuth();
  const actor = session?.user;
  const formationsQuery = useQuery({
    queryKey: ["formations", actor?.role, actor?.divisionId],
    queryFn: () => getFormations({ actor: actor! }),
    enabled: Boolean(actor),
  });
  const employeesQuery = useQuery({
    queryKey: ["employees", actor?.role, actor?.divisionId],
    queryFn: () => getEmployees(actor!),
    enabled: Boolean(actor),
  });
  const institutesQuery = useQuery({ queryKey: ["institutes"], queryFn: getInstitutes });
  const divisionsQuery = useQuery({
    queryKey: ["divisions", actor?.role, actor?.divisionId],
    queryFn: () => getDivisions(actor!),
    enabled: Boolean(actor),
  });

  if (
    formationsQuery.isPending ||
    employeesQuery.isPending ||
    institutesQuery.isPending ||
    divisionsQuery.isPending
  ) {
    return (
      <div className="grid min-h-72 place-items-center" role="status">
        <span className="size-8 animate-spin rounded-full border-4 border-emerald-700 border-r-transparent" />
        <span className="sr-only">Loading training overview</span>
      </div>
    );
  }

  const error =
    formationsQuery.error ??
    employeesQuery.error ??
    institutesQuery.error ??
    divisionsQuery.error;
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
        We couldn’t load the training overview. {error.message}
      </div>
    );
  }

  const formations = formationsQuery.data ?? [];
  const employees = employeesQuery.data ?? [];
  const institutes = institutesQuery.data ?? [];
  const divisions = divisionsQuery.data ?? [];
  const pendingCount = formations.filter(({ status }) => status === "pending").length;
  const plannedCount = formations.filter(({ status }) => status === "planned").length;
  const finishedCount = formations.filter(({ status }) => status === "finished").length;
  const getEmployeeName = (employeeId: string) =>
    employees.find(({ id }) => id === employeeId)?.fullName ?? "Unknown employee";
  const getDivisionName = (divisionId: string) =>
    divisions.find(({ id }) => id === divisionId)?.name ?? "Unknown division";
  const getInstituteName = (instituteId: string) =>
    institutes.find(({ id }) => id === instituteId)?.name ?? "Unknown institute";

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-800">Training workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Good day, {session?.user.fullName.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Here’s the latest overview of employee training.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-lg bg-[#08766a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#06645a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          to="/upload"
        >
          Upload annual plan
        </Link>
      </section>

      <section aria-label="Training summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total formations" value={formations.length} detail="Across all divisions" />
        <SummaryCard label="Pending requests" value={pendingCount} detail="Awaiting review" />
        <SummaryCard label="Planned" value={plannedCount} detail="Scheduled for delivery" />
        <SummaryCard label="Completed" value={finishedCount} detail="Successfully delivered" />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">Recent formations</h2>
            <p className="mt-1 text-sm text-slate-500">A snapshot of current training activity</p>
          </div>
          <Link className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" to="/pending">
            View requests
          </Link>
        </div>
        {formations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-800">No formations yet</p>
            <p className="mt-1 text-sm text-slate-500">Training activity will appear here when available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Formation</th>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-6 py-3 font-medium">Division</th>
                  <th className="px-6 py-3 font-medium">Dates</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formations.slice(0, 5).map((formation) => (
                  <tr className="hover:bg-slate-50/70" key={formation.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{formation.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{getInstituteName(formation.instituteId)}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                      {getEmployeeName(formation.employeeId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {getDivisionName(formation.requestedByDivisionId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {dateFormatter.format(new Date(`${formation.startDate}T00:00:00`))}
                      <span aria-hidden="true"> – </span>
                      {dateFormatter.format(new Date(`${formation.endDate}T00:00:00`))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[formation.status]}`}>
                        {statusLabels[formation.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  detail: string;
}

function SummaryCard({ label, value, detail }: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </article>
  );
}
