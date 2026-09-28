import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getDivisionOverviews } from "../api/divisions";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHeader } from "../components/PageHeader";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../features/auth/useAuth";

export function DivisionsPage() {
  const { session } = useAuth();
  const actor = session?.user;
  const divisionsQuery = useQuery({
    queryKey: ["division-overviews", actor?.role, actor?.divisionId],
    queryFn: () => getDivisionOverviews(actor!),
    enabled: Boolean(actor),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Divisions"
        description={
          actor?.role === "RDS"
            ? "Your division's employees and training activity."
            : "Explore employee groups and training activity across divisions."
        }
      />
      <section className="grid gap-4 lg:grid-cols-2">
        {divisionsQuery.isPending ? (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white">
            <Spinner label="Loading divisions" />
          </div>
        ) : divisionsQuery.error ? (
          <div className="col-span-full">
            <ErrorMessage
              message={`We couldn’t load divisions. ${divisionsQuery.error.message}`}
              onRetry={() => void divisionsQuery.refetch()}
            />
          </div>
        ) : (divisionsQuery.data ?? []).length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white">
            <EmptyState
              description="There are no divisions available for this account."
              title="No divisions found"
            />
          </div>
        ) : (
          divisionsQuery.data?.map((division) => (
            <article
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              key={division.id}
            >
              <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="font-semibold text-slate-900">{division.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {division.employees.length} employees · {division.formations.length} formations
                  </p>
                </div>
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-50 font-semibold text-emerald-800">
                  {division.name.slice(0, 1)}
                </span>
              </header>
              <div className="px-5 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Employees
                </h3>
                {division.employees.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">No employees assigned.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {division.employees.slice(0, 5).map((employee) => (
                      <li key={employee.id}>
                        {actor?.role === "RDF" ? (
                          <Link
                            className="flex items-center justify-between gap-3 rounded-md py-1 text-sm hover:text-emerald-800"
                            to={`/employees/${employee.id}`}
                          >
                            <span className="font-medium text-slate-800">{employee.fullName}</span>
                            <span className="text-slate-500">{employee.position}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center justify-between gap-3 py-1 text-sm">
                            <span className="font-medium text-slate-800">{employee.fullName}</span>
                            <span className="text-slate-500">{employee.position}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {division.employees.length > 5 && actor?.role === "RDF" && (
                  <Link
                    className="mt-3 inline-block text-sm font-semibold text-emerald-800 hover:text-emerald-950"
                    to={`/employees?divisionId=${division.id}`}
                  >
                    View all {division.employees.length} employees
                  </Link>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
