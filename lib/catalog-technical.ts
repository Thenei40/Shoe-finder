import type { ExperienceLevel, TechnicalCategory } from "./catalog-categories";

/** Tecnologias de entressola conhecidas no mercado */
export type FoamTechnology =
  | "eva"
  | "eva_comfort"
  | "react"
  | "zoomx"
  | "peba"
  | "lightstrike"
  | "lightstrike_pro"
  | "ff_blast"
  | "ff_blast_plus"
  | "ff_turbo"
  | "ff_turbo_plus"
  | "nitro"
  | "nitro_elite"
  | "enerzy"
  | "enerzy_nxt"
  | "fresh_foam_x"
  | "fuelcell"
  | "pwrrun"
  | "pwrrun_pb"
  | "cmeva"
  | "dream_tpu";

export type PlateType = "carbon" | "energy_rod" | "composite" | "none";

/** Nível de agressividade da plataforma */
export type AggressivenessLevel =
  | "confortavel"
  | "equilibrado"
  | "responsivo"
  | "agressivo"
  | "race_day_extremo";

/** Usos de treino/prova recomendados */
export type TrainingUse =
  | "rodagem_diaria"
  | "longao"
  | "regenerativo"
  | "treino_ritmo"
  | "intervalado"
  | "prova_curta"
  | "meia_maratona"
  | "maratona";

export type GaitSupport = "neutral" | "guidance" | "stability" | "max_stability";

export type RockerProfile = "none" | "moderate" | "meta_rocker" | "toe_spring";

export type VolumeHandling = "low" | "medium" | "high" | "race_only";

export type AdaptationLevel = "nenhuma" | "moderada" | "alta" | "elite";

/** Nível de exigência técnica / sensibilidade a ritmo */
export type TechnicalDemandLevel =
  | "confortavel"
  | "versatil"
  | "responsivo"
  | "agressivo"
  | "elite_race_day";

export type MetricLevel = 1 | 2 | 3 | 4 | 5;

export const ADAPTATION_LABELS: Record<AdaptationLevel, string> = {
  nenhuma: "Nenhuma adaptação especial",
  moderada: "Adaptação moderada recomendada",
  alta: "Exige base de corrida consolidada",
  elite: "Exige técnica avançada e treinos específicos",
};

export const TECHNICAL_DEMAND_LABELS: Record<TechnicalDemandLevel, string> = {
  confortavel: "Confortável",
  versatil: "Versátil",
  responsivo: "Responsivo",
  agressivo: "Agressivo",
  elite_race_day: "Elite race day",
};

export const FOAM_LABELS: Record<FoamTechnology, string> = {
  eva: "EVA tradicional",
  eva_comfort: "EVA macio (conforto)",
  react: "Nike React",
  zoomx: "Nike ZoomX",
  peba: "PEBA / superfoam",
  lightstrike: "Adidas Lightstrike",
  lightstrike_pro: "Adidas Lightstrike Pro",
  ff_blast: "Asics FF Blast",
  ff_blast_plus: "Asics FF Blast+",
  ff_turbo: "Asics FF Turbo",
  ff_turbo_plus: "Asics FF Turbo+",
  nitro: "Puma Nitro",
  nitro_elite: "Puma Nitro Elite",
  enerzy: "Mizuno Enerzy",
  enerzy_nxt: "Mizuno Enerzy Nxt",
  fresh_foam_x: "New Balance Fresh Foam X",
  fuelcell: "New Balance FuelCell",
  pwrrun: "Saucony PWRRUN+",
  pwrrun_pb: "Saucony PWRRUN PB (PEBA)",
  cmeva: "Hoka CMEVA",
  dream_tpu: "Saucony Dream TPU",
};

export const AGGRESSIVENESS_LABELS: Record<AggressivenessLevel, string> = {
  confortavel: "Confortável",
  equilibrado: "Equilibrado",
  responsivo: "Responsivo",
  agressivo: "Agressivo",
  race_day_extremo: "Race day extremo",
};

export const TRAINING_USE_LABELS: Record<TrainingUse, string> = {
  rodagem_diaria: "Rodagem diária",
  longao: "Longão",
  regenerativo: "Regenerativo",
  treino_ritmo: "Treino de ritmo",
  intervalado: "Intervalado",
  prova_curta: "Prova curta (5–10 km)",
  meia_maratona: "Meia maratona",
  maratona: "Maratona",
};

