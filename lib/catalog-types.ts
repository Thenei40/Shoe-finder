export type LineCategory =
  | "entrada"
  | "treino-diario"
  | "daily-premium"
  | "estabilidade"
  | "max-cushion"
  | "performance"
  | "prova"
  | "super-shoe";

export type CatalogShoeTier =
  | "economico"
  | "intermediario"
  | "premium"
  | "performance";

export type CatalogCushioning = "macio" | "equilibrado" | "responsivo";
export type CatalogStability = "baixa" | "media" | "alta";

export const LINE_CATEGORY_LABELS: Record<LineCategory, string> = {
  entrada: "Entrada",
  "treino-diario": "Treino diário",
  "daily-premium": "Daily trainer premium",
  estabilidade: "Estabilidade",
  "max-cushion": "Amortecimento máximo",
  performance: "Performance",
  prova: "Prova",
  "super-shoe": "Super shoe",
};

export type CatalogShoeDef = {
  id: string;
  model: string;
  brand: string;
  price: number;
  lineCategory: LineCategory;
  tier?: CatalogShoeTier;
  hasPlate?: boolean;
  beginnerFriendly?: boolean;
  isAggressive?: boolean;
  cushioningType?: CatalogCushioning;
  stabilityLevel?: CatalogStability;
  versatilityScore?: number;
  purpose?: string;
  idealPace?: string;
  comfortLevel?: string;
  bestUse?: string;
};

export type CatalogShoeInput = {
  id: string;
  name: string;
  brand: string;
  price: number;
  tier: CatalogShoeTier;
  lineCategory: LineCategory;
  modelLabel: string;
  hasPlate: boolean;
  beginnerFriendly: boolean;
  isAggressive: boolean;
  cushioningType: CatalogCushioning;
  stabilityLevel: CatalogStability;
  versatilityScore: number;
  purpose: string;
  idealPace: string;
  comfortLevel: string;
  bestUse: string;
  description: string;
  strengths: string[];
  idealFor: string[];
  notIdealFor: string[];
  usage: string[];
  frequency: string[];
  feeling: string[];
  prices: string[];
  weight: string[];
  experience: string[];
  discomfort: string[];
};
