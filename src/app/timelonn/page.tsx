import type { Metadata } from "next";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import { convertMonthlySalaryToHourly } from "@/lib/hourly-salary";
import { getHourlySalaryPages } from "@/lib/hourly-salary-pages";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Se estimert timelønn for alle yrker med utgangspunkt i median månedslønn fra SSB.";

const hourlySalaryFilters = [
  { value: "all", label: "Alle timelønnsnivå" },
  { value: "under-250", label: "Under 250 kr/time", max: 250 },
  { value: "250-350", label: "250-350 kr/time", min: 250, max: 350 },
  { value: "350-450", label: "350-450 kr/time", min: 350, max: 450 },
  { value: "over-450", label: "Over 450 kr/time", min: 450 },
];

export const metadata: Metadata = {
  title: "Timelønn for alle yrker",
  description,
  alternates: {
    canonical: "/timelonn",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/timelonn",
    siteName: siteConfig.name,
    title: `Timelønn for alle yrker | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Timelønn for alle yrker | ${siteConfig.name}`,
    description,
  },
};

export default async function TimelonnPage() {
  const [dataset, hourlySalaryPages] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getHourlySalaryPages(),
  ]);
  const overview = buildOccupationMedianGrowthOverview(dataset);
  const pageByOccupationCode = new Map(
    hourlySalaryPages.map((page) => [page.occupationCode, page] as const),
  );

  const rows = overview.rows
    .filter((row) => row.medianAll !== undefined)
    .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"));
  const items: OccupationDirectoryItem[] = rows.map((row) => {
    const page = pageByOccupationCode.get(row.occupationCode);
    const title = formatOccupationDisplayLabel(row.occupationLabel);

    return {
      occupationCode: row.occupationCode,
      title,
      salaryValue:
        row.medianAll !== undefined ? convertMonthlySalaryToHourly(row.medianAll) : undefined,
      href: page?.href,
      searchText: `${row.occupationLabel} ${title} ${row.occupationCode} timelønn timeslønn`,
    };
  });

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-8 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,83,45,0.22),transparent)]" />
          <div className="relative max-w-3xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              Timelønn for alle yrker
            </h1>
          </div>
        </section>

        <OccupationDirectory
          filterLabel="Filtrer på timelønn"
          items={items}
          salaryFilters={hourlySalaryFilters}
          valueLabel="Estimert timelønn"
        />
      </div>
    </div>
  );
}
