export type Role = "RDF" | "RDS";

export interface User {
  id: string;
  fullName: string;
  role: Role;
  divisionId: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  fullName: string;
  divisionId: string;
  position: string;
}

export interface Institute {
  id: string;
  name: string;
}

export type FormationStatus = "pending" | "planned" | "finished";

export interface Formation {
  id: string;
  title: string;
  instituteId: string;
  startDate: string;
  endDate: string;
  status: FormationStatus;
  employeeId: string;
  requestedByDivisionId: string;
}

export interface FormationRequestInput {
  title: string;
  instituteId: string;
  startDate: string;
  endDate: string;
  employeeId: string;
  requestedByDivisionId: string;
  justification: string;
}

export interface PlannedFormationInput {
  title: string;
  instituteId: string;
  startDate: string;
  endDate: string;
  employeeId: string;
  requestedByDivisionId: string;
}

export interface PlanUploadRow {
  title: string;
  instituteId: string;
  startDate: string;
  endDate: string;
  employeeId: string;
  requestedByDivisionId: string;
}

export interface PlanUploadResult {
  createdCount: number;
  formationIds: string[];
}

export interface SearchResults {
  employees: Employee[];
  formations: Formation[];
  institutes: Institute[];
}
