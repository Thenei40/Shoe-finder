import type { AggressivenessLevel } from "./catalog-technical";
import { aggressivenessIndex, foamIsPebaBased, foamIsSoft } from "./catalog-technical";
import { scorePaceCompatibility, type PaceRunnerProfile } from "./pace-intelligence";
import type { Shoe } from "./shoes";

/** Perfil mínimo para análise biomecânica — evita dependência circular */
export type BiomechanicsProfile = {
  experience: "beginner" | "intermediate" | "advanced";
  primaryGoal: "walk" | "start" | "gym" | "daily" | "race";
  isBeginner: boolean;
  isHeavy: boolean;
  isLight: boolean;
  wantsComfort: boolean;
  wantsSpeed: boolean;
  needsStability: boolean;
  needsCushion: boolean;
  isRaceFocused: boolean;
  highVolume: boolean;
  feeling?: "macio" | "equilibrado" | "leve";
};

export type BiomechanicsScore = {
  total: number;
  notes: string[];
  warnings: string[];
};

/**
 * Avalia compatibilidade biomecânica entre corredor e tênis.
 * Regras baseadas em prática real de fitting para corrida.
 */
export function scoreBiomechanicsFit(
  shoe: Shoe,
  profile: BiomechanicsProfile,
): BiomechanicsScore {
  const tech = shoe.technical;
  let score = 0;
  const notes: string[] = [];
  const warnings: string[] = [];

  // —— Peso corporal ——
  if (profile.isHeavy) {
    score += tech.stability * 1.8;
    score += tech.softness * 0.8;

    if (tech.stability <= 2) {
      score -= 18;
      warnings.push("Base instável para faixa de peso mais alta");
    }
    if (tech.aggressiveness === "agressivo" || tech.aggressiveness === "race_day_extremo") {
      score -= 15;
      warnings.push("Plataforma agressiva demais para absorver impacto com segurança");
    }
    if (tech.softness >= 4 && tech.stability <= 3 && tech.responsiveness <= 2) {
      score -= 8;
      warnings.push("Amortecimento muito macio sem estabilidade — pode cansar em treinos longos");
    }
    if (tech.gaitSupport === "stability" || tech.gaitSupport === "max_stability") {
      score += 12;
      notes.push("Estabilidade reforçada adequada para maior impacto");
    }
    if (tech.volumeHandling === "high") {
      score += 6;
    }
  }

  if (profile.isLight) {
    score += tech.responsiveness * 1.6;
    score += (6 - tech.weightGrams / 50) * 0.5;

    if (tech.responsiveness >= 4) {
      score += 8;
      notes.push("Resposta aproveitada por corredores mais leves");
    }
    if (tech.softness >= 5 && profile.wantsSpeed) {
      score -= 6;
      warnings.push("Amortecimento excessivo pode limitar sensação de velocidade");
    }
    if (tech.weightGrams <= 250 && profile.wantsSpeed) {
      score += 6;
    }
  }

  // —— Experiência ——
  if (profile.isBeginner) {
    const maxAgg: AggressivenessLevel = "equilibrado";
    const shoeAgg = aggressivenessIndex(tech.aggressiveness);
    const maxAggIdx = aggressivenessIndex(maxAgg);

    if (shoeAgg > maxAggIdx) {
      score -= 20 + (shoeAgg - maxAggIdx) * 8;
      warnings.push("Modelo agressivo demais para fase inicial — exige adaptação muscular e técnica");
    }

    if (tech.hasPlate) {
      score -= 25;
      warnings.push("Placa de carbono exige base de corrida antes de usar com segurança");
    }

    if (tech.aggressiveness === "confortavel" || tech.aggressiveness === "equilibrado") {
      score += 10;
      notes.push("Plataforma previsível e acolhedora para construir base");
    }

    if (foamIsPebaBased(tech.foamMidsole) && tech.responsiveness >= 4) {
      score -= 6;
      warnings.push("Espuma super-responsiva pode parecer instável para quem está começando");
    }
  }

  if (profile.experience === "advanced") {
    if (profile.isRaceFocused && tech.hasPlate) {
      score += 12;
      notes.push("Placa alinhada com objetivo de performance");
    }
    if (tech.aggressiveness === "race_day_extremo") {
      score += profile.isRaceFocused ? 10 : -8;
    }
  }

  // —— Conforto vs firmeza ——
  if (profile.wantsComfort && !profile.wantsSpeed) {
    score += tech.softness * 2;
    score -= tech.responsiveness * 0.5;

    if (tech.aggressiveness === "agressivo" || tech.aggressiveness === "race_day_extremo") {
      score -= 14;
      warnings.push("Plataforma firme demais para quem busca conforto");
    }
    if (foamIsSoft(tech.foamMidsole) || tech.softness >= 4) {
      score += 8;
    }
  }

  if (profile.wantsSpeed) {
    score += tech.responsiveness * 1.8;
    if (tech.aggressiveness === "agressivo" || tech.aggressiveness === "race_day_extremo") {
      score += 6;
    }
  }

  // —— Estabilidade / desconfortos ——
  if (profile.needsStability) {
    score += tech.stability * 2.2;
    if (tech.gaitSupport === "stability" || tech.gaitSupport === "max_stability") {
      score += 10;
      notes.push("Suporte de passada alinhado com necessidade de estabilidade");
    }
    if (tech.stability <= 2) {
      score -= 16;
      warnings.push("Estabilidade insuficiente para quem relata instabilidade");
    }
  }

  if (profile.needsCushion) {
    score += tech.softness * 1.5;
    if (tech.softness <= 2) {
      score -= 12;
      warnings.push("Amortecimento insuficiente para proteção articular");
    }
  }

  // —— Adaptação técnica ——
  if (tech.adaptationLevel === "elite") {
    if (profile.isBeginner || profile.experience === "intermediate") {
      score -= profile.isBeginner ? 30 : 15;
      warnings.push("Exige técnica avançada — corredor de elite que já domina super shoes");
    } else if (profile.experience === "advanced" && profile.isRaceFocused) {
      score += 10;
      notes.push("Nível de adaptação alinhado com perfil avançado focado em prova");
    }
  } else if (tech.adaptationLevel === "alta" && profile.isBeginner) {
    score -= 12;
    warnings.push("Adaptação alta recomendada — construa base antes de usar como principal");
  }

  // —— Super shoes ——
  if (tech.aggressiveness === "race_day_extremo") {
    if (profile.isBeginner) {
      score -= 30;
      warnings.push("Super shoe exige técnica, base e adaptação progressiva");
    } else if (!profile.isRaceFocused) {
      score -= 18;
      warnings.push("Super shoe não é ideal como tênis principal de treino diário");
    } else if (profile.experience === "advanced") {
      score += 8;
      notes.push("Super shoe compatível com perfil avançado focado em prova");
    }

    if (tech.volumeHandling === "race_only" && profile.highVolume) {
      score -= 10;
      warnings.push("Desgaste acelerado se usado em alto volume semanal");
    }
  }

  // —— Volume de treino ——
  if (profile.highVolume) {
    if (tech.volumeHandling === "high") score += 8;
    if (tech.volumeHandling === "race_only") score -= 12;
    if (tech.durability >= 4) score += 5;
  }

  // —— Objetivo vs uso ideal ——
  if (profile.primaryGoal === "race" && tech.idealUses.includes("maratona")) {
    score += 8;
  }
  if (profile.primaryGoal === "daily" && tech.idealUses.includes("rodagem_diaria")) {
    score += 8;
  }
  if (profile.primaryGoal === "walk" && tech.aggressiveness === "confortavel") {
    score += 6;
  }

  const paceProfile: PaceRunnerProfile = {
    experience: profile.experience,
    isBeginner: profile.isBeginner,
    isRaceFocused: profile.isRaceFocused,
    wantsComfort: profile.wantsComfort,
    wantsSpeed: profile.wantsSpeed,
    primaryGoal: profile.primaryGoal,
    feeling: profile.feeling ?? "equilibrado",
    highVolume: profile.highVolume,
  };
  const paceFit = scorePaceCompatibility(shoe, paceProfile);
  for (const w of paceFit.warnings.slice(0, 2)) {
    if (!warnings.includes(w)) warnings.push(w);
  }
  if (paceFit.notes[0] && !notes.includes(paceFit.notes[0])) {
    notes.push(paceFit.notes[0]);
  }

  return {
    total: Math.round(score),
    notes,
    warnings,
  };
}

