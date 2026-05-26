import { type FormAnswers, type Shoe, SHOES } from "./shoes";

export type RecommendationSlot =
  | "economico"
  | "intermediario"
  | "melhor"
  | "alternativa";

export type Recommendation = {
  shoe: Shoe;
  slot: RecommendationSlot;
  slotLabel: string;
  reason: string;
  score: number;
};

function matches(list: string[], value: string): boolean {
  return list.includes(value);
}

function isBeginner(answers: FormAnswers): boolean {
  return answers.experience === "nunca" || answers.experience === "comecando";
}

function wantsPerformanceFeel(answers: FormAnswers): boolean {
  return (
    answers.usage === "provas" ||
    (answers.feeling === "leve" &&
      (answers.experience === "frequente" ||
        answers.experience === "algum-tempo"))
  );
}

/** Tênis de placa quando o perfil busca mais ritmo ou provas — nunca como primeira opção para quem está começando ou sente dor. */
function suggestsPlateModels(answers: FormAnswers): boolean {
  if (isBeginner(answers)) return false;
  if (answers.discomfort === "pe" || answers.discomfort === "joelho") {
    return false;
  }
  return wantsPerformanceFeel(answers);
}

function scoreShoe(shoe: Shoe, answers: FormAnswers): number {
  let score = 0;

  if (matches(shoe.usage, answers.usage)) score += 5;
  if (matches(shoe.experience, answers.experience)) score += 5;
  if (matches(shoe.discomfort, answers.discomfort)) score += 4;
  if (matches(shoe.feeling, answers.feeling)) score += 4;
  if (matches(shoe.prices, answers.price)) score += 4;
  if (matches(shoe.frequency, answers.frequency)) score += 2;
  if (matches(shoe.weight, answers.weight)) score += 2;

  if (answers.discomfort === "duro" && shoe.feeling.includes("macio")) {
    score += 2;
  }
  if (
    (answers.discomfort === "pe" || answers.discomfort === "joelho") &&
    shoe.tier === "premium"
  ) {
    score += 3;
  }
  if (isBeginner(answers) && !shoe.hasPlate) {
    score += 2;
  }
  if (isBeginner(answers) && shoe.hasPlate) {
    score -= 8;
  }
  if (suggestsPlateModels(answers) && shoe.hasPlate) {
    score += 4;
  }
  if (answers.usage === "provas" && shoe.hasPlate) {
    score += 3;
  }
  if (answers.feeling === "leve" && shoe.feeling.includes("leve")) {
    score += 2;
  }
  if (
    (answers.experience === "nunca" || answers.experience === "comecando") &&
    shoe.tier === "economico"
  ) {
    score += 1;
  }

  return score;
}

