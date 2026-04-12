import type { Metadata } from "next";
import { OccupationLinkGrid } from "@/components/occupation-link-grid";
import {
  getOccupationDetailViewModelBySlug,
  getOccupationDetailViewModelIndex,
} from "@/lib/occupation-detail-view-models";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";

export const metadata: Metadata = {
  title: "Yrker",
  description: "Se alle konkrete yrker og klikk deg videre til detaljsiden for hvert yrke.",
  alternates: {
    canonical: "/yrkesgrupper/yrker",
  },
};

export default async function OccupationsOverviewPage() {
  const index = await getOccupationDetailViewModelIndex();
  const firstSlugByOccupationCode = new Map<string, string>();

  for (const page of index.pages) {
    if (!firstSlugByOccupationCode.has(page.occupationCode)) {
      firstSlugByOccupationCode.set(page.occupationCode, page.slug);
    }
  }

  const details = await Promise.all(
    Array.from(firstSlugByOccupationCode.values()).map((slug) =>
      getOccupationDetailViewModelBySlug(slug),
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
      description="Velg et yrke for \u00E5 \u00E5pne detaljsiden med l\u00F8nn og n\u00F8kkeltall."
      eyebrow="Oversikt"
      items={items}
      compact
      title="Alle yrker"
    />
  );
}