/** Categoria ideal por estágio de evolução do corredor */
export function idealCategoryForEvolution(
  profile: BiomechanicsProfile,
): "daily_trainer" | "super_trainer" | "race_day" {
  if (profile.isBeginner || profile.experience === "beginner") {
    return "daily_trainer";
  }
  if (profile.experience === "intermediate") {
    return profile.isRaceFocused ? "super_trainer" : "daily_trainer";
  }
  return profile.isRaceFocused ? "race_day" : "super_trainer";
}

export function scoreEvolutionFit(shoe: Shoe, profile: BiomechanicsProfile): number {
  const ideal = idealCategoryForEvolution(profile);
  let score = 0;

  if (shoe.category === ideal) score += 14;
  if (shoe.secondaryCategories?.includes(ideal)) score += 6;

  if (profile.isBeginner && shoe.category === "race_day") score -= 25;
  if (profile.isBeginner && shoe.category === "super_trainer") score -= 10;

  if (profile.experience === "advanced" && profile.isRaceFocused) {
    if (shoe.category === "race_day") score += 12;
    if (shoe.category === "speed_trainer") score += 8;
  }

  if (profile.experience === "intermediate" && !profile.isRaceFocused) {
    if (shoe.category === "daily_trainer" || shoe.category === "super_trainer") {
      score += 10;
    }
  }

  return score;
}

export function technicalCompatibilitySummary(
  shoe: Shoe,
  profile: BiomechanicsProfile,
): string | null {
  const bio = scoreBiomechanicsFit(shoe, profile);
  if (bio.notes.length > 0) return bio.notes[0] ?? null;
  if (bio.warnings.length > 0) return bio.warnings[0] ?? null;
  return null;
}

export function getTechnicalWarnings(
  shoe: Shoe,
  profile: BiomechanicsProfile,
): string[] {
  return scoreBiomechanicsFit(shoe, profile).warnings;
}
