import { createContext } from "react";
import type { AuthSession, LoginCredentials } from "../../api/auth";

export interface AuthContextValue {
  session: AuthSession | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
