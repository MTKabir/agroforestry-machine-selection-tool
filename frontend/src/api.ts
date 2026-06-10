import type { Machine, Meta, Operation, SystemType } from "./types";

export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const BASE = API_BASE;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error("API " + res.status + " for " + path);
  return res.json() as Promise<T>;
}

export const fetchMeta = () => get<Meta>("/api/meta");

export function fetchMachines(params: {
  operation: Operation;
  systemType: SystemType;
  companyType?: number;
  species: string[];
}): Promise<Machine[]> {
  const q = new URLSearchParams({
    operation: params.operation,
    system_type: params.systemType,
  });
  if (params.companyType) q.set("company_type", String(params.companyType));
  params.species.forEach((s) => q.append("species", s));
  return get<Machine[]>("/api/machines?" + q.toString());
}
