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
import {
  calculateEndpointDevelopment,
  OCCUPATION_CHART_HORIZONS,
} from "@/lib/occupation-chart-development";
import type { OccupationWorkingHoursTimeSeriesPoint } from "@/lib/ssb";

const hoursFormatter = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const seriesDefinitions = [
  { key: "hoursAll", label: "Begge kjønn", color: "#14532d" },
  { key: "hoursWomen", label: "Kvinner", color: "#ec1f74" },
  { key: "hoursMen", label: "Menn", color: "#2563eb" },
] as const;

const filterOptions = seriesDefinitions.map(({ key, label }) => ({ key, label }));

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

const endLabelOffsets: Record<SeriesKey, number> = {
  hoursAll: -10,
  hoursWomen: -2,
  hoursMen: 10,
};

type OccupationWorkingHoursTimeSeriesChartProps = {
  occupationLabel: string;
  points: OccupationWorkingHoursTimeSeriesPoint[];
};

export function OccupationWorkingHoursTimeSeriesChart({
  occupationLabel,
  points,
}: OccupationWorkingHoursTimeSeriesChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("hoursAll");
  const useMobileChartLayout = useOccupationChartMobileLayout();
  const relevantPoints = points.filter((point) =>
    seriesDefinitions.some((series) => point[series.key] !== undefined),
  );

  if (relevantPoints.length === 0) {
    return null;
  }

  const hasGenderSeries = relevantPoints.some(
    (point) => point.hoursWomen !== undefined || point.hoursMen !== undefined,
  );
  const availableFilters = {
    hoursAll: relevantPoints.some((point) => point.hoursAll !== undefined) || hasGenderSeries,
    hoursWomen: relevantPoints.some((point) => point.hoursWomen !== undefined),
    hoursMen: relevantPoints.some((point) => point.hoursMen !== undefined),
  } satisfies Record<FilterKey, boolean>;
  const resolvedFilter = availableFilters[activeFilter]
    ? activeFilter
    : filterOptions.find((option) => availableFilters[option.key])?.key ?? "hoursAll";
  const activeSeries = resolvedFilter === "hoursAll"
    ? hasGenderSeries
      ? seriesDefinitions.filter((series) => series.key !== "hoursAll")
      : seriesDefinitions.filter((series) => series.key === "hoursAll")
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

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const chartMin = Math.floor((minValue - 0.5) * 2) / 2;
  const chartMax = Math.ceil((maxValue + 0.5) * 2) / 2;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const chartWidth = useMobileChartLayout ? 390 : 820;
  const chartHeight = useMobileChartLayout ? 360 : 300;
  const paddingLeft = useMobileChartLayout ? 64 : 58;
  const paddingRight = useMobileChartLayout ? 58 : 64;
  const paddingTop = 20;
  const paddingBottom = useMobileChartLayout ? 48 : 42;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = relevantPoints.length > 1 ? plotWidth / (relevantPoints.length - 1) : 0;
  const yearTicks = buildYearTicks(relevantPoints);
  const tickValues = Array.from({ length: 5 }, (_, index) => chartMin + (chartRange / 4) * index);
  const latestDefinitions = hasGenderSeries
    ? seriesDefinitions.filter((series) => series.key !== "hoursAll")
    : seriesDefinitions.filter((series) => series.key === "hoursAll");
  const latestValues = latestDefinitions.flatMap((definition) => {
    const latestPoint = getLatestSeriesPoint(relevantPoints, definition.key);
    return latestPoint ? [{ ...definition, ...latestPoint }] : [];
  });
  const latestPeriodLabel = latestValues[0]?.periodLabel;
  const developmentDefinitions = hasGenderSeries
    ? seriesDefinitions.filter((series) => series.key !== "hoursAll")
    : seriesDefinitions.filter((series) => series.key === "hoursAll");
  const developmentGroups = OCCUPATION_CHART_HORIZONS.flatMap((horizon) => {
    const items = developmentDefinitions.flatMap((definition) => {
      const development = calculateEndpointDevelopment(
        relevantPoints.map((point) => ({
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
            value: formatHoursChange(development.value),
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
          <h3 className="text-xl font-semibold text-slate-950">Avtalt arbeidstid per uke</h3>
          <p className="text-sm leading-6 text-slate-600">
            Kvartalsvis utvikling i gjennomsnittlig avtalt arbeidstid per uke i yrket.
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
          latestDataDescription={`Her ser du siste registrerte gjennomsnittlige avtalte arbeidstid per uke. Tallene gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige kvartal"} og er hentet fra SSB tabell 11658.`}
          latestItems={latestValues.map((entry) => ({
            key: entry.key,
            label: entry.label,
            tone: getSeriesTone(entry.key),
            value: formatHours(entry.value),
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
          aria-label={`Tidsserie for avtalt arbeidstid per uke i ${occupationLabel}`}
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
                  {hoursFormatter.format(tickValue)} t
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
            const chartPoints = relevantPoints.flatMap((point, index) => {
              const value = point[definition.key];
              if (value === undefined) return [];
              return [{
                x: paddingLeft + xStep * index,
                y: paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight,
                value,
                periodCode: point.periodCode,
                periodLabel: point.periodLabel,
              }];
            });

            if (chartPoints.length === 0) return null;

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
                    <title>{`${definition.label}: ${formatHours(point.value)} (${formatPeriodLabel(point.periodLabel)})`}</title>
                  </g>
                ))}
                <text
                  fill={definition.color}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="start"
                  x={chartPoints[chartPoints.length - 1].x + 8}
                  y={chartPoints[chartPoints.length - 1].y + 4 + (resolvedFilter === "hoursAll" ? endLabelOffsets[definition.key] : 0)}
                >
                  {hoursFormatter.format(chartPoints[chartPoints.length - 1].value)}
                </text>
              </g>
            );
          })}

          {yearTicks.map((tick) => {
            const x = paddingLeft + xStep * tick.index;
            return (
              <text
                key={`${tick.label}-${tick.index}`}
                fill="#5f6773"
                fontSize={useMobileChartLayout ? "10" : "12"}
                textAnchor={tick.index === 0 ? "start" : tick.index === relevantPoints.length - 1 ? "end" : "middle"}
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

function formatHours(value: number) {
  return `${hoursFormatter.format(value)} timer`;
}

function formatHoursChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${hoursFormatter.format(value)} timer`;
}

function formatPeriodLabel(value: string) {
  const match = value.match(/^(\d{4})\s*K([1-4])$/i);
  return match ? `${match[2]}. kvartal ${match[1]}` : value;
}

function buildYearTicks(points: Array<{ periodCode: string; periodLabel: string }>) {
  const seenYears = new Set<string>();

  return points.flatMap((point, index) => {
    const year = point.periodCode.match(/(\d{4})/)?.[1] ?? point.periodLabel.match(/(\d{4})/)?.[1];
    if (!year || seenYears.has(year)) return [];
    seenYears.add(year);
    return [{ index, label: year }];
  });
}

function getLatestSeriesPoint(
  points: OccupationWorkingHoursTimeSeriesPoint[],
  key: SeriesKey,
) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const value = points[index][key];
    if (value !== undefined) {
      return { periodLabel: points[index].periodLabel, value };
    }
  }
  return null;
}

function getSeriesTone(key: SeriesKey) {
  if (key === "hoursWomen") return "women" as const;
  if (key === "hoursMen") return "men" as const;
  return "neutral" as const;
}
