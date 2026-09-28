import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getFormations } from "../api/formations";
import { searchAll } from "../api/search";
import { Badge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { SearchInput } from "../components/SearchInput";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../features/auth/useAuth";
import type { Formation, Institute } from "../types";

type SearchTab = "employees" | "formations" | "institutes";

const tabs: { id: SearchTab; label: string }[] = [
  { id: "employees", label: "Employees" },
  { id: "formations", label: "Formations" },
  { id: "institutes", label: "Institutes" },
];

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function SearchPage() {
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("employees");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const handleSearch = useCallback((nextQuery: string) => setQuery(nextQuery), []);
  const actor = session?.user;
  const resultsQuery = useQuery({
    queryKey: ["search", query, session?.user.role, session?.user.divisionId],
    queryFn: () => searchAll(query, actor!),
    enabled: query.length > 0 && Boolean(actor),
  });
  const instituteFormationsQuery = useQuery({
    queryKey: [
      "institute-formations",
      selectedInstitute?.id,
      actor?.role,
      actor?.divisionId,
    ],
    queryFn: () => getFormations({ actor: actor! }),
    enabled: Boolean(selectedInstitute && actor),
  });

  const resultCount = useMemo(() => {
    const results = resultsQuery.data;
    if (!results) return 0;
    if (activeTab === "employees") return results.employees.length;
    if (activeTab === "formations") return results.formations.length;
    return results.institutes.length;
  }, [activeTab, resultsQuery.data]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Search"
        description="Search across employees, training programmes and institutes."
      />
      <SearchInput
        label="Search Sonatrach training"
        onSearch={handleSearch}
        placeholder="Enter an employee, formation or institute"
      />
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div
          aria-label="Search result categories"
          className="flex overflow-x-auto border-b border-slate-100 px-3 sm:px-5"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-4 text-sm font-medium transition sm:px-4 ${
                activeTab === tab.id
                  ? "border-emerald-700 text-emerald-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
              {resultsQuery.data && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {resultsQuery.data[tab.id].length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div aria-labelledby={`tab-${activeTab}`} className="min-h-64" role="tabpanel">
          {!query ? (
            <EmptyState
              description="Type a name, training title or institute to see matching results."
              title="Start your search"
            />
          ) : resultsQuery.isPending ? (
            <Spinner label="Searching" />
          ) : resultsQuery.error ? (
            <div className="p-5">
              <ErrorMessage
                message={`Search failed. ${resultsQuery.error.message}`}
                onRetry={() => void resultsQuery.refetch()}
              />
            </div>
          ) : resultCount === 0 ? (
            <EmptyState
              description={`No ${activeTab} match “${query}”. Try a different search term.`}
              title="No results found"
            />
          ) : activeTab === "employees" ? (
            <ul className="divide-y divide-slate-100">
              {resultsQuery.data?.employees.map((employee) => (
                <li key={employee.id}>
                  <Link
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                    to={`/employees/${employee.id}`}
                  >
                    <span>
                      <span className="block font-medium text-slate-900">{employee.fullName}</span>
                      <span className="mt-1 block text-sm text-slate-500">{employee.position}</span>
                    </span>
                    <span aria-hidden="true" className="text-lg text-slate-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : activeTab === "formations" ? (
            <ul className="divide-y divide-slate-100">
              {resultsQuery.data?.formations.map((formation) => (
                <li key={formation.id}>
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
                    onClick={() => setSelectedFormation(formation)}
                    type="button"
                  >
                    <span>
                      <span className="block font-medium text-slate-900">{formation.title}</span>
                      <span className="mt-1 block text-sm text-slate-500">
                        {dateFormatter.format(new Date(`${formation.startDate}T00:00:00`))}
                        <span aria-hidden="true"> – </span>
                        {dateFormatter.format(new Date(`${formation.endDate}T00:00:00`))}
                      </span>
                    </span>
                    <Badge status={formation.status} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="divide-y divide-slate-100">
              {resultsQuery.data?.institutes.map((institute) => (
                <li key={institute.id}>
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
                    onClick={() => setSelectedInstitute(institute)}
                    type="button"
                  >
                    <span className="font-medium text-slate-900">{institute.name}</span>
                    <span aria-hidden="true" className="text-lg text-slate-400">→</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {selectedFormation && (
        <Modal
          onClose={() => setSelectedFormation(null)}
          title={selectedFormation.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-600">Status</p>
              <Badge status={selectedFormation.status} />
            </div>
            <DetailLine label="Start date" value={dateFormatter.format(new Date(`${selectedFormation.startDate}T00:00:00`))} />
            <DetailLine label="End date" value={dateFormatter.format(new Date(`${selectedFormation.endDate}T00:00:00`))} />
            <Link
              className="inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              onClick={() => setSelectedFormation(null)}
              to={`/employees/${selectedFormation.employeeId}`}
            >
              View employee profile
            </Link>
          </div>
        </Modal>
      )}
      {selectedInstitute && (
        <Modal
          onClose={() => setSelectedInstitute(null)}
          title={selectedInstitute.name}
        >
          <p className="mb-4 text-sm text-slate-600">Training programmes at this institute:</p>
          {instituteFormationsQuery.isPending ? (
            <p className="text-sm text-slate-500" role="status">Loading institute formations…</p>
          ) : instituteFormationsQuery.error ? (
            <ErrorMessage
              message={`We couldn’t load institute formations. ${instituteFormationsQuery.error.message}`}
              onRetry={() => void instituteFormationsQuery.refetch()}
            />
          ) : (
            <ul className="space-y-2">
              {(instituteFormationsQuery.data ?? [])
                .filter(({ instituteId }) => instituteId === selectedInstitute.id)
                .map((formation) => (
                  <li className="text-sm font-medium text-slate-800" key={formation.id}>
                    {formation.title}
                  </li>
                ))}
              {(instituteFormationsQuery.data ?? []).filter(
                ({ instituteId }) => instituteId === selectedInstitute.id,
              ).length === 0 && (
                <li className="text-sm text-slate-500">
                  No formations are currently listed for this institute.
                </li>
              )}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}

interface DetailLineProps {
  label: string;
  value: string;
}

function DetailLine({ label, value }: DetailLineProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}
