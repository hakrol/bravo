import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import { listOccupationFamilies } from "@/lib/occupation-families";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Utforsk alle yrkesfamilier i Norge og sammenlign median månedslønn for beslektede yrker basert på oppdaterte tall fra SSB.";

export const metadata: Metadata = {
  title: "Alle yrkesfamilier",
  description,
  alternates: {
    canonical: "/yrkesfamilier",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/yrkesfamilier",
    siteName: siteConfig.name,
    title: `Alle yrkesfamilier | ${siteConfig.name}`,
    description,
  },
};

export default async function OccupationFamiliesOverviewPage() {
  const dataset = await getLatestOccupationMedianMonthlySalaryDataset();
  const families = listOccupationFamilies(dataset);

  return (
    <OccupationLinkGrid
      colorByOccupationGroup
      description={description}
      items={families.map((family) => ({
        title: family.label,
        href: `/yrkesfamilie/${family.slug}`,
        occupationGroupCode: family.groupCode,
        salaryValue: family.medianMonthlySalary,
      }))}
      plainCenteredHeader
      sortBySalary
      title="Alle yrkesfamilier"
    />
  );
}
