import Link from "next/link";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import type { ApprenticeshipMedianSalaryRow } from "@/lib/apprenticeship-salary-overview";
import type { ApprenticeshipDetailViewModel } from "@/lib/apprenticeship-detail-view-models";
import type { OccupationDescription } from "@/lib/occupation-descriptions";
import {
  formatOccupationDisplayLabel,
  getOccupationTextContext,
} from "@/lib/occupation-detail-pages";
import type { OccupationSalaryDistribution, OccupationSalaryTimeSeries } from "@/lib/types";

export type ApprenticeshipRelatedSalaryRow = {
  occupationCode: string;
  occupationLabel: string;
  href: string;
  detailHref: string;
  medianAll?: number;
  medianWomen?: number;
  medianMen?: number;
  growthWomen?: number;
  growthMen?: number;
  groupCode?: string;
};

export type ApprenticeshipSalaryDetailPageData = {
  timeSeries: OccupationSalaryTimeSeries;
  distribution: OccupationSalaryDistribution | null;
  medianOverview: {
    rows: ApprenticeshipMedianSalaryRow[];
    periodLabel?: string;
    measureLabel: string;
  };
  relatedRows: ApprenticeshipRelatedSalaryRow[];
};

type ApprenticeshipSalaryDetailPageProps = {
  detail: ApprenticeshipDetailViewModel;
};

const FEATURED_BLOG_POST = {
  href: "/blogg/hvordan-be-om-mer-lonn",
  title: "Hvordan be om mer lønn",
};

const BLOG_DEMO_LINKS = [
  {
    href: "/blogg/hvor-mye-mer-kan-man-be-om-i-lonn",
    title: "Hvor mye mer kan man be om i lønn?",
  },
  {
    href: "/blogg/nar-bor-man-be-om-hoyere-lonn",
    title: "Når bør man be om høyere lønn?",
  },
];

const EXTERNAL_SOURCE_LINK = "https://www.ssb.no/arbeid-og-lonn/lonn-og-arbeidskraftkostnader";

