import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationHourlySalaryPage } from "@/components/occupation-hourly-salary-page";
import { getHourlySalaryPageBySlug, getHourlySalaryPages } from "@/lib/hourly-salary-pages";

export const dynamicParams = false;

type HourlySalaryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getHourlySalaryPages().map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: HourlySalaryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getHourlySalaryPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function HourlySalaryLandingPage({
  params,
}: HourlySalaryPageProps) {
  const { slug } = await params;
  const page = getHourlySalaryPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <OccupationHourlySalaryPage page={page} />;
}
