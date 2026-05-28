/** Faixas de preço do quiz — alinhadas ao mercado BR de tênis de corrida */

export type PriceBandSlug =
  | "ate-500"
  | "500-800"
  | "800-1200"
  | "1200-1800"
  | "1800-2500"
  | "acima-2500";

export const PRICE_BAND_OPTIONS: { value: PriceBandSlug; label: string }[] = [
  { value: "ate-500", label: "Até R$ 500" },
  { value: "500-800", label: "R$ 500 – R$ 800" },
  { value: "800-1200", label: "R$ 800 – R$ 1.200" },
  { value: "1200-1800", label: "R$ 1.200 – R$ 1.800" },
  { value: "1800-2500", label: "R$ 1.800 – R$ 2.500" },
  { value: "acima-2500", label: "Acima de R$ 2.500" },
];

const BAND_RANGES: Record<
  PriceBandSlug,
  { min: number; max: number; valueScore: number }
> = {
  "ate-500": { min: 0, max: 500, valueScore: 5 },
  "500-800": { min: 501, max: 800, valueScore: 4 },
  "800-1200": { min: 801, max: 1200, valueScore: 3 },
  "1200-1800": { min: 1201, max: 1800, valueScore: 2 },
  "1800-2500": { min: 1801, max: 2500, valueScore: 1 },
  "acima-2500": { min: 2501, max: Infinity, valueScore: 1 },
};

export const PRICE_LABELS: Record<PriceBandSlug, string> = {
  "ate-500": "prioriza entrada acessível — até R$ 500",
  "500-800": "busca daily trainers intermediários — R$ 500 a R$ 800",
  "800-1200": "aceita premium populares — R$ 800 a R$ 1.200",
  "1200-1800": "pode investir em premium avançado — R$ 1.200 a R$ 1.800",
  "1800-2500": "busca supershoes premium — R$ 1.800 a R$ 2.500",
  "acima-2500": "quer o topo de linha — acima de R$ 2.500",
};

export function isPriceBandSlug(value: string): value is PriceBandSlug {
  return value in BAND_RANGES;
}

/** Faixa principal do preço de referência do modelo */
export function primaryPriceBand(amount: number): PriceBandSlug {
  if (amount <= 500) return "ate-500";
  if (amount <= 800) return "500-800";
  if (amount <= 1200) return "800-1200";
  if (amount <= 1800) return "1200-1800";
  if (amount <= 2500) return "1800-2500";
  return "acima-2500";
}

/** Faixas para matching — inclui vizinhas em valores de borda */
export function priceBandsForAmount(amount: number): PriceBandSlug[] {
  const primary = primaryPriceBand(amount);
  const bands: PriceBandSlug[] = [primary];

  const neighbors: Partial<Record<PriceBandSlug, PriceBandSlug>> = {
    "ate-500": "500-800",
    "500-800": "ate-500",
    "800-1200": "500-800",
    "1200-1800": "800-1200",
    "1800-2500": "1200-1800",
    "acima-2500": "1800-2500",
  };

  if (amount >= 480 && amount <= 520) bands.push("500-800");
  if (amount >= 780 && amount <= 820) bands.push("500-800", "800-1200");
  if (amount >= 1180 && amount <= 1220) bands.push("800-1200", "1200-1800");
  if (amount >= 1780 && amount <= 1820) bands.push("1200-1800", "1800-2500");

  const neighbor = neighbors[primary];
  if (neighbor) bands.push(neighbor);

  return [...new Set(bands)];
}

export function isPriceInBand(amount: number, band: string): boolean {
  if (!isPriceBandSlug(band)) return false;
  const { min, max } = BAND_RANGES[band];
  return amount >= min && amount <= max;
}

export function desiredValueScoreForBand(band: string): number {
  if (!isPriceBandSlug(band)) return 3;
  return BAND_RANGES[band].valueScore;
}

export function priceBandLabel(band: string): string | null {
  if (!isPriceBandSlug(band)) return null;
  return PRICE_BAND_OPTIONS.find((o) => o.value === band)?.label ?? null;
}

/** Categoria de mercado para badges e textos */
export function marketTierLabel(amount: number): string {
  const band = primaryPriceBand(amount);
  switch (band) {
    case "ate-500":
      return "Entrada";
    case "500-800":
      return "Intermediário";
    case "800-1200":
      return "Premium popular";
    case "1200-1800":
      return "Premium avançado";
    case "1800-2500":
      return "Super premium";
    default:
      return "Elite";
  }
}
