'use client'

import { useMemo, useState } from "react";
import {
  OccupationChartDevelopmentCards,
  OccupationChartReferenceControls,
  getOccupationChartValueTone,
} from "@/components/occupation-chart-reference-controls";
import { MetricInfoButton } from "@/components/metric-info-button";
import {
  formatCompactChartYear,
  useOccupationChartMobileLayout,
} from "@/components/occupation-chart-mobile";
import type { OccupationPurchasingPowerTimeSeries } from "@/lib/ssb";
import {
  calculateCumulativeAnnualDevelopment,
  OCCUPATION_CHART_HORIZONS,
} from "@/lib/occupation-chart-development";

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const filterOptions = [
  { key: "realGrowthAll", label: "Begge kjønn" },
  { key: "realGrowthWomen", label: "Kvinner" },
  { key: "realGrowthMen", label: "Menn" },
] as const;

type FilterKey = (typeof filterOptions)[number]["key"];

type OccupationPurchasingPowerLineChartProps = {
  initialFilter?: FilterKey;
  mobileOptimized?: boolean;
  series: OccupationPurchasingPowerTimeSeries;
  showTitle?: boolean;
  controlsVariant?: "default" | "reference";
};

type ChartPoint = {
  x: number;
  y: number;
  value: number;
  label: string;
};

type SegmentPoint = {
  x: number;
  y: number;
};

