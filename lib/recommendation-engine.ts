import { isRaceCategory, TECHNICAL_CATEGORY_LABELS } from "./catalog-categories";
import { scoreBiomechanicsFit, scoreEvolutionFit } from "./biomechanics";
import { scorePaceCompatibility } from "./pace-intelligence";
import {
  isPriceInBand,
  isPriceBandSlug,
  priceBandIndex,
  primaryPriceBand,
  type PriceBandSlug,
} from "./prices";
import { getShoeIntelligence, type ShoeIntelligence } from "./shoe-intelligence";
import { getShoeProfile } from "./shoe-scores";
import type { FormAnswers, Shoe } from "./shoes";
import {
  bodyWeightCategory,
  isWeightBandSlug,
  shoeMatchesUserWeight,
  shoeWeightMetrics,
  type BodyWeightCategory,
} from "./weight";

export type RunnerExperience = "beginner" | "intermediate" | "advanced";
export type TrainingFrequency = "low" | "medium" | "high";
export type PrimaryGoal = "walk" | "start" | "gym" | "daily" | "race";

export type RunnerProfile = {
  experience: RunnerExperience;
  weightCategory: BodyWeightCategory;
  primaryGoal: PrimaryGoal;
  frequency: TrainingFrequency;
  feeling: "macio" | "equilibrado" | "leve";
  budgetBand: PriceBandSlug | null;
  brandPreference: string | null;
  discomfort: string | null;
  needsStability: boolean;
  needsCushion: boolean;
  isRaceFocused: boolean;
  isBeginner: boolean;
  isHeavy: boolean;
  isLight: boolean;
  wantsComfort: boolean;
  wantsSpeed: boolean;
  highVolume: boolean;
  budgetSensitive: boolean;
};

export type FactorWeights = {
  experience: number;
  weight: number;
  goal: number;
  frequency: number;
  feeling: number;
  brand: number;
  balance: number;
  budget: number;
};

export type ShoeFitBreakdown = {
  experience: number;
  weight: number;
  goal: number;
  frequency: number;
  feeling: number;
  brand: number;
  balance: number;
  category: number;
  biomechanics: number;
  evolution: number;
  pace: number;
  penalties: number;
  generation: number;
  contextual: number;
};

export type ScoredShoe = {
  shoe: Shoe;
  fit: ShoeFitBreakdown;
  fitTotal: number;
  intelligence: ShoeIntelligence;
  costBenefit: number;
  performance: number;
  tech: number;
  budgetFit: number;
  total: number;
};

/** Modelos que tendem a dominar rankings — leve penalidade para abrir diversidade */
const OVERREPRESENTED_IDS = new Set([
  "nike-pegasus-41",
  "asics-cumulus-26",
  "adidas-supernova-rise",
  "nb-880v14",
  "saucony-ride-17",
  "hoka-clifton-9",
]);

/** Famílias de produto — evita repetir linha similar nas 4 recomendações */
const PRODUCT_FAMILIES: Record<string, string> = {
  "nike-pegasus-41": "nike-pegasus",
  "nike-pegasus-premium": "nike-pegasus",
  "nike-vomero-17": "nike-vomero",
  "nike-vomero-18": "nike-vomero",
  "adidas-supernova": "adidas-supernova",
  "adidas-supernova-rise": "adidas-supernova",
  "adidas-supernova-prima": "adidas-supernova",
  "adidas-adios-pro-3": "adidas-adios-pro",
  "adidas-adios-pro-4": "adidas-adios-pro",
  "adidas-adios-pro-evo-1": "adidas-adios-pro",
  "asics-superblast-2": "asics-superblast",
  "asics-superblast-3": "asics-superblast",
  "nb-rebel-v3": "nb-rebel",
  "nb-rebel-v4": "nb-rebel",
  "hoka-clifton-9": "hoka-clifton",
  "hoka-clifton-10": "hoka-clifton",
  "puma-velocity-3": "puma-velocity",
  "puma-deviate-2": "puma-deviate",
  "puma-deviate-3": "puma-deviate",
  "puma-deviate-elite": "puma-deviate",
  "puma-deviate-elite-3": "puma-deviate",
  "puma-fast-r": "puma-fast-r",
  "puma-fast-r-elite-2": "puma-fast-r",
  "puma-foreverrun": "puma-foreverrun",
  "puma-foreverrun-plus": "puma-foreverrun",
  "asics-cumulus-26": "asics-cumulus",
  "mizuno-rider-27": "mizuno-rider",
  "mizuno-rider-28": "mizuno-rider",
  "saucony-endorphin-speed-4": "saucony-endorphin",
  "saucony-endorphin-pro-4": "saucony-endorphin",
  "saucony-endorphin-elite": "saucony-endorphin",
};

