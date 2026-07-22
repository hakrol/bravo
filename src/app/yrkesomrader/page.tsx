import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import { listOccupationAreas } from "@/lib/occupation-areas";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Utforsk alle yrkesområder i Norge og sammenlign median månedslønn for beslektede yrker basert på oppdaterte tall fra SSB.";

export const metadata: Metadata = {
  title: "Alle yrkesområder",
  description,
  alternates: {
    canonical: "/yrkesomrader",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/yrkesomrader",
    siteName: siteConfig.name,
    title: `Alle yrkesområder | ${siteConfig.name}`,
    description,
  },
};

export default async function OccupationAreasOverviewPage() {
  const dataset = await getLatestOccupationMedianMonthlySalaryDataset();
  const areas = listOccupationAreas(dataset);

  return (
    <OccupationLinkGrid
      colorByOccupationGroup
      description={description}
      items={areas.map((area) => ({
        title: area.label,
        href: `/yrkesomrade/${area.slug}`,
        occupationGroupCode: area.groupCode,
        salaryValue: area.medianMonthlySalary,
      }))}
      plainCenteredHeader
      sortBySalary
      title="Alle yrkesområder"
    />
  );
}
