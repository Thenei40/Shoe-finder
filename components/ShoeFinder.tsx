"use client";

import { useCallback, useState } from "react";
import {
  getRecommendations,
  getResultsHeadline,
  type Recommendation,
} from "@/lib/recommendations";
import { buildProfileSummary } from "@/lib/profile";
import { QUESTIONS, emptyAnswers } from "@/lib/questions";
import { type FormAnswers, formatPrice } from "@/lib/shoes";

type Phase = "hero" | "quiz" | "results";

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = (current / total) * 100;
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-xs text-neutral-500">
        <span>
          Pergunta {current} de {total}
        </span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-neutral-900 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ProfileSummaryCard({ answers }: { answers: FormAnswers }) {
  const profile = buildProfileSummary(answers);

  return (
    <div className="animate-fade-in-up mb-10 rounded-[2rem] border border-neutral-200/80 bg-white p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
        {profile.title}
      </p>
      <ul className="mt-6 space-y-3">
        {profile.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-base text-neutral-700"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ResultCard({
  recommendation,
  index,
  prominent = false,
}: {
  recommendation: Recommendation;
  index: number;
  prominent?: boolean;
}) {
  const { shoe, badge, highlighted, summary } = recommendation;
  const isHighlighted = highlighted || prominent;

  return (
    <article
      className={`animate-fade-in-up rounded-2xl border bg-white p-5 sm:p-6 ${
        isHighlighted
          ? "border-neutral-900 shadow-[0_16px_48px_rgb(0,0,0,0.12)] ring-2 ring-neutral-900/10"
          : "border-neutral-200 shadow-sm"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
      aria-labelledby={`card-title-${shoe.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            {shoe.brand}
          </p>
          <h3
            id={`card-title-${shoe.id}`}
            className={`mt-1 font-semibold tracking-tight text-neutral-900 ${
              isHighlighted ? "text-2xl" : "text-xl"
            }`}
          >
            {shoe.model}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            isHighlighted
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700"
          }`}
        >
          {summary.displayBadge}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-neutral-500">
        Preço médio · {formatPrice(shoe.price)}
      </p>

      <div className="mt-5 space-y-4">
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Por que indicamos
          </h4>
          <div className="mt-2">
            <BulletList items={summary.whyWeRecommend} />
          </div>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Ideal para
          </h4>
          <div className="mt-2">
            <BulletList items={summary.idealFor} />
          </div>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Pace recomendado
          </h4>
          <p className="mt-1.5 text-sm text-neutral-800">{summary.recommendedPace}</p>
        </section>

        <section className="rounded-xl bg-amber-50 px-3 py-2.5 ring-1 ring-amber-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800/80">
            Atenção
          </h4>
          <p className="mt-1 text-sm text-amber-950">{summary.attention}</p>
        </section>

        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Pontos fortes
          </h4>
          <div className="mt-2">
            <BulletList items={summary.strengths} />
          </div>
        </section>
      </div>
    </article>
  );
}

export default function ShoeFinder() {
  const [phase, setPhase] = useState<Phase>("hero");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FormAnswers>(emptyAnswers);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);

  const currentQuestion = QUESTIONS[step];
  const isLastQuestion = step === QUESTIONS.length - 1;

  const bumpTransition = useCallback(() => {
    setTransitionKey((k) => k + 1);
  }, []);

  function handleStart() {
    setPhase("quiz");
    setStep(0);
    setAnswers(emptyAnswers);
    setResults(null);
    bumpTransition();
  }

  function handleAnswer(value: string) {
    if (!currentQuestion) return;

    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    if (isLastQuestion) {
      setResults(getRecommendations(updated));
      setTimeout(() => {
        setPhase("results");
        bumpTransition();
      }, 280);
      return;
    }

    setTimeout(() => {
      setStep((s) => s + 1);
      bumpTransition();
    }, 280);
  }

  function handleBack() {
    if (step === 0) {
      setPhase("hero");
      return;
    }
    setStep((s) => s - 1);
    bumpTransition();
  }

  function handleRestart() {
    setPhase("hero");
    setStep(0);
    setAnswers(emptyAnswers);
    setResults(null);
    bumpTransition();
  }

  const resultsHeadline = results ? getResultsHeadline(answers) : null;


  return (
    <main className="min-h-screen bg-[#f5f5f7] text-neutral-900">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        {phase === "hero" && (
          <section className="animate-fade-in-up flex min-h-[70vh] flex-col items-center justify-center text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              Primeiro par de corrida
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Encontre o tênis ideal para sua corrida
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-500 sm:text-lg">
              Responda algumas perguntas simples e descubra qual tênis combina com
              seu perfil.
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="mt-12 rounded-full bg-neutral-900 px-12 py-4 text-base font-medium text-white transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Começar
            </button>
          </section>
        )}

        {phase === "quiz" && currentQuestion && (
          <section className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center">
            <ProgressBar current={step + 1} total={QUESTIONS.length} />

            <div
              key={transitionKey}
              className="animate-quiz-in mt-10 rounded-[2rem] border border-neutral-200/60 bg-white p-8 shadow-[0_16px_48px_rgb(0,0,0,0.06)] sm:p-10"
            >
              <button
                type="button"
                onClick={handleBack}
                className="mb-6 text-sm font-medium text-neutral-400 transition hover:text-neutral-700"
              >
                ← Voltar
              </button>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {currentQuestion.label}
              </h2>
              {currentQuestion.helper && (
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {currentQuestion.helper}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAnswer(option.value)}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-left text-base font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-white active:scale-[0.99]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {phase === "results" && results && results.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Suas indicações
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {resultsHeadline?.title ?? "4 opções para o seu perfil"}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-neutral-500">
                {resultsHeadline?.subtitle ??
                  "Resumo rápido — leia cada card em menos de 20 segundos."}
              </p>
            </div>

            <ProfileSummaryCard answers={answers} />

            <div className="flex flex-col gap-6">
              {results.map((rec, index) => (
                <ResultCard
                  key={rec.shoe.id}
                  recommendation={rec}
                  index={index}
                  prominent={rec.highlighted}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-500"
              >
                Refazer questionário
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
