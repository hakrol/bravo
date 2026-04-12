import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import { listOccupationGroups } from "@/lib/occupation-groups";

export const metadata: Metadata = {
  title: "Yrkesgrupper",
  description: "Se alle yrkesgrupper og klikk deg videre til lønnsoversikter for hver gruppe.",
};

export default function OccupationGroupsOverviewPage() {
  const groups = listOccupationGroups();

  return (
    <OccupationLinkGrid
      description="Velg en yrkesgruppe for å se hvilke yrker som inngår og hva de tjener."
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
