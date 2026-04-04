import type { Metadata } from "next";
import { DinLonnTool } from "@/components/din-lonn-tool";
import { buildDinLonnPageData } from "@/lib/din-lonn";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationMedianSalaryOverview,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Sammenlign din brutto månedslønn med median avtalt månedslønn og gjennomsnitt i yrket basert på SSB-data.";

export const metadata: Metadata = {
  title: "Din lønn",
  description,
  alternates: {
    canonical: "/din-lonn",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/din-lonn",
    siteName: siteConfig.name,
    title: `Din lønn | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Din lønn | ${siteConfig.name}`,
    description,
  },
};

export default async function DinLonnPage() {
  const averageDataset = await getLatestSalaryDataset(
    "occupationDetailed",
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const averageOverview = buildOccupationSalaryOverview(averageDataset);
  const medianOverview = await getOccupationMedianSalaryOverview(
    averageOverview.rows.map((row) => row.occupationCode),
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const data = buildDinLonnPageData({
    averageRows: averageOverview.rows,
    medianRows: medianOverview.rows,
    averageMonthlySalaryAll: averageOverview.averageMonthlySalary,
    periodLabel: averageOverview.periodLabel ?? medianOverview.periodLabel,
    updated: averageDataset.updated,
  });

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <DinLonnTool data={data} />
      </div>
    </div>
  );
}
