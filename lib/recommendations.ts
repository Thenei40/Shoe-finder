import { BRAND_LABELS, shoeBrandSlug } from "./brands";
import {
  desiredValueScoreForBand,
  isPriceInBand,
  marketTierLabel,
  primaryPriceBand,
} from "./prices";
import { buildProfileSummary } from "./profile";
import { buildSlotReason, type RecommendationSlot } from "./reasons";
import { getShoeProfile } from "./shoe-scores";
import { type FormAnswers, type Shoe, SHOES } from "./shoes";
import {
  bodyWeightCategory,
  isWeightBandSlug,
  shoeMatchesUserWeight,
  shoeWeightMetrics,
} from "./weight";

export type { RecommendationSlot } from "./reasons";

export type Recommendation = {
  shoe: Shoe;
  slot: RecommendationSlot;
  slotLabel: string;
  badge: string;
  reason: string;
  score: number;
  /** Card intermediário — destaque visual na UI */
  highlighted: boolean;
};

const SLOT_BY_INDEX: RecommendationSlot[] = [
  "acessivel",
  "equilibrado",
  "evolucao",
  "premium",
];

const SLOT_STEP_LABELS: Record<RecommendationSlot, string> = {
  acessivel: "Entrada",
  equilibrado: "Equilíbrio",
  evolucao: "Evolução",
  premium: "Premium",
};

function matches(list: string[], value: string): boolean {
  return list.includes(value);
}

function isBeginner(answers: FormAnswers): boolean {
  return answers.experience === "nunca" || answers.experience === "comecando";
}

function hasBrandPreference(answers: FormAnswers): boolean {
  return (
    !!answers.brandPreference &&
    answers.brandPreference !== "sem-preferencia"
  );
}

function shoeMatchesPreferredBrand(shoe: Shoe, answers: FormAnswers): boolean {
  if (!hasBrandPreference(answers)) return false;
  return shoeBrandSlug(shoe.brand) === answers.brandPreference;
}

/** Catálogo completo — sem eliminar modelos antes do score */
function getCandidatePool(answers: FormAnswers): Shoe[] {
  if (!hasBrandPreference(answers)) return [...SHOES];
  return SHOES.filter((s) => shoeMatchesPreferredBrand(s, answers));
}

function isTechnicallySuitable(shoe: Shoe, answers: FormAnswers): boolean {
  if (shoe.hasPlate && isBeginner(answers)) return false;
  if (shoe.isAggressive && isBeginner(answers)) return false;
  if (isBeginner(answers) && !shoe.beginnerFriendly && shoe.tier === "performance") {
    return false;
  }
  if (answers.feeling === "leve" && isBeginner(answers) && shoe.isAggressive) {
    return false;
  }
  if (answers.usage === "provas" && isBeginner(answers) && !shoe.beginnerFriendly) {
    return false;
  }

  const weightCat = isWeightBandSlug(answers.weight)
    ? bodyWeightCategory(answers.weight)
    : null;

  if (weightCat === "pesado") {
    if (isBeginner(answers) && shoe.isAggressive) return false;
    if (
      isBeginner(answers) &&
      shoe.cushioningType === "responsivo" &&
      shoe.tier === "performance"
    ) {
      return false;
    }
  }

  if (weightCat === "leve" && isBeginner(answers) && shoe.tier === "performance") {
    return false;
  }

  return true;
}

