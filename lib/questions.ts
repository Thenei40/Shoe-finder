import type { FormAnswers } from "./shoes";

export type Question = {
  id: keyof FormAnswers;
  label: string;
  helper?: string;
  options: { value: string; label: string }[];
};

export const QUESTIONS: Question[] = [
  {
    id: "usage",
    label: "Qual será o principal uso do tênis?",
    options: [
      { value: "caminhada", label: "Caminhada" },
      { value: "comecar", label: "Começar a correr" },
      { value: "academia", label: "Academia + corrida" },
      { value: "frequentes", label: "Corridas frequentes" },
      { value: "provas", label: "Provas e performance" },
    ],
  },
  {
    id: "frequency",
    label: "Quantas vezes por semana você pretende usar?",
    options: [
      { value: "1-2", label: "1–2x por semana" },
      { value: "3-4", label: "3–4x por semana" },
      { value: "5plus", label: "5x ou mais" },
    ],
  },
  {
    id: "feeling",
    label: "Como você prefere a sensação do tênis?",
    options: [
      { value: "macio", label: "Muito macio e confortável" },
      { value: "equilibrado", label: "Equilibrado" },
      { value: "leve", label: "Mais leve e rápido" },
    ],
  },
  {
    id: "price",
    label: "Qual sua faixa de preço?",
    options: [
      { value: "ate-400", label: "Até R$ 400" },
      { value: "400-700", label: "R$ 400 – R$ 700" },
      { value: "700-1000", label: "R$ 700 – R$ 1.000" },
      { value: "1000-2000", label: "R$ 1.000 – R$ 2.000" },
      { value: "acima-3000", label: "Acima de R$ 3.000" },
    ],
  },
  {
    id: "weight",
    label: "Qual seu peso?",
    helper: "Isso nos ajuda a indicar modelos com a proteção certa para você.",
    options: [
      { value: "ate-70", label: "Até 70 kg" },
      { value: "70-85", label: "70 – 85 kg" },
      { value: "acima-85", label: "Acima de 85 kg" },
    ],
  },
  {
    id: "experience",
    label: "Você já corre regularmente?",
    options: [
      { value: "nunca", label: "Nunca corri" },
      { value: "comecando", label: "Estou começando" },
      { value: "algum-tempo", label: "Já corro há algum tempo" },
      { value: "frequente", label: "Corro frequentemente" },
    ],
  },
  {
    id: "discomfort",
    label: "O que mais te incomoda em tênis?",
    options: [
      { value: "pe", label: "Dor no pé" },
      { value: "joelho", label: "Dor no joelho" },
      { value: "duro", label: "Tênis duro" },
      { value: "instabilidade", label: "Instabilidade" },
      { value: "nada", label: "Nada específico" },
    ],
  },
];

export const emptyAnswers: FormAnswers = {
  usage: "",
  frequency: "",
  feeling: "",
  price: "",
  weight: "",
  experience: "",
  discomfort: "",
};
