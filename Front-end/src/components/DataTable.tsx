import { useMemo, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyTitle = "Nothing to show yet",
  emptyDescription = "There are no records matching this view.",
  pageSize = 8,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [page, setPage] = useState(0);

  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows;
    const column = columns.find(({ id }) => id === sortColumn);
    if (!column?.sortValue) return rows;

    return [...rows].sort((left, right) => {
      const leftValue = column.sortValue?.(left) ?? "";
      const rightValue = column.sortValue?.(right) ?? "";
      const comparison =
        typeof leftValue === "number" && typeof rightValue === "number"
          ? leftValue - rightValue
          : String(leftValue).localeCompare(String(rightValue));
      return sortAscending ? comparison : -comparison;
    });
  }, [columns, rows, sortAscending, sortColumn]);

  const pageCount = Math.ceil(sortedRows.length / pageSize);
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));
  const pageRows = sortedRows.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  function toggleSort(column: DataTableColumn<T>) {
    if (!column.sortValue) return;
    if (sortColumn === column.id) {
      setSortAscending((ascending) => !ascending);
    } else {
      setSortColumn(column.id);
      setSortAscending(true);
    }
    setPage(0);
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick?.(row);
    }
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        description={emptyDescription}
        title={emptyTitle}
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th
                  className={`px-5 py-3 font-medium ${column.className ?? ""}`}
                  key={column.id}
                  scope="col"
                >
                  {column.sortValue ? (
                    <button
                      aria-label={`Sort by ${column.header}`}
                      className="inline-flex items-center gap-2 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-700"
                      onClick={() => toggleSort(column)}
                      type="button"
                    >
                      {column.header}
                      <span aria-hidden="true">
                        {sortColumn === column.id
                          ? sortAscending
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageRows.map((row) => (
              <tr
                aria-label={onRowClick ? "Open record" : undefined}
                className={
                  onRowClick
                    ? "cursor-pointer hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-700"
                    : "hover:bg-slate-50/70"
                }
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick ? (event) => handleRowKeyDown(event, row) : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((column) => (
                  <td
                    className={`px-5 py-4 align-middle text-slate-700 ${column.className ?? ""}`}
                    key={column.id}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm">
          <p className="text-slate-500">
            Showing {currentPage * pageSize + 1}–
            {Math.min((currentPage + 1) * pageSize, rows.length)} of {rows.length}
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
