import { isRaceCategory } from "./catalog-categories";
import {
  ADAPTATION_LABELS,
  AGGRESSIVENESS_LABELS,
  FOAM_LABELS,
  TRAINING_USE_LABELS,
} from "./catalog-technical";
import { getTechnicalWarnings } from "./biomechanics";
import {
  buildPaceRecommendationText,
  formatPaceSec,
  scorePaceCompatibility,
} from "./pace-intelligence";
import { BRAND_LABELS } from "./brands";
import { PRICE_LABELS, isPriceBandSlug } from "./prices";
import {
  analyzeRunnerProfile,
  categoryLabel,
  type ScoredShoe,
} from "./recommendation-engine";
import { getShoeIntelligence } from "./shoe-intelligence";
import type { FormAnswers, Shoe } from "./shoes";
import { bodyWeightCategory, isWeightBandSlug, weightInsightClause } from "./weight";

export type RecommendationSlot =
  | "acessivel"
  | "equilibrado"
  | "evolucao"
  | "premium";

const RIDE_FEEL_DESCRIPTIONS: Record<string, string> = {
  macio: "passada macia e absorvente — você sente o impacto sendo bem distribuído",
  equilibrado: "equilíbrio entre conforto e resposta — nem muito mole, nem muito firme",
  firme: "base firme e direta — resposta rápida sem perder controle",
  agressivo: "sensação ágil e incisiva — pede ritmo e responde com rapidez",
};

function hasBrandPreference(answers: FormAnswers): boolean {
  return (
    !!answers.brandPreference &&
    answers.brandPreference !== "sem-preferencia"
  );
}

function experienceClause(answers: FormAnswers): string {
  if (answers.experience === "nunca") return "você está dando os primeiros passos na corrida";
  if (answers.experience === "comecando") return "você está construindo consistência nos treinos";
  if (answers.experience === "algum-tempo") return "você já tem base e quer evoluir com segurança";
  if (answers.experience === "frequente") return "você corre com regularidade e busca performance";
  return "seu perfil pede um tênis que acompanhe sua evolução";
}

function feelingClause(answers: FormAnswers): string {
  if (answers.feeling === "macio") return "prioriza conforto e uma pisada bem macia";
  if (answers.feeling === "leve") return "quer sentir leveza e resposta nos treinos";
  return "prefere equilíbrio entre conforto e resposta";
}

function usageClause(answers: FormAnswers): string {
  if (answers.usage === "caminhada") return "vai usar bastante para caminhada e rotina leve";
  if (answers.usage === "comecar") return "está entrando na corrida agora";
  if (answers.usage === "academia") return "mistura academia e corrida na semana";
  if (answers.usage === "frequentes") return "pretende correr com frequência";
  if (answers.usage === "provas") return "tem foco em ritmo, provas e evolução de performance";
  return "busca um par versátil para a rotina";
}

function frequencyClause(answers: FormAnswers): string {
  if (answers.frequency === "1-2") return "treina cerca de 1–2 vezes por semana";
  if (answers.frequency === "3-4") return "treina de 3 a 4 vezes por semana";
  if (answers.frequency === "5plus") return "treina com alto volume semanal";
  return "está montando sua rotina de treinos";
}

function priceClause(answers: FormAnswers): string {
  if (isPriceBandSlug(answers.price)) {
    return PRICE_LABELS[answers.price];
  }
  return "quer equilibrar qualidade e investimento";
}

function discomfortClause(answers: FormAnswers): string | null {
  if (answers.discomfort === "pe") return "precisa de mais proteção e amortecimento no pé";
  if (answers.discomfort === "joelho") return "precisa de mais absorção para proteger o joelho";
  if (answers.discomfort === "duro") return "não quer sentir o tênis duro ou seco na pisada";
  if (answers.discomfort === "instabilidade") return "precisa de passada mais estável e segura";
  return null;
}

function rideFeelNote(shoe: Shoe): string {
  const tech = shoe.technical;
  if (tech.rideDescription) return tech.rideDescription;
  const desc = RIDE_FEEL_DESCRIPTIONS[shoe.rideFeel];
  if (!desc) return "";
  return `Na corrida, você provavelmente vai sentir ${desc}`;
}

