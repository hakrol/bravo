import type { Metadata } from "next";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import { OccupationDirectoryHero } from "@/components/occupation-directory-hero";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const title = "Alle yrker og lønn – lønnstall fra SSB";
const description =
  "Se alle yrker i Norge med lønn og oppdaterte lønnstall fra SSB. Søk, filtrer og sammenlign median månedslønn, lønnsvekst og arbeidstakervekst.";
const heroDescription =
  "Se alle yrker i Norge samlet på ett sted. Søk, filtrer og sammenlign lønn med oppdaterte lønnstall fra SSB.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/yrker",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/yrker",
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Forside",
        item: getAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alle yrker",
        item: getAbsoluteUrl("/yrker"),
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-clip pb-12 sm:pb-16">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <OccupationDirectoryHero description={heroDescription} title="Alle yrker" />

      <div className="relative z-10 mx-auto -mt-16 w-full max-w-7xl px-5 sm:-mt-20 sm:px-6 lg:-mt-24 lg:px-8">
        <OccupationDirectory
          colorByOccupationGroup
          featuredControls
          filterByOccupationHierarchy
          items={items}
          searchPlaceholder="Søk etter yrke, for eksempel flyger"
        />
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
