import type { OccupationPurchasingPowerTimeSeries } from "@/lib/ssb";

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const salaryColor = "#14532d";
const inflationColor = "#b91c1c";
const gainFill = "rgba(22, 101, 52, 0.18)";
const lossFill = "rgba(185, 28, 28, 0.18)";

type ComparisonPoint = {
  x: number;
  ySalary: number;
  yInflation: number;
  salaryGrowth: number;
  inflationGrowth: number;
  periodLabel: string;
  periodCode: string;
};

type FillPolygon = {
  color: string;
  points: Array<{ x: number; y: number }>;
};

type OccupationPurchasingPowerTimeSeriesChartProps = {
  series: OccupationPurchasingPowerTimeSeries;
};

export function OccupationPurchasingPowerTimeSeriesChart({
  series,
}: OccupationPurchasingPowerTimeSeriesChartProps) {
  if (series.points.length === 0) {
    return null;
  }

  const values = series.points.flatMap((point) => [point.salaryGrowth, point.inflationGrowth]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const chartMin = Math.floor((minValue - 0.5) / 1) * 1;
  const chartMax = Math.ceil((maxValue + 0.5) / 1) * 1;
  const chartRange = Math.max(chartMax - chartMin, 1);
  const chartWidth = 920;
  const chartHeight = 320;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 48;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const xStep = series.points.length > 1 ? plotWidth / (series.points.length - 1) : 0;
  const labelStride = series.points.length > 8 ? Math.ceil(series.points.length / 6) : 1;
  const axisTicks = 4;
  const tickValues = Array.from({ length: axisTicks + 1 }, (_, index) => {
    return chartMin + (chartRange / axisTicks) * index;
  });

  const comparisonPoints: ComparisonPoint[] = series.points.map((point, index) => {
    const x = paddingLeft + xStep * index;
    const ySalary =
      paddingTop + plotHeight - ((point.salaryGrowth - chartMin) / chartRange) * plotHeight;
    const yInflation =
      paddingTop + plotHeight - ((point.inflationGrowth - chartMin) / chartRange) * plotHeight;

    return {
      x,
      ySalary,
      yInflation,
      salaryGrowth: point.salaryGrowth,
      inflationGrowth: point.inflationGrowth,
      periodLabel: point.periodLabel,
      periodCode: point.periodCode,
    };
  });

  const fillPolygons = buildFillPolygons(comparisonPoints);
  const salaryPath = buildLinePath(
    comparisonPoints.map((point) => ({ x: point.x, y: point.ySalary })),
  );
  const inflationPath = buildLinePath(
    comparisonPoints.map((point) => ({ x: point.x, y: point.yInflation })),
  );

  return (
    <section className="rounded-xl border bg-[var(--surface)] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Reallønnsutvikling mot inflasjon
          </h3>
          <p className="mt-1 max-w-3xl text-sm text-[var(--muted)]">
            Årsvekst for gjennomsnittlig lønn for begge kjønn sammenlignet med inflasjon i samme
            kvartal. Grønt område betyr reallønnsvekst, rødt betyr at inflasjonen er høyere.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ backgroundColor: salaryColor }} />
            <span>Lønnsvekst</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ backgroundColor: inflationColor }} />
            <span>Inflasjon</span>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label={`Reallønnsutvikling for ${series.occupationLabel}`}
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
                  {percentFormatter.format(tickValue)} %
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

          {fillPolygons.map((polygon, index) => (
            <polygon
              key={`${polygon.color}-${index}`}
              fill={polygon.color}
              points={polygon.points.map((point) => `${point.x},${point.y}`).join(" ")}
            />
          ))}

          <path
            d={salaryPath}
            fill="none"
            stroke={salaryColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            d={inflationPath}
            fill="none"
            stroke={inflationColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />

          {comparisonPoints.map((point) => (
            <g key={point.periodCode}>
              <circle cx={point.x} cy={point.ySalary} fill={salaryColor} r="3.5" />
              <circle cx={point.x} cy={point.yInflation} fill={inflationColor} r="3.5" />
              <title>
                {`${formatPeriodLabel(point.periodLabel)}: lønnsvekst ${percentFormatter.format(point.salaryGrowth)} %, inflasjon ${percentFormatter.format(point.inflationGrowth)} %`}
              </title>
            </g>
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
                  index === 0
                    ? "start"
                    : index === series.points.length - 1
                      ? "end"
                      : "middle"
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
  );
}

function buildFillPolygons(points: ComparisonPoint[]): FillPolygon[] {
  const polygons: FillPolygon[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const currentDiff = current.salaryGrowth - current.inflationGrowth;
    const nextDiff = next.salaryGrowth - next.inflationGrowth;

    if (currentDiff === 0 && nextDiff === 0) {
      continue;
    }

    const currentColor = currentDiff >= 0 ? gainFill : lossFill;
    const nextColor = nextDiff >= 0 ? gainFill : lossFill;

    if (currentDiff === 0) {
      polygons.push({
        color: nextDiff > 0 ? gainFill : lossFill,
        points: [
          { x: current.x, y: current.ySalary },
          { x: next.x, y: next.ySalary },
          { x: next.x, y: next.yInflation },
        ],
      });
      continue;
    }

    if (nextDiff === 0) {
      polygons.push({
        color: currentDiff > 0 ? gainFill : lossFill,
        points: [
          { x: current.x, y: current.ySalary },
          { x: next.x, y: next.ySalary },
          { x: current.x, y: current.yInflation },
        ],
      });
      continue;
    }

    if (currentColor === nextColor) {
      polygons.push({
        color: currentColor,
        points: [
          { x: current.x, y: current.ySalary },
          { x: next.x, y: next.ySalary },
          { x: next.x, y: next.yInflation },
          { x: current.x, y: current.yInflation },
        ],
      });
      continue;
    }

    const intersection = interpolateIntersection(current, next);

    polygons.push({
      color: currentDiff > 0 ? gainFill : lossFill,
      points: [
        { x: current.x, y: current.ySalary },
        { x: intersection.x, y: intersection.y },
        { x: current.x, y: current.yInflation },
      ],
    });
    polygons.push({
      color: nextDiff > 0 ? gainFill : lossFill,
      points: [
        { x: next.x, y: next.ySalary },
        { x: next.x, y: next.yInflation },
        { x: intersection.x, y: intersection.y },
      ],
    });
  }

  return polygons;
}

function interpolateIntersection(current: ComparisonPoint, next: ComparisonPoint) {
  const currentDiff = current.salaryGrowth - current.inflationGrowth;
  const nextDiff = next.salaryGrowth - next.inflationGrowth;
  const ratio = currentDiff / (currentDiff - nextDiff);
  const x = current.x + (next.x - current.x) * ratio;
  const y = current.ySalary + (next.ySalary - current.ySalary) * ratio;

  return { x, y };
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
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