export function OccupationPurchasingPowerLineChart({
  initialFilter = "realGrowthAll",
  mobileOptimized = false,
  series,
  showTitle = true,
  controlsVariant = "default",
}: OccupationPurchasingPowerLineChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>(initialFilter);
  const useMobileChartLayout = useOccupationChartMobileLayout(mobileOptimized);

  const availableFilters = useMemo(
    () =>
      ({
        realGrowthAll: series.points.some((point) => point.realGrowthAll !== undefined),
        realGrowthWomen: series.points.some((point) => point.realGrowthWomen !== undefined),
        realGrowthMen: series.points.some((point) => point.realGrowthMen !== undefined),
      }) satisfies Record<FilterKey, boolean>,
    [series.points],
  );

  const resolvedFilter =
    availableFilters[activeFilter]
      ? activeFilter
      : filterOptions.find((option) => availableFilters[option.key])?.key ?? "realGrowthAll";

  const points = series.points.flatMap((point, index) => {
    const value = point[resolvedFilter];

    if (value === undefined) {
      return [];
    }

    return [{
      index,
      periodCode: point.periodCode,
      periodLabel: point.periodLabel,
      value,
    }];
  });

  if (points.length === 0) {
    return null;
  }

  const chartWidth = useMobileChartLayout ? 390 : 900;
  const chartHeight = useMobileChartLayout ? 360 : 300;
  const paddingLeft = useMobileChartLayout ? 58 : 76;
  const paddingRight = useMobileChartLayout ? 24 : 34;
  const paddingTop = useMobileChartLayout ? 20 : 18;
  const paddingBottom = useMobileChartLayout ? 48 : 42;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const minValue = Math.min(...points.map((point) => point.value), 0);
  const maxValue = Math.max(...points.map((point) => point.value), 0);
  const chartMin = Math.floor((minValue - 0.5) / 1) * 1;
  const chartMax = Math.ceil((maxValue + 0.5) / 1) * 1;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const zeroY = paddingTop + plotHeight - ((0 - chartMin) / chartRange) * plotHeight;
  const chartPoints: ChartPoint[] = points.map((point, visibleIndex) => ({
    x: paddingLeft + visibleIndex * xStep,
    y: paddingTop + plotHeight - ((point.value - chartMin) / chartRange) * plotHeight,
    value: point.value,
    label: formatPeriodLabel(point.periodLabel),
  }));
  const segments = buildSegments(chartPoints, zeroY);
  const tickValues = buildTickValues(chartMin, chartMax);
  const yearTicks = buildYearTicks(points.map((point) => ({
    periodCode: point.periodCode,
    periodLabel: point.periodLabel,
  })));
  const activeOption = filterOptions.find((option) => option.key === resolvedFilter);
  const latestSeriesPoint = getLatestSeriesPoint(series.points, resolvedFilter);
  const latestValues = activeOption && latestSeriesPoint
    ? [{
        key: activeOption.key,
        label: activeOption.label,
        periodLabel: latestSeriesPoint.periodLabel,
        value: latestSeriesPoint.value,
      }]
    : [];
  const latestPeriodLabel = latestValues[0]?.periodLabel;
  const fiveYearGrowth = calculateFiveYearRealWageGrowth(series.points, resolvedFilter);
  const developmentGroups = OCCUPATION_CHART_HORIZONS.flatMap((horizon) => {
    const items = filterOptions
      .filter((option) => option.key === "realGrowthWomen" || option.key === "realGrowthMen")
      .flatMap((option) => {
        const development = calculateCumulativeAnnualDevelopment(
          series.points.map((point) => ({
            periodCode: point.periodCode,
            periodLabel: point.periodLabel,
            value: point[option.key],
          })),
          horizon.years,
        );

        return development
          ? [{
              key: `${horizon.key}-${option.key}`,
              label: option.label,
              period: `${formatPeriodLabel(development.startPeriodLabel)}–${formatPeriodLabel(development.endPeriodLabel)}`,
              tone: getSeriesTone(option.key),
              value: formatSignedPercent(development.value),
              valueTone: getOccupationChartValueTone(development.value),
            }]
          : [];
      });

    return items.length > 0 ? [{ ...horizon, items }] : [];
  });

  return (
    <section className="bg-transparent">
      <div className="space-y-4">
        {showTitle ? (
          <h3 className={`text-xl font-semibold text-slate-950 sm:text-2xl ${
            mobileOptimized ? "text-left" : "text-center"
          }`}>
            {`Utvikling i reallønnsvekst for ${series.occupationLabel}`}
          </h3>
        ) : null}

        {controlsVariant === "reference" ? (
          <OccupationChartReferenceControls
            activeFilter={resolvedFilter}
            filters={filterOptions.map((option) => ({
              available: availableFilters[option.key],
              key: option.key,
              label: option.label,
              tone: getSeriesTone(option.key),
            }))}
            latestDataDescription={`Her ser du siste registrerte reallønnsvekst for valgt visning. Tallet gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og viser lønnsvekst justert for prisvekst.`}
            latestItems={latestValues.map((entry) => ({
              key: entry.key,
              label: entry.label,
              tone: getSeriesTone(entry.key),
              value: formatSignedPercent(entry.value),
            }))}
            legends={[]}
            onFilterChange={(key) => setActiveFilter(key as FilterKey)}
            periodLabel={latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel) : undefined}
          />
        ) : null}

        {controlsVariant !== "reference" && latestValues.length > 0 ? (
          <div className={`space-y-2 ${mobileOptimized ? "text-left" : "text-center"}`}>
            <div className={`flex items-center gap-2 ${mobileOptimized ? "" : "justify-center"}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Siste data
              </p>
              <MetricInfoButton
                description={`Her ser du siste registrerte reallønnsvekst for valgt visning. Tallet gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og viser lønnsvekst justert for prisvekst.`}
                label="Siste data"
              />
            </div>
            <div className={`grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200 sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:divide-x-0 sm:border-y-0 ${
              mobileOptimized ? "" : "sm:justify-center"
            }`}>
              {latestPeriodLabel ? (
                <span className="flex flex-col px-2 py-3 sm:block sm:rounded-[5px] sm:border sm:border-slate-200 sm:bg-white sm:px-4 sm:py-2 sm:text-sm sm:font-semibold sm:text-slate-950 sm:shadow-sm">
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
                  className={`min-w-0 px-2 py-3 text-sm leading-5 sm:rounded-[5px] sm:border sm:border-slate-200 sm:bg-white sm:px-4 sm:py-2 sm:leading-none sm:shadow-sm ${
                    entry.value > 0 ? "text-emerald-700" : entry.value < 0 ? "text-red-700" : "text-slate-700"
                  }`}
                >
                  <span className="block truncate text-xs sm:inline sm:text-[15px]">{entry.label}<span className="hidden sm:inline">: </span></span>
                  <span className="block whitespace-nowrap text-[13px] font-semibold sm:inline sm:text-[15px]">{percentFormatter.format(entry.value)} %</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {controlsVariant !== "reference" ? (
        <div className={`grid grid-cols-3 overflow-hidden rounded-[6px] border border-slate-200 sm:flex sm:flex-wrap sm:gap-2 sm:overflow-visible sm:border-0 ${
          mobileOptimized ? "" : "sm:justify-center"
        }`}>
        {filterOptions.map((option) => {
          const isActive = option.key === resolvedFilter;
          const isAvailable = availableFilters[option.key];

          return (
            <button
              key={option.key}
              disabled={!isAvailable}
              className={`min-w-0 border-0 border-r border-slate-200 px-2 py-3 text-sm transition last:border-r-0 sm:rounded-full sm:border sm:px-3 sm:py-1.5 ${
                !isAvailable
                  ? "cursor-not-allowed border-black/10 bg-slate-100 text-slate-400"
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
        ) : null}
        {latestSeriesPoint && fiveYearGrowth !== null && activeOption ? (
          <p className={`max-w-3xl text-sm leading-7 text-slate-700 sm:text-base ${
            mobileOptimized ? "text-left" : "mx-auto text-center"
          }`}>
            Reallønnen for {getFilterSubject(activeOption.key)}{" "}
            {getGrowthDescription(latestSeriesPoint.value)} det siste året og{" "}
            {getGrowthDescription(fiveYearGrowth)} samlet de siste fem årene.
          </p>
        ) : null}
      </div>

      <div className="mt-5 overflow-visible sm:mt-8 sm:overflow-x-auto">
        <svg
          aria-label={`Reallønnsvekst for ${series.occupationLabel}`}
          className="w-full"
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {tickValues.map((tickValue) => {
            const y = paddingTop + plotHeight - ((tickValue - chartMin) / chartRange) * plotHeight;

            return (
              <g key={tickValue}>
                <line
                  stroke={tickValue === 0 ? "rgba(27, 36, 48, 0.2)" : "rgba(27, 36, 48, 0.14)"}
                  strokeDasharray={tickValue === 0 ? undefined : "4 6"}
                  strokeWidth={tickValue === 0 ? "1.5" : "1"}
                  x1={paddingLeft}
                  x2={chartWidth - paddingRight}
                  y1={y}
                  y2={y}
                />
                <text
                  fill="#000000"
                  fontSize={useMobileChartLayout ? "12" : "13"}
                  textAnchor="end"
                  x={paddingLeft - 10}
                  y={y + 4}
                >
                  {percentFormatter.format(tickValue)} %
                </text>
              </g>
            );
          })}

          {segments.map((segment, index) => (
            <g key={`segment-${index}`}>
              <polygon
                fill={segment.tone === "positive" ? "rgba(22,101,52,0.18)" : "rgba(185,28,28,0.18)"}
                points={buildAreaPolygon(segment.points, zeroY)}
              />
              <polyline
                fill="none"
                points={segment.points.map((point) => `${point.x},${point.y}`).join(" ")}
                stroke={segment.tone === "positive" ? "#166534" : "#b91c1c"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={useMobileChartLayout ? "3.5" : "3"}
              />
            </g>
          ))}

          {chartPoints.map((point) => (
            <g key={`${point.label}-${point.x}`}>
              <circle
                cx={point.x}
                cy={point.y}
                fill={point.value >= 0 ? "#166534" : "#b91c1c"}
                r={useMobileChartLayout ? "4.5" : "4"}
              />
              <title>{`${point.label}: ${percentFormatter.format(point.value)} %`}</title>
            </g>
          ))}

          {yearTicks.map((tick) => {
            const x = paddingLeft + tick.index * xStep;

            return (
              <text
                key={`year-${tick.label}-${tick.index}`}
                fill="#000000"
                fontSize={useMobileChartLayout ? "10" : "13"}
                textAnchor="middle"
                x={x}
                y={chartHeight - 18}
              >
                {useMobileChartLayout ? formatCompactChartYear(tick.label) : tick.label}
              </text>
            );
          })}
        </svg>
      </div>

      {controlsVariant === "reference" ? (
        <OccupationChartDevelopmentCards groups={developmentGroups} />
      ) : null}
    </section>
  );
}

function buildSegments(points: ChartPoint[], zeroY: number) {
  const segments: Array<{
    tone: "positive" | "negative";
    points: SegmentPoint[];
  }> = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];

    if ((start.value >= 0 && end.value >= 0) || (start.value <= 0 && end.value <= 0)) {
      pushSegment(segments, start.value >= 0 ? "positive" : "negative", [
        { x: start.x, y: start.y },
        { x: end.x, y: end.y },
      ]);
      continue;
    }

    const ratio = Math.abs(start.value) / (Math.abs(start.value) + Math.abs(end.value));
    const crossingX = start.x + (end.x - start.x) * ratio;
    const crossingPoint = { x: crossingX, y: zeroY };

    pushSegment(segments, start.value >= 0 ? "positive" : "negative", [
      { x: start.x, y: start.y },
      crossingPoint,
    ]);
    pushSegment(segments, end.value >= 0 ? "positive" : "negative", [
      crossingPoint,
      { x: end.x, y: end.y },
    ]);
  }

  return segments;
}

