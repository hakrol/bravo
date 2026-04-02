'use client'

import { useState } from "react";
import type { OccupationPurchasingPowerTimeSeries } from "@/lib/ssb";

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const positiveColor = "#166534";
const negativeColor = "#b91c1c";

const seriesDefinitions = [
  { key: "realGrowthAll", label: "Begge kjonn" },
  { key: "realGrowthWomen", label: "Kvinner" },
  { key: "realGrowthMen", label: "Menn" },
] as const;

const filterOptions = [
  { key: "realGrowthAll", label: "Begge kjonn" },
  { key: "realGrowthWomen", label: "Kvinner" },
  { key: "realGrowthMen", label: "Menn" },
] as const;

type SeriesKey = (typeof seriesDefinitions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];

type OccupationPurchasingPowerTimeSeriesChartProps = {
  series: OccupationPurchasingPowerTimeSeries;
};

export function OccupationPurchasingPowerTimeSeriesChart({
  series,
}: OccupationPurchasingPowerTimeSeriesChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("realGrowthAll");

  if (series.points.length === 0) {
    return null;
  }

  const activeSeries = seriesDefinitions.filter((definition) => {
    return activeFilter === definition.key;
  });

  const values = series.points.flatMap((point) => {
    return activeSeries.flatMap((definition) => {
      const value = point[definition.key];
      return value !== undefined ? [value] : [];
    });
  });

  if (values.length === 0) {
    return null;
  }

  const chartWidth = 920;
  const chartHeight = 340;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 52;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const chartMin = Math.floor((Math.min(...values, 0) - 0.5) / 1) * 1;
  const chartMax = Math.ceil((Math.max(...values, 0) + 0.5) / 1) * 1;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const groupWidth = series.points.length > 0 ? plotWidth / series.points.length : 0;
  const zeroY = paddingTop + plotHeight - ((0 - chartMin) / chartRange) * plotHeight;
  const labelStride = series.points.length > 12 ? Math.ceil(series.points.length / 8) : 1;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });

  return (
    <section className="rounded-md border bg-[var(--surface)] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 border-b pb-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Reallonnsvekst
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Kvartalsvis reallonnsvekst etter inflasjon. Positive verdier vises over nullinjen i gront, negative under i rodt.
          </p>
        </div>

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
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ backgroundColor: positiveColor }} />
            <span>Positiv reallonnsvekst</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ backgroundColor: negativeColor }} />
            <span>Negativ reallonnsvekst</span>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label={`Reallonnsutvikling for ${series.occupationLabel}`}
          className="min-w-[760px] w-full"
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {tickValues.map((tickValue) => {
            const y = paddingTop + plotHeight - ((tickValue - chartMin) / chartRange) * plotHeight;

            return (
              <g key={tickValue}>
                <line
                  stroke={tickValue === 0 ? "rgba(27, 36, 48, 0.2)" : "rgba(27, 36, 48, 0.09)"}
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

          {series.points.map((point, index) => {
            const xStart = paddingLeft + groupWidth * index;
            const visibleDefinitions = activeSeries.filter((definition) => point[definition.key] !== undefined);
            const barGap = 4;
            const innerWidth = Math.max(groupWidth - 8, 8);
            const barWidth = Math.max((innerWidth - Math.max(visibleDefinitions.length - 1, 0) * barGap) / Math.max(visibleDefinitions.length, 1), 4);
            const barsWidth = visibleDefinitions.length * barWidth + Math.max(visibleDefinitions.length - 1, 0) * barGap;
            const offset = xStart + (groupWidth - barsWidth) / 2;

            return (
              <g key={point.periodCode}>
                {visibleDefinitions.map((definition, definitionIndex) => {
                  const value = point[definition.key] as number | undefined;

                  if (value === undefined) {
                    return null;
                  }

                  const y = paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight;
                  const barHeight = Math.abs(y - zeroY);
                  const barX = offset + definitionIndex * (barWidth + barGap);
                  const barY = value >= 0 ? y : zeroY;

                  return (
                    <g key={`${point.periodCode}-${definition.key}`}>
                      <rect
                        fill={value >= 0 ? positiveColor : negativeColor}
                        height={Math.max(barHeight, 2)}
                        rx="2"
                        width={barWidth}
                        x={barX}
                        y={barY}
                      />
                      <title>
                        {`${definition.label}, ${formatPeriodLabel(point.periodLabel)}: ${percentFormatter.format(value)} %`}
                      </title>
                    </g>
                  );
                })}

                {(index % labelStride === 0 || index === series.points.length - 1) ? (
                  <text
                    fill="#5f6773"
                    fontSize="12"
                    textAnchor="middle"
                    x={xStart + groupWidth / 2}
                    y={chartHeight - 18}
                  >
                    {formatShortPeriodLabel(point.periodLabel)}
                  </text>
                ) : null}
              </g>
            );
          })}

          <line
            stroke="rgba(27, 36, 48, 0.18)"
            strokeWidth="1.5"
            x1={paddingLeft}
            x2={chartWidth - paddingRight}
            y1={zeroY}
            y2={zeroY}
          />
        </svg>
      </div>
    </section>
  );
}

function formatPeriodLabel(label: string) {
  const quarterMatch = getQuarterMatch(label);

  if (!quarterMatch) {
    return label;
  }

  const [, year, quarter] = quarterMatch;
  return `${quarter}. kvartal ${year}`;
}

function formatShortPeriodLabel(label: string) {
  const quarterMatch = getQuarterMatch(label);

  if (!quarterMatch) {
    return label;
  }

  const [, year, quarter] = quarterMatch;
  return `${quarter}.kv.${year}`;
}

function getQuarterMatch(label: string) {
  const quarterCodeMatch = label.match(/^(\d{4})K([1-4])$/);

  if (quarterCodeMatch) {
    return quarterCodeMatch;
  }

  const quarterLabelMatch = label.match(/^([1-4])\.\s*kvartal\s*(\d{4})$/i);

  if (!quarterLabelMatch) {
    return null;
  }

  const [, quarter, year] = quarterLabelMatch;
  return [quarterLabelMatch[0], year, quarter];
}
