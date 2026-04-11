'use client'

import { useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import type { OccupationPurchasingPowerTimeSeries } from "@/lib/ssb";

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
  series: OccupationPurchasingPowerTimeSeries;
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
  series,
}: OccupationPurchasingPowerLineChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("realGrowthAll");

  const points = series.points.flatMap((point, index) => {
    const value = point[activeFilter];

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

  const chartWidth = 820;
  const chartHeight = 300;
  const paddingLeft = 48;
  const paddingRight = 24;
  const paddingTop = 18;
  const paddingBottom = 42;
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
  const latestValues = filterOptions
    .filter((option) => option.key !== "realGrowthAll")
    .flatMap((option) => {
      const latestPoint = getLatestSeriesPoint(series.points, option.key);

      if (!latestPoint) {
        return [];
      }

      return [{
        key: option.key,
        label: option.label,
        periodLabel: latestPoint.periodLabel,
        value: latestPoint.value,
      }];
    });
  const latestPeriodLabel = latestValues[0]?.periodLabel;

  return (
    <section className="rounded-md border border-black bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
          {`Reallønnsvekst ${series.occupationLabel}`}
        </h3>

        {latestValues.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Siste data
              </p>
              <MetricInfoButton
                description={`Her ser du siste registrerte reallønnsvekst for kvinner og menn. Tallene gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og viser lønnsvekst justert for prisvekst.`}
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
                  className={`rounded-md border border-black/10 bg-white px-3 py-2 text-sm leading-none ${
                    entry.value > 0 ? "text-emerald-700" : entry.value < 0 ? "text-red-700" : "text-slate-700"
                  }`}
                >
                  <span className="text-[15px]">{entry.label}: </span>
                  <span className="text-[15px] font-semibold">{percentFormatter.format(entry.value)} %</span>
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
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-black/10 bg-white text-slate-700 hover:border-slate-950/30"
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

      <div className="mt-6 overflow-x-auto">
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
                  stroke={tickValue === 0 ? "rgba(27,36,48,0.22)" : "rgba(27,36,48,0.09)"}
                  strokeDasharray={tickValue === 0 ? undefined : "4 6"}
                  strokeWidth={tickValue === 0 ? "1.5" : "1"}
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
                strokeWidth="3"
              />
            </g>
          ))}

          {chartPoints.map((point) => (
            <g key={`${point.label}-${point.x}`}>
              <circle
                cx={point.x}
                cy={point.y}
                fill={point.value >= 0 ? "#166534" : "#b91c1c"}
                r="4"
              />
              <title>{`${point.label}: ${percentFormatter.format(point.value)} %`}</title>
            </g>
          ))}

          {yearTicks.map((tick) => {
            const x = paddingLeft + tick.index * xStep;

            return (
              <text
                key={`year-${tick.label}-${tick.index}`}
                fill="#5f6773"
                fontSize="12"
                textAnchor="middle"
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
