"use client";

import { useState } from "react";

const HOURS_PER_YEAR = 1950;

type SalaryPeriod = "annual" | "monthly" | "hourly";

export type SalarySupplementCardData = {
  key: string;
  title: string;
  caption?: string;
  tone: "women" | "men" | "neutral";
  bonusMedian?: number;
  bonusAverage?: number;
  overtimeMedian?: number;
  overtimeAverage?: number;
  irregularAdditionsMedian?: number;
  irregularAdditionsAverage?: number;
};

const periodOptions: Array<{ value: SalaryPeriod; label: string }> = [
  { value: "annual", label: "År" },
  { value: "monthly", label: "Mnd" },
  { value: "hourly", label: "Time" },
];

export function SalarySupplementOverview({ cards }: { cards: SalarySupplementCardData[] }) {
  const [activePeriod, setActivePeriod] = useState<SalaryPeriod>("monthly");
  const gridColumns = cards.length === 1 ? "grid-cols-1" : "xl:grid-cols-2";

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-slate-700">Bytt visning:</span>
        <div aria-label="Velg hvordan beløpene skal vises" className="flex gap-2" role="group">
          {periodOptions.map((option) => {
            const active = option.value === activePeriod;

            return (
              <button
                aria-pressed={active}
                className={`rounded-[5px] border px-2.5 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:text-slate-950"
                }`}
                key={option.value}
                onClick={() => setActivePeriod(option.value)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`mt-5 grid gap-4 ${gridColumns}`}>
        {cards.map((card) => (
          <SalarySupplementCard activePeriod={activePeriod} card={card} key={card.key} />
        ))}
      </div>

      {activePeriod === "hourly" ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Timebeløpene er beregnet fra årsbeløp fordelt på 1 950 timer, tilsvarende 37,5 timer per
          uke i 52 uker.
        </p>
      ) : null}

      {activePeriod === "annual" ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Årsbeløpene er beregnet ved å gange SSBs månedsbeløp med 12.
        </p>
      ) : null}
    </>
  );
}

function SalarySupplementCard({
  activePeriod,
  card,
}: {
  activePeriod: SalaryPeriod;
  card: SalarySupplementCardData;
}) {
  const tone = getTone(card.tone);
  const rows = [
    {
      key: "irregular",
      label: "Uregelmessige tillegg",
      description: "Skift, turnus, offshore og lignende tillegg.",
      median: convertMonthlyAmount(card.irregularAdditionsMedian, activePeriod),
      average: convertMonthlyAmount(card.irregularAdditionsAverage, activePeriod),
    },
    {
      key: "bonus",
      label: "Bonus",
      description: "Bonusutbetalinger omregnet til månedsbeløp.",
      median: convertMonthlyAmount(card.bonusMedian, activePeriod),
      average: convertMonthlyAmount(card.bonusAverage, activePeriod),
    },
    {
      key: "overtime",
      label: "Overtid",
      description: "Betaling for arbeid utover avtalt arbeidstid.",
      median: convertMonthlyAmount(card.overtimeMedian, activePeriod),
      average: convertMonthlyAmount(card.overtimeAverage, activePeriod),
    },
  ];

  return (
    <article className="overflow-hidden rounded-[6px] border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <MetricAvatar tone={card.tone} />
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-950">
            {card.title}
          </h3>
        </div>
        {card.caption ? (
          <p className={`shrink-0 rounded-[10px] px-3 py-1.5 text-sm font-semibold shadow-sm ${tone.period}`}>
            {card.caption}
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              <th className="w-[48%] px-4 py-3 sm:px-5" scope="col">
                Lønnstype
              </th>
              <th className="w-[22%] px-2 py-3 text-right" scope="col">
                Median
              </th>
              <th className="w-[30%] px-3 py-3 text-right sm:px-4" scope="col">
                <span aria-hidden="true" className="sm:hidden">
                  Snitt
                </span>
                <span aria-hidden="true" className="hidden sm:inline">
                  Gjennomsnitt
                </span>
                <span className="sr-only">Gjennomsnitt</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t border-slate-200" key={row.key}>
                <th className="px-4 py-4 font-normal sm:px-5" scope="row">
                  <span className="block text-sm font-semibold text-slate-900">{row.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {row.description}
                  </span>
                </th>
                <td className="whitespace-nowrap px-2 py-4 text-right text-sm font-semibold tabular-nums text-slate-950">
                  {formatKr(row.median)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-semibold tabular-nums text-slate-950 sm:px-4">
                  {formatKr(row.average)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function MetricAvatar({ tone }: { tone: SalarySupplementCardData["tone"] }) {
  if (tone === "women") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-2xl font-semibold text-pink-600 shadow-[0_8px_18px_rgba(236,72,153,0.16)]">
        ♀
      </span>
    );
  }

  if (tone === "men") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-2xl font-semibold text-blue-600 shadow-[0_8px_18px_rgba(37,99,235,0.16)]">
        ♂
      </span>
    );
  }

  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
      Alle
    </span>
  );
}

function convertMonthlyAmount(value: number | undefined, period: SalaryPeriod) {
  if (value === undefined) {
    return undefined;
  }

  if (period === "annual") {
    return value * 12;
  }

  if (period === "hourly") {
    return (value * 12) / HOURS_PER_YEAR;
  }

  return value;
}

function getTone(tone: SalarySupplementCardData["tone"]) {
  if (tone === "women") {
    return { period: "bg-pink-50 text-pink-900" };
  }

  if (tone === "men") {
    return { period: "bg-blue-50 text-blue-900" };
  }

  return { period: "bg-slate-100 text-slate-700" };
}

function formatKr(value?: number) {
  return value === undefined
    ? "Mangler tall"
    : `${Math.round(value).toLocaleString("nb-NO")} kr`;
}
