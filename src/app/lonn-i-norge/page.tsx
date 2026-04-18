import type { Metadata } from "next";
import { NorwaySalaryPage } from "@/components/norway-salary-page";
import { getTopPaidOccupationLinks } from "@/lib/occupation-detail-view-models";
import { getNorwaySalaryViewModel } from "@/lib/norway-salary-view-models";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 86400;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const viewModel = await getNorwaySalaryViewModel();

  return {
    title: viewModel.route.title,
    description: viewModel.route.description,
    alternates: {
      canonical: viewModel.route.href,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: viewModel.route.href,
      siteName: siteConfig.name,
      title: `${viewModel.route.title} | ${siteConfig.name}`,
      description: viewModel.route.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${viewModel.route.title} | ${siteConfig.name}`,
      description: viewModel.route.description,
    },
  };
}

export default async function NorwaySalaryRoutePage() {
  const [viewModel, topPaidOccupations] = await Promise.all([
    getNorwaySalaryViewModel(),
    getTopPaidOccupationLinks(10),
  ]);

  return <NorwaySalaryPage topPaidOccupations={topPaidOccupations} viewModel={viewModel} />;
}
