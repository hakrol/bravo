import { OccupationSalaryOverview } from "@/components/occupation-salary-overview";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { getOccupationGroupBySlug, listOccupationGroups } from "@/lib/occupation-groups";
import { getLatestAndPreviousYearOccupationMedianMonthlySalaryDatasets } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";
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

  const description = `Se siste tilgjengelige lønnsdata for ${group.label.toLowerCase()} og sammenlign yrkene i feltet.`;
  const canonicalPath = `/yrkesgrupper/${group.slug}`;

  return {
    title: `${group.label} | Yrkesgrupper`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: canonicalPath,
      siteName: siteConfig.name,
      title: `${group.label} | ${siteConfig.name}`,
      description,
    },
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

  const { latestDataset, previousDataset } =
    await getLatestAndPreviousYearOccupationMedianMonthlySalaryDatasets();
  const overview = buildOccupationMedianGrowthOverview(latestDataset, previousDataset, {
    occupationCodes: listOccupationCodesForGroup(group.code),
  });
  const groupMedianSalary = findGroupMedianSalary(latestDataset, group.code);

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            Lønn for {group.label.toLowerCase()}
          </h1>
          <p className="max-w-3xl text-base text-[var(--muted)] sm:text-lg">
            {group.description}
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-md border bg-[var(--surface)] px-6 py-5 shadow-sm">
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {group.label}
            </p>
          </article>
          <article className="rounded-md border bg-[var(--surface)] px-6 py-5 shadow-sm">
            <p className="text-sm font-medium text-[var(--muted)]">
              Median samlet månedslønn i {group.label.toLowerCase()}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {formatSalary(groupMedianSalary)}
            </p>
          </article>
          <article className="rounded-md border bg-[var(--surface)] px-6 py-5 shadow-sm">
            <p className="text-sm font-medium text-[var(--muted)]">Antall yrker</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {overview.rows.length}
            </p>
          </article>
        </section>

        <OccupationSalaryOverview
          rows={overview.rows}
          initialSortDirection="desc"
          initialSortKey="medianMen"
          lastUpdated={latestDataset.updated}
          showLastUpdated={false}
          periodLabel={overview.periodLabel}
          title={`Detaljyrker i ${group.label.toLowerCase()}`}
          description={`Tabellen viser siste tilgjengelige median samlet månedslønn for 4-siffer-yrker innen ${group.label.toLowerCase()}, fordelt på kvinner og menn.`}
          emptyStateText={`Fant ingen detaljyrker for ${group.label.toLowerCase()} akkurat nå.`}
        />
      </div>
    </div>
  );
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}

function listOccupationCodesForGroup(groupCode: string) {
  const codes: string[] = [];

  for (let code = 0; code <= 9999; code += 1) {
    const normalizedCode = code.toString().padStart(4, "0");

    if (normalizedCode.startsWith(groupCode)) {
      codes.push(normalizedCode);
    }
  }

  return codes;
}

function findGroupMedianSalary(
  dataset: {
    dimensions: string[];
    rows: Array<{
      dimensions: Record<string, { code: string; label: string }>;
      value: number | null;
    }>;
  },
  groupCode: string,
) {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);

  if (!occupationDimensionCode || !genderDimensionCode) {
    return undefined;
  }

  const match = dataset.rows.find((row) => {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];

    return occupation?.code === groupCode && gender?.code === "0" && row.value !== null;
  });

  return match?.value ?? undefined;
}

function findDimensionCode(
  dimensions: string[],
  rows: Array<{ dimensions: Record<string, { label: string }> }>,
  candidates: string[],
) {
  const normalizedCandidates = candidates.map(normalizeText);

  return dimensions.find((dimensionCode) => {
    const normalizedDimensionCode = normalizeText(dimensionCode);

    if (normalizedCandidates.some((candidate) => normalizedDimensionCode.includes(candidate))) {
      return true;
    }

    const sampleLabel = rows[0]?.dimensions[dimensionCode]?.label;

    if (!sampleLabel) {
      return false;
    }

    const normalizedLabel = normalizeText(sampleLabel);
    return normalizedCandidates.some((candidate) => normalizedLabel.includes(candidate));
  });
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
