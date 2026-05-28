import { ADIDAS_CATALOG } from "./adidas";
import { ASICS_CATALOG } from "./asics";
import { HOKA_CATALOG } from "./hoka";
import { MIZUNO_CATALOG } from "./mizuno";
import { NEW_BALANCE_CATALOG } from "./new-balance";
import { NIKE_CATALOG } from "./nike";
import { OLYMPIKUS_CATALOG } from "./olympikus";
import { PUMA_CATALOG } from "./puma";
import { SAUCONY_CATALOG } from "./saucony";

/** Catálogo completo — 9 marcas, organizado por arquivo de marca */
export const CATALOG_DEFS = [
  ...ADIDAS_CATALOG,
  ...NIKE_CATALOG,
  ...ASICS_CATALOG,
  ...MIZUNO_CATALOG,
  ...PUMA_CATALOG,
  ...OLYMPIKUS_CATALOG,
  ...NEW_BALANCE_CATALOG,
  ...SAUCONY_CATALOG,
  ...HOKA_CATALOG,
];

export {
  ADIDAS_CATALOG,
  ASICS_CATALOG,
  HOKA_CATALOG,
  MIZUNO_CATALOG,
  NEW_BALANCE_CATALOG,
  NIKE_CATALOG,
  OLYMPIKUS_CATALOG,
  PUMA_CATALOG,
  SAUCONY_CATALOG,
};
