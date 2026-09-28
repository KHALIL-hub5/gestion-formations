import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getDivisionById } from "../api/divisions";
import { getEmployeeById } from "../api/employees";
import { getFormationsForEmployee } from "../api/formations";
import { getInstitutes } from "../api/institutes";
import { Badge } from "../components/Badge";
import { DataTable } from "../components/DataTable";
import type { DataTableColumn } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHeader } from "../components/PageHeader";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../features/auth/useAuth";
import type { Formation } from "../types";

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function EmployeeProfilePage() {
  const { id = "" } = useParams();
  const { session } = useAuth();
  const actor = session?.user;
  const employeeQuery = useQuery({
    queryKey: ["employee", id, actor?.role, actor?.divisionId],
    queryFn: () => getEmployeeById(id, actor!),
    enabled: Boolean(actor && id),
  });
  const formationsQuery = useQuery({
    queryKey: ["employee-formations", id, actor?.role, actor?.divisionId],
    queryFn: () => getFormationsForEmployee(id, actor!),
    enabled: Boolean(actor && id),
  });
  const institutesQuery = useQuery({
    queryKey: ["institutes"],
    queryFn: getInstitutes,
  });
  const divisionQuery = useQuery({
    queryKey: ["division", employeeQuery.data?.divisionId, actor?.role, actor?.divisionId],
    queryFn: () => getDivisionById(employeeQuery.data!.divisionId, actor!),
    enabled: Boolean(employeeQuery.data && actor),
  });

  const columns = useMemo<DataTableColumn<Formation>[]>(() => {
    const instituteById = new Map(
      (institutesQuery.data ?? []).map((institute) => [institute.id, institute.name]),
    );
    return [
      {
        id: "formation",
        header: "Formation",
        cell: (formation) => (
          <div>
            <p className="font-medium text-slate-900">{formation.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {instituteById.get(formation.instituteId) ?? "Unknown institute"}
            </p>
          </div>
        ),
        sortValue: (formation) => formation.title,
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
  }, [institutesQuery.data]);

  const isPending =
    employeeQuery.isPending ||
    formationsQuery.isPending ||
    institutesQuery.isPending ||
    (Boolean(employeeQuery.data) && divisionQuery.isPending);
  const error =
    employeeQuery.error ??
    formationsQuery.error ??
    institutesQuery.error ??
    divisionQuery.error;
  if (isPending) return <Spinner label="Loading employee profile" />;
  if (error) {
    return (
      <ErrorMessage
        message={`We couldn’t load this employee profile. ${error.message}`}
        onRetry={() => {
          void employeeQuery.refetch();
          void formationsQuery.refetch();
          void institutesQuery.refetch();
        }}
      />
    );
  }
  if (!employeeQuery.data) {
    return (
      <EmptyState
        description="The employee may not exist or may not be visible to this account."
        title="Employee not found"
        action={
          <Link className="font-semibold text-emerald-800 hover:text-emerald-950" to="/employees">
            Back to employees
          </Link>
        }
      />
    );
  }

  const employee = employeeQuery.data;
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Employee profile"
        title={employee.fullName}
        description="Employee information and training history."
        action={
          <Link className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" to="/employees">
            Back to employees
          </Link>
        }
      />
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <ProfileDetail label="Position" value={employee.position} />
        <ProfileDetail label="Division" value={divisionQuery.data?.name ?? "Unknown division"} />
        <ProfileDetail label="Training records" value={String(formationsQuery.data?.length ?? 0)} />
      </section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Formation history</h2>
          <p className="mt-1 text-sm text-slate-500">Past, planned and pending training records.</p>
        </div>
        <DataTable
          columns={columns}
          emptyDescription="This employee does not have any training records yet."
          emptyTitle="No formations found"
          rowKey={(formation) => formation.id}
          rows={formationsQuery.data ?? []}
        />
      </section>
    </div>
  );
}

interface ProfileDetailProps {
  label: string;
  value: string;
}

function ProfileDetail({ label, value }: ProfileDetailProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-medium text-slate-900">{value}</p>
    </div>
  );
}
