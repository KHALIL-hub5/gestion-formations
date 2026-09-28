import { mockUsers } from "./mock-data";
import type { Role, User } from "../types";

export interface LoginCredentials {
  username: string;
  password: string;
  role: Role;
}

export interface AuthSession {
  token: string;
  user: User;
}

const AUTH_STORAGE_KEY = "gestion-formations-session";

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const user =
    mockUsers.find(
      ({ role, fullName }) =>
        role === credentials.role &&
        fullName.toLocaleLowerCase() === credentials.username.trim().toLocaleLowerCase(),
    ) ?? mockUsers.find(({ role }) => role === credentials.role);
  if (!user) {
    throw new Error("No demo account exists for the selected role.");
  }

  const session: AuthSession = {
    token: `demo-token-${user.id}`,
    user: { ...user },
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getStoredSession(): AuthSession | null {
  const serializedSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!serializedSession) return null;

  try {
    const session: unknown = JSON.parse(serializedSession);
    if (!isAuthSession(session)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) return false;
  if (!("token" in value) || typeof value.token !== "string") return false;
  if (!("user" in value) || typeof value.user !== "object" || value.user === null) {
    return false;
  }

  const user = value.user;
  return (
    "id" in user &&
    typeof user.id === "string" &&
    "fullName" in user &&
    typeof user.fullName === "string" &&
    "role" in user &&
    (user.role === "RDF" || user.role === "RDS") &&
    "divisionId" in user &&
    typeof user.divisionId === "string"
  );
}
