import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { Role } from "../../types";

interface RoleRouteProps {
  allowedRoles: Role[] | undefined;
  children: ReactNode;
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!allowedRoles?.includes(session.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
