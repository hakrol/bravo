import { HomeOccupationSalarySearch } from "@/components/home-occupation-salary-search";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestAndPreviousYearSalaryDatasets,
  OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
} from "@/lib/ssb";

export default async function HomePage() {
  const { latestDataset, previousDataset } = await getLatestAndPreviousYearSalaryDatasets(
    "occupationDetailed",
    OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
  );
  const overview = buildOccupationMedianGrowthOverview(latestDataset, previousDataset);

  return (
    <div className="px-5 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="fade-up relative overflow-hidden px-6 pt-10 pb-16 sm:px-10 sm:pt-12 sm:pb-20 lg:px-12 lg:pt-14 lg:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,83,45,0.12),transparent_45%)]" />
          <div className="absolute left-1/2 top-12 h-48 w-48 -translate-x-1/2 rounded-full bg-[var(--accent-soft)] blur-3xl" />
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-[11%] top-[20%] h-2.5 w-2.5 rounded-full bg-[#dce8df]" />
            <div className="absolute left-[24%] top-[14%] h-3 w-3 rounded-full bg-[#eef5ef]" />
            <div className="absolute right-[18%] top-[24%] h-2 w-2 rounded-full bg-[#dce8df]" />
            <div className="absolute right-[31%] top-[37%] h-2.5 w-2.5 rounded-full bg-[#eef5ef]" />
            <div className="absolute left-[18%] bottom-[28%] h-2.5 w-2.5 rounded-full bg-[#eef5ef]" />
            <div className="absolute right-[12%] bottom-[22%] h-2 w-2 rounded-full bg-[#dce8df]" />
          </div>

          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              Hva tjener folk
              <span className="mt-1 block text-[var(--primary)]">i ditt yrke</span>
            </h1>
          </div>
        </section>

        <HomeOccupationSalarySearch
          lastUpdated={latestDataset.updated}
          periodLabel={overview.periodLabel}
          rows={overview.rows}
        />
      </div>
    </div>
  );
}
