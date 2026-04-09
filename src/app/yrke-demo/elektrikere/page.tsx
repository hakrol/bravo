import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationDetailDemoPageV3 } from "@/components/occupation-detail-demo-page-v3";
import { getOccupationDetailViewModelBySlug } from "@/lib/occupation-detail-view-models";

export const metadata: Metadata = {
  title: "Demo: Elektrikere",
  description: "Demoside for nytt design og oppsett p\u00e5 detaljesiden for Elektrikere.",
};

export default async function ElektrikereDemoPage() {
  const detail = await getOccupationDetailViewModelBySlug("elektrikere-lonn");

  if (!detail) {
    notFound();
  }

  return <OccupationDetailDemoPageV3 detail={detail} />;
}
