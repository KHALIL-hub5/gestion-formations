import { searchEmployees } from "./employees";
import { getFormations } from "./formations";
import { searchInstitutes } from "./institutes";
import type { SearchResults, User } from "../types";

export async function searchAll(query: string, actor: User): Promise<SearchResults> {
  const [employees, formations, institutes] = await Promise.all([
    searchEmployees(query, actor),
    getFormations({ actor }),
    searchInstitutes(query),
  ]);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return {
    employees,
    formations: formations.filter(({ title }) =>
      title.toLocaleLowerCase().includes(normalizedQuery),
    ),
    institutes,
  };
}
