import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import { buildOccupationGroupSalaryOverview } from "@/lib/occupation-group-salary-overview";
import { buildDynamicOccupationDetailPage } from "@/lib/occupation-detail-pages";
import { getLatestSalaryDataset, OCCUPATION_MONTHLY_SALARY_FILTERS } from "@/lib/ssb";

export const dynamic = "force-dynamic";

type OccupationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: OccupationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await resolveOccupationDetailBySlug(slug);

  if (!detail) {
    return {};
  }

  return {
    title: `${detail.page.label} lønn`,
    description: `Se lønnsutvikling og gjennomsnittlig avtalt månedslønn for ${detail.page.label.toLowerCase()} basert på SSB-data.`,
  };
}

export default async function OccupationDetailPage({
  params,
}: OccupationDetailPageProps) {
  const { slug } = await params;
  const detail = await resolveOccupationDetailBySlug(slug);

  if (!detail) {
    notFound();
  }

  return (
    <OccupationSalaryDetailPage
      occupationCode={detail.page.occupationCode}
      detailPageOverride={detail.page}
      relatedPagesOverride={detail.relatedPages}
    />
  );
}

async function resolveOccupationDetailBySlug(slug: string) {
  const rows = await getDynamicOccupationRows();
  const pages = rows.map((row) => buildDynamicOccupationDetailPage(row.occupationCode, row.occupationLabel));
  const currentIndex = pages.findIndex((page) => page.slug === slug);

  if (currentIndex === -1) {
    return null;
  }

  return {
    page: pages[currentIndex],
    relatedPages: pickRelatedPages(pages, currentIndex),
  };
}

async function getDynamicOccupationRows() {
  const dataset = await getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS);
  const groupCodes = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

  return groupCodes.flatMap((groupCode) => {
    try {
      return buildOccupationGroupSalaryOverview(dataset, groupCode).rows;
    } catch {
      return [];
    }
  });
}

function pickRelatedPages(
  pages: Array<ReturnType<typeof buildDynamicOccupationDetailPage>>,
  currentIndex: number,
) {
  const relatedPages = [
    pages[currentIndex - 1],
    pages[currentIndex + 1],
    pages[currentIndex - 2],
    pages[currentIndex + 2],
  ].filter((page): page is ReturnType<typeof buildDynamicOccupationDetailPage> => Boolean(page));

  return relatedPages.slice(0, 3);
}
