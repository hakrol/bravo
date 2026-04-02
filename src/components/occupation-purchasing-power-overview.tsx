import type { OccupationPurchasingPowerOverview } from "@/lib/ssb";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

type OccupationPurchasingPowerOverviewProps = {
  overview: OccupationPurchasingPowerOverview;
};

export function OccupationPurchasingPowerOverviewTable({
  overview,
}: OccupationPurchasingPowerOverviewProps) {
  const gainCount = overview.rows.filter((row) => row.realGrowth > 0).length;
  const lossCount = overview.rows.filter((row) => row.realGrowth < 0).length;

  return (
    <section className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Kjøpekraft per yrke
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Lønnsvekst mot inflasjon
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Oversikten sammenligner lønnsnivået i {overview.latestPeriodLabel.toLowerCase()} med{" "}
            {overview.previousPeriodLabel.toLowerCase()} for samme yrke, og setter det opp mot KPI
            fra SSB. Positiv reallønnsvekst betyr økt kjøpekraft.
          </p>
        </div>

        <div className="grid gap-3">
          <MetricCard
            label="Inflasjon i perioden"
            value={`${percentFormatter.format(overview.inflationGrowth)} %`}
          />
          <MetricCard label="Yrker med økt kjøpekraft" value={String(gainCount)} />
          <MetricCard label="Yrker med tapt kjøpekraft" value={String(lossCount)} />
        </div>
      </section>

      <section className="overflow-hidden rounded-md border bg-[var(--surface)] shadow-sm">
        <div className="flex flex-col gap-2 border-b px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
              Siste sammenlignbare kvartal
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Tabellen er sortert etter reallønnsvekst. Beregning: ((1 + lønnsvekst) / (1 +
              inflasjon)) - 1.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="inline-flex rounded-md border border-[#d6e2d7] bg-white/85 px-3 py-1.5 text-sm font-semibold text-[var(--primary-strong)] shadow-sm">
              {overview.previousPeriodLabel} til {overview.latestPeriodLabel}
            </p>
            <p className="text-sm text-[var(--muted)]">
              Oppdatert lønn: {overview.salaryUpdated ?? "Ukjent"} | KPI:{" "}
              {overview.inflationUpdated ?? "Ukjent"}
            </p>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 bg-[#f8f3ea] text-sm text-slate-700">
              <tr>
                <th className="border-b px-6 py-3 font-semibold">Yrke</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Siste lønn</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Forrige år</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Lønnsvekst</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Inflasjon</th>
                <th className="border-b px-6 py-3 text-right font-semibold">Reallønn</th>
                <th className="border-b px-6 py-3 font-semibold">Innsikt</th>
              </tr>
            </thead>
            <tbody className="bg-white/80 text-sm">
              {overview.rows.map((row) => (
                <tr key={row.rowKey} className="odd:bg-white even:bg-[#fcfaf6]">
                  <td className="border-b px-6 py-4 text-slate-900">{row.occupationLabel}</td>
                  <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                    {formatCurrency(row.latestSalary)}
                  </td>
                  <td className="border-b px-6 py-4 text-right text-slate-700">
                    {formatCurrency(row.previousSalary)}
                  </td>
                  <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                    {formatPercent(row.salaryGrowth)}
                  </td>
                  <td className="border-b px-6 py-4 text-right text-slate-700">
                    {formatPercent(row.inflationGrowth)}
                  </td>
                  <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                    {formatPercent(row.realGrowth)}
                  </td>
                  <td className="border-b px-6 py-4">
                    <span className={getInsightClasses(row.realGrowth)}>
                      {row.purchasingPowerInsight}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-md border bg-white/82 p-4 shadow-sm">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)} kr`;
}

function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`;
}

function getInsightClasses(realGrowth: number) {
  if (realGrowth > 0.25) {
    return "inline-flex rounded-md bg-[#e7f5eb] px-3 py-1 text-xs font-semibold text-[#14532d]";
  }

  if (realGrowth < -0.25) {
    return "inline-flex rounded-md bg-[#fbe9e5] px-3 py-1 text-xs font-semibold text-[#9a3412]";
  }

  return "inline-flex rounded-md bg-[#eef2f7] px-3 py-1 text-xs font-semibold text-slate-700";
}
