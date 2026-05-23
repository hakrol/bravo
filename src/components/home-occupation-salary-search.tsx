"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import type { OccupationSalaryRow } from "@/components/occupation-salary-overview";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";
import { getOccupationGroupByCode, listOccupationGroups } from "@/lib/occupation-groups";
import type { OccupationSalaryTimeSeries } from "@/lib/types";

type HomeOccupationSalarySearchProps = {
  allOccupationsSalarySeries: OccupationSalaryTimeSeries;
  rows: OccupationSalaryRow[];
  lastUpdated?: string;
  periodLabel?: string;
};

type HomeOccupationGroupFilter = {
  code: string;
  shortLabel: string;
};

const homeOccupationGroups: HomeOccupationGroupFilter[] = [
  ...listOccupationGroups().map((group) => ({ code: group.code, shortLabel: group.shortLabel })),
  { code: "3", shortLabel: "Høgskoleyrker" },
];

const preferredOccupationMatchers = [
  ["politikere", "politiker"],
  ["elektrikere"],
  ["flygere", "flyger"],
  ["legespesialister"],
  ["programvareutviklere", "utviklere"],
  ["dommere"],
];

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export function HomeOccupationSalarySearch({
  allOccupationsSalarySeries,
  periodLabel,
  rows,
}: HomeOccupationSalarySearchProps) {
  const [query, setQuery] = useState("");
  const [activeGroupCode, setActiveGroupCode] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery.trim());
  const availableGroupCodes = new Set(
    rows.map((row) => getTopGroupCode(row.occupationCode)).filter(Boolean),
  );
  const availableGroups = homeOccupationGroups.filter((group) => availableGroupCodes.has(group.code));

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesGroup = !activeGroupCode || activeGroupCode === getTopGroupCode(row.occupationCode);

        if (!matchesGroup) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const occupationLabel = normalizeText(row.occupationLabel);
        const occupationCode = normalizeText(row.occupationCode);
        return occupationLabel.includes(normalizedQuery) || occupationCode.includes(normalizedQuery);
      }),
    [activeGroupCode, normalizedQuery, rows],
  );

  const hasActiveFilter = normalizedQuery.length > 0 || activeGroupCode.length > 0;
  const highlightedRows = hasActiveFilter
    ? sortRowsForDisplay(filteredRows, normalizedQuery).slice(0, 6)
    : getPreferredOccupationRows(rows);
  const activeGroupLabel =
    getOccupationGroupByCode(activeGroupCode)?.shortLabel ??
    homeOccupationGroups.find((group) => group.code === activeGroupCode)?.shortLabel;

  return (
    <>
    <section className="fade-up relative isolate overflow-hidden px-0 pt-8 pb-10 sm:pt-10 lg:pt-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(20,83,45,0.11),transparent_42%),linear-gradient(180deg,#fbfbf8_0%,#fafafa_72%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <span className="absolute left-[8%] top-[9%] h-2.5 w-2.5 rounded-full bg-[#dce8df]" />
        <span className="absolute left-[24%] top-[2%] h-3 w-3 rounded-full bg-[#edf4ef]" />
        <span className="absolute right-[17%] top-[5%] h-2 w-2 rounded-full bg-[#d6e4d9]" />
        <span className="absolute right-[11%] top-[23%] h-2.5 w-2.5 rounded-full bg-[#dce8df]" />
        <span className="absolute left-[18%] top-[24%] h-2 w-2 rounded-full bg-[#eef5ef]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-1 text-center">
        <h1 className="max-w-4xl text-5xl font-semibold leading-none text-slate-950 sm:text-6xl lg:text-7xl">
          Hva tjener folk
          <span className="mt-1 block text-[var(--primary)]">i ditt yrke</span>
        </h1>

        <div className="mt-8 w-full max-w-3xl" id="yrke-sok">
          <label className="grid" htmlFor="occupation-search">
            <span className="sr-only">Søk etter yrke</span>
            <span className="relative block">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--primary-strong)]" />
              <input
                id="occupation-search"
                className="h-14 w-full rounded-md border border-black/10 bg-white/88 px-5 pl-12 text-base text-slate-900 shadow-[0_14px_36px_rgba(22,61,38,0.08)] outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[rgba(20,83,45,0.1)]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Skriv f.eks. regnskapsfører"
                type="search"
                value={query}
              />
            </span>
          </label>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Oversikten filtreres fortløpende mens du skriver.
          </p>
        </div>

        {availableGroups.length > 0 ? (
          <div className="mt-5 w-full max-w-sm">
            <label className="grid gap-2" htmlFor="occupation-group-filter">
              <span className="text-sm font-semibold text-[var(--primary-strong)]">
                Velg yrkesgruppe
              </span>
              <select
                id="occupation-group-filter"
                className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm font-medium text-slate-900 shadow-[0_8px_22px_rgba(27,36,48,0.06)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(20,83,45,0.1)]"
                onChange={(event) => setActiveGroupCode(event.target.value)}
                value={activeGroupCode}
              >
                <option value="">Alle yrkesgrupper</option>
                {availableGroups.map((group) => (
                  <option key={group.code} value={group.code}>
                    {group.shortLabel}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>

      <div className="mx-auto mt-9 w-full max-w-7xl px-1">
        <div className="mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-950">
                {buildTitle(query.trim(), activeGroupLabel)}
              </h2>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Se median samlet månedslønn før skatt.
            </p>
          </div>
        </div>

        {highlightedRows.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {highlightedRows.map((row) => (
              <OccupationHighlightCard key={row.rowKey} row={row} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-black/8 bg-white/86 px-5 py-8 text-sm text-[var(--muted)] shadow-[0_12px_34px_rgba(27,36,48,0.05)]">
            Ingen yrker matcher søket ditt akkurat nå.
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md border border-black/10 bg-white px-5 text-sm font-semibold text-[var(--primary-strong)] shadow-[0_10px_24px_rgba(27,36,48,0.06)] transition hover:border-[var(--primary)]/30 hover:bg-[#f7fbf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            href="/yrker"
          >
            Se alle yrker
            <span aria-hidden="true" className="ml-3 text-base">
              &gt;
            </span>
          </Link>
        </div>
      </div>
    </section>
    <SalaryDevelopmentSection periodLabel={periodLabel} series={allOccupationsSalarySeries} />
    </>
  );
}

function OccupationHighlightCard({ row }: { row: OccupationSalaryRow }) {
  const detailHref = getOccupationDetailHref(row.occupationCode, row.occupationLabel);
  const content = (
    <article className="min-h-32 rounded-md border border-black/8 bg-white/90 p-5 shadow-[0_16px_36px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/25 hover:shadow-[0_20px_44px_rgba(27,36,48,0.1)]">
      <div className="min-w-0">
        <h3 className="flex items-center gap-2 text-base font-semibold leading-snug text-slate-950">
          <span className="truncate">{row.occupationLabel}</span>
          {detailHref ? (
            <span aria-hidden="true" className="shrink-0 text-[var(--primary-strong)]">
              &gt;
            </span>
          ) : null}
        </h3>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <dt className="text-[var(--muted)]">Kvinner</dt>
            <dd className="font-semibold tabular-nums text-slate-950">{formatSalary(row.medianWomen)}</dd>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <dt className="text-[var(--muted)]">Menn</dt>
            <dd className="font-semibold tabular-nums text-slate-950">{formatSalary(row.medianMen)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );

  if (!detailHref) {
    return content;
  }

  return (
    <Link
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      href={detailHref}
    >
      {content}
    </Link>
  );
}

function SalaryDevelopmentSection({
  periodLabel,
  series,
}: {
  periodLabel?: string;
  series: OccupationSalaryTimeSeries;
}) {
  const chartPoints = series.points.filter(
    (point): point is typeof point & { valueAll: number } => point.valueAll !== undefined,
  );

  if (chartPoints.length === 0) {
    return null;
  }

  const firstPoint = chartPoints[0];
  const latestPoint = chartPoints.at(-1);
  const minSalary = Math.min(...chartPoints.map((point) => point.valueAll), 0);
  const maxSalary = Math.max(...chartPoints.map((point) => point.valueAll), 1);
  const salaryRange = Math.max(maxSalary - minSalary, 1);
  const chartWidth = 1040;
  const chartHeight = 440;
  const chartPadding = { top: 34, right: 52, bottom: 58, left: 76 };
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right;
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const polylinePoints = chartPoints
    .map((point, index) => {
      const x =
        chartPadding.left +
        (chartPoints.length <= 1 ? 0 : (index / (chartPoints.length - 1)) * innerWidth);
      const y =
        chartPadding.top +
        innerHeight -
        ((point.valueAll - minSalary) / salaryRange) * innerHeight;

      return `${x},${y}`;
    })
    .join(" ");
  const firstSalary = firstPoint?.valueAll;
  const latestSalary = latestPoint?.valueAll;
  const totalChange =
    firstSalary === undefined || latestSalary === undefined ? undefined : latestSalary - firstSalary;
  const totalChangePercent =
    firstSalary === undefined || firstSalary === 0 || latestSalary === undefined
      ? undefined
      : ((latestSalary - firstSalary) / firstSalary) * 100;
  const periodText = periodLabel ? `Siste periode: ${formatPeriodLabel(periodLabel)}` : "Siste tilgjengelige periode";
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const value = minSalary + salaryRange * ratio;
    const y = chartPadding.top + innerHeight - ratio * innerHeight;

    return { value, y };
  });

  return (
    <section className="min-h-screen border-t border-black/8 bg-white px-1 py-12 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
            {periodText}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            Lønnsutvikling for alle yrker
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Diagrammet viser avtalt månedslønn for “Alle yrker” som samlet gruppe.
            Linjen følger totalnivået over tid, ikke enkeltyrker.
          </p>
          </div>

          <div className="grid min-w-56 gap-2 rounded-md border border-black/8 bg-[#fbfbf8] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Siste nivå
            </p>
            <p className="text-3xl font-semibold tabular-nums text-slate-950">
              {formatSalary(latestSalary)}
            </p>
            <p className="text-sm tabular-nums text-[var(--muted)]">
              {formatDelta(totalChange)} siden {firstPoint?.periodLabel ?? "start"}
              {totalChangePercent !== undefined ? ` (${formatPercentChange(totalChangePercent)})` : ""}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-black/8 bg-[#fbfbf8] p-4 shadow-[0_18px_50px_rgba(27,36,48,0.06)] sm:p-6">
          <svg
            aria-label="Linjediagram som viser avtalt månedslønn for alle yrker over tid"
            className="block min-w-[760px]"
            role="img"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <rect fill="#fbfbf8" height={chartHeight} width={chartWidth} />
            {yAxisTicks.map((tick) => (
              <g key={tick.value}>
                <line
                  stroke="rgba(27,36,48,0.08)"
                  x1={chartPadding.left}
                  x2={chartWidth - chartPadding.right}
                  y1={tick.y}
                  y2={tick.y}
                />
                <text
                  fill="#64748b"
                  fontSize="13"
                  fontWeight="650"
                  textAnchor="end"
                  x={chartPadding.left - 14}
                  y={tick.y + 4}
                >
                  {formatCompactSalary(tick.value)}
                </text>
              </g>
            ))}

            <polyline
              fill="none"
              points={polylinePoints}
              stroke="var(--primary-strong)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            />

            {chartPoints.map((point, index) => {
              const x =
                chartPadding.left +
                (chartPoints.length <= 1 ? 0 : (index / (chartPoints.length - 1)) * innerWidth);
              const y =
                chartPadding.top +
                innerHeight -
                ((point.valueAll - minSalary) / salaryRange) * innerHeight;
              const showLabel =
                index === 0 ||
                index === chartPoints.length - 1 ||
                point.periodLabel.endsWith("K4");

              return (
                <g key={point.periodCode}>
                  <circle cx={x} cy={y} fill="#fbfbf8" r="6" stroke="var(--primary-strong)" strokeWidth="3" />
                  {showLabel ? (
                    <text
                      fill="#334155"
                      fontSize="13"
                      fontWeight="650"
                      textAnchor="middle"
                      x={x}
                      y={chartHeight - 22}
                    >
                      {formatShortPeriodLabel(point.periodLabel)}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {latestPoint ? (
              <g>
                <text
                  fill="#0f172a"
                  fontSize="15"
                  fontWeight="760"
                  textAnchor="end"
                  x={chartWidth - chartPadding.right}
                  y={chartPadding.top - 10}
                >
                  {formatSalary(latestPoint.valueAll)}
                </text>
              </g>
            ) : null}
          </svg>
        </div>
      </div>
    </section>
  );
}

function getPreferredOccupationRows(rows: OccupationSalaryRow[]) {
  const selectedRows: OccupationSalaryRow[] = [];
  const selectedCodes = new Set<string>();

  for (const matchers of preferredOccupationMatchers) {
    const row = rows.find((candidate) => {
      const normalizedLabel = normalizeText(candidate.occupationLabel);
      return (
        !selectedCodes.has(candidate.occupationCode) &&
        matchers.some((matcher) => normalizedLabel.includes(normalizeText(matcher)))
      );
    });

    if (row) {
      selectedRows.push(row);
      selectedCodes.add(row.occupationCode);
    }
  }

  if (selectedRows.length >= 6) {
    return selectedRows.slice(0, 6);
  }

  const fallbackRows = sortRowsForDisplay(rows, "")
    .filter((row) => !selectedCodes.has(row.occupationCode))
    .slice(0, 6 - selectedRows.length);

  return [...selectedRows, ...fallbackRows];
}

function sortRowsForDisplay(rows: OccupationSalaryRow[], normalizedQuery: string) {
  return [...rows].sort((left, right) => {
    if (normalizedQuery) {
      const leftLabel = normalizeText(left.occupationLabel);
      const rightLabel = normalizeText(right.occupationLabel);
      const leftStartsWith = leftLabel.startsWith(normalizedQuery);
      const rightStartsWith = rightLabel.startsWith(normalizedQuery);

      if (leftStartsWith !== rightStartsWith) {
        return leftStartsWith ? -1 : 1;
      }
    }

    return (right.medianMen ?? right.medianAll ?? -1) - (left.medianMen ?? left.medianAll ?? -1);
  });
}

function buildTitle(query: string, activeGroupLabel?: string) {
  const hasQuery = query.length > 0;
  const hasGroup = Boolean(activeGroupLabel);

  if (hasQuery && hasGroup) {
    return `Treff for "${query}" i ${activeGroupLabel}`;
  }

  if (hasQuery) {
    return `Treff for "${query}"`;
  }

  if (hasGroup) {
    return `Yrker i ${activeGroupLabel}`;
  }

  return "Populære yrker";
}

function getTopGroupCode(occupationCode: string) {
  return occupationCode.charAt(0);
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}

function formatDelta(value?: number) {
  if (value === undefined) {
    return ":";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${currencyFormatter.format(value)} kr`;
}

function formatPercentChange(value?: number) {
  if (value === undefined) {
    return "";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} %`;
}

function formatCompactSalary(value: number) {
  return `${Math.round(value / 1000).toLocaleString("nb-NO")}k`;
}

function formatPeriodLabel(label?: string) {
  if (!label) {
    return undefined;
  }

  const quarterMatch = label.match(/^(\d{4})K([1-4])$/);

  if (quarterMatch) {
    const [, year, quarter] = quarterMatch;
    return `${quarter}. kvartal ${year}`;
  }

  return label;
}

function formatShortPeriodLabel(label: string) {
  const quarterMatch = label.match(/^(\d{4})K([1-4])$/);

  if (!quarterMatch) {
    return label;
  }

  const [, year, quarter] = quarterMatch;
  return quarter === "4" ? year : `K${quarter} ${year}`;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m20 20-4.5-4.5m2-5A7 7 0 1 1 3.5 10.5a7 7 0 0 1 14 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
