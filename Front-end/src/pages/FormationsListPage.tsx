import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getDivisions, getFormations, getEmployees, getInstitutes } from "../api";
import { Badge } from "../components/Badge";
import { DataTable } from "../components/DataTable";
import type { DataTableColumn } from "../components/DataTable";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHeader } from "../components/PageHeader";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../features/auth/useAuth";
import type { Formation, FormationStatus } from "../types";

interface FormationsListPageProps {
  initialStatus: FormationStatus;
  title: string;
  description: string;
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function FormationsListPage({
  initialStatus,
  title,
  description,
}: FormationsListPageProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const actor = session?.user;
  const [divisionId, setDivisionId] = useState("");
  const [status, setStatus] = useState<FormationStatus | "all">(initialStatus);
  const formationsQuery = useQuery({
    queryKey: ["formations", actor?.role, actor?.divisionId, status, divisionId],
    queryFn: () =>
      getFormations({
        actor: actor!,
        status: status === "all" ? undefined : status,
        divisionId: divisionId || undefined,
      }),
    enabled: Boolean(actor),
  });
  const employeesQuery = useQuery({
    queryKey: ["employees", actor?.role, actor?.divisionId],
    queryFn: () => getEmployees(actor!),
    enabled: Boolean(actor),
  });
  const divisionsQuery = useQuery({
    queryKey: ["divisions", actor?.role, actor?.divisionId],
    queryFn: () => getDivisions(actor!),
    enabled: Boolean(actor),
  });
  const institutesQuery = useQuery({
    queryKey: ["institutes"],
    queryFn: getInstitutes,
  });

  const columns = useMemo<DataTableColumn<Formation>[]>(() => {
    const employeeById = new Map(
      (employeesQuery.data ?? []).map((employee) => [employee.id, employee]),
    );
    const divisionById = new Map(
      (divisionsQuery.data ?? []).map((division) => [division.id, division]),
    );
    const instituteById = new Map(
      (institutesQuery.data ?? []).map((institute) => [institute.id, institute]),
    );

    return [
      {
        id: "title",
        header: "Formation",
        cell: (formation) => (
          <div>
            <p className="font-medium text-slate-900">{formation.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {instituteById.get(formation.instituteId)?.name ?? "Unknown institute"}
            </p>
          </div>
        ),
        sortValue: (formation) => formation.title,
      },
      {
        id: "employee",
        header: "Employee",
        cell: (formation) =>
          employeeById.get(formation.employeeId)?.fullName ?? "Unknown employee",
        sortValue: (formation) =>
          employeeById.get(formation.employeeId)?.fullName ?? "",
      },
      {
        id: "division",
        header: "Division",
        cell: (formation) =>
          divisionById.get(formation.requestedByDivisionId)?.name ??
          "Unknown division",
        sortValue: (formation) =>
          divisionById.get(formation.requestedByDivisionId)?.name ?? "",
      },
      {
        id: "dates",
        header: "Dates",
        cell: (formation) => (
          <span className="whitespace-nowrap">
            {dateFormatter.format(new Date(`${formation.startDate}T00:00:00`))}
            <span aria-hidden="true"> – </span>
            {dateFormatter.format(new Date(`${formation.endDate}T00:00:00`))}
          </span>
        ),
        sortValue: (formation) => formation.startDate,
      },
      {
        id: "status",
        header: "Status",
        cell: (formation) => <Badge status={formation.status} />,
        sortValue: (formation) => formation.status,
      },
    ];
  }, [divisionsQuery.data, employeesQuery.data, institutesQuery.data]);

  const isPending =
    formationsQuery.isPending ||
    employeesQuery.isPending ||
    divisionsQuery.isPending ||
    institutesQuery.isPending;
  const error =
    formationsQuery.error ??
    employeesQuery.error ??
    divisionsQuery.error ??
    institutesQuery.error;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title={title} description={description} />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Division</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 disabled:bg-slate-100"
              disabled={actor?.role === "RDS"}
              onChange={(event) => setDivisionId(event.target.value)}
              value={actor?.role === "RDS" ? actor.divisionId : divisionId}
            >
              {actor?.role === "RDF" && <option value="">All divisions</option>}
              {(divisionsQuery.data ?? []).map((division) => (
                <option key={division.id} value={division.id}>{division.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              onChange={(event) => setStatus(event.target.value as FormationStatus | "all")}
              value={status}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="planned">Planned</option>
              <option value="finished">Finished</option>
            </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isPending ? (
          <Spinner label={`Loading ${title.toLocaleLowerCase()}`} />
        ) : error ? (
          <div className="p-5">
            <ErrorMessage
              message={`We couldn’t load ${title.toLocaleLowerCase()}. ${error.message}`}
              onRetry={() => {
                void formationsQuery.refetch();
                void employeesQuery.refetch();
                void divisionsQuery.refetch();
                void institutesQuery.refetch();
              }}
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            emptyDescription="Try changing the selected filters."
            emptyTitle="No formations match these filters"
            onRowClick={(formation) => {
              if (actor?.role === "RDF") {
                navigate(`/employees/${formation.employeeId}`);
              } else {
                navigate("/divisions");
              }
            }}
            rowKey={(formation) => formation.id}
            rows={formationsQuery.data ?? []}
          />
        )}
      </section>
    </div>
  );
}
