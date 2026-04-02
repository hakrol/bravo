'use client'

import { useState } from "react";
import type { OccupationAgeTimeSeriesPoint } from "@/lib/ssb";

const ageFormatter = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const seriesDefinitions = [
  { key: "averageAll", label: "Begge kjonn", color: "#14532d" },
  { key: "averageWomen", label: "Kvinner", color: "#b45309" },
  { key: "averageMen", label: "Menn", color: "#1d4ed8" },
] as const;

const filterOptions = [
  { key: "averageAll", label: "Begge kjonn" },
  { key: "averageWomen", label: "Kvinner" },
  { key: "averageMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

type OccupationAgeTimeSeriesChartProps = {
  occupationLabel: string;
  points: OccupationAgeTimeSeriesPoint[];
};

export function OccupationAgeTimeSeriesChart({
  occupationLabel,
  points,
}: OccupationAgeTimeSeriesChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("averageAll");

  if (points.length === 0) {
    return null;
  }

  const activeSeries = seriesDefinitions.filter((series) => {
    return activeFilter === series.key;
  });

  const availableValues = points.flatMap((point) => {
    return activeSeries.flatMap((series) => {
      const value = point[series.key];
      return value !== undefined ? [value] : [];
    });
  });

  if (availableValues.length === 0) {
    return null;
  }

  const minValue = Math.min(...availableValues);
  const maxValue = Math.max(...availableValues);
  const chartMin = Math.floor((minValue - 0.5) * 2) / 2;
  const chartMax = Math.ceil((maxValue + 0.5) * 2) / 2;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const chartWidth = 920;
  const chartHeight = 320;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 48;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const labelStride = points.length > 8 ? Math.ceil(points.length / 6) : 1;

  return (
    <section className="rounded-md border border-black/10 bg-[#fcfaf6] p-5">
      <div className="flex flex-col gap-3 border-b border-black/8 pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Gjennomsnittsalder over tid
          </h3>
          <p className="text-sm leading-6 text-[var(--muted)]">
            Kvartalsvis utvikling i gjennomsnittsalder for {occupationLabel.toLowerCase()}.
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
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
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

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label={`Tidsserie for gjennomsnittsalder i ${occupationLabel}`}
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
                  {ageFormatter.format(tickValue)} ar
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
            const chartPoints = points.flatMap((point, index) => {
              const value = point[definition.key as SeriesKey];

              if (value === undefined) {
                return [];
              }

              const x = paddingLeft + xStep * index;
              const y = paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight;

              return [{ x, y, value, periodCode: point.periodCode, periodLabel: point.periodLabel }];
            });

            if (chartPoints.length === 0) {
              return null;
            }

            const path = chartPoints
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
                {chartPoints.map((point) => (
                  <g key={`${definition.key}-${point.periodCode}`}>
                    <circle cx={point.x} cy={point.y} fill={definition.color} r="4" />
                    <title>
                      {`${definition.label}: ${formatAge(point.value)} (${formatPeriodLabel(point.periodLabel)})`}
                    </title>
                  </g>
                ))}
              </g>
            );
          })}

          {points.map((point, index) => {
            if (index % labelStride !== 0 && index !== points.length - 1) {
              return null;
            }

            const x = paddingLeft + xStep * index;

            return (
              <text
                key={point.periodCode}
                fill="#5f6773"
                fontSize="12"
                textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
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
  );
}

function formatAge(value: number) {
  return `${ageFormatter.format(value)} ar`;
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
