import type { OccupationSalaryTimeSeries } from "@/lib/ssb";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const signedPercentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  signDisplay: "always",
});

const seriesDefinitions = [
  { key: "valueAll", label: "Begge kjønn", color: "#14532d" },
  { key: "valueWomen", label: "Kvinner", color: "#b45309" },
  { key: "valueMen", label: "Menn", color: "#1d4ed8" },
] as const;

type OccupationSalaryTimeSeriesProps = {
  series: OccupationSalaryTimeSeries;
};

type ChartPoint = {
  x: number;
  y: number;
  label: string;
  value: number;
  growthPercent?: number;
  color: string;
  seriesKey: (typeof seriesDefinitions)[number]["key"];
};

export function OccupationSalaryTimeSeriesChart({
  series,
}: OccupationSalaryTimeSeriesProps) {
  const availableValues = series.points.flatMap((point) =>
    [point.valueAll, point.valueWomen, point.valueMen].filter((value): value is number => {
      return value !== undefined;
    }),
  );
  const minValue = availableValues.length > 0 ? Math.min(...availableValues) : 0;
  const maxValue = availableValues.length > 0 ? Math.max(...availableValues) : 0;
  const chartMin = Math.floor(minValue / 1000) * 1000;
  const chartMax = Math.ceil(maxValue / 1000) * 1000;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const chartWidth = 920;
  const chartHeight = 360;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 16;
  const paddingBottom = 48;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = series.points.length > 1 ? plotWidth / (series.points.length - 1) : 0;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });
  const labelStride = series.points.length > 8 ? Math.ceil(series.points.length / 6) : 1;
  const visibleGrowthLabels = seriesDefinitions.flatMap((definition) => {
    const seriesPoints = series.points.flatMap((point, index) => {
      const value = point[definition.key];

      if (value === undefined) {
        return [];
      }

      const x = paddingLeft + xStep * index;
      const y = paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight;
      const previousValue = index > 0 ? series.points[index - 1]?.[definition.key] : undefined;
      const growthPercent =
        previousValue !== undefined && previousValue !== 0
          ? ((value - previousValue) / previousValue) * 100
          : undefined;

      return [
        {
          x,
          y,
          label: point.periodLabel,
          value,
          growthPercent,
          color: definition.color,
          seriesKey: definition.key,
        },
      ];
    });

    return seriesPoints.reduce<Array<ChartPoint>>((labels, point) => {
      if (point.growthPercent === undefined) {
        return labels;
      }

      const previousLabel = labels.at(-1);

      if (previousLabel) {
        const xDistance = Math.abs(point.x - previousLabel.x);
        const yDistance = Math.abs(point.y - previousLabel.y);

        if (xDistance < 48 && yDistance < 24) {
          return labels;
        }
      }

      return [...labels, point];
    }, []);
  });

  return (
    <section className="grid gap-6">
      <section className="rounded-xl border bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
              Tidsserie for {series.occupationLabel.toLowerCase()}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Kvartalsvis utvikling for samme lønnsmål gjennom hele tilgjengelige tidsserien.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {seriesDefinitions.map((definition) => (
              <div key={definition.key} className="flex items-center gap-2 text-sm text-slate-700">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: definition.color }}
                />
                <span>{definition.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <svg
            aria-label={`Tidsserie for ${series.occupationLabel}`}
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

            {seriesDefinitions.map((definition) => {
              const points = series.points.flatMap((point, index) => {
                const value = point[definition.key];

                if (value === undefined) {
                  return [];
                }

                const x = paddingLeft + xStep * index;
                const y = paddingTop + plotHeight - ((value - chartMin) / chartRange) * plotHeight;

                return [{ x, y, label: point.periodLabel, value }];
              });

              if (points.length === 0) {
                return null;
              }

              const path = points
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
                    strokeWidth="3"
                  />
                  {points.map((point) => (
                    <g key={`${definition.key}-${point.label}`}>
                      <circle cx={point.x} cy={point.y} fill={definition.color} r="4" />
                      <title>
                        {`${definition.label}: ${formatCurrency(point.value)} (${formatPeriodLabel(point.label)})`}
                      </title>
                    </g>
                  ))}
                </g>
              );
            })}

            {visibleGrowthLabels.map((point) => (
              <text
                key={`growth-${point.seriesKey}-${point.x}-${point.y}`}
                fill={point.color}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                x={point.x}
                y={Math.max(point.y - 10, paddingTop + 12)}
              >
                {formatPercent(point.growthPercent ?? 0)} %
              </text>
            ))}

            {series.points.map((point, index) => {
              if (index % labelStride !== 0 && index !== series.points.length - 1) {
                return null;
              }

              const x = paddingLeft + xStep * index;

              return (
                <text
                  key={point.periodCode}
                  fill="#5f6773"
                  fontSize="12"
                  textAnchor={
                    index === 0 ? "start" : index === series.points.length - 1 ? "end" : "middle"
                  }
                  x={x}
                  y={chartHeight - 18}
                >
                  {formatShortPeriodLabel(point.periodLabel)}
                </text>
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

function formatPercent(value: number) {
  return signedPercentFormatter.format(value);
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
  return `${quarter}.kv. ${year.slice(2)}`;
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