/** Versão atual claramente superior dentro da mesma linha */
const MODEL_SUCCESSORS: Record<string, string> = {
  "adidas-adios-pro-3": "adidas-adios-pro-4",
  "asics-superblast-2": "asics-superblast-3",
  "nb-rebel-v3": "nb-rebel-v4",
  "puma-deviate-2": "puma-deviate-3",
  "puma-deviate-elite": "puma-deviate-elite-3",
  "puma-fast-r": "puma-fast-r-elite-2",
  "nike-vomero-17": "nike-vomero-18",
  "hoka-clifton-9": "hoka-clifton-10",
  "mizuno-rider-27": "mizuno-rider-28",
};

function isBeginner(answers: FormAnswers): boolean {
  return answers.experience === "nunca" || answers.experience === "comecando";
}

export function analyzeRunnerProfile(answers: FormAnswers): RunnerProfile {
  const weightCategory = isWeightBandSlug(answers.weight)
    ? bodyWeightCategory(answers.weight)
    : "medio";

  let primaryGoal: PrimaryGoal = "daily";
  if (answers.usage === "caminhada") primaryGoal = "walk";
  else if (answers.usage === "comecar") primaryGoal = "start";
  else if (answers.usage === "academia") primaryGoal = "gym";
  else if (answers.usage === "provas") primaryGoal = "race";

  let frequency: TrainingFrequency = "medium";
  if (answers.frequency === "1-2") frequency = "low";
  else if (answers.frequency === "5plus") frequency = "high";

  const budgetBand =
    answers.price && isPriceBandSlug(answers.price) ? answers.price : null;

  return {
    experience: isBeginner(answers)
      ? "beginner"
      : answers.experience === "frequente"
        ? "advanced"
        : "intermediate",
    weightCategory,
    primaryGoal,
    frequency,
    feeling: (answers.feeling as RunnerProfile["feeling"]) || "equilibrado",
    budgetBand,
    brandPreference:
      answers.brandPreference && answers.brandPreference !== "sem-preferencia"
        ? answers.brandPreference
        : null,
    discomfort: answers.discomfort !== "nada" ? answers.discomfort : null,
    needsStability:
      answers.discomfort === "instabilidade" || weightCategory === "pesado",
    needsCushion:
      answers.discomfort === "pe" ||
      answers.discomfort === "joelho" ||
      answers.discomfort === "duro" ||
      answers.feeling === "macio",
    isRaceFocused: answers.usage === "provas" || answers.feeling === "leve",
    isBeginner: isBeginner(answers),
    isHeavy: weightCategory === "pesado",
    isLight: weightCategory === "leve",
    wantsComfort: answers.feeling === "macio" || !!answers.discomfort,
    wantsSpeed:
      answers.feeling === "leve" ||
      answers.usage === "provas" ||
      answers.experience === "frequente",
    highVolume: answers.frequency === "5plus" || answers.usage === "frequentes",
    budgetSensitive:
      !budgetBand ||
      priceBandIndex(budgetBand) <= 2,
  };
}

export function computeFactorWeights(profile: RunnerProfile): FactorWeights {
  const base: FactorWeights = {
    experience: 0.18,
    weight: 0.14,
    goal: 0.16,
    frequency: 0.1,
    feeling: 0.14,
    brand: profile.brandPreference ? 0.08 : 0.03,
    balance: 0.12,
    budget: 0.05,
  };

  if (profile.isBeginner) {
    base.experience = 0.24;
    base.goal = 0.14;
    base.feeling = 0.12;
    base.budget = 0.1;
  }

  if (profile.isHeavy) {
    base.weight = 0.22;
    base.balance = 0.16;
    base.feeling = 0.1;
  }

  if (profile.isLight && profile.wantsSpeed) {
    base.weight = 0.12;
    base.feeling = 0.18;
    base.goal = 0.18;
  }

  if (profile.isRaceFocused && profile.experience === "advanced") {
    base.goal = 0.22;
    base.experience = 0.1;
    base.feeling = 0.16;
    base.budget = 0.06;
  }

  if (profile.budgetSensitive) {
    base.budget = 0.14;
    base.goal = Math.max(0.12, base.goal - 0.04);
  }

  if (profile.needsStability) {
    base.weight = Math.max(base.weight, 0.18);
    base.balance = Math.max(base.balance, 0.15);
  }

  if (profile.highVolume) {
    base.frequency = 0.16;
    base.balance = Math.max(base.balance, 0.14);
  }

  const sum =
    base.experience +
    base.weight +
    base.goal +
    base.frequency +
    base.feeling +
    base.brand +
    base.balance +
    base.budget;

  return {
    experience: base.experience / sum,
    weight: base.weight / sum,
    goal: base.goal / sum,
    frequency: base.frequency / sum,
    feeling: base.feeling / sum,
    brand: base.brand / sum,
    balance: base.balance / sum,
    budget: base.budget / sum,
  };
}

