import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApprenticeshipSalaryDetailPage } from "@/components/apprenticeship-salary-detail-page";
import {
  getApprenticeshipDetailViewModelBySlug,
  getApprenticeshipDetailViewModelStaticParams,
} from "@/lib/apprenticeship-detail-view-models";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 86400;

type ApprenticeshipDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = getApprenticeshipDetailViewModelStaticParams;

export async function generateMetadata({
  params,
}: ApprenticeshipDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getApprenticeshipDetailViewModelBySlug(slug);

  if (!detail) {
    return {};
  }

  const occupationLabel = formatOccupationDisplayLabel(detail.detailPage.label);
  const intro = detail.occupationDescription?.intro ?? detail.detailPage.summary;

  return {
    title: `Lærlinglønn for ${occupationLabel}`,
    description: `Se lærlinglønn, lønnsutvikling og lønnsfordeling for ${occupationLabel.toLowerCase()} med siste tilgjengelige tall fra SSB. ${intro}`,
    alternates: {
      canonical: detail.detailPage.href,
    },
  };
}

export default async function ApprenticeshipDetailPage({
  params,
}: ApprenticeshipDetailPageProps) {
  const { slug } = await params;
  const detail = await getApprenticeshipDetailViewModelBySlug(slug);

  if (!detail) {
    notFound();
  }

  return <ApprenticeshipSalaryDetailPage detail={detail} />;
}
