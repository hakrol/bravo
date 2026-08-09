import type { Metadata } from "next";
import { OccupationRankingPage } from "@/components/occupation-ranking-page";
import { getOccupationRankingData } from "@/lib/occupation-hero-rankings";
import { siteConfig } from "@/lib/site-config";

const title = "Topp 50 yrker med størst reallønnsvekst siste år";
const description =
  "Se de 50 yrkene med størst reallønnsvekst det siste året, basert på lønnsutvikling og prisvekst fra Statistisk sentralbyrå.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/topp-50-reallonnsvekst",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/topp-50-reallonnsvekst",
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

export default async function TopFiftyRealSalaryGrowthPage() {
  const data = await getOccupationRankingData();

  return <OccupationRankingPage data={data} variant="real-growth" />;
}