function flagshipPremiumNote(shoe: Shoe, slot: RecommendationSlot): string | null {
  const tech = shoe.technical;
  if (!tech.isFlagship || slot !== "premium") return null;

  const foamNote = `espuma ${FOAM_LABELS[tech.foamMidsole]} com sensação premium`;
  const energyNote =
    tech.energyReturn >= 4
      ? `eficiência energética ${tech.energyReturn >= 5 ? "máxima" : "acima da média"}`
      : null;

  const parts = [
    "Flagship da linha — topo de tecnologia e materiais",
    foamNote,
    energyNote,
  ].filter(Boolean);

  return parts.join(" — ");
}

function adaptationNote(
  shoe: Shoe,
  profile: ReturnType<typeof analyzeRunnerProfile>,
): string | null {
  const level = shoe.technical.adaptationLevel;
  if (level === "nenhuma") return null;

  if (level === "elite" && !profile.isRaceFocused) {
    return `${ADAPTATION_LABELS.elite} — indicado para quem já domina ritmo forte e provas`;
  }
  if (level === "alta" && profile.isBeginner) {
    return `${ADAPTATION_LABELS.alta} — recomendamos construir base antes de usar como tênis principal`;
  }
  if (level === "moderada" && profile.isBeginner && shoe.category === "super_trainer") {
    return ADAPTATION_LABELS.moderada;
  }
  return null;
}

function technicalExpertBlock(
  shoe: Shoe,
  profile: ReturnType<typeof analyzeRunnerProfile>,
  slot: RecommendationSlot,
): string[] {
  const tech = shoe.technical;
  const parts: string[] = [];

  if (tech.modelDifferentiator) {
    parts.push(tech.modelDifferentiator);
  }

  const flagshipNote = flagshipPremiumNote(shoe, slot);
  if (flagshipNote) {
    parts.push(flagshipNote);
  }

  parts.push(
    `Entressola ${FOAM_LABELS[tech.foamMidsole]} — agressividade ${AGGRESSIVENESS_LABELS[tech.aggressiveness].toLowerCase()}, ~${tech.weightGrams}g`,
  );

  if (tech.gaitDescription) {
    parts.push(tech.gaitDescription);
  }

  if (tech.volumeNotes && (slot === "equilibrado" || slot === "evolucao")) {
    parts.push(tech.volumeNotes);
  }

  const uses = tech.idealUses
    .slice(0, 2)
    .map((u) => TRAINING_USE_LABELS[u].toLowerCase())
    .join(" e ");
  if (uses) {
    parts.push(`Melhor uso: ${uses}`);
  }

  const warnings = getTechnicalWarnings(shoe, profile);
  if (warnings.length > 0 && (slot === "equilibrado" || slot === "premium")) {
    parts.push(`Atenção: ${warnings[0]}`);
  }

  if (tech.realStrengths.length > 0) {
    parts.push(`Pontos fortes: ${tech.realStrengths.slice(0, 2).join(", ")}`);
  }

  const adaptNote = adaptationNote(shoe, profile);
  if (adaptNote) {
    parts.push(adaptNote);
  }

  const paceTexts = buildPaceRecommendationText(shoe, profile, slot);
  parts.push(...paceTexts);

  return parts;
}