export type ShoeTechnicalSpec = {
  weightGrams: number;
  foamMidsole: FoamTechnology;
  foamSecondary?: FoamTechnology;
  hasPlate: boolean;
  plateType: PlateType;
  aggressiveness: AggressivenessLevel;
  stability: MetricLevel;
  softness: MetricLevel;
  responsiveness: MetricLevel;
  durability: MetricLevel;
  dropMm: number;
  stackHeelMm: number;
  stackForefootMm: number;
  rocker: RockerProfile;
  idealUses: TrainingUse[];
  gaitSupport: GaitSupport;
  volumeHandling: VolumeHandling;
  idealRunnerLevel: ExperienceLevel[];
  rideDescription: string;
  gaitDescription: string;
  volumeNotes: string;
  realStrengths: string[];
  realLimitations: string[];
  modelDifferentiator: string;
  adaptationLevel: AdaptationLevel;
  isFlagship: boolean;
  energyReturn: MetricLevel;
  /** Ritmo mais rápido da faixa ideal (seg/km — menor = mais rápido) */
  idealPaceMinSec: number;
  /** Ritmo mais lento da faixa ideal (seg/km) */
  idealPaceMaxSec: number;
  /** Acima deste ritmo (mais lento) a tecnologia perde benefício relevante */
  efficientPaceMaxSec: number;
  advancedOnly: boolean;
  cadenceDemand: MetricLevel;
  efficiencyDemand: MetricLevel;
  paceSensitivity: MetricLevel;
  technicalDemandLevel: TechnicalDemandLevel;
};

export type TechnicalSpecOverride = Partial<ShoeTechnicalSpec> & {
  foamMidsole?: FoamTechnology;
};

/** Espuma padrão por marca (linha principal) */
export const BRAND_DEFAULT_FOAM: Record<string, FoamTechnology> = {
  Adidas: "lightstrike",
  Nike: "react",
  Asics: "ff_blast",
  Mizuno: "enerzy",
  Puma: "nitro",
  Olympikus: "eva",
  "New Balance": "fresh_foam_x",
  Saucony: "pwrrun",
  Hoka: "cmeva",
};

/** Defaults técnicos por categoria */
export const CATEGORY_TECH_DEFAULTS: Record<
  TechnicalCategory,
  Omit<
    ShoeTechnicalSpec,
    | "rideDescription"
    | "gaitDescription"
    | "volumeNotes"
    | "realStrengths"
    | "realLimitations"
    | "modelDifferentiator"
    | "adaptationLevel"
    | "isFlagship"
    | "energyReturn"
    | "idealPaceMinSec"
    | "idealPaceMaxSec"
    | "efficientPaceMaxSec"
    | "advancedOnly"
    | "cadenceDemand"
    | "efficiencyDemand"
    | "paceSensitivity"
    | "technicalDemandLevel"
  >
