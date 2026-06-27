import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import {
  getOccupationFamilyBySlug,
  listOccupationFamilies,
  type OccupationFamily,
} from "@/lib/occupation-families";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

type OccupationFamilyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const dataset = await getLatestOccupationMedianMonthlySalaryDataset();

  return listOccupationFamilies(dataset).map((family) => ({
    slug: family.slug,
  }));
}

export async function generateMetadata({
  params,
}: OccupationFamilyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dataset = await getLatestOccupationMedianMonthlySalaryDataset();
  const family = getOccupationFamilyBySlug(dataset, slug);

  if (!family) {
    return {};
  }

  const title = getOccupationFamilySeoTitle(family);
  const description = getOccupationFamilySeoDescription(family);
  const canonicalPath = `/yrkesfamilie/${family.slug}`;

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
  };
}

export default async function OccupationFamilyPage({
  params,
}: OccupationFamilyPageProps) {
  const { slug } = await params;
  const [dataset, occupationIndex, occupationCardStatsByCode] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getOccupationDetailViewModelIndex(),
    getOccupationCardStatsByCode(),
  ]);
  const family = getOccupationFamilyBySlug(dataset, slug);

  if (!family) {
    notFound();
  }

  const overview = buildOccupationMedianGrowthOverview(dataset, undefined, {
    occupationCodes: listOccupationCodesForFamily(family.code),
  });
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
      const occupationSlug = firstSlugByOccupationCode.get(row.occupationCode);

      return {
        occupationCode: row.occupationCode,
        title: formatOccupationDisplayLabel(row.occupationLabel),
        groupCode: family.groupCode,
        groupLabel: family.groupLabel,
        familyCode: family.code,
        familyLabel: family.label,
        monthlySalary: row.medianAll,
        cardStats: occupationCardStatsByCode.get(row.occupationCode),
        href: occupationSlug ? `/yrke/${occupationSlug}` : undefined,
      };
    });
  const title = getOccupationFamilySeoTitle(family);
  const description = getOccupationFamilySeoDescription(family);

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="flex items-center justify-center gap-4 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            <span>{title}</span>
            <span aria-hidden="true" className="shrink-0 text-4xl sm:text-5xl lg:text-6xl">
              {family.groupIcon}
            </span>
          </h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
        </header>

        <OccupationDirectory
          colorByOccupationGroup
          items={items}
          showSearch={false}
          valueLabel="Median månedslønn"
        />
      </div>
    </div>
  );
}

function listOccupationCodesForFamily(familyCode: string) {
  const codes: string[] = [];

  for (let code = 0; code <= 9999; code += 1) {
    const normalizedCode = code.toString().padStart(4, "0");

    if (normalizedCode.startsWith(familyCode)) {
      codes.push(normalizedCode);
    }
  }

  return codes;
}

function getOccupationFamilySeoTitle(family: OccupationFamily) {
  return `Lønn ${family.label}`;
}

function getOccupationFamilySeoDescription(family: OccupationFamily) {
  const familyLabel = lowercaseFirstLetter(family.label).replace(/[.!?]+$/, "");

  return `Utforsk lønnen til ${familyLabel}. Sammenlign median månedslønn og finn oppdaterte lønnstall for yrkene i familien basert på data fra SSB.`;
}

function lowercaseFirstLetter(value: string) {
  return `${value.charAt(0).toLocaleLowerCase("nb-NO")}${value.slice(1)}`;
}
