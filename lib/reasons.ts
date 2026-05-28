import { BRAND_LABELS } from "./brands";
import { PRICE_LABELS, isPriceBandSlug } from "./prices";
import type { FormAnswers, Shoe } from "./shoes";
import { weightInsightClause } from "./weight";

export type RecommendationSlot =
  | "acessivel"
  | "equilibrado"
  | "evolucao"
  | "premium";

function hasBrandPreference(answers: FormAnswers): boolean {
  return (
    !!answers.brandPreference &&
    answers.brandPreference !== "sem-preferencia"
  );
}

function brandContext(answers: FormAnswers, shoe: Shoe): string {
  if (!hasBrandPreference(answers)) return "";
  return ` ${shoe.brand}`;
}

function experienceClause(answers: FormAnswers): string {
  if (answers.experience === "nunca") return "você está dando os primeiros passos na corrida";
  if (answers.experience === "comecando") return "você está começando a correr com regularidade";
  if (answers.experience === "algum-tempo") return "você já corre há algum tempo e quer evoluir";
  if (answers.experience === "frequente") return "você já corre com frequência e busca performance";
  return "seu perfil pede um tênis que acompanhe sua evolução";
}

function feelingClause(answers: FormAnswers): string {
  if (answers.feeling === "macio") return "prioriza conforto e uma pisada bem macia";
  if (answers.feeling === "leve") return "quer sentir mais leveza e ritmo nos treinos";
  return "prefere equilíbrio entre conforto e resposta";
}

function usageClause(answers: FormAnswers): string {
  if (answers.usage === "caminhada") return "vai usar bastante para caminhada";
  if (answers.usage === "comecar") return "está entrando na corrida agora";
  if (answers.usage === "academia") return "mistura academia e corrida na semana";
  if (answers.usage === "frequentes") return "pretende correr com frequência";
  if (answers.usage === "provas") return "tem foco em evoluir ritmo e provas";
  return "busca um par versátil para a rotina";
}

function frequencyClause(answers: FormAnswers): string {
  if (answers.frequency === "1-2") return "treina cerca de 1–2 vezes por semana";
  if (answers.frequency === "3-4") return "treina de 3 a 4 vezes por semana";
  if (answers.frequency === "5plus") return "treina quase todos os dias";
  return "está montando sua rotina de treinos";
}

function priceClause(answers: FormAnswers): string {
  if (isPriceBandSlug(answers.price)) {
    return PRICE_LABELS[answers.price];
  }
  return "quer equilibrar qualidade e investimento";
}

function discomfortClause(answers: FormAnswers): string | null {
  if (answers.discomfort === "pe") return "precisa de mais proteção no pé";
  if (answers.discomfort === "joelho") return "precisa de mais cuidado no joelho";
  if (answers.discomfort === "duro") return "não quer sentir o tênis duro na pisada";
  if (answers.discomfort === "instabilidade") return "precisa de passada mais estável";
  return null;
}

function slotIntent(
  slot: RecommendationSlot,
  shoe: Shoe,
  answers: FormAnswers,
): string {
  const brand = brandContext(answers, shoe);
  const model = shoe.model;

  switch (slot) {
    case "acessivel":
      return `o ${model} é a porta de entrada${brand} com menor investimento — ideal para começar sem comprometer o básico`;
    case "equilibrado":
      return `o ${model} é nossa indicação principal${brand} — equilibra preço, conforto e performance para o seu perfil`;
    case "evolucao":
      return `o ${model} é o passo seguinte${brand} — mais completo que a opção inicial, ainda com boa relação custo-benefício`;
    case "premium":
      if (shoe.hasPlate || shoe.isAggressive) {
        return `o ${model} é o topo da linha${brand} — o investimento maior traz mais performance e resposta`;
      }
      return `o ${model} é a opção premium${brand} — mais conforto e tecnologia para quem quer o melhor da seleção`;
    default:
      return `o ${model} combina bem com seu perfil na rotina de treinos`;
  }
}

export function buildSlotReason(
  answers: FormAnswers,
  shoe: Shoe,
  slot: RecommendationSlot,
): string {
  const parts = [
    experienceClause(answers),
    feelingClause(answers),
    usageClause(answers),
    frequencyClause(answers),
    priceClause(answers),
  ];

  const disc = discomfortClause(answers);
  if (disc) parts.push(disc);

  const unique = [...new Set(parts.filter(Boolean))].slice(0, 3);
  const profileText =
    unique.length === 1
      ? unique[0]
      : `${unique.slice(0, -1).join(", ")} e ${unique[unique.length - 1]}`;

  const intent = slotIntent(slot, shoe, answers);
  const weightInsight = weightInsightClause(answers.weight);

  if (hasBrandPreference(answers)) {
    const label = BRAND_LABELS[answers.brandPreference] ?? shoe.brand;
    if (weightInsight) {
      return `Como ${profileText}, ${weightInsight}, e você escolheu ${label}, ${intent}.`;
    }
    return `Como ${profileText} e você escolheu ${label}, ${intent}.`;
  }

  if (weightInsight) {
    return `Como ${profileText} e ${weightInsight}, ${intent}.`;
  }

  return `Como ${profileText}, ${intent}.`;
}
