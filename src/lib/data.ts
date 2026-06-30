import raw from "../data/projects.json";
import type { Project } from "../types";

export const projects = raw as Project[];

export const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];

export function projectById(id: string | undefined): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Buenas noches";
  if (h < 13) return "Buenos días";
  if (h < 21) return "Buenas tardes";
  return "Buenas noches";
}
