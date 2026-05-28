import type { TechnicalCategory } from "./catalog-categories";
import type { CatalogShoeDef } from "./catalog-types";
import {
  AGGRESSIVENESS_LABELS,
  BRAND_DEFAULT_FOAM,
  CATEGORY_TECH_DEFAULTS,
  FOAM_LABELS,
  TRAINING_USE_LABELS,
  type AggressivenessLevel,
  type AdaptationLevel,
  type FoamTechnology,
  type ShoeTechnicalSpec,
  type TechnicalSpecOverride,
  type TrainingUse,
} from "./catalog-technical";
import { PREMIUM_TECH_OVERRIDES } from "./shoe-tech-premium";
import { resolvePaceFields } from "./shoe-pace-specs";

type MergedDef = CatalogShoeDef & {
  tier: string;
  hasPlate: boolean;
  beginnerFriendly: boolean;
  isAggressive: boolean;
  cushioningLevel: number;
  stabilityLevelNum: number;
  experienceLevel: string[];
  bestUse: string;
  isFlagship?: boolean;
  technical?: CatalogShoeDef["technical"];
};

/**
 * Specs técnicos explícitos — modelos diferenciados e referências de linha.
 * Modelos não listados recebem defaults inteligentes por categoria + marca.
 */
export const SHOE_TECH_OVERRIDES: Record<string, TechnicalSpecOverride> = {
  // —— Adidas ——
  "adidas-supernova": {
    foamMidsole: "lightstrike",
    weightGrams: 283,
    aggressiveness: "equilibrado",
    softness: 3,
    responsiveness: 3,
    durability: 5,
    dropMm: 10,
    stackHeelMm: 32,
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator:
      "Daily trainer clássico da Adidas — versátil e durável, sem a resposta elástica do Rise ou a agressividade do Boston.",
    realStrengths: ["Durabilidade", "Versatilidade", "Preço acessível"],
    realLimitations: ["Resposta limitada para treinos rápidos", "Não é plataforma premium"],
  },
  "adidas-supernova-rise": {
    foamMidsole: "lightstrike_pro",
    weightGrams: 278,
    aggressiveness: "responsivo",
    softness: 3,
    responsiveness: 4,
    dropMm: 8,
    stackHeelMm: 36,
    rocker: "meta_rocker",
    idealUses: ["rodagem_diaria", "treino_ritmo", "longao"],
    modelDifferentiator:
      "Daily premium com Dreamstrike+ e rocker — mais resposta que o Supernova clássico, mas ainda confortável para volume.",
  },
  "adidas-boston-13": {
    foamMidsole: "lightstrike_pro",
    weightGrams: 260,
    aggressiveness: "agressivo",
    softness: 2,
    responsiveness: 4,
    dropMm: 6,
    stackHeelMm: 38,
    stackForefootMm: 31,
    idealUses: ["treino_ritmo", "intervalado", "meia_maratona", "prova_curta"],
    modelDifferentiator:
      "Speed trainer sem placa de carbono — firme, direto e feito para ritmo. Não é um super trainer elástico como Superblast nem super shoe como Adios Pro.",
    rideDescription:
      "Passada firme e direta com Lightstrike Pro — ideal para turnover rápido em treinos de qualidade.",
    realStrengths: ["Excelente para treino de ritmo", "Resposta sem exigir placa", "Versátil para meia maratona"],
    realLimitations: ["Pouco amortecimento para longões fáceis", "Exige base muscular para volume alto"],
  },
  "adidas-takumi-sen-10": {
    foamMidsole: "lightstrike_pro",
    hasPlate: true,
    plateType: "energy_rod",
    weightGrams: 225,
    aggressiveness: "agressivo",
    stackHeelMm: 33,
    stackForefootMm: 27,
    dropMm: 6,
    idealUses: ["prova_curta", "intervalado", "treino_ritmo"],
    modelDifferentiator:
      "Placa de prova para distâncias curtas e ritmo forte — stack mais baixo e mais ágil que o Adios Pro de maratona.",
    realLimitations: ["Pouco confortável para volume alto", "Exige técnica de corrida"],
  },
  "adidas-adios-pro-3": {
    foamMidsole: "lightstrike_pro",
    foamSecondary: "peba",
    hasPlate: true,
    plateType: "energy_rod",
    weightGrams: 215,
    aggressiveness: "race_day_extremo",
    stackHeelMm: 39,
    idealUses: ["meia_maratona", "maratona"],
    modelDifferentiator:
      "Super shoe de maratona com EnergyRods — foco em economia de corrida em distâncias longas, diferente do Takumi Sen para provas curtas.",
  },
  "adidas-adios-pro-4": {
    foamMidsole: "lightstrike_pro",
    hasPlate: true,
    plateType: "energy_rod",
    weightGrams: 210,
    aggressiveness: "race_day_extremo",
    stackHeelMm: 40,
    idealUses: ["meia_maratona", "maratona"],
    modelDifferentiator:
      "Flagship atual da linha Adios Pro — evolução da v3 com mais estabilidade lateral e melhor transição.",
  },
  "adidas-evo-sl": {
    foamMidsole: "lightstrike_pro",
    weightGrams: 248,
    aggressiveness: "responsivo",
    idealUses: ["treino_ritmo", "intervalado", "rodagem_diaria"],
    modelDifferentiator:
      "Super-light daily rápido — mais acessível que Boston para quem quer leveza sem placa.",
  },

  // —— Nike ——
  "nike-pegasus-41": {
    foamMidsole: "react",
    foamSecondary: "zoomx",
    weightGrams: 272,
    aggressiveness: "equilibrado",
    softness: 3,
    responsiveness: 3,
    durability: 5,
    dropMm: 10,
    stackHeelMm: 33,
    idealUses: ["rodagem_diaria", "longao", "treino_ritmo"],
    modelDifferentiator:
      "Cavalo de batalha neutro da Nike — equilíbrio entre conforto e resposta. Não é macio como Vomero nem agressivo como Streakfly.",
    realStrengths: ["Versatilidade extrema", "Durabilidade comprovada", "Funciona para 80% dos treinos"],
  },
  "nike-vomero-18": {
    foamMidsole: "zoomx",
    weightGrams: 295,
    aggressiveness: "confortavel",
    softness: 5,
    responsiveness: 2,
    dropMm: 10,
    stackHeelMm: 40,
    idealUses: ["rodagem_diaria", "longao", "regenerativo"],
    modelDifferentiator:
      "Premium conforto com stack alto de ZoomX — foco em proteção e maciez, oposto ao Pegasus equilibrado e ao Streakfly de velocidade.",
    realLimitations: ["Pesado para treinos de ritmo", "Resposta lenta para intervalados"],
  },
  "nike-invincible-3": {
    foamMidsole: "zoomx",
    weightGrams: 310,
    aggressiveness: "confortavel",
    softness: 5,
    responsiveness: 1,
    volumeHandling: "medium",
    idealUses: ["regenerativo", "longao"],
    modelDifferentiator:
      "Recovery shoe com ZoomX máximo — absorve impacto como nenhum outro da Nike, mas cansa em ritmos rápidos.",
    realLimitations: ["Instável em ritmo forte", "Alto desgaste se usado em treinos rápidos"],
  },
  "nike-pegasus-premium": {
    foamMidsole: "zoomx",
    weightGrams: 268,
    aggressiveness: "responsivo",
    responsiveness: 4,
    stackHeelMm: 38,
    idealUses: ["rodagem_diaria", "treino_ritmo", "longao"],
    modelDifferentiator:
      "Super trainer da linha Pegasus — ZoomX com mais resposta que o Pegasus 41, sem ser super shoe de prova.",
  },
  "nike-streakfly": {
    foamMidsole: "zoomx",
    weightGrams: 185,
    aggressiveness: "agressivo",
    softness: 2,
    responsiveness: 5,
    stackHeelMm: 28,
    idealUses: ["intervalado", "prova_curta", "treino_ritmo"],
    modelDifferentiator:
      "Ultraleve para pista e intervalados — mínimo amortecimento, máxima velocidade. Não substitui daily trainer.",
  },
  "nike-zoom-fly-6": {
    foamMidsole: "zoomx",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 235,
    aggressiveness: "agressivo",
    idealUses: ["treino_ritmo", "meia_maratona", "maratona"],
    modelDifferentiator:
      "Placa de carbono acessível — ponte entre super trainer e Vaporfly, ideal para simular prova nos treinos.",
  },
  "nike-vaporfly-3": {
    foamMidsole: "zoomx",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 210,
    aggressiveness: "race_day_extremo",
    idealUses: ["meia_maratona", "maratona", "prova_curta"],
    modelDifferentiator:
      "Super shoe de referência — ZoomX + placa para máxima economia de corrida. Exige adaptação e técnica.",
  },
  "nike-alphafly-3": {
    foamMidsole: "zoomx",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 220,
    aggressiveness: "race_day_extremo",
    stackHeelMm: 40,
    idealUses: ["maratona", "meia_maratona"],
    modelDifferentiator:
      "Flagship Nike com Air Pods + ZoomX — mais amortecimento que Vaporfly, pensado para maratona longa.",
  },

  // —— Asics ——
  "asics-cumulus-26": {
    foamMidsole: "ff_blast_plus",
    weightGrams: 275,
    aggressiveness: "equilibrado",
    softness: 4,
    responsiveness: 3,
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator:
      "Daily trainer neutro e confortável — macio e previsível. Sem o rebote elástico do Novablast ou o máximo conforto do Nimbus.",
  },
  "asics-novablast-4": {
    foamMidsole: "ff_turbo",
    weightGrams: 260,
    aggressiveness: "responsivo",
    softness: 3,
    responsiveness: 4,
    stackHeelMm: 38,
    rocker: "meta_rocker",
    idealUses: ["rodagem_diaria", "treino_ritmo", "intervalado"],
    modelDifferentiator:
      "Super trainer elástico com FF Turbo — rebote energético para treinos rápidos. Não é confortável como Nimbus nem firme como Magic Speed.",
    realStrengths: ["Rebote premium no daily", "Versátil para ritmo e volume moderado"],
    realLimitations: ["Instável para corredores pesados", "Exige adaptação ao rebote"],
  },
  "asics-nimbus-26": {
    foamMidsole: "ff_blast_plus",
    weightGrams: 290,
    aggressiveness: "confortavel",
    softness: 5,
    responsiveness: 2,
    stackHeelMm: 38,
    idealUses: ["rodagem_diaria", "longao", "regenerativo"],
    modelDifferentiator:
      "Premium conforto Asics — Gel + FF Blast+ para máxima suavidade. Oposto ao Novablast responsivo e ao Superblast de performance.",
    realLimitations: ["Pesado para treinos de ritmo", "Pode parecer 'mole' para quem busca resposta"],
  },
  "asics-kayano-31": {
    foamMidsole: "ff_blast_plus",
    gaitSupport: "max_stability",
    stability: 5,
    weightGrams: 295,
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator:
      "Estabilidade máxima com 4D Guidance — para overpronadores ou quem precisa de base segura.",
  },
  "asics-superblast-2": {
    foamMidsole: "ff_turbo_plus",
    weightGrams: 255,
    aggressiveness: "responsivo",
    responsiveness: 5,
    stackHeelMm: 40,
    idealUses: ["treino_ritmo", "intervalado", "rodagem_diaria"],
    modelDifferentiator:
      "Super trainer topo Asics com FF Turbo+ — mais resposta que Novablast, sem placa. Diferente do Boston (firme) e do Magic Speed (com placa).",
    realStrengths: ["Rebote excepcional sem placa", "Versátil para treinos exigentes"],
    realLimitations: ["Instável para corredores pesados", "Preço premium para daily"],
  },
  "asics-magic-speed-4": {
    foamMidsole: "ff_turbo",
    hasPlate: true,
    plateType: "composite",
    weightGrams: 245,
    aggressiveness: "agressivo",
    idealUses: ["treino_ritmo", "intervalado", "meia_maratona"],
    modelDifferentiator:
      "Speed trainer com placa composta — mais acessível que Metaspeed, ideal para treinar com placa.",
  },
  "asics-metaspeed-sky": {
    foamMidsole: "ff_turbo",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 215,
    aggressiveness: "race_day_extremo",
    idealUses: ["maratona"],
    modelDifferentiator:
      "Super shoe para passada longa (cadência baixa) — curva de rocker otimizada para maratonistas.",
  },
  "asics-metaspeed-edge": {
    foamMidsole: "ff_turbo",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 210,
    aggressiveness: "race_day_extremo",
    idealUses: ["meia_maratona", "prova_curta"],
    modelDifferentiator:
      "Super shoe para passada curta (cadência alta) — mais ágil que Metaspeed Sky para provas até meia.",
  },

  // —— New Balance ——
  "nb-880v14": {
    foamMidsole: "fresh_foam_x",
    weightGrams: 278,
    aggressiveness: "equilibrado",
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator: "Daily trainer neutro NB — confiável e equilibrado, base da rotina.",
  },
  "nb-rebel-v4": {
    foamMidsole: "fuelcell",
    weightGrams: 262,
    aggressiveness: "responsivo",
    responsiveness: 4,
    idealUses: ["rodagem_diaria", "treino_ritmo", "intervalado"],
    modelDifferentiator:
      "Super trainer FuelCell — rebote elástico para daily rápido. Mais responsivo que 880, sem placa do SC Elite.",
  },
  "nb-sc-elite-v4": {
    foamMidsole: "fuelcell",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 215,
    aggressiveness: "race_day_extremo",
    idealUses: ["maratona", "meia_maratona"],
    modelDifferentiator: "Super shoe NB com placa de carbono FuelCell — foco em prova.",
  },

  // —— Saucony ——
  "saucony-ride-17": {
    foamMidsole: "pwrrun",
    weightGrams: 275,
    aggressiveness: "equilibrado",
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator: "Daily neutro Saucony — confortável e versátil, referência da marca.",
  },
  "saucony-endorphin-speed-4": {
    foamMidsole: "pwrrun_pb",
    hasPlate: true,
    plateType: "composite",
    weightGrams: 248,
    aggressiveness: "agressivo",
    idealUses: ["treino_ritmo", "intervalado", "meia_maratona"],
    modelDifferentiator:
      "Speed trainer com placa nylon — treino de qualidade com tecnologia de prova a preço menor que Pro.",
  },
  "saucony-endorphin-pro-4": {
    foamMidsole: "pwrrun_pb",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 215,
    aggressiveness: "race_day_extremo",
    idealUses: ["maratona", "meia_maratona"],
    modelDifferentiator: "Super shoe Saucony com PWRRUN PB — placa de carbono para prova.",
  },
  "saucony-triumph-22": {
    foamMidsole: "pwrrun",
    weightGrams: 295,
    aggressiveness: "confortavel",
    softness: 5,
    idealUses: ["rodagem_diaria", "longao", "regenerativo"],
    modelDifferentiator:
      "Premium conforto Saucony — máximo amortecimento PWRRUN+, oposto ao Kinvara leve e Endorphin rápido.",
  },

  // —— Hoka ——
  "hoka-clifton-9": {
    foamMidsole: "cmeva",
    weightGrams: 270,
    aggressiveness: "confortavel",
    softness: 4,
    rocker: "meta_rocker",
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator:
      "Daily Hoka com meta-rocker suave — confortável e fluido, referência de easy running da marca.",
  },
  "hoka-bondi-9": {
    foamMidsole: "cmeva",
    weightGrams: 305,
    aggressiveness: "confortavel",
    softness: 5,
    stackHeelMm: 42,
    idealUses: ["longao", "regenerativo", "rodagem_diaria"],
    modelDifferentiator:
      "Max cushion Hoka — stack máximo para proteção, ideal para corredores pesados e longões.",
  },
  "hoka-mach-6": {
    foamMidsole: "peba",
    weightGrams: 250,
    aggressiveness: "responsivo",
    idealUses: ["treino_ritmo", "intervalado", "rodagem_diaria"],
    modelDifferentiator:
      "Speed trainer Hoka — mais leve e responsivo que Clifton, sem ser super shoe.",
  },
  "hoka-rocket-x-2": {
    foamMidsole: "peba",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 220,
    aggressiveness: "race_day_extremo",
    idealUses: ["meia_maratona", "maratona"],
    modelDifferentiator: "Super shoe Hoka com placa — resposta rápida para prova.",
  },

  // —— Puma ——
  "puma-velocity-3": {
    foamMidsole: "nitro",
    weightGrams: 275,
    aggressiveness: "equilibrado",
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator: "Daily Nitro versátil — equilíbrio conforto/resposta na linha Puma.",
  },
  "puma-deviate-2": {
    foamMidsole: "nitro",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 260,
    aggressiveness: "agressivo",
    idealUses: ["treino_ritmo", "intervalado", "meia_maratona"],
    modelDifferentiator: "Speed trainer com placa Nitro — treino de qualidade com tecnologia de prova.",
  },

  // —— Mizuno ——
  "mizuno-rider-27": {
    foamMidsole: "enerzy",
    weightGrams: 278,
    aggressiveness: "equilibrado",
    idealUses: ["rodagem_diaria", "longao"],
    modelDifferentiator: "Daily Mizuno clássico — Wave plate tradicional com Enerzy equilibrado.",
  },
  "mizuno-neo-vista": {
    foamMidsole: "enerzy_nxt",
    hasPlate: true,
    plateType: "carbon",
    weightGrams: 225,
    aggressiveness: "race_day_extremo",
    idealUses: ["meia_maratona", "maratona"],
    modelDifferentiator: "Super shoe Mizuno com placa — Enerzy Nxt responsivo para prova.",
  },
};

