import {
  isRaceCategory,
  type TechnicalCategory,
} from "./catalog-categories";
import {
  bandDistance,
  isBandAtOrAbove,
  isPriceBandSlug,
  isPriceInBand,
  priceBandIndex,
  primaryPriceBand,
  type PriceBandSlug,
} from "./prices";
import { getShoeProfile } from "./shoe-scores";
import type { FormAnswers, Shoe } from "./shoes";

export type ModelGeneration = "flagship" | "current" | "previous" | "standard";

export type RecommendationBadge =
  | "Melhor custo-benefício"
  | "Melhor tecnologia"
  | "Melhor para evoluir"
  | "Premium"
  | "Excelente compra"
  | "Geração anterior"
  | "Melhor equilíbrio";

export type ShoeIntelligence = {
  generation: ModelGeneration;
  performanceScore: number;
  techScore: number;
  isEliteSuperShoe: boolean;
  isAccessiblePremium: boolean;
  minRecommendedBand: PriceBandSlug;
};

export type DimensionalScores = {
  profile: number;
  costBenefit: number;
  performance: number;
  tech: number;
  budgetFit: number;
  total: number;
};

/** Metadados explícitos — supershoes topo de linha e gerações anteriores com bom valor */
const SHOE_INTELLIGENCE: Record<string, Partial<ShoeIntelligence>> = {
  "nike-alphafly-3": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "nike-vaporfly-3": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "nike-pegasus-premium": {
    generation: "flagship",
    performanceScore: 4,
    techScore: 5,
    minRecommendedBand: "1000-1400",
  },
  "nike-vomero-17": {
    generation: "previous",
    performanceScore: 3,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1000-1400",
  },
  "nike-zoom-fly-6": {
    generation: "current",
    performanceScore: 4,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1000-1400",
  },
  "nike-pegasus-41": {
    generation: "current",
    performanceScore: 3,
    techScore: 4,
    minRecommendedBand: "700-1000",
  },
  "adidas-adios-pro-evo-1": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "adidas-adios-pro-4": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "adidas-adios-pro-3": {
    generation: "previous",
    performanceScore: 5,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1400-1800",
  },
  "adidas-prime-x-2": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "adidas-supernova-prima": {
    generation: "flagship",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "adidas-boston-13": {
    generation: "current",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "adidas-adios-8": {
    generation: "current",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "adidas-ultraboost-5x": {
    generation: "flagship",
    performanceScore: 3,
    techScore: 4,
    minRecommendedBand: "1400-1800",
  },
  "adidas-supernova-rise": {
    generation: "current",
    performanceScore: 3,
    techScore: 3,
    minRecommendedBand: "700-1000",
  },
  "asics-superblast-3": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    minRecommendedBand: "1400-1800",
  },
  "asics-superblast-2": {
    generation: "previous",
    performanceScore: 4,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1000-1400",
  },
  "asics-metaspeed-sky": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "asics-metaspeed-edge": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "asics-cumulus-26": {
    generation: "current",
    performanceScore: 3,
    techScore: 3,
    minRecommendedBand: "700-1000",
  },
  "nb-sc-elite-v4": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "nb-sc-trainer-v3": {
    generation: "current",
    performanceScore: 4,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1000-1400",
  },
  "nb-rebel-v4": {
    generation: "flagship",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "nb-rebel-v3": {
    generation: "previous",
    performanceScore: 4,
    techScore: 3,
    isAccessiblePremium: true,
    minRecommendedBand: "700-1000",
  },
  "saucony-endorphin-elite": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "saucony-endorphin-pro-4": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "saucony-endorphin-speed-4": {
    generation: "current",
    performanceScore: 4,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1000-1400",
  },
  "saucony-kinvara-pro": {
    generation: "flagship",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "hoka-cielo-x1": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "hoka-skyward-x": {
    generation: "flagship",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1400-1800",
  },
  "hoka-mach-x-2": {
    generation: "current",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "hoka-clifton-10": {
    generation: "flagship",
    performanceScore: 3,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "hoka-clifton-9": {
    generation: "previous",
    performanceScore: 3,
    techScore: 3,
    isAccessiblePremium: true,
    minRecommendedBand: "700-1000",
  },
  "hoka-rocket-x-2": {
    generation: "current",
    performanceScore: 5,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1400-1800",
  },
  "puma-deviate-elite-3": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "puma-deviate-elite": {
    generation: "previous",
    performanceScore: 4,
    techScore: 4,
    isAccessiblePremium: true,
    minRecommendedBand: "1400-1800",
  },
  "puma-deviate-3": {
    generation: "current",
    performanceScore: 4,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "puma-deviate-2": {
    generation: "previous",
    performanceScore: 4,
    techScore: 3,
    isAccessiblePremium: true,
    minRecommendedBand: "1000-1400",
  },
  "puma-fast-r-elite-2": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "puma-magmax-nitro": {
    generation: "flagship",
    performanceScore: 3,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "mizuno-neo-vista": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 5,
    isEliteSuperShoe: true,
    minRecommendedBand: "1800-2500",
  },
  "mizuno-rebellion-pro": {
    generation: "flagship",
    performanceScore: 5,
    techScore: 4,
    isEliteSuperShoe: true,
    minRecommendedBand: "1400-1800",
  },
  "mizuno-rider-28": {
    generation: "flagship",
    performanceScore: 3,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "mizuno-sky-7": {
    generation: "flagship",
    performanceScore: 3,
    techScore: 4,
    minRecommendedBand: "1000-1400",
  },
  "olympikus-corre-grafeno-3": {
    generation: "current",
    performanceScore: 4,
    techScore: 3,
    isAccessiblePremium: true,
    minRecommendedBand: "700-1000",
  },
};

function defaultMinBandForShoe(shoe: Shoe): PriceBandSlug {
  if (isRaceCategory(shoe.category)) return "1800-2500";
  if (shoe.category === "super_trainer" || shoe.category === "speed_trainer") {
    return "1000-1400";
  }
  if (shoe.category === "max_cushion" || shoe.category === "premium_comfort") {
    return "1000-1400";
  }
  if (shoe.category === "recovery") return "1000-1400";
  if (shoe.tier === "performance" || shoe.hasPlate) return "1000-1400";
  return "ate-400";
}

function defaultGeneration(shoe: Shoe): ModelGeneration {
  if (shoe.generation && shoe.generation !== "standard") return shoe.generation;
  if (isRaceCategory(shoe.category)) return "current";
  if (shoe.tier === "economico") return "standard";
  if (shoe.tier === "performance" || shoe.hasPlate) return "current";
  return "standard";
}

function defaultPerformanceScore(shoe: Shoe): number {
  if (isRaceCategory(shoe.category)) return 5;
  if (shoe.category === "super_trainer") return 4;
  if (shoe.category === "speed_trainer" || shoe.hasPlate) return 4;
  if (shoe.category === "lightweight" || shoe.isAggressive) return 3;
  if (shoe.category === "daily_trainer") return 2;
  return 2;
}

function defaultTechScore(shoe: Shoe): number {
  if (isRaceCategory(shoe.category)) return 5;
  if (shoe.category === "super_trainer") return 4;
  if (shoe.hasPlate) return 4;
  if (shoe.tier === "premium" || shoe.tier === "performance") return 3;
  if (shoe.tier === "intermediario") return 3;
  return 2;
}

export function getShoeIntelligence(shoe: Shoe): ShoeIntelligence {
  const override = SHOE_INTELLIGENCE[shoe.id];
  const generation = override?.generation ?? defaultGeneration(shoe);

  return {
    generation,
    performanceScore: override?.performanceScore ?? defaultPerformanceScore(shoe),
    techScore: override?.techScore ?? defaultTechScore(shoe),
    isEliteSuperShoe:
      override?.isEliteSuperShoe ??
      (isRaceCategory(shoe.category) && generation === "flagship"),
    isAccessiblePremium:
      override?.isAccessiblePremium ??
      (shoe.valuePosition === "geracao-anterior" ||
        shoe.valuePosition === "custo-beneficio"),
    minRecommendedBand:
      override?.minRecommendedBand ?? defaultMinBandForShoe(shoe),
  };
}

function userPriceBand(answers: FormAnswers): PriceBandSlug | null {
  if (!answers.price || !isPriceBandSlug(answers.price)) return null;
  return answers.price;
}

export function scoreBudgetFit(
  shoe: Shoe,
  answers: FormAnswers,
  intelligence: ShoeIntelligence,
): number {
  const userBand = userPriceBand(answers);
  if (!userBand) return 0;

  const shoeBand = primaryPriceBand(shoe.price);
  const distance = bandDistance(userBand, shoeBand);
  let score = 0;

  if (isPriceInBand(shoe.price, userBand)) score += 22;
  else if (distance === 1) {
    if (priceBandIndex(shoeBand) < priceBandIndex(userBand)) score += 10;
    else score += 4;
  } else if (distance === 2) score -= 8;
  else score -= 14 * (distance - 1);

  if (
    intelligence.isEliteSuperShoe &&
    !isBandAtOrAbove(userBand, intelligence.minRecommendedBand)
  ) {
    score -= 45;
  }

  if (
    !isBandAtOrAbove(userBand, intelligence.minRecommendedBand) &&
    isRaceCategory(shoe.category)
  ) {
    score -= 25;
  }

  if (
    intelligence.isAccessiblePremium &&
    isBandAtOrAbove(userBand, intelligence.minRecommendedBand)
  ) {
    score += 8;
  }

  if (intelligence.generation === "previous" && isPriceInBand(shoe.price, userBand)) {
    score += 6;
  }

  if (
    shoe.valuePosition === "custo-beneficio" &&
    isPriceInBand(shoe.price, userBand)
  ) {
    score += 5;
  }

  return score;
}

export function scoreCostBenefit(
  shoe: Shoe,
  answers: FormAnswers,
  intelligence: ShoeIntelligence,
): number {
  const profile = getShoeProfile(shoe.id, shoe);
  if (!profile) return 0;

  let score = profile.valueScore * 4;
  score += shoe.versatilityScore * 2.5;

  const userBand = userPriceBand(answers);
  if (userBand && isPriceInBand(shoe.price, userBand)) score += 12;

  if (intelligence.isAccessiblePremium) score += 8;
  if (intelligence.generation === "previous" && userBand) {
    if (isPriceInBand(shoe.price, userBand)) score += 10;
    else if (bandDistance(userBand, primaryPriceBand(shoe.price)) === 1) score += 4;
  }

  if (intelligence.isEliteSuperShoe) score -= 6;

  if (
    shoe.valuePosition === "economico" ||
    shoe.valuePosition === "custo-beneficio" ||
    shoe.category === "beginner"
  ) {
    score += 5;
  }
  if (shoe.category === "daily_trainer" && shoe.versatilityScore >= 4) score += 4;
  if (shoe.valuePosition === "geracao-anterior") score += 6;

  return Math.round(score);
}

export function scorePerformance(
  shoe: Shoe,
  answers: FormAnswers,
  intelligence: ShoeIntelligence,
): number {
  const profile = getShoeProfile(shoe.id, shoe);
  if (!profile) return 0;

  let score = intelligence.performanceScore * 6;
  score += profile.responsiveness * 2.2;

  if (shoe.hasPlate) score += 6;
  if (shoe.isAggressive) score += 4;
  if (answers.usage === "provas" || answers.feeling === "leve") score += 5;
  if (answers.experience === "frequente") score += 4;

  if (intelligence.isEliteSuperShoe) score += 8;

  if (shoe.category === "super_trainer" && answers.usage !== "provas") {
    score += 4;
  }

  return Math.round(score);
}

export function scoreTech(
  shoe: Shoe,
  intelligence: ShoeIntelligence,
): number {
  let score = intelligence.techScore * 6;

  switch (intelligence.generation) {
    case "flagship":
      score += 10;
      break;
    case "current":
      score += 6;
      break;
    case "previous":
      score += 2;
      break;
    default:
      score += 0;
  }

  if (shoe.hasPlate) score += 4;
  if (isRaceCategory(shoe.category)) score += 5;
  if (shoe.category === "super_trainer") score += 3;

  return Math.round(score);
}

type ScoreWeights = {
  profile: number;
  costBenefit: number;
  performance: number;
  tech: number;
  budgetFit: number;
};

function weightsForUserBand(userBand: PriceBandSlug | null): ScoreWeights {
  if (!userBand) {
    return {
      profile: 0.35,
      costBenefit: 0.3,
      performance: 0.2,
      tech: 0.1,
      budgetFit: 0.05,
    };
  }

  const idx = priceBandIndex(userBand);

  if (idx <= 1) {
    return {
      costBenefit: 0.42,
      profile: 0.28,
      performance: 0.1,
      tech: 0.05,
      budgetFit: 0.15,
    };
  }

  if (idx <= 3) {
    return {
      costBenefit: 0.3,
      profile: 0.28,
      performance: 0.2,
      tech: 0.12,
      budgetFit: 0.1,
    };
  }

  return {
    costBenefit: 0.18,
    profile: 0.22,
    performance: 0.28,
    tech: 0.22,
    budgetFit: 0.1,
  };
}

export function composeTotalScore(
  dimensions: Omit<DimensionalScores, "total">,
  answers: FormAnswers,
): number {
  const weights = weightsForUserBand(userPriceBand(answers));
  return Math.round(
    dimensions.profile * weights.profile +
      dimensions.costBenefit * weights.costBenefit +
      dimensions.performance * weights.performance +
      dimensions.tech * weights.tech +
      dimensions.budgetFit * weights.budgetFit,
  );
}

export function buildBadge(
  dimensions: DimensionalScores,
  intelligence: ShoeIntelligence,
  slot: "acessivel" | "equilibrado" | "evolucao" | "premium",
  inBudget: boolean,
): RecommendationBadge {
  if (intelligence.generation === "previous" && intelligence.isAccessiblePremium) {
    if (slot === "acessivel" || slot === "evolucao") {
      return inBudget ? "Melhor custo-benefício" : "Geração anterior";
    }
    if (slot === "premium" && inBudget) return "Geração anterior";
  }

  if (slot === "equilibrado") return "Melhor equilíbrio";

  const candidates: { badge: RecommendationBadge; value: number }[] = [
    { badge: "Melhor custo-benefício", value: dimensions.costBenefit },
    { badge: "Excelente compra", value: dimensions.costBenefit * 0.95 + dimensions.budgetFit * 0.05 },
    { badge: "Melhor tecnologia", value: dimensions.tech },
    { badge: "Melhor para evoluir", value: dimensions.performance * 0.7 + dimensions.tech * 0.3 },
    { badge: "Premium", value: dimensions.performance * 0.6 + dimensions.tech * 0.4 },
  ];

  if (slot === "acessivel") {
    return inBudget ? "Melhor custo-benefício" : "Excelente compra";
  }

  if (slot === "evolucao") {
    const evolve = candidates.find((c) => c.badge === "Melhor para evoluir");
    if (evolve && evolve.value >= dimensions.costBenefit * 0.85) {
      return "Melhor para evoluir";
    }
    return "Excelente compra";
  }

  candidates.sort((a, b) => b.value - a.value);
  const top = candidates[0]?.badge;

  if (intelligence.isEliteSuperShoe && slot === "premium") return "Premium";
  if (intelligence.generation === "previous" && inBudget) return "Geração anterior";

  return top ?? "Premium";
}

/** Penaliza super tênis de prova para perfis que se beneficiam mais de daily trainers */
export function scoreCategoryFit(shoe: Shoe, answers: FormAnswers): number {
  let score = 0;
  const isBeginner =
    answers.experience === "nunca" || answers.experience === "comecando";
  const wantsRace = answers.usage === "provas";
  const cat = shoe.category;

  if (isBeginner) {
    if (cat === "beginner" || cat === "daily_trainer") score += 10;
    if (cat === "stability" || cat === "max_cushion") score += 8;
    if (isRaceCategory(cat)) score -= 25;
    if (cat === "super_trainer") score -= 5;
    if (cat === "lightweight" || cat === "speed_trainer") score -= 8;
  } else if (answers.experience === "algum-tempo") {
    if (cat === "daily_trainer" || cat === "super_trainer") score += 8;
    if (cat === "speed_trainer" && wantsRace) score += 6;
    if (isRaceCategory(cat) && !wantsRace) score -= 12;
  } else if (answers.experience === "frequente") {
    if (wantsRace && isRaceCategory(cat)) score += 10;
    if (wantsRace && cat === "speed_trainer") score += 6;
    if (wantsRace && cat === "super_trainer") score += 4;
    if (!wantsRace && cat === "daily_trainer") score += 6;
    if (!wantsRace && isRaceCategory(cat)) score -= 8;
  }

  if (answers.usage === "caminhada" || answers.usage === "comecar") {
    if (cat === "beginner" || cat === "daily_trainer" || cat === "recovery") {
      score += 8;
    }
    if (isRaceCategory(cat)) score -= 15;
  }

  if (
    answers.discomfort === "instabilidade" &&
    (cat === "stability" || shoe.stabilityLevelNum >= 4)
  ) {
    score += 8;
  }

  if (
    (answers.discomfort === "pe" || answers.discomfort === "joelho") &&
    (cat === "max_cushion" || cat === "premium_comfort" || cat === "recovery")
  ) {
    score += 6;
  }

  if (answers.feeling === "macio" && (cat === "premium_comfort" || cat === "recovery")) {
    score += 5;
  }

  if (answers.feeling === "leve" && (cat === "lightweight" || cat === "speed_trainer")) {
    score += 5;
  }

  return score;
}

export function diversityKeyForShoe(shoe: Shoe): string {
  return shoe.category;
}

export function slotCategoryPreference(
  slot: "acessivel" | "equilibrado" | "evolucao" | "premium",
): Set<TechnicalCategory> | null {
  switch (slot) {
    case "acessivel":
      return new Set([
        "beginner",
        "daily_trainer",
        "stability",
        "max_cushion",
      ]);
    case "equilibrado":
      return new Set(["daily_trainer", "super_trainer", "stability", "premium_comfort"]);
    case "evolucao":
      return new Set(["super_trainer", "speed_trainer", "lightweight", "daily_trainer"]);
    case "premium":
      return new Set(["race_day", "super_trainer", "speed_trainer", "premium_comfort"]);
    default:
      return null;
  }
}
