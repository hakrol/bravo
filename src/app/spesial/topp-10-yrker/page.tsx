import type { Metadata } from "next";
import { TopOccupationsSpecial } from "@/components/top-occupations-special";
import { siteConfig } from "@/lib/site-config";
import { getTopOccupationsSpecialData } from "@/lib/top-occupations-special";

const description =
  "Interaktiv spesialside som rangerer de 10 yrkene med høyest lønn i Norge, med lønn, arbeidstakere og nøkkelfakta fra SSB.";

export const metadata: Metadata = {
  title: "Topp 10 yrker med høyest lønn",
  description,
  alternates: {
    canonical: "/spesial/topp-10-yrker",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/spesial/topp-10-yrker",
    siteName: siteConfig.name,
    title: `Topp 10 yrker med høyest lønn | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Topp 10 yrker med høyest lønn | ${siteConfig.name}`,
    description,
  },
};

export default function TopOccupationsSpecialPage() {
  const data = getTopOccupationsSpecialData();

  return <TopOccupationsSpecial data={data} />;
}
