'use client'

import { useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import {
  formatCompactChartYear,
  useOccupationChartMobileLayout,
} from "@/components/occupation-chart-mobile";
import type { OccupationWorkforceTimeSeriesPoint } from "@/lib/ssb";

const seriesDefinitions = [
  { key: "employeesAll", label: "Begge kjønn", color: "#14532d" },
  { key: "employeesWomen", label: "Kvinner", color: "#ec1f74" },
  { key: "employeesMen", label: "Menn", color: "#2563eb" },
] as const;

const filterOptions = [
  { key: "employeesAll", label: "Begge kjønn" },
  { key: "employeesWomen", label: "Kvinner" },
  { key: "employeesMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

const endLabelOffsets: Record<SeriesKey, number> = {
  employeesAll: -10,
  employeesWomen: -2,
  employeesMen: 10,
};

type OccupationWorkforceTimeSeriesChartProps = {
  points: OccupationWorkforceTimeSeriesPoint[];
  description?: string;
};

export function OccupationWorkforceTimeSeriesChart({
  points,
  description,
}: OccupationWorkforceTimeSeriesChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("employeesAll");
  const useMobileChartLayout = useOccupationChartMobileLayout();
  const relevantPoints = points.filter(
    (point) =>
      point.employeesAll !== undefined ||
      point.employeesWomen !== undefined ||
      point.employeesMen !== undefined,
  );

  if (relevantPoints.length === 0) {
    return null;
  }

  const availableFilters = ({
    employeesAll: relevantPoints.some(
      (point) => point.employeesWomen !== undefined || point.employeesMen !== undefined,
    ),
    employeesWomen: relevantPoints.some((point) => point.employeesWomen !== undefined),
    employeesMen: relevantPoints.some((point) => point.employeesMen !== undefined),
  }) satisfies Record<FilterKey, boolean>;

  const resolvedFilter =
    availableFilters[activeFilter]
      ? activeFilter
      : filterOptions.find((option) => availableFilters[option.key])?.key ?? "employeesAll";

  const activeSeries =
    resolvedFilter === "employeesAll"
      ? seriesDefinitions.filter((series) => series.key !== "employeesAll")
      : seriesDefinitions.filter((series) => series.key === resolvedFilter);

  const values = relevantPoints.flatMap((point) =>
    activeSeries.flatMap((series) => {
      const value = point[series.key];
      return value !== undefined ? [value] : [];
    }),
  );

  if (values.length === 0) {
    return null;
  }

  const chartWidth = useMobileChartLayout ? 390 : 820;
  const chartHeight = useMobileChartLayout ? 360 : 300;
  const paddingLeft = useMobileChartLayout ? 54 : 52;
  const paddingRight = useMobileChartLayout ? 58 : 64;
  const paddingTop = useMobileChartLayout ? 20 : 18;
  const paddingBottom = useMobileChartLayout ? 48 : 42;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const chartMin = Math.floor(Math.min(...values) * 0.98);
  const chartMax = Math.ceil(Math.max(...values) * 1.02);
  const chartRange = Math.max(chartMax - chartMin, 1);
  const xStep = relevantPoints.length > 1 ? plotWidth / (relevantPoints.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const yearTicks = buildYearTicks(relevantPoints);
  const latestValues = seriesDefinitions
    .filter((series) => series.key !== "employeesAll")
    .flatMap((series) => {
      const latestPoint = getLatestSeriesPoint(relevantPoints, series.key);

      if (!latestPoint) {
        return [];
      }

      return [{
        key: series.key,
        label: series.label,
        periodLabel: latestPoint.periodLabel,
        value: latestPoint.value,
      }];
    });
  const latestPeriodLabel = latestValues[0]?.periodLabel;
  const latestOverallPoint = getLatestSeriesPoint(relevantPoints, "employeesAll");
  const latestTotal = latestOverallPoint?.value;

  return (
    <section className="bg-transparent">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-950">
          Lønnstakere over tid
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          {description ?? "Antall personer registrert som lønnstakere i midtmåneden i kvartalet."}
        </p>
      </div>

      {latestValues.length > 0 ? (
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Siste data
            </p>
            <MetricInfoButton
              description={`Her ser du siste registrerte antall lønnstakere for kvinner og menn. Tallene gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og er hentet fra SSB tabell 11658.`}
              label="Siste data"
              variant="muted"
            />
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:divide-x-0 sm:border-y-0">
            {latestPeriodLabel ? (
              <span className="flex flex-col px-2 py-3 sm:block sm:rounded-[5px] sm:border sm:border-slate-200 sm:bg-white sm:px-3 sm:py-2 sm:text-sm sm:font-semibold sm:text-slate-800 sm:shadow-sm">
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 sm:hidden">
                  Periode
                </span>
                <strong className="mt-1 text-sm font-semibold text-slate-950 sm:mt-0 sm:text-inherit">
                  {formatPeriodLabel(latestPeriodLabel)}
                </strong>
              </span>
            ) : null}
            {latestValues.map((entry) => (
              <div
                key={`latest-${entry.key}`}
                className="min-w-0 px-2 py-3 text-xs leading-5 text-slate-600 sm:rounded-[5px] sm:border sm:border-slate-200 sm:bg-white sm:px-3 sm:py-2 sm:text-sm sm:leading-none sm:text-slate-700 sm:shadow-sm"
              >
                <span className="block truncate sm:inline sm:text-[15px]">{entry.label}<span className="hidden sm:inline">: </span></span>
                <span className="block whitespace-nowrap text-[13px] font-semibold text-slate-950 sm:inline sm:text-[15px]">
                  {formatLatestWorkforceValue(entry.value, latestTotal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[6px] border border-slate-200 sm:flex sm:flex-wrap sm:gap-2 sm:overflow-visible sm:border-0">
        {filterOptions.map((option) => {
          const isActive = option.key === resolvedFilter;
          const isAvailable = availableFilters[option.key];

          return (
            <button
              key={option.key}
              disabled={!isAvailable}
              className={`min-w-0 border-0 border-r border-slate-200 px-2 py-3 text-sm transition last:border-r-0 sm:rounded-full sm:border sm:px-3 sm:py-1.5 ${
                !isAvailable
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : isActive
                    ? "border-emerald-900 bg-emerald-900 text-white shadow-[0_10px_24px_rgba(6,78,59,0.18)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-950/30"
              }`}
              onClick={() => {
                if (isAvailable) {
                  setActiveFilter(option.key);
                }
              }}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
        {activeSeries.map((series) => (
          <div key={series.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0.5 w-8 rounded-full sm:h-3 sm:w-3"
              style={{ backgroundColor: series.color }}
            />
            <span>{series.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto pb-2">
        <svg
          aria-label="Linjediagram for lønnstakere over tid"
          className="w-full"
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
                  fontSize={useMobileChartLayout ? "13" : "12"}
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
                  strokeWidth={useMobileChartLayout ? "3.5" : "3"}
                />

                {chartPoints.map((point) => (
                  <g key={`${series.key}-${point.periodCode}`}>
                    <circle cx={point.x} cy={point.y} fill={series.color} r={useMobileChartLayout ? "4.5" : "4"} />
                    <title>
                      {`${series.label}, ${formatQuarterCodeLabel(point.periodLabel)}: ${formatWorkforceCount(point.value)}`}
                    </title>
                  </g>
                ))}
                {chartPoints.length > 0 ? (
                  <text
                    fill={series.color}
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="start"
                    x={chartPoints[chartPoints.length - 1].x + 8}
                    y={
                      chartPoints[chartPoints.length - 1].y +
                      4 +
                      (resolvedFilter === "employeesAll" ? endLabelOffsets[series.key] : 0)
                    }
                  >
                    {formatWorkforceCount(chartPoints[chartPoints.length - 1].value)}
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
                fontSize={useMobileChartLayout ? "10" : "12"}
                textAnchor={
                  tick.index === 0
                    ? "start"
                    : tick.index === relevantPoints.length - 1
                      ? "end"
                      : "middle"
                }
                x={x}
                y={chartHeight - 18}
              >
                {useMobileChartLayout ? formatCompactChartYear(tick.label) : tick.label}
              </text>
            );
          })}
        </svg>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        Viser alle tilgjengelige kvartaler fra SSB tabell 11658.
      </p>
    </section>
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

function formatLatestWorkforceValue(value?: number, total?: number) {
  if (value === undefined) {
    return ":";
  }

  const formattedCount = formatWorkforceCount(value);

  if (total === undefined || total <= 0) {
    return formattedCount;
  }

  const share = (value / total) * 100;
  return `${formattedCount} (${formatPercentage(share)})`;
}

function formatPercentage(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function formatQuarterCodeLabel(value: string) {
  const match = value.match(/(\d{4})\s*K([1-4])/i) ?? value.match(/(\d{4})K([1-4])/i);

  if (!match) {
    return value;
  }

  return `${match[2]}.kv.${match[1]}`;
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

function getLatestSeriesPoint(
  points: Array<{
    periodLabel: string;
    employeesAll?: number;
    employeesWomen?: number;
    employeesMen?: number;
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
