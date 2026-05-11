import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationDetailPage } from "@/components/occupation-detail-page";
import { getOccupationDetailViewModelBySlug } from "@/lib/occupation-detail-view-models";

export const metadata: Metadata = {
  title: "Demo: Elektrikere",
  description: "Demoside for nytt design og oppsett p\u00E5 detaljesiden for Elektrikere.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function ElektrikereDemoPage() {
  const detail = await getOccupationDetailViewModelBySlug("elektrikere-lonn");

  if (!detail) {
    notFound();
  }

  return <OccupationDetailPage detail={detail} />;
}