export function ApprenticeshipSalaryDetailPage({ detail }: ApprenticeshipSalaryDetailPageProps) {
  const occupationText = getOccupationTextContext({
    occupationCode: detail.detailPage.occupationCode,
    label: detail.detailPage.label,
    editorialLabel: detail.detailPage.editorialLabel,
    displayLabel: detail.detailPage.displayLabel,
  });
  const distribution = detail.data.distribution;
  const relatedRows = detail.data.relatedRows.slice(0, 6);
  const growthMetrics = buildGrowthMetrics(detail.data.timeSeries);
  const topSummary = buildTopSummary({
    label: occupationText.sentenceLabel,
    periodLabel: distribution?.periodLabel,
    totalMedian: distribution?.total?.median,
    womenMedian: distribution?.women?.median,
    menMedian: distribution?.men?.median,
    totalP25: distribution?.total?.p25,
    totalP75: distribution?.total?.p75,
    womenP25: distribution?.women?.p25,
    womenP75: distribution?.women?.p75,
    menP25: distribution?.men?.p25,
    menP75: distribution?.men?.p75,
  });
  const distributionSummary = buildDistributionSummary({
    label: occupationText.sentenceLabel,
    totalP25: distribution?.total?.p25,
    totalP75: distribution?.total?.p75,
    womenP25: distribution?.women?.p25,
    womenP75: distribution?.women?.p75,
    menP25: distribution?.men?.p25,
    menP75: distribution?.men?.p75,
  });
  const updatedLabel = formatUpdatedLabel(distribution?.updated ?? detail.data.timeSeries.updated);
  const latestPoint = detail.data.timeSeries.points[detail.data.timeSeries.points.length - 1];
  const salaryMetricCards = buildSalaryMetricCards({
    periodLabel: latestPoint?.periodLabel ?? distribution?.periodLabel,
    totalMedian: distribution?.total?.median,
    womenMedian: distribution?.women?.median,
    menMedian: distribution?.men?.median,
    average: distribution?.total?.average,
  });
  const introText = buildIntroText(
    occupationText.seoLabel,
    detail.detailPage.summary,
    detail.occupationDescription,
  );
  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="px-4 pb-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-b-[8px] border-b border-l border-r border-black bg-[#0f2f22] px-5 py-6 shadow-[0_24px_60px_rgba(15,47,34,0.14)] sm:px-8 sm:py-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
                Lærlinglønn for {occupationText.titleLabel}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-emerald-50 sm:text-lg sm:leading-8">
                {introText}
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div className="flex w-full max-w-sm items-start justify-between gap-4 rounded-md border border-black bg-white px-5 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:px-6 sm:py-5 lg:max-w-none">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1 text-2xl leading-none sm:text-3xl ${
                      growthMetrics === null
                        ? "text-slate-950"
                        : growthMetrics.growth >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                    }`}
                  >
                    {growthMetrics === null ? "→" : growthMetrics.growth >= 0 ? "↑" : "↓"}
                  </span>
                  <p
                    className={`whitespace-nowrap text-4xl font-semibold tracking-[-0.04em] sm:text-5xl ${
                      growthMetrics === null
                        ? "text-slate-950"
                        : growthMetrics.growth >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                    }`}
                  >
                    {formatPercent(growthMetrics?.growth)}
                  </p>
                </div>
                <MetricInfoButton
                  description={
                    growthMetrics
                      ? `Årsvekst viser endringen i median avtalt månedslønn for lærlinger fra ${growthMetrics.previousPeriodLabel.toLowerCase()} til ${growthMetrics.latestPeriodLabel.toLowerCase()}.`
                      : "Årsvekst viser endringen i median avtalt månedslønn fra siste tilgjengelige år sammenlignet med året før."
                  }
                  label="Årsvekst i lærlinglønn"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            {topSummary ? (
              <section
                className="rounded-md border border-black bg-[linear-gradient(135deg,rgba(244,239,230,0.72)_0%,rgba(230,240,234,0.78)_100%)] px-5 py-5 shadow-sm sm:px-6"
                id="oversikt"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Kort oppsummert
                </p>
                <p className="mt-3 max-w-4xl text-base leading-7 text-slate-950 sm:text-lg sm:leading-8">
                  {topSummary}
                </p>
              </section>
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {salaryMetricCards.map((card) => (
                <KeyMetric
                  caption={card.caption}
                  description={card.description}
                  icon={card.icon}
                  key={card.key}
                  label={card.label}
                  value={formatSalary(card.value)}
                />
              ))}
            </section>

            {distribution ? (
              <section className="space-y-4" id="lonnsfordeling">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Lønnsfordeling for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {distributionSummary}
                  </p>
                </div>
                <div className="rounded-md border border-black bg-white p-5 shadow-sm sm:p-6">
                  <OccupationSalaryDistributionSection distribution={distribution} />
                </div>
              </section>
            ) : null}

            <section aria-label="Lønnsutvikling" className="space-y-4" id="lonnsutvikling">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Lønnsutvikling for {occupationText.titleLabel}
                </h2>
                <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                  {buildTimeSeriesSummary({
                    label: occupationText.sentenceLabel,
                    metrics: growthMetrics,
                  })}{" "}
                  <Link
                    className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
                    href={FEATURED_BLOG_POST.href}
                  >
                    Les også {FEATURED_BLOG_POST.title.toLowerCase()}.
                  </Link>
                </p>
              </div>
              <OccupationSalaryTimeSeriesChart
                description="Se utviklingen i lærlinglønn per år. Grafen viser median avtalt månedslønn for alle, kvinner og menn der SSB publiserer tall."
                latestDataDescription={`Her ser du siste tilgjengelige årlige lærlinglønn for ${occupationText.sentenceLabel.toLowerCase()} basert på SSB tabell 12851.`}
                series={detail.data.timeSeries}
                title={`Utvikling i lærlinglønn for ${occupationText.titleLabel}`}
                variant="classic-emphasis"
              />
            </section>

            <section className="space-y-4">
              <div className="rounded-md border border-black bg-white p-5 shadow-sm sm:p-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Se ordinær yrkeslønn for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    Se lønnstatistikk, lønnsestimat og forskjell på lærlinglønn og ordinærlønn for {occupationText.sentenceLabel.toLowerCase()}.
                  </p>
                  <Link
                    className="inline-flex items-center rounded-md border border-black bg-[#0f2f22] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    href={detail.detailPage.detailHref}
                  >
                    Se ordinær yrkeslønn
                  </Link>
                </div>
              </div>
            </section>

            {relatedRows.length > 0 ? (
              <section className="space-y-4" id="relaterte-laerlingyrker">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Relaterte lærlingyrker for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    Disse fagene er valgt ut fra nærhet i yrkeskode og tilgjengelige lærlingdata i SSB, slik at du kan sammenligne nivået med nærliggende fag.
                  </p>
                </div>
                <div className="rounded-md border border-black bg-white p-5 shadow-sm sm:p-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {relatedRows.map((row) => (
                      <Link
                        className="rounded-md border border-black/10 bg-[#f7fafc] px-4 py-4 transition hover:border-[var(--primary)]/40 hover:bg-white"
                        href={row.href}
                        key={row.occupationCode}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="block text-base font-semibold text-slate-950">
                            {formatOccupationDisplayLabel(row.occupationLabel)}
                          </span>
                          <span
                            aria-hidden="true"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700"
                          >
                            <OccupationGroupIcon groupCode={row.groupCode} />
                          </span>
                        </div>
                        <dl className="mt-4 space-y-3 text-sm">
                          {buildRelatedJobSalaryRows(row).map((salaryRow) => (
                            <div
                              className="flex items-center justify-between gap-4 border-t border-black/10 pt-3"
                              key={salaryRow.label}
                            >
                              <dt className="text-slate-600">{salaryRow.label}</dt>
                              <dd className="font-semibold text-slate-950">
                                {formatSalary(salaryRow.value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <section className="rounded-md border border-black bg-white p-5 shadow-sm">
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Dataene på denne siden kommer fra{" "}
                  <a
                    className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
                    href={EXTERNAL_SOURCE_LINK}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Statistisk sentralbyrå (SSB)
                  </a>
                  , og tallene er sist oppdatert {updatedLabel ?? "i siste tilgjengelige publisering"}.
                </p>
              </section>

              <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Fra bloggen
                </p>
                <Link
                  className="mt-4 block rounded-md border border-black/10 px-4 py-3 transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
                  href={FEATURED_BLOG_POST.href}
                >
                  <span className="block text-sm font-semibold text-slate-950">
                    {FEATURED_BLOG_POST.title}
                  </span>
                </Link>
                <div className="mt-4 space-y-3">
                  {BLOG_DEMO_LINKS.map((post) => (
                    <Link
                      className="block rounded-md border border-black/10 px-4 py-3 transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
                      href={post.href}
                      key={post.href}
                    >
                      <span className="block text-sm font-semibold text-slate-950">
                        {post.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8" id="datakilder">
        <div className="mx-auto w-full max-w-7xl lg:pr-[364px]">
          <div className="rounded-md border border-black/10 bg-white px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm sm:px-5">
            <p>
              Hensikten med Lønnsinnsikt er å gjøre lønnsstatistikk enklere å forstå og bruke for flere.
            </p>
            <p className="mt-2">
              Innholdet på denne siden er ment som veiledende informasjon og skal ikke forstås som et løfte om faktisk lærlinglønn eller individuell lønnsutvikling. Tallene kommer fra SSB tabell 12851, gjelder årlige novembertall og kan variere med fag, bedrift, tariff, progresjon i læretiden og lokale forhold.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function buildIntroText(
  label: string,
  summary: string,
  occupationDescription: OccupationDescription | null,
) {
  if (occupationDescription?.intro) {
    return `${occupationDescription.intro} Her finner du lærlinglønn, lønnsutvikling og fordeling for ${label.toLowerCase()}, basert på årlige tall fra Statistisk sentralbyrå.`;
  }

  return summary;
}

function buildTopSummary({
  label,
  periodLabel,
  totalMedian,
  womenMedian,
  menMedian,
  totalP25,
  totalP75,
  womenP25,
  womenP75,
  menP25,
  menP75,
}: {
  label: string;
  periodLabel?: string;
  totalMedian?: number;
  womenMedian?: number;
  menMedian?: number;
  totalP25?: number;
  totalP75?: number;
  womenP25?: number;
  womenP75?: number;
  menP25?: number;
  menP75?: number;
}) {
  if (totalMedian === undefined && womenMedian === undefined && menMedian === undefined) {
    return null;
  }

  const medianSentence =
    womenMedian !== undefined && menMedian !== undefined
      ? `Median lærlinglønn for ${label.toLowerCase()} er ${formatSalary(womenMedian)} for kvinner og ${formatSalary(menMedian)} for menn.`
      : totalMedian !== undefined
        ? `Median lærlinglønn for ${label.toLowerCase()} er ${formatSalary(totalMedian)}.`
        : womenMedian !== undefined
          ? `Median lærlinglønn for kvinnelige lærlinger i ${label.toLowerCase()} er ${formatSalary(womenMedian)}.`
          : `Median lærlinglønn for mannlige lærlinger i ${label.toLowerCase()} er ${formatSalary(menMedian)}.`;

  const rangeSentence =
    womenP25 !== undefined && womenP75 !== undefined && menP25 !== undefined && menP75 !== undefined
      ? `De fleste kvinnelige lærlinger ligger mellom ${formatSalary(womenP25)} og ${formatSalary(womenP75)}, mens de fleste mannlige lærlinger ligger mellom ${formatSalary(menP25)} og ${formatSalary(menP75)}.`
      : totalP25 !== undefined && totalP75 !== undefined
        ? `De fleste lærlinger i faget ligger mellom ${formatSalary(totalP25)} og ${formatSalary(totalP75)}.`
        : null;

  const sourceSentence = periodLabel
    ? `Tallene er basert på SSB-data for ${periodLabel}.`
    : "Tallene er basert på siste tilgjengelige SSB-data.";

  return [medianSentence, rangeSentence, sourceSentence]
    .filter((part): part is string => Boolean(part))
    .join(" ");
}

function buildDistributionSummary({
  label,
  totalP25,
  totalP75,
  womenP25,
  womenP75,
  menP25,
  menP75,
}: {
  label: string;
  totalP25?: number;
  totalP75?: number;
  womenP25?: number;
  womenP75?: number;
  menP25?: number;
  menP75?: number;
}) {
  if (
    womenP25 !== undefined &&
    womenP75 !== undefined &&
    menP25 !== undefined &&
    menP75 !== undefined
  ) {
    const womenSpread = womenP75 - womenP25;
    const menSpread = menP75 - menP25;
    const difference = Math.abs(womenSpread - menSpread);

    return `Her ser du hvordan lærlinglønnen typisk fordeler seg i ${label.toLowerCase()}. Blant kvinner skiller det ${formatCurrencyValue(womenSpread)} mellom de som tjener mindre og de som tjener mer. For menn er forskjellen ${formatCurrencyValue(menSpread)}. ${difference > 0 ? `Spennet er størst blant ${womenSpread > menSpread ? "kvinner" : "menn"}, med ${formatCurrencyValue(difference)} mer mellom lav og høy enn i den andre gruppen.` : "Lønnsspennet er omtrent likt for kvinner og menn."}`;
  }

  if (totalP25 !== undefined && totalP75 !== undefined) {
    return `Her ser du hvordan lærlinglønnen typisk fordeler seg i ${label.toLowerCase()}. De fleste lærlinger ligger mellom ${formatSalary(totalP25)} og ${formatSalary(totalP75)} i siste tilgjengelige SSB-år.`;
  }

  return `Her ser du hvordan lærlinglønnen typisk fordeler seg i ${label.toLowerCase()} basert på siste tilgjengelige tall fra SSB.`;
}

function buildTimeSeriesSummary({
  label,
  metrics,
}: {
  label: string;
  metrics: { growth: number; latestPeriodLabel: string; previousPeriodLabel: string } | null;
}) {
  if (!metrics) {
    return `Grafen viser årlig utvikling i lærlinglønn for ${label.toLowerCase()} siden 2017, basert på median avtalt månedslønn i SSB.`;
  }

  const direction = metrics.growth >= 0 ? "opp" : "ned";
  return `Grafen viser årlig utvikling i lærlinglønn for ${label.toLowerCase()} siden 2017. Fra ${metrics.previousPeriodLabel.toLowerCase()} til ${metrics.latestPeriodLabel.toLowerCase()} gikk median lærlinglønn ${direction} med ${formatPercent(Math.abs(metrics.growth))}.`;
}

function buildSalaryMetricCards({
  periodLabel,
  totalMedian,
  womenMedian,
  menMedian,
  average,
}: {
  periodLabel?: string;
  totalMedian?: number;
  womenMedian?: number;
  menMedian?: number;
  average?: number;
}) {
  const cards: Array<{
    key: string;
    label: string;
    value?: number;
    caption: string;
    description: string;
    icon?: React.ReactNode;
  }> = [];
  const hasBothGenderMetrics = womenMedian !== undefined && menMedian !== undefined;

  if (womenMedian !== undefined) {
    cards.push({
      key: "women",
      label: "Månedslønn",
      value: womenMedian,
      caption: periodLabel ? `Kvinner ${periodLabel}` : "Kvinner",
      description: "Median avtalt månedslønn for kvinnelige lærlinger i siste tilgjengelige SSB-år.",
      icon: <MetricAvatar tone="women" />,
    });
  }

  if (menMedian !== undefined) {
    cards.push({
      key: "men",
      label: "Månedslønn",
      value: menMedian,
      caption: periodLabel ? `Menn ${periodLabel}` : "Menn",
      description: "Median avtalt månedslønn for mannlige lærlinger i siste tilgjengelige SSB-år.",
      icon: <MetricAvatar tone="men" />,
    });
  }

  if (!hasBothGenderMetrics && totalMedian !== undefined) {
    cards.push({
      key: "all",
      label: "Månedslønn",
      value: totalMedian,
      caption: periodLabel ? `Alle ${periodLabel}` : "Alle",
      description: "Median avtalt månedslønn for alle lærlinger når kjønnsdelte tall ikke er komplette.",
    });
  }

  if (average !== undefined) {
    cards.push({
      key: "average",
      label: "Gjennomsnitt",
      value: average,
      caption: periodLabel ? `Alle ${periodLabel}` : "Siste tilgjengelige år",
      description: "Gjennomsnittlig avtalt månedslønn for alle lærlinger i siste tilgjengelige SSB-år.",
    });
  }

  return cards;
}

function buildRelatedJobSalaryRows(row: ApprenticeshipRelatedSalaryRow) {
  const salaryRows: Array<{ label: string; value?: number }> = [];
  const hasBothGenderMetrics = row.medianWomen !== undefined && row.medianMen !== undefined;

  if (row.medianWomen !== undefined) {
    salaryRows.push({ label: "Kvinner", value: row.medianWomen });
  }

  if (row.medianMen !== undefined) {
    salaryRows.push({ label: "Menn", value: row.medianMen });
  }

  if (!hasBothGenderMetrics && row.medianAll !== undefined) {
    salaryRows.push({ label: "Alle", value: row.medianAll });
  }

  return salaryRows;
}

function buildGrowthMetrics(series: OccupationSalaryTimeSeries) {
  if (series.points.length < 2) {
    return null;
  }

  const latest = series.points[series.points.length - 1];
  const previous = series.points[series.points.length - 2];
  const latestValue = latest.valueAll ?? latest.valueWomen ?? latest.valueMen;
  const previousValue = previous.valueAll ?? previous.valueWomen ?? previous.valueMen;

  if (latestValue === undefined || previousValue === undefined || previousValue === 0) {
    return null;
  }

  return {
    growth: ((latestValue - previousValue) / previousValue) * 100,
    latestPeriodLabel: latest.periodLabel,
    previousPeriodLabel: previous.periodLabel,
  };
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatCurrencyValue(value?: number) {
  if (value === undefined) {
    return "mangler tall";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatPercent(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function formatUpdatedLabel(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type KeyMetricProps = {
  label: string;
  value: string;
  caption?: string;
  description?: string;
  icon?: React.ReactNode;
};

function KeyMetric({
  label,
  value,
  caption,
  description,
  icon,
}: KeyMetricProps) {
  return (
    <article className="rounded-md border border-black bg-white p-5 shadow-sm">
      <div className="flex items-start gap-2">
        {icon ? <div className="mr-1 shrink-0">{icon}</div> : null}
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        {description ? <MetricInfoButton description={description} label={label} /> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
      {caption ? <p className="mt-2 text-sm text-slate-500">{caption}</p> : null}
    </article>
  );
}

function MetricAvatar({ tone }: { tone: "women" | "men" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 w-5 items-center justify-center text-sm font-semibold ${
        tone === "women" ? "text-pink-500" : "text-sky-600"
      }`}
    >
      {tone === "women" ? "♀" : "♂"}
    </span>
  );
}

