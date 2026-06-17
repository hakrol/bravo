'use client'

import { useMemo, useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import type {
  OccupationSectorSalaryTimeSeries,
  OccupationSectorSalaryTimeSeriesPoint,
} from "@/lib/ssb";

type GenderKey = "women" | "men";

type SectorDefinition = {
  key: "private" | "municipal" | "state";
  label: string;
  color: string;
  description: string;
  fieldByGender: Record<GenderKey, keyof OccupationSectorSalaryTimeSeriesPoint>;
};

const sectorDefinitions = [
  {
    key: "private",
    label: "Privat",
    color: "#2563eb",
    description: "Privat viser SSBs kategori privat sektor og offentlig eide foretak. Det dekker private virksomheter, samt foretak som er offentlig eid, men organisert utenfor forvaltningen.",
    fieldByGender: {
      women: "privateMedianWomen",
      men: "privateMedianMen",
    },
  },
  {
    key: "municipal",
    label: "Kommune",
    color: "#ec1f74",
    description: "Kommune viser kommuneforvaltningen. Det omfatter kommuner og fylkeskommuner, for eksempel mange jobber innen skole, barnehage, helse, omsorg, tekniske tjenester og lokal administrasjon.",
    fieldByGender: {
      women: "municipalMedianWomen",
      men: "municipalMedianMen",
    },
  },
  {
    key: "state",
    label: "Stat",
    color: "#047857",
    description: "Stat viser statsforvaltningen. Det omfatter statlige virksomheter som departementer, direktorater, etater, universiteter, politi, forsvar og andre arbeidsplasser som ligger under staten. Forskjellen fra kommune er at arbeidsgiveren hører til staten, ikke kommune eller fylkeskommune.",
    fieldByGender: {
      women: "stateMedianWomen",
      men: "stateMedianMen",
    },
  },
] as const satisfies readonly SectorDefinition[];

const filterOptions = [
  { key: "women", label: "Kvinner" },
  { key: "men", label: "Menn" },
] as const;

type OccupationSectorSalaryTimeSeriesChartProps = {
  occupationLabel: string;
  series: OccupationSectorSalaryTimeSeries;
};

export function OccupationSectorSalaryTimeSeriesChart({
  occupationLabel,
  series,
}: OccupationSectorSalaryTimeSeriesChartProps) {
  const [activeGender, setActiveGender] = useState<GenderKey>("women");
  const points = series.points;
  const hasPublicSectorData = points.some((point) =>
    getPointValue(point, "municipalMedianWomen") !== undefined ||
    getPointValue(point, "municipalMedianMen") !== undefined ||
    getPointValue(point, "stateMedianWomen") !== undefined ||
    getPointValue(point, "stateMedianMen") !== undefined,
  );

  const availableFilters = useMemo(
    () =>
      ({
        women: points.some((point) =>
          sectorDefinitions.some((sector) => getPointValue(point, sector.fieldByGender.women) !== undefined),
        ),
        men: points.some((point) =>
          sectorDefinitions.some((sector) => getPointValue(point, sector.fieldByGender.men) !== undefined),
        ),
      }) satisfies Record<GenderKey, boolean>,
    [points],
  );

  const resolvedGender = availableFilters[activeGender]
    ? activeGender
    : filterOptions.find((option) => availableFilters[option.key])?.key ?? "women";
  const activeSectors = sectorDefinitions.filter((sector) =>
    points.some((point) => getPointValue(point, sector.fieldByGender[resolvedGender]) !== undefined),
  );

  if (points.length === 0 || !hasPublicSectorData || activeSectors.length === 0) {
    return null;
  }

  const values = points.flatMap((point) =>
    activeSectors.flatMap((sector) => {
      const value = getPointValue(point, sector.fieldByGender[resolvedGender]);
      return value !== undefined ? [value] : [];
    }),
  );

  if (values.length === 0) {
    return null;
  }

  const chartWidth = 820;
  const chartHeight = 310;
  const paddingLeft = 64;
  const paddingRight = 72;
  const paddingTop = 20;
  const paddingBottom = 42;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const chartMin = Math.floor(Math.min(...values) * 0.98 / 1000) * 1000;
  const chartMax = Math.ceil(Math.max(...values) * 1.02 / 1000) * 1000;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const yearTicks = buildYearTicks(points);
  const latestPoint = getLatestPointWithValues(points, activeSectors, resolvedGender);
  const latestValues = latestPoint
    ? activeSectors.flatMap((sector) => {
        const value = getPointValue(latestPoint, sector.fieldByGender[resolvedGender]);
        return value !== undefined ? [{ key: sector.key, label: sector.label, value }] : [];
      })
    : [];

  return (
    <section className="border-t border-slate-200 bg-transparent pt-8">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-950">
            Offentlig og privat lønn for {occupationLabel}
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            Median månedslønn etter sektor, fordelt på kvinner og menn.
          </p>
        </div>

        {latestValues.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Siste data
              </p>
              <MetricInfoButton
                description={`Her ser du siste publiserte median månedslønn for ${resolvedGender === "women" ? "kvinner" : "menn"} i privat sektor, kommuneforvaltningen og statsforvaltningen. Tallene er hentet fra SSB tabell 11418.`}
                label="Siste data"
                variant="muted"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[5px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                {latestPoint ? formatPeriodLabel(latestPoint.periodLabel) : "Siste periode"}
              </span>
              {latestValues.map((entry) => (
                <div
                  key={`latest-${entry.key}`}
                  className="rounded-[5px] border border-slate-200 bg-white px-3 py-2 text-sm leading-none text-slate-700 shadow-sm"
                >
                  <span className="text-[15px]">{entry.label}: </span>
                  <span className="text-[15px] font-semibold text-slate-950">
                    {formatSalary(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive = option.key === resolvedGender;
            const isAvailable = availableFilters[option.key];

            return (
              <button
                key={option.key}
                disabled={!isAvailable}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  !isAvailable
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : isActive
                      ? "border-emerald-900 bg-emerald-900 text-white shadow-[0_10px_24px_rgba(6,78,59,0.18)]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-950/30"
                }`}
                onClick={() => {
                  if (isAvailable) {
                    setActiveGender(option.key);
                  }
                }}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {activeSectors.map((sector) => (
          <div key={sector.key} className="flex items-center gap-2 text-sm text-slate-700">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: sector.color }}
            />
            <span>{sector.label}</span>
            <MetricInfoButton
              description={sector.description}
              label={sector.label}
              variant="muted"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label={`Linjediagram for offentlig og privat lønn i ${occupationLabel}`}
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
                  fontSize="12"
                  textAnchor="end"
                  x={paddingLeft - 10}
                  y={y + 4}
                >
                  {formatSalaryAxis(tickValue)}
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

          {activeSectors.map((sector) => {
            const chartPoints = points.flatMap((point, index) => {
              const value = getPointValue(point, sector.fieldByGender[resolvedGender]);

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
              <g key={sector.key}>
                <path
                  d={path}
                  fill="none"
                  stroke={sector.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                {chartPoints.map((point) => (
                  <g key={`${sector.key}-${point.periodCode}`}>
                    <circle cx={point.x} cy={point.y} fill={sector.color} r="4" />
                    <title>
                      {`${sector.label}: ${formatSalary(point.value)} (${formatPeriodLabel(point.periodLabel)})`}
                    </title>
                  </g>
                ))}
                <text
                  fill={sector.color}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="start"
                  x={chartPoints[chartPoints.length - 1].x + 8}
                  y={chartPoints[chartPoints.length - 1].y + 4}
                >
                  {formatSalaryShort(chartPoints[chartPoints.length - 1].value)}
                </text>
              </g>
            );
          })}

          {yearTicks.map((tick) => {
            const x = paddingLeft + xStep * tick.index;

            return (
              <text
                key={`year-${tick.label}-${tick.index}`}
                fill="#5f6773"
                fontSize="12"
                textAnchor={tick.index === 0 ? "start" : tick.index === points.length - 1 ? "end" : "middle"}
                x={x}
                y={chartHeight - 18}
              >
                {tick.label}
              </text>
            );
          })}
        </svg>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        Viser årlige medianverdier fra SSB tabell 11418. Manglende punkter betyr at SSB ikke publiserer tallet.
      </p>
    </section>
  );
}

function getPointValue(
  point: OccupationSectorSalaryTimeSeriesPoint,
  key: keyof OccupationSectorSalaryTimeSeriesPoint,
) {
  const value = point[key];
  return typeof value === "number" ? value : undefined;
}

function getLatestPointWithValues(
  points: OccupationSectorSalaryTimeSeriesPoint[],
  sectors: readonly SectorDefinition[],
  gender: GenderKey,
) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index];

    if (sectors.some((sector) => getPointValue(point, sector.fieldByGender[gender]) !== undefined)) {
      return point;
    }
  }

  return null;
}

function formatSalary(value: number) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

function formatSalaryAxis(value: number) {
  return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 });
}

function formatSalaryShort(value: number) {
  return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 });
}

function formatPeriodLabel(value: string) {
  return value.replace(/\s+/g, " ").trim();
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
