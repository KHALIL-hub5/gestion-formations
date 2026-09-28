import { mockInstitutes } from "./mock-data";
import type { Institute } from "../types";

export async function getInstitutes(): Promise<Institute[]> {
  return mockInstitutes;
}

export async function searchInstitutes(query: string): Promise<Institute[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  return mockInstitutes.filter(({ name }) =>
    name.toLocaleLowerCase().includes(normalizedQuery),
  );
}
