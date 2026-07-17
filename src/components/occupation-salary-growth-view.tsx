"use client";

import { useMemo, useState } from "react";
import type {
  OccupationSalaryGrowthChartPoint,
  OccupationSalaryGrowthRow,
} from "@/lib/occupation-salary-growth";

type GenderKey = "All" | "Women" | "Men";
type ValueMode = "salary" | "inflationAdjusted";

type OccupationSalaryGrowthViewProps = {
  occupationLabel: string;
  latestYear?: number;
  measureLabel: string;
  rows: OccupationSalaryGrowthRow[];
  chartPoints: OccupationSalaryGrowthChartPoint[];
};

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});
const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const genderOptions: Array<{ key: GenderKey; label: string }> = [
  { key: "All", label: "Begge kjønn" },
  { key: "Women", label: "Kvinner" },
  { key: "Men", label: "Menn" },
];

const valueOptions: Array<{ key: ValueMode; label: string }> = [
  { key: "salary", label: "Lønn" },
  { key: "inflationAdjusted", label: "Lønn justert for inflasjon" },
];

export function OccupationSalaryGrowthView({
  occupationLabel,
  latestYear,
  measureLabel,
  rows,
  chartPoints,
}: OccupationSalaryGrowthViewProps) {
  return (
    <>
      <SalaryGrowthTable measureLabel={measureLabel} occupationLabel={occupationLabel} rows={rows} />
      <SalaryGrowthChart
        chartPoints={chartPoints}
        latestYear={latestYear}
        measureLabel={measureLabel}
        occupationLabel={occupationLabel}
      />
    </>
  );
}

