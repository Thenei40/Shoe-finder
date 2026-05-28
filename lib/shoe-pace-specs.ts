import type {
  AggressivenessLevel,
  MetricLevel,
  TechnicalDemandLevel,
  TechnicalSpecOverride,
} from "./catalog-technical";

/** Segundos por km — ritmo mais rápido = valor menor */
export type PaceSpecOverride = Pick<
  TechnicalSpecOverride,
  | "idealPaceMinSec"
  | "idealPaceMaxSec"
  | "efficientPaceMaxSec"
  | "advancedOnly"
  | "cadenceDemand"
  | "efficiencyDemand"
  | "paceSensitivity"
  | "technicalDemandLevel"
>;

/** Overrides explícitos — super shoes, super trainers e dailies premium */
export const PACE_SHOE_OVERRIDES: Record<string, PaceSpecOverride> = {
  // —— SUPER SHOES EXTREMOS ——
  "adidas-adios-pro-evo-1": {
    idealPaceMinSec: 180,
    idealPaceMaxSec: 255,
    efficientPaceMaxSec: 270,
    advancedOnly: true,
    cadenceDemand: 5,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "adidas-adios-pro-4": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "adidas-prime-x-2": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 5,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "nike-alphafly-3": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 5,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "nike-vaporfly-3": {
    idealPaceMinSec: 180,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "asics-metaspeed-sky": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "asics-metaspeed-edge": {
    idealPaceMinSec: 180,
    idealPaceMaxSec: 255,
    efficientPaceMaxSec: 270,
    advancedOnly: true,
    cadenceDemand: 5,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "nb-sc-elite-v4": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "hoka-cielo-x1": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "saucony-endorphin-elite": {
    idealPaceMinSec: 180,
    idealPaceMaxSec: 255,
    efficientPaceMaxSec: 270,
    advancedOnly: true,
    cadenceDemand: 5,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "saucony-endorphin-pro-4": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 4,
    technicalDemandLevel: "elite_race_day",
  },
  "puma-fast-r-elite-2": {
    idealPaceMinSec: 180,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  "puma-deviate-elite-3": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 4,
    technicalDemandLevel: "elite_race_day",
  },
  "hoka-rocket-x-2": {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 4,
    paceSensitivity: 4,
    technicalDemandLevel: "agressivo",
  },
  "olympikus-corre-grafeno-3": {
    idealPaceMinSec: 210,
    idealPaceMaxSec: 285,
    efficientPaceMaxSec: 300,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 4,
    paceSensitivity: 4,
    technicalDemandLevel: "agressivo",
  },

  // —— SUPER TRAINERS ——
  "adidas-boston-13": {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 360,
    efficientPaceMaxSec: 390,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "saucony-endorphin-speed-4": {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 345,
    efficientPaceMaxSec: 375,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "mizuno-neo-vista": {
    idealPaceMinSec: 240,
    idealPaceMaxSec: 330,
    efficientPaceMaxSec: 360,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 4,
    paceSensitivity: 3,
    technicalDemandLevel: "agressivo",
  },
  "hoka-mach-x-2": {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 360,
    efficientPaceMaxSec: 390,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "nb-sc-trainer-v3": {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 360,
    efficientPaceMaxSec: 390,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "puma-deviate-3": {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 345,
    efficientPaceMaxSec: 375,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "asics-superblast-3": {
    idealPaceMinSec: 270,
    idealPaceMaxSec: 375,
    efficientPaceMaxSec: 405,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "asics-superblast-2": {
    idealPaceMinSec: 270,
    idealPaceMaxSec: 375,
    efficientPaceMaxSec: 405,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "nike-zoom-fly-6": {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 345,
    efficientPaceMaxSec: 375,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "agressivo",
  },
  "nike-pegasus-premium": {
    idealPaceMinSec: 285,
    idealPaceMaxSec: 390,
    efficientPaceMaxSec: 420,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 3,
    paceSensitivity: 2,
    technicalDemandLevel: "versatil",
  },
  "adidas-supernova-prima": {
    idealPaceMinSec: 285,
    idealPaceMaxSec: 390,
    efficientPaceMaxSec: 420,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 2,
    technicalDemandLevel: "versatil",
  },
  "nb-rebel-v4": {
    idealPaceMinSec: 270,
    idealPaceMaxSec: 375,
    efficientPaceMaxSec: 405,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "hoka-skyward-x": {
    idealPaceMinSec: 285,
    idealPaceMaxSec: 390,
    efficientPaceMaxSec: 420,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 3,
    paceSensitivity: 2,
    technicalDemandLevel: "versatil",
  },
  "saucony-kinvara-pro": {
    idealPaceMinSec: 270,
    idealPaceMaxSec: 360,
    efficientPaceMaxSec: 390,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  "asics-magic-speed-4": {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 345,
    efficientPaceMaxSec: 375,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "agressivo",
  },
  "mizuno-rebellion-pro": {
    idealPaceMinSec: 240,
    idealPaceMaxSec: 330,
    efficientPaceMaxSec: 360,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 4,
    paceSensitivity: 3,
    technicalDemandLevel: "agressivo",
  },

  // —— DAILY TRAINERS PREMIUM ——
  "nike-pegasus-41": {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 480,
    efficientPaceMaxSec: 540,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 1,
    technicalDemandLevel: "versatil",
  },
  "asics-nimbus-26": {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 510,
    efficientPaceMaxSec: 570,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
  "mizuno-rider-28": {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 480,
    efficientPaceMaxSec: 540,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 1,
    technicalDemandLevel: "versatil",
  },
  "saucony-triumph-22": {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 510,
    efficientPaceMaxSec: 570,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
  "hoka-clifton-10": {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 480,
    efficientPaceMaxSec: 540,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 1,
    technicalDemandLevel: "versatil",
  },
  "hoka-clifton-9": {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 480,
    efficientPaceMaxSec: 540,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 1,
    technicalDemandLevel: "versatil",
  },
  "asics-novablast-4": {
    idealPaceMinSec: 285,
    idealPaceMaxSec: 420,
    efficientPaceMaxSec: 450,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 2,
    technicalDemandLevel: "versatil",
  },
  "nike-invincible-3": {
    idealPaceMinSec: 315,
    idealPaceMaxSec: 540,
    efficientPaceMaxSec: 600,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
  "nb-1080v14": {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 510,
    efficientPaceMaxSec: 570,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
};

/** Defaults por categoria técnica quando não há override por modelo */
export const PACE_CATEGORY_DEFAULTS: Record<
  string,
  Required<
    Pick<
      PaceSpecOverride,
      | "idealPaceMinSec"
      | "idealPaceMaxSec"
      | "efficientPaceMaxSec"
      | "advancedOnly"
      | "cadenceDemand"
      | "efficiencyDemand"
      | "paceSensitivity"
      | "technicalDemandLevel"
    >
  >
> = {
  beginner: {
    idealPaceMinSec: 330,
    idealPaceMaxSec: 540,
    efficientPaceMaxSec: 600,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
  daily_trainer: {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 480,
    efficientPaceMaxSec: 540,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 1,
    technicalDemandLevel: "versatil",
  },
  premium_comfort: {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 510,
    efficientPaceMaxSec: 570,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
  max_cushion: {
    idealPaceMinSec: 315,
    idealPaceMaxSec: 540,
    efficientPaceMaxSec: 600,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
  super_trainer: {
    idealPaceMinSec: 270,
    idealPaceMaxSec: 375,
    efficientPaceMaxSec: 405,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  speed_trainer: {
    idealPaceMinSec: 255,
    idealPaceMaxSec: 345,
    efficientPaceMaxSec: 375,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "agressivo",
  },
  race_day: {
    idealPaceMinSec: 195,
    idealPaceMaxSec: 270,
    efficientPaceMaxSec: 285,
    advancedOnly: true,
    cadenceDemand: 4,
    efficiencyDemand: 5,
    paceSensitivity: 5,
    technicalDemandLevel: "elite_race_day",
  },
  lightweight: {
    idealPaceMinSec: 270,
    idealPaceMaxSec: 360,
    efficientPaceMaxSec: 390,
    advancedOnly: false,
    cadenceDemand: 3,
    efficiencyDemand: 3,
    paceSensitivity: 3,
    technicalDemandLevel: "responsivo",
  },
  stability: {
    idealPaceMinSec: 300,
    idealPaceMaxSec: 480,
    efficientPaceMaxSec: 540,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 1,
    technicalDemandLevel: "versatil",
  },
  recovery: {
    idealPaceMinSec: 330,
    idealPaceMaxSec: 570,
    efficientPaceMaxSec: 630,
    advancedOnly: false,
    cadenceDemand: 1,
    efficiencyDemand: 1,
    paceSensitivity: 1,
    technicalDemandLevel: "confortavel",
  },
};

export function defaultPaceFromAggressiveness(
  agg?: AggressivenessLevel,
): TechnicalDemandLevel {
  switch (agg) {
    case "race_day_extremo":
      return "elite_race_day";
    case "agressivo":
      return "agressivo";
    case "responsivo":
      return "responsivo";
    case "equilibrado":
      return "versatil";
    default:
      return "confortavel";
  }
}

export function resolvePaceFields(
  shoeId: string,
  category: string,
  aggressiveness?: AggressivenessLevel,
  override?: Partial<PaceSpecOverride>,
): Required<
  Pick<
    PaceSpecOverride,
    | "idealPaceMinSec"
    | "idealPaceMaxSec"
    | "efficientPaceMaxSec"
    | "advancedOnly"
    | "cadenceDemand"
    | "efficiencyDemand"
    | "paceSensitivity"
    | "technicalDemandLevel"
  >
> {
  const catDefaults =
    PACE_CATEGORY_DEFAULTS[category] ?? PACE_CATEGORY_DEFAULTS.daily_trainer;
  const shoeOverride = PACE_SHOE_OVERRIDES[shoeId] ?? {};

  const merged = { ...catDefaults, ...shoeOverride, ...override };

  return {
    idealPaceMinSec: merged.idealPaceMinSec ?? catDefaults.idealPaceMinSec,
    idealPaceMaxSec: merged.idealPaceMaxSec ?? catDefaults.idealPaceMaxSec,
    efficientPaceMaxSec:
      merged.efficientPaceMaxSec ?? catDefaults.efficientPaceMaxSec,
    advancedOnly: merged.advancedOnly ?? catDefaults.advancedOnly,
    cadenceDemand: (merged.cadenceDemand ??
      catDefaults.cadenceDemand) as MetricLevel,
    efficiencyDemand: (merged.efficiencyDemand ??
      catDefaults.efficiencyDemand) as MetricLevel,
    paceSensitivity: (merged.paceSensitivity ??
      catDefaults.paceSensitivity) as MetricLevel,
    technicalDemandLevel:
      merged.technicalDemandLevel ??
      defaultPaceFromAggressiveness(aggressiveness),
  };
}
