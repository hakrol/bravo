import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccupationDetailPage as OccupationDetailPageView } from "@/components/occupation-detail-page";
import {
  formatOccupationDisplayLabel,
} from "@/lib/occupation-detail-pages";
import { getOccupationHeroImages } from "@/lib/occupation-hero-images";
import {
  getOccupationDetailViewModelBySlug,
  getOccupationDetailViewModelStaticParams,
  type OccupationDetailViewModel,
} from "@/lib/occupation-detail-view-models";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

export const revalidate = 2592000;
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

  const seo = buildOccupationSeo(detail);
  const heroImages = getOccupationHeroImages(detail.detailPage.occupationCode);

  return {
    title: {
      absolute: seo.title,
    },
    description: seo.description,
    alternates: {
      canonical: detail.detailPage.href,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: detail.detailPage.href,
      siteName: siteConfig.name,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: heroImages.desktop,
          alt: `Lønn og lønnsutvikling for ${seo.searchName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [heroImages.desktop],
    },
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

  const structuredData = buildOccupationStructuredData(detail);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <OccupationDetailPageView detail={detail} />
    </>
  );
}

function buildOccupationSeo(detail: OccupationDetailViewModel) {
  const searchName = formatOccupationDisplayLabel(detail.detailPage.label);
  const distribution = detail.data.distribution;
  const dataYear = distribution?.periodLabel ?? getLatestSalaryPeriod(detail);
  const medianMonthlySalary = distribution?.total?.median;
  const formattedSalary = isFiniteNumber(medianMonthlySalary)
    ? medianMonthlySalary.toLocaleString("nb-NO", { maximumFractionDigits: 0 })
    : null;
  const titleCore = [
    `${searchName} lønn`,
    dataYear,
  ].filter(Boolean).join(" ");
  const titleWithSalary = formattedSalary
    ? `${titleCore}: ${formattedSalary} kr/mnd`
    : titleCore;
  const brandedTitle = `${titleWithSalary} | ${siteConfig.name}`;
  const title = brandedTitle.length <= 65 ? brandedTitle : titleWithSalary;
  const description = buildSeoDescription({
    dataYear,
    formattedSalary,
    searchName,
  });

  return {
    dataYear,
    description,
    formattedSalary,
    medianMonthlySalary,
    searchName,
    title,
  };
}

function buildSeoDescription({
  dataYear,
  formattedSalary,
  searchName,
}: {
  dataYear?: string;
  formattedSalary: string | null;
  searchName: string;
}) {
  const normalizedName = searchName.toLowerCase();

  if (formattedSalary && dataYear) {
    const fullDescription = `Medianlønn for ${normalizedName} er ${formattedSalary} kr per måned i ${dataYear}. Se årslønn, timelønn, kvinner og menn, sektor og lønnsutvikling fra SSB.`;

    return fullDescription.length <= 160
      ? fullDescription
      : `${searchName}: medianlønn ${formattedSalary} kr/mnd i ${dataYear}. Se årslønn, timelønn, sektor og utvikling fra SSB.`;
  }

  return `${searchName} lønn ${dataYear ?? "med siste SSB-tall"}. Se årslønn, timelønn, kvinner og menn, sektor og lønnsutvikling.`;
}

function buildOccupationStructuredData(detail: OccupationDetailViewModel) {
  const seo = buildOccupationSeo(detail);
  const canonicalUrl = getAbsoluteUrl(detail.detailPage.href);
  const heroImages = getOccupationHeroImages(detail.detailPage.occupationCode);
  const datasetId = `${canonicalUrl}#dataset`;
  const webpageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const distribution = detail.data.distribution;
  const variables = [
    isFiniteNumber(distribution?.total?.median)
      ? {
          "@type": "PropertyValue",
          name: "Median månedslønn",
          value: distribution.total.median,
          unitCode: "NOK",
          unitText: "kroner per måned",
        }
      : null,
    isFiniteNumber(distribution?.total?.average)
      ? {
          "@type": "PropertyValue",
          name: "Gjennomsnittlig månedslønn",
          value: distribution.total.average,
          unitCode: "NOK",
          unitText: "kroner per måned",
        }
      : null,
  ].filter((variable): variable is NonNullable<typeof variable> => variable !== null);
  const dateModified = distribution?.updated ?? detail.data.medianBasicSalarySeries.updated;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Forside",
            item: getAbsoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Yrker",
            item: getAbsoluteUrl("/yrker"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: seo.searchName,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: canonicalUrl,
        name: seo.title,
        description: seo.description,
        inLanguage: "nb-NO",
        image: getAbsoluteUrl(heroImages.desktop),
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": datasetId },
        ...(dateModified ? { dateModified } : {}),
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        name: `${seo.searchName} – lønnsstatistikk${seo.dataYear ? ` ${seo.dataYear}` : ""}`,
        description: seo.description,
        url: canonicalUrl,
        inLanguage: "nb-NO",
        identifier: detail.detailPage.occupationCode,
        creator: {
          "@type": "Organization",
          name: "Statistisk sentralbyrå",
          url: "https://www.ssb.no/",
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: getAbsoluteUrl("/"),
        },
        isBasedOn: "https://www.ssb.no/statbank/table/11418/",
        spatialCoverage: {
          "@type": "Country",
          name: "Norge",
        },
        ...(seo.dataYear ? { temporalCoverage: seo.dataYear } : {}),
        ...(dateModified ? { dateModified } : {}),
        ...(variables.length > 0 ? { variableMeasured: variables } : {}),
      },
    ],
  };
}

function getLatestSalaryPeriod(detail: OccupationDetailViewModel) {
  const points = detail.data.medianBasicSalarySeries.points;
  return points[points.length - 1]?.periodLabel;
}

function isFiniteNumber(value?: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