function pushSegment(
  segments: Array<{
    tone: "positive" | "negative";
    points: SegmentPoint[];
  }>,
  tone: "positive" | "negative",
  points: SegmentPoint[],
) {
  const existing = segments[segments.length - 1];

  if (existing && existing.tone === tone) {
    const lastPoint = existing.points[existing.points.length - 1];
    const firstNewPoint = points[0];

    if (lastPoint.x === firstNewPoint.x && lastPoint.y === firstNewPoint.y) {
      existing.points.push(...points.slice(1));
      return;
    }

    existing.points.push(...points);
    return;
  }

  segments.push({
    tone,
    points: [...points],
  });
}

function buildAreaPolygon(points: SegmentPoint[], zeroY: number) {
  const first = points[0];
  const last = points[points.length - 1];
  const polygonPoints = [
    `${first.x},${zeroY}`,
    ...points.map((point) => `${point.x},${point.y}`),
    `${last.x},${zeroY}`,
  ];

  return polygonPoints.join(" ");
}

function buildTickValues(chartMin: number, chartMax: number) {
  const axisTicks = 4;
  const chartRange = Math.max(chartMax - chartMin, 1);

  return Array.from({ length: axisTicks + 1 }, (_, index) => (
    chartMin + (chartRange / axisTicks) * index
  ));
}

