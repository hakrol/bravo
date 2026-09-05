import type { Metadata } from "next";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { JobOfferTool } from "@/components/job-offer-tool";
import { buildJobOfferPageData } from "@/lib/job-offer";
import { buildLonnsjekkPageData } from "@/lib/lonnsjekk";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationMedianSalaryOverview,
  OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Vurder lønnen i et jobbtilbud mot oppdaterte SSB-tall og få et forklart anslag som tar hensyn til relevant erfaring og lederansvar.";

export const metadata: Metadata = {
  title: "Vurder lønnen i jobbtilbudet",
  description,
  alternates: {
    canonical: "/jobbtilbud",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/jobbtilbud",
    siteName: siteConfig.name,
    title: `Vurder lønnen i jobbtilbudet | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Vurder lønnen i jobbtilbudet | ${siteConfig.name}`,
    description,
  },
};

export default async function JobOfferPage() {
  const averageDataset = await getLatestSalaryDataset(
    "occupationDetailed",
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const averageOverview = buildOccupationSalaryOverview(averageDataset);
  const medianOverview = await getOccupationMedianSalaryOverview(
    averageOverview.rows.map((row) => row.occupationCode),
    OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
  );
  const salaryData = buildLonnsjekkPageData({
    averageRows: averageOverview.rows,
    medianRows: medianOverview.rows,
    periodLabel: medianOverview.periodLabel ?? averageOverview.periodLabel,
    contractedSalaryPeriodLabel: medianOverview.periodLabel,
    updated: averageDataset.updated,
  });
  const data = buildJobOfferPageData({
    options: salaryData.options,
    periodLabel: salaryData.contractedSalaryPeriodLabel ?? salaryData.periodLabel,
    updated: salaryData.updated,
  });

  return (
    <main className="job-offer-page min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_32%),#f8fafc] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <JobOfferTool data={data} />
        <CalculatorCrossLinks currentHref="/jobbtilbud" />
      </div>
    </main>
  );
}
