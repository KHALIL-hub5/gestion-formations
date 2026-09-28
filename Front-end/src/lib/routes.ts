import type { Role } from "../types";

export function getHomeRoute(role: Role): string {
  return role === "RDF" ? "/planning" : "/pending";
}
