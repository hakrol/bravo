import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grafverksted",
  description: "Internt verksted for grafprototyper.",
};

type SalaryDistributionRow = {
  label: "Kvinner" | "Menn";
  p25: number;
  median: number;
  p75: number;
  bandColor: string;
  medianColor: string;
  labelColor: string;
};

const axisMin = 45000;
const axisMax = 82000;
const axisTicks = [50000, 60000, 70000, 80000] as const;

const salaryDistributionRows: SalaryDistributionRow[] = [
  {
    label: "Kvinner",
    p25: 48780,
    median: 54430,
    p75: 63380,
    bandColor: "#f6dfa6",
    medianColor: "#9a5b00",
    labelColor: "#7a5c00",
  },
  {
    label: "Menn",
    p25: 52200,
    median: 62690,
    p75: 79650,
    bandColor: "#a7e3c3",
    medianColor: "#047857",
    labelColor: "#0f766e",
  },
];

export default function DevGraferPage() {
  return (
    <div className="min-h-screen bg-[#f7f8f5] px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div>
          <Link
            href="/dev"
            className="text-sm font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)]"
          >
            Tilbake til dev
          </Link>
        </div>

        <section className="border-y border-slate-200 bg-white px-6 py-10 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Grafverksted
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 text-balance sm:text-5xl">
            Lønnsfordelingsgraf for yrkesdetaljer
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Prototype for en redaksjonell fordeling med P25, median og P75 for kvinner og menn.
          </p>
        </section>

        <SalaryDistributionPrototype />
      </div>
    </div>
  );
}

