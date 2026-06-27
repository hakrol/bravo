import type { Metadata } from "next";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Utforsk alle yrker i Norge og sammenlign median månedslønn basert på oppdaterte lønnstall fra SSB.";

export const metadata: Metadata = {
  title: "Alle yrker",
  description,
  alternates: {
    canonical: "/yrker",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/yrker",
    siteName: siteConfig.name,
    title: `Alle yrker | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Alle yrker | ${siteConfig.name}`,
    description,
  },
};

export default async function YrkerPage() {
  const [dataset, occupationIndex, occupationCardStatsByCode] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getOccupationDetailViewModelIndex(),
    getOccupationCardStatsByCode(),
  ]);
  const overview = buildOccupationMedianGrowthOverview(dataset);
  const occupationLabelsByCode = getOccupationLabelsByCode(dataset);
  const firstSlugByOccupationCode = new Map<string, string>();

  for (const page of occupationIndex.pages) {
    if (!firstSlugByOccupationCode.has(page.occupationCode)) {
      firstSlugByOccupationCode.set(page.occupationCode, page.slug);
    }
  }

  const rows = overview.rows
    .filter((row) => row.medianAll !== undefined)
    .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"));
  const items: OccupationDirectoryItem[] = rows.map((row) => {
    const slug = firstSlugByOccupationCode.get(row.occupationCode);

    return {
      occupationCode: row.occupationCode,
      title: formatOccupationDisplayLabel(row.occupationLabel),
      groupCode: row.occupationCode.slice(0, 1),
      groupLabel: getOccupationGroupLabel(row.occupationCode),
      areaCode: row.occupationCode.slice(0, 2),
      areaLabel: occupationLabelsByCode.get(row.occupationCode.slice(0, 2)),
      familyCode: row.occupationCode.slice(0, 3),
      familyLabel: occupationLabelsByCode.get(row.occupationCode.slice(0, 3)),
      monthlySalary: row.medianAll,
      cardStats: occupationCardStatsByCode.get(row.occupationCode),
      href: slug ? `/yrke/${slug}` : undefined,
      searchText: [
        row.occupationLabel,
        formatOccupationDisplayLabel(row.occupationLabel),
        getOccupationGroupLabel(row.occupationCode),
        occupationLabelsByCode.get(row.occupationCode.slice(0, 2)),
        occupationLabelsByCode.get(row.occupationCode.slice(0, 3)),
        row.occupationCode,
      ]
        .filter(Boolean)
        .join(" "),
    };
  });

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            Alle yrker
          </h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            {description}
          </p>
        </header>

        <OccupationDirectory colorByOccupationGroup filterByOccupationHierarchy items={items} />
      </div>
    </div>
  );
}

function getOccupationLabelsByCode(
  dataset: Awaited<ReturnType<typeof getLatestOccupationMedianMonthlySalaryDataset>>,
) {
  const occupationDimensionCode = dataset.dimensions.find((dimension) =>
    dimension.toLocaleLowerCase("nb-NO").includes("yrke"),
  );
  const labelsByCode = new Map<string, string>();

  if (!occupationDimensionCode) {
    return labelsByCode;
  }

  for (const row of dataset.rows) {
    const occupation = row.dimensions[occupationDimensionCode];

    if (occupation && /^\d{1,3}$/.test(occupation.code)) {
      labelsByCode.set(occupation.code, occupation.label);
    }
  }

  return labelsByCode;
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
