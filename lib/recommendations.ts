import { BRAND_LABELS, shoeBrandSlug } from "./brands";
import { isPriceInBand, marketTierLabel } from "./prices";
import { buildProfileSummary } from "./profile";
import {
  analyzeRunnerProfile,
  isCategoryAllowedForSlot,
  isViableRecommendation,
  productFamily,
  rankShoes,
  slotCategoryPreference,
  slotPriorityScore,
  type ScoredShoe,
} from "./recommendation-engine";
import { buildSlotReason, type RecommendationSlot } from "./reasons";
import {
  buildRecommendationSetSummaries,
  type RecommendationSummary,
} from "./recommendation-experience";
import { buildBadge } from "./shoe-intelligence";
import { type FormAnswers, type Shoe, SHOES } from "./shoes";

export type { RecommendationSlot } from "./reasons";
export type { RecommendationSummary } from "./recommendation-experience";

export type Recommendation = {
  shoe: Shoe;
  slot: RecommendationSlot;
  slotLabel: string;
  badge: string;
  reason: string;
  score: number;
  highlighted: boolean;
  summary: RecommendationSummary;
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

const RECOMMENDATION_COUNT = 4;
const RANKING_WINDOW = 40;

function hasBrandPreference(answers: FormAnswers): boolean {
  return (
    !!answers.brandPreference &&
    answers.brandPreference !== "sem-preferencia"
  );
}

function getCandidatePool(answers: FormAnswers): Shoe[] {
  if (!hasBrandPreference(answers)) return [...SHOES];
  return SHOES.filter(
    (s) => shoeBrandSlug(s.brand) === answers.brandPreference,
  );
}

function selectTopRecommendations(
  ranked: ScoredShoe[],
  answers: FormAnswers,
): { entry: ScoredShoe; slot: RecommendationSlot }[] {
  const profile = analyzeRunnerProfile(answers);
  const viable = ranked.filter((r) => isViableRecommendation(r, profile));
  const source = viable.length >= RECOMMENDATION_COUNT ? viable : ranked;
  const window = source.slice(0, Math.min(RANKING_WINDOW, source.length));

  const picks: { entry: ScoredShoe; slot: RecommendationSlot }[] = [];
  const usedIds = new Set<string>();
  const usedCategories = new Set<string>();
  const usedBrands = new Set<string>();
  const usedFamilies = new Set<string>();
  const mixBrands = !hasBrandPreference(answers);

  for (const slot of SLOT_BY_INDEX) {
    const preferredCategories = slotCategoryPreference(slot, profile);

    const candidates = [...window]
      .filter((entry) => !usedIds.has(entry.shoe.id))
      .sort(
        (a, b) =>
          slotPriorityScore(b, slot, profile) -
            slotPriorityScore(a, slot, profile) ||
          b.total - a.total ||
          a.shoe.price - b.shoe.price,
      );

    let chosen: ScoredShoe | null = null;

    for (const entry of candidates) {
      if (usedCategories.has(entry.shoe.category)) continue;
      if (usedFamilies.has(productFamily(entry.shoe.id))) continue;
      if (!isCategoryAllowedForSlot(entry.shoe.category, slot, profile)) continue;
      if (
        preferredCategories &&
        !preferredCategories.has(entry.shoe.category) &&
        usedCategories.size < RECOMMENDATION_COUNT - 1
      ) {
        continue;
      }
      if (
        mixBrands &&
        usedBrands.has(entry.shoe.brand) &&
        usedBrands.size < RECOMMENDATION_COUNT - 1
      ) {
        continue;
      }
      chosen = entry;
      break;
    }

    if (!chosen) {
      for (const entry of candidates) {
        if (usedCategories.has(entry.shoe.category)) continue;
        if (usedFamilies.has(productFamily(entry.shoe.id))) continue;
        if (!isCategoryAllowedForSlot(entry.shoe.category, slot, profile)) continue;
        if (
          mixBrands &&
          usedBrands.has(entry.shoe.brand) &&
          usedBrands.size < RECOMMENDATION_COUNT - 1
        ) {
          continue;
        }
        chosen = entry;
        break;
      }
    }

    if (!chosen) {
      chosen =
        candidates.find(
          (entry) =>
            !usedCategories.has(entry.shoe.category) &&
            !usedFamilies.has(productFamily(entry.shoe.id)) &&
            isCategoryAllowedForSlot(entry.shoe.category, slot, profile),
        ) ??
        candidates.find(
          (entry) =>
            !usedCategories.has(entry.shoe.category) &&
            isCategoryAllowedForSlot(entry.shoe.category, slot, profile),
        ) ??
        candidates.find((entry) =>
          isCategoryAllowedForSlot(entry.shoe.category, slot, profile),
        ) ??
        candidates[0] ??
        null;
    }

    if (chosen) {
      picks.push({ entry: chosen, slot });
      usedIds.add(chosen.shoe.id);
      usedCategories.add(chosen.shoe.category);
      usedBrands.add(chosen.shoe.brand);
      usedFamilies.add(productFamily(chosen.shoe.id));
    }
  }

  for (const entry of window) {
    if (picks.length >= RECOMMENDATION_COUNT) break;
    if (!usedIds.has(entry.shoe.id)) {
      picks.push({
        entry,
        slot: SLOT_BY_INDEX[picks.length] ?? "evolucao",
      });
      usedIds.add(entry.shoe.id);
    }
  }

  return picks
    .slice(0, RECOMMENDATION_COUNT)
    .sort(
      (a, b) =>
        a.entry.shoe.price - b.entry.shoe.price ||
        a.entry.shoe.id.localeCompare(b.entry.shoe.id),
    );
}

function buildSlotLabel(
  slot: RecommendationSlot,
  index: number,
  shoe: Shoe,
  answers: FormAnswers,
): string {
  const step = SLOT_STEP_LABELS[slot];
  const tier = marketTierLabel(shoe.price);
  const brandSuffix = hasBrandPreference(answers) ? ` · ${shoe.brand}` : "";
  return `${index + 1}º · ${step} · ${tier}${brandSuffix}`;
}

export function getRecommendations(answers: FormAnswers): Recommendation[] {
  const pool = getCandidatePool(answers);
  const ranked = rankShoes(pool, answers);
  const entries = selectTopRecommendations(ranked, answers);
  const profile = analyzeRunnerProfile(answers);

  const slotItems = entries.map(({ entry, slot }) => ({
    shoe: entry.shoe,
    slot,
  }));
  const summaries = buildRecommendationSetSummaries(answers, slotItems);

  return entries.map(({ entry, slot }, index) => {
    const inBudget =
      !profile.budgetBand ||
      isPriceInBand(entry.shoe.price, profile.budgetBand);

    const dimensions = {
      profile: entry.fitTotal,
      costBenefit: entry.costBenefit,
      performance: entry.performance,
      tech: entry.tech,
      budgetFit: entry.budgetFit,
      total: entry.total,
    };

    return {
      shoe: entry.shoe,
      slot,
      slotLabel: buildSlotLabel(slot, index, entry.shoe, answers),
      badge: buildBadge(dimensions, entry.intelligence, slot, inBudget),
      reason: buildSlotReason(answers, entry.shoe, slot, entry),
      score: entry.total,
      highlighted: slot === "equilibrado",
      summary: summaries[index],
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
      title: `Sua seleção ${brand}`,
      subtitle:
        "Quatro resumos objetivos — do melhor custo-benefício ao premium.",
    };
  }

  return {
    title: "Sua seleção personalizada",
    subtitle:
      "Quatro resumos objetivos — leitura rápida, do essencial ao premium.",
  };
}

export { buildProfileSummary };
