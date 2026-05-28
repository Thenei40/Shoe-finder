import type { TechnicalCategory } from "./catalog-categories";
import type { Shoe, ShoeProfileScores } from "./shoes";

/** Overrides manuais para modelos-chave */
export const SHOE_PROFILE_SCORES: Record<string, ShoeProfileScores> = {
  "nike-pegasus-41": {
    comfort: 3,
    responsiveness: 4,
    stability: 4,
    valueScore: 4,
    versatility: 5,
    trainingTypes: ["misto", "longao", "tiro"],
    runnerLevels: ["iniciante", "intermediario", "avancado"],
  },
  "asics-cumulus-26": {
    comfort: 5,
    responsiveness: 3,
    stability: 4,
    valueScore: 4,
    versatility: 5,
    trainingTypes: ["facil", "longao", "misto"],
    runnerLevels: ["iniciante", "intermediario"],
  },
  "adidas-supernova-rise": {
    comfort: 4,
    responsiveness: 3,
    stability: 4,
    valueScore: 5,
    versatility: 5,
    trainingTypes: ["facil", "misto", "longao"],
    runnerLevels: ["iniciante", "intermediario"],
  },
  "nb-880v14": {
    comfort: 4,
    responsiveness: 3,
    stability: 4,
    valueScore: 4,
    versatility: 5,
    trainingTypes: ["facil", "misto", "longao"],
    runnerLevels: ["iniciante", "intermediario", "avancado"],
  },
  "saucony-ride-17": {
    comfort: 4,
    responsiveness: 3,
    stability: 3,
    valueScore: 4,
    versatility: 5,
    trainingTypes: ["facil", "misto", "longao"],
    runnerLevels: ["iniciante", "intermediario"],
  },
  "hoka-clifton-9": {
    comfort: 5,
    responsiveness: 2,
    stability: 3,
    valueScore: 4,
    versatility: 5,
    trainingTypes: ["facil", "longao", "misto"],
    runnerLevels: ["iniciante", "intermediario"],
  },
};

function trainingTypesForCategory(cat: TechnicalCategory): string[] {
  switch (cat) {
    case "beginner":
    case "recovery":
    case "max_cushion":
    case "premium_comfort":
      return ["facil", "misto"];
    case "stability":
      return ["facil", "misto", "longao"];
    case "daily_trainer":
    case "super_trainer":
      return ["misto", "longao", "facil", "tiro"];
    case "lightweight":
    case "speed_trainer":
      return ["tiro", "misto"];
    case "race_day":
      return ["prova", "tiro"];
    default:
      return ["misto", "longao", "facil"];
  }
}

function runnerLevelsForShoe(shoe: Shoe): string[] {
  if (shoe.experienceLevel?.length) {
    return shoe.experienceLevel.map((level) => {
      if (level === "elite") return "avancado";
      return level;
    });
  }

  if (shoe.beginnerFriendly && !shoe.isAggressive) {
    return ["iniciante", "intermediario"];
  }
  if (shoe.isAggressive || shoe.hasPlate) {
    return ["intermediario", "avancado"];
  }
  return ["iniciante", "intermediario", "avancado"];
}

export function deriveShoeProfile(shoe: Shoe): ShoeProfileScores {
  const comfort = shoe.cushioningLevel >= 4 ? 5 : shoe.cushioningLevel >= 3 ? 3 : 2;

  const responsiveness =
    shoe.cushioningLevel <= 2 || shoe.rideFeel === "agressivo"
      ? 5
      : shoe.isAggressive || shoe.rideFeel === "firme"
        ? 4
        : shoe.cushioningLevel >= 3
          ? 3
          : 2;

  const stability =
    shoe.stabilityLevelNum >= 4 ? 5 : shoe.stabilityLevelNum >= 3 ? 3 : 2;

  const valueScore =
    shoe.valuePosition === "economico" || shoe.valuePosition === "custo-beneficio"
      ? 5
      : shoe.valuePosition === "geracao-anterior"
        ? 4
        : shoe.tier === "economico"
          ? 5
          : shoe.tier === "intermediario"
            ? 4
            : shoe.tier === "premium"
              ? 3
              : 2;

  return {
    comfort,
    responsiveness,
    stability,
    valueScore,
    versatility: shoe.versatilityScore,
    trainingTypes: trainingTypesForCategory(shoe.category),
    runnerLevels: runnerLevelsForShoe(shoe),
  };
}

export function getShoeProfile(shoeId: string, shoe?: Shoe): ShoeProfileScores | null {
  if (SHOE_PROFILE_SCORES[shoeId]) return SHOE_PROFILE_SCORES[shoeId];
  if (shoe) return deriveShoeProfile(shoe);
  return null;
}
