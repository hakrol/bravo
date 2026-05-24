import type { Metadata } from "next";
import { HomeLatestBlogSection } from "@/components/home-latest-blog-section";
import { HomeOccupationSalarySearch } from "@/components/home-occupation-salary-search";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { getAllBlogPosts } from "@/lib/blog";
import {
  getLatestAndPreviousYearOccupationMedianMonthlySalaryDatasets,
  getOccupationPurchasingPowerTimeSeries,
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
  const [
    { latestDataset, previousDataset },
    allOccupationsSalarySeries,
    allOccupationsPurchasingPowerSeries,
    blogPosts,
  ] = await Promise.all([
    getLatestAndPreviousYearOccupationMedianMonthlySalaryDatasets(),
    getOccupationSalaryTimeSeries("0-9"),
    getOccupationPurchasingPowerTimeSeries("0-9"),
    getAllBlogPosts(),
  ]);
  const overview = buildOccupationMedianGrowthOverview(latestDataset, previousDataset);
  const latestBlogPosts = blogPosts.slice(0, 3);

  return (
    <div className="px-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <HomeOccupationSalarySearch
          allOccupationsPurchasingPowerSeries={allOccupationsPurchasingPowerSeries}
          allOccupationsSalarySeries={allOccupationsSalarySeries}
          rows={overview.rows}
        />
        <HomeLatestBlogSection posts={latestBlogPosts} />
      </div>
    </div>
  );
}
