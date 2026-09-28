import { mockDivisions } from "./mock-data";
import { mockEmployees, mockFormations } from "./mock-data";
import type { Division, Employee, Formation, User } from "../types";

export interface DivisionOverview extends Division {
  employees: Employee[];
  formations: Formation[];
}

export async function getDivisions(actor: User): Promise<Division[]> {
  if (actor.role === "RDF") return mockDivisions;
  return mockDivisions.filter(({ id }) => id === actor.divisionId);
}

export async function getDivisionById(
  divisionId: string,
  actor: User,
): Promise<Division | undefined> {
  if (actor.role === "RDS" && divisionId !== actor.divisionId) {
    return undefined;
  }
  return mockDivisions.find(({ id }) => id === divisionId);
}

export async function getDivisionOverviews(
  actor: User,
): Promise<DivisionOverview[]> {
  const divisions = await getDivisions(actor);
  const allowedDivisionIds = new Set(divisions.map(({ id }) => id));

  return divisions.map((division) => ({
    ...division,
    employees: mockEmployees.filter(
      ({ divisionId }) =>
        divisionId === division.id && allowedDivisionIds.has(divisionId),
    ),
    formations: mockFormations.filter(
      ({ requestedByDivisionId }) =>
        requestedByDivisionId === division.id &&
        allowedDivisionIds.has(requestedByDivisionId),
    ),
  }));
}