function scoreWeightFit(shoe: Shoe, answers: FormAnswers): number {
  if (!answers.weight || !isWeightBandSlug(answers.weight)) return 0;

  const metrics = shoeWeightMetrics(shoe);
  const profile = getShoeProfile(shoe.id, shoe);
  const category = bodyWeightCategory(answers.weight);
  let score = 0;

  if (metrics.idealBands.includes(answers.weight)) score += 7;
  else score -= 8;

  if (category === "leve") {
    score += metrics.agilityForLight * 1.5;
    score += metrics.responsiveness * 1.2;
    if (shoe.cushioningType === "responsivo") score += 3;
    if (shoe.isAggressive && !isBeginner(answers)) score += 4;
    if (shoe.cushioningType === "macio" && answers.feeling === "leve") {
      score -= 2;
    }
  } else if (category === "pesado") {
    score += metrics.cushioningForHeavy * 1.6;
    score += metrics.stabilityScore * 1.4;
    score += metrics.durability * 1;
    score += (profile?.comfort ?? 0) * 1.1;
    score += (profile?.stability ?? 0) * 0.8;
    if (shoe.cushioningType === "macio") score += 5;
    if (shoe.stabilityLevel === "alta") score += 5;
    if (shoe.isAggressive) score -= 10;
    if (shoe.cushioningType === "responsivo" && !shoe.beginnerFriendly) {
      score -= 6;
    }
    if (shoe.hasPlate && category === "pesado") score -= 4;
  } else {
    score += metrics.cushioningForHeavy * 0.7;
    score += metrics.agilityForLight * 0.7;
    score += metrics.durability * 0.6;
    score += (profile?.versatility ?? 0) * 0.9;
    if (shoe.stabilityLevel === "alta") score += 2;
  }

  return Math.round(score);
}

function desiredRunnerLevel(answers: FormAnswers): string {
  if (isBeginner(answers)) return "iniciante";
  if (answers.experience === "frequente") return "avancado";
  return "intermediario";
}

function desiredTrainingTypes(answers: FormAnswers): string[] {
  const types: string[] = ["misto"];
  if (answers.usage === "caminhada" || answers.usage === "comecar") {
    types.push("facil");
  }
  if (answers.frequency === "5plus" || answers.usage === "frequentes") {
    types.push("longao");
  }
  if (answers.usage === "provas" || answers.feeling === "leve") {
    types.push("tiro", "prova");
  }
  return types;
}

function scoreProfileFit(shoe: Shoe, answers: FormAnswers): number {
  const profile = getShoeProfile(shoe.id, shoe);
  if (!profile) return 0;

  let score = 0;
  const level = desiredRunnerLevel(answers);
  const trainings = desiredTrainingTypes(answers);

  if (profile.runnerLevels.includes(level)) score += 4;
  if (trainings.some((t) => profile.trainingTypes.includes(t))) score += 3;

  if (answers.feeling === "macio") {
    score += profile.comfort * 1.2;
    score -= profile.responsiveness * 0.3;
  } else if (answers.feeling === "leve") {
    score += profile.responsiveness * 1.2;
    score -= profile.comfort * 0.2;
  } else {
    score += (profile.comfort + profile.responsiveness) * 0.6;
  }

  if (
    answers.discomfort === "instabilidade" ||
    answers.discomfort === "pe" ||
    answers.discomfort === "joelho"
  ) {
    score += profile.stability * 1.1;
  }

  if (answers.discomfort === "duro" || answers.discomfort === "pe") {
    score += profile.comfort * 0.8;
  }

  const desiredValue = desiredValueScoreForBand(answers.price);
  score += 4 - Math.abs(profile.valueScore - desiredValue);

  score += shoe.versatilityScore * 0.4;

  if (answers.discomfort === "instabilidade" && shoe.stabilityLevel === "alta") {
    score += 3;
  }

  score += scoreWeightFit(shoe, answers) * 0.85;

  return Math.round(score);
}

