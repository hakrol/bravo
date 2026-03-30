import type { OccupationSalaryDistribution, OccupationSalaryQuartiles } from "@/lib/occupation-detail-pages";

type OccupationSalaryDistributionProps = {
  distribution: OccupationSalaryDistribution;
};

type DistributionRow = {
  id: "women" | "men";
  label: string;
  accentClassName: string;
  quartiles: OccupationSalaryQuartiles;
};

const distributionLabels: Record<DistributionRow["id"], string> = {
  women: "Kvinner",
  men: "Menn",
};

const distributionAccents: Record<DistributionRow["id"], string> = {
  women: "from-amber-200 via-amber-100 to-amber-200",
  men: "from-emerald-200 via-emerald-100 to-emerald-200",
};

export function OccupationSalaryDistributionSection({
  distribution,
}: OccupationSalaryDistributionProps) {
  const rows: DistributionRow[] = [
    buildDistributionRow("women", distribution.women),
    buildDistributionRow("men", distribution.men),
  ].filter((row): row is DistributionRow => Boolean(row));

  if (rows.length === 0) {
    return null;
  }

  const values = rows.flatMap((row) =>
    [row.quartiles.p25, row.quartiles.median, row.quartiles.p75, row.quartiles.average].filter(
      (value): value is number => Number.isFinite(value),
    ),
  );
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = Math.max(Math.round((maxValue - minValue) * 0.14), 2500);
  const scaleMin = Math.max(0, roundToNearestThousand(minValue - padding, "down"));
  const scaleMax = roundToNearestThousand(maxValue + padding, "up");
  const scaleRange = Math.max(scaleMax - scaleMin, 1);

  return (
    <section className="space-y-5">
      {rows.map((row) => {
        const p25Position = toPercent(row.quartiles.p25, scaleMin, scaleRange);
        const medianPosition = toPercent(row.quartiles.median, scaleMin, scaleRange);
        const p75Position = toPercent(row.quartiles.p75, scaleMin, scaleRange);
        const averagePosition =
          row.quartiles.average !== undefined
            ? toPercent(row.quartiles.average, scaleMin, scaleRange)
            : null;
        const averageOverlapsMedian =
          averagePosition !== null && Math.abs(averagePosition - medianPosition) < 3.5;
        const medianOffset = averageOverlapsMedian
          ? row.quartiles.average >= row.quartiles.median
            ? -36
            : 36
          : 0;
        const averageOffset = averageOverlapsMedian
          ? row.quartiles.average >= row.quartiles.median
            ? 36
            : -36
          : 0;

        return (
          <article key={row.id} className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {row.label}
            </p>
            <div className="relative px-1">
              <div className="relative h-20">
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-300" />
                <div
                  className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r ${row.accentClassName}`}
                  style={{
                    left: `${p25Position}%`,
                    width: `${Math.max(p75Position - p25Position, 1)}%`,
                  }}
                />
                <Marker
                  label="25 %"
                  value={row.quartiles.p25}
                  position={p25Position}
                  tone="bg-slate-700"
                />
                <Marker
                  label="Median"
                  value={row.quartiles.median}
                  position={medianPosition}
                  tone="bg-[var(--primary)]"
                  offsetPx={medianOffset}
                  labelOffsetY={averageOverlapsMedian ? -8 : 0}
                  valueOffsetY={averageOverlapsMedian ? 8 : 0}
                />
                {averagePosition !== null && row.quartiles.average !== undefined ? (
                  <Marker
                    label="Gjennomsnitt"
                    value={row.quartiles.average}
                    position={averagePosition}
                    tone="bg-slate-500"
                    offsetPx={averageOffset}
                    labelOffsetY={averageOverlapsMedian ? -18 : 0}
                    valueOffsetY={averageOverlapsMedian ? 8 : 0}
                  />
                ) : null}
                <Marker
                  label="75 %"
                  value={row.quartiles.p75}
                  position={p75Position}
                  tone="bg-slate-700"
                />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function buildDistributionRow(
  id: DistributionRow["id"],
  quartiles?: OccupationSalaryQuartiles,
) {
  if (!quartiles || !hasCompleteQuartiles(quartiles)) {
    return null;
  }

  return {
    id,
    label: distributionLabels[id],
    accentClassName: distributionAccents[id],
    quartiles,
  };
}

function hasCompleteQuartiles(quartiles: OccupationSalaryQuartiles) {
  return [quartiles.p25, quartiles.median, quartiles.p75].every((value) => Number.isFinite(value));
}

function Marker({
  label,
  value,
  position,
  tone,
  offsetPx = 0,
  labelOffsetY = 0,
  valueOffsetY = 0,
}: {
  label: string;
  value: number;
  position: number;
  tone: string;
  offsetPx?: number;
  labelOffsetY?: number;
  valueOffsetY?: number;
}) {
  return (
    <div
      className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `calc(${position}% + ${offsetPx}px)` }}
    >
      <span
        className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"
        style={labelOffsetY === 0 ? undefined : { transform: `translateY(${labelOffsetY}px)` }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`h-4 w-4 rounded-full border-2 border-white shadow-sm ${tone}`}
      />
      <span
        className="mt-2 whitespace-nowrap text-sm font-medium text-slate-950"
        style={valueOffsetY === 0 ? undefined : { transform: `translateY(${valueOffsetY}px)` }}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function toPercent(value: number, scaleMin: number, scaleRange: number) {
  return ((value - scaleMin) / scaleRange) * 100;
}

function roundToNearestThousand(value: number, direction: "up" | "down") {
  const rounded =
    direction === "up" ? Math.ceil(value / 1000) * 1000 : Math.floor(value / 1000) * 1000;

  return Number.isFinite(rounded) ? rounded : value;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}
