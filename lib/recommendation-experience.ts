import { TECHNICAL_CATEGORY_LABELS } from "./catalog-categories";
import { TRAINING_USE_LABELS } from "./catalog-technical";
import { getTechnicalWarnings } from "./biomechanics";
import { formatPaceSec, scorePaceCompatibility } from "./pace-intelligence";
import { analyzeRunnerProfile } from "./recommendation-engine";
import { getShoeIntelligence } from "./shoe-intelligence";
import type { RecommendationSlot } from "./reasons";
import type { FormAnswers, Shoe } from "./shoes";

/** Resumo executivo — leitura rápida (~20 segundos) */
export type RecommendationSummary = {
  displayBadge: string;
  whyWeRecommend: [string, string, string];
  idealFor: [string, string, string];
  recommendedPace: string;
  attention: string;
  strengths: [string, string, string];
};

/** @deprecated Use RecommendationSummary */
export type RecommendationExperience = {
  summary: RecommendationSummary;
};

const SLOT_BADGE: Record<RecommendationSlot, string> = {
  equilibrado: "Melhor escolha",
  acessivel: "Melhor custo-benefício",
  evolucao: "Evolução",
  premium: "Premium",
};

const MAX_WORDS = 180;
const MAX_BULLET_WORDS = 14;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function trimWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= max) return words.join(" ");
  return `${words.slice(0, max).join(" ")}…`;
}

function simplify(text: string): string {
  return text
    .replace(/biomecânica|biomecanica/gi, "seu perfil")
    .replace(/entressola|PEBA|superfoam|flagship/gi, "")
    .replace(/adaptação elite|adaptação alta/gi, "experiência")
    .replace(/\s+/g, " ")
    .trim();
}

function paceLabel(shoe: Shoe): string {
  const t = shoe.technical;
  const min = formatPaceSec(t.idealPaceMinSec);
  const max = formatPaceSec(t.idealPaceMaxSec);
  if (t.technicalDemandLevel === "confortavel" || t.technicalDemandLevel === "versatil") {
    return `De ${max} para cima — não exige ritmo forte`;
  }
  return `${min} a ${max}`;
}

function idealForTriplet(shoe: Shoe): [string, string, string] {
  const fromTech = shoe.technical.idealUses
    .slice(0, 3)
    .map((u) => TRAINING_USE_LABELS[u]);
  const fromCatalog = shoe.idealFor.slice(0, 3);
  const merged = [...fromTech, ...fromCatalog].filter(Boolean);
  const unique = [...new Set(merged.map((s) => trimWords(simplify(s), MAX_BULLET_WORDS)))];
  while (unique.length < 3) {
    unique.push(
      unique.length === 0
        ? "Treinos do dia a dia"
        : unique.length === 1
          ? "Longões e volume semanal"
          : "Dias em que você quer conforto",
    );
  }
  return [unique[0], unique[1], unique[2]];
}

function whyTriplet(
  shoe: Shoe,
  slot: RecommendationSlot,
  profile: ReturnType<typeof analyzeRunnerProfile>,
): [string, string, string] {
  const cat =
    TECHNICAL_CATEGORY_LABELS[shoe.category] ?? shoe.categoryLabel;
  const intelligence = getShoeIntelligence(shoe);

  const bullets: string[] = [];

  if (slot === "equilibrado") {
    bullets.push("Melhor equilíbrio entre conforto, valor e seu perfil");
  } else if (slot === "acessivel") {
    bullets.push("Menor investimento da seleção com boa compatibilidade");
  } else if (slot === "evolucao") {
    bullets.push("Passo acima em resposta e completude para evoluir");
  } else {
    bullets.push("Topo da seleção em tecnologia e sensação");
  }

  if (profile.needsCushion && shoe.cushioningLevel >= 4) {
    bullets.push("Amortecimento generoso para proteger bem o corpo");
  } else if (profile.isRaceFocused && shoe.category === "race_day") {
    bullets.push("Focado em prova e treinos de ritmo forte");
  } else if (profile.wantsComfort) {
    bullets.push("Passada confortável para treinar com regularidade");
  } else {
    bullets.push(`Categoria ${cat} alinhada com sua rotina de corrida`);
  }

  if (intelligence.isAccessiblePremium && intelligence.generation === "previous") {
    bullets.push("Mesma linha premium, preço mais inteligente");
  } else if (shoe.technical.realStrengths[0]) {
    bullets.push(simplify(shoe.technical.realStrengths[0]));
  } else if (shoe.strengths[0]) {
    bullets.push(simplify(shoe.strengths[0]));
  } else {
    bullets.push("Versátil para a maior parte dos seus treinos");
  }

  return [
    trimWords(bullets[0], MAX_BULLET_WORDS),
    trimWords(bullets[1], MAX_BULLET_WORDS),
    trimWords(bullets[2], MAX_BULLET_WORDS),
  ];
}

