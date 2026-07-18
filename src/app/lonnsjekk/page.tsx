import type { Metadata } from "next";
import { LonnsjekkTool } from "@/components/lonnsjekk-tool";
import { buildLonnsjekkPageData } from "@/lib/lonnsjekk";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationMedianSalaryOverview,
  OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";
import { getGeneratedSsbManifest } from "@/lib/ssb-store";
import { siteConfig } from "@/lib/site-config";

const description =
  "Sammenlign lønnen din med markedet og få en rask vurdering basert på oppdaterte lønnstall fra SSB.";

export const metadata: Metadata = {
  title: "Lønnssjekk: Sammenlign lønnen din med markedet",
  description,
  alternates: {
    canonical: "/lonnsjekk",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/lonnsjekk",
    siteName: siteConfig.name,
    title: `Lønnssjekk: Sammenlign lønnen din med markedet | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Lønnssjekk: Sammenlign lønnen din med markedet | ${siteConfig.name}`,
    description,
  },
};

export default async function LonnsjekkPage() {
  const [averageDataset, generatedManifest] = await Promise.all([
    getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS),
    getGeneratedSsbManifest(),
  ]);
  const averageOverview = buildOccupationSalaryOverview(averageDataset);
  const medianOverview = await getOccupationMedianSalaryOverview(
    averageOverview.rows.map((row) => row.occupationCode),
    OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
  );
  const data = buildLonnsjekkPageData({
    averageRows: averageOverview.rows,
    medianRows: medianOverview.rows,
    averageMonthlySalaryAll: averageOverview.averageMonthlySalary,
    periodLabel: averageOverview.periodLabel ?? medianOverview.periodLabel,
    contractedSalaryPeriodLabel: medianOverview.periodLabel,
    overtimePeriodLabel: getLatestYearFromDatasetTitle(
      generatedManifest.datasets.find(
        (dataset) => dataset.key === "occupationSupplementTimeSeries",
      )?.title,
    ),
    updated: averageDataset.updated,
  });

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <LonnsjekkTool data={data} />
      </div>
    </div>
  );
}

function getLatestYearFromDatasetTitle(title?: string) {
  return title?.match(/(\d{4})\s*$/)?.[1];
}