function scoreExperienceFit(shoe: Shoe, profile: RunnerProfile): number {
  let score = 0;
  const levels = shoe.experienceLevel ?? [];

  if (profile.isBeginner) {
    if (shoe.beginnerFriendly) score += 14;
    if (levels.includes("iniciante")) score += 8;
    if (isRaceCategory(shoe.category)) score -= 30;
    if (shoe.category === "super_trainer") score -= 10;
    if (shoe.hasPlate) score -= 25;
    if (shoe.isAggressive) score -= 18;
    if (shoe.category === "beginner" || shoe.category === "daily_trainer") {
      score += 12;
    }
  } else if (profile.experience === "intermediate") {
    if (levels.includes("intermediario") || levels.includes("avancado")) {
      score += 10;
    }
    if (shoe.category === "daily_trainer" || shoe.category === "super_trainer") {
      score += 10;
    }
    if (isRaceCategory(shoe.category) && !profile.isRaceFocused) score -= 14;
  } else {
    if (levels.includes("avancado") || levels.includes("elite")) score += 10;
    if (profile.isRaceFocused && isRaceCategory(shoe.category)) score += 14;
    if (profile.isRaceFocused && shoe.category === "speed_trainer") score += 8;
    if (!profile.isRaceFocused && shoe.category === "daily_trainer") score += 8;
    if (!profile.isRaceFocused && isRaceCategory(shoe.category)) score -= 10;
  }

  return score;
}

function scoreWeightFit(shoe: Shoe, profile: RunnerProfile, answers: FormAnswers): number {
  if (!answers.weight || !isWeightBandSlug(answers.weight)) return 0;

  const metrics = shoeWeightMetrics(shoe);
  const shoeProfile = getShoeProfile(shoe.id, shoe);
  let score = 0;

  if (metrics.idealBands.includes(answers.weight)) score += 12;
  else score -= 10;

  if (profile.isLight) {
    score += metrics.agilityForLight * 1.4;
    score += metrics.responsiveness * 1.1;
    if (shoe.cushioningType === "responsivo") score += 4;
    if (shoe.category === "lightweight" || shoe.category === "speed_trainer") {
      score += 6;
    }
    if (
      shoe.cushioningLevel >= 5 &&
      profile.wantsSpeed &&
      !profile.needsCushion
    ) {
      score -= 4;
    }
  } else if (profile.isHeavy) {
    score += metrics.cushioningForHeavy * 1.7;
    score += metrics.stabilityScore * 1.5;
    score += metrics.durability * 1.1;
    score += (shoeProfile?.comfort ?? 0) * 1.2;
    score += (shoeProfile?.stability ?? 0) * 0.9;

    if (shoe.cushioningLevel >= 4) score += 8;
    if (shoe.stabilityLevelNum >= 4) score += 8;
    if (shoe.category === "stability" || shoe.category === "max_cushion") {
      score += 8;
    }

    if (shoe.stabilityLevelNum <= 2) score -= 18;
    if (shoe.category === "lightweight") score -= 22;
    if (shoe.isAggressive) score -= 14;
    if (shoe.hasPlate) score -= 10;
    if (shoe.rideFeel === "agressivo" && !profile.isRaceFocused) score -= 8;
  } else {
    score += metrics.cushioningForHeavy * 0.6;
    score += metrics.agilityForLight * 0.6;
    score += (shoeProfile?.versatility ?? 0) * 1;
    if (shoe.stabilityLevelNum >= 4) score += 3;
  }

  if (shoeMatchesUserWeight(shoe, answers.weight)) score += 5;

  return Math.round(score);
}

function scoreGoalFit(shoe: Shoe, profile: RunnerProfile): number {
  let score = 0;
  const cat = shoe.category;

  switch (profile.primaryGoal) {
    case "walk":
    case "start":
      if (cat === "beginner" || cat === "daily_trainer" || cat === "recovery") {
        score += 14;
      }
      if (cat === "max_cushion" || cat === "premium_comfort") score += 8;
      if (isRaceCategory(cat)) score -= 22;
      if (cat === "speed_trainer" || cat === "lightweight") score -= 12;
      break;
    case "gym":
      if (cat === "daily_trainer" || cat === "stability") score += 12;
      if (shoe.versatilityScore >= 4) score += 6;
      if (isRaceCategory(cat)) score -= 15;
      break;
    case "daily":
      if (cat === "daily_trainer") score += 16;
      if (cat === "super_trainer" && profile.experience !== "beginner") {
        score += 6;
      }
      if (cat === "stability" && profile.needsStability) score += 10;
      if (isRaceCategory(cat) && !profile.isRaceFocused) score -= 20;
      break;
    case "race":
      if (isRaceCategory(cat)) score += 16;
      if (cat === "speed_trainer") score += 12;
      if (cat === "super_trainer") score += 8;
      if (cat === "beginner") score -= 10;
      if (cat === "max_cushion" || cat === "recovery") score -= 8;
      break;
  }

  return score;
}

