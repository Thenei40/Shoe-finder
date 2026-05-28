import {
  lineCategoryForTechnical,
  TECHNICAL_CATEGORY_DEFAULTS,
  TECHNICAL_CATEGORY_LABELS,
  type TechnicalCategory,
} from "./catalog-categories";
import {
  AGGRESSIVENESS_LABELS,
  FOAM_LABELS,
  TRAINING_USE_LABELS,
} from "./catalog-technical";
import type {
  CatalogShoeDef,
  CatalogShoeInput,
  ExperienceLevel,
  RideFeel,
} from "./catalog-types";
import { resolveTechnicalSpec } from "./shoe-technical-specs";

const DEFAULT_DISCOMFORT = ["nada", "duro", "pe"];

function experienceToQuiz(levels: ExperienceLevel[]): string[] {
  const out = new Set<string>();
  for (const level of levels) {
    if (level === "iniciante") {
      out.add("nunca");
      out.add("comecando");
    }
    if (level === "intermediario") out.add("algum-tempo");
    if (level === "avancado" || level === "elite") out.add("frequente");
  }
  if (out.size === 0) return ["nunca", "comecando", "algum-tempo", "frequente"];
  return [...out];
}

function rideFeelToQuiz(feel: RideFeel): string[] {
  switch (feel) {
    case "macio":
      return ["macio", "equilibrado"];
    case "equilibrado":
      return ["equilibrado", "macio", "leve"];
    case "firme":
      return ["equilibrado", "leve"];
    case "agressivo":
      return ["leve", "equilibrado"];
  }
}

function usageForCategory(category: TechnicalCategory): string[] {
  switch (category) {
    case "beginner":
    case "daily_trainer":
    case "recovery":
      return ["comecar", "caminhada", "academia", "frequentes"];
    case "race_day":
    case "speed_trainer":
    case "lightweight":
      return ["provas", "frequentes"];
    case "stability":
    case "max_cushion":
    case "premium_comfort":
      return ["frequentes", "academia", "comecar"];
    case "super_trainer":
      return ["frequentes", "provas", "academia"];
    default:
      return ["frequentes", "academia", "comecar", "provas"];
  }
}

function frequencyForCategory(category: TechnicalCategory): string[] {
  if (category === "beginner") return ["1-2", "3-4"];
  if (category === "recovery") return ["3-4", "5plus", "1-2"];
  return ["3-4", "5plus", "1-2"];
}

function buildDescription(
  def: ReturnType<typeof mergeDef>,
  technical: ReturnType<typeof resolveTechnicalSpec>,
): string {
  const catLabel = TECHNICAL_CATEGORY_LABELS[def.category];
  const foam = FOAM_LABELS[technical.foamMidsole];
  return `${def.model} da ${def.brand} — ${catLabel.toLowerCase()}, entressola ${foam}. ${technical.modelDifferentiator}`;
}

function buildStrengths(
  def: ReturnType<typeof mergeDef>,
  technical: ReturnType<typeof resolveTechnicalSpec>,
): string[] {
  return [
    ...technical.realStrengths,
    `Espuma: ${FOAM_LABELS[technical.foamMidsole]}`,
    `Agressividade: ${AGGRESSIVENESS_LABELS[technical.aggressiveness]}`,
    technical.hasPlate ? "Com placa de propulsão" : "Sem placa — plataforma acessível",
  ];
}

function buildIdealFor(
  def: ReturnType<typeof mergeDef>,
  technical: ReturnType<typeof resolveTechnicalSpec>,
): string[] {
  const uses = technical.idealUses
    .slice(0, 3)
    .map((u) => TRAINING_USE_LABELS[u])
    .join(", ");

  const levels =
    technical.idealRunnerLevel.includes("iniciante") &&
    technical.idealRunnerLevel.length === 1
      ? "Corredores iniciantes"
      : technical.idealRunnerLevel.includes("elite")
        ? "Corredores avançados e elite"
        : "Corredores intermediários a avançados";

  return [
    levels,
    `Melhor para: ${uses}`,
    `Ritmo ideal: ${def.idealPace}`,
    technical.rideDescription,
  ];
}

function buildNotIdealFor(
  def: ReturnType<typeof mergeDef>,
  technical: ReturnType<typeof resolveTechnicalSpec>,
): string[] {
  return [...technical.realLimitations];
}

function mergeDef(raw: CatalogShoeDef): Required<
  Pick<
    CatalogShoeDef,
    | "tier"
    | "hasPlate"
    | "beginnerFriendly"
    | "isAggressive"
    | "cushioningType"
    | "stabilityLevel"
    | "cushioningLevel"
    | "stabilityLevelNum"
    | "rideFeel"
    | "experienceLevel"
    | "idealPace"
    | "idealWeight"
    | "versatilityScore"
    | "valuePosition"
    | "generation"
    | "purpose"
    | "comfortLevel"
    | "bestUse"
  >
