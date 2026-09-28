import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { Role } from "../../types";
import { getHomeRoute } from "../../lib/routes";

export function LoginPage() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("RDF");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) return <Navigate to={getHomeRoute(session.user.role)} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn({ username, password, role });
      navigate(getHomeRoute(role), { replace: true });
    } catch {
      setError("We couldn't sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      <section className="hidden flex-1 flex-col justify-between bg-[#063b35] p-12 text-white lg:flex">
        <a className="flex items-center gap-3" href="/" aria-label="Sonatrach home">
          <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-2xl font-bold text-emerald-300">
            S
          </span>
          <span className="text-lg font-semibold tracking-wide">SONATRACH</span>
        </a>
        <div className="max-w-xl pb-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Human capital development
          </p>
          <h1 className="text-5xl font-semibold leading-tight">
            Grow skills.
            <br />
            Build the future.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-emerald-50/75">
            A single place to plan, request and coordinate employee training
            across Sonatrach.
          </p>
        </div>
        <p className="text-sm text-emerald-50/50">
          Sonatrach · Training management
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <a className="mb-12 flex items-center gap-3 lg:hidden" href="/">
            <span className="grid size-10 place-items-center rounded-xl bg-[#063b35] text-xl font-bold text-white">
              S
            </span>
            <span className="font-semibold tracking-wide text-slate-900">SONATRACH</span>
          </a>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">
            Training management
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Welcome back
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in to access your training workspace.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="username">
                Username
              </label>
              <input
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                id="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your name"
                required
                value={username}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="role">
                Sign in as
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                id="role"
                onChange={(event) => setRole(event.target.value as Role)}
                value={role}
              >
                <option value="RDF">RDF · Training directorate</option>
                <option value="RDS">RDS · Sub-direction</option>
              </select>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <button
              className="w-full rounded-lg bg-[#08766a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#06645a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Demo mode: any username and password are accepted.
          </p>
        </div>
      </section>
    </main>
  );
}
