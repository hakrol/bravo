import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HourlySalaryDetailPage } from "@/components/hourly-salary-detail-page";
import {
  buildEstimatedHourlySalaryDistribution,
  buildEstimatedHourlySalaryTimeSeries,
  convertMonthlySalaryToHourly,
  getLatestPointWithValues,
} from "@/lib/hourly-salary";
import { getHourlySalaryPages, resolveHourlySalaryPageBySlug } from "@/lib/hourly-salary-pages";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationSalaryDistribution,
  getOccupationSalaryTimeSeries,
  OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

type HourlySalaryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = await getHourlySalaryPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: HourlySalaryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await resolveHourlySalaryPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.href,
    },
    openGraph: {
      type: "article",
      locale: "nb_NO",
      url: page.href,
      siteName: siteConfig.name,
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
    },
  };
}

export default async function HourlySalaryPage({ params }: HourlySalaryPageProps) {
  const { slug } = await params;
  const page = await resolveHourlySalaryPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const [monthlySeries, distribution, averageDataset] = await Promise.all([
    getOccupationSalaryTimeSeries(
      page.occupationCode,
      OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
    ),
    getOccupationSalaryDistribution(page.occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
    getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS),
  ]);

  const hourlySeries = buildEstimatedHourlySalaryTimeSeries(monthlySeries);
  const hourlyDistribution = buildEstimatedHourlySalaryDistribution(distribution);
  const latestHourlyPoint = getLatestPointWithValues(hourlySeries.points);
  const latestMonthlyPoint = getLatestPointWithValues(monthlySeries.points);
  const averageOverview = buildOccupationSalaryOverview(averageDataset, {
    occupationCodes: [page.occupationCode],
  });
  const averageRow = averageOverview.rows.find((row) => row.occupationCode === page.occupationCode);

  const summaryText = buildTopSummary({
    occupationLabel: page.titleOccupationLabel,
    periodLabel: distribution?.periodLabel,
    womenMedianHourly: hourlyDistribution?.women?.median,
    menMedianHourly: hourlyDistribution?.men?.median,
    womenP25Hourly: hourlyDistribution?.women?.p25,
    womenP75Hourly: hourlyDistribution?.women?.p75,
    menP25Hourly: hourlyDistribution?.men?.p25,
    menP75Hourly: hourlyDistribution?.men?.p75,
  });

  const sourceNote = buildSourceNote({
    periodLabel: distribution?.periodLabel ?? averageOverview.periodLabel,
  });

  const faqItems = buildFaqItems({
    occupationLabel: page.titleOccupationLabel,
    periodLabel: distribution?.periodLabel ?? averageOverview.periodLabel,
    womenMedianHourly: hourlyDistribution?.women?.median,
    menMedianHourly: hourlyDistribution?.men?.median,
    womenAverageHourly:
      averageRow?.salaryWomen !== undefined ? convertMonthlySalaryToHourly(averageRow.salaryWomen) : undefined,
    menAverageHourly:
      averageRow?.salaryMen !== undefined ? convertMonthlySalaryToHourly(averageRow.salaryMen) : undefined,
    allAverageHourly:
      averageRow?.salaryAll !== undefined ? convertMonthlySalaryToHourly(averageRow.salaryAll) : undefined,
  });

  return (
    <HourlySalaryDetailPage
      faqItems={faqItems}
      hourlyDistribution={hourlyDistribution}
      hourlySeries={hourlySeries}
      latestHourlyPoint={latestHourlyPoint}
      latestMonthlyPoint={latestMonthlyPoint}
      page={page}
      sourceNote={sourceNote}
      summaryText={summaryText}
    />
  );
}

function buildTopSummary({
  occupationLabel,
  periodLabel,
  womenMedianHourly,
  menMedianHourly,
  womenP25Hourly,
  womenP75Hourly,
  menP25Hourly,
  menP75Hourly,
}: {
  occupationLabel: string;
  periodLabel?: string;
  womenMedianHourly?: number;
  menMedianHourly?: number;
  womenP25Hourly?: number;
  womenP75Hourly?: number;
  menP25Hourly?: number;
  menP75Hourly?: number;
}) {
  if (womenMedianHourly === undefined && menMedianHourly === undefined) {
    return null;
  }

  const womenRange = formatHourlyRangeText(womenP25Hourly, womenP75Hourly);
  const menRange = formatHourlyRangeText(menP25Hourly, menP75Hourly);
  const medianSentence =
    womenMedianHourly !== undefined && menMedianHourly !== undefined
      ? `Median timelønn for ${occupationLabel} i Norge er ${formatHourlyMetric(womenMedianHourly)} for kvinner og ${formatHourlyMetric(menMedianHourly)} for menn.`
      : womenMedianHourly !== undefined
        ? `Median timelønn for kvinner i ${occupationLabel} i Norge er ${formatHourlyMetric(womenMedianHourly)}.`
        : `Median timelønn for menn i ${occupationLabel} i Norge er ${formatHourlyMetric(menMedianHourly)}.`;

  let rangeSentence: string | null = null;

  if (womenRange && menRange) {
    rangeSentence = `De fleste kvinner ligger mellom ${womenRange}, og de fleste menn ligger mellom ${menRange}`;
  } else if (womenRange) {
    rangeSentence = `De fleste kvinner ligger mellom ${womenRange}`;
  } else if (menRange) {
    rangeSentence = `De fleste menn ligger mellom ${menRange}`;
  }

  const sourceSentence = rangeSentence
    ? `${rangeSentence}, ${periodLabel ? `basert på SSB-data for ${periodLabel.toLowerCase()}` : "basert på siste tilgjengelige SSB-data"}.`
    : `${periodLabel ? `Basert på SSB-data for ${periodLabel.toLowerCase()}` : "Basert på siste tilgjengelige SSB-data"}.`;

  return [medianSentence, sourceSentence]
    .filter((part): part is string => Boolean(part))
    .join(" ");
}

