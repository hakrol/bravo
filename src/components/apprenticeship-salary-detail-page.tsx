import Link from "next/link";
import { OccupationCardStatsRow } from "@/components/occupation-card-stats-row";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationSectionLinkNav } from "@/components/occupation-section-link-nav";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import { PageShareButton } from "@/components/page-share-button";
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

const TOOL_LINKS = [
  { colorClassName: "text-sky-700", href: "/kalkulatorer", icon: "calculator", title: "Kalkulatorer" },
  { colorClassName: "text-emerald-700", href: "/lonnsjekk", icon: "check", title: "Lønnssjekk" },
  { colorClassName: "text-indigo-700", href: "/sammenlign-lonn", icon: "compare", title: "Sammenlign lønn" },
];

const SPECIAL_LINKS = [
  { href: "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest", title: "I disse yrkene øker kvinneandelen raskest" },
  { href: "/spesial/topp-10-yrker", title: "Topp 10 yrker med høyest lønn" },
];

const POPULAR_APPRENTICESHIP_LINKS = [
  { href: "/laerling/elektrikere-laerling-lonn", title: "Elektrikere" },
  { href: "/laerling/automatikere-laerling-lonn", title: "Automatikere" },
  { href: "/laerling/tomrere-og-snekkere-laerling-lonn", title: "Tømrere og snekkere" },
  { href: "/laerling/rorleggere-og-vvs-montorer-laerling-lonn", title: "Rørleggere og VVS-montører" },
  { href: "/laerling/bilmekanikere-laerling-lonn", title: "Bilmekanikere" },
  { href: "/laerling/energimontorer-laerling-lonn", title: "Energimontører" },
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
    totalP25: distribution?.total?.p25,
    totalP75: distribution?.total?.p75,
    womenP25: distribution?.women?.p25,
    womenP75: distribution?.women?.p75,
    menP25: distribution?.men?.p25,
    menP75: distribution?.men?.p75,
  });
  const introText = buildIntroText(
    occupationText.seoLabel,
    detail.detailPage.summary,
    detail.occupationDescription,
  );
  const topSummaryStats = {
    salaryGrowthPercent: growthMetrics?.growth,
    genderPayGapPercent: calculateGenderPayGapPercent(
      distribution?.women?.median,
      distribution?.men?.median,
    ),
  };
  const sectionNavItems = [
    topSummary ? { href: "#kort-oppsummert", label: "Kort oppsummert" } : null,
    distribution ? { href: "#lonnsfordeling", label: "Lønnsfordeling" } : null,
    { href: "#lonnsutvikling", label: "Lønnsutvikling" },
    { href: "#ordinaer-yrkeslonn", label: "Ordinær yrkeslønn" },
    relatedRows.length > 0
      ? { href: "#relaterte-laerlingyrker", label: "Relaterte lærlingyrker" }
      : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="px-4 pb-3 pt-3 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-[5px] bg-[radial-gradient(circle_at_20%_15%,rgba(12,116,77,0.56),transparent_32%),linear-gradient(135deg,#053428_0%,#072d25_52%,#0b3b2e_100%)] px-5 py-7 shadow-[0_24px_60px_rgba(15,47,34,0.16)] sm:px-8 sm:py-9 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
                Lærlinglønn for {occupationText.titleLabel}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-emerald-50 sm:text-lg sm:leading-8">
                {introText}
              </p>
              <PageShareButton
                analytics={{
                  data: {
                    occupation_code: detail.detailPage.occupationCode,
                    occupation_label: occupationText.titleLabel,
                    occupation_slug: detail.detailPage.slug,
                    page_type: "apprenticeship_detail",
                  },
                  eventName: "Apprenticeship detail shared",
                }}
                text={`Se lærlinglønn og lønnsutvikling for ${occupationText.seoLabel}.`}
                title={`Lærlinglønn for ${occupationText.titleLabel}`}
              />
            </div>

            {growthMetrics ? (
              <div className="lg:justify-self-end">
                <div className="flex w-full max-w-sm items-start justify-between gap-4 rounded-[5px] bg-white px-5 py-5 text-slate-950 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:px-6 sm:py-6 lg:max-w-none">
                  <div className="flex flex-1 flex-col items-center text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span aria-hidden="true" className={`text-4xl leading-none ${growthMetrics.growth >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                        {growthMetrics.growth >= 0 ? "↑" : "↓"}
                      </span>
                      <p className={`whitespace-nowrap text-4xl font-semibold sm:text-5xl ${growthMetrics.growth >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                        {formatPercent(growthMetrics.growth)}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-medium leading-5 text-slate-600 sm:whitespace-nowrap">
                      Lønnsvekst siste år ({growthMetrics.previousPeriodLabel}–{growthMetrics.latestPeriodLabel})
                    </p>
                  </div>
                  <MetricInfoButton
                    description={`Lønnsvekst siste år viser endringen i median avtalt månedslønn for lærlinger fra ${growthMetrics.previousPeriodLabel.toLowerCase()} til ${growthMetrics.latestPeriodLabel.toLowerCase()}.`}
                    label="Lønnsvekst siste år"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        <OccupationSectionLinkNav
          analytics={{
            eventName: "Apprenticeship detail section clicked",
            occupationCode: detail.detailPage.occupationCode,
            occupationLabel: occupationText.titleLabel,
            occupationSlug: detail.detailPage.slug,
            pageType: "apprenticeship_detail",
          }}
          ariaLabel="Seksjoner på lærlingesiden"
          items={sectionNavItems}
        />

        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            {topSummary ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:px-6"
                id="kort-oppsummert"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Kort oppsummert
                </p>
                <p className="mt-3 max-w-4xl text-base leading-7 text-slate-950 sm:text-lg sm:leading-8">
                  {topSummary}
                </p>
                <OccupationCardStatsRow
                  className="mt-4"
                  gridClassName="grid-cols-2"
                  metrics={["salaryGrowth", "genderPayGap"]}
                  stats={topSummaryStats}
                />
              </section>
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2">
              {salaryMetricCards.map((card) => (
                <ApprenticeshipSalaryCard card={card} key={card.key} />
              ))}
            </section>

            {distribution ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
                id="lonnsfordeling"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Lønnsfordeling for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {distributionSummary}
                  </p>
                </div>
                <div className="mt-8">
                  <OccupationSalaryDistributionSection distribution={distribution} />
                </div>
              </section>
            ) : null}

            <section
              aria-label="Lønnsutvikling"
              className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
              id="lonnsutvikling"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
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
              <div className="mt-8">
                <OccupationSalaryTimeSeriesChart
                  description="Se utviklingen i lærlinglønn per år. Grafen viser median avtalt månedslønn for alle, kvinner og menn der SSB publiserer tall."
                  latestDataDescription={`Her ser du siste tilgjengelige årlige lærlinglønn for ${occupationText.sentenceLabel.toLowerCase()} basert på SSB tabell 12851.`}
                  series={detail.data.timeSeries}
                  title={`Utvikling i lærlinglønn for ${occupationText.titleLabel}`}
                  variant="classic-emphasis"
                />
              </div>
            </section>

            <section
              className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
              id="ordinaer-yrkeslonn"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Se ordinær yrkeslønn for {occupationText.titleLabel}
                </h2>
                <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                  Se lønnsstatistikk, lønnsestimat og forskjell på lærlinglønn og ordinærlønn for {occupationText.sentenceLabel.toLowerCase()}.
                </p>
                <Link
                  className="inline-flex items-center rounded-[5px] bg-[#0f2f22] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#164432]"
                  href={detail.detailPage.detailHref}
                >
                  Se ordinær yrkeslønn
                </Link>
              </div>
            </section>

            {relatedRows.length > 0 ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
                id="relaterte-laerlingyrker"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Relaterte lærlingyrker for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    Disse fagene er valgt ut fra nærhet i yrkeskode og tilgjengelige lærlingdata i SSB, slik at du kan sammenligne nivået med nærliggende fag.
                  </p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {relatedRows.map((row) => (
                      <Link
                        className="group flex h-full flex-col rounded-[5px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm transition hover:border-emerald-700/25 hover:bg-white hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
                        href={row.href}
                        key={row.occupationCode}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="block text-base font-semibold text-slate-950">
                            {formatOccupationDisplayLabel(row.occupationLabel)}
                          </span>
                          <span
                            aria-hidden="true"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition group-hover:border-emerald-700/25 group-hover:text-emerald-800"
                          >
                            <OccupationGroupIcon groupCode={row.groupCode} />
                          </span>
                        </div>
                        <dl className="mt-5 space-y-3 text-sm">
                          {buildRelatedJobSalaryRows(row).map((salaryRow) => (
                            <div
                              className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3"
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
              </section>
            ) : null}
          </div>

          <aside className="self-start rounded-[5px] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_44px_rgba(15,23,42,0.05)] lg:sticky lg:top-16">
            <section className="pb-3">
              <p className="text-sm leading-6 text-slate-600">
                Data fra{" "}
                <a className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-950" href={EXTERNAL_SOURCE_LINK} rel="noopener noreferrer" target="_blank">
                  Statistisk sentralbyrå (SSB)
                </a>
                . Sist oppdatert {updatedLabel ?? "i siste tilgjengelige publisering"}.
              </p>
            </section>

            <Link className="flex items-center gap-2.5 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-950" href={detail.detailPage.detailHref}>
              <SidebarLinkIcon className="text-slate-500" icon="salary" />
              <span className="min-w-0">Se ordinær yrkeslønn for {occupationText.titleLabel.toLowerCase()}</span>
            </Link>

            <section className="py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Spesial</p>
              <div className="mt-2.5 grid gap-2">
                {SPECIAL_LINKS.map((link) => (
                  <Link className="text-sm font-medium leading-5 text-slate-700 transition hover:text-slate-950 hover:underline hover:decoration-slate-300 hover:underline-offset-4" href={link.href} key={link.href}>
                    {link.title}
                  </Link>
                ))}
              </div>
            </section>

            <section className="py-3">
              <Link className="flex items-center gap-2.5 rounded-[5px] text-sm font-medium text-slate-700 transition hover:text-slate-950" href="/laerling">
                <SidebarLinkIcon className="text-slate-500" icon="list" />
                <span>Alle lærlingyrker</span>
              </Link>
            </section>

            <section className="py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Populære lærlingyrker</p>
              <nav aria-label="Populære lærlingyrker" className="mt-2.5 grid gap-2">
                {POPULAR_APPRENTICESHIP_LINKS.map((occupation) => (
                  <Link className="flex items-center gap-2.5 rounded-[5px] text-sm font-medium text-slate-700 transition hover:text-slate-950" href={occupation.href} key={occupation.href}>
                    <SidebarLinkIcon className="text-orange-600" icon="flame" />
                    <span>{occupation.title}</span>
                  </Link>
                ))}
              </nav>
            </section>

            <section className="py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Verktøy</p>
              <nav aria-label="Verktøy" className="mt-2.5 grid gap-2">
                {TOOL_LINKS.map((tool) => (
                  <Link className="flex items-center gap-2.5 rounded-[5px] text-sm font-medium text-slate-700 transition hover:text-slate-950" href={tool.href} key={tool.href}>
                    <SidebarLinkIcon className={tool.colorClassName} icon={tool.icon} />
                    <span>{tool.title}</span>
                  </Link>
                ))}
              </nav>
            </section>

            <section className="pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Fra bloggen</p>
              <div className="mt-2.5 grid gap-2">
                {[FEATURED_BLOG_POST, ...BLOG_DEMO_LINKS].map((post) => (
                  <Link className="text-sm font-medium leading-5 text-slate-700 transition hover:text-slate-950 hover:underline hover:decoration-slate-300 hover:underline-offset-4" href={post.href} key={post.href}>
                    {post.title}
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl lg:pr-[364px]">
          <div className="rounded-[5px] border border-slate-200 bg-white px-5 py-5 text-sm leading-6 text-slate-600 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:px-6">
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
  totalP25,
  totalP75,
  womenP25,
  womenP75,
  menP25,
  menP75,
}: {
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
  const cards: ApprenticeshipSalaryCardData[] = [];
  const hasBothGenderMetrics = womenMedian !== undefined && menMedian !== undefined;

  if (womenMedian !== undefined) {
    cards.push({
      key: "women",
      title: "Kvinner",
      value: womenMedian,
      caption: periodLabel,
      icon: <MetricAvatar tone="women" />,
      p25: womenP25,
      p75: womenP75,
      tone: "women",
    });
  }

  if (menMedian !== undefined) {
    cards.push({
      key: "men",
      title: "Menn",
      value: menMedian,
      caption: periodLabel,
      icon: <MetricAvatar tone="men" />,
      p25: menP25,
      p75: menP75,
      tone: "men",
    });
  }

  if (!hasBothGenderMetrics && totalMedian !== undefined) {
    cards.push({
      key: "all",
      title: "Alle",
      value: totalMedian,
      caption: periodLabel,
      p25: totalP25,
      p75: totalP75,
      tone: "neutral",
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

type ApprenticeshipSalaryCardData = {
  key: string;
  title: string;
  value?: number;
  caption?: string;
  icon?: React.ReactNode;
  p25?: number;
  p75?: number;
  tone: "women" | "men" | "neutral";
};

function ApprenticeshipSalaryCard({ card }: { card: ApprenticeshipSalaryCardData }) {
  const tone = getApprenticeshipSalaryCardTone(card.tone);

  return (
    <article className="overflow-hidden rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {card.icon ? <div className="shrink-0">{card.icon}</div> : null}
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-950">
            {card.title}
          </p>
        </div>
        {card.caption ? (
          <p className={`shrink-0 rounded-[10px] px-3 py-1.5 text-sm font-semibold shadow-sm ${tone.period}`}>
            {card.caption}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        <p className="text-sm font-medium text-slate-600">Avtalt månedslønn (median)</p>
        <MetricInfoButton
          description="Dette er median avtalt månedslønn for lærlinger i siste tilgjengelige SSB-år. Tallet viser lønnen som ligger midt i fordelingen."
          label={`${card.title} månedslønn forklart`}
          variant="muted"
        />
      </div>
      <p className="mt-1 text-[2.5rem] font-bold leading-none text-slate-950 tabular-nums sm:text-[2.75rem]">
        {formatSalary(card.value)}
      </p>
      <ApprenticeshipSalaryRangeLine
        max={card.p75}
        median={card.value}
        min={card.p25}
        tone={card.tone}
      />
    </article>
  );
}

function ApprenticeshipSalaryRangeLine({
  min,
  median,
  max,
  tone,
}: {
  min?: number;
  median?: number;
  max?: number;
  tone: ApprenticeshipSalaryCardData["tone"];
}) {
  if (min === undefined || median === undefined || max === undefined || min >= max) {
    return null;
  }

  const accent = getApprenticeshipSalaryCardTone(tone).accent;
  const medianPosition = `${Math.min(100, Math.max(0, ((median - min) / (max - min)) * 100))}%`;

  return (
    <div className="mt-8">
      <div className={`relative h-0.5 rounded-full ${accent.line}`}>
        <span className={`absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${accent.dot}`} />
        <span className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${accent.dot}`} style={{ left: medianPosition }} />
        <span className={`absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${accent.dot}`} />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm text-slate-700">
        <p className="font-medium tabular-nums">{formatCurrencyValue(min)}</p>
        <p className="text-center font-medium text-slate-500">De fleste ligger mellom</p>
        <p className="text-right font-medium tabular-nums">{formatCurrencyValue(max)}</p>
      </div>
    </div>
  );
}

function getApprenticeshipSalaryCardTone(tone: ApprenticeshipSalaryCardData["tone"]) {
  if (tone === "women") {
    return {
      accent: { dot: "bg-pink-500", line: "bg-pink-200" },
      period: "bg-pink-50 text-pink-800",
    };
  }

  if (tone === "men") {
    return {
      accent: { dot: "bg-sky-600", line: "bg-sky-200" },
      period: "bg-sky-50 text-sky-800",
    };
  }

  return {
    accent: { dot: "bg-emerald-700", line: "bg-emerald-200" },
    period: "bg-emerald-50 text-emerald-800",
  };
}

function calculateGenderPayGapPercent(women?: number, men?: number) {
  if (women === undefined || men === undefined || men === 0) {
    return undefined;
  }

  return (Math.abs(men - women) / men) * 100;
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

function SidebarLinkIcon({ className, icon }: { className: string; icon: string }) {
  const props = {
    "aria-hidden": true,
    className: `h-5 w-5 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (icon === "calculator") {
    return <svg {...props}><rect height="18" rx="2" width="14" x="5" y="3" /><path d="M8 7h8M8 11h1m3 0h1m3 0h1M8 15h1m3 0h1m3 0h1M8 18h1m3 0h5" /></svg>;
  }

  if (icon === "check") {
    return <svg {...props}><path d="M20 6 9 17l-5-5" /><path d="M12 3a9 9 0 1 0 9 9" /></svg>;
  }

  if (icon === "compare") {
    return <svg {...props}><path d="M7 4v16M17 4v16M4 8h6M14 16h6" /><path d="m8 6 2 2-2 2M16 14l-2 2 2 2" /></svg>;
  }

  if (icon === "flame") {
    return <svg {...props}><path d="M12 22c4 0 7-2.8 7-7 0-3.5-2-6.5-5.5-9 .2 2.5-.8 4-2.2 5.1.1-3.2-1.4-5.8-4.1-8.1.2 3.9-2.2 6-2.2 10 0 5.2 3 9 7 9Z" /></svg>;
  }

  if (icon === "salary") {
    return <svg {...props}><rect height="14" rx="2" width="18" x="3" y="5" /><path d="M7 9h4M7 13h7M17 9h.01" /></svg>;
  }

  return <svg {...props}><path d="M8 6h12M8 12h12M8 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></svg>;
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
