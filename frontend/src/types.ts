export type SystemType = "silvoarable" | "silvopastoral";
export type Operation = "planting" | "pruning" | "harvesting";

export interface Option {
  id: string;
  label: string;
  blurb: string;
}

export interface SpeciesItem {
  id: number;
  name: string;
  category: "tree" | "crop" | "livestock";
  machine_count: number;
}

export interface Meta {
  system_types: Option[];
  operations: Option[];
  company_types: Option[];
  species: { tree: SpeciesItem[]; crop: SpeciesItem[]; livestock: SpeciesItem[] };
}

export interface Company {
  id: number;
  name: string;
  country: string;
  website: string | null;
}

export interface Machine {
  id: number;
  name: string;
  operation: Operation;
  method: "manual" | "mechanical" | "platform-assisted";
  company_type: 1 | 2 | 3;
  system_types: SystemType[];
  categories: string[];
  species: string[];
  description: string;
  specs: Record<string, string | number>;
  price_indication: string | null;
  product_url: string | null;
  image_url: string | null;
  company: Company;
}
