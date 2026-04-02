'use client'

import { useState } from "react";
import type { OccupationWorkforceTimeSeriesPoint } from "@/lib/ssb";

const seriesDefinitions = [
  { key: "employeesAll", label: "Begge kjønn", color: "#14532d" },
  { key: "employeesWomen", label: "Kvinner", color: "#b45309" },
  { key: "employeesMen", label: "Menn", color: "#1d4ed8" },
] as const;

const filterOptions = [
  { key: "employeesAll", label: "Begge kjønn" },
  { key: "employeesWomen", label: "Kvinner" },
  { key: "employeesMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

type OccupationWorkforceTimeSeriesChartProps = {
  points: OccupationWorkforceTimeSeriesPoint[];
};

export function OccupationWorkforceTimeSeriesChart({
  points,
}: OccupationWorkforceTimeSeriesChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("employeesAll");
  const relevantPoints = points.filter(
    (point) =>
      point.employeesAll !== undefined ||
      point.employeesWomen !== undefined ||
      point.employeesMen !== undefined,
  );

  if (relevantPoints.length === 0) {
    return null;
  }

  const activeSeries = seriesDefinitions.filter((series) => {
    return activeFilter === series.key;
  });

  const values = relevantPoints.flatMap((point) =>
    activeSeries.flatMap((series) => {
      const value = point[series.key];
      return value !== undefined ? [value] : [];
    }),
  );

  if (values.length === 0) {
    return null;
  }

  const chartWidth = 960;
  const chartHeight = 320;
  const paddingLeft = 64;
  const paddingRight = 20;
  const paddingTop = 18;
  const paddingBottom = 52;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const chartMin = Math.floor(Math.min(...values) * 0.98);
  const chartMax = Math.ceil(Math.max(...values) * 1.02);
  const chartRange = Math.max(chartMax - chartMin, 1);
  const xStep = relevantPoints.length > 1 ? plotWidth / (relevantPoints.length - 1) : 0;
  const labelStride = relevantPoints.length > 12 ? Math.ceil(relevantPoints.length / 8) : 1;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });

  return (
    <div className="mt-6 space-y-4">
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

      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
        {activeSeries.map((series) => (
          <div key={series.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: series.color }}
            />
            <span>{series.label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto pb-2">
        <svg
          aria-label="Linjediagram for lønnstakere over tid"
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
                  {formatWorkforceCount(Math.round(tickValue))}
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

          {activeSeries.map((series) => {
            const chartPoints = relevantPoints.flatMap((point, index) => {
              const value = point[series.key];

              if (value === undefined) {
                return [];
              }

              const x = paddingLeft + xStep * index;
              const y = paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight;

              return [{
                x,
                y,
                value,
                periodCode: point.periodCode,
                periodLabel: point.periodLabel,
              }];
            });

            if (chartPoints.length === 0) {
              return null;
            }

            const path = chartPoints
              .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
              .join(" ");

            return (
              <g key={series.key}>
                <path
                  d={path}
                  fill="none"
                  stroke={series.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />

                {chartPoints.map((point) => (
                  <g key={`${series.key}-${point.periodCode}`}>
                    <circle cx={point.x} cy={point.y} fill={series.color} r="4" />
                    <title>
                      {`${series.label}, ${formatQuarterCodeLabel(point.periodLabel)}: ${formatWorkforceCount(point.value)}`}
                    </title>
                  </g>
                ))}
              </g>
            );
          })}

          {relevantPoints.map((point, index) => {
            if (index % labelStride !== 0 && index !== relevantPoints.length - 1) {
              return null;
            }

            const x = paddingLeft + xStep * index;

            return (
              <text
                key={`label-${point.periodCode}`}
                fill="#5f6773"
                fontSize="12"
                textAnchor={
                  index === 0 ? "start" : index === relevantPoints.length - 1 ? "end" : "middle"
                }
                x={x}
                y={chartHeight - 18}
              >
                {formatQuarterCodeLabel(point.periodCode)}
              </text>
            );
          })}
        </svg>
      </div>

      <p className="text-xs leading-5 text-[var(--muted)]">
        Viser alle tilgjengelige kvartaler fra SSB tabell 11658.
      </p>
    </div>
  );
}

function formatWorkforceCount(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })}`;
}

function formatQuarterCodeLabel(value: string) {
  const match = value.match(/(\d{4})\s*K([1-4])/i) ?? value.match(/(\d{4})K([1-4])/i);

  if (!match) {
    return value;
  }

  return `${match[2]}.kv.${match[1]}`;
}
