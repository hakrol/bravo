import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import { listOccupationGroups } from "@/lib/occupation-groups";
import { buildOccupationGroupMedianSalaryOverview } from "@/lib/occupation-salary-overview";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";

const description =
  "Utforsk alle yrkesgrupper i Norge og finn yrkene og lønnsnivåene som hører til i hver gruppe.";

export const metadata: Metadata = {
  title: "Alle yrkesgrupper",
  description,
  alternates: {
    canonical: "/yrkesgrupper",
  },
};

export default async function OccupationGroupsOverviewPage() {
  const groups = listOccupationGroups();
  const dataset = await getLatestOccupationMedianMonthlySalaryDataset();
  const salaryOverview = buildOccupationGroupMedianSalaryOverview(dataset);
  const salaryByGroupCode = new Map(
    salaryOverview.rows.map((row) => [row.occupationGroupCode, row.medianAll]),
  );

  return (
    <OccupationLinkGrid
      colorByOccupationGroup
      description={description}
      items={groups.map((group) => ({
        title: group.label,
        description: group.description,
        href: `/yrkesgrupper/${group.slug}`,
        occupationGroupCode: group.code,
        salaryValue: salaryByGroupCode.get(group.code),
      }))}
      plainCenteredHeader
      title="Alle yrkesgrupper"
    />
  );
}