function strengthsTriplet(shoe: Shoe): [string, string, string] {
  const pool = [
    ...shoe.technical.realStrengths,
    ...shoe.strengths.filter((s) => !s.startsWith("Categoria:")),
  ].map((s) => trimWords(simplify(s), MAX_BULLET_WORDS));

  const unique = [...new Set(pool)].filter(Boolean);
  while (unique.length < 3) {
    unique.push(
      unique.length === 0
        ? "Boa versatilidade no dia a dia"
        : unique.length === 1
          ? "Construção confiável para treinos frequentes"
          : "Equilíbrio entre conforto e durabilidade",
    );
  }
  return [unique[0], unique[1], unique[2]];
}

function pickAttention(
  shoe: Shoe,
  profile: ReturnType<typeof analyzeRunnerProfile>,
): string {
  const pace = scorePaceCompatibility(shoe, profile);
  const warnings = [
    ...pace.warnings,
    ...getTechnicalWarnings(shoe, profile),
    ...shoe.notIdealFor,
    ...shoe.technical.realLimitations,
  ]
    .map((w) => simplify(w))
    .filter(Boolean);

  if (warnings[0]) return trimWords(warnings[0], 18);

  if (shoe.category === "race_day") {
    return "Use mais em treinos rápidos e provas — desgasta rápido no uso diário";
  }

  return "Evite usar em terrenos muito irregulares se busca máxima estabilidade";
}

function enforceWordBudget(summary: RecommendationSummary): RecommendationSummary {
  const parts = [
    ...summary.whyWeRecommend,
    ...summary.idealFor,
    summary.recommendedPace,
    summary.attention,
    ...summary.strengths,
  ];

  let total = parts.reduce((n, p) => n + wordCount(p), 0);
  if (total <= MAX_WORDS) return summary;

  const trimmed = { ...summary };
  const shrink = (arr: string[]) =>
    arr.map((s) => trimWords(s, Math.max(6, MAX_BULLET_WORDS - 2)));

  trimmed.whyWeRecommend = shrink(summary.whyWeRecommend) as [string, string, string];
  trimmed.idealFor = shrink(summary.idealFor) as [string, string, string];
  trimmed.strengths = shrink(summary.strengths) as [string, string, string];
  trimmed.attention = trimWords(summary.attention, 14);
  trimmed.recommendedPace = trimWords(summary.recommendedPace, 10);

  return trimmed;
}

export function buildRecommendationSummary(
  answers: FormAnswers,
  shoe: Shoe,
  slot: RecommendationSlot,
): RecommendationSummary {
  const profile = analyzeRunnerProfile(answers);

  const summary: RecommendationSummary = {
    displayBadge: SLOT_BADGE[slot],
    whyWeRecommend: whyTriplet(shoe, slot, profile),
    idealFor: idealForTriplet(shoe),
    recommendedPace: paceLabel(shoe),
    attention: pickAttention(shoe, profile),
    strengths: strengthsTriplet(shoe),
  };

  return enforceWordBudget(summary);
}

export function buildRecommendationSetSummaries(
  answers: FormAnswers,
  items: { shoe: Shoe; slot: RecommendationSlot }[],
): RecommendationSummary[] {
  return items.map(({ shoe, slot }) =>
    buildRecommendationSummary(answers, shoe, slot),
  );
}

/** Compatibilidade com código que ainda espera RecommendationExperience */
export function buildRecommendationExperience(
  answers: FormAnswers,
  shoe: Shoe,
  slot: RecommendationSlot,
): RecommendationExperience {
  return { summary: buildRecommendationSummary(answers, shoe, slot) };
}

export function buildRecommendationSetExperiences(
  answers: FormAnswers,
  items: { shoe: Shoe; slot: RecommendationSlot }[],
): RecommendationExperience[] {
  return buildRecommendationSetSummaries(answers, items).map((summary) => ({
    summary,
  }));
}
