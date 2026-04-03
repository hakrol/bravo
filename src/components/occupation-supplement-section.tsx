'use client'

import { useMemo, useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import type { OccupationSupplementTimeSeries, OccupationSupplementTimeSeriesPoint } from "@/lib/ssb";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const supplementDefinitions = [
  {
    key: "bonus",
    label: "Bonus",
    description:
      "Bonus viser gjennomsnittlig bonus i kroner fra SSB tabell 11418. Referanseperioden er 1. januar til 30. november i hvert år.",
    allKey: "bonusAll",
    womenKey: "bonusWomen",
    menKey: "bonusMen",
  },
  {
    key: "overtime",
    label: "Overtid",
    description:
      "Overtid viser gjennomsnittlig overtidsgodtgjørelse i kroner fra SSB tabell 11418 for referansemåneden i hvert år.",
    allKey: "overtimeAll",
    womenKey: "overtimeWomen",
    menKey: "overtimeMen",
  },
  {
    key: "irregularAdditions",
    label: "Uregelmessige tillegg",
    description:
      "Uregelmessige tillegg viser gjennomsnittlige variable tillegg i kroner fra SSB tabell 11418. Referanseperioden er 1. januar til 30. november i hvert år.",
    allKey: "irregularAdditionsAll",
    womenKey: "irregularAdditionsWomen",
    menKey: "irregularAdditionsMen",
  },
] as const;

const supplementFilterOptions = [
  { key: "all", label: "Alle" },
  ...supplementDefinitions.map((definition) => ({
    key: definition.key,
    label: definition.label,
  })),
] as const;

const filterOptions = [
  { key: "all", label: "Begge kjønn" },
  { key: "women", label: "Kvinner" },
  { key: "men", label: "Menn" },
] as const;

type SupplementKey = (typeof supplementFilterOptions)[number]["key"];
type FilterKey = (typeof filterOptions)[number]["key"];
type ValueKey = Exclude<
  keyof OccupationSupplementTimeSeriesPoint,
  "periodCode" | "periodLabel"
>;

type OccupationSupplementSectionProps = {
  occupationLabel: string;
  series: OccupationSupplementTimeSeries;
};

export function OccupationSupplementSection({
  occupationLabel,
  series,
}: OccupationSupplementSectionProps) {
  const [activeSupplement, setActiveSupplement] = useState<SupplementKey>("all");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const cards = useMemo(() => {
    return supplementDefinitions.map((definition) => {
      const latestPoint = getLatestPointForKeys(series.points, [
        definition.allKey,
        definition.womenKey,
        definition.menKey,
      ]);

      return {
        ...definition,
        latestPeriodLabel: latestPoint?.periodLabel,
        allValue: latestPoint ? latestPoint[definition.allKey] : undefined,
        womenValue: latestPoint ? latestPoint[definition.womenKey] : undefined,
        menValue: latestPoint ? latestPoint[definition.menKey] : undefined,
      };
    });
  }, [series.points]);

  const activeSeries = buildActiveChartSeries(activeSupplement, activeFilter);
  const chartPoints = series.points.filter((point) =>
    activeSeries.some((seriesItem) => getPointValue(point, activeSupplement, seriesItem.filterKey) !== undefined),
  );
  const values = chartPoints.flatMap((point) =>
    activeSeries.flatMap((seriesItem) => {
      const value = getPointValue(point, activeSupplement, seriesItem.filterKey);
      return value !== undefined ? [value] : [];
    }),
  );

  if (cards.every((card) => card.allValue === undefined && card.womenValue === undefined && card.menValue === undefined)) {
    return null;
  }

  return (
    <section className="space-y-6 rounded-md border border-black/10 bg-white/70 px-5 py-5 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
          Bonus og tillegg
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Bonus, overtid og uregelmessige tillegg
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-700">
          Denne seksjonen viser gjennomsnittlig bonus, overtidsgodtgjørelse og uregelmessige tillegg for {occupationLabel.toLowerCase()} fra SSB tabell 11418. Du kan se siste nivå og følge utviklingen over tid for begge kjønn, kvinner og menn.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.key}
            className={`rounded-md border px-5 py-5 transition ${
              card.key === activeSupplement
                ? "border-[var(--primary)]/35 bg-[linear-gradient(135deg,rgba(244,239,230,0.82)_0%,rgba(230,240,234,0.82)_100%)] shadow-[0_12px_36px_rgba(27,36,48,0.05)]"
                : "border-black/10 bg-[#fcfaf6]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {card.label}
                </p>
                {card.latestPeriodLabel ? (
                  <p className="text-sm leading-6 text-slate-600">{card.latestPeriodLabel}</p>
                ) : null}
              </div>
              <MetricInfoButton description={card.description} label={card.label} />
            </div>

            <div className="mt-4 space-y-3">
              <StatRow label="Begge kjønn" value={card.allValue} />
              <StatRow label="Kvinner" value={card.womenValue} />
              <StatRow label="Menn" value={card.menValue} />
            </div>
          </article>
        ))}
      </div>

      <div className="space-y-4 rounded-md border border-black/8 bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
              {buildTimelineTitle(activeSupplement)}
            </h3>
            <MetricInfoButton
              description={`Tidslinjen viser ${buildTimelineDescription(activeSupplement)} for ${occupationLabel.toLowerCase()} per år. Tallene kommer fra SSB tabell 11418 og kan filtreres på begge kjønn, kvinner og menn.`}
              label="Tidslinje"
            />
          </div>
          <p className="text-sm text-[var(--muted)]">
            Bytt mellom alle, bonus, overtid og uregelmessige tillegg, og filtrer på kvinner og menn på samme måte som i de andre grafene.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {supplementFilterOptions.map((option) => {
            const isActive = option.key === activeSupplement;

            return (
              <button
                key={option.key}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-black/10 bg-white text-slate-700 hover:border-[var(--primary)]/40"
                }`}
                onClick={() => setActiveSupplement(option.key)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
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

        {values.length > 0 ? (
          <SupplementLineChart
            activeSeries={activeSeries}
            supplementKey={activeSupplement}
            points={chartPoints}
          />
        ) : (
          <p className="text-sm leading-7 text-slate-700">
            Ingen tidsseriedata tilgjengelig for dette valget.
          </p>
        )}

        <p className="text-xs leading-5 text-[var(--muted)]">
          Kilde: SSB tabell 11418. Bonus gjelder perioden 1. januar til 30. november, mens overtid og nivåtall gjelder referanseperioden i statistikken for det aktuelle året.
        </p>
      </div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="shrink-0 text-lg font-semibold text-slate-950">{formatCurrency(value)}</p>
    </div>
  );
}

function SupplementLineChart({
  activeSeries,
  supplementKey,
  points,
}: {
  activeSeries: Array<{ filterKey: Exclude<FilterKey, "all">; label: string; color: string }>;
  supplementKey: SupplementKey;
  points: OccupationSupplementTimeSeriesPoint[];
}) {
  const values = points.flatMap((point) =>
    activeSeries.flatMap((seriesItem) => {
      const value = getPointValue(point, supplementKey, seriesItem.filterKey);
      return value !== undefined ? [value] : [];
    }),
  );

  if (values.length === 0) {
    return null;
  }

  const chartWidth = 920;
  const chartHeight = 340;
  const paddingLeft = 56;
  const paddingRight = 88;
  const paddingTop = 18;
  const paddingBottom = 48;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const chartMin = Math.max(0, Math.floor((Math.min(...values) * 0.92) / 100) * 100);
  const chartMax = Math.ceil((Math.max(...values) * 1.08) / 100) * 100;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
        {activeSeries.map((seriesItem) => (
          <div key={seriesItem.filterKey} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: seriesItem.color }}
            />
            <span>{seriesItem.label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          aria-label={`Tidslinje for ${buildTimelineTitle(supplementKey).toLowerCase()}`}
          className="min-w-[760px] w-full"
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
                  fontSize="12"
                  textAnchor="end"
                  x={paddingLeft - 10}
                  y={y + 4}
                >
                  {currencyFormatter.format(Math.round(tickValue))}
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

          {activeSeries.map((seriesItem) => {
            const seriesPoints = points.flatMap((point, index) => {
              const value = getPointValue(point, supplementKey, seriesItem.filterKey);

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

            if (seriesPoints.length === 0) {
              return null;
            }

            const path = seriesPoints
              .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
              .join(" ");

            return (
              <g key={seriesItem.filterKey}>
                <path
                  d={path}
                  fill="none"
                  stroke={seriesItem.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />

                {seriesPoints.map((point) => (
                  <g key={`${seriesItem.filterKey}-${point.periodCode}`}>
                    <circle cx={point.x} cy={point.y} fill={seriesItem.color} r="4" />
                    <title>{`${seriesItem.label}, ${point.periodLabel}: ${formatCurrency(point.value)}`}</title>
                  </g>
                ))}

                <text
                  fill={seriesItem.color}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="start"
                  x={seriesPoints[seriesPoints.length - 1].x + 8}
                  y={seriesPoints[seriesPoints.length - 1].y + 4}
                >
                  {currencyFormatter.format(seriesPoints[seriesPoints.length - 1].value)}
                </text>
              </g>
            );
          })}

          {points.map((point, index) => {
            const x = paddingLeft + xStep * index;

            return (
              <text
                key={`${point.periodCode}-${index}`}
                fill="#5f6773"
                fontSize="12"
                textAnchor={
                  index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"
                }
                x={x}
                y={chartHeight - 18}
              >
                {point.periodLabel}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function getLatestPointForKeys(
  points: OccupationSupplementTimeSeriesPoint[],
  keys: ValueKey[],
) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index];

    if (keys.some((key) => point[key] !== undefined)) {
      return point;
    }
  }

  return null;
}

function getSelectedPointKey(
  definition: (typeof supplementDefinitions)[number],
  filterKey: FilterKey,
): ValueKey {
  if (filterKey === "women") {
    return definition.womenKey;
  }

  if (filterKey === "men") {
    return definition.menKey;
  }

  return definition.allKey;
}

function buildLegendLabel(supplementKey: SupplementKey, filterKey: FilterKey) {
  const metricLabel =
    supplementKey === "all"
      ? "Alle tillegg"
      : supplementDefinitions.find((definition) => definition.key === supplementKey)?.label ?? "Alle tillegg";

  if (filterKey === "women") {
    return `${metricLabel}, kvinner`;
  }

  if (filterKey === "men") {
    return `${metricLabel}, menn`;
  }

  return `${metricLabel}, begge kjønn`;
}

function buildActiveChartSeries(
  supplementKey: SupplementKey,
  filterKey: FilterKey,
) {
  if (filterKey === "all") {
    return [
      {
        filterKey: "women" as const,
        label: buildLegendLabel(supplementKey, "women"),
        color: getSeriesColor("women"),
      },
      {
        filterKey: "men" as const,
        label: buildLegendLabel(supplementKey, "men"),
        color: getSeriesColor("men"),
      },
    ];
  }

  return [
    {
      filterKey,
      label: buildLegendLabel(supplementKey, filterKey),
      color: getSeriesColor(filterKey),
    },
  ];
}

function buildTimelineTitle(supplementKey: SupplementKey) {
  if (supplementKey === "all") {
    return "Utvikling i alle tillegg";
  }

  const label =
    supplementDefinitions.find((definition) => definition.key === supplementKey)?.label.toLowerCase() ??
    "tillegg";

  return `Utvikling i ${label}`;
}

function buildTimelineDescription(supplementKey: SupplementKey) {
  if (supplementKey === "all") {
    return "summen av bonus, overtid og uregelmessige tillegg";
  }

  return (
    supplementDefinitions.find((definition) => definition.key === supplementKey)?.label.toLowerCase() ??
    "tillegg"
  );
}

function getPointValue(
  point: OccupationSupplementTimeSeriesPoint,
  supplementKey: SupplementKey,
  filterKey: FilterKey,
) {
  if (supplementKey === "all") {
    return calculateCombinedValue(point, filterKey);
  }

  const definition = supplementDefinitions.find((item) => item.key === supplementKey);

  if (!definition) {
    return undefined;
  }

  return point[getSelectedPointKey(definition, filterKey)];
}

function calculateCombinedValue(
  point: OccupationSupplementTimeSeriesPoint,
  filterKey: FilterKey,
) {
  const values =
    filterKey === "women"
      ? [point.bonusWomen, point.overtimeWomen, point.irregularAdditionsWomen]
      : filterKey === "men"
        ? [point.bonusMen, point.overtimeMen, point.irregularAdditionsMen]
        : [point.bonusAll, point.overtimeAll, point.irregularAdditionsAll];

  const definedValues = values.filter((value): value is number => value !== undefined);

  if (definedValues.length === 0) {
    return undefined;
  }

  return definedValues.reduce((sum, value) => sum + value, 0);
}

function getSeriesColor(filterKey: FilterKey) {
  if (filterKey === "women") {
    return "#b45309";
  }

  if (filterKey === "men") {
    return "#1d4ed8";
  }

  return "#14532d";
}

function formatCurrency(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}
