import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import { listOccupationGroups } from "@/lib/occupation-groups";

export const metadata: Metadata = {
  title: "Lønn i ulike yrkesgrupper",
  description: "Se lønn i ulike yrkesgrupper og gå videre til oversikter for yrkene i hver gruppe.",
  alternates: {
    canonical: "/yrkesgrupper",
  },
};

export default function OccupationGroupsOverviewPage() {
  const groups = listOccupationGroups();

  return (
    <OccupationLinkGrid
      description="Velg en yrkesgruppe for å se hvilke yrker som inngår og hva de tjener."
      items={groups.map((group) => ({
        title: group.label,
        description: group.description,
        href: `/yrkesgrupper/${group.slug}`,
      }))}
      title="Alle yrkesgrupper"
    />
  );
}
