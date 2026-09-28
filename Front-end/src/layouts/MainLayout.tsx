import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import type { Role } from "../types";

interface NavigationItem {
  label: string;
  path: string;
  roles: Role[];
  icon: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Planning", path: "/planning", roles: ["RDF"], icon: "▦" },
  { label: "Pending requests", path: "/pending", roles: ["RDF", "RDS"], icon: "◷" },
  { label: "Completed training", path: "/finished", roles: ["RDF", "RDS"], icon: "✓" },
  { label: "Divisions", path: "/divisions", roles: ["RDF", "RDS"], icon: "▤" },
  { label: "Employees", path: "/employees", roles: ["RDF"], icon: "♙" },
  { label: "Search", path: "/search", roles: ["RDF"], icon: "⌕" },
];

export function MainLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = session?.user.role;
  const isNewRequest = location.pathname === "/requests/new";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-20 h-[72px] border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink className="flex min-w-0 items-center gap-3" to="/">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#063b35] text-xl font-bold text-emerald-300">
              S
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-bold tracking-[0.12em] text-slate-900">SONATRACH</span>
              <span className="block text-xs text-slate-500">Training management</span>
            </span>
          </NavLink>
          <div className="flex items-center gap-3 sm:gap-5">
            {role === "RDS" && (
              <button
                className="rounded-lg bg-[#08766a] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#06645a] sm:px-4"
                onClick={() => navigate("/requests/new")}
                type="button"
              >
                <span className="sm:hidden">+ Request</span>
                <span className="hidden sm:inline">+ New request</span>
              </button>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-800">{session?.user.fullName}</p>
              <p className="text-xs text-slate-500">{role === "RDF" ? "Training directorate" : "Sub-direction"}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              {role}
            </span>
            <button
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              onClick={() => {
                signOut();
                navigate("/login", { replace: true });
              }}
              type="button"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] pt-[72px]">
        <aside className="fixed bottom-0 top-[72px] hidden w-64 border-r border-slate-200 bg-white px-4 py-6 md:block">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          <nav aria-label="Main navigation" className="space-y-1">
            {navigationItems
              .filter((item) => role && item.roles.includes(role))
              .map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-50 text-emerald-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                  key={item.path}
                  to={item.path}
                >
                  <span aria-hidden="true" className="w-5 text-center text-base">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
          </nav>
          {role === "RDF" && (
            <div className="mt-8 border-t border-slate-100 pt-5">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tools
              </p>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
                to="/upload"
              >
                <span aria-hidden="true" className="w-5 text-center text-base">↑</span>
                Annual plan upload
              </NavLink>
            </div>
          )}
          {role === "RDS" && (
            <div className="mt-8 border-t border-slate-100 pt-5">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
                to="/requests/new"
              >
                <span aria-hidden="true" className="w-5 text-center text-base">＋</span>
                Request a formation
              </NavLink>
            </div>
          )}
        </aside>

        <main className="min-h-[calc(100vh-72px)] w-full px-4 py-6 pb-24 md:ml-64 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 flex overflow-x-auto border-t border-slate-200 bg-white px-2 py-2 md:hidden">
        {navigationItems
          .filter((item) => role && item.roles.includes(role))
          .map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex min-w-[84px] flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium ${
                  isActive ? "text-emerald-800" : "text-slate-500"
                }`
              }
              key={item.path}
              to={item.path}
            >
              <span aria-hidden="true" className="text-lg leading-5">{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        {!isNewRequest && role === "RDS" && (
          <NavLink
            className="flex min-w-[84px] flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium text-emerald-800"
            to="/requests/new"
          >
            <span aria-hidden="true" className="text-lg leading-5">＋</span>
            <span className="whitespace-nowrap">New request</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
}
