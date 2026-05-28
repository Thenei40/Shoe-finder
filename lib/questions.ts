import { PRICE_BAND_OPTIONS } from "./prices";
import { WEIGHT_BAND_OPTIONS } from "./weight";
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
    label: "Qual sua faixa de investimento?",
    helper:
      "Faixas alinhadas ao mercado brasileiro — da entrada ao topo de linha para corridas.",
    options: PRICE_BAND_OPTIONS.map((o) => ({
      value: o.value,
      label: o.label,
    })),
  },
  {
    id: "brandPreference",
    label: "Você possui preferência de marca?",
    helper:
      "Com marca escolhida, mostramos só modelos dessa marca — como uma consultoria especializada. Sem preferência, comparamos todas as marcas.",
    options: [
      { value: "adidas", label: "Adidas" },
      { value: "nike", label: "Nike" },
      { value: "asics", label: "Asics" },
      { value: "mizuno", label: "Mizuno" },
      { value: "puma", label: "Puma" },
      { value: "olympikus", label: "Olympikus" },
      { value: "sem-preferencia", label: "Sem preferência" },
    ],
  },
  {
    id: "weight",
    label: "Qual sua faixa de peso?",
    helper:
      "Seu peso influencia amortecimento, estabilidade e resposta — usamos isso para indicar o nível certo de proteção.",
    options: WEIGHT_BAND_OPTIONS.map((o) => ({
      value: o.value,
      label: o.label,
    })),
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
  brandPreference: "",
  weight: "",
  experience: "",
  discomfort: "",
};
