import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import {
  getOccupationAreaBySlug,
  listOccupationAreas,
  type OccupationArea,
} from "@/lib/occupation-areas";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

type OccupationAreaPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const dataset = await getLatestOccupationMedianMonthlySalaryDataset();

  return listOccupationAreas(dataset).map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: OccupationAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dataset = await getLatestOccupationMedianMonthlySalaryDataset();
  const area = getOccupationAreaBySlug(dataset, slug);

  if (!area) {
    return {};
  }

  const title = getOccupationAreaSeoTitle(area);
  const description = getOccupationAreaSeoDescription(area);
  const canonicalPath = `/yrkesomrade/${area.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
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

export default async function OccupationAreaPage({ params }: OccupationAreaPageProps) {
  const { slug } = await params;
  const [dataset, occupationIndex, occupationCardStatsByCode] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getOccupationDetailViewModelIndex(),
    getOccupationCardStatsByCode(),
  ]);
  const area = getOccupationAreaBySlug(dataset, slug);

  if (!area) {
    notFound();
  }

  const overview = buildOccupationMedianGrowthOverview(dataset, undefined, {
    occupationCodes: listOccupationCodesForArea(area.code),
  });
  const occupationLabelsByCode = getOccupationLabelsByCode(dataset);
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
        groupCode: area.groupCode,
        groupLabel: area.groupLabel,
        areaCode: area.code,
        areaLabel: area.label,
        familyCode: row.occupationCode.slice(0, 3),
        familyLabel: occupationLabelsByCode.get(row.occupationCode.slice(0, 3)),
        monthlySalary: row.medianAll,
        cardStats: occupationCardStatsByCode.get(row.occupationCode),
        href: occupationSlug ? `/yrke/${occupationSlug}` : undefined,
      };
    });
  const title = getOccupationAreaSeoTitle(area);
  const description = getOccupationAreaSeoDescription(area);

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="flex items-center justify-center gap-4 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            <span>{title}</span>
            <span aria-hidden="true" className="shrink-0 text-4xl sm:text-5xl lg:text-6xl">
              {area.groupIcon}
            </span>
          </h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
        </header>

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

function listOccupationCodesForArea(areaCode: string) {
  const codes: string[] = [];

  for (let code = 0; code <= 9999; code += 1) {
    const normalizedCode = code.toString().padStart(4, "0");

    if (normalizedCode.startsWith(areaCode)) {
      codes.push(normalizedCode);
    }
  }

  return codes;
}

function getOccupationAreaSeoTitle(area: OccupationArea) {
  return `Lønn ${area.label}`;
}

function getOccupationAreaSeoDescription(area: OccupationArea) {
  const areaLabel = lowercaseFirstLetter(area.label).replace(/[.!?]+$/, "");

  return `Utforsk lønnen til ${areaLabel}. Sammenlign median månedslønn og finn oppdaterte lønnstall for yrkene i området basert på data fra SSB.`;
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

    if (occupation && /^\d{3}$/.test(occupation.code)) {
      labelsByCode.set(occupation.code, occupation.label);
    }
  }

  return labelsByCode;
}

function lowercaseFirstLetter(value: string) {
  return `${value.charAt(0).toLocaleLowerCase("nb-NO")}${value.slice(1)}`;
}
