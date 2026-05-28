import type {
  ExperienceLevel,
  LineCategory,
  RideFeel,
  TechnicalCategory,
  ValuePosition,
} from "./catalog-categories";
import { LINE_CATEGORY_LABELS, TECHNICAL_CATEGORY_LABELS } from "./catalog-categories";
import type { WeightBandSlug } from "./weight";
import type { TechnicalSpecOverride } from "./catalog-technical";
import type { ShoeTechnicalSpec } from "./catalog-technical";

export type {
  ExperienceLevel,
  LineCategory,
  RideFeel,
  TechnicalCategory,
  ValuePosition,
};

export { LINE_CATEGORY_LABELS, TECHNICAL_CATEGORY_LABELS };

export type CatalogShoeTier =
  | "economico"
  | "intermediario"
  | "premium"
  | "performance";

export type CatalogCushioning = "macio" | "equilibrado" | "responsivo";
export type CatalogStability = "baixa" | "media" | "alta";

export type CushioningLevel = 1 | 2 | 3 | 4 | 5;
export type StabilityLevelNum = 1 | 2 | 3 | 4 | 5;

/** Entrada mínima no catálogo — categoria técnica é obrigatória */
export type CatalogShoeDef = {
  id: string;
  model: string;
  brand: string;
  price: number;
  /** Categoria técnica principal */
  category: TechnicalCategory;
  /** Categorias secundárias (cross-over) */
  secondaryCategories?: TechnicalCategory[];
  /** Overrides de defaults da categoria */
  tier?: CatalogShoeTier;
  hasPlate?: boolean;
  beginnerFriendly?: boolean;
  isAggressive?: boolean;
  cushioningType?: CatalogCushioning;
  stabilityLevel?: CatalogStability;
  cushioningLevel?: CushioningLevel;
  stabilityLevelNum?: StabilityLevelNum;
  rideFeel?: RideFeel;
  experienceLevel?: ExperienceLevel[];
  idealPace?: string;
  idealWeight?: WeightBandSlug[];
  versatilityScore?: number;
  valuePosition?: ValuePosition;
  generation?: "flagship" | "current" | "previous" | "standard";
  purpose?: string;
  comfortLevel?: string;
  bestUse?: string;
  /** Overrides de specs técnicos (peso, espuma, drop, etc.) */
  technical?: TechnicalSpecOverride;
  /** Flagship / topo de linha da marca na categoria */
  isFlagship?: boolean;
};

export type CatalogShoeInput = {
  id: string;
  name: string;
  brand: string;
  price: number;
  tier: CatalogShoeTier;
  /** Categoria técnica principal */
  category: TechnicalCategory;
  secondaryCategories: TechnicalCategory[];
  /** Legado — derivado da categoria técnica */
  lineCategory: LineCategory;
  modelLabel: string;
  hasPlate: boolean;
  beginnerFriendly: boolean;
  isAggressive: boolean;
  cushioningType: CatalogCushioning;
  stabilityLevel: CatalogStability;
  cushioningLevel: CushioningLevel;
  stabilityLevelNum: StabilityLevelNum;
  rideFeel: RideFeel;
  experienceLevel: ExperienceLevel[];
  idealPace: string;
  idealWeight: WeightBandSlug[];
  valuePosition: ValuePosition;
  generation: "flagship" | "current" | "previous" | "standard";
  versatilityScore: number;
  purpose: string;
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
  /** Inteligência técnica completa do modelo */
  technical: ShoeTechnicalSpec;
};
