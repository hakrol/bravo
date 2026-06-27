import type { Metadata } from "next";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import {
  getApprenticeshipDetailViewModelBySlug,
  getApprenticeshipDetailViewModelIndex,
} from "@/lib/apprenticeship-detail-view-models";
import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";

const description =
  "Utforsk lærlinglønn i ulike fag og sammenlign median avtalt månedslønn basert på oppdaterte tall fra SSB.";

const apprenticeshipSalaryFilters = [
  { value: "all", label: "Alle lønnsnivå" },
  { value: "under-20000", label: "Under 20 000 kr", max: 20000 },
  { value: "20000-23000", label: "20 000-23 000 kr", min: 20000, max: 23000 },
  { value: "23000-26000", label: "23 000-26 000 kr", min: 23000, max: 26000 },
  { value: "over-26000", label: "Over 26 000 kr", min: 26000 },
];

export const metadata: Metadata = {
  title: "Lærlinglønn i ulike fag",
  description,
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
    .map((detail) => {
      const occupationCode = detail.detailPage.occupationCode;
      const groupLabel = getOccupationGroupLabel(occupationCode);

      return {
        occupationCode,
        title: formatOccupationDisplayLabel(detail.detailPage.label),
        groupCode: occupationCode.slice(0, 1),
        groupLabel,
        salaryValue:
          detail.data.distribution?.total?.median ??
          detail.data.medianOverview.rows.find((row) => row.occupationCode === occupationCode)
            ?.medianAll,
        href: detail.detailPage.href,
        searchText: [
          detail.detailPage.label,
          formatOccupationDisplayLabel(detail.detailPage.label),
          groupLabel,
          occupationCode,
        ]
          .filter(Boolean)
          .join(" "),
      } satisfies OccupationDirectoryItem;
    })
    .sort((left, right) => left.title.localeCompare(right.title, "nb"));

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            Alle lærlingfag
          </h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
        </header>

        <OccupationDirectory
          colorByOccupationGroup
          filterLabel="Filtrer på lærlinglønn"
          items={items}
          resultNoun="lærlingfag"
          resultsAriaLabel="Alle lærlingfag med median lærlinglønn"
          salaryFilters={apprenticeshipSalaryFilters}
          searchLabel="Søk etter lærlingfag"
          searchPlaceholder="Skriv f.eks. elektriker"
          valueLabel="Median lærlinglønn"
        />
      </div>
    </div>
  );
}

function getOccupationGroupLabel(occupationCode: string) {
  const groupCode = occupationCode.charAt(0);

  if (groupCode === "0") {
    return "Militære yrker";
  }

  if (groupCode === "3") {
    return "Høyskoleyrker";
  }

  return getOccupationGroupByCode(groupCode)?.label ?? "Andre yrker";
}