function scoreShoe(shoe: Shoe, answers: FormAnswers): number {
  let score = scoreProfileFit(shoe, answers);

  if (!isTechnicallySuitable(shoe, answers)) score -= 20;

  if (matches(shoe.usage, answers.usage)) score += 5;
  if (matches(shoe.experience, answers.experience)) score += 5;
  if (matches(shoe.discomfort, answers.discomfort)) score += 4;
  if (matches(shoe.feeling, answers.feeling)) score += 4;
  if (matches(shoe.prices, answers.price)) score += 6;
  if (answers.price && isPriceInBand(shoe.price, answers.price)) score += 5;
  if (answers.price && !isPriceInBand(shoe.price, answers.price)) score -= 10;
  if (matches(shoe.frequency, answers.frequency)) score += 2;
  if (matches(shoe.weight, answers.weight)) score += 6;
  if (
    answers.weight &&
    isWeightBandSlug(answers.weight) &&
    shoeMatchesUserWeight(shoe, answers.weight)
  ) {
    score += 4;
  }

  if (shoe.beginnerFriendly && isBeginner(answers)) score += 6;
  if (shoe.isAggressive && isBeginner(answers)) score -= 12;
  if (shoe.hasPlate && isBeginner(answers)) score -= 12;

  if (answers.discomfort === "duro" && shoe.cushioningType === "macio") {
    score += 4;
  }
  if (
    (answers.discomfort === "pe" || answers.discomfort === "joelho") &&
    shoe.cushioningType === "macio"
  ) {
    score += 3;
  }

  return score;
}

type Ranked = { shoe: Shoe; score: number };

const RECOMMENDATION_COUNT = 4;
const RANKING_WINDOW = 24;