function formatPeriodLabel(label: string) {
  const quarterMatch = label.match(/^(\d{4})K([1-4])$/) ?? label.match(/^([1-4])\.\s*kvartal\s*(\d{4})$/i);

  if (!quarterMatch) {
    return label;
  }

  if (quarterMatch.length === 3 && label.includes("K")) {
    const [, year, quarter] = quarterMatch;
    return `${quarter}. kvartal ${year}`;
  }

  const [, quarter, year] = quarterMatch;
  return `${quarter}. kvartal ${year}`;
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
  const match = value.match(/(20\d{2})/);
  return match ? match[1] : null;
}

function getLatestSeriesPoint(
  points: OccupationPurchasingPowerTimeSeries["points"],
  key: FilterKey,
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

function calculateFiveYearRealWageGrowth(
  points: OccupationPurchasingPowerTimeSeries["points"],
  key: FilterKey,
) {
  const annualValues = Array.from(
    new Map(
      points.flatMap((point) => {
        const year = extractYear(point.periodCode) ?? extractYear(point.periodLabel);
        const value = point[key];

        return year && value !== undefined ? [[year, value] as const] : [];
      }),
    ).entries(),
  )
    .sort(([left], [right]) => left.localeCompare(right, "nb-NO"))
    .map(([, value]) => value);

  if (annualValues.length < 5) {
    return null;
  }

  const cumulativeFactor = annualValues
    .slice(-5)
    .reduce((factor, value) => factor * (1 + value / 100), 1);

  return (cumulativeFactor - 1) * 100;
}

function getFilterSubject(key: FilterKey) {
  if (key === "realGrowthWomen") {
    return "kvinner";
  }

  if (key === "realGrowthMen") {
    return "menn";
  }

  return "begge kjønn";
}

function getGrowthDescription(value: number) {
  if (value === 0) {
    return "var uendret";
  }

  const formattedValue = `${percentFormatter.format(Math.abs(value))} %`;
  return value > 0 ? `økte med ${formattedValue}` : `gikk ned med ${formattedValue}`;
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${percentFormatter.format(value)} %`;
}

function getSeriesTone(key: FilterKey) {
  if (key === "realGrowthWomen") {
    return "women" as const;
  }

  if (key === "realGrowthMen") {
    return "men" as const;
  }

  return "neutral" as const;
}
