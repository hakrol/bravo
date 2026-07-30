import type { Metadata } from "next";
import {
  OccupationDirectory,
  type OccupationDirectoryItem,
} from "@/components/occupation-directory";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const title = "Alle yrker og lønn – lønnstall fra SSB";
const description =
  "Se alle yrker i Norge med lønn og oppdaterte lønnstall fra SSB. Søk, filtrer og sammenlign median månedslønn, lønnsvekst og arbeidstakervekst.";
const heroDescription =
  "Se alle yrker i Norge samlet på ett sted. Søk, filtrer og sammenlign lønn med oppdaterte lønnstall fra SSB.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/yrker",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/yrker",
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default async function YrkerPage() {
  const [dataset, occupationIndex, occupationCardStatsByCode] = await Promise.all([
    getLatestOccupationMedianMonthlySalaryDataset(),
    getOccupationDetailViewModelIndex(),
    getOccupationCardStatsByCode(),
  ]);
  const overview = buildOccupationMedianGrowthOverview(dataset);
  const occupationLabelsByCode = getOccupationLabelsByCode(dataset);
  const firstSlugByOccupationCode = new Map<string, string>();

  for (const page of occupationIndex.pages) {
    if (!firstSlugByOccupationCode.has(page.occupationCode)) {
      firstSlugByOccupationCode.set(page.occupationCode, page.slug);
    }
  }

  const rows = overview.rows
    .filter((row) => row.medianAll !== undefined)
    .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"));
  const items: OccupationDirectoryItem[] = rows.map((row) => {
    const slug = firstSlugByOccupationCode.get(row.occupationCode);

    return {
      occupationCode: row.occupationCode,
      title: formatOccupationDisplayLabel(row.occupationLabel),
      groupCode: row.occupationCode.slice(0, 1),
      groupLabel: getOccupationGroupLabel(row.occupationCode),
      areaCode: row.occupationCode.slice(0, 2),
      areaLabel: occupationLabelsByCode.get(row.occupationCode.slice(0, 2)),
      familyCode: row.occupationCode.slice(0, 3),
      familyLabel: occupationLabelsByCode.get(row.occupationCode.slice(0, 3)),
      monthlySalary: row.medianAll,
      cardStats: occupationCardStatsByCode.get(row.occupationCode),
      href: slug ? `/yrke/${slug}` : undefined,
      searchText: [
        row.occupationLabel,
        formatOccupationDisplayLabel(row.occupationLabel),
        getOccupationGroupLabel(row.occupationCode),
        occupationLabelsByCode.get(row.occupationCode.slice(0, 2)),
        occupationLabelsByCode.get(row.occupationCode.slice(0, 3)),
        row.occupationCode,
      ]
        .filter(Boolean)
        .join(" "),
    };
  });
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        name: "Alle yrker",
        item: getAbsoluteUrl("/yrker"),
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-clip pb-12 sm:pb-16">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_15%,rgba(214,230,216,0.64),transparent_28%),linear-gradient(180deg,#fbfcf8_0%,#ffffff_100%)] px-5 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pb-32 lg:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full border-[42px] border-[#dce9dc]/70 sm:-left-20 sm:-top-24 sm:h-96 sm:w-96 sm:border-[54px]"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-[5%] top-7 hidden h-24 w-24 text-[#76a67f] opacity-40 sm:block"
          viewBox="0 0 96 96"
        >
          <defs>
            <pattern id="occupation-hero-dots" height="16" patternUnits="userSpaceOnUse" width="16">
              <circle cx="3" cy="3" fill="currentColor" r="1.5" />
            </pattern>
          </defs>
          <rect fill="url(#occupation-hero-dots)" height="96" width="96" />
        </svg>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-3 hidden h-44 w-[22rem] text-[#78a782] opacity-20 md:block lg:w-[30rem]"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 480 176"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <path
              d={`M0 ${72 + index * 8} C 95 ${8 + index * 8}, 150 ${142 + index * 4}, 250 ${76 + index * 7} S 390 ${28 + index * 7}, 480 ${68 + index * 8}`}
              key={index}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>

        <header className="relative z-10 mx-auto max-w-[650px] space-y-5 text-center">
          <h1 className="text-[clamp(3rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--foreground)]">
            Alle yrker
          </h1>
          <p className="mx-auto max-w-[650px] text-[1.05rem] leading-[1.6] text-[var(--muted)]">
            {heroDescription}
          </p>
        </header>
      </section>

      <div className="relative z-10 mx-auto -mt-16 w-full max-w-7xl px-5 sm:-mt-20 sm:px-6 lg:-mt-24 lg:px-8">
        <OccupationDirectory
          colorByOccupationGroup
          featuredControls
          filterByOccupationHierarchy
          items={items}
          searchPlaceholder="Søk etter yrke, for eksempel flyger"
        />
      </div>
    </div>
  );
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

    if (occupation && /^\d{1,3}$/.test(occupation.code)) {
      labelsByCode.set(occupation.code, occupation.label);
    }
  }

  return labelsByCode;
}

function getOccupationGroupLabel(occupationCode: string) {
  const groupCode = occupationCode.charAt(0);

  if (groupCode === "0") {
    return "Militære yrker";
  }

  if (groupCode === "3") {
    return "Høyskoleyrker";
  }

  return getOccupationGroupByCode(groupCode)?.label ?? "Andre yrker";
}