function scoreFrequencyFit(shoe: Shoe, profile: RunnerProfile): number {
  let score = 0;

  if (profile.frequency === "low") {
    if (shoe.category === "beginner" || shoe.category === "daily_trainer") {
      score += 8;
    }
    if (shoe.tier === "economico" || shoe.valuePosition === "custo-beneficio") {
      score += 5;
    }
    if (isRaceCategory(shoe.category)) score -= 8;
  } else if (profile.frequency === "medium") {
    if (shoe.versatilityScore >= 4) score += 8;
    if (shoe.category === "daily_trainer") score += 6;
  } else {
    if (shoe.versatilityScore >= 4) score += 10;
    if (shoe.category === "daily_trainer" || shoe.category === "super_trainer") {
      score += 8;
    }
    if (shoe.tier === "economico" && shoe.cushioningLevel <= 2) score -= 6;
    if (isRaceCategory(shoe.category) && !profile.isRaceFocused) score -= 12;
  }

  return score;
}

function scoreFeelingFit(shoe: Shoe, profile: RunnerProfile): number {
  let score = 0;
  const shoeProfile = getShoeProfile(shoe.id, shoe);

  if (profile.feeling === "macio" || profile.wantsComfort) {
    score += (shoeProfile?.comfort ?? shoe.cushioningLevel) * 2.2;
    score -= (shoeProfile?.responsiveness ?? 0) * 0.4;

    if (shoe.rideFeel === "macio" || shoe.rideFeel === "equilibrado") score += 8;
    if (shoe.rideFeel === "agressivo" || shoe.rideFeel === "firme") score -= 14;
    if (shoe.cushioningLevel >= 4) score += 6;
    if (
      shoe.category === "premium_comfort" ||
      shoe.category === "max_cushion" ||
      shoe.category === "recovery"
    ) {
      score += 6;
    }
  } else if (profile.feeling === "leve" || profile.wantsSpeed) {
    score += (shoeProfile?.responsiveness ?? 0) * 2.2;
    score -= (shoeProfile?.comfort ?? 0) * 0.3;

    if (shoe.rideFeel === "agressivo" || shoe.rideFeel === "firme") score += 8;
    if (shoe.rideFeel === "macio" && profile.wantsSpeed) score -= 6;
    if (
      shoe.category === "lightweight" ||
      shoe.category === "speed_trainer" ||
      isRaceCategory(shoe.category)
    ) {
      score += 5;
    }
  } else {
    score += ((shoeProfile?.comfort ?? 0) + (shoeProfile?.responsiveness ?? 0)) * 1.1;
    if (shoe.rideFeel === "equilibrado") score += 6;
  }

  if (profile.needsCushion && shoe.cushioningLevel >= 4) score += 6;
  if (profile.discomfort === "duro" && shoe.cushioningLevel >= 3) score += 8;

  return Math.round(score);
}

function scoreBrandFit(_shoe: Shoe, _profile: RunnerProfile): number {
  return 0;
}

function scoreBalanceAxes(shoe: Shoe, profile: RunnerProfile): number {
  let score = 0;
  const shoeProfile = getShoeProfile(shoe.id, shoe);
  if (!shoeProfile) return 0;

  const comfortPerfBalance =
    profile.wantsComfort && !profile.wantsSpeed
      ? shoeProfile.comfort * 1.5 - shoeProfile.responsiveness * 0.5
      : profile.wantsSpeed && !profile.wantsComfort
        ? shoeProfile.responsiveness * 1.5 - shoeProfile.comfort * 0.3
        : (shoeProfile.comfort + shoeProfile.responsiveness) * 0.8;

  score += comfortPerfBalance;

  const stabilityLightBalance = profile.needsStability
    ? shoeProfile.stability * 1.6 -
      (shoe.category === "lightweight" ? 8 : 0)
    : profile.isLight
      ? (shoeProfile.responsiveness - Math.max(0, shoe.cushioningLevel - 3)) * 0.8
      : shoeProfile.stability * 0.6 + shoeProfile.responsiveness * 0.4;

  score += stabilityLightBalance;

  const speedDurabilityBalance = profile.highVolume
    ? shoe.versatilityScore * 1.4 +
      (shoe.tier === "economico" || shoe.tier === "intermediario" ? 4 : 0) -
      (isRaceCategory(shoe.category) ? 10 : 0)
    : profile.isRaceFocused
      ? shoeProfile.responsiveness * 1.2 + (shoe.hasPlate ? 4 : 0)
      : shoe.versatilityScore * 0.8;

  score += speedDurabilityBalance;

  return Math.round(score);
}