function buildSourceNote({ periodLabel }: { periodLabel?: string }) {
  const periodText = periodLabel ? ` for ${periodLabel}` : "";

  return `Tallene på denne siden er hentet fra Statistisk sentralbyrå (SSB) og bygger på offisiell lønnsstatistikk${periodText}. Timelønn er regnet om fra avtalt månedslønn for å gi et mer sammenlignbart bilde av nivået i yrket.`;
}

function buildFaqItems({
  occupationLabel,
  periodLabel,
  womenMedianHourly,
  menMedianHourly,
  womenAverageHourly,
  menAverageHourly,
  allAverageHourly,
}: {
  occupationLabel: string;
  periodLabel?: string;
  womenMedianHourly?: number;
  menMedianHourly?: number;
  womenAverageHourly?: number;
  menAverageHourly?: number;
  allAverageHourly?: number;
}) {
  const periodText = periodLabel ? ` i ${periodLabel}` : "";
  const medianText =
    womenMedianHourly !== undefined && menMedianHourly !== undefined
      ? `I siste tilgjengelige SSB-periode${periodText} er median timelønn ${formatHourlyMetric(womenMedianHourly)} for kvinner og ${formatHourlyMetric(menMedianHourly)} for menn.`
      : womenMedianHourly !== undefined
        ? `I siste tilgjengelige SSB-periode${periodText} er median timelønn ${formatHourlyMetric(womenMedianHourly)} for kvinner.`
        : menMedianHourly !== undefined
          ? `I siste tilgjengelige SSB-periode${periodText} er median timelønn ${formatHourlyMetric(menMedianHourly)} for menn.`
          : `Vi mangler nok data til å vise et presist mediannivå akkurat nå.`;

  const averageSegments = [
    allAverageHourly !== undefined ? `begge kjønn: ${formatHourlyMetric(allAverageHourly)}` : null,
    womenAverageHourly !== undefined ? `kvinner: ${formatHourlyMetric(womenAverageHourly)}` : null,
    menAverageHourly !== undefined ? `menn: ${formatHourlyMetric(menAverageHourly)}` : null,
  ].filter((segment): segment is string => Boolean(segment));

  const averageText =
    averageSegments.length > 0
      ? `Basert på gjennomsnittlig avtalt månedslønn fra SSB tilsvarer gjennomsnittlig timelønn for ${occupationLabel} ${averageSegments.join(", ")}${periodText}.`
      : `Vi mangler nok data til å beregne gjennomsnittlig timelønn for ${occupationLabel} akkurat nå.`;

  return [
    {
      question: `Hvor mye tjener man i timen som ${occupationLabel}?`,
      answer: `${medianText} Det gir et godt bilde av hva som er et typisk nivå i yrket, men faktisk lønn per time varierer med erfaring, arbeidssted, tillegg, turnus og ansvar.`,
    },
    {
      question: `Hva er normal timelønn for ${occupationLabel}?`,
      answer: `Når folk spør om normal timelønn, er median ofte det mest nyttige målet fordi det viser nivået midt i fordelingen. ${medianText} Det er derfor dette nivået som best beskriver hva som er vanlig i yrket.`,
    },
    {
      question: `Hva er gjennomsnittlig timelønn for ${occupationLabel}?`,
      answer: `${averageText} Gjennomsnitt kan være høyere eller lavere enn median fordi noen få svært høye eller lave lønninger påvirker snittet mer enn medianen.`,
    },
  ];
}

function formatHourlyMetric(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${Math.round(value).toLocaleString("nb-NO")} kr/time`;
}

function formatHourlyRangeText(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return null;
  }

  return `${formatHourlyMetric(min)} og ${formatHourlyMetric(max)}`;
}