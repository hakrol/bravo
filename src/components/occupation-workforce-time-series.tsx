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
import type { OccupationWorkforceTimeSeriesPoint } from "@/lib/ssb";
import {
  calculateEndpointDevelopment,
  OCCUPATION_CHART_HORIZONS,
} from "@/lib/occupation-chart-development";

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
  const developmentGroups = OCCUPATION_CHART_HORIZONS.flatMap((horizon) => {
    const items = seriesDefinitions
      .filter(
        (definition) =>
          definition.key === "employeesWomen" || definition.key === "employeesMen",
      )
      .flatMap((definition) => {
        const development = calculateEndpointDevelopment(
          relevantPoints.map((point) => ({
            periodCode: point.periodCode,
            periodLabel: point.periodLabel,
            value: point[definition.key],
          })),
          horizon.years,
          "percent",
        );

        return development
          ? [{
              key: `${horizon.key}-${definition.key}`,
              label: definition.label,
              period: `${formatPeriodLabel(development.startPeriodLabel)}–${formatPeriodLabel(development.endPeriodLabel)}`,
              tone: getSeriesTone(definition.key),
              value: formatGrowthPercentage(development.value),
              valueTone: getOccupationChartValueTone(development.value),
            }]
          : [];
      });

    return items.length > 0 ? [{ ...horizon, items }] : [];
  });

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

      <div className="mt-5">
        <OccupationChartReferenceControls
          activeFilter={resolvedFilter}
          filters={filterOptions.map((option) => ({
            available: availableFilters[option.key],
            key: option.key,
            label: option.label,
            tone: getSeriesTone(option.key),
          }))}
          latestDataDescription={`Her ser du siste registrerte antall lønnstakere for kvinner og menn. Tallene gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og er hentet fra SSB tabell 11658.`}
          latestItems={latestValues.map((entry) => ({
            key: entry.key,
            label: entry.label,
            tone: getSeriesTone(entry.key),
            value: formatLatestWorkforceValue(entry.value, latestTotal),
          }))}
          legends={activeSeries.map((series) => ({
            color: series.color,
            key: series.key,
            label: series.label,
          }))}
          onFilterChange={(key) => setActiveFilter(key as FilterKey)}
          periodLabel={latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel) : undefined}
        />
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

      <OccupationChartDevelopmentCards groups={developmentGroups} />

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

function formatGrowthPercentage(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatPercentage(value)}`;
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

function getSeriesTone(key: SeriesKey) {
  if (key === "employeesWomen") {
    return "women" as const;
  }

  if (key === "employeesMen") {
    return "men" as const;
  }

  return "neutral" as const;
}
