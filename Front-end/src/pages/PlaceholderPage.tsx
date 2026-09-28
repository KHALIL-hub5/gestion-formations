interface PlaceholderPageProps {
  path: string;
}

const pageNames: Record<string, string> = {
  "/pending": "Pending requests",
  "/finished": "Completed training",
  "/divisions": "Divisions",
  "/employees": "Employees",
  "/search": "Search",
  "/requests/new": "Request a formation",
  "/upload": "Annual plan upload",
  "/employees/:id": "Employee profile",
};

export function PlaceholderPage({ path }: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-emerald-800">Training workspace</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {pageNames[path] ?? "Page"}
      </h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <div aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-xl text-emerald-800">
          ◌
        </div>
        <h2 className="mt-4 font-semibold text-slate-900">This workspace is being prepared</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Your navigation and access are ready. This screen’s training tools are coming in the next build phase.
        </p>
      </div>
    </section>
  );
}
