import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { getHomeRoute } from "../lib/routes";

export function UnauthorizedPage() {
  const { session } = useAuth();
  const homeRoute = getHomeRoute(session?.user.role ?? "RDF");

  return (
    <section className="mx-auto grid min-h-[60vh] max-w-lg content-center justify-items-center text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
        Access restricted
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        This area isn’t available for your role
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your account doesn’t have permission to view this page. Choose an
        available section from the navigation.
      </p>
      <Link
        className="mt-6 rounded-lg bg-[#08766a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#06645a]"
        to={homeRoute}
      >
        Back to my workspace
      </Link>
    </section>
  );
}