> = {
  beginner: {
    weightGrams: 290,
    foamMidsole: "eva_comfort",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "confortavel",
    stability: 3,
    softness: 4,
    responsiveness: 2,
    durability: 4,
    dropMm: 10,
    stackHeelMm: 32,
    stackForefootMm: 24,
    rocker: "moderate",
    idealUses: ["rodagem_diaria", "regenerativo"],
    gaitSupport: "neutral",
    volumeHandling: "medium",
    idealRunnerLevel: ["iniciante"],
  },
  daily_trainer: {
    weightGrams: 275,
    foamMidsole: "eva",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "equilibrado",
    stability: 3,
    softness: 3,
    responsiveness: 3,
    durability: 5,
    dropMm: 8,
    stackHeelMm: 34,
    stackForefootMm: 26,
    rocker: "moderate",
    idealUses: ["rodagem_diaria", "longao"],
    gaitSupport: "neutral",
    volumeHandling: "high",
    idealRunnerLevel: ["iniciante", "intermediario", "avancado"],
  },
  super_trainer: {
    weightGrams: 265,
    foamMidsole: "peba",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "responsivo",
    stability: 3,
    softness: 3,
    responsiveness: 4,
    durability: 4,
    dropMm: 8,
    stackHeelMm: 38,
    stackForefootMm: 32,
    rocker: "meta_rocker",
    idealUses: ["rodagem_diaria", "treino_ritmo", "intervalado"],
    gaitSupport: "neutral",
    volumeHandling: "high",
    idealRunnerLevel: ["intermediario", "avancado"],
  },
  speed_trainer: {
    weightGrams: 250,
    foamMidsole: "peba",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "agressivo",
    stability: 3,
    softness: 2,
    responsiveness: 4,
    durability: 3,
    dropMm: 6,
    stackHeelMm: 36,
    stackForefootMm: 30,
    rocker: "meta_rocker",
    idealUses: ["treino_ritmo", "intervalado", "prova_curta"],
    gaitSupport: "neutral",
    volumeHandling: "medium",
    idealRunnerLevel: ["intermediario", "avancado"],
  },
  race_day: {
    weightGrams: 220,
    foamMidsole: "peba",
    hasPlate: true,
    plateType: "carbon",
    aggressiveness: "race_day_extremo",
    stability: 2,
    softness: 3,
    responsiveness: 5,
    durability: 2,
    dropMm: 8,
    stackHeelMm: 40,
    stackForefootMm: 34,
    rocker: "meta_rocker",
    idealUses: ["prova_curta", "meia_maratona", "maratona"],
    gaitSupport: "neutral",
    volumeHandling: "race_only",
    idealRunnerLevel: ["avancado", "elite"],
  },
  max_cushion: {
    weightGrams: 295,
    foamMidsole: "eva_comfort",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "confortavel",
    stability: 3,
    softness: 5,
    responsiveness: 2,
    durability: 4,
    dropMm: 6,
    stackHeelMm: 38,
    stackForefootMm: 34,
    rocker: "meta_rocker",
    idealUses: ["rodagem_diaria", "longao", "regenerativo"],
    gaitSupport: "neutral",
    volumeHandling: "high",
    idealRunnerLevel: ["iniciante", "intermediario"],
  },
  stability: {
    weightGrams: 285,
    foamMidsole: "eva",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "equilibrado",
    stability: 5,
    softness: 4,
    responsiveness: 2,
    durability: 5,
    dropMm: 8,
    stackHeelMm: 36,
    stackForefootMm: 28,
    rocker: "moderate",
    idealUses: ["rodagem_diaria", "longao"],
    gaitSupport: "stability",
    volumeHandling: "high",
    idealRunnerLevel: ["iniciante", "intermediario", "avancado"],
  },
  recovery: {
    weightGrams: 300,
    foamMidsole: "eva_comfort",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "confortavel",
    stability: 3,
    softness: 5,
    responsiveness: 1,
    durability: 3,
    dropMm: 5,
    stackHeelMm: 40,
    stackForefootMm: 36,
    rocker: "meta_rocker",
    idealUses: ["regenerativo", "longao"],
    gaitSupport: "neutral",
    volumeHandling: "medium",
    idealRunnerLevel: ["iniciante", "intermediario", "avancado"],
  },
  lightweight: {
    weightGrams: 235,
    foamMidsole: "peba",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "agressivo",
    stability: 2,
    softness: 2,
    responsiveness: 5,
    durability: 3,
    dropMm: 6,
    stackHeelMm: 30,
    stackForefootMm: 26,
    rocker: "toe_spring",
    idealUses: ["treino_ritmo", "intervalado", "prova_curta"],
    gaitSupport: "neutral",
    volumeHandling: "medium",
    idealRunnerLevel: ["intermediario", "avancado"],
  },
  premium_comfort: {
    weightGrams: 285,
    foamMidsole: "eva_comfort",
    hasPlate: false,
    plateType: "none",
    aggressiveness: "confortavel",
    stability: 3,
    softness: 5,
    responsiveness: 2,
    durability: 4,
    dropMm: 8,
    stackHeelMm: 38,
    stackForefootMm: 30,
    rocker: "moderate",
    idealUses: ["rodagem_diaria", "longao", "regenerativo"],
    gaitSupport: "neutral",
    volumeHandling: "high",
    idealRunnerLevel: ["iniciante", "intermediario", "avancado"],
  },
};

export function aggressivenessIndex(level: AggressivenessLevel): number {
  const order: AggressivenessLevel[] = [
    "confortavel",
    "equilibrado",
    "responsivo",
    "agressivo",
    "race_day_extremo",
  ];
  return order.indexOf(level);
}

export function foamIsPebaBased(foam: FoamTechnology): boolean {
  return [
    "peba",
    "zoomx",
    "lightstrike_pro",
    "ff_turbo",
    "ff_turbo_plus",
    "nitro_elite",
    "pwrrun_pb",
    "fuelcell",
  ].includes(foam);
}

export function foamIsSoft(foam: FoamTechnology): boolean {
  return ["eva_comfort", "cmeva", "fresh_foam_x", "pwrrun"].includes(foam);
}

export function foamIsResponsive(foam: FoamTechnology): boolean {
  return foamIsPebaBased(foam) || ["react", "nitro", "enerzy_nxt", "ff_blast_plus"].includes(foam);
}
