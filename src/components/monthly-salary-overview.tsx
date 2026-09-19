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

      <div className="mt-5 grid gap-4">
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
    <article className={`overflow-hidden rounded-[6px] border bg-white ${tone.card}`}>
      <div className={`flex items-center justify-between gap-4 border-b px-4 py-4 sm:px-5 ${tone.header}`}>
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

      <div className="divide-y divide-slate-200 sm:hidden">
        {rows.map((row) => (
          <section className="px-4 py-5" key={row.key}>
            <div>
              <h4 className="text-base font-semibold text-slate-950">{row.label}</h4>
              <p className="mt-1 max-w-[28rem] text-sm leading-5 text-slate-500">
                {row.description}
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="min-w-0 rounded-[8px] bg-slate-50/80 px-3 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Median
                </dt>
                <dd className={`mt-1 whitespace-nowrap text-lg font-semibold tabular-nums min-[380px]:text-xl ${tone.value}`}>
                  {formatKr(row.median)}
                </dd>
              </div>
              <div className="min-w-0 rounded-[8px] bg-slate-50/80 px-3 py-3 text-right">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Gjennomsnitt
                </dt>
                <dd className={`mt-1 whitespace-nowrap text-lg font-semibold tabular-nums min-[380px]:text-xl ${tone.value}`}>
                  {formatKr(row.average)}
                </dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <table className="hidden w-full table-fixed border-collapse text-left sm:table">
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
              <td className={`whitespace-nowrap px-2 py-4 text-right text-xl font-semibold tabular-nums ${tone.value}`}>
                {formatKr(row.median)}
              </td>
              <td className={`whitespace-nowrap px-3 py-4 text-right text-xl font-semibold tabular-nums sm:px-4 ${tone.value}`}>
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
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ec1f74]/10 text-2xl text-[#ec1f74] shadow-[0_8px_20px_rgba(236,31,116,0.14)]">
        ♀
      </span>
    );
  }

  if (tone === "men") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2563eb]/10 text-2xl text-[#2563eb] shadow-[0_8px_20px_rgba(37,99,235,0.14)]">
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
    return {
      card: "border-[#ec1f74]/25",
      header: "border-[#ec1f74]/20 bg-[#ec1f74]/[0.04]",
      period: "bg-[#ec1f74]/10 text-[#ec1f74]",
      value: "text-[#ec1f74]",
    };
  }

  if (tone === "men") {
    return {
      card: "border-[#2563eb]/25",
      header: "border-[#2563eb]/20 bg-[#2563eb]/[0.04]",
      period: "bg-[#2563eb]/10 text-[#2563eb]",
      value: "text-[#2563eb]",
    };
  }

  return {
    card: "border-[#14532d]/20",
    header: "border-[#14532d]/20 bg-[#14532d]/[0.04]",
    period: "bg-[#14532d]/10 text-[#14532d]",
    value: "text-[#14532d]",
  };
}

function formatKr(value?: number) {
  return value === undefined
    ? "Mangler tall"
    : `${Math.round(value).toLocaleString("nb-NO")} kr`;
}
