import type { WeightBandSlug } from "./weight";

/** Categorias técnicas de corrida — classificação principal do catálogo */
export type TechnicalCategory =
  | "daily_trainer"
  | "super_trainer"
  | "race_day"
  | "speed_trainer"
  | "max_cushion"
  | "stability"
  | "recovery"
  | "beginner"
  | "lightweight"
  | "premium_comfort";

/** Sensação da passada */
export type RideFeel = "macio" | "equilibrado" | "firme" | "agressivo";

/** Nível de experiência recomendado para o modelo */
export type ExperienceLevel =
  | "iniciante"
  | "intermediario"
  | "avancado"
  | "elite";

/** Posicionamento comercial / geração */
export type ValuePosition =
  | "economico"
  | "custo-beneficio"
  | "premium"
  | "linha-atual"
  | "geracao-anterior";

/** Legado — mapeado automaticamente a partir da categoria técnica */
export type LineCategory =
  | "entrada"
  | "treino-diario"
  | "daily-premium"
  | "estabilidade"
  | "max-cushion"
  | "performance"
  | "prova"
  | "super-shoe";

export const TECHNICAL_CATEGORY_LABELS: Record<TechnicalCategory, string> = {
  daily_trainer: "Daily trainer",
  super_trainer: "Super trainer",
  race_day: "Super tênis de prova",
  speed_trainer: "Tênis de velocidade",
  max_cushion: "Amortecimento máximo",
  stability: "Estabilidade",
  recovery: "Recuperação",
  beginner: "Iniciante",
  lightweight: "Leve / ágil",
  premium_comfort: "Conforto premium",
};

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

/** Mapeia categoria técnica → categoria legada (quiz / scoring) */
export const TECHNICAL_TO_LINE: Record<TechnicalCategory, LineCategory> = {
  beginner: "entrada",
  daily_trainer: "treino-diario",
  super_trainer: "daily-premium",
  premium_comfort: "max-cushion",
  max_cushion: "max-cushion",
  recovery: "max-cushion",
  stability: "estabilidade",
  lightweight: "performance",
  speed_trainer: "performance",
  race_day: "super-shoe",
};

export type CategoryDefaults = {
  lineCategory: LineCategory;
  tier: "economico" | "intermediario" | "premium" | "performance";
  beginnerFriendly: boolean;
  isAggressive: boolean;
  hasPlate: boolean;
  cushioningType: "macio" | "equilibrado" | "responsivo";
  stabilityLevel: "baixa" | "media" | "alta";
  cushioningLevel: 1 | 2 | 3 | 4 | 5;
  stabilityLevelNum: 1 | 2 | 3 | 4 | 5;
  rideFeel: RideFeel;
  versatilityScore: number;
  experienceLevel: ExperienceLevel[];
  idealPace: string;
  idealWeight: WeightBandSlug[];
  valuePosition: ValuePosition;
  isRaceShoe: boolean;
  isSuperTrainer: boolean;
};