function scoreCategoryFit(shoe: Shoe, profile: RunnerProfile): number {
  let score = 0;
  const cat = shoe.category;

  if (
    cat === "daily_trainer" &&
    (profile.primaryGoal === "daily" ||
      profile.primaryGoal === "gym" ||
      profile.primaryGoal === "start")
  ) {
    score += 12;
  }

  if (cat === "max_cushion" || cat === "premium_comfort") {
    if (profile.needsCushion || profile.isHeavy) score += 10;
    else if (!profile.wantsComfort) score -= 4;
  }

  if (cat === "stability" && profile.needsStability) score += 12;

  if (cat === "super_trainer") {
    if (profile.experience === "advanced" || profile.experience === "intermediate") {
      score += profile.isRaceFocused ? 6 : 8;
    }
    if (profile.isBeginner) score -= 12;
  }

  if (isRaceCategory(cat)) {
    if (profile.isRaceFocused && profile.experience === "advanced") score += 12;
    else if (!profile.isRaceFocused || profile.isBeginner) score -= 18;
  }

  const paceResult = scorePaceCompatibility(shoe, profile);
  score += Math.round(paceResult.score * 0.85);

  if (cat === "super_trainer" && profile.experience === "intermediate") {
    score += 6;
  }

  if (
    (cat === "daily_trainer" || cat === "premium_comfort" || cat === "max_cushion") &&
    paceResult.compatibility === "ideal" &&
    profile.wantsComfort
  ) {
    score += 8;
  }

  if (cat === "recovery" && profile.highVolume) score += 6;

  return score;
}

function computePenalties(
  shoe: Shoe,
  profile: RunnerProfile,
  intelligence: ShoeIntelligence,
): number {
  let penalty = 0;

  if (profile.isBeginner) {
    if (isRaceCategory(shoe.category)) penalty += 35;
    if (shoe.hasPlate) penalty += 28;
    if (shoe.isAggressive) penalty += 18;
    if (shoe.category === "lightweight") penalty += 12;
  }

  if (profile.isHeavy) {
    if (shoe.stabilityLevelNum <= 2) penalty += 16;
    if (shoe.category === "lightweight") penalty += 20;
    if (shoe.cushioningLevel <= 2) penalty += 14;
    if (shoe.hasPlate && !profile.isRaceFocused) penalty += 12;
  }

  if (profile.wantsComfort && !profile.wantsSpeed) {
    if (shoe.rideFeel === "agressivo") penalty += 16;
    if (shoe.rideFeel === "firme" && shoe.cushioningLevel <= 2) penalty += 12;
  }

  if (!profile.isRaceFocused && isRaceCategory(shoe.category)) {
    penalty += 22;
  }

  if (
    (profile.primaryGoal === "walk" ||
      profile.primaryGoal === "start" ||
      profile.primaryGoal === "daily") &&
    isRaceCategory(shoe.category)
  ) {
    penalty += 15;
  }

  if (intelligence.isEliteSuperShoe && profile.isBeginner) penalty += 30;

  if (shoe.technical.adaptationLevel === "elite") {
    if (profile.isBeginner) penalty += 35;
    else if (profile.experience === "intermediate") penalty += 18;
    else if (!profile.isRaceFocused) penalty += 12;
  } else if (shoe.technical.adaptationLevel === "alta") {
    if (profile.isBeginner) penalty += 20;
    else if (!profile.isRaceFocused && isRaceCategory(shoe.category)) penalty += 10;
  }

  if (
    intelligence.isEliteSuperShoe &&
    profile.experience !== "advanced" &&
    !profile.isRaceFocused
  ) {
    penalty += 22;
  }

  const paceResult = scorePaceCompatibility(shoe, profile);
  if (paceResult.compatibility === "incompatible") {
    penalty += 18 + shoe.technical.paceSensitivity * 2;
  } else if (paceResult.compatibility === "marginal") {
    penalty += 8;
  }

  if (
    shoe.technical.advancedOnly &&
    profile.experience !== "advanced" &&
    isRaceCategory(shoe.category)
  ) {
    penalty += 12;
  }

  if (OVERREPRESENTED_IDS.has(shoe.id) && !profile.brandPreference) {
    penalty += 3;
  }

  return penalty;
}

function scoreGenerationFit(
  shoe: Shoe,
  profile: RunnerProfile,
  pool: Shoe[],
  intelligence: ShoeIntelligence,
): number {
  let score = 0;

  switch (intelligence.generation) {
    case "flagship":
      score += profile.isRaceFocused ? 10 : 4;
      if (
        profile.budgetBand &&
        isPriceInBand(shoe.price, profile.budgetBand) &&
        shoe.technical.isFlagship
      ) {
        score += 12;
      }
      break;
    case "current":
      score += 8;
      break;
    case "previous":
      score += profile.budgetSensitive ? 6 : 2;
      break;
    default:
      score += 0;
  }

  const successorId = MODEL_SUCCESSORS[shoe.id];
  if (successorId) {
    const successor = pool.find((s) => s.id === successorId);
    if (successor && profile.budgetBand && isPriceInBand(successor.price, profile.budgetBand)) {
      score -= 14;
    } else if (successor && profile.budgetSensitive) {
      score += 4;
    }
  }

  if (
    intelligence.generation === "previous" &&
    profile.budgetBand &&
    isPriceInBand(shoe.price, profile.budgetBand)
  ) {
    score += 10;
  }

  return score;
}

