/** Faixas de preço do quiz — alinhadas ao mercado BR de tênis de corrida */

export type PriceBandSlug =
  | "ate-400"
  | "400-700"
  | "700-1000"
  | "1000-1400"
  | "1400-1800"
  | "1800-2500"
  | "acima-2500";

export const PRICE_BAND_ORDER: PriceBandSlug[] = [
  "ate-400",
  "400-700",
  "700-1000",
  "1000-1400",
  "1400-1800",
  "1800-2500",
  "acima-2500",
];

export const PRICE_BAND_OPTIONS: { value: PriceBandSlug; label: string }[] = [
  { value: "ate-400", label: "Até R$ 400" },
  { value: "400-700", label: "R$ 400 – R$ 700" },
  { value: "700-1000", label: "R$ 700 – R$ 1.000" },
  { value: "1000-1400", label: "R$ 1.000 – R$ 1.400" },
  { value: "1400-1800", label: "R$ 1.400 – R$ 1.800" },
  { value: "1800-2500", label: "R$ 1.800 – R$ 2.500" },
  { value: "acima-2500", label: "Acima de R$ 2.500" },
];

const BAND_RANGES: Record<
  PriceBandSlug,
  { min: number; max: number; valueScore: number }
> = {
  "ate-400": { min: 0, max: 400, valueScore: 5 },
  "400-700": { min: 401, max: 700, valueScore: 4 },
  "700-1000": { min: 701, max: 1000, valueScore: 4 },
  "1000-1400": { min: 1001, max: 1400, valueScore: 3 },
  "1400-1800": { min: 1401, max: 1800, valueScore: 2 },
  "1800-2500": { min: 1801, max: 2500, valueScore: 1 },
  "acima-2500": { min: 2501, max: Infinity, valueScore: 1 },
};

export const PRICE_LABELS: Record<PriceBandSlug, string> = {
  "ate-400": "prioriza entrada acessível — até R$ 400",
  "400-700": "busca daily trainers de entrada — R$ 400 a R$ 700",
  "700-1000": "aceita intermediários sólidos — R$ 700 a R$ 1.000",
  "1000-1400": "pode investir em premium populares — R$ 1.000 a R$ 1.400",
  "1400-1800": "busca premium avançado — R$ 1.400 a R$ 1.800",
  "1800-2500": "quer supershoes e topo de linha — R$ 1.800 a R$ 2.500",
  "acima-2500": "quer o que há de mais avançado — acima de R$ 2.500",
};

export function isPriceBandSlug(value: string): value is PriceBandSlug {
  return value in BAND_RANGES;
}

export function priceBandIndex(band: PriceBandSlug): number {
  return PRICE_BAND_ORDER.indexOf(band);
}

export function bandDistance(from: PriceBandSlug, to: PriceBandSlug): number {
  return Math.abs(priceBandIndex(from) - priceBandIndex(to));
}

export function isBandAtOrAbove(
  band: PriceBandSlug,
  minimum: PriceBandSlug,
): boolean {
  return priceBandIndex(band) >= priceBandIndex(minimum);
}

/** Faixa principal do preço de referência do modelo */
export function primaryPriceBand(amount: number): PriceBandSlug {
  if (amount <= 400) return "ate-400";
  if (amount <= 700) return "400-700";
  if (amount <= 1000) return "700-1000";
  if (amount <= 1400) return "1000-1400";
  if (amount <= 1800) return "1400-1800";
  if (amount <= 2500) return "1800-2500";
  return "acima-2500";
}

/** Faixas para matching — inclui vizinhas em valores de borda */
export function priceBandsForAmount(amount: number): PriceBandSlug[] {
  const primary = primaryPriceBand(amount);
  const bands: PriceBandSlug[] = [primary];

  const neighbors: Partial<Record<PriceBandSlug, PriceBandSlug>> = {
    "ate-400": "400-700",
    "400-700": "ate-400",
    "700-1000": "400-700",
    "1000-1400": "700-1000",
    "1400-1800": "1000-1400",
    "1800-2500": "1400-1800",
    "acima-2500": "1800-2500",
  };

  if (amount >= 380 && amount <= 420) bands.push("400-700");
  if (amount >= 680 && amount <= 720) bands.push("400-700", "700-1000");
  if (amount >= 980 && amount <= 1020) bands.push("700-1000", "1000-1400");
  if (amount >= 1380 && amount <= 1420) bands.push("1000-1400", "1400-1800");
  if (amount >= 1780 && amount <= 1820) bands.push("1400-1800", "1800-2500");
  if (amount >= 2480 && amount <= 2520) bands.push("1800-2500", "acima-2500");

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

export function priceBandRange(band: PriceBandSlug): { min: number; max: number } {
  const { min, max } = BAND_RANGES[band];
  return { min, max };
}

/** Categoria de mercado para badges e textos */
export function marketTierLabel(amount: number): string {
  const band = primaryPriceBand(amount);
  switch (band) {
    case "ate-400":
      return "Entrada";
    case "400-700":
      return "Intermediário";
    case "700-1000":
      return "Daily sólido";
    case "1000-1400":
      return "Premium popular";
    case "1400-1800":
      return "Premium avançado";
    case "1800-2500":
      return "Super premium";
    default:
      return "Elite";
  }
}