export const TECHNICAL_CATEGORY_DEFAULTS: Record<TechnicalCategory, CategoryDefaults> = {
  beginner: {
    lineCategory: "entrada",
    tier: "economico",
    beginnerFriendly: true,
    isAggressive: false,
    hasPlate: false,
    cushioningType: "macio",
    stabilityLevel: "media",
    cushioningLevel: 3,
    stabilityLevelNum: 3,
    rideFeel: "macio",
    versatilityScore: 4,
    experienceLevel: ["iniciante"],
    idealPace: "5:45/km ou mais lento",
    idealWeight: ["60-70", "70-80", "80-90", "90-100", "100-110"],
    valuePosition: "economico",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  daily_trainer: {
    lineCategory: "treino-diario",
    tier: "intermediario",
    beginnerFriendly: true,
    isAggressive: false,
    hasPlate: false,
    cushioningType: "equilibrado",
    stabilityLevel: "media",
    cushioningLevel: 3,
    stabilityLevelNum: 3,
    rideFeel: "equilibrado",
    versatilityScore: 5,
    experienceLevel: ["iniciante", "intermediario", "avancado"],
    idealPace: "4:45–6:00/km",
    idealWeight: ["60-70", "70-80", "80-90", "90-100"],
    valuePosition: "custo-beneficio",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  super_trainer: {
    lineCategory: "daily-premium",
    tier: "intermediario",
    beginnerFriendly: false,
    isAggressive: false,
    hasPlate: false,
    cushioningType: "responsivo",
    stabilityLevel: "media",
    cushioningLevel: 4,
    stabilityLevelNum: 3,
    rideFeel: "firme",
    versatilityScore: 4,
    experienceLevel: ["intermediario", "avancado"],
    idealPace: "4:15–5:30/km",
    idealWeight: ["60-70", "70-80", "80-90"],
    valuePosition: "linha-atual",
    isRaceShoe: false,
    isSuperTrainer: true,
  },
  premium_comfort: {
    lineCategory: "max-cushion",
    tier: "premium",
    beginnerFriendly: true,
    isAggressive: false,
    hasPlate: false,
    cushioningType: "macio",
    stabilityLevel: "media",
    cushioningLevel: 5,
    stabilityLevelNum: 3,
    rideFeel: "macio",
    versatilityScore: 4,
    experienceLevel: ["iniciante", "intermediario", "avancado"],
    idealPace: "5:00/km ou mais lento",
    idealWeight: ["70-80", "80-90", "90-100", "100-110", "acima-110"],
    valuePosition: "premium",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  max_cushion: {
    lineCategory: "max-cushion",
    tier: "premium",
    beginnerFriendly: true,
    isAggressive: false,
    hasPlate: false,
    cushioningType: "macio",
    stabilityLevel: "media",
    cushioningLevel: 5,
    stabilityLevelNum: 3,
    rideFeel: "macio",
    versatilityScore: 3,
    experienceLevel: ["iniciante", "intermediario"],
    idealPace: "5:15/km ou mais lento",
    idealWeight: ["80-90", "90-100", "100-110", "acima-110"],
    valuePosition: "premium",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  recovery: {
    lineCategory: "max-cushion",
    tier: "premium",
    beginnerFriendly: true,
    isAggressive: false,
    hasPlate: false,
    cushioningType: "macio",
    stabilityLevel: "media",
    cushioningLevel: 5,
    stabilityLevelNum: 3,
    rideFeel: "macio",
    versatilityScore: 2,
    experienceLevel: ["iniciante", "intermediario", "avancado"],
    idealPace: "6:00/km ou mais lento (regenerativo)",
    idealWeight: ["70-80", "80-90", "90-100", "100-110", "acima-110"],
    valuePosition: "premium",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  stability: {
    lineCategory: "estabilidade",
    tier: "intermediario",
    beginnerFriendly: true,
    isAggressive: false,
    hasPlate: false,
    cushioningType: "macio",
    stabilityLevel: "alta",
    cushioningLevel: 4,
    stabilityLevelNum: 5,
    rideFeel: "equilibrado",
    versatilityScore: 4,
    experienceLevel: ["iniciante", "intermediario", "avancado"],
    idealPace: "5:00–6:30/km",
    idealWeight: ["70-80", "80-90", "90-100", "100-110", "acima-110"],
    valuePosition: "custo-beneficio",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  lightweight: {
    lineCategory: "performance",
    tier: "intermediario",
    beginnerFriendly: false,
    isAggressive: true,
    hasPlate: false,
    cushioningType: "responsivo",
    stabilityLevel: "baixa",
    cushioningLevel: 2,
    stabilityLevelNum: 2,
    rideFeel: "agressivo",
    versatilityScore: 3,
    experienceLevel: ["intermediario", "avancado"],
    idealPace: "4:00–5:00/km",
    idealWeight: ["ate-60", "60-70", "70-80"],
    valuePosition: "linha-atual",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  speed_trainer: {
    lineCategory: "performance",
    tier: "intermediario",
    beginnerFriendly: false,
    isAggressive: true,
    hasPlate: false,
    cushioningType: "responsivo",
    stabilityLevel: "media",
    cushioningLevel: 3,
    stabilityLevelNum: 3,
    rideFeel: "firme",
    versatilityScore: 3,
    experienceLevel: ["intermediario", "avancado"],
    idealPace: "3:50–5:00/km",
    idealWeight: ["ate-60", "60-70", "70-80", "80-90"],
    valuePosition: "linha-atual",
    isRaceShoe: false,
    isSuperTrainer: false,
  },
  race_day: {
    lineCategory: "super-shoe",
    tier: "performance",
    beginnerFriendly: false,
    isAggressive: true,
    hasPlate: true,
    cushioningType: "responsivo",
    stabilityLevel: "baixa",
    cushioningLevel: 4,
    stabilityLevelNum: 2,
    rideFeel: "agressivo",
    versatilityScore: 2,
    experienceLevel: ["avancado", "elite"],
    idealPace: "3:30–4:45/km",
    idealWeight: ["ate-60", "60-70", "70-80"],
    valuePosition: "premium",
    isRaceShoe: true,
    isSuperTrainer: false,
  },
};

/** Categorias que favorecem corredores mais pesados */
export const HEAVY_RUNNER_CATEGORIES = new Set<TechnicalCategory>([
  "stability",
  "max_cushion",
  "recovery",
  "premium_comfort",
]);

/** Categorias que favorecem corredores leves / rápidos */
export const LIGHT_RUNNER_CATEGORIES = new Set<TechnicalCategory>([
  "lightweight",
  "speed_trainer",
  "race_day",
  "super_trainer",
]);

/** Categorias ideais para iniciantes — priorizar sobre super tênis */
export const BEGINNER_FRIENDLY_CATEGORIES = new Set<TechnicalCategory>([
  "beginner",
  "daily_trainer",
  "stability",
  "max_cushion",
  "premium_comfort",
  "recovery",
]);

export function lineCategoryForTechnical(
  category: TechnicalCategory,
): LineCategory {
  return TECHNICAL_TO_LINE[category];
}

export function isRaceCategory(category: TechnicalCategory): boolean {
  return TECHNICAL_CATEGORY_DEFAULTS[category].isRaceShoe;
}
