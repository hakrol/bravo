import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import { OccupationDirectoryHero } from "@/components/occupation-directory-hero";
import {
  formatOccupationDisplayLabel,
} from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import {
  getOccupationGroupBySlug,
  listOccupationGroups,
  type OccupationGroup,
} from "@/lib/occupation-groups";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

type OccupationGroupPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return listOccupationGroups().map((group) => ({
    slug: group.slug,
  }));
}

export async function generateMetadata({
  params,
}: OccupationGroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = getOccupationGroupBySlug(slug);

  if (!group) {
    return {};
  }

  const description = getOccupationGroupSeoDescription(group);
  const title = getOccupationGroupSeoTitle(group);
  const canonicalPath = `/yrkesgrupper/${group.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: canonicalPath,
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
}

export default async function OccupationGroupPage({
  params,
}: OccupationGroupPageProps) {
  const { slug } = await params;
  const group = getOccupationGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  const [latestDataset, occupationIndex, occupationCardStatsByCode] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getOccupationDetailViewModelIndex(),
    getOccupationCardStatsByCode(),
  ]);
  const overview = buildOccupationMedianGrowthOverview(latestDataset, undefined, {
    occupationCodes: listOccupationCodesForGroup(group.code),
  });
  const occupationLabelsByCode = getOccupationLabelsByCode(latestDataset);
  const firstSlugByOccupationCode = new Map<string, string>();

  for (const page of occupationIndex.pages) {
    if (!firstSlugByOccupationCode.has(page.occupationCode)) {
      firstSlugByOccupationCode.set(page.occupationCode, page.slug);
    }
  }

  const items: OccupationDirectoryItem[] = overview.rows
    .filter((row) => row.medianAll !== undefined)
    .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"))
    .map((row) => {
      const title = formatOccupationDisplayLabel(row.occupationLabel);
      const occupationSlug = firstSlugByOccupationCode.get(row.occupationCode);

      return {
        occupationCode: row.occupationCode,
        title,
        familyCode: row.occupationCode.slice(0, 3),
        familyLabel: occupationLabelsByCode.get(row.occupationCode.slice(0, 3)),
        monthlySalary: row.medianAll,
        cardStats: occupationCardStatsByCode.get(row.occupationCode),
        href: occupationSlug ? `/yrke/${occupationSlug}` : undefined,
        searchText: [
          title,
          row.occupationLabel,
          occupationLabelsByCode.get(row.occupationCode.slice(0, 3)),
          row.occupationCode,
        ]
          .filter(Boolean)
          .join(" "),
      };
    });
  const heroDescription = getOccupationGroupHeroDescription(group);
  const canonicalPath = `/yrkesgrupper/${group.slug}`;
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
        name: "Yrkesgrupper",
        item: getAbsoluteUrl("/yrkesgrupper"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: group.label,
        item: getAbsoluteUrl(canonicalPath),
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
      <OccupationDirectoryHero
        description={heroDescription}
        icon={group.icon}
        title={`${group.label}: yrker og lønn`}
      />

      <div className="relative z-10 mx-auto -mt-16 w-full max-w-7xl px-5 sm:-mt-20 sm:px-6 lg:-mt-24 lg:px-8">
        <OccupationDirectory
          colorByOccupationGroup
          featuredControls
          filterByOccupationFamily
          items={items}
          searchPlaceholder={`Søk etter yrke innen ${group.shortLabel.toLowerCase()}`}
          valueLabel="Median månedslønn"
        />
      </div>
    </div>
  );
}

function listOccupationCodesForGroup(groupCode: string) {
  const codes: string[] = [];

  for (let code = 0; code <= 9999; code += 1) {
    const normalizedCode = code.toString().padStart(4, "0");

    if (normalizedCode.startsWith(groupCode)) {
      codes.push(normalizedCode);
    }
  }

  return codes;
}

function getOccupationGroupSeoDescription(group: OccupationGroup) {
  return `Se yrker innen ${group.shortLabel.toLowerCase()} med lønn og oppdaterte lønnstall fra SSB. Søk, filtrer og sammenlign median månedslønn og lønnsvekst.`;
}

function getOccupationGroupSeoTitle(group: OccupationGroup) {
  return `${group.shortLabel}: yrker og lønn fra SSB`;
}

function getOccupationGroupHeroDescription(group: OccupationGroup) {
  return `Se alle yrker innen ${group.shortLabel.toLowerCase()} samlet på ett sted. Søk, filtrer og sammenlign lønn med oppdaterte lønnstall fra SSB.`;
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
