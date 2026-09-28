import { mockEmployees, mockFormations } from "./mock-data";
import type {
  Formation,
  FormationRequestInput,
  FormationStatus,
  PlanUploadResult,
  PlanUploadRow,
  PlannedFormationInput,
  User,
} from "../types";

export interface FormationFilters {
  status?: FormationStatus;
  divisionId?: string;
  employeeId?: string;
  actor: User;
}

export async function getFormations(filters: FormationFilters): Promise<Formation[]> {
  return mockFormations.filter(
    (formation) =>
      (!filters.status || formation.status === filters.status) &&
      (!filters.divisionId ||
        formation.requestedByDivisionId === filters.divisionId) &&
      (filters.actor.role === "RDF" ||
        (formation.requestedByDivisionId === filters.actor.divisionId &&
          mockEmployees.some(
            (employee) =>
              employee.id === formation.employeeId &&
              employee.divisionId === filters.actor.divisionId,
          ))) &&
      (!filters.employeeId || formation.employeeId === filters.employeeId),
  );
}

export async function getFormationsForEmployee(
  employeeId: string,
  actor: User,
): Promise<Formation[]> {
  return getFormations({ employeeId, actor });
}

export async function createFormationRequest(
  input: FormationRequestInput,
): Promise<Formation> {
  const formation: Formation = {
    ...input,
    id: crypto.randomUUID(),
    status: "pending",
  };
  mockFormations.push(formation);
  return formation;
}

export async function planFormation(
  input: PlannedFormationInput,
): Promise<Formation> {
  const formation: Formation = {
    ...input,
    id: crypto.randomUUID(),
    status: "planned",
  };
  mockFormations.push(formation);
  return formation;
}

export async function uploadAnnualPlan(
  rows: PlanUploadRow[],
): Promise<PlanUploadResult> {
  const formations: Formation[] = rows.map((row) => ({
    ...row,
    id: crypto.randomUUID(),
    status: "planned",
  }));
  mockFormations.push(...formations);
  return {
    createdCount: formations.length,
    formationIds: formations.map(({ id }) => id),
  };
}
