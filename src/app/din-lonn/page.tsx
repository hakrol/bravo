import type { Metadata } from "next";
import { DinLonnTool } from "@/components/din-lonn-tool";
import { buildDinLonnPageData } from "@/lib/din-lonn";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationMedianSalaryOverview,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Din lønn | Lønnsdata Norge",
  description:
    "Sammenlign din brutto månedslønn med median og gjennomsnitt i yrket basert på SSB-data.",
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
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <DinLonnTool data={data} />
      </div>
    </main>
  );
}
