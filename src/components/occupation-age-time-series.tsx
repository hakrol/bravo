'use client'

import { useState } from "react";
import {
  OccupationChartDevelopmentCards,
  OccupationChartReferenceControls,
  getOccupationChartValueTone,
} from "@/components/occupation-chart-reference-controls";
import {
  formatCompactChartYear,
  useOccupationChartMobileLayout,
} from "@/components/occupation-chart-mobile";
import type { OccupationAgeTimeSeriesPoint } from "@/lib/ssb";
import {
  calculateEndpointDevelopment,
  OCCUPATION_CHART_HORIZONS,
} from "@/lib/occupation-chart-development";

const ageFormatter = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const seriesDefinitions = [
  { key: "averageAll", label: "Begge kjønn", color: "#14532d" },
  { key: "averageWomen", label: "Kvinner", color: "#ec1f74" },
  { key: "averageMen", label: "Menn", color: "#2563eb" },
] as const;

const filterOptions = [
  { key: "averageAll", label: "Begge kjønn" },
  { key: "averageWomen", label: "Kvinner" },
  { key: "averageMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

const endLabelOffsets: Record<SeriesKey, number> = {
  averageAll: -10,
  averageWomen: -2,
  averageMen: 10,
};

type OccupationAgeTimeSeriesChartProps = {
  occupationLabel: string;
  points: OccupationAgeTimeSeriesPoint[];
};

export function OccupationAgeTimeSeriesChart({
  occupationLabel,
  points,
}: OccupationAgeTimeSeriesChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("averageAll");
  const useMobileChartLayout = useOccupationChartMobileLayout();

  if (points.length === 0) {
    return null;
  }

  const availableFilters = ({
    averageAll: points.some(
      (point) => point.averageWomen !== undefined || point.averageMen !== undefined,
    ),
    averageWomen: points.some((point) => point.averageWomen !== undefined),
    averageMen: points.some((point) => point.averageMen !== undefined),
  }) satisfies Record<FilterKey, boolean>;

  const resolvedFilter =
    availableFilters[activeFilter]
      ? activeFilter
      : filterOptions.find((option) => availableFilters[option.key])?.key ?? "averageAll";

  const activeSeries =
    resolvedFilter === "averageAll"
      ? seriesDefinitions.filter((series) => series.key !== "averageAll")
      : seriesDefinitions.filter((series) => series.key === resolvedFilter);

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
  const chartWidth = useMobileChartLayout ? 390 : 820;
  const chartHeight = useMobileChartLayout ? 360 : 300;
  const paddingLeft = useMobileChartLayout ? 58 : 48;
  const paddingRight = useMobileChartLayout ? 58 : 64;
  const paddingTop = 20;
  const paddingBottom = useMobileChartLayout ? 48 : 42;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const yearTicks = buildYearTicks(points);
  const latestValues = seriesDefinitions.filter((definition) => definition.key !== "averageAll").flatMap((definition) => {
    const latestPoint = getLatestSeriesPoint(points, definition.key);

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
  const developmentGroups = OCCUPATION_CHART_HORIZONS.flatMap((horizon) => {
    const items = seriesDefinitions
      .filter((definition) => definition.key === "averageWomen" || definition.key === "averageMen")
      .flatMap((definition) => {
        const development = calculateEndpointDevelopment(
          points.map((point) => ({
            periodCode: point.periodCode,
            periodLabel: point.periodLabel,
            value: point[definition.key],
          })),
          horizon.years,
          "difference",
        );

        return development
          ? [{
              key: `${horizon.key}-${definition.key}`,
              label: definition.label,
              period: `${formatPeriodLabel(development.startPeriodLabel)}–${formatPeriodLabel(development.endPeriodLabel)}`,
              tone: getSeriesTone(definition.key),
              value: formatAgeChange(development.value),
              valueTone: getOccupationChartValueTone(development.value),
            }]
          : [];
      });

    return items.length > 0 ? [{ ...horizon, items }] : [];
  });

  return (
    <section className="border-t border-slate-200 bg-transparent pt-8">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-950">
            Gjennomsnittsalder over tid
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            Kvartalsvis utvikling i gjennomsnittsalder i yrket.
          </p>
        </div>

        <OccupationChartReferenceControls
          activeFilter={resolvedFilter}
          filters={filterOptions.map((option) => ({
            available: availableFilters[option.key],
            key: option.key,
            label: option.label,
            tone: getSeriesTone(option.key),
          }))}
          latestDataDescription={`Her ser du siste registrerte gjennomsnittsalder for kvinner og menn. Tallene gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og er hentet fra SSB tabell 11658.`}
          latestItems={latestValues.map((entry) => ({
            key: entry.key,
            label: entry.label,
            tone: getSeriesTone(entry.key),
            value: formatAge(entry.value),
          }))}
          legends={activeSeries.map((definition) => ({
            color: definition.color,
            key: definition.key,
            label: definition.label,
          }))}
          onFilterChange={(key) => setActiveFilter(key as FilterKey)}
          periodLabel={latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel) : undefined}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label={`Tidsserie for gjennomsnittsalder i ${occupationLabel}`}
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
                  {ageFormatter.format(tickValue)} år
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
                  strokeWidth={useMobileChartLayout ? "3.5" : "3"}
                />
                {chartPoints.map((point) => (
                  <g key={`${definition.key}-${point.periodCode}`}>
                    <circle cx={point.x} cy={point.y} fill={definition.color} r={useMobileChartLayout ? "4.5" : "4"} />
                    <title>
                      {`${definition.label}: ${formatAge(point.value)} (${formatPeriodLabel(point.periodLabel)})`}
                    </title>
                  </g>
                ))}
                {chartPoints.length > 0 ? (
                  <text
                    fill={definition.color}
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="start"
                    x={chartPoints[chartPoints.length - 1].x + 8}
                    y={
                      chartPoints[chartPoints.length - 1].y +
                      4 +
                      (resolvedFilter === "averageAll" ? endLabelOffsets[definition.key] : 0)
                    }
                  >
                    {ageFormatter.format(chartPoints[chartPoints.length - 1].value)}
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
                  tick.index === 0 ? "start" : tick.index === points.length - 1 ? "end" : "middle"
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

      <OccupationChartDevelopmentCards groups={developmentGroups} />
    </section>
  );
}

function formatAge(value: number) {
  return `${ageFormatter.format(value)} år`;
}

function formatAgeChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${ageFormatter.format(value)} år`;
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
    averageAll?: number;
    averageWomen?: number;
    averageMen?: number;
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

function getSeriesTone(key: SeriesKey) {
  if (key === "averageWomen") {
    return "women" as const;
  }

  if (key === "averageMen") {
    return "men" as const;
  }

  return "neutral" as const;
}
