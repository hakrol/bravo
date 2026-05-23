'use client'

import { useMemo, useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import type { OccupationSalaryTimeSeries } from "@/lib/ssb";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const seriesDefinitions = [
  { key: "valueAll", label: "Begge kjønn", color: "#14532d" },
  { key: "valueWomen", label: "Kvinner", color: "#ec1f74" },
  { key: "valueMen", label: "Menn", color: "#2563eb" },
] as const;

const filterOptions = [
  { key: "valueAll", label: "Begge kjønn" },
  { key: "valueWomen", label: "Kvinner" },
  { key: "valueMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

const endLabelOffsets: Record<SeriesKey, number> = {
  valueAll: -10,
  valueWomen: 0,
  valueMen: 10,
};

type OccupationSalaryTimeSeriesProps = {
  series: OccupationSalaryTimeSeries;
  title?: string;
  description?: string;
  ariaLabel?: string;
  latestDataDescription?: string;
  valueDisplay?: "monthly" | "hourly";
  containerClassName?: string;
  variant?: "default" | "modern" | "classic-emphasis";
};

export function OccupationSalaryTimeSeriesChart({
  series,
  title,
  description,
  ariaLabel,
  latestDataDescription,
  valueDisplay = "monthly",
  containerClassName,
  variant = "default",
}: OccupationSalaryTimeSeriesProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("valueAll");
  const hasSplitByGender = useMemo(
    () => series.points.some((point) => point.valueWomen !== undefined || point.valueMen !== undefined),
    [series.points],
  );

  const availableFilters = useMemo(
    () =>
      ({
        valueAll: series.points.some((point) => point.valueAll !== undefined),
        valueWomen: series.points.some((point) => point.valueWomen !== undefined),
        valueMen: series.points.some((point) => point.valueMen !== undefined),
      }) satisfies Record<FilterKey, boolean>,
    [series.points],
  );

  const resolvedFilter =
    availableFilters[activeFilter]
      ? activeFilter
      : filterOptions.find((option) => availableFilters[option.key])?.key ?? "valueAll";

  const activeSeries =
    resolvedFilter === "valueAll"
      ? hasSplitByGender
        ? seriesDefinitions.filter((definition) => definition.key !== "valueAll")
        : seriesDefinitions.filter((definition) => definition.key === "valueAll")
      : seriesDefinitions.filter((definition) => definition.key === resolvedFilter);

  const availableValues = series.points.flatMap((point) => {
    return activeSeries.flatMap((definition) => {
      const value = point[definition.key];
      return value !== undefined ? [value] : [];
    });
  });

  if (availableValues.length === 0) {
    return null;
  }

  const minValue = Math.min(...availableValues);
  const maxValue = Math.max(...availableValues);
  const axisStep = valueDisplay === "hourly" ? getHourlyAxisStep(minValue, maxValue) : 1000;
  const chartMin =
    valueDisplay === "hourly"
      ? Math.max(0, Math.floor((minValue - axisStep) / axisStep) * axisStep)
      : Math.max(0, Math.floor(minValue / axisStep) * axisStep);
  const chartMax =
    valueDisplay === "hourly"
      ? Math.ceil((maxValue + axisStep) / axisStep) * axisStep
      : Math.ceil(maxValue / axisStep) * axisStep;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const chartWidth = 900;
  const chartHeight = 320;
  const paddingLeft = 86;
  const paddingRight = 90;
  const paddingTop = 16;
  const paddingBottom = 42;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = series.points.length > 1 ? plotWidth / (series.points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const yearTicks = buildYearTicks(series.points);
  const latestValues = seriesDefinitions
    .filter((definition) => hasSplitByGender ? definition.key !== "valueAll" : definition.key === "valueAll")
    .flatMap((definition) => {
    const latestPoint = getLatestSeriesPoint(series.points, definition.key);

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
  const growthValues = activeSeries.flatMap((definition) => {
    const firstPoint = getFirstSeriesPoint(series.points, definition.key);
    const latestPoint = getLatestSeriesPoint(series.points, definition.key);

    if (!firstPoint || !latestPoint || firstPoint.value === 0) {
      return [];
    }

    return [
      {
        key: definition.key,
        label: definition.label,
        firstPeriodLabel: firstPoint.periodLabel,
        latestPeriodLabel: latestPoint.periodLabel,
        value: ((latestPoint.value - firstPoint.value) / firstPoint.value) * 100,
      },
    ];
  });
  const latestPeriodLabel = latestValues[0]?.periodLabel;
  const valueFormatter = valueDisplay === "hourly" ? formatHourlyValue : formatCurrency;
  const axisValueFormatter = valueDisplay === "hourly" ? formatHourlyAxisValue : formatAxisCurrency;
  const endLabelFormatter = valueDisplay === "hourly" ? formatHourlyEndLabel : formatEndLabel;
  const isModern = variant === "modern";
  const isClassicEmphasis = variant === "classic-emphasis";
  const containerClasses = isModern
    ? "rounded-[5px] bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-6"
    : isClassicEmphasis
      ? `bg-transparent p-0 ${containerClassName ?? ""}`
      : `bg-[var(--surface)] p-4 shadow-sm sm:p-6 ${containerClassName ?? "rounded-[5px]"}`;
  const chartFrameClasses = isModern
    ? "mt-6 overflow-x-auto rounded-md border border-black bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-4"
    : isClassicEmphasis
      ? "mt-8 overflow-x-auto"
      : "mt-6 overflow-x-auto";
  const gridStroke = isModern
    ? "rgba(15, 23, 42, 0.10)"
    : isClassicEmphasis
      ? "rgba(27, 36, 48, 0.14)"
      : "rgba(27, 36, 48, 0.09)";
  const gridDash = isModern ? "0" : isClassicEmphasis ? "4 6" : "4 6";
  const axisStroke = isModern
    ? "rgba(15, 23, 42, 0.24)"
    : isClassicEmphasis
      ? "rgba(27, 36, 48, 0.2)"
      : "rgba(27, 36, 48, 0.14)";
  const pointRadius = isModern ? 4.5 : 4;
  const lineWidth = isModern ? 4 : 3;
  const axisLabelColor = isModern || isClassicEmphasis ? "#000000" : "#5f6773";
  const yearGuideStroke = isModern ? "rgba(15, 23, 42, 0.08)" : "transparent";

  return (
    <section className="grid gap-6">
      <section className={containerClasses} style={isModern ? { border: "2px solid #000" } : undefined}>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">
              {title ?? `Utvikling i månedslønn for ${series.occupationLabel}`}
            </h3>
            <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              {description ??
                `${series.occupationLabel} lønnsutvikling i Norge. Se median månedslønn for begge kjønn, kvinner og menn basert på tilgjengelige SSB-tall.`}
            </p>
          </div>

          {latestValues.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Siste data
                </p>
                <MetricInfoButton
                  description={
                    latestDataDescription ??
                    `Her ser du siste registrerte månedslønn for kvinner og menn. Tallene gjelder ${latestPeriodLabel ? formatPeriodLabel(latestPeriodLabel).toLowerCase() : "siste tilgjengelige periode"} og er hentet fra SSB.`
                  }
                  label="Siste data"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {latestPeriodLabel ? (
                  <span className={`rounded-[5px] border px-4 py-2 text-sm font-semibold ${
                    isModern
                      ? "border-black/10 bg-slate-950 text-white"
                      : isClassicEmphasis
                        ? "border-slate-200 bg-white text-slate-950 shadow-sm"
                        : "border-black/10 bg-[#f7fafc] text-slate-700"
                  }`}>
                    {formatPeriodLabel(latestPeriodLabel)}
                  </span>
                ) : null}
                {latestValues.map((entry) => (
                  <div
                    key={`latest-${entry.key}`}
                    className={`rounded-[5px] border px-4 py-2 text-sm leading-none ${
                      isModern
                        ? "border-black/10 bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
                        : isClassicEmphasis
                          ? "border-slate-200 bg-white text-slate-700 shadow-sm"
                          : "border-black/10 bg-white text-slate-700"
                    }`}
                  >
                    <span className={`text-[15px] ${isModern ? "block text-xs uppercase tracking-[0.14em] text-slate-500" : ""}`}>
                      {entry.label}
                      {!isModern ? ":" : ""}
                    </span>
                    <span className={`${isModern ? "mt-2 block text-lg sm:text-xl" : "text-[15px]"} font-semibold text-slate-950`}>
                      {valueFormatter(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option.key === resolvedFilter;
              const isAvailable = availableFilters[option.key];

              return (
                <button
                  key={option.key}
                  disabled={!isAvailable}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    !isAvailable
                      ? "cursor-not-allowed border-black/10 bg-slate-100 text-slate-400"
                      : isActive
                      ? "border-emerald-900 bg-emerald-900 text-white shadow-[0_10px_24px_rgba(6,78,59,0.18)]"
                      : isModern
                        ? "border-black/10 bg-slate-50 text-slate-700 hover:border-slate-950/30"
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

          <div className="flex flex-wrap gap-3">
            {activeSeries.map((definition) => (
              <div
                key={definition.key}
                className={`flex items-center gap-2 text-sm ${
                  isModern
                    ? "rounded-full border border-black/10 bg-white px-3 py-1.5 text-slate-700"
                    : "text-slate-700"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: definition.color }}
                />
                <span>{definition.label}</span>
              </div>
            ))}
          </div>

          {growthValues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {growthValues.map((entry) => (
                <div
                  key={`growth-${entry.key}`}
                  className="rounded-[5px] bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{entry.label}: </span>
                  <strong className="font-semibold text-slate-950">
                    {formatGrowthPercent(entry.value)}
                  </strong>
                  <span>
                    {" "}
                    i perioden {formatPeriodLabel(entry.firstPeriodLabel)}–
                    {formatPeriodLabel(entry.latestPeriodLabel)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className={chartFrameClasses}>
          <svg
            aria-label={ariaLabel ?? `Tidsserie for ${series.occupationLabel}`}
            className="w-full"
            role="img"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {tickValues.map((tickValue) => {
              const y = paddingTop + plotHeight - ((tickValue - chartMin) / chartRange) * plotHeight;

              return (
                <g key={tickValue}>
                  <line
                    stroke={gridStroke}
                    strokeDasharray={gridDash}
                    strokeWidth="1"
                    x1={paddingLeft}
                    x2={chartWidth - paddingRight}
                    y1={y}
                    y2={y}
                  />
                  <text
                    fill={axisLabelColor}
                    fontSize={isModern || isClassicEmphasis ? "13" : "12"}
                    fontWeight={isModern || isClassicEmphasis ? "600" : "400"}
                    textAnchor="end"
                    x={paddingLeft - 10}
                    y={y + 4}
                  >
                    {axisValueFormatter(tickValue)}
                  </text>
                </g>
              );
            })}

            <line
              stroke={axisStroke}
              strokeWidth="1"
              x1={paddingLeft}
              x2={chartWidth - paddingRight}
              y1={paddingTop + plotHeight}
              y2={paddingTop + plotHeight}
            />

            {activeSeries.map((definition) => {
              const points = series.points.flatMap((point, index) => {
                const value = point[definition.key as SeriesKey];

                if (value === undefined) {
                  return [];
                }

                const x = paddingLeft + xStep * index;
                const y = paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight;

                return [{ x, y, label: point.periodLabel, periodCode: point.periodCode, value }];
              });

              if (points.length === 0) {
                return null;
              }

              const path = points
                .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
                .join(" ");
              const latestPoint = points[points.length - 1];

              return (
                <g key={definition.key}>
                  {isModern ? (
                    <path
                      d={path}
                      fill="none"
                      stroke={definition.color}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.16"
                      strokeWidth={lineWidth + 6}
                    />
                  ) : null}
                  <path
                    d={path}
                    fill="none"
                    stroke={definition.color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={lineWidth}
                  />
                  {points.map((point) => (
                    <g key={`${definition.key}-${point.periodCode}`}>
                      {isModern ? (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          fill="white"
                          r={point.periodCode === latestPoint.periodCode ? pointRadius + 4 : pointRadius + 2.5}
                          stroke="none"
                        />
                      ) : null}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        fill={definition.color}
                        r={point.periodCode === latestPoint.periodCode && isModern ? pointRadius + 1 : pointRadius}
                      />
                      <title>
                        {`${definition.label}: ${valueFormatter(point.value)} (${formatPeriodLabel(point.label)})`}
                      </title>
                    </g>
                  ))}
                  {points.length > 0 ? (
                    isModern ? (
                      <g>
                        <rect
                          fill="#0f172a"
                          height="28"
                          rx="6"
                          stroke="none"
                          width={Math.max(54, endLabelFormatter(latestPoint.value).length * 8 + 18)}
                          x={latestPoint.x + 10}
                          y={
                            latestPoint.y -
                            16 +
                            (resolvedFilter === "valueAll" ? endLabelOffsets[definition.key] : 0)
                          }
                        />
                        <text
                          fill="white"
                          fontSize="12"
                          fontWeight="700"
                          textAnchor="start"
                          x={latestPoint.x + 20}
                          y={
                            latestPoint.y +
                            1 +
                            (resolvedFilter === "valueAll" ? endLabelOffsets[definition.key] : 0)
                          }
                        >
                          {endLabelFormatter(latestPoint.value)}
                        </text>
                      </g>
                    ) : (
                      <text
                        fill={definition.color}
                        fontSize="12"
                        fontWeight="600"
                        textAnchor="start"
                        x={latestPoint.x + 8}
                        y={
                          latestPoint.y +
                          4 +
                          (resolvedFilter === "valueAll" ? endLabelOffsets[definition.key] : 0)
                        }
                      >
                        {endLabelFormatter(latestPoint.value)}
                      </text>
                    )
                  ) : null}
                </g>
              );
            })}

            {yearTicks.map((tick) => {
              const x = paddingLeft + xStep * tick.index;

              return (
                <g key={`year-${tick.label}-${tick.index}`}>
                  {isModern ? (
                    <line
                      stroke={yearGuideStroke}
                      strokeWidth="1"
                      x1={x}
                      x2={x}
                      y1={paddingTop}
                      y2={paddingTop + plotHeight}
                    />
                  ) : null}
                  <text
                    fill={axisLabelColor}
                    fontSize={isModern || isClassicEmphasis ? "13" : "12"}
                    fontWeight={isModern || isClassicEmphasis ? "700" : "400"}
                    textAnchor={
                      tick.index === 0
                        ? "start"
                        : tick.index === series.points.length - 1
                          ? "end"
                          : "middle"
                    }
                    x={x}
                    y={chartHeight - 18}
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>
    </section>
  );
}

function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)} kr`;
}

function formatGrowthPercent(value: number) {
  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} %`;
}

function formatAxisCurrency(value: number) {
  return currencyFormatter.format(Math.round(value));
}

function formatEndLabel(value: number) {
  return currencyFormatter.format(Math.round(value));
}

function formatHourlyValue(value: number) {
  return `${Math.round(value).toLocaleString("nb-NO")} kr/time`;
}

function formatHourlyAxisValue(value: number) {
  return Math.round(value).toLocaleString("nb-NO");
}

function formatHourlyEndLabel(value: number) {
  return Math.round(value).toLocaleString("nb-NO");
}

function getHourlyAxisStep(minValue: number, maxValue: number) {
  const range = Math.max(maxValue - minValue, 1);

  if (range <= 40) {
    return 10;
  }

  if (range <= 80) {
    return 20;
  }

  if (range <= 160) {
    return 25;
  }

  if (range <= 300) {
    return 50;
  }

  return 100;
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

function getLatestSeriesPoint(
  points: Array<{
    periodLabel: string;
    valueAll?: number;
    valueWomen?: number;
    valueMen?: number;
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

function getFirstSeriesPoint(
  points: Array<{
    periodLabel: string;
    valueAll?: number;
    valueWomen?: number;
    valueMen?: number;
  }>,
  key: SeriesKey,
) {
  for (const point of points) {
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
