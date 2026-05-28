export const ALLOWED_BRAND_SLUGS = [
  "adidas",
  "nike",
  "asics",
  "mizuno",
  "puma",
  "olympikus",
  "sem-preferencia",
] as const;

export type BrandSlug = (typeof ALLOWED_BRAND_SLUGS)[number];

export const BRAND_LABELS: Record<string, string> = {
  adidas: "Adidas",
  nike: "Nike",
  asics: "Asics",
  mizuno: "Mizuno",
  puma: "Puma",
  olympikus: "Olympikus",
  "sem-preferencia": "Sem preferência",
};

export const BRAND_TO_SLUG: Record<string, string> = {
  Adidas: "adidas",
  Nike: "nike",
  Asics: "asics",
  Mizuno: "mizuno",
  Puma: "puma",
  Olympikus: "olympikus",
};

export function shoeBrandSlug(brand: string): string {
  return BRAND_TO_SLUG[brand] ?? brand.toLowerCase();
}

export function isAllowedBrand(brand: string): boolean {
  const slug = shoeBrandSlug(brand);
  return slug !== "sem-preferencia" && ALLOWED_BRAND_SLUGS.includes(slug as BrandSlug);
}
