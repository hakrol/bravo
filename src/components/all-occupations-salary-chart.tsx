"use client";

import { type KeyboardEvent, useState } from "react";
import type { OccupationPurchasingPowerTimeSeries, OccupationSalaryTimeSeries } from "@/lib/types";

type AllOccupationsSalaryChartProps = {
  purchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
  series: OccupationSalaryTimeSeries;
};

type ChartMode = "adjusted" | "nominal";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export function AllOccupationsSalaryChart({
  purchasingPowerSeries,
  series,
}: AllOccupationsSalaryChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>("nominal");
  const [hoveredPeriodCode, setHoveredPeriodCode] = useState<string | null>(null);
  const [selectedPeriodCode, setSelectedPeriodCode] = useState<string | null>(null);
  const inflationIndexByPeriod = new Map(
    purchasingPowerSeries.points
      .filter((point) => point.inflationIndex !== undefined)
      .map((point) => [point.periodCode, point.inflationIndex as number] as const),
  );
  const latestInflationIndex = Array.from(inflationIndexByPeriod.values()).at(-1);
  const chartPoints = series.points
    .filter((point): point is typeof point & { valueAll: number } => point.valueAll !== undefined)
    .flatMap((point) => {
      const inflationIndex = inflationIndexByPeriod.get(point.periodCode);

      if (chartMode === "adjusted") {
        if (
          latestInflationIndex === undefined ||
          inflationIndex === undefined ||
          inflationIndex <= 0
        ) {
          return [];
        }

        return [
          {
            ...point,
            chartValue: point.valueAll * (latestInflationIndex / inflationIndex),
          },
        ];
      }

      return [
        {
          ...point,
          chartValue: point.valueAll,
        },
      ];
    });

  if (chartPoints.length === 0) {
    return null;
  }

  const latestPoint = chartPoints.at(-1);
  const minSalary = Math.min(...chartPoints.map((point) => point.chartValue));
  const maxSalary = Math.max(...chartPoints.map((point) => point.chartValue));
  const yMin = Math.floor(minSalary / 5000) * 5000;
  const yMax = Math.ceil(maxSalary / 5000) * 5000;
  const yRange = Math.max(yMax - yMin, 1);
  const chartWidth = 1180;
  const chartHeight = 610;
  const chartPadding = { top: 56, right: 190, bottom: 86, left: 76 };
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right;
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const chartPointViews = chartPoints.map((point, index) => {
    const x =
      chartPadding.left +
      (chartPoints.length <= 1 ? 0 : (index / (chartPoints.length - 1)) * innerWidth);
    const y =
      chartPadding.top + innerHeight - ((point.chartValue - yMin) / yRange) * innerHeight;

    return { ...point, x, y };
  });
  const polylinePoints = chartPointViews.map((point) => `${point.x},${point.y}`).join(" ");
  const latestSalary = latestPoint?.chartValue;
  const activePeriodCode = hoveredPeriodCode ?? selectedPeriodCode;
  const activePoint = chartPointViews.find((point) => point.periodCode === activePeriodCode);
  const activePeriodLabel = activePoint ? formatPeriodLabel(activePoint.periodLabel) : "";
  const activeTooltipX =
    activePoint && activePoint.x > chartWidth - chartPadding.right - 220
      ? activePoint.x - 204
      : activePoint
        ? activePoint.x + 18
        : 0;
  const activeTooltipY =
    activePoint && activePoint.y < chartPadding.top + 72
      ? activePoint.y + 18
      : activePoint
        ? activePoint.y - 78
        : 0;
  const yAxisTicks = buildSalaryTicks(yMin, yMax).map((value) => {
    const y = chartPadding.top + innerHeight - ((value - yMin) / yRange) * innerHeight;

    return { value, y };
  });
  const xAxisTicks = getYearTicks(chartPoints);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#eef6ef] px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Utvikling i median månedslønn i Norge
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
              Diagrammet viser månedslønn for alle yrker samlet.
            </p>

            <div className="mt-5 inline-flex w-fit rounded-md border border-black/10 bg-white/70 p-1 shadow-[0_8px_22px_rgba(27,36,48,0.05)]">
              <ChartModeButton
                active={chartMode === "nominal"}
                label="Vanlig lønn"
                onClick={() => setChartMode("nominal")}
              />
              <ChartModeButton
                active={chartMode === "adjusted"}
                label="Inflasjonsjustert"
                onClick={() => setChartMode("adjusted")}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <svg
            aria-label="Stort linjediagram som viser median månedslønn for alle yrker over tid"
            className="block min-w-[860px]"
            role="img"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <rect fill="#eef6ef" height={chartHeight} width={chartWidth} />
            {yAxisTicks.map((tick) => (
              <g key={tick.value}>
                <line
                  stroke="rgba(27,36,48,0.12)"
                  x1={chartPadding.left}
                  x2={chartWidth - chartPadding.right}
                  y1={tick.y}
                  y2={tick.y}
                />
                <text
                  fill="#64748b"
                  fontSize="13"
                  fontWeight="650"
                  textAnchor="end"
                  x={chartPadding.left - 14}
                  y={tick.y + 4}
                >
                  {formatAxisSalary(tick.value)}
                </text>
              </g>
            ))}

            {xAxisTicks.map((tick) => {
              const x =
                chartPadding.left +
                (chartPoints.length <= 1 ? 0 : (tick.index / (chartPoints.length - 1)) * innerWidth);

              return (
                <g key={tick.year}>
                  <line
                    stroke="rgba(27,36,48,0.08)"
                    x1={x}
                    x2={x}
                    y1={chartPadding.top}
                    y2={chartPadding.top + innerHeight}
                  />
                  <text
                    fill="#64748b"
                    fontSize="14"
                    fontWeight="650"
                    textAnchor="middle"
                    x={x}
                    y={chartHeight - 30}
                  >
                    {tick.year}
                  </text>
                </g>
              );
            })}

            <polyline
              fill="none"
              points={polylinePoints}
              stroke="var(--primary-strong)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />

            {chartPointViews.map((point) => {
              return (
                <g
                  key={point.periodCode}
                  aria-label={`${formatPeriodLabel(point.periodLabel)}: ${formatSalary(point.chartValue)}`}
                  className="cursor-pointer outline-none"
                  onBlur={() => setHoveredPeriodCode(null)}
                  onClick={() => setSelectedPeriodCode(point.periodCode)}
                  onFocus={() => setHoveredPeriodCode(point.periodCode)}
                  onKeyDown={(event) => handlePointKeyDown(event, point.periodCode, setSelectedPeriodCode)}
                  onMouseEnter={() => setHoveredPeriodCode(point.periodCode)}
                  onMouseLeave={() => setHoveredPeriodCode(null)}
                  role="button"
                  tabIndex={0}
                >
                  <circle cx={point.x} cy={point.y} fill="transparent" r="15" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill="#eef6ef"
                    r={activePeriodCode === point.periodCode ? "6" : "4.5"}
                    stroke="var(--primary-strong)"
                    strokeWidth={activePeriodCode === point.periodCode ? "3" : "2.5"}
                  />
                </g>
              );
            })}

            {activePoint ? (
              <g pointerEvents="none">
                <line
                  stroke="rgba(20,83,45,0.28)"
                  strokeDasharray="4 5"
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={activePoint.y}
                  y2={chartPadding.top + innerHeight}
                />
                <rect
                  fill="#ffffff"
                  height="64"
                  rx="6"
                  stroke="rgba(20,83,45,0.16)"
                  width="186"
                  x={activeTooltipX}
                  y={activeTooltipY}
                />
                <text
                  fill="var(--muted)"
                  fontSize="12"
                  fontWeight="700"
                  x={activeTooltipX + 12}
                  y={activeTooltipY + 22}
                >
                  {activePeriodLabel}
                </text>
                <text
                  fill="var(--primary-strong)"
                  fontSize="16"
                  fontWeight="800"
                  x={activeTooltipX + 12}
                  y={activeTooltipY + 46}
                >
                  {formatSalary(activePoint.chartValue)}
                </text>
              </g>
            ) : null}

            {latestPoint ? (
              <g>
                <line
                  stroke="rgba(20,83,45,0.25)"
                  x1={chartWidth - chartPadding.right}
                  x2={chartWidth - chartPadding.right + 12}
                  y1={
                    chartPadding.top +
                    innerHeight -
                    ((latestPoint.chartValue - yMin) / yRange) * innerHeight
                  }
                  y2={
                    chartPadding.top +
                    innerHeight -
                    ((latestPoint.chartValue - yMin) / yRange) * innerHeight
                  }
                />
                <text
                  fill="var(--primary-strong)"
                  fontSize="16"
                  fontWeight="800"
                  x={chartWidth - chartPadding.right + 18}
                  y={
                    chartPadding.top +
                    innerHeight -
                    ((latestPoint.chartValue - yMin) / yRange) * innerHeight -
                    8
                  }
                >
                  {formatSalary(latestSalary)}
                </text>
              </g>
            ) : null}
          </svg>
        </div>
        {chartMode === "adjusted" ? (
          <p className="mt-4 max-w-2xl rounded-md border border-[rgba(20,83,45,0.14)] bg-white/55 px-4 py-3 text-sm leading-6 text-[var(--muted)]">
            Inflasjonsjustert lønn viser hva tidligere lønnsnivå tilsvarer i dagens
            kroneverdi. Når linjen stiger, har lønnen økt mer enn prisveksten. Når
            linjen faller, har kjøpekraften blitt svakere selv om lønnen i kroner kan
            ha gått opp.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function handlePointKeyDown(
  event: KeyboardEvent<SVGGElement>,
  periodCode: string,
  setSelectedPeriodCode: (periodCode: string) => void,
) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  setSelectedPeriodCode(periodCode);
}

function ChartModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[var(--primary-strong)] text-white shadow-sm"
          : "text-[var(--primary-strong)] hover:bg-white"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}

function formatAxisSalary(value: number) {
  return `${value.toLocaleString("nb-NO")} kr`;
}

function formatPeriodLabel(label: string) {
  const quarterMatch = label.match(/^(\d{4})K([1-4])$/i);

  if (!quarterMatch) {
    return label;
  }

  const [, year, quarter] = quarterMatch;

  return `${quarter}. kvartal ${year}`;
}

function buildSalaryTicks(min: number, max: number) {
  const ticks: number[] = [];

  for (let value = min; value <= max; value += 5000) {
    ticks.push(value);
  }

  return ticks;
}

function getYearTicks(points: Array<{ periodLabel: string }>) {
  const seenYears = new Set<string>();

  return points.flatMap((point, index) => {
    const year = point.periodLabel.match(/^(\d{4})/)?.[1];

    if (!year || seenYears.has(year)) {
      return [];
    }

    seenYears.add(year);
    return [{ year, index }];
  });
}
