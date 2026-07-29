"use client";

import { type KeyboardEvent, useState } from "react";
import {
  formatCompactChartYear,
  useOccupationChartMobileLayout,
} from "@/components/occupation-chart-mobile";
import type { OccupationPurchasingPowerTimeSeries, OccupationSalaryTimeSeries } from "@/lib/types";

type AllOccupationsSalaryChartProps = {
  purchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
  series: OccupationSalaryTimeSeries;
};

type ChartMode = "adjusted" | "nominal";
type SalaryPeriod = "annual" | "monthly" | "hourly";

const MONTHLY_WORK_HOURS = 162.5;

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export function AllOccupationsSalaryChart({
  purchasingPowerSeries,
  series,
}: AllOccupationsSalaryChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>("nominal");
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>("monthly");
  const useMobileChartLayout = useOccupationChartMobileLayout();
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
            chartValue: convertMonthlySalary(
              point.valueAll * (latestInflationIndex / inflationIndex),
              salaryPeriod,
            ),
          },
        ];
      }

      return [
        {
          ...point,
          chartValue: convertMonthlySalary(point.valueAll, salaryPeriod),
        },
      ];
    });

  if (chartPoints.length === 0) {
    return null;
  }

  const latestPoint = chartPoints.at(-1);
  const minSalary = Math.min(...chartPoints.map((point) => point.chartValue));
  const maxSalary = Math.max(...chartPoints.map((point) => point.chartValue));
  const tickStep = getSalaryTickStep(salaryPeriod);
  const yMin = Math.floor(minSalary / tickStep) * tickStep;
  const yMax = Math.ceil(maxSalary / tickStep) * tickStep;
  const yRange = Math.max(yMax - yMin, 1);
  const chartWidth = useMobileChartLayout ? 390 : 1180;
  const chartHeight = useMobileChartLayout ? 390 : 610;
  const chartPadding = {
    top: useMobileChartLayout ? 30 : 56,
    right: useMobileChartLayout ? 86 : 190,
    bottom: useMobileChartLayout ? 58 : 86,
    left: useMobileChartLayout ? (salaryPeriod === "annual" ? 68 : 58) : salaryPeriod === "annual" ? 96 : 76,
  };
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
  const preferredTooltipX = activePoint
    ? activePoint.x > chartWidth / 2
      ? activePoint.x - 204
      : activePoint.x + 18
    : 0;
  const activeTooltipX = activePoint
    ? Math.min(Math.max(preferredTooltipX, 8), chartWidth - 194)
    : 0;
  const activeTooltipY =
    activePoint && activePoint.y < chartPadding.top + 72
      ? activePoint.y + 18
      : activePoint
        ? activePoint.y - 78
        : 0;
  const yAxisTicks = buildSalaryTicks(yMin, yMax, tickStep).map((value) => {
    const y = chartPadding.top + innerHeight - ((value - yMin) / yRange) * innerHeight;

    return { value, y };
  });
  const xAxisTicks = getYearTicks(chartPoints);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#eef6ef] px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Utvikling i median {getSalaryPeriodLabel(salaryPeriod).toLowerCase()} i Norge
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
              {getChartDescription(salaryPeriod)}
            </p>

            <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
              <div
                aria-label="Velg lønnsperiode"
                className="grid w-full grid-cols-3 overflow-hidden rounded-md bg-[rgba(20,83,45,0.07)] p-1 sm:inline-flex sm:w-fit"
                role="group"
              >
                <ChartOptionButton
                  active={salaryPeriod === "annual"}
                  label="Årslønn"
                  onClick={() => setSalaryPeriod("annual")}
                />
                <ChartOptionButton
                  active={salaryPeriod === "monthly"}
                  label="Månedslønn"
                  onClick={() => setSalaryPeriod("monthly")}
                />
                <ChartOptionButton
                  active={salaryPeriod === "hourly"}
                  label="Timelønn"
                  onClick={() => setSalaryPeriod("hourly")}
                />
              </div>

              <div
                aria-label="Velg kroneverdi"
                className="grid w-full grid-cols-2 overflow-hidden rounded-md bg-[rgba(20,83,45,0.07)] p-1 sm:inline-flex sm:w-fit"
                role="group"
              >
                <ChartOptionButton
                  active={chartMode === "nominal"}
                  label="Vanlig lønn"
                  onClick={() => setChartMode("nominal")}
                />
                <ChartOptionButton
                  active={chartMode === "adjusted"}
                  label="Inflasjonsjustert"
                  onClick={() => setChartMode("adjusted")}
                />
              </div>
            </div>
          </div>
          <SalaryChartHeaderGraphic />
        </div>
        <div className="overflow-hidden sm:overflow-x-auto">
          <svg
            aria-label={`Stort linjediagram som viser median ${getSalaryPeriodLabel(salaryPeriod).toLowerCase()} for alle yrker over tid`}
            className="block w-full sm:min-w-[860px]"
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
                  fontSize={useMobileChartLayout ? "11" : "13"}
                  fontWeight="650"
                  textAnchor="end"
                  x={chartPadding.left - 14}
                  y={tick.y + 4}
                >
                  {formatAxisSalary(tick.value, salaryPeriod)}
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
                  fontSize={useMobileChartLayout ? "10" : "14"}
                    fontWeight="650"
                    textAnchor="middle"
                    x={x}
                    y={chartHeight - 30}
                  >
                    {useMobileChartLayout ? formatCompactChartYear(tick.year) : tick.year}
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
              strokeWidth={useMobileChartLayout ? "3" : "4"}
            />

            {chartPointViews.map((point) => {
              return (
                <g
                  key={point.periodCode}
                  aria-label={`${formatPeriodLabel(point.periodLabel)}: ${formatSalary(point.chartValue, salaryPeriod)}`}
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
                    r={
                      activePeriodCode === point.periodCode
                        ? useMobileChartLayout
                          ? "5"
                          : "6"
                        : useMobileChartLayout
                          ? "3.5"
                          : "4.5"
                    }
                    stroke="var(--primary-strong)"
                    strokeWidth={
                      activePeriodCode === point.periodCode
                        ? useMobileChartLayout
                          ? "2.5"
                          : "3"
                        : "2.5"
                    }
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
                  {formatSalary(activePoint.chartValue, salaryPeriod)}
                </text>
              </g>
            ) : null}

            {latestPoint ? (
              <g>
                <line
                  stroke="rgba(20,83,45,0.25)"
                  x1={chartWidth - chartPadding.right}
                  x2={chartWidth - chartPadding.right + (useMobileChartLayout ? 8 : 12)}
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
                  fontSize={useMobileChartLayout ? "12" : "16"}
                  fontWeight="800"
                  x={chartWidth - chartPadding.right + (useMobileChartLayout ? 12 : 18)}
                  y={
                    chartPadding.top +
                    innerHeight -
                    ((latestPoint.chartValue - yMin) / yRange) * innerHeight -
                    8
                  }
                >
                  {formatSalary(latestSalary, salaryPeriod)}
                </text>
              </g>
            ) : null}
          </svg>
        </div>
        {chartMode === "adjusted" ? (
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
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

function SalaryChartHeaderGraphic() {
  const bars = [26, 38, 31, 52, 46, 68, 61, 82];

  return (
    <div aria-hidden="true" className="relative mx-auto hidden w-full max-w-[320px] lg:block">
      <svg fill="none" viewBox="0 0 320 170">
        <ellipse cx="166" cy="87" fill="rgba(20,83,45,0.055)" rx="143" ry="76" />
        <circle cx="276" cy="31" fill="rgba(20,83,45,0.1)" r="5" />
        <circle cx="297" cy="52" fill="rgba(20,83,45,0.16)" r="3" />
        <circle cx="31" cy="119" fill="rgba(20,83,45,0.12)" r="4" />

        <g transform="translate(42 29)">
          <rect fill="rgba(255,255,255,0.9)" height="116" rx="14" width="236" />
          <rect height="115" rx="13.5" stroke="rgba(20,83,45,0.12)" width="235" x=".5" y=".5" />

          <g transform="translate(20 66)">
            {bars.map((height, index) => (
              <rect
                fill={index > 5 ? "#17643a" : index > 2 ? "#77a982" : "#b8d2bc"}
                height={height * 0.48}
                key={index}
                rx="2"
                width="12"
                x={index * 19}
                y={42 - height * 0.48}
              />
            ))}
          </g>

          <path
            d="M20 76c18-5 27-19 45-17 19 2 24 11 42 4 18-8 23-23 43-22 18 1 23 10 40-2 9-6 15-14 24-19"
            stroke="#164f30"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <circle cx="214" cy="20" fill="#fff" r="5" stroke="#164f30" strokeWidth="3" />
        </g>

        <g transform="translate(21 19)">
          <circle cx="25" cy="25" fill="#17643a" r="25" />
          <text
            fill="#fff"
            fontSize="17"
            fontWeight="750"
            textAnchor="middle"
            x="25"
            y="31"
          >
            kr
          </text>
        </g>
      </svg>
    </div>
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

function ChartOptionButton({
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
      className={`min-w-0 rounded px-2 py-3 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
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

function formatSalary(value: number | undefined, salaryPeriod: SalaryPeriod) {
  if (value === undefined) {
    return ":";
  }

  const suffix = salaryPeriod === "hourly" ? " kr/time" : " kr";
  return `${currencyFormatter.format(value)}${suffix}`;
}

function formatAxisSalary(value: number, salaryPeriod: SalaryPeriod) {
  const suffix = salaryPeriod === "hourly" ? " kr/t" : " kr";
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })}${suffix}`;
}

function formatPeriodLabel(label: string) {
  const quarterMatch = label.match(/^(\d{4})K([1-4])$/i);

  if (!quarterMatch) {
    return label;
  }

  const [, year, quarter] = quarterMatch;

  return `${quarter}. kvartal ${year}`;
}

function buildSalaryTicks(min: number, max: number, step: number) {
  const ticks: number[] = [];

  for (let value = min; value <= max; value += step) {
    ticks.push(value);
  }

  return ticks;
}

function convertMonthlySalary(value: number, salaryPeriod: SalaryPeriod) {
  if (salaryPeriod === "annual") {
    return value * 12;
  }

  if (salaryPeriod === "hourly") {
    return value / MONTHLY_WORK_HOURS;
  }

  return value;
}

function getSalaryTickStep(salaryPeriod: SalaryPeriod) {
  if (salaryPeriod === "annual") {
    return 50_000;
  }

  if (salaryPeriod === "hourly") {
    return 25;
  }

  return 5_000;
}

function getSalaryPeriodLabel(salaryPeriod: SalaryPeriod) {
  if (salaryPeriod === "annual") {
    return "Årslønn";
  }

  if (salaryPeriod === "hourly") {
    return "Timelønn";
  }

  return "Månedslønn";
}

function getChartDescription(salaryPeriod: SalaryPeriod) {
  if (salaryPeriod === "annual") {
    return "Diagrammet viser beregnet årslønn for alle yrker samlet, basert på månedslønn multiplisert med 12.";
  }

  if (salaryPeriod === "hourly") {
    return `Diagrammet viser estimert timelønn basert på ${MONTHLY_WORK_HOURS.toLocaleString("nb-NO")} arbeidstimer per måned.`;
  }

  return "Diagrammet viser månedslønn for alle yrker samlet.";
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
