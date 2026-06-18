import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import {
  formatOccupationDisplayLabel,
} from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getOccupationGroupBySlug, listOccupationGroups } from "@/lib/occupation-groups";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

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

  const description = getOccupationGroupSeoDescription(group.label);
  const canonicalPath = `/yrkesgrupper/${group.slug}`;

  return {
    title: `${group.label} | Yrkesgrupper`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: canonicalPath,
      siteName: siteConfig.name,
      title: `${group.label} | ${siteConfig.name}`,
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

  const [latestDataset, occupationIndex] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getOccupationDetailViewModelIndex(),
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
  const description = getOccupationGroupSeoDescription(group.label);

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="space-y-3">
          <h1 className="flex items-center gap-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            <span>Lønn for {group.label.toLowerCase()}</span>
            <span aria-hidden="true" className="shrink-0 text-4xl sm:text-5xl">
              {group.icon}
            </span>
          </h1>
          <p className="max-w-4xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>

        <OccupationDirectory
          colorByOccupationGroup
          filterByOccupationFamily
          items={items}
          showSearch={false}
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

function getOccupationGroupSeoDescription(groupLabel: string) {
  return `Utforsk lønn for ${groupLabel.toLowerCase()}, sammenlign median månedslønn og finn oppdaterte lønnstall for konkrete yrker basert på data fra SSB.`;
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