function scoreContextualFit(
  shoe: Shoe,
  profile: RunnerProfile,
  poolStats: PoolStats,
): number {
  let score = 0;

  if (
    profile.budgetSensitive &&
    shoe.price > poolStats.medianPrice * 1.35 &&
    poolStats.bestCostBenefitInBudget > 0
  ) {
    const relativeValue =
      (shoe.versatilityScore + (shoe.cushioningLevel ?? 3)) /
      (shoe.price / 100);
    if (relativeValue < poolStats.avgValueRatio * 0.85) {
      score -= 12;
    }
  }

  if (
    profile.budgetBand &&
    isPriceInBand(shoe.price, profile.budgetBand) &&
    shoe.valuePosition === "custo-beneficio"
  ) {
    score += 8;
  }

  return score;
}

type PoolStats = {
  medianPrice: number;
  bestCostBenefitInBudget: number;
  avgValueRatio: number;
};

function computePoolStats(pool: Shoe[], profile: RunnerProfile): PoolStats {
  const prices = pool.map((s) => s.price).sort((a, b) => a - b);
  const medianPrice = prices[Math.floor(prices.length / 2)] ?? 800;

  let bestCostBenefitInBudget = 0;
  let valueSum = 0;

  for (const shoe of pool) {
    const shoeProfile = getShoeProfile(shoe.id, shoe);
    const value = (shoeProfile?.valueScore ?? 3) * shoe.versatilityScore;
    valueSum += value / (shoe.price / 100);

    if (
      profile.budgetBand &&
      isPriceInBand(shoe.price, profile.budgetBand) &&
      value > bestCostBenefitInBudget
    ) {
      bestCostBenefitInBudget = value;
    }
  }

  return {
    medianPrice,
    bestCostBenefitInBudget,
    avgValueRatio: valueSum / Math.max(pool.length, 1),
  };
}

function scoreCostBenefitDimension(
  shoe: Shoe,
  profile: RunnerProfile,
  intelligence: ShoeIntelligence,
): number {
  const shoeProfile = getShoeProfile(shoe.id, shoe);
  if (!shoeProfile) return 0;

  let score = shoeProfile.valueScore * 4.5;
  score += shoe.versatilityScore * 2.8;

  if (profile.budgetBand && isPriceInBand(shoe.price, profile.budgetBand)) {
    score += 14;
  }

  if (intelligence.isAccessiblePremium) score += 8;
  if (intelligence.generation === "previous" && profile.budgetSensitive) {
    score += 12;
  }
  if (intelligence.isEliteSuperShoe && profile.budgetSensitive) score -= 10;

  if (
    shoe.valuePosition === "economico" ||
    shoe.valuePosition === "custo-beneficio" ||
    shoe.category === "beginner" ||
    shoe.category === "daily_trainer"
  ) {
    score += 6;
  }

  if (shoe.valuePosition === "geracao-anterior") score += 8;

  return Math.round(score);
}

function scorePerformanceDimension(
  shoe: Shoe,
  profile: RunnerProfile,
  intelligence: ShoeIntelligence,
): number {
  const shoeProfile = getShoeProfile(shoe.id, shoe);
  if (!shoeProfile) return 0;

  let score = intelligence.performanceScore * 6;
  score += shoeProfile.responsiveness * 2.4;

  if (profile.isRaceFocused) {
    if (isRaceCategory(shoe.category)) score += 10;
    if (shoe.category === "speed_trainer") score += 8;
    if (shoe.hasPlate) score += 6;
  } else if (profile.experience === "advanced") {
    if (shoe.category === "super_trainer") score += 8;
    if (isRaceCategory(shoe.category)) score += 4;
  } else {
    if (shoe.category === "daily_trainer") score += 4;
    if (isRaceCategory(shoe.category)) score -= 6;
  }

  if (intelligence.isEliteSuperShoe && profile.isRaceFocused) score += 8;

  const paceResult = scorePaceCompatibility(shoe, profile);
  if (paceResult.compatibility === "ideal") score += 10;
  else if (paceResult.compatibility === "incompatible") score -= 20;

  return Math.round(score);
}

function scoreTechDimension(shoe: Shoe, intelligence: ShoeIntelligence): number {
  let score = intelligence.techScore * 6;

  switch (intelligence.generation) {
    case "flagship":
      score += 10;
      break;
    case "current":
      score += 7;
      break;
    case "previous":
      score += 3;
      break;
    default:
      break;
  }

  if (shoe.hasPlate) score += 4;
  if (isRaceCategory(shoe.category)) score += 4;
  if (shoe.category === "super_trainer") score += 3;
  if (shoe.technical.isFlagship) score += 5;

  return Math.round(score);
}

