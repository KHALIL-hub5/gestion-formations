import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDivisions } from "../api/divisions";
import { getEmployees } from "../api/employees";
import { DataTable } from "../components/DataTable";
import type { DataTableColumn } from "../components/DataTable";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHeader } from "../components/PageHeader";
import { SearchInput } from "../components/SearchInput";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../features/auth/useAuth";
import type { Employee } from "../types";

export function EmployeesPage() {
  const { session } = useAuth();
  const actor = session?.user;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDivisionId = searchParams.get("divisionId") ?? "";
  const [divisionId, setDivisionId] = useState(initialDivisionId);
  const [query, setQuery] = useState("");
  const handleSearch = useCallback((nextQuery: string) => setQuery(nextQuery), []);

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

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase();
    return (employeesQuery.data ?? []).filter(
      (employee) =>
        (!divisionId || employee.divisionId === divisionId) &&
        (!normalizedQuery ||
          employee.fullName.toLocaleLowerCase().includes(normalizedQuery) ||
          employee.position.toLocaleLowerCase().includes(normalizedQuery)),
    );
  }, [divisionId, employeesQuery.data, query]);

  const columns = useMemo<DataTableColumn<Employee>[]>(() => {
    const divisionById = new Map(
      (divisionsQuery.data ?? []).map((division) => [division.id, division.name]),
    );
    return [
      {
        id: "name",
        header: "Employee",
        cell: (employee) => <span className="font-medium text-slate-900">{employee.fullName}</span>,
        sortValue: (employee) => employee.fullName,
      },
      {
        id: "position",
        header: "Position",
        cell: (employee) => employee.position,
        sortValue: (employee) => employee.position,
      },
      {
        id: "division",
        header: "Division",
        cell: (employee) => divisionById.get(employee.divisionId) ?? "Unknown division",
        sortValue: (employee) => divisionById.get(employee.divisionId) ?? "",
      },
    ];
  }, [divisionsQuery.data]);

  const error = employeesQuery.error ?? divisionsQuery.error;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Employees" description="Find an employee and view their training profile." />
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.5fr)] sm:p-5">
        <SearchInput label="Search employees" onSearch={handleSearch} placeholder="Search by name or position" />
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Division</span>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            onChange={(event) => setDivisionId(event.target.value)}
            value={divisionId}
          >
            <option value="">All divisions</option>
            {(divisionsQuery.data ?? []).map((division) => (
              <option key={division.id} value={division.id}>{division.name}</option>
            ))}
          </select>
        </label>
      </section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {employeesQuery.isPending || divisionsQuery.isPending ? (
          <Spinner label="Loading employees" />
        ) : error ? (
          <div className="p-5">
            <ErrorMessage
              message={`We couldn’t load employees. ${error.message}`}
              onRetry={() => {
                void employeesQuery.refetch();
                void divisionsQuery.refetch();
              }}
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            emptyDescription="Try another name or choose a different division."
            emptyTitle="No employees found"
            onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
            rowKey={(employee) => employee.id}
            rows={filteredEmployees}
          />
        )}
      </section>
    </div>
  );
}
