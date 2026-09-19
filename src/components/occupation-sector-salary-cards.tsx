"use client";

import { useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";

const HOURS_PER_YEAR = 1950;

type SalaryPeriod = "annual" | "monthly" | "hourly";

export type OccupationSectorSalaryCardData = {
  description: string;
  key: string;
  label: string;
  rows: Array<{
    average?: number;
    label: string;
    median?: number;
  }>;
};

const periodOptions: Array<{ value: SalaryPeriod; label: string }> = [
  { value: "annual", label: "År" },
  { value: "monthly", label: "Mnd" },
  { value: "hourly", label: "Time" },
];

export function OccupationSectorSalaryCards({
  cards,
  periodLabel,
}: {
  cards: OccupationSectorSalaryCardData[];
  periodLabel: string;
}) {
  const [activePeriod, setActivePeriod] = useState<SalaryPeriod>("monthly");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
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
          <article
            className="overflow-hidden rounded-[6px] border border-slate-200 bg-white"
            key={card.key}
          >
            <div className="flex min-h-[57px] items-center justify-between gap-4 border-b border-slate-200 px-4 py-4">
              <div className="flex min-w-0 items-center gap-2">
                <h4 className="text-base font-semibold text-slate-950">{card.label}</h4>
                <MetricInfoButton
                  description={card.description}
                  label={card.label}
                  modalVariant="compact"
                  variant="muted"
                />
              </div>
              <span className="shrink-0 rounded-[10px] bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
                {periodLabel}
              </span>
            </div>
            <div className="divide-y divide-slate-200 sm:hidden">
              {card.rows.map((row) => (
                <section className="px-4 py-5" key={row.label}>
                  <h5 className={`text-base font-semibold ${getGenderColor(row.label)}`}>
                    {row.label}
                  </h5>
                  <dl className="mt-3 grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-[8px] bg-slate-50/80 px-3 py-3">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Median
                      </dt>
                      <dd className={`mt-1 whitespace-nowrap text-lg font-semibold tabular-nums min-[380px]:text-xl ${getGenderColor(row.label)}`}>
                        {formatKr(convertMonthlySalary(row.median, activePeriod))}
                      </dd>
                    </div>
                    <div className="min-w-0 rounded-[8px] bg-slate-50/80 px-3 py-3 text-right">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Gjennomsnitt
                      </dt>
                      <dd className={`mt-1 whitespace-nowrap text-lg font-semibold tabular-nums min-[380px]:text-xl ${getGenderColor(row.label)}`}>
                        {formatKr(convertMonthlySalary(row.average, activePeriod))}
                      </dd>
                    </div>
                  </dl>
                </section>
              ))}
            </div>

            <table className="hidden w-full table-fixed border-collapse text-left sm:table">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <th className="w-[32%] px-4 py-3" scope="col">
                    Kjønn
                  </th>
                  <th className="w-[30%] px-2 py-3 text-right" scope="col">
                    Median
                  </th>
                  <th className="w-[38%] px-4 py-3 text-right" scope="col">
                    Snitt
                  </th>
                </tr>
              </thead>
              <tbody>
                {card.rows.map((row) => (
                  <tr className="border-t border-slate-200" key={row.label}>
                    <th className={`px-4 py-3 text-sm font-semibold ${getGenderColor(row.label)}`} scope="row">
                      {row.label}
                    </th>
                    <td className={`whitespace-nowrap px-2 py-3 text-right text-xl font-semibold tabular-nums ${getGenderColor(row.label)}`}>
                      {formatKr(convertMonthlySalary(row.median, activePeriod))}
                    </td>
                    <td className={`whitespace-nowrap px-4 py-3 text-right text-xl font-semibold tabular-nums ${getGenderColor(row.label)}`}>
                      {formatKr(convertMonthlySalary(row.average, activePeriod))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        Tallene viser månedslønn for heltid og deltid samlet. Manglende tall betyr at SSB ikke har
        publisert verdien for yrket og sektoren.
      </p>

      {activePeriod === "hourly" ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Timelønn er beregnet fra årslønn fordelt på 1 950 timer, tilsvarende 37,5 timer per uke
          i 52 uker.
        </p>
      ) : null}

      {activePeriod === "annual" ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Årslønn er beregnet ved å gange SSBs månedslønn med 12.
        </p>
      ) : null}
    </div>
  );
}

function getGenderColor(label: string) {
  if (label === "Kvinner") {
    return "text-[#ec1f74]";
  }

  if (label === "Menn") {
    return "text-[#2563eb]";
  }

  return "text-[#14532d]";
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

function formatKr(value?: number) {
  return value === undefined
    ? "Mangler tall"
    : `${Math.round(value).toLocaleString("nb-NO")} kr`;
}