function SalaryDistributionPrototype() {
  const women = salaryDistributionRows[0];
  const men = salaryDistributionRows[1];
  const medianGap = men.median - women.median;
  const womenMedianPosition = getPosition(women.median);
  const menMedianPosition = getPosition(men.median);

  return (
    <figure className="mx-0 max-w-[930px] border-y border-[rgba(27,36,48,0.16)] bg-white px-0 py-7">
      <div>
        <p className="mb-2 text-[0.7rem] font-extrabold uppercase leading-tight tracking-[0.13em] text-[var(--primary-strong)]">
          Grafikk
        </p>
        <h2 className="max-w-[26ch] text-[1.75rem] font-semibold leading-[1.08] text-[#111827]">
          Menn har høyere medianlønn og større lønnsspenn
        </h2>
        <p className="mt-3 max-w-[66ch] text-base leading-7 text-[#374151]">
          Medianen for menn ligger {formatCurrency(medianGap)} høyere enn for kvinner. Båndet
          viser den midterste halvdelen av lønningene i yrket.
        </p>
      </div>

      <div className="mt-8 hidden grid-cols-[minmax(7rem,8.5rem)_minmax(0,1fr)] gap-5 text-[0.72rem] font-medium tabular-nums text-[#6b7280] md:grid">
        <span>kr/mnd</span>
        <div className="relative h-5">
          {axisTicks.map((tick) => (
            <span
              key={tick}
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${getPosition(tick)}%` }}
            >
              {formatCompactCurrency(tick)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 grid gap-8">
        <DistributionRowGraph row={women} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(7rem,8.5rem)_minmax(0,1fr)] md:gap-5">
          <span className="hidden md:block" />
          <div className="relative hidden h-5 md:block">
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-px -translate-y-1/2 bg-[#14532d]"
              style={rangeStyle(womenMedianPosition, menMedianPosition)}
            />
            <span
              className="absolute top-1/2 -translate-y-[calc(100%+6px)] whitespace-nowrap rounded-sm bg-white px-1 text-[0.72rem] font-semibold tabular-nums text-[#14532d]"
              style={{ left: `${menMedianPosition}%`, transform: "translate(-100%, calc(-100% - 6px))" }}
            >
              +{formatCurrency(medianGap)} for menn
            </span>
          </div>
        </div>
        <DistributionRowGraph row={men} />
      </div>

      <figcaption className="mt-8 grid gap-1 border-t border-[rgba(27,36,48,0.08)] pt-3 text-xs leading-5 text-[#6b7280]">
        <span>Kilde: Prototype med SSB-lignende eksempeldata for Lønnsinnsikt.</span>
        <span>P25 betyr at 25 prosent tjener mindre. P75 betyr at 25 prosent tjener mer.</span>
      </figcaption>
    </figure>
  );
}

function DistributionRowGraph({ row }: { row: SalaryDistributionRow }) {
  const p25 = getPosition(row.p25);
  const median = getPosition(row.median);
  const p75 = getPosition(row.p75);
  const spread = row.p75 - row.p25;

  return (
    <article className="grid gap-3 md:grid-cols-[minmax(7rem,8.5rem)_minmax(0,1fr)] md:items-center md:gap-5">
      <div className="min-w-0">
        <h3
          className="text-[0.8rem] font-semibold uppercase leading-tight tracking-[0.12em]"
          style={{ color: row.labelColor }}
        >
          {row.label}
        </h3>
        <p className="mt-2 text-xs font-medium leading-5 tabular-nums text-[#6b7280]">
          Spenn P25-P75: {formatCurrency(spread)}
        </p>
      </div>

      <div
        className="relative h-[92px]"
        aria-label={`${row.label}: P25 ${formatCurrency(row.p25)}, median ${formatCurrency(row.median)}, P75 ${formatCurrency(row.p75)}`}
      >
        {axisTicks.map((tick) => (
          <span
            key={tick}
            aria-hidden="true"
            className="absolute inset-y-0 hidden w-px bg-[#e5e7eb] md:block"
            style={{ left: `${getPosition(tick)}%` }}
          />
        ))}

        <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-px bg-[#e5e7eb]" />
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full"
          style={{ ...rangeStyle(p25, p75), backgroundColor: row.bandColor }}
        />

        <Endpoint label="25 % tjener mindre" position={p25} value={row.p25} />
        <Endpoint label="25 % tjener mer" position={p75} value={row.p75} />
        <MedianMarker color={row.medianColor} position={median} value={row.median} />
      </div>
    </article>
  );
}

function Endpoint({ label, position, value }: { label: string; position: number; value: number }) {
  return (
    <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${position}%` }}>
      <span className="block h-2.5 w-2.5 rounded-full bg-[#334155]" />
      <span className="absolute left-1/2 top-[-31px] hidden -translate-x-1/2 whitespace-nowrap text-center text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#64748b] md:block">
        {label}
      </span>
      <span className="absolute left-1/2 top-[19px] -translate-x-1/2 whitespace-nowrap text-center text-sm font-medium tabular-nums text-[#111827]">
        {formatCurrency(value)}
      </span>
    </span>
  );
}

function MedianMarker({ color, position, value }: { color: string; position: number; value: number }) {
  return (
    <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${position}%` }}>
      <span
        className="block h-3.5 w-3.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(17,24,39,0.08)]"
        style={{ backgroundColor: color }}
      />
      <span
        className="absolute left-1/2 top-[-33px] hidden -translate-x-1/2 whitespace-nowrap text-center text-[0.68rem] font-bold uppercase tracking-[0.12em] md:block"
        style={{ color }}
      >
        Median
      </span>
      <span
        className="absolute left-1/2 top-[21px] -translate-x-1/2 whitespace-nowrap text-center text-[0.95rem] font-semibold tabular-nums"
        style={{ color }}
      >
        {formatCurrency(value)}
      </span>
    </span>
  );
}

function getPosition(value: number) {
  return ((value - axisMin) / (axisMax - axisMin)) * 100;
}

function rangeStyle(left: number, right: number): CSSProperties {
  const safeLeft = Math.min(left, right);
  const safeRight = Math.max(left, right);

  return {
    left: `${safeLeft}%`,
    width: `${Math.max(safeRight - safeLeft, 1)}%`,
  };
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

function formatCompactCurrency(value: number) {
  return `${Math.round(value / 1000).toLocaleString("nb-NO")}k`;
}
