import type {
  CatalogCushioning,
  CatalogShoeDef,
  CatalogShoeInput,
  CatalogShoeTier,
  CatalogStability,
  LineCategory,
} from "./catalog-types";

const DEFAULT_USAGE = ["comecar", "frequentes", "academia", "caminhada"];
const DEFAULT_FEELING = ["macio", "equilibrado"];
const DEFAULT_EXPERIENCE = ["nunca", "comecando", "algum-tempo"];
const DEFAULT_DISCOMFORT = ["nada", "duro", "pe"];

function categoryDefaults(cat: LineCategory): Partial<CatalogShoeDef> {
  switch (cat) {
    case "entrada":
      return {
        tier: "economico",
        beginnerFriendly: true,
        isAggressive: false,
        cushioningType: "macio",
        stabilityLevel: "media",
        versatilityScore: 4,
        hasPlate: false,
      };
    case "treino-diario":
      return {
        tier: "intermediario",
        beginnerFriendly: true,
        isAggressive: false,
        cushioningType: "equilibrado",
        stabilityLevel: "media",
        versatilityScore: 5,
        hasPlate: false,
      };
    case "daily-premium":
      return {
        tier: "intermediario",
        beginnerFriendly: true,
        isAggressive: false,
        cushioningType: "equilibrado",
        stabilityLevel: "media",
        versatilityScore: 4,
        hasPlate: false,
      };
    case "estabilidade":
      return {
        tier: "intermediario",
        beginnerFriendly: true,
        isAggressive: false,
        cushioningType: "macio",
        stabilityLevel: "alta",
        versatilityScore: 4,
        hasPlate: false,
      };
    case "max-cushion":
      return {
        tier: "premium",
        beginnerFriendly: true,
        isAggressive: false,
        cushioningType: "macio",
        stabilityLevel: "media",
        versatilityScore: 3,
        hasPlate: false,
      };
    case "performance":
      return {
        tier: "intermediario",
        beginnerFriendly: false,
        isAggressive: true,
        cushioningType: "responsivo",
        stabilityLevel: "media",
        versatilityScore: 3,
        hasPlate: false,
      };
    case "prova":
      return {
        tier: "performance",
        beginnerFriendly: false,
        isAggressive: true,
        cushioningType: "responsivo",
        stabilityLevel: "baixa",
        versatilityScore: 2,
        hasPlate: true,
      };
    case "super-shoe":
      return {
        tier: "performance",
        beginnerFriendly: false,
        isAggressive: true,
        cushioningType: "responsivo",
        stabilityLevel: "baixa",
        versatilityScore: 2,
        hasPlate: true,
      };
  }
}

function buildDescription(def: CatalogShoeDef): string {
  return `${def.model} da ${def.brand} é indicado para ${def.bestUse?.toLowerCase() ?? "sua rotina de corrida"}. ${def.purpose ?? "Combina com o perfil que você descreveu no quiz."}`;
}

function buildLists(def: CatalogShoeDef): Pick<
  CatalogShoeInput,
  "usage" | "feeling" | "experience" | "discomfort" | "frequency" | "prices" | "weight"
> {
  const feeling: string[] =
    def.cushioningType === "macio"
      ? ["macio", "equilibrado"]
      : def.cushioningType === "responsivo"
        ? ["leve", "equilibrado"]
        : ["equilibrado", "macio", "leve"];

  const experience = def.beginnerFriendly
    ? ["nunca", "comecando", "algum-tempo", "frequente"]
    : ["algum-tempo", "frequente"];

  const usage =
    def.lineCategory === "entrada" || def.lineCategory === "treino-diario"
      ? ["comecar", "caminhada", "academia", "frequentes"]
      : def.lineCategory === "super-shoe" || def.lineCategory === "prova"
        ? ["provas", "frequentes"]
        : ["frequentes", "academia", "comecar", "provas"];

  const frequency =
    def.lineCategory === "entrada"
      ? ["1-2", "3-4"]
      : ["3-4", "5plus", "1-2"];

  return {
    usage,
    feeling,
    experience,
    discomfort: [...DEFAULT_DISCOMFORT],
    frequency,
    prices: [],
    weight: [],
  };
}

export function expandCatalog(defs: CatalogShoeDef[]): CatalogShoeInput[] {
  return defs.map((raw) => {
    const defaults = categoryDefaults(raw.lineCategory);
    const def: CatalogShoeDef = {
      ...defaults,
      ...raw,
      tier: raw.tier ?? defaults.tier ?? "intermediario",
      hasPlate: raw.hasPlate ?? defaults.hasPlate ?? false,
      beginnerFriendly: raw.beginnerFriendly ?? defaults.beginnerFriendly ?? true,
      isAggressive: raw.isAggressive ?? defaults.isAggressive ?? false,
      cushioningType: (raw.cushioningType ??
        defaults.cushioningType) as CatalogCushioning,
      stabilityLevel: (raw.stabilityLevel ??
        defaults.stabilityLevel) as CatalogStability,
      versatilityScore: raw.versatilityScore ?? defaults.versatilityScore ?? 4,
      purpose:
        raw.purpose ??
        `Referência ${raw.brand} na categoria ${raw.lineCategory.replace("-", " ")}`,
      idealPace:
        raw.idealPace ??
        (raw.isAggressive ? "Moderado a forte" : "Fácil a moderado"),
      comfortLevel:
        raw.comfortLevel ??
        (raw.cushioningType === "macio"
          ? "Macio e confortável"
          : raw.cushioningType === "responsivo"
            ? "Leve e responsivo"
            : "Equilibrado"),
      bestUse:
        raw.bestUse ??
        (raw.lineCategory === "entrada"
          ? "Primeiros passos na corrida"
          : raw.lineCategory === "super-shoe"
            ? "Provas e máxima performance"
            : "Treinos do dia a dia"),
    };

    const lists = buildLists(def);

    return {
      id: def.id,
      name: `${def.brand} ${def.model}`,
      brand: def.brand,
      price: def.price,
      tier: def.tier!,
      lineCategory: def.lineCategory,
      modelLabel: def.model,
      hasPlate: def.hasPlate!,
      beginnerFriendly: def.beginnerFriendly!,
      isAggressive: def.isAggressive!,
      cushioningType: def.cushioningType!,
      stabilityLevel: def.stabilityLevel!,
      versatilityScore: def.versatilityScore!,
      purpose: def.purpose!,
      idealPace: def.idealPace!,
      comfortLevel: def.comfortLevel!,
      bestUse: def.bestUse!,
      description: buildDescription(def),
      strengths: [
        `Categoria: ${def.lineCategory}`,
        `Boa opção na linha ${def.brand}`,
        def.beginnerFriendly ? "Acessível para evoluir" : "Foco em ritmo",
      ],
      idealFor: def.beginnerFriendly
        ? ["Está começando ou treina com regularidade", "Busca segurança na escolha"]
        : ["Já corre com consistência", "Quer evoluir ritmo ou performance"],
      notIdealFor: def.isAggressive
        ? ["Primeiro par sem experiência", "Só caminhada leve"]
        : ["Provas de elite sem necessidade", "Busca placa extrema"],
      ...lists,
    };
  });
}
