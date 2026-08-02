import type { Metadata } from "next";
import { OccupationRankingPage } from "@/components/occupation-ranking-page";
import { getOccupationRankingData } from "@/lib/occupation-hero-rankings";
import { siteConfig } from "@/lib/site-config";

const title = "Topp 50 yrker med høyest lønnsnivå";
const description =
  "Se de 50 yrkene med høyest median månedslønn i Norge, rangert med siste tilgjengelige tall fra Statistisk sentralbyrå.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/topp-50-lonnsniva",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/topp-50-lonnsniva",
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

export default async function TopFiftySalaryLevelPage() {
  const data = await getOccupationRankingData();

  return <OccupationRankingPage data={data} variant="salary" />;
}