function scoreBudgetDimension(
  shoe: Shoe,
  profile: RunnerProfile,
  intelligence: ShoeIntelligence,
): number {
  if (!profile.budgetBand) return 0;

  let score = 0;
  const inBand = isPriceInBand(shoe.price, profile.budgetBand);

  if (inBand) score += 24;
  else {
    const shoeIdx = priceBandIndex(primaryPriceBand(shoe.price));
    const userIdx = priceBandIndex(profile.budgetBand);
    const dist = Math.abs(shoeIdx - userIdx);
    if (dist === 1 && shoeIdx < userIdx) score += 8;
    else if (dist === 1) score += 2;
    else score -= 10 * dist;
  }

  if (
    intelligence.isEliteSuperShoe &&
    !inBand &&
    profile.budgetSensitive
  ) {
    score -= 40;
  }

  if (isRaceCategory(shoe.category) && !inBand && profile.budgetSensitive) {
    score -= 20;
  }

  if (
    intelligence.generation === "previous" &&
    inBand &&
    profile.budgetSensitive
  ) {
    score += 8;
  }

  if (
    shoe.technical.isFlagship &&
    inBand &&
    !profile.budgetSensitive
  ) {
    score += 14;
  }

  if (
    shoe.technical.isFlagship &&
    inBand &&
    profile.isRaceFocused
  ) {
    score += 8;
  }

  return score;
}

type ComposeWeights = {
  fit: number;
  costBenefit: number;
  performance: number;
  tech: number;
  budget: number;
};

function composeWeights(profile: RunnerProfile): ComposeWeights {
  if (profile.budgetSensitive) {
    return {
      fit: 0.38,
      costBenefit: 0.28,
      performance: 0.12,
      tech: 0.07,
      budget: 0.15,
    };
  }

  if (profile.isRaceFocused && profile.experience === "advanced") {
    return {
      fit: 0.28,
      costBenefit: 0.12,
      performance: 0.28,
      tech: 0.22,
      budget: 0.1,
    };
  }

  if (profile.isBeginner) {
    return {
      fit: 0.42,
      costBenefit: 0.25,
      performance: 0.08,
      tech: 0.05,
      budget: 0.2,
    };
  }

  return {
    fit: 0.36,
    costBenefit: 0.22,
    performance: 0.18,
    tech: 0.12,
    budget: 0.12,
  };
}

export function scoreShoeForProfile(
  shoe: Shoe,
  answers: FormAnswers,
  profile: RunnerProfile,
  pool: Shoe[],
  poolStats: PoolStats,
): ScoredShoe {
  const weights = computeFactorWeights(profile);
  const intelligence = getShoeIntelligence(shoe);

  const fit: ShoeFitBreakdown = {
    experience: scoreExperienceFit(shoe, profile),
    weight: scoreWeightFit(shoe, profile, answers),
    goal: scoreGoalFit(shoe, profile),
    frequency: scoreFrequencyFit(shoe, profile),
    feeling: scoreFeelingFit(shoe, profile),
    brand: scoreBrandFit(shoe, profile),
    balance: scoreBalanceAxes(shoe, profile),
    category: scoreCategoryFit(shoe, profile),
    biomechanics: scoreBiomechanicsFit(shoe, profile).total,
    evolution: scoreEvolutionFit(shoe, profile),
    pace: scorePaceCompatibility(shoe, profile).score,
    penalties: -computePenalties(shoe, profile, intelligence),
    generation: scoreGenerationFit(shoe, profile, pool, intelligence),
    contextual: scoreContextualFit(shoe, profile, poolStats),
  };

  const fitTotal = Math.round(
    fit.experience * weights.experience +
      fit.weight * weights.weight +
      fit.goal * weights.goal +
      fit.frequency * weights.frequency +
      fit.feeling * weights.feeling +
      fit.brand * weights.brand +
      fit.balance * weights.balance +
      fit.category +
      fit.biomechanics * 0.18 +
      fit.evolution * 0.1 +
      fit.pace * 0.22 +
      fit.penalties +
      fit.generation +
      fit.contextual,
  );

  const costBenefit = scoreCostBenefitDimension(shoe, profile, intelligence);
  const performance = scorePerformanceDimension(shoe, profile, intelligence);
  const tech = scoreTechDimension(shoe, intelligence);
  const budgetFit = scoreBudgetDimension(shoe, profile, intelligence);

  const compose = composeWeights(profile);
  const total = Math.round(
    fitTotal * compose.fit +
      costBenefit * compose.costBenefit +
      performance * compose.performance +
      tech * compose.tech +
      budgetFit * compose.budget,
  );

  return {
    shoe,
    fit,
    fitTotal,
    intelligence,
    costBenefit,
    performance,
    tech,
    budgetFit,
    total,
  };
}

export function rankShoes(pool: Shoe[], answers: FormAnswers): ScoredShoe[] {
  const profile = analyzeRunnerProfile(answers);
  const poolStats = computePoolStats(pool, profile);

  return pool
    .map((shoe) => scoreShoeForProfile(shoe, answers, profile, pool, poolStats))
    .sort(
      (a, b) =>
        b.total - a.total ||
        b.fitTotal - a.fitTotal ||
        b.budgetFit - a.budgetFit ||
        a.shoe.price - b.shoe.price ||
        profileHashTiebreak(answers, a.shoe.id) -
          profileHashTiebreak(answers, b.shoe.id),
    );
}

