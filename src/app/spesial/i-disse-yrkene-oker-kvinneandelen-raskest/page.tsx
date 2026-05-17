import type { Metadata } from "next";
import { WomenShareSpecialArticle } from "@/components/women-share-special-article";
import { siteConfig } from "@/lib/site-config";
import { getWomenShareSpecialData } from "@/lib/women-share-special";

const description =
  "Datadrevet spesialartikkel om yrkene der kvinneandelen har økt mest, basert på SSBs lønnstakerstatistikk.";

export const metadata: Metadata = {
  title: "I disse yrkene øker kvinneandelen raskest",
  description,
  alternates: {
    canonical: "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest",
  },
  openGraph: {
    type: "article",
    locale: "nb_NO",
    url: "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest",
    siteName: siteConfig.name,
    title: `I disse yrkene øker kvinneandelen raskest | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `I disse yrkene øker kvinneandelen raskest | ${siteConfig.name}`,
    description,
  },
};

export default function FastestGrowingWomenShareSpecialPage() {
  const data = getWomenShareSpecialData();

  return <WomenShareSpecialArticle data={data} />;
}
