import type { Metadata } from "next";
import { OccupationRankingPage } from "@/components/occupation-ranking-page";
import { getOccupationRankingData } from "@/lib/occupation-hero-rankings";
import { siteConfig } from "@/lib/site-config";

const title = "Topp 50 yrker med størst lønnsvekst siste år";
const description =
  "Se de 50 yrkene med størst prosentvis vekst i median månedslønn fra siste tilgjengelige år til året før, basert på tall fra SSB.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/topp-50-lonnsvekst",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/topp-50-lonnsvekst",
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default async function TopFiftySalaryGrowthPage() {
  const data = await getOccupationRankingData();

  return <OccupationRankingPage data={data} variant="growth" />;
}
