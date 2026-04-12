import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import { listOccupationGroups } from "@/lib/occupation-groups";

export const metadata: Metadata = {
  title: "Yrkesgrupper",
  description: "Se alle yrkesgrupper og klikk deg videre til l\u00F8nnsoversikter for hver gruppe.",
  alternates: {
    canonical: "/yrkesgrupper",
  },
};

export default function OccupationGroupsOverviewPage() {
  const groups = listOccupationGroups();

  return (
    <OccupationLinkGrid
      description="Velg en yrkesgruppe for \u00E5 se hvilke yrker som inng\u00E5r og hva de tjener."
      eyebrow="Oversikt"
      items={groups.map((group) => ({
        title: group.label,
        description: group.description,
        href: `/yrkesgrupper/${group.slug}`,
      }))}
      title="Alle yrkesgrupper"
    />
  );
}
