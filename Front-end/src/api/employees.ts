import { mockEmployees } from "./mock-data";
import type { Employee, User } from "../types";

export async function getEmployees(actor: User): Promise<Employee[]> {
  return mockEmployees.filter(
    (employee) =>
      actor.role === "RDF" || employee.divisionId === actor.divisionId,
  );
}

export async function getEmployeeById(
  employeeId: string,
  actor: User,
): Promise<Employee | undefined> {
  const employee = mockEmployees.find(({ id }) => id === employeeId);
  if (actor.role === "RDS" && employee?.divisionId !== actor.divisionId) {
    return undefined;
  }
  return employee;
}

export async function searchEmployees(
  query: string,
  actor: User,
): Promise<Employee[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  return mockEmployees.filter(({ fullName }) =>
    fullName.toLocaleLowerCase().includes(normalizedQuery),
  ).filter(
    (employee) =>
      actor.role === "RDF" ||
      employee.divisionId === actor.divisionId,
  );
}