> &
  CatalogShoeDef & { technical?: CatalogShoeDef["technical"] } {
  const defaults = TECHNICAL_CATEGORY_DEFAULTS[raw.category];

  return {
    ...raw,
    secondaryCategories: raw.secondaryCategories ?? [],
    tier: raw.tier ?? defaults.tier,
    hasPlate: raw.hasPlate ?? defaults.hasPlate,
    beginnerFriendly: raw.beginnerFriendly ?? defaults.beginnerFriendly,
    isAggressive: raw.isAggressive ?? defaults.isAggressive,
    cushioningType: raw.cushioningType ?? defaults.cushioningType,
    stabilityLevel: raw.stabilityLevel ?? defaults.stabilityLevel,
    cushioningLevel: raw.cushioningLevel ?? defaults.cushioningLevel,
    stabilityLevelNum: raw.stabilityLevelNum ?? defaults.stabilityLevelNum,
    rideFeel: raw.rideFeel ?? defaults.rideFeel,
    experienceLevel: raw.experienceLevel ?? defaults.experienceLevel,
    idealPace: raw.idealPace ?? defaults.idealPace,
    idealWeight: raw.idealWeight ?? defaults.idealWeight,
    versatilityScore: raw.versatilityScore ?? defaults.versatilityScore,
    valuePosition: raw.valuePosition ?? defaults.valuePosition,
    generation: raw.generation ?? "standard",
    purpose:
      raw.purpose ??
      `Referência ${raw.brand} em ${TECHNICAL_CATEGORY_LABELS[raw.category].toLowerCase()}`,
    comfortLevel:
      raw.comfortLevel ??
      (raw.rideFeel === "macio" || defaults.rideFeel === "macio"
        ? "Macio e confortável"
        : raw.rideFeel === "agressivo" || defaults.rideFeel === "agressivo"
          ? "Leve e responsivo"
          : "Equilibrado"),
    bestUse:
      raw.bestUse ??
      (raw.category === "beginner"
        ? "Primeiros passos na corrida"
        : raw.category === "race_day"
          ? "Dia de prova e máxima performance"
          : raw.category === "recovery"
            ? "Treinos regenerativos e dias fáceis"
            : raw.category === "super_trainer"
              ? "Treinos exigentes com resposta premium"
              : "Treinos do dia a dia"),
    technical: raw.technical,
  };
}

export function expandCatalog(defs: CatalogShoeDef[]): CatalogShoeInput[] {
  return defs.map((raw) => {
    const def = mergeDef(raw);
    const lineCategory = lineCategoryForTechnical(def.category);
    const technical = resolveTechnicalSpec(def);

    return {
      id: def.id,
      name: `${def.brand} ${def.model}`,
      brand: def.brand,
      price: def.price,
      tier: def.tier,
      category: def.category,
      secondaryCategories: def.secondaryCategories ?? [],
      lineCategory,
      modelLabel: def.model,
      hasPlate: technical.hasPlate,
      beginnerFriendly: def.beginnerFriendly,
      isAggressive:
        def.isAggressive ||
        technical.aggressiveness === "agressivo" ||
        technical.aggressiveness === "race_day_extremo",
      cushioningType: def.cushioningType,
      stabilityLevel: def.stabilityLevel,
      cushioningLevel: technical.softness as typeof def.cushioningLevel,
      stabilityLevelNum: technical.stability as typeof def.stabilityLevelNum,
      rideFeel: def.rideFeel,
      experienceLevel: technical.idealRunnerLevel,
      idealPace: def.idealPace,
      idealWeight: def.idealWeight,
      valuePosition: def.valuePosition,
      generation: def.generation,
      versatilityScore: def.versatilityScore,
      purpose: def.purpose,
      comfortLevel: def.comfortLevel,
      bestUse: def.bestUse,
      description: buildDescription(def, technical),
      strengths: buildStrengths(def, technical),
      idealFor: buildIdealFor(def, technical),
      notIdealFor: buildNotIdealFor(def, technical),
      usage: usageForCategory(def.category),
      feeling: rideFeelToQuiz(def.rideFeel),
      experience: experienceToQuiz(def.experienceLevel),
      discomfort: [...DEFAULT_DISCOMFORT],
      frequency: frequencyForCategory(def.category),
      prices: [],
      weight: def.idealWeight,
      technical,
    };
  });
}
