import { expandCatalog } from "./catalog-builder";
import { CATALOG_DEFS } from "./catalog-defs";

/** Catálogo completo expandido — 100+ modelos nas 9 marcas */
export const SHOE_DATA = expandCatalog(CATALOG_DEFS);
