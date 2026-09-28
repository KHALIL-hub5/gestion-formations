import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { RoleRoute } from "./features/auth/RoleRoute";
import { useAuth } from "./features/auth/useAuth";
import { MainLayout } from "./layouts/MainLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { PlanningPage } from "./pages/PlanningPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { FormationsListPage } from "./pages/FormationsListPage";
import { DivisionsPage } from "./pages/DivisionsPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { EmployeeProfilePage } from "./pages/EmployeeProfilePage";
import { SearchPage } from "./pages/SearchPage";
import { getHomeRoute } from "./lib/routes";
import type { Role } from "./types";

const roleAccess: Record<string, Role[]> = {
  "/planning": ["RDF"],
  "/pending": ["RDF", "RDS"],
  "/finished": ["RDF", "RDS"],
  "/divisions": ["RDF", "RDS"],
  "/employees": ["RDF"],
  "/search": ["RDF"],
  "/requests/new": ["RDS"],
  "/upload": ["RDF"],
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              index
              element={
                <RoleHomeRedirect />
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/planning"
              element={
                <RoleRoute allowedRoles={roleAccess["/planning"]}>
                  <PlanningPage />
                </RoleRoute>
              }
            />
            <Route
              path="/pending"
              element={
                <RoleRoute allowedRoles={roleAccess["/pending"]}>
                  <FormationsListPage
                    description="Review training requests and upcoming activity."
                    initialStatus="pending"
                    title="Pending requests"
                  />
                </RoleRoute>
              }
            />
            <Route
              path="/finished"
              element={
                <RoleRoute allowedRoles={roleAccess["/finished"]}>
                  <FormationsListPage
                    description="Browse completed employee training."
                    initialStatus="finished"
                    title="Completed training"
                  />
                </RoleRoute>
              }
            />
            <Route
              path="/divisions"
              element={
                <RoleRoute allowedRoles={roleAccess["/divisions"]}>
                  <DivisionsPage />
                </RoleRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <RoleRoute allowedRoles={roleAccess["/employees"]}>
                  <EmployeesPage />
                </RoleRoute>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <RoleRoute allowedRoles={["RDF"]}>
                  <EmployeeProfilePage />
                </RoleRoute>
              }
            />
            <Route
              path="/search"
              element={
                <RoleRoute allowedRoles={roleAccess["/search"]}>
                  <SearchPage />
                </RoleRoute>
              }
            />
            {(["/requests/new", "/upload"] as const).map((path) => (
              <Route
                key={path}
                path={path}
                element={
                  <RoleRoute allowedRoles={roleAccess[path]}>
                    <PlaceholderPage path={path} />
                  </RoleRoute>
                }
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

function RoleHomeRedirect() {
  const { session } = useAuth();
  return <Navigate to={getHomeRoute(session?.user.role ?? "RDF")} replace />;
}

export default App;