function profileHashTiebreak(answers: FormAnswers, shoeId: string): number {
  const key = `${answers.experience}|${answers.usage}|${answers.weight}|${shoeId}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 1000;
  }
  return hash;
}

export function productFamily(shoeId: string): string {
  return PRODUCT_FAMILIES[shoeId] ?? shoeId;
}

export function isViableRecommendation(
  entry: ScoredShoe,
  profile: RunnerProfile,
): boolean {
  if (entry.total <= -25) return false;
  if (entry.budgetFit <= -35) return false;

  if (
    entry.intelligence.isEliteSuperShoe &&
    profile.budgetBand &&
    !isPriceInBand(entry.shoe.price, profile.budgetBand)
  ) {
    return false;
  }

  if (profile.isBeginner && isRaceCategory(entry.shoe.category)) {
    return entry.total > 30;
  }

  if (
    profile.isHeavy &&
    (entry.shoe.stabilityLevelNum <= 2 || entry.shoe.technical.stability <= 2) &&
    (entry.shoe.category === "lightweight" ||
      entry.shoe.technical.aggressiveness === "agressivo" ||
      entry.shoe.technical.aggressiveness === "race_day_extremo")
  ) {
    return false;
  }

  if (profile.isBeginner && entry.shoe.technical.aggressiveness === "race_day_extremo") {
    return false;
  }

  return true;
}

export function isCategoryAllowedForSlot(
  category: string,
  slot: "acessivel" | "equilibrado" | "evolucao" | "premium",
  profile: RunnerProfile,
): boolean {
  if (profile.isBeginner) {
    if (isRaceCategory(category as Shoe["category"])) return false;
    if (
      category === "lightweight" ||
      category === "speed_trainer" ||
      category === "super_trainer"
    ) {
      return false;
    }
  }

  if (profile.isHeavy && category === "lightweight") return false;

  if (!profile.isRaceFocused && isRaceCategory(category as Shoe["category"])) {
    if (slot === "acessivel" || slot === "equilibrado") return false;
  }

  return true;
}

export function slotCategoryPreference(
  slot: "acessivel" | "equilibrado" | "evolucao" | "premium",
  profile: RunnerProfile,
): Set<string> | null {
  if (profile.isBeginner) {
    switch (slot) {
      case "acessivel":
        return new Set(["beginner", "daily_trainer"]);
      case "equilibrado":
        return new Set(["daily_trainer", "stability", "max_cushion"]);
      case "evolucao":
        return new Set(["daily_trainer", "stability", "premium_comfort"]);
      case "premium":
        return new Set(["daily_trainer", "premium_comfort", "max_cushion"]);
    }
  }

  if (profile.isRaceFocused && profile.experience === "advanced") {
    switch (slot) {
      case "acessivel":
        return new Set(["speed_trainer", "lightweight", "daily_trainer"]);
      case "equilibrado":
        return new Set(["super_trainer", "speed_trainer", "daily_trainer"]);
      case "evolucao":
        return new Set(["speed_trainer", "super_trainer", "race_day"]);
      case "premium":
        return new Set(["race_day", "speed_trainer", "super_trainer"]);
    }
  }

  switch (slot) {
    case "acessivel":
      return new Set(["beginner", "daily_trainer", "stability", "max_cushion"]);
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

export function slotPriorityScore(
  entry: ScoredShoe,
  slot: "acessivel" | "equilibrado" | "evolucao" | "premium",
  profile: RunnerProfile,
): number {
  const inBudget =
    !profile.budgetBand || isPriceInBand(entry.shoe.price, profile.budgetBand);

  switch (slot) {
    case "acessivel":
      return (
        entry.costBenefit * 0.4 +
        entry.budgetFit * 0.3 +
        entry.fitTotal * 0.2 +
        (inBudget ? 14 : -10)
      );
    case "equilibrado":
      return entry.total * 0.5 + entry.fitTotal * 0.3 + entry.budgetFit * 0.2;
    case "evolucao":
      return (
        entry.performance * 0.25 +
        entry.costBenefit * 0.2 +
        entry.fitTotal * 0.3 +
        entry.tech * 0.15 +
        entry.budgetFit * 0.1
      );
    case "premium":
      {
        const paceCompat = scorePaceCompatibility(entry.shoe, profile);
        return (
          entry.performance * 0.28 +
          entry.tech * 0.25 +
          entry.fitTotal * 0.22 +
          entry.budgetFit * 0.1 +
          (inBudget ? 10 : -14) +
          (entry.shoe.technical.isFlagship && inBudget ? 12 : 0) +
          (entry.shoe.technical.energyReturn >= 5 && profile.experience === "advanced" ? 8 : 0) +
          (paceCompat.compatibility === "ideal" ? 10 : 0) +
          (paceCompat.compatibility === "incompatible" ? -25 : 0)
        );
      }
    default:
      return entry.total;
  }
}

export function categoryLabel(category: string): string {
  return TECHNICAL_CATEGORY_LABELS[category as keyof typeof TECHNICAL_CATEGORY_LABELS] ?? category;
}
