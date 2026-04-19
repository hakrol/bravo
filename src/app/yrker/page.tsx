import type { Metadata } from "next";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Se alle yrker med median samlet månedslønn for begge kjønn, basert på oppdaterte lønnstall fra SSB.";

export const metadata: Metadata = {
  title: "Alle yrker",
  description,
  alternates: {
    canonical: "/yrker",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/yrker",
    siteName: siteConfig.name,
    title: `Alle yrker | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Alle yrker | ${siteConfig.name}`,
    description,
  },
};

export default async function YrkerPage() {
  const [dataset, occupationIndex] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getOccupationDetailViewModelIndex(),
  ]);
  const overview = buildOccupationMedianGrowthOverview(dataset);
  const firstSlugByOccupationCode = new Map<string, string>();

  for (const page of occupationIndex.pages) {
    if (!firstSlugByOccupationCode.has(page.occupationCode)) {
      firstSlugByOccupationCode.set(page.occupationCode, page.slug);
    }
  }

  const rows = overview.rows
    .filter((row) => row.medianAll !== undefined)
    .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"));
  const items: OccupationDirectoryItem[] = rows.map((row) => {
    const slug = firstSlugByOccupationCode.get(row.occupationCode);

    return {
      occupationCode: row.occupationCode,
      title: formatOccupationDisplayLabel(row.occupationLabel),
      monthlySalary: row.medianAll,
      href: slug ? `/yrke/${slug}` : undefined,
      searchText: `${row.occupationLabel} ${formatOccupationDisplayLabel(row.occupationLabel)} ${row.occupationCode}`,
    };
  });

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-8 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,83,45,0.22),transparent)]" />
          <div className="relative max-w-3xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              Alle yrker
            </h1>
          </div>
        </section>

        <OccupationDirectory items={items} />
      </div>
    </div>
  );
}