function categoryExpertNote(shoe: Shoe, profile: ReturnType<typeof analyzeRunnerProfile>): string {
  const cat = shoe.category;

  if (cat === "daily_trainer") {
    return "como daily trainer, ele cobre a maior parte dos treinos do dia a dia com versatilidade";
  }
  if (cat === "super_trainer") {
    return profile.isBeginner
      ? "é um treino premium — indicado quando você já tiver mais base na corrida"
      : "como super trainer, entrega resposta acima da média sem ser um tênis exclusivo de prova";
  }
  if (isRaceCategory(cat)) {
    return profile.isRaceFocused
      ? "como super tênis de prova, faz sentido para ritmo forte e objetivos de performance"
      : "é um tênis de prova — mais indicado para dias de ritmo do que para toda a semana";
  }
  if (cat === "stability") {
    return "a estrutura de estabilidade ajuda a manter a passada controlada, especialmente em treinos longos";
  }
  if (cat === "max_cushion" || cat === "premium_comfort") {
    return "o amortecimento generoso protege bem o corpo em treinos frequentes";
  }
  if (cat === "speed_trainer" || cat === "lightweight") {
    return "a construção mais leve favorece treinos de ritmo e sensação de velocidade";
  }
  if (cat === "recovery") {
    return "funciona muito bem em dias regenerativos, quando o corpo precisa de menos impacto";
  }
  if (cat === "beginner") {
    return "foi pensado para quem está começando — seguro, acessível e fácil de usar";
  }
  return "";
}

function strengthHighlight(shoe: Shoe): string | null {
  const strength = shoe.strengths?.[0];
  if (!strength) return null;
  if (strength.startsWith("Categoria:")) {
    return `Destaque: ${categoryLabel(shoe.category).toLowerCase()} com ${shoe.bestUse?.toLowerCase() ?? "boa versatilidade"}`;
  }
  return `Destaque: ${strength.toLowerCase()}`;
}

function limitationNote(shoe: Shoe, profile: ReturnType<typeof analyzeRunnerProfile>): string | null {
  const limitation = shoe.notIdealFor?.[0];
  if (!limitation) return null;

  if (profile.isBeginner && isRaceCategory(shoe.category)) {
    return "Limitação: não é a melhor escolha como primeiro par — exige mais experiência na corrida";
  }
  if (profile.isHeavy && shoe.stabilityLevelNum <= 2) {
    return "Limitação: a base é mais leve e pode não oferecer suporte suficiente para sua faixa de peso";
  }
  if (profile.wantsComfort && (shoe.rideFeel === "agressivo" || shoe.rideFeel === "firme")) {
    return "Limitação: a passada é mais firme do que o conforto máximo que você busca";
  }
  if (!profile.isRaceFocused && isRaceCategory(shoe.category)) {
    return "Limitação: é um tênis de prova — o desgaste acelera se usado em todos os treinos";
  }

  return `Limitação: ${limitation.charAt(0).toLowerCase()}${limitation.slice(1)}`;
}

function generationNote(shoe: Shoe): string | null {
  const intelligence = getShoeIntelligence(shoe);

  if (intelligence.generation === "previous" && intelligence.isAccessiblePremium) {
    return "Versão anterior com excelente custo-benefício — mesma linha, preço mais inteligente";
  }
  if (intelligence.generation === "flagship") {
    const tech = shoe.technical;
    if (tech.isFlagship && tech.energyReturn >= 5) {
      return "Flagship atual — espuma premium com retorno energético máximo e estabilidade em alta velocidade";
    }
    return "Flagship atual da linha — topo de tecnologia da categoria";
  }
  if (intelligence.generation === "current") {
    return "Geração atual — tecnologia recente e mais completa";
  }
  return null;
}

function slotIntent(
  slot: RecommendationSlot,
  shoe: Shoe,
  answers: FormAnswers,
  scored?: ScoredShoe,
): string {
  const model = shoe.model;
  const brand = hasBrandPreference(answers) ? ` ${shoe.brand}` : "";
  const intelligence = getShoeIntelligence(shoe);

  if (intelligence.isAccessiblePremium && intelligence.generation === "previous") {
    if (slot === "acessivel" || slot === "evolucao") {
      return `escolhemos o ${model}${brand} por combinar tecnologia de ponta com preço mais inteligente`;
    }
  }

  switch (slot) {
    case "acessivel":
      return `o ${model}${brand} é nossa porta de entrada — menor investimento sem abrir mão do essencial para o seu perfil`;
    case "equilibrado":
      return `o ${model}${brand} é a indicação principal — melhor equilíbrio entre compatibilidade, conforto e valor para você`;
    case "evolucao":
      return `o ${model}${brand} é o passo seguinte — mais completo para quando quiser evoluir ritmo ou volume`;
    case "premium":
      if (isRaceCategory(shoe.category)) {
        if (shoe.technical.isFlagship) {
          return `o ${model}${brand} é o flagship de prova — máxima eficiência energética para quem já tem base sólida`;
        }
        return `o ${model}${brand} é a opção de performance máxima — para quando performance pesa mais que custo`;
      }
      if (shoe.technical.isFlagship) {
        return `o ${model}${brand} é o flagship da seleção — sensação premium e tecnologia de ponta para o seu perfil`;
      }
      return `o ${model}${brand} é o premium da seleção — mais tecnologia e refinamento para o seu perfil`;
    default:
      return `o ${model}${brand} combina bem com sua rotina`;
  }
}