function SalaryGrowthTable({
  occupationLabel,
  rows,
  measureLabel,
}: Pick<OccupationSalaryGrowthViewProps, "measureLabel" | "occupationLabel" | "rows">) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyTable() {
    const content = [
      ["År", "Lønn", "Lønnsvekst", "KPI", "Reallønnsvekst"],
      ...rows.map((row) => [
        String(row.year),
        String(Math.round(row.salary)),
        formatOptionalPlainPercent(row.salaryGrowth),
        formatOptionalPlainPercent(row.inflationGrowth),
        formatOptionalPlainPercent(row.realGrowth),
      ]),
    ]
      .map((row) => row.join("\t"))
      .join("\n");

    try {
      await navigator.clipboard.writeText(content);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section aria-labelledby="historisk-lonnsutvikling" className="mt-10">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl" id="historisk-lonnsutvikling">
            Historisk lønnsutvikling
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {measureLabel}. KPI viser prisveksten fra året før.
          </p>
        </div>
        <button
          className="text-sm font-semibold text-[var(--primary-strong)] underline decoration-emerald-900/25 underline-offset-4 transition hover:decoration-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
          onClick={copyTable}
          type="button"
        >
          {copyState === "copied"
            ? "Tabellen er kopiert"
            : copyState === "error"
              ? "Kunne ikke kopiere"
              : "Kopier hele tabellen"}
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-[5px] border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">Historisk lønnsvekst for {occupationLabel}</caption>
          <thead className="bg-slate-950 text-white">
            <tr>
              {[
                "År",
                "Lønn",
                "Lønnsvekst",
                "KPI",
                "Reallønnsvekst",
              ].map((heading) => (
                <th className="px-5 py-4 text-sm font-semibold" key={heading} scope="col">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="border-t border-slate-200 px-5 py-8 text-center text-slate-600" colSpan={5}>
                  SSB har foreløpig ikke publisert sammenlignbare historiske lønnstall for dette yrket.
                </td>
              </tr>
            ) : rows.map((row, index) => (
              <tr className={index % 2 === 0 ? "bg-white" : "bg-slate-50/80"} key={row.year}>
                <th className="border-t border-slate-200 px-5 py-4 font-semibold text-slate-950" scope="row">
                  {row.year}
                </th>
                <td className="border-t border-slate-200 px-5 py-4 tabular-nums text-slate-800">
                  {formatCurrency(row.salary)}
                </td>
                <td className="border-t border-slate-200 px-5 py-4 tabular-nums text-slate-800">
                  {formatOptionalPercent(row.salaryGrowth)}
                </td>
                <td className="border-t border-slate-200 px-5 py-4 tabular-nums text-slate-800">
                  {formatOptionalPercent(row.inflationGrowth)}
                </td>
                <td className={`border-t border-slate-200 px-5 py-4 font-semibold tabular-nums ${getGrowthColor(row.realGrowth)}`}>
                  {formatOptionalPercent(row.realGrowth)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SalaryGrowthChart({
  chartPoints,
  latestYear,
  measureLabel,
  occupationLabel,
}: Pick<OccupationSalaryGrowthViewProps, "chartPoints" | "latestYear" | "measureLabel" | "occupationLabel">) {
  const [gender, setGender] = useState<GenderKey>("All");
  const [valueMode, setValueMode] = useState<ValueMode>("salary");
  const valueKey = `${valueMode}${gender}` as keyof OccupationSalaryGrowthChartPoint;
  const points = useMemo(
    () => chartPoints.flatMap((point) => {
      const value = point[valueKey];
      return typeof value === "number" ? [{ year: point.year, value }] : [];
    }),
    [chartPoints, valueKey],
  );

  if (points.length === 0) {
    return (
      <section aria-labelledby="lonnsutvikling-diagram" className="mt-14 rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7">
        <h2 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl" id="lonnsutvikling-diagram">
          Lønnsutvikling i diagram
        </h2>
        <div className="mt-6 rounded-[5px] bg-slate-50 px-5 py-10 text-center text-slate-600">
          Diagrammet blir tilgjengelig når SSB har publisert historiske lønnstall for yrket.
        </div>
      </section>
    );
  }

  const chartWidth = 1000;
  const chartHeight = 380;
  const padding = { top: 24, right: 36, bottom: 48, left: 92 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const minValue = Math.min(...points.map((point) => point.value));
  const maxValue = Math.max(...points.map((point) => point.value));
  const step = getAxisStep(maxValue - minValue);
  const chartMin = Math.max(0, Math.floor((minValue - step) / step) * step);
  const chartMax = Math.ceil((maxValue + step) / step) * step;
  const range = Math.max(chartMax - chartMin, 1);
  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const polyline = points
    .map((point, index) => {
      const x = padding.left + index * xStep;
      const y = padding.top + plotHeight - ((point.value - chartMin) / range) * plotHeight;
      return `${x},${y}`;
    })
    .join(" ");
  const ticks = Array.from({ length: 5 }, (_, index) => chartMin + (range / 4) * index);

  return (
    <section aria-labelledby="lonnsutvikling-diagram" className="mt-14 rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl" id="lonnsutvikling-diagram">
          Lønnsutvikling i diagram
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Se {measureLabel.toLocaleLowerCase("nb-NO")} for {occupationLabel.toLocaleLowerCase("nb-NO")}.
          {latestYear ? ` Inflasjonsjustert lønn vises i ${latestYear}-kroner.` : ""}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterGroup label="Kjønn">
          {genderOptions.map((option) => {
            const optionValueKey = `${valueMode}${option.key}` as keyof OccupationSalaryGrowthChartPoint;
            const available = chartPoints.some((point) => typeof point[optionValueKey] === "number");

            return (
              <FilterButton
                active={gender === option.key}
                disabled={!available}
                key={option.key}
                onClick={() => setGender(option.key)}
              >
                {option.label}
              </FilterButton>
            );
          })}
        </FilterGroup>
        <FilterGroup label="Visning">
          {valueOptions.map((option) => (
            <FilterButton active={valueMode === option.key} key={option.key} onClick={() => setValueMode(option.key)}>
              {option.label}
            </FilterButton>
          ))}
        </FilterGroup>
      </div>

      <div className="mt-7 overflow-x-auto">
        <svg
          aria-label={`${valueMode === "salary" ? "Lønn" : "Inflasjonsjustert lønn"} for ${occupationLabel}, ${genderOptions.find((option) => option.key === gender)?.label.toLocaleLowerCase("nb-NO")}`}
          className="min-w-[720px] w-full"
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {ticks.map((tick) => {
            const y = padding.top + plotHeight - ((tick - chartMin) / range) * plotHeight;
            return (
              <g key={tick}>
                <line stroke="rgba(15,23,42,0.12)" strokeDasharray="4 6" x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} />
                <text fill="#475569" fontSize="13" textAnchor="end" x={padding.left - 12} y={y + 4}>
                  {formatAxisCurrency(tick)}
                </text>
              </g>
            );
          })}
          <polyline fill="none" points={polyline} stroke="#14532d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          {points.map((point, index) => {
            const x = padding.left + index * xStep;
            const y = padding.top + plotHeight - ((point.value - chartMin) / range) * plotHeight;
            return (
              <g key={point.year}>
                <circle cx={x} cy={y} fill="#14532d" r="4.5" />
                <title>{`${point.year}: ${formatCurrency(point.value)}`}</title>
                <text fill="#334155" fontSize="13" textAnchor="middle" x={x} y={chartHeight - 17}>
                  {point.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function FilterGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div aria-label={label} className="flex flex-wrap gap-2" role="group">
      {children}
    </div>
  );
}

function FilterButton({
  active,
  children,
  disabled = false,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      disabled={disabled}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : active
          ? "border-emerald-900 bg-emerald-900 text-white shadow-[0_10px_24px_rgba(6,78,59,0.16)]"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function getAxisStep(range: number) {
  if (range <= 5000) return 1000;
  if (range <= 15000) return 2500;
  if (range <= 30000) return 5000;
  return 10000;
}

function formatCurrency(value: number) {
  return `${currencyFormatter.format(Math.round(value))} kr`;
}

function formatAxisCurrency(value: number) {
  return currencyFormatter.format(Math.round(value));
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${percentFormatter.format(value)} %`;
}

function formatPlainPercent(value: number) {
  return `${percentFormatter.format(value)} %`;
}

function formatOptionalPercent(value: number | undefined) {
  return value === undefined ? "—" : formatPercent(value);
}

function formatOptionalPlainPercent(value: number | undefined) {
  return value === undefined ? "—" : formatPlainPercent(value);
}

function getGrowthColor(value: number | undefined) {
  if (value === undefined) return "text-slate-500";
  if (value > 0) return "text-emerald-700";
  if (value < 0) return "text-red-700";
  return "text-slate-800";
}
