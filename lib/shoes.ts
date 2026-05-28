import { isAllowedBrand } from "./brands";

import type { CatalogShoeInput } from "./catalog-types";

import { priceBandsForAmount } from "./prices";

import { SHOE_DATA } from "./shoes-data";

import { weightBandsForShoe } from "./weight";

import type { LineCategory } from "./catalog-types";

import { LINE_CATEGORY_LABELS } from "./catalog-types";



export type { LineCategory } from "./catalog-types";

export { LINE_CATEGORY_LABELS } from "./catalog-types";



export type FormAnswers = {

  usage: string;

  frequency: string;

  feeling: string;

  price: string;

  brandPreference: string;

  weight: string;

  experience: string;

  discomfort: string;

};



export type ShoeTier = "economico" | "intermediario" | "premium" | "performance";

/** Tier de preço (legado: category no objeto Shoe) */

export type ShoePriceTier = ShoeTier;



export type CushioningType = "macio" | "equilibrado" | "responsivo";

export type StabilityLevel = "baixa" | "media" | "alta";



export type ShoeProfileScores = {

  comfort: number;

  responsiveness: number;

  stability: number;

  valueScore: number;

  versatility: number;

  trainingTypes: string[];

  runnerLevels: string[];

};



/** Dados do catálogo antes de vincular metadados de exibição */

export type ShoeInput = {

  id: string;

  name: string;

  brand: string;

  price: number;

  tier: ShoeTier;

  lineCategory: LineCategory;

  hasPlate: boolean;

  beginnerFriendly: boolean;

  isAggressive: boolean;

  cushioningType: CushioningType;

  stabilityLevel: StabilityLevel;

  versatilityScore: number;

  purpose: string;

  idealPace: string;

  comfortLevel: string;

  bestUse: string;

  description: string;

  strengths: string[];

  idealFor: string[];

  notIdealFor: string[];

  usage: string[];

  frequency: string[];

  feeling: string[];

  prices: string[];

  weight: string[];

  experience: string[];

  discomfort: string[];

};



export type Shoe = ShoeInput & {

  model: string;

  /** Tier de preço */

  category: ShoePriceTier;

  lineCategoryLabel: string;

};



function attachShoeAssets(input: CatalogShoeInput): Shoe {

  return {

    ...input,

    model: input.modelLabel,

    category: input.tier,

    lineCategoryLabel: LINE_CATEGORY_LABELS[input.lineCategory],

    prices: priceBandsForAmount(input.price),

    weight: weightBandsForShoe(input),

  };

}



export const SHOES: Shoe[] = SHOE_DATA.filter((s) =>

  isAllowedBrand(s.brand),

).map(attachShoeAssets);



export function shoesByBrand(brand: string): Shoe[] {

  return SHOES.filter((s) => s.brand === brand);

}



export function formatPrice(value: number): string {

  return value.toLocaleString("pt-BR", {

    style: "currency",

    currency: "BRL",

    maximumFractionDigits: 0,

  });

}


