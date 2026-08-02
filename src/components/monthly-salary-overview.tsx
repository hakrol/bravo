"use client";

import { useState } from "react";

const HOURS_PER_YEAR = 1950;

type SalaryPeriod = "annual" | "monthly" | "hourly";

export type MonthlySalaryOverviewCardData = {
  key: string;
  title: string;
  caption?: string;
  tone: "women" | "men" | "neutral";
  totalMedian?: number;
  totalAverage?: number;
  contractedMedian?: number;
  contractedAverage?: number;
};

const periodOptions: Array<{ value: SalaryPeriod; label: string }> = [
  { value: "annual", label: "År" },
  { value: "monthly", label: "Mnd" },
  { value: "hourly", label: "Time" },
];

export function MonthlySalaryOverview({
  cards,
}: {
  cards: MonthlySalaryOverviewCardData[];
}) {
  const [activePeriod, setActivePeriod] = useState<SalaryPeriod>("monthly");

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-slate-700">Bytt visning:</span>
        <div aria-label="Velg hvordan lønnen skal vises" className="flex gap-2" role="group">
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

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {cards.map((card) => (
          <SalaryOverviewCard activePeriod={activePeriod} card={card} key={card.key} />
        ))}
      </div>

      {activePeriod === "hourly" ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Timelønn er beregnet fra årslønn fordelt på 1 950 timer, tilsvarende 37,5 timer per uke
          i 52 uker.
        </p>
      ) : null}

      {activePeriod === "annual" ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Årslønn er beregnet ved å gange SSBs månedslønn med 12.
        </p>
      ) : null}
    </>
  );
}

function SalaryOverviewCard({
  card,
  activePeriod,
}: {
  card: MonthlySalaryOverviewCardData;
  activePeriod: SalaryPeriod;
}) {
  const tone = getTone(card.tone);
  const salaryLabel = getSalaryLabel(activePeriod);
  const rows = [
    {
      key: "total",
      label: `Samlet ${salaryLabel}`,
      description: "Avtalt lønn, bonus og uregelmessige tillegg.",
      median: convertMonthlySalary(card.totalMedian, activePeriod),
      average: convertMonthlySalary(card.totalAverage, activePeriod),
    },
    {
      key: "contracted",
      label: `Avtalt ${salaryLabel}`,
      description: "Fast avtalt lønn uten bonus, uregelmessige tillegg og overtid.",
      median: convertMonthlySalary(card.contractedMedian, activePeriod),
      average: convertMonthlySalary(card.contractedAverage, activePeriod),
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
    </article>
  );
}

function MetricAvatar({ tone }: { tone: MonthlySalaryOverviewCardData["tone"] }) {
  if (tone === "women") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-2xl text-pink-600 shadow-[0_8px_20px_rgba(236,72,153,0.14)]">
        ♀
      </span>
    );
  }

  if (tone === "men") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-2xl text-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.14)]">
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

function convertMonthlySalary(value: number | undefined, period: SalaryPeriod) {
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

function getSalaryLabel(period: SalaryPeriod) {
  if (period === "annual") {
    return "årslønn";
  }

  if (period === "hourly") {
    return "timelønn";
  }

  return "månedslønn";
}

function getTone(tone: MonthlySalaryOverviewCardData["tone"]) {
  if (tone === "women") {
    return { period: "bg-pink-50 text-pink-700" };
  }

  if (tone === "men") {
    return { period: "bg-blue-50 text-blue-700" };
  }

  return { period: "bg-slate-100 text-slate-700" };
}

function formatKr(value?: number) {
  return value === undefined
    ? "Mangler tall"
    : `${Math.round(value).toLocaleString("nb-NO")} kr`;
}