function buildProfileContext(answers: FormAnswers): string {
  const parts = [
    experienceClause(answers),
    feelingClause(answers),
    usageClause(answers),
    frequencyClause(answers),
  ];

  const disc = discomfortClause(answers);
  if (disc) parts.push(disc);

  const unique = [...new Set(parts.filter(Boolean))].slice(0, 3);
  if (unique.length === 1) return unique[0];
  return `${unique.slice(0, -1).join(", ")} e ${unique[unique.length - 1]}`;
}

export function buildSlotReason(
  answers: FormAnswers,
  shoe: Shoe,
  slot: RecommendationSlot,
  scored?: ScoredShoe,
): string {
  const profile = analyzeRunnerProfile(answers);
  const profileContext = buildProfileContext(answers);
  const intent = slotIntent(slot, shoe, answers, scored);
  const weightInsight = weightInsightClause(answers.weight);

  const expertParts = technicalExpertBlock(shoe, profile, slot);

  const expertBlock =
    expertParts.length > 0
      ? ` ${expertParts.slice(0, 5).join(". ")}.`
      : "";

  if (hasBrandPreference(answers)) {
    const label = BRAND_LABELS[answers.brandPreference] ?? shoe.brand;
    if (weightInsight) {
      return `Como ${profileContext}, ${weightInsight}, e você escolheu ${label}, ${intent}.${expertBlock}`;
    }
    return `Como ${profileContext} e você escolheu ${label}, ${intent}.${expertBlock}`;
  }

  if (weightInsight) {
    return `Como ${profileContext} e ${weightInsight}, ${intent}.${expertBlock}`;
  }

  if (isPriceBandSlug(answers.price) && slot === "acessivel") {
    return `Como ${profileContext} e ${priceClause(answers)}, ${intent}.${expertBlock}`;
  }

  return `Como ${profileContext}, ${intent}.${expertBlock}`;
}

export function buildExpertSummary(
  answers: FormAnswers,
  shoe: Shoe,
): string[] {
  const profile = analyzeRunnerProfile(answers);
  const tech = shoe.technical;
  const bullets: string[] = [];

  bullets.push(tech.rideDescription);
  bullets.push(tech.gaitDescription);
  bullets.push(tech.modelDifferentiator);

  const paceResult = scorePaceCompatibility(shoe, profile);
  const techSpec = shoe.technical;
  bullets.push(
    `Faixa ideal: ${formatPaceSec(techSpec.idealPaceMinSec)} a ${formatPaceSec(techSpec.idealPaceMaxSec)} — eficiente até ${formatPaceSec(techSpec.efficientPaceMaxSec)}.`,
  );

  const paceTexts = buildPaceRecommendationText(shoe, profile, "premium");
  bullets.push(...paceTexts);

  if (paceResult.warnings.length > 0) {
    bullets.push(`Atenção: ${paceResult.warnings[0]}`);
  } else if (tech.realStrengths.length > 0) {
    bullets.push(`Pontos fortes: ${tech.realStrengths.join(", ")}`);
  }

  const warnings = getTechnicalWarnings(shoe, profile);
  if (warnings.length > 0 && !paceResult.warnings.length) {
    bullets.push(`Limitação: ${warnings[0]}`);
  } else if (tech.realLimitations.length > 0) {
    bullets.push(`Limitação: ${tech.realLimitations[0]}`);
  }

  return bullets.filter(Boolean).slice(0, 4);
}
