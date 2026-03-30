import type { OccupationSalaryDistribution, OccupationSalaryQuartiles } from "@/lib/occupation-detail-pages";

type OccupationSalaryDistributionProps = {
  distribution: OccupationSalaryDistribution;
};

type DistributionRow = {
  id: "total" | "women" | "men";
  label: string;
  accentClassName: string;
  quartiles: OccupationSalaryQuartiles;
};

const distributionLabels: Record<DistributionRow["id"], string> = {
  total: "Totalt",
  women: "Kvinner",
  men: "Menn",
};

const distributionAccents: Record<DistributionRow["id"], string> = {
  total: "from-[var(--primary)]/20 via-[var(--accent-soft)] to-[var(--primary)]/20",
  women: "from-amber-200 via-amber-100 to-amber-200",
  men: "from-emerald-200 via-emerald-100 to-emerald-200",
};

export function OccupationSalaryDistributionSection({
  distribution,
}: OccupationSalaryDistributionProps) {
  const rows: DistributionRow[] = [
    buildDistributionRow("total", distribution.total),
    buildDistributionRow("women", distribution.women),
    buildDistributionRow("men", distribution.men),
  ].filter((row): row is DistributionRow => Boolean(row));

  if (rows.length === 0) {
    return null;
  }

  const values = rows.flatMap((row) => [row.quartiles.p25, row.quartiles.median, row.quartiles.p75]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = Math.max(Math.round((maxValue - minValue) * 0.14), 2500);
  const scaleMin = Math.max(0, roundToNearestThousand(minValue - padding, "down"));
  const scaleMax = roundToNearestThousand(maxValue + padding, "up");
  const scaleRange = Math.max(scaleMax - scaleMin, 1);

  return (
    <section className="rounded-[2rem] border border-black/10 bg-white/70 px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:px-6 sm:py-7">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Lonnsfordeling
            </p>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {distribution.title ?? "Typisk lonnsspenn"}
              </h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                {distribution.description ??
                  "25.- og 75.-persentilen viser intervallet der den midtre halvdelen av lonnene ligger. Medianen er midtpunktet."}
              </p>
            </div>
          </div>
          <div className="grid max-w-md grid-cols-3 gap-2 text-xs text-[var(--muted)] sm:gap-3">
            <LegendItem label="25 %" tone="bg-slate-300" />
            <LegendItem label="Median" tone="bg-[var(--primary)]" />
            <LegendItem label="75 %" tone="bg-slate-300" />
          </div>
        </div>

        <div className="space-y-4">
          {rows.map((row) => {
            const p25Position = toPercent(row.quartiles.p25, scaleMin, scaleRange);
            const medianPosition = toPercent(row.quartiles.median, scaleMin, scaleRange);
            const p75Position = toPercent(row.quartiles.p75, scaleMin, scaleRange);

            return (
              <article
                key={row.id}
                className="grid gap-4 rounded-[1.5rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,245,240,0.92))] p-4 sm:p-5 lg:grid-cols-[120px_minmax(0,1fr)] lg:items-center"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    {row.label}
                  </p>
                  <p className="text-base font-semibold text-slate-950">
                    {formatCurrency(row.quartiles.median)}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Median</p>
                </div>

                <div className="space-y-4">
                  <div className="relative px-1 pt-8">
                    <div className="absolute left-1 right-1 top-0 flex justify-between text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                      <span>{formatCurrency(scaleMin)}</span>
                      <span>{formatCurrency(scaleMax)}</span>
                    </div>
                    <div className="relative h-16">
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
                        prominent
                      />
                      <Marker
                        label="75 %"
                        value={row.quartiles.p75}
                        position={p75Position}
                        tone="bg-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-3">
                    <ValueChip label="25 %" value={row.quartiles.p25} />
                    <ValueChip label="Median" value={row.quartiles.median} strong />
                    <ValueChip label="75 %" value={row.quartiles.p75} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
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
  prominent = false,
}: {
  label: string;
  value: number;
  position: number;
  tone: string;
  prominent?: boolean;
}) {
  return (
    <div
      className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${position}%` }}
    >
      <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`h-4 w-4 rounded-full border-2 border-white shadow-sm ${tone} ${
          prominent ? "scale-125" : ""
        }`}
      />
      <span className="mt-2 whitespace-nowrap text-sm font-medium text-slate-950">
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function ValueChip({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="rounded-full border border-black/10 bg-white/90 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className={`mt-1 text-sm ${strong ? "font-semibold text-slate-950" : "font-medium text-slate-800"}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function LegendItem({ label, tone }: { label: string; tone: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2">
      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <span>{label}</span>
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
