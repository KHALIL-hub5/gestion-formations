import {
  useCallback,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getStoredSession, login, logout } from "../../api/auth";
import type { AuthSession, LoginCredentials } from "../../api/auth";
import { AuthContext } from "./auth-context";
import type { AuthContextValue } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const nextSession = await login(credentials);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(() => {
    logout();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, signIn, signOut }),
    [session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