function defaultUsesForCategory(category: TechnicalCategory): TrainingUse[] {
  return CATEGORY_TECH_DEFAULTS[category].idealUses;
}

function buildRideDescription(
  def: MergedDef,
  spec: ShoeTechnicalSpec,
): string {
  const foam = FOAM_LABELS[spec.foamMidsole];
  const agg = AGGRESSIVENESS_LABELS[spec.aggressiveness].toLowerCase();

  if (spec.hasPlate) {
    return `Entressola ${foam} com placa — passada ${agg} pensada para economia de corrida e impulso na propulsão.`;
  }

  if (spec.softness >= 4 && spec.responsiveness <= 2) {
    return `Entressola ${foam} — passada ${agg}, prioriza absorção de impacto e conforto prolongado.`;
  }

  if (spec.responsiveness >= 4) {
    return `Entressola ${foam} — passada ${agg} com boa devolução de energia a cada passo.`;
  }

  return `Entressola ${foam} — passada ${agg}, equilibra conforto e resposta para treinos variados.`;
}

function buildGaitDescription(spec: ShoeTechnicalSpec): string {
  switch (spec.gaitSupport) {
    case "max_stability":
      return "Passada com correção pronada forte — guia o pé na fase de apoio e reduz instabilidade.";
    case "stability":
      return "Passada estabilizada — suporte medial para corredores que precisam de mais controle.";
    case "guidance":
      return "Passada com guia suave — ajuda na transição sem corrigir agressivamente.";
    default:
      if (spec.aggressiveness === "race_day_extremo") {
        return "Passada neutra e agressiva — favorece corredores com técnica consolidada e cadência eficiente.";
      }
      if (spec.rocker === "meta_rocker") {
        return "Passada neutra com meta-rocker — favorece transição fluida do calcanhar à ponta.";
      }
      return "Passada neutra — funciona para a maioria dos corredores sem correção específica.";
  }
}