function buildReason(answers: FormAnswers, shoe: Shoe): string {
  const parts: string[] = [];

  if (answers.experience === "nunca" || answers.experience === "comecando") {
    parts.push("está dando seus primeiros passos na corrida");
  }
  if (answers.feeling === "macio" || answers.discomfort === "duro") {
    parts.push("quer um tênis bem macio para o pé");
  }
  if (answers.discomfort === "pe" || answers.discomfort === "joelho") {
    parts.push("precisa de um modelo que ajude a aliviar o desconforto");
  }
  if (answers.usage === "caminhada") {
    parts.push("pretende usar bastante para caminhada");
  }
  if (answers.frequency === "5plus") {
    parts.push("pretende usar o tênis quase todos os dias");
  }
  if (answers.weight === "acima-85") {
    parts.push("busca algo que deixe a sensação de corrida mais suave");
  }
  if (answers.price === "ate-400") {
    parts.push("prefere gastar menos neste primeiro momento");
  }
  if (answers.price === "acima-3000") {
    parts.push("busca o melhor desempenho possível");
  }
  if (answers.feeling === "leve") {
    parts.push("prefere sentir os pés mais leves na hora do treino");
  }
  if (answers.usage === "academia") {
    parts.push("quer um tênis que funcione na academia e na rua");
  }
  if (answers.usage === "provas" && shoe.hasPlate) {
    parts.push("quer se preparar para provas com mais impulso na passada");
  } else if (answers.usage === "provas") {
    parts.push("quer se preparar para treinos mais fortes ou provas");
  }
  if (parts.length === 0) {
    parts.push(
      "busca um tênis confiável para treinar sem complicações no dia a dia",
    );
  }

  const joined =
    parts.length === 1
      ? parts[0]
      : `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;

  return `Escolhemos este modelo porque você ${joined}.`;
}

function nextBestUnused(
  ranked: { shoe: Shoe; score: number }[],
  exclude: Set<string>,
  filter?: (shoe: Shoe) => boolean,
): { shoe: Shoe; score: number } | null {
  const found = ranked.find(
    (r) => !exclude.has(r.shoe.id) && (!filter || filter(r.shoe)),
  );
  return found ?? null;
}

const SLOT_LABELS: Record<RecommendationSlot, string> = {
  economico: "Opção econômica",
  intermediario: "Opção intermediária",
  melhor: "Sua melhor escolha",
  alternativa: "Outra boa opção",
};

export function getRecommendations(answers: FormAnswers): Recommendation[] {
  const ranked = SHOES.map((shoe) => ({
    shoe,
    score: scoreShoe(shoe, answers),
  })).sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.shoe.price - b.shoe.price,
  );

  const excluded = new Set<string>();
  const wantPlateAlt = suggestsPlateModels(answers);

  let melhorEntry: (typeof ranked)[0];
  if (wantPlateAlt) {
    melhorEntry =
      ranked.find((r) => r.shoe.hasPlate) ??
      ranked.find((r) => !r.shoe.hasPlate) ??
      ranked[0];
  } else {
    melhorEntry =
      ranked.find((r) => !r.shoe.hasPlate) ??
      ranked[0];
  }

  excluded.add(melhorEntry.shoe.id);

  const pickEconomico = () => {
    const byTier = ranked.find(
      (r) =>
        r.shoe.tier === "economico" &&
        !r.shoe.hasPlate &&
        !excluded.has(r.shoe.id),
    );
    if (byTier) return byTier;

    return (
      [...ranked]
        .filter((r) => !r.shoe.hasPlate && !excluded.has(r.shoe.id))
        .sort((a, b) => a.shoe.price - b.shoe.price)[0] ??
      nextBestUnused(ranked, excluded, (s) => !s.hasPlate)!
    );
  };

  const pickIntermediario = () => {
    const byTier = ranked.find(
      (r) =>
        r.shoe.tier === "intermediario" &&
        !r.shoe.hasPlate &&
        !excluded.has(r.shoe.id),
    );
    if (byTier) return byTier;

    return (
      [...ranked]
        .filter((r) => !r.shoe.hasPlate && !excluded.has(r.shoe.id))
        .sort(
          (a, b) =>
            Math.abs(a.shoe.price - 850) - Math.abs(b.shoe.price - 850),
        )[0] ?? nextBestUnused(ranked, excluded, (s) => !s.hasPlate)!
    );
  };

  const pickAlternativa = () => {
    if (wantPlateAlt) {
      const platePick = ranked.find(
        (r) => r.shoe.hasPlate && !excluded.has(r.shoe.id),
      );
      if (platePick) return platePick;
    }

    return nextBestUnused(ranked, excluded)!;
  };

  const economicoEntry = pickEconomico();
  excluded.add(economicoEntry.shoe.id);

  const intermediarioEntry = pickIntermediario();
  excluded.add(intermediarioEntry.shoe.id);

  const alternativaEntry = pickAlternativa();
  excluded.add(alternativaEntry.shoe.id);

  const slotsOrdered: RecommendationSlot[] = [
    "economico",
    "intermediario",
    "melhor",
    "alternativa",
  ];

  const entriesOrdered = [
    economicoEntry,
    intermediarioEntry,
    melhorEntry,
    alternativaEntry,
  ] as const;

  return slotsOrdered.map((slot, idx) => {
    const entry = entriesOrdered[idx];
    const slotLabel =
      slot === "alternativa" && entry.shoe.hasPlate
        ? "Para provas e ritmo forte"
        : SLOT_LABELS[slot];

    return {
      shoe: entry.shoe,
      slot,
      slotLabel,
      reason: buildReason(answers, entry.shoe),
      score: entry.score,
    };
  });
}