function rankPool(pool: Shoe[], answers: FormAnswers): Ranked[] {
  return pool
    .map((shoe) => ({
      shoe,
      score: scoreShoe(shoe, answers),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.shoe.price - b.shoe.price ||
        a.shoe.id.localeCompare(b.shoe.id),
    );
}

function sortByPriceAsc(items: Ranked[]): Ranked[] {
  return [...items].sort(
    (a, b) =>
      a.shoe.price - b.shoe.price || a.shoe.id.localeCompare(b.shoe.id),
  );
}

/**
 * Seleciona os melhores após ranking completo — diversidade de categorias
 * e, sem marca fixa, variedade entre marcas.
 */
function selectTopRecommendations(
  ranked: Ranked[],
  answers: FormAnswers,
): Ranked[] {
  const viable = ranked.filter((r) => r.score > -15);
  const source = viable.length > 0 ? viable : ranked;
  const window = source.slice(0, Math.min(RANKING_WINDOW, source.length));

  const picks: Ranked[] = [];
  const usedIds = new Set<string>();
  const usedCategories = new Set<string>();
  const usedBrands = new Set<string>();
  const mixBrands = !hasBrandPreference(answers);

  for (const entry of window) {
    if (picks.length >= RECOMMENDATION_COUNT) break;
    if (usedIds.has(entry.shoe.id)) continue;
    if (usedCategories.has(entry.shoe.lineCategory)) continue;
    if (mixBrands && usedBrands.has(entry.shoe.brand) && usedBrands.size < 4) {
      continue;
    }
    picks.push(entry);
    usedIds.add(entry.shoe.id);
    usedCategories.add(entry.shoe.lineCategory);
    usedBrands.add(entry.shoe.brand);
  }

  for (const entry of window) {
    if (picks.length >= RECOMMENDATION_COUNT) break;
    if (usedIds.has(entry.shoe.id)) continue;
    if (mixBrands && usedBrands.has(entry.shoe.brand) && picks.length < 3) {
      continue;
    }
    picks.push(entry);
    usedIds.add(entry.shoe.id);
    usedBrands.add(entry.shoe.brand);
  }

  for (const entry of source) {
    if (picks.length >= RECOMMENDATION_COUNT) break;
    if (!usedIds.has(entry.shoe.id)) {
      picks.push(entry);
      usedIds.add(entry.shoe.id);
    }
  }

  return sortByPriceAsc(picks.slice(0, RECOMMENDATION_COUNT));
}

function slotForIndex(index: number, total: number): RecommendationSlot {
  if (total === 1) return "equilibrado";
  if (total === 2) return index === 0 ? "acessivel" : "premium";
  if (total === 3) {
    if (index === 0) return "acessivel";
    if (index === 1) return "equilibrado";
    return "premium";
  }
  return SLOT_BY_INDEX[index] ?? "evolucao";
}

function buildBadge(
  slot: RecommendationSlot,
  shoe: Shoe,
  answers: FormAnswers,
): string {
  const profile = getShoeProfile(shoe.id, shoe);
  const band = primaryPriceBand(shoe.price);
  const inBudget =
    !answers.price || isPriceInBand(shoe.price, answers.price);
  const weightCat = isWeightBandSlug(answers.weight)
    ? bodyWeightCategory(answers.weight)
    : null;
  const metrics = shoeWeightMetrics(shoe);

  if (weightCat === "pesado" && slot === "equilibrado") {
    if (metrics.cushioningForHeavy >= 5) return "Mais confortável";
    if (metrics.stabilityScore >= 4) return "Mais estável";
  }
  if (weightCat === "leve" && slot === "equilibrado") {
    if (metrics.agilityForLight >= 4) return "Mais ágil";
    if (metrics.responsiveness >= 4) return "Mais responsivo";
  }

  switch (slot) {
    case "acessivel":
      if (band === "ate-500") return "Mais acessível";
      return inBudget ? "Melhor custo-benefício" : "Entrada da linha";
    case "equilibrado":
      if (band === "500-800" || band === "800-1200") return "Mais equilibrado";
      return "Melhor equilíbrio";
    case "evolucao":
      if (band === "1200-1800") return "Premium avançado";
      if ((profile?.versatility ?? 0) >= 4) return "Mais versátil";
      return "Boa evolução";
    case "premium":
      if (band === "acima-2500" || band === "1800-2500") {
        return shoe.hasPlate || shoe.tier === "performance"
          ? "Melhor performance"
          : "Super premium";
      }
      if (shoe.hasPlate || shoe.isAggressive || shoe.tier === "performance") {
        return "Melhor performance";
      }
      return "Mais premium";
    default:
      return marketTierLabel(shoe.price);
  }
}

function buildSlotLabel(
  slot: RecommendationSlot,
  index: number,
  shoe: Shoe,
  answers: FormAnswers,
): string {
  const step = SLOT_STEP_LABELS[slot];
  const tier = marketTierLabel(shoe.price);
  const brandSuffix = hasBrandPreference(answers)
    ? ` · ${shoe.brand}`
    : "";
  return `${index + 1}º · ${step} · ${tier}${brandSuffix}`;
}

export function getRecommendations(answers: FormAnswers): Recommendation[] {
  const pool = getCandidatePool(answers);
  const ranked = rankPool(pool, answers);
  const entries = selectTopRecommendations(ranked, answers);

  return entries.map((entry, index) => {
    const slot = slotForIndex(index, entries.length);
    return {
      shoe: entry.shoe,
      slot,
      slotLabel: buildSlotLabel(slot, index, entry.shoe, answers),
      badge: buildBadge(slot, entry.shoe, answers),
      reason: buildSlotReason(answers, entry.shoe, slot),
      score: entry.score,
      highlighted: slot === "equilibrado",
    };
  });
}

export function getResultsHeadline(answers: FormAnswers): {
  title: string;
  subtitle: string;
} {
  if (hasBrandPreference(answers)) {
    const brand =
      BRAND_LABELS[answers.brandPreference] ?? answers.brandPreference;
    return {
      title: `Sua consultoria ${brand}`,
      subtitle:
        "Analisamos todo o catálogo da marca para o seu perfil e selecionamos os modelos com melhor compatibilidade — do mais acessível ao premium.",
    };
  }

  return {
    title: "Encontramos o que combina com você",
    subtitle:
      "Comparamos dezenas de modelos entre as marcas, ranqueamos pelo seu perfil e mostramos os melhores — com destaque na opção mais equilibrada.",
  };
}

export { buildProfileSummary };
