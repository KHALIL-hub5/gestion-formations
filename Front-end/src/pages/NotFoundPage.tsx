import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { getHomeRoute } from "../lib/routes";

export function NotFoundPage() {
  const { session } = useAuth();
  const destination = session
    ? getHomeRoute(session.user.role)
    : "/login";

  return (
    <section className="mx-auto grid min-h-[60vh] max-w-lg content-center justify-items-center text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800">Error 404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        className="mt-6 rounded-lg bg-[#08766a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#06645a]"
        to={destination}
      >
        {session ? "Back to my workspace" : "Sign in"}
      </Link>
    </section>
  );
}