function buildVolumeNotes(spec: ShoeTechnicalSpec): string {
  switch (spec.volumeHandling) {
    case "race_only":
      return "Volume baixo recomendado — reservar para treinos de qualidade e prova; desgaste acelera com uso diário.";
    case "high":
      return "Aguenta alto volume semanal — construção pensada para ser o par principal da rotina.";
    case "medium":
      return "Volume moderado — ideal como segundo par ou para 3–4 treinos por semana.";
    default:
      return "Volume limitado — melhor como complemento do que como único par.";
  }
}

function buildDefaultStrengths(spec: ShoeTechnicalSpec): string[] {
  const strengths: string[] = [];
  if (spec.durability >= 4) strengths.push("Boa durabilidade para volume");
  if (spec.softness >= 4) strengths.push("Amortecimento generoso");
  if (spec.responsiveness >= 4) strengths.push("Resposta rápida na propulsão");
  if (spec.stability >= 4) strengths.push("Base estável e segura");
  if (spec.hasPlate) strengths.push("Placa para treinos/provas de ritmo");
  if (strengths.length === 0) strengths.push("Versátil para a categoria");
  return strengths;
}

function buildDefaultLimitations(spec: ShoeTechnicalSpec): string {
  if (spec.aggressiveness === "race_day_extremo") {
    return "Exige adaptação, técnica e não serve como único par de treino";
  }
  if (spec.softness >= 4 && spec.responsiveness <= 2) {
    return "Resposta limitada para treinos de ritmo intenso";
  }
  if (spec.aggressiveness === "agressivo" && !spec.hasPlate) {
    return "Pouco confortável para longões fáceis e iniciantes";
  }
  return "Não cobre todos os tipos de treino sozinho";
}

