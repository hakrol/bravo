import type { Metadata } from "next";
import { HomeOccupationSalarySearch } from "@/components/home-occupation-salary-search";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestAndPreviousYearOccupationMedianMonthlySalaryDatasets,
  getOccupationSalaryTimeSeries,
} from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Se hva ulike yrker tjener i Norge, sammenlign lønn og utforsk oppdaterte lønnstall fra SSB.";

export const metadata: Metadata = {
  title: "Hva tjener ulike yrker i Norge?",
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/",
    siteName: siteConfig.name,
    title: `Hva tjener ulike yrker i Norge? | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Hva tjener ulike yrker i Norge? | ${siteConfig.name}`,
    description,
  },
};

export default async function HomePage() {
  const [{ latestDataset, previousDataset }, allOccupationsSalarySeries] = await Promise.all([
    getLatestAndPreviousYearOccupationMedianMonthlySalaryDatasets(),
    getOccupationSalaryTimeSeries("0-9"),
  ]);
  const overview = buildOccupationMedianGrowthOverview(latestDataset, previousDataset);

  return (
    <div className="px-5 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
      <div className="mx-auto w-full max-w-7xl">
        <HomeOccupationSalarySearch
          allOccupationsSalarySeries={allOccupationsSalarySeries}
          lastUpdated={latestDataset.updated}
          periodLabel={overview.periodLabel}
          rows={overview.rows}
        />
      </div>
    </div>
  );
}
