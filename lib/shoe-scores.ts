import type { LineCategory } from "./catalog-types";
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
};

function trainingTypesForCategory(cat: LineCategory): string[] {
  switch (cat) {
    case "entrada":
    case "max-cushion":
      return ["facil", "misto"];
    case "estabilidade":
      return ["facil", "misto", "longao"];
    case "performance":
    case "prova":
      return ["tiro", "misto", "prova"];
    case "super-shoe":
      return ["prova", "tiro"];
    default:
      return ["misto", "longao", "facil"];
  }
}

function runnerLevelsForShoe(shoe: Shoe): string[] {
  if (shoe.beginnerFriendly && !shoe.isAggressive) {
    return ["iniciante", "intermediario"];
  }
  if (shoe.isAggressive || shoe.hasPlate) {
    return ["intermediario", "avancado"];
  }
  return ["iniciante", "intermediario", "avancado"];
}

export function deriveShoeProfile(shoe: Shoe): ShoeProfileScores {
  const comfort =
    shoe.cushioningType === "macio"
      ? 5
      : shoe.cushioningType === "equilibrado"
        ? 3
        : 2;

  const responsiveness =
    shoe.cushioningType === "responsivo"
      ? 5
      : shoe.isAggressive
        ? 4
        : shoe.cushioningType === "equilibrado"
          ? 3
          : 2;

  const stability =
    shoe.stabilityLevel === "alta"
      ? 5
      : shoe.stabilityLevel === "media"
        ? 3
        : 2;

  const valueScore =
    shoe.tier === "economico"
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
    trainingTypes: trainingTypesForCategory(shoe.lineCategory),
    runnerLevels: runnerLevelsForShoe(shoe),
  };
}

export function getShoeProfile(shoeId: string, shoe?: Shoe): ShoeProfileScores | null {
  if (SHOE_PROFILE_SCORES[shoeId]) return SHOE_PROFILE_SCORES[shoeId];
  if (shoe) return deriveShoeProfile(shoe);
  return null;
}