function buildDefaultDifferentiator(def: MergedDef, spec: ShoeTechnicalSpec): string {
  const foam = FOAM_LABELS[spec.foamMidsole];
  const uses = spec.idealUses
    .slice(0, 2)
    .map((u) => TRAINING_USE_LABELS[u].toLowerCase())
    .join(" e ");
  return `${def.model} — ${def.brand}, entressola ${foam}, foco em ${uses}.`;
}

function defaultAdaptation(agg: AggressivenessLevel, hasPlate: boolean): AdaptationLevel {
  if (agg === "race_day_extremo") return "elite";
  if (hasPlate && agg === "agressivo") return "alta";
  if (agg === "agressivo" || agg === "responsivo") return "moderada";
  return "nenhuma";
}

function defaultEnergyReturn(responsiveness: number, foam: FoamTechnology): ShoeTechnicalSpec["energyReturn"] {
  if (responsiveness >= 5) return 5;
  if (responsiveness >= 4 || ["peba", "zoomx", "ff_turbo", "ff_turbo_plus", "nitro_elite", "pwrrun_pb", "fuelcell"].includes(foam)) {
    return 4;
  }
  if (responsiveness >= 3) return 3;
  return 2;
}

export function resolveTechnicalSpec(def: MergedDef): ShoeTechnicalSpec {
  const categoryDefaults = CATEGORY_TECH_DEFAULTS[def.category];
  const brandFoam = BRAND_DEFAULT_FOAM[def.brand] ?? "eva";
  const override: TechnicalSpecOverride = {
    ...SHOE_TECH_OVERRIDES[def.id],
    ...PREMIUM_TECH_OVERRIDES[def.id],
    ...def.technical,
  };

  const foamMidsole: FoamTechnology =
    override.foamMidsole ?? brandFoam ?? categoryDefaults.foamMidsole;

  const hasPlate = override.hasPlate ?? def.hasPlate ?? categoryDefaults.hasPlate;

  const aggressiveness: AggressivenessLevel =
    override.aggressiveness ??
    (def.isAggressive
      ? "agressivo"
      : def.category === "race_day"
        ? "race_day_extremo"
        : categoryDefaults.aggressiveness);

  const spec: ShoeTechnicalSpec = {
    weightGrams: override.weightGrams ?? categoryDefaults.weightGrams,
    foamMidsole,
    foamSecondary: override.foamSecondary,
    hasPlate,
    plateType: override.plateType ?? (hasPlate ? "carbon" : "none"),
    aggressiveness,
    stability: (override.stability ??
      def.stabilityLevelNum ??
      categoryDefaults.stability) as ShoeTechnicalSpec["stability"],
    softness: (override.softness ??
      def.cushioningLevel ??
      categoryDefaults.softness) as ShoeTechnicalSpec["softness"],
    responsiveness: (override.responsiveness ??
      categoryDefaults.responsiveness) as ShoeTechnicalSpec["responsiveness"],
    durability: (override.durability ??
      categoryDefaults.durability) as ShoeTechnicalSpec["durability"],
    dropMm: override.dropMm ?? categoryDefaults.dropMm,
    stackHeelMm: override.stackHeelMm ?? categoryDefaults.stackHeelMm,
    stackForefootMm:
      override.stackForefootMm ?? categoryDefaults.stackForefootMm,
    rocker: override.rocker ?? categoryDefaults.rocker,
    idealUses: override.idealUses ?? defaultUsesForCategory(def.category),
    gaitSupport: override.gaitSupport ?? categoryDefaults.gaitSupport,
    volumeHandling: override.volumeHandling ?? categoryDefaults.volumeHandling,
    idealRunnerLevel:
      override.idealRunnerLevel ??
      (def.experienceLevel as ShoeTechnicalSpec["idealRunnerLevel"]),
    rideDescription: "",
    gaitDescription: "",
    volumeNotes: "",
    realStrengths: [],
    realLimitations: [],
    modelDifferentiator: "",
    adaptationLevel: "nenhuma",
    isFlagship: false,
    energyReturn: 3,
    idealPaceMinSec: 300,
    idealPaceMaxSec: 480,
    efficientPaceMaxSec: 540,
    advancedOnly: false,
    cadenceDemand: 2,
    efficiencyDemand: 2,
    paceSensitivity: 1,
    technicalDemandLevel: "versatil",
  };

  spec.rideDescription =
    override.rideDescription ?? buildRideDescription(def, spec);
  spec.gaitDescription =
    override.gaitDescription ?? buildGaitDescription(spec);
  spec.volumeNotes = override.volumeNotes ?? buildVolumeNotes(spec);
  spec.realStrengths =
    override.realStrengths ?? buildDefaultStrengths(spec);
  spec.realLimitations =
    override.realLimitations ?? [buildDefaultLimitations(spec)];
  spec.modelDifferentiator =
    override.modelDifferentiator ?? buildDefaultDifferentiator(def, spec);

  spec.adaptationLevel =
    override.adaptationLevel ?? defaultAdaptation(spec.aggressiveness, spec.hasPlate);
  spec.isFlagship = override.isFlagship ?? def.isFlagship ?? false;
  spec.energyReturn =
    override.energyReturn ??
    defaultEnergyReturn(spec.responsiveness, spec.foamMidsole);

  const paceFields = resolvePaceFields(def.id, def.category, spec.aggressiveness, {
    idealPaceMinSec: override.idealPaceMinSec,
    idealPaceMaxSec: override.idealPaceMaxSec,
    efficientPaceMaxSec: override.efficientPaceMaxSec,
    advancedOnly: override.advancedOnly,
    cadenceDemand: override.cadenceDemand,
    efficiencyDemand: override.efficiencyDemand,
    paceSensitivity: override.paceSensitivity,
    technicalDemandLevel: override.technicalDemandLevel,
  });

  Object.assign(spec, paceFields);

  return spec;
}

export function getTechnicalSpecForShoe(
  def: MergedDef,
): ShoeTechnicalSpec {
  return resolveTechnicalSpec(def);
}

export function getTechnicalSpecById(
  id: string,
  defs: MergedDef[],
): ShoeTechnicalSpec | null {
  const def = defs.find((d) => d.id === id);
  if (!def) return null;
  return resolveTechnicalSpec(def);
}
