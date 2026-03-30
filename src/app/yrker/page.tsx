import { OccupationSalaryOverview } from "@/components/occupation-salary-overview";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import { getLatestSalaryDataset, OCCUPATION_MONTHLY_SALARY_FILTERS } from "@/lib/ssb";

export default async function OccupationSalaryPage() {
  const dataset = await getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS);
  const overview = buildOccupationSalaryOverview(dataset);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            SSB tabell 11658
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            Siste gjennomsnittlige avtalte månedslønn for alle yrker
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            Oversikten viser siste tilgjengelige gjennomsnittlige avtalte månedslønn per yrke,
            fordelt på begge kjønn, kvinner og menn.
          </p>
        </div>

        <section className="rounded-xl border bg-[var(--surface)] px-6 py-5 shadow-sm">
          <p className="text-sm leading-7 text-slate-700">
            Kilde: Statistisk sentralbyrå. Siden bruker det sentrale SSB-laget i{" "}
            <code>src/lib</code>, velger siste tilgjengelige gjennomsnittlige avtalte
            månedslønnsmål og normaliserer json-stat-responsen til en tabell med kjønnsfordeling.
          </p>
        </section>

        <OccupationSalaryOverview
          rows={overview.rows}
          lastUpdated={dataset.updated}
          periodLabel={overview.periodLabel}
        />
      </div>
    </main>
  );
}
