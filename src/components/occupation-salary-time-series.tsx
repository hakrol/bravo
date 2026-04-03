'use client'

import { useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import type { OccupationSalaryTimeSeries } from "@/lib/ssb";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const seriesDefinitions = [
  { key: "valueAll", label: "Begge kjønn", color: "#14532d" },
  { key: "valueWomen", label: "Kvinner", color: "#b45309" },
  { key: "valueMen", label: "Menn", color: "#1d4ed8" },
] as const;

const filterOptions = [
  { key: "valueAll", label: "Begge kjønn" },
  { key: "valueWomen", label: "Kvinner" },
  { key: "valueMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

const endLabelOffsets: Record<SeriesKey, number> = {
  valueAll: -10,
  valueWomen: 0,
  valueMen: 10,
};

type OccupationSalaryTimeSeriesProps = {
  series: OccupationSalaryTimeSeries;
  title?: string;
  description?: string;
};

export function OccupationSalaryTimeSeriesChart({
  series,
  title,
  description,
}: OccupationSalaryTimeSeriesProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("valueAll");

  const activeSeries =
    activeFilter === "valueAll"
      ? seriesDefinitions.filter((definition) => definition.key !== "valueAll")
      : seriesDefinitions.filter((definition) => definition.key === activeFilter);

  const availableValues = series.points.flatMap((point) => {
    return activeSeries.flatMap((definition) => {
      const value = point[definition.key];
      return value !== undefined ? [value] : [];
    });
  });

  if (availableValues.length === 0) {
    return null;
  }

  const minValue = Math.min(...availableValues);
  const maxValue = Math.max(...availableValues);
  const chartMin = Math.floor(minValue / 1000) * 1000;
  const chartMax = Math.ceil(maxValue / 1000) * 1000;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const chartWidth = 920;
  const chartHeight = 360;
  const paddingLeft = 56;
  const paddingRight = 112;
  const paddingTop = 16;
  const paddingBottom = 48;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = series.points.length > 1 ? plotWidth / (series.points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const yearTicks = buildYearTicks(series.points);
  const latestValues = seriesDefinitions.filter((definition) => definition.key !== "valueAll").flatMap((definition) => {
    const latestPoint = getLatestSeriesPoint(series.points, definition.key);

    if (!latestPoint) {
      return [];
    }

    return [{
      key: definition.key,
      label: definition.label,
      periodLabel: latestPoint.periodLabel,
      value: latestPoint.value,
    }];
  });
  const latestPeriodLabel = latestValues[0]?.periodLabel;

  return (
    <section className="grid gap-6">
      <section className="rounded-md border bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
              Utvikling
            </p>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
              {title ?? `Utvikling i månedslønn for ${series.occupationLabel}`}
            </h3>
            <p className="text-sm text-[var(--muted)]">
              {description ??
                `${series.occupationLabel} lønnsutvikling per kvartal i Norge. Se median avtalt månedslønn for begge kjønn, kvinner og menn basert på tilgjengelige SSB-tall.`}
            </p>
          </div>

          {latestValues.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Siste data
                </p>
                <MetricInfoButton
                  description={`Her ser du siste registrerte månedslønn for kvinner og menn. Tallene gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og er hentet fra SSB tabell 11658.`}
                  label="Siste data"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {latestPeriodLabel ? (
                  <span className="rounded-md border border-black/10 bg-[#f7fafc] px-3 py-2 text-sm font-semibold text-slate-700">
                    {formatPeriodLabel(latestPeriodLabel)}
                  </span>
                ) : null}
                {latestValues.map((entry) => (
                  <div
                    key={`latest-${entry.key}`}
                    className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm leading-none text-slate-700"
                  >
                    <span className="text-[15px]">{entry.label}: </span>
                    <span className="text-[15px] font-semibold text-slate-950">{currencyFormatter.format(entry.value)} kr</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option.key === activeFilter;

              return (
                <button
                  key={option.key}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-black/10 bg-white text-slate-700 hover:border-[var(--primary)]/40"
                  }`}
                  onClick={() => setActiveFilter(option.key)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            {activeSeries.map((definition) => (
              <div key={definition.key} className="flex items-center gap-2 text-sm text-slate-700">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: definition.color }}
                />
                <span>{definition.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <svg
            aria-label={`Tidsserie for ${series.occupationLabel}`}
            className="min-w-[760px] w-full"
            role="img"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {tickValues.map((tickValue) => {
              const y = paddingTop + plotHeight - ((tickValue - chartMin) / chartRange) * plotHeight;

              return (
                <g key={tickValue}>
                  <line
                    stroke="rgba(27, 36, 48, 0.09)"
                    strokeDasharray="4 6"
                    strokeWidth="1"
                    x1={paddingLeft}
                    x2={chartWidth - paddingRight}
                    y1={y}
                    y2={y}
                  />
                  <text
                    fill="#5f6773"
                    fontSize="12"
                    textAnchor="end"
                    x={paddingLeft - 10}
                    y={y + 4}
                  >
                    {currencyFormatter.format(Math.round(tickValue))}
                  </text>
                </g>
              );
            })}

            <line
              stroke="rgba(27, 36, 48, 0.14)"
              strokeWidth="1"
              x1={paddingLeft}
              x2={chartWidth - paddingRight}
              y1={paddingTop + plotHeight}
              y2={paddingTop + plotHeight}
            />

            {activeSeries.map((definition) => {
              const points = series.points.flatMap((point, index) => {
                const value = point[definition.key as SeriesKey];

                if (value === undefined) {
                  return [];
                }

                const x = paddingLeft + xStep * index;
                const y = paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight;

                return [{ x, y, label: point.periodLabel, periodCode: point.periodCode, value }];
              });

              if (points.length === 0) {
                return null;
              }

              const path = points
                .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
                .join(" ");

              return (
                <g key={definition.key}>
                  <path
                    d={path}
                    fill="none"
                    stroke={definition.color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  {points.map((point) => (
                    <g key={`${definition.key}-${point.periodCode}`}>
                      <circle cx={point.x} cy={point.y} fill={definition.color} r="4" />
                      <title>
                        {`${definition.label}: ${formatCurrency(point.value)} (${formatPeriodLabel(point.label)})`}
                      </title>
                    </g>
                  ))}
                  {points.length > 0 ? (
                    <text
                      fill={definition.color}
                      fontSize="12"
                      fontWeight="600"
                      textAnchor="start"
                      x={points[points.length - 1].x + 8}
                      y={
                        points[points.length - 1].y +
                        4 +
                        (activeFilter === "valueAll" ? endLabelOffsets[definition.key] : 0)
                      }
                    >
                      {currencyFormatter.format(points[points.length - 1].value)}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {yearTicks.map((tick) => {
              const x = paddingLeft + xStep * tick.index;

              return (
                <text
                  key={`year-${tick.label}-${tick.index}`}
                  fill="#5f6773"
                  fontSize="12"
                  textAnchor={
                    tick.index === 0
                      ? "start"
                      : tick.index === series.points.length - 1
                        ? "end"
                        : "middle"
                  }
                  x={x}
                  y={chartHeight - 18}
                >
                  {tick.label}
                </text>
              );
            })}
          </svg>
        </div>
      </section>
    </section>
  );
}

function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)} kr`;
}

function formatPeriodLabel(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const compactQuarterMatch = normalized.match(/^(\d{4})K([1-4])$/i);
  const spacedQuarterMatch = normalized.match(/^(\d{4})\s*K([1-4])$/i);
  const longQuarterMatch = normalized.match(/^([1-4])\.\s*kvartal\s*(\d{4})$/i);

  if (compactQuarterMatch) {
    return `${compactQuarterMatch[2]}. kvartal ${compactQuarterMatch[1]}`;
  }

  if (spacedQuarterMatch) {
    return `${spacedQuarterMatch[2]}. kvartal ${spacedQuarterMatch[1]}`;
  }

  if (longQuarterMatch) {
    return `${longQuarterMatch[1]}. kvartal ${longQuarterMatch[2]}`;
  }

  return normalized;
}

function getLatestSeriesPoint(
  points: Array<{
    periodLabel: string;
    valueAll?: number;
    valueWomen?: number;
    valueMen?: number;
  }>,
  key: SeriesKey,
) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index];
    const value = point[key];

    if (value !== undefined) {
      return {
        periodLabel: point.periodLabel,
        value,
      };
    }
  }

  return null;
}

function buildYearTicks(points: Array<{ periodCode: string; periodLabel: string }>) {
  const seenYears = new Set<string>();

  return points.flatMap((point, index) => {
    const year = extractYear(point.periodCode) ?? extractYear(point.periodLabel);

    if (!year || seenYears.has(year)) {
      return [];
    }

    seenYears.add(year);
    return [{ index, label: year }];
  });
}

function extractYear(value: string) {
  const match = value.match(/(\d{4})/);
  return match ? match[1] : null;
}