function OccupationGroupIcon({ groupCode }: { groupCode?: string }) {
  const commonProps = {
    className: "h-5 w-5",
    fill: "none",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  } as const;

  switch (groupCode) {
    case "1":
      return (
        <svg {...commonProps}>
          <path d="M6 18h12M8 15V9m4 6V6m4 9v-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "2":
      return (
        <svg {...commonProps}>
          <path d="M4 9 12 5l8 4-8 4-8-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M7 12v3.5c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5V12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "4":
      return (
        <svg {...commonProps}>
          <rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 10h14" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "5":
      return (
        <svg {...commonProps}>
          <path d="M7 7h10l-1 4H8L7 7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <circle cx="9" cy="16.5" r="1.5" fill="currentColor" />
          <circle cx="15" cy="16.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "6":
      return (
        <svg {...commonProps}>
          <path d="M12 19V8m0 0-3 3m3-3 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M6 19h12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "7":
      return (
        <svg {...commonProps}>
          <path d="m6 14 8-8 4 4-8 8H6v-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "8":
      return (
        <svg {...commonProps}>
          <rect x="4" y="9" width="13" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M17 11h2l1 2v2h-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <circle cx="8" cy="16.5" r="1.5" fill="currentColor" />
          <circle cx="17" cy="16.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "9":
      return (
        <svg {...commonProps}>
          <path d="M8 6h8M7 9h10M9 12h6M10 15h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 9v3l2 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
  }
}
