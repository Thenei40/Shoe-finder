import type { ShoeTechnicalSpec } from "./catalog-technical";
import type { Shoe } from "./shoes";

/** Perfil mínimo para inferência de ritmo — evita dependência circular */
export type PaceRunnerProfile = {
  experience: "beginner" | "intermediate" | "advanced";
  isBeginner: boolean;
  isRaceFocused: boolean;
  wantsComfort: boolean;
  wantsSpeed: boolean;
  primaryGoal: "walk" | "start" | "gym" | "daily" | "race";
  feeling: "macio" | "equilibrado" | "leve";
  highVolume: boolean;
};

export type RunnerPaceEstimate = {
  /** Ritmo típico de treino fácil/regenerativo (seg/km) */
  trainingPaceSec: number;
  /** Ritmo de limiar / treino de qualidade (seg/km) */
  thresholdPaceSec: number;
  isSlowRunner: boolean;
  isFastRunner: boolean;
};

export type PaceCompatibility = "ideal" | "acceptable" | "marginal" | "incompatible";

export type PaceCompatibilityResult = {
  score: number;
  compatibility: PaceCompatibility;
  userPaceSec: number;
  notes: string[];
  warnings: string[];
};

/** Converte segundos/km para string legível (ex: 285 → "4:45/km") */
export function formatPaceSec(sec: number): string {
  const clamped = Math.max(120, Math.round(sec));
  const min = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${min}:${s.toString().padStart(2, "0")}/km`;
}

/** Estima ritmo do corredor a partir do perfil do quiz (sem pergunta de pace) */
export function estimateRunnerPace(profile: PaceRunnerProfile): RunnerPaceEstimate {
  let training = 390; // ~6:30/km baseline

  if (profile.experience === "beginner") training += 45;
  else if (profile.experience === "intermediate") training += 15;
  else training -= 45;

  if (profile.primaryGoal === "walk") training += 75;
  if (profile.primaryGoal === "start") training += 30;
  if (profile.isRaceFocused) training -= 30;
  if (profile.wantsSpeed && !profile.isBeginner) training -= 25;
  if (profile.wantsComfort && !profile.wantsSpeed) training += 25;
  if (profile.feeling === "macio") training += 20;
  if (profile.feeling === "leve") training -= 20;
  if (profile.highVolume) training += 15;

  training = Math.max(270, Math.min(510, training));
  const threshold = Math.max(210, training - 45);

  return {
    trainingPaceSec: training,
    thresholdPaceSec: threshold,
    isSlowRunner: training >= 390,
    isFastRunner: training <= 330,
  };
}

function classifyCompatibility(
  userPaceSec: number,
  tech: Pick<
    ShoeTechnicalSpec,
    | "idealPaceMinSec"
    | "idealPaceMaxSec"
    | "efficientPaceMaxSec"
    | "paceSensitivity"
  >,
): PaceCompatibility {
  if (userPaceSec >= tech.idealPaceMinSec && userPaceSec <= tech.idealPaceMaxSec) {
    return "ideal";
  }
  if (userPaceSec > tech.idealPaceMaxSec && userPaceSec <= tech.efficientPaceMaxSec) {
    return "acceptable";
  }
  if (userPaceSec > tech.efficientPaceMaxSec) {
    return tech.paceSensitivity >= 4 ? "incompatible" : "marginal";
  }
  return "ideal"; // mais rápido que o mínimo — geralmente ok
}

/**
 * Avalia compatibilidade entre ritmo estimado do corredor e faixa ideal do tênis.
 */
export function scorePaceCompatibility(
  shoe: Shoe,
  profile: PaceRunnerProfile,
): PaceCompatibilityResult {
  const tech = shoe.technical;
  const runner = estimateRunnerPace(profile);
  const userPaceSec = profile.isRaceFocused
    ? runner.thresholdPaceSec
    : runner.trainingPaceSec;

  let score = 0;
  const notes: string[] = [];
  const warnings: string[] = [];
  const compatibility = classifyCompatibility(userPaceSec, tech);

  switch (compatibility) {
    case "ideal":
      score += 20;
      notes.push("Ritmo estimado dentro da faixa ideal do modelo");
      break;
    case "acceptable":
      score += 6;
      warnings.push(
        "No seu ritmo habitual, parte da placa e espuma pode não ser totalmente aproveitada",
      );
      break;
    case "marginal":
      score -= 10;
      warnings.push(
        "Ritmo abaixo da faixa eficiente — benefício tecnológico reduzido",
      );
      break;
    case "incompatible":
      score -= 28;
      warnings.push(
        "Ritmo incompatível — super shoe agressivo tende a ficar instável ou desconfortável em trotes lentos",
      );
      break;
  }

  if (userPaceSec < tech.idealPaceMinSec && tech.paceSensitivity >= 3) {
    score += 10;
    notes.push("Ritmo rápido aproveita bem a plataforma responsiva");
  }

  if (tech.advancedOnly && profile.experience !== "advanced") {
    score -= profile.isBeginner ? 28 : 14;
    warnings.push("Exige biomecânica eficiente e experiência consolidada na corrida");
  }

  if (
    profile.isBeginner &&
    (tech.technicalDemandLevel === "elite_race_day" ||
      tech.technicalDemandLevel === "agressivo")
  ) {
    score -= 22;
    warnings.push("Modelo agressivo demais para quem está construindo base");
  }

  if (runner.isSlowRunner) {
    if (
      tech.technicalDemandLevel === "elite_race_day" ||
      tech.technicalDemandLevel === "agressivo"
    ) {
      score -= 20;
    }
    if (
      tech.technicalDemandLevel === "confortavel" ||
      tech.technicalDemandLevel === "versatil"
    ) {
      score += 12;
      notes.push("Daily premium combina melhor com ritmos mais confortáveis");
    }
    if (shoe.category === "super_trainer" && tech.paceSensitivity <= 3) {
      score += 8;
      notes.push("Super trainer oferece experiência mais equilibrada para o seu ritmo");
    }
  }

  if (runner.isFastRunner && tech.technicalDemandLevel === "elite_race_day") {
    score += 12;
    notes.push("Ritmo compatível com super shoes de elite");
  }

  if (
    !profile.isRaceFocused &&
    tech.technicalDemandLevel === "elite_race_day"
  ) {
    score -= 15;
  }

  return {
    score: Math.round(score),
    compatibility,
    userPaceSec,
    notes,
    warnings,
  };
}

export function buildPaceRecommendationText(
  shoe: Shoe,
  profile: PaceRunnerProfile,
  slot?: "acessivel" | "equilibrado" | "evolucao" | "premium",
): string[] {
  const tech = shoe.technical;
  const result = scorePaceCompatibility(shoe, profile);
  const parts: string[] = [];

  const idealRange = `${formatPaceSec(tech.idealPaceMinSec)} a ${formatPaceSec(tech.idealPaceMaxSec)}`;
  const efficientMax = formatPaceSec(tech.efficientPaceMaxSec);

  if (tech.technicalDemandLevel === "elite_race_day") {
    parts.push(
      `Este modelo começa a mostrar seu verdadeiro potencial em ritmos mais rápidos, normalmente abaixo de ${efficientMax}.`,
    );
    parts.push(
      "Por ser um super shoe agressivo, tende a funcionar melhor para corredores com boa eficiência mecânica.",
    );
  } else if (tech.technicalDemandLevel === "responsivo" || tech.technicalDemandLevel === "agressivo") {
    parts.push(
      `Faixa ideal de uso: ${idealRange} — a espuma e ${tech.hasPlate ? "a placa" : "a entressola"} respondem melhor nesse intervalo.`,
    );
  } else if (tech.technicalDemandLevel === "confortavel" || tech.technicalDemandLevel === "versatil") {
    parts.push(
      "Não depende de ritmo agressivo — prioriza conforto e consistência em treinos variados.",
    );
  }

  if (result.compatibility === "acceptable" || result.compatibility === "marginal") {
    parts.push(
      "Em ritmos leves e regenerativos, parte da tecnologia da placa e espuma pode não ser totalmente aproveitada.",
    );
  }

  if (
    result.compatibility === "incompatible" ||
    (result.compatibility === "marginal" && slot === "premium")
  ) {
    parts.push(
      "Para o seu ritmo atual, um super trainer ou daily premium pode entregar experiência mais equilibrada e confortável.",
    );
  }

  if (result.compatibility === "ideal" && tech.hasPlate && slot === "premium") {
    parts.push(
      `No seu perfil, a placa e a espuma ${tech.foamMidsole.includes("turbo") || tech.foamMidsole === "zoomx" || tech.foamMidsole === "peba" ? "premium" : "responsiva"} tendem a funcionar no ritmo certo.`,
    );
  }

  if (tech.advancedOnly && profile.experience !== "advanced") {
    parts.push(
      "Talvez ainda não faça sentido investir neste modelo — construa base com um daily ou super trainer primeiro.",
    );
  }

  return parts.filter(Boolean).slice(0, 3);
}

export function paceInsightForProfile(profile: PaceRunnerProfile): string {
  const runner = estimateRunnerPace(profile);
  const pace = formatPaceSec(runner.trainingPaceSec);
  if (runner.isSlowRunner) {
    return `ritmo estimado em torno de ${pace} nos treinos fáceis`;
  }
  if (runner.isFastRunner) {
    return `ritmo estimado em torno de ${pace}, compatível com modelos mais responsivos`;
  }
  return `ritmo estimado em torno de ${pace}`;
}
