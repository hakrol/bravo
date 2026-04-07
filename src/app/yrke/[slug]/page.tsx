import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationSalaryDetailPage } from "@/components/occupation-salary-detail-page";
import {
  formatOccupationDisplayLabel,
} from "@/lib/occupation-detail-pages";
import {
  getOccupationDetailViewModelBySlug,
  getOccupationDetailViewModelStaticParams,
} from "@/lib/occupation-detail-view-models";

export const revalidate = 86400;
export const dynamic = "force-static";
export const dynamicParams = false;

type OccupationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = getOccupationDetailViewModelStaticParams;

export async function generateMetadata({
  params,
}: OccupationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getOccupationDetailViewModelBySlug(slug);

  if (!detail) {
    return {};
  }

  const occupationLabel = formatOccupationDisplayLabel(detail.detailPage.label);
  const occupationDescription = detail.occupationDescription?.intro;

  return {
    title: `Lønn til ${occupationLabel}`,
    description: `Se lønn, lønnsutvikling og andre nøkkeltall for ${occupationLabel.toLowerCase()} med siste tilgjengelige tall fra SSB. ${occupationDescription ?? detail.detailPage.summary}`,
  };
}

export default async function OccupationDetailPage({
  params,
}: OccupationDetailPageProps) {
  const { slug } = await params;
  const detail = await getOccupationDetailViewModelBySlug(slug);

  if (!detail) {
    notFound();
  }

  return (
    <OccupationSalaryDetailPage
      occupationCode={detail.detailPage.occupationCode}
      detailPageOverride={detail.detailPage}
      occupationDescription={detail.occupationDescription}
      relatedPagesOverride={detail.relatedPages}
      viewModelData={detail.data}
    />
  );
}
