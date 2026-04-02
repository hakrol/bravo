'use client'

import { useState } from "react";
import type { OccupationSalaryTimeSeries } from "@/lib/ssb";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const seriesDefinitions = [
  { key: "valueAll", label: "Begge kjonn", color: "#14532d" },
  { key: "valueWomen", label: "Kvinner", color: "#b45309" },
  { key: "valueMen", label: "Menn", color: "#1d4ed8" },
] as const;

const filterOptions = [
  { key: "valueAll", label: "Begge kjonn" },
  { key: "valueWomen", label: "Kvinner" },
  { key: "valueMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

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

  const activeSeries = seriesDefinitions.filter((definition) => {
    return activeFilter === definition.key;
  });

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
  const paddingRight = 24;
  const paddingTop = 16;
  const paddingBottom = 48;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = series.points.length > 1 ? plotWidth / (series.points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const labelStride = series.points.length > 8 ? Math.ceil(series.points.length / 6) : 1;

  return (
    <section className="grid gap-6">
      <section className="rounded-md border bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 border-b pb-4">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
              {title ?? series.measureLabel}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {description ?? "Kvartalsvis utvikling for samme lønnsmal gjennom hele tilgjengelige tidsserien."}
            </p>
          </div>

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

                return [{ x, y, label: point.periodLabel, value }];
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
                    <g key={`${definition.key}-${point.label}`}>
                      <circle cx={point.x} cy={point.y} fill={definition.color} r="4" />
                      <title>
                        {`${definition.label}: ${formatCurrency(point.value)} (${formatPeriodLabel(point.label)})`}
                      </title>
                    </g>
                  ))}
                </g>
              );
            })}

            {series.points.map((point, index) => {
              if (index % labelStride !== 0 && index !== series.points.length - 1) {
                return null;
              }

              const x = paddingLeft + xStep * index;

              return (
                <text
                  key={point.periodCode}
                  fill="#5f6773"
                  fontSize="12"
                  textAnchor={
                    index === 0 ? "start" : index === series.points.length - 1 ? "end" : "middle"
                  }
                  x={x}
                  y={chartHeight - 18}
                >
                  {formatShortPeriodLabel(point.periodLabel)}
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

function formatShortPeriodLabel(value: string) {
  const match = value.match(/(\d{4})\s*K([1-4])/i) ?? value.match(/(\d{4})K([1-4])/i);

  if (!match) {
    return value;
  }

  return `${match[2]}.kv.${match[1]}`;
}

function formatPeriodLabel(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
