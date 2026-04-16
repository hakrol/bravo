import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import {
  getApprenticeshipDetailViewModelBySlug,
  getApprenticeshipDetailViewModelIndex,
} from "@/lib/apprenticeship-detail-view-models";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";

export const metadata: Metadata = {
  title: "Lærlingfag",
  description: "Se alle lærlingfag med egne detaljsider og klikk deg videre til lærlinglønn for hvert fag.",
  alternates: {
    canonical: "/laerling",
  },
};

export default async function ApprenticeshipOverviewPage() {
  const index = await getApprenticeshipDetailViewModelIndex();
  const firstSlugByOccupationCode = new Map<string, string>();

  for (const page of index.pages) {
    if (!firstSlugByOccupationCode.has(page.occupationCode)) {
      firstSlugByOccupationCode.set(page.occupationCode, page.slug);
    }
  }

  const details = await Promise.all(
    Array.from(firstSlugByOccupationCode.values()).map((slug) =>
      getApprenticeshipDetailViewModelBySlug(slug),
    ),
  );

  const items = details
    .filter((detail) => detail !== null)
    .map((detail) => ({
      title: formatOccupationDisplayLabel(detail.detailPage.label),
      description: detail.detailPage.summary,
      href: detail.detailPage.href,
    }))
    .sort((left, right) => left.title.localeCompare(right.title, "nb"));

  return (
    <OccupationLinkGrid
      compact
      description="Velg et lærlingfag for å åpne detaljsiden med lærlinglønn og nøkkeltall."
      eyebrow="Oversikt"
      items={items}
      title="Alle lærlingfag"
    />
  );
}
