import {
  HEAVY_RUNNER_CATEGORIES,
  LIGHT_RUNNER_CATEGORIES,
  type TechnicalCategory,
} from "./catalog-categories";
import type { Shoe, ShoeInput } from "./shoes";
import { getShoeProfile } from "./shoe-scores";

export type WeightBandSlug =
  | "ate-60"
  | "60-70"
  | "70-80"
  | "80-90"
  | "90-100"
  | "100-110"
  | "acima-110";

export type BodyWeightCategory = "leve" | "medio" | "pesado";

export const WEIGHT_BAND_OPTIONS: { value: WeightBandSlug; label: string }[] = [
  { value: "ate-60", label: "Até 60 kg" },
  { value: "60-70", label: "60 – 70 kg" },
  { value: "70-80", label: "70 – 80 kg" },
  { value: "80-90", label: "80 – 90 kg" },
  { value: "90-100", label: "90 – 100 kg" },
  { value: "100-110", label: "100 – 110 kg" },
  { value: "acima-110", label: "Acima de 110 kg" },
];

export const WEIGHT_PROFILE_LABELS: Record<WeightBandSlug, string> = {
  "ate-60": "Faixa de peso leve — prioriza agilidade e resposta",
  "60-70": "Faixa de peso leve — boa liberdade para modelos versáteis",
  "70-80": "Faixa de peso intermediária — equilíbrio entre conforto e leveza",
  "80-90": "Faixa de peso intermediária — pede mais suporte no impacto",
  "90-100": "Faixa de peso mais alta — prioriza amortecimento e estabilidade",
  "100-110": "Faixa de peso mais alta — precisa de proteção consistente",
  "acima-110":
    "Faixa de peso acima de 110 kg — exige máxima absorção e base segura",
};

const ALL_BANDS: WeightBandSlug[] = WEIGHT_BAND_OPTIONS.map((o) => o.value);

function shoeCategories(shoe: ShoeInput): TechnicalCategory[] {
  return [shoe.category, ...(shoe.secondaryCategories ?? [])];
}

function matchesHeavyCategory(categories: TechnicalCategory[]): boolean {
  return categories.some((c) => HEAVY_RUNNER_CATEGORIES.has(c));
}

function matchesLightCategory(categories: TechnicalCategory[]): boolean {
  return categories.some((c) => LIGHT_RUNNER_CATEGORIES.has(c));
}

export function isWeightBandSlug(value: string): value is WeightBandSlug {
  return ALL_BANDS.includes(value as WeightBandSlug);
}

export function bodyWeightCategory(band: string): BodyWeightCategory {
  if (!isWeightBandSlug(band)) return "medio";
  if (band === "ate-60" || band === "60-70") return "leve";
  if (band === "70-80" || band === "80-90") return "medio";
  return "pesado";
}

export type ShoeWeightMetrics = {
  cushioningForHeavy: number;
  stabilityScore: number;
  agilityForLight: number;
  responsiveness: number;
  durability: number;
  idealBands: WeightBandSlug[];
};

export function shoeWeightMetrics(shoe: ShoeInput): ShoeWeightMetrics {
  const profile = getShoeProfile(shoe.id, shoe as Shoe);
  const categories = shoeCategories(shoe);

  let cushioningForHeavy =
    shoe.cushioningLevel >= 4
      ? 5
      : shoe.cushioningLevel >= 3
        ? 3
        : 2;

  let stabilityScore =
    shoe.stabilityLevelNum >= 4
      ? 5
      : shoe.stabilityLevelNum >= 3
        ? 3
        : 2;

  let agilityForLight =
    shoe.isAggressive || shoe.cushioningType === "responsivo"
      ? 5
      : shoe.cushioningType === "equilibrado"
        ? 4
        : 2;

  let durability =
    shoe.tier === "economico" || shoe.tier === "intermediario" ? 4 : 3;
  if (shoe.stabilityLevelNum >= 4) durability += 1;
  if (shoe.hasPlate) durability -= 1;

  if (matchesHeavyCategory(categories)) {
    cushioningForHeavy = Math.max(cushioningForHeavy, 5);
    stabilityScore = Math.max(stabilityScore, 4);
    agilityForLight = Math.min(agilityForLight, 3);
  }

  if (matchesLightCategory(categories)) {
    agilityForLight = 5;
    cushioningForHeavy = Math.min(cushioningForHeavy, 3);
  }

  const idealBands = new Set<WeightBandSlug>(
    (shoe.idealWeight ?? []) as WeightBandSlug[],
  );

  if (matchesLightCategory(categories) || agilityForLight >= 4) {
    idealBands.add("ate-60");
    idealBands.add("60-70");
    idealBands.add("70-80");
  }

  if (matchesHeavyCategory(categories) || cushioningForHeavy >= 4) {
    idealBands.add("80-90");
    idealBands.add("90-100");
    idealBands.add("100-110");
    idealBands.add("acima-110");
  }

  if (shoe.beginnerFriendly || shoe.versatilityScore >= 4) {
    idealBands.add("60-70");
    idealBands.add("70-80");
    idealBands.add("80-90");
    idealBands.add("90-100");
  }

  if (shoe.isAggressive || shoe.hasPlate) {
    idealBands.add("60-70");
    idealBands.add("70-80");
    idealBands.delete("acima-110");
    idealBands.delete("100-110");
  }

  const bands =
    idealBands.size > 0 ? [...idealBands] : [...ALL_BANDS];

  return {
    cushioningForHeavy,
    stabilityScore,
    agilityForLight,
    responsiveness: profile?.responsiveness ?? agilityForLight,
    durability: Math.max(1, Math.min(5, durability)),
    idealBands: bands,
  };
}

export function weightBandsForShoe(shoe: ShoeInput): WeightBandSlug[] {
  return shoeWeightMetrics(shoe).idealBands;
}

export function shoeMatchesUserWeight(
  shoe: ShoeInput,
  userBand: string,
): boolean {
  if (!isWeightBandSlug(userBand)) return true;
  return weightBandsForShoe(shoe).includes(userBand);
}

export function weightInsightClause(band: string): string | null {
  if (!isWeightBandSlug(band)) return null;

  const category = bodyWeightCategory(band);

  if (category === "leve") {
    return "como você possui uma faixa de peso mais leve, pode aproveitar melhor modelos mais ágeis e responsivos sem perder conforto";
  }

  if (category === "pesado") {
    return "como sua faixa de peso exige maior absorção de impacto e estabilidade, priorizamos modelos com amortecimento mais consistente e estrutura mais segura para treinos frequentes";
  }

  return "como seu peso está em faixa intermediária, buscamos o equilíbrio certo entre amortecimento, estabilidade e resposta em cada treino";
}
