import { OccupationSalaryOverview } from "@/components/occupation-salary-overview";
import { buildOccupationGroupSalaryOverview } from "@/lib/occupation-group-salary-overview";
import { getOccupationGroupBySlug, listOccupationGroups } from "@/lib/occupation-groups";
import { getLatestSalaryDataset, OCCUPATION_MONTHLY_SALARY_FILTERS } from "@/lib/ssb";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type OccupationGroupPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export async function generateStaticParams() {
  return listOccupationGroups().map((group) => ({
    slug: group.slug,
  }));
}

export async function generateMetadata({
  params,
}: OccupationGroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = getOccupationGroupBySlug(slug);

  if (!group) {
    return {};
  }

  return {
    title: `${group.label} | Yrker`,
    description: `Se siste tilgjengelige lønnsdata for ${group.label.toLowerCase()} og sammenlign yrkene i feltet.`,
  };
}

export default async function OccupationGroupPage({
  params,
}: OccupationGroupPageProps) {
  const { slug } = await params;
  const group = getOccupationGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  const dataset = await getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS);
  const overview = buildOccupationGroupSalaryOverview(dataset, group.code);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
            Yrkesfelt
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            Lønn for {group.label.toLowerCase()}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            {group.description} Siden viser toppnivået i SSBs yrkesdimensjon og detaljerte
            4-siffer-yrker som hører til feltet.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-md border bg-[var(--surface)] px-6 py-5 shadow-sm">
            <p className="text-sm font-medium text-[var(--muted)]">Yrkesfelt</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {group.label}
            </p>
          </article>
          <article className="rounded-md border bg-[var(--surface)] px-6 py-5 shadow-sm">
            <p className="text-sm font-medium text-[var(--muted)]">Lønn for toppnivå</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {formatSalary(overview.groupRow.salaryAll)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {overview.measureLabel ?? "Gjennomsnittlig avtalt månedslønn"}
            </p>
          </article>
          <article className="rounded-md border bg-[var(--surface)] px-6 py-5 shadow-sm">
            <p className="text-sm font-medium text-[var(--muted)]">Detaljyrker i feltet</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {overview.rows.length}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              4-siffer-yrker som starter med {group.code}
            </p>
          </article>
        </section>

        <OccupationSalaryOverview
          rows={overview.rows}
          lastUpdated={dataset.updated}
          periodLabel={overview.periodLabel}
          title={`Detaljyrker i ${group.label.toLowerCase()}`}
          description={`Tabellen viser siste tilgjengelige ${(
            overview.measureLabel ?? "gjennomsnittlige avtalt månedslønn"
          ).toLowerCase()} for 4-siffer-yrker innen ${group.label.toLowerCase()}, fordelt på begge kjønn, kvinner og menn.`}
          emptyStateText={`Fant ingen detaljyrker for ${group.label.toLowerCase()} akkurat nå.`}
        />
      </div>
    </main>
  );
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}
