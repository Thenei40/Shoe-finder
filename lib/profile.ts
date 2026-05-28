import { PRICE_LABELS, isPriceBandSlug } from "./prices";
import type { FormAnswers } from "./shoes";
import { WEIGHT_PROFILE_LABELS, isWeightBandSlug } from "./weight";

const USAGE_LABELS: Record<string, string> = {
  caminhada: "caminhada no dia a dia",
  comecar: "começar a correr",
  academia: "academia e corrida",
  frequentes: "corridas frequentes",
  provas: "provas e treinos mais fortes",
};

const FREQUENCY_LABELS: Record<string, string> = {
  "1-2": "1–2 vezes por semana",
  "3-4": "3–4 vezes por semana",
  "5plus": "5 vezes ou mais na semana",
};

const FEELING_LABELS: Record<string, string> = {
  macio: "busca conforto e pisada bem macia",
  equilibrado: "prefere um equilíbrio entre conforto e leveza",
  leve: "quer sentir mais leveza e ritmo no treino",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  nunca: "Corredor iniciante",
  comecando: "Corredor iniciante",
  "algum-tempo": "Já corre há algum tempo",
  frequente: "Corre com frequência",
};

const BRAND_LABELS: Record<string, string> = {
  "sem-preferencia": "Sem preferência — comparamos Adidas, Nike, Asics, Mizuno, Puma e Olympikus",
  adidas: "Consultoria focada em Adidas",
  asics: "Consultoria focada em Asics",
  mizuno: "Consultoria focada em Mizuno",
  nike: "Consultoria focada em Nike",
  puma: "Consultoria focada em Puma",
  olympikus: "Consultoria focada em Olympikus",
};

const DISCOMFORT_LABELS: Record<string, string> = {
  pe: "precisa de mais conforto no pé",
  joelho: "precisa de mais proteção no joelho",
  duro: "não gosta de tênis que parecem duros",
  instabilidade: "precisa de passada mais estável",
  nada: "sem incômodo específico no pé",
};

export type ProfileSummary = {
  title: string;
  bullets: string[];
};

export function buildProfileSummary(answers: FormAnswers): ProfileSummary {
  const bullets: string[] = [];

  bullets.push(EXPERIENCE_LABELS[answers.experience] ?? "Perfil em formação");

  if (answers.feeling) {
    bullets.push(
      FEELING_LABELS[answers.feeling]
        ? capitalizeFirst(FEELING_LABELS[answers.feeling])
        : "",
    );
  }

  if (answers.frequency) {
    bullets.push(
      `Pretende usar o tênis ${FREQUENCY_LABELS[answers.frequency] ?? answers.frequency}`,
    );
  }

  if (answers.price && isPriceBandSlug(answers.price)) {
    bullets.push(capitalizeFirst(PRICE_LABELS[answers.price]));
  }

  if (answers.weight && isWeightBandSlug(answers.weight)) {
    bullets.push(capitalizeFirst(WEIGHT_PROFILE_LABELS[answers.weight]));
  }

  if (answers.usage) {
    const usage = USAGE_LABELS[answers.usage];
    bullets.push(
      usage
        ? `Foco principal: ${usage}`
        : "",
    );
  }

  if (answers.brandPreference && BRAND_LABELS[answers.brandPreference]) {
    bullets.push(BRAND_LABELS[answers.brandPreference]);
  }

  if (
    answers.discomfort &&
    answers.discomfort !== "nada" &&
    DISCOMFORT_LABELS[answers.discomfort]
  ) {
    bullets.push(capitalizeFirst(DISCOMFORT_LABELS[answers.discomfort]));
  } else if (answers.experience === "nunca" || answers.experience === "comecando") {
    bullets.push("Quer treinos leves e consistentes para criar hábito");
  }

  const filtered = bullets.filter(Boolean);

  return {
    title: "Seu perfil identificado",
    bullets: filtered.slice(0, 5),
  };
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
