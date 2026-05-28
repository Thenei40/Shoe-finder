import { expandCatalog } from "./catalog-builder";
import { CATALOG_DEFS } from "./catalog-defs";

/** Catálogo completo expandido — 60+ modelos nas 6 marcas */
export const SHOE_DATA = expandCatalog(CATALOG_DEFS);
