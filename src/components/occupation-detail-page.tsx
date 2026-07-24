import Link from "next/link";
import { OccupationCardStatsRow } from "@/components/occupation-card-stats-row";
import { OccupationAgeTimeSeriesChart } from "@/components/occupation-age-time-series";
import { OccupationPurchasingPowerLineChart } from "@/components/occupation-purchasing-power-line-chart";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { OccupationSalaryEstimate } from "@/components/occupation-salary-estimate";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import { OccupationSectorSalaryTimeSeriesChart } from "@/components/occupation-sector-salary-time-series";
import { OccupationWorkforceTimeSeriesChart } from "@/components/occupation-workforce-time-series";
import { OccupationSectionLinkNav } from "@/components/occupation-section-link-nav";
import { PageShareButton } from "@/components/page-share-button";
import { getApprenticeshipDetailPageByOccupationCode } from "@/lib/apprenticeship-detail-view-models";
import {
  getOccupationFiveYearGrowthComparison,
  type OccupationFiveYearGrowthComparison,
} from "@/lib/occupation-five-year-growth";
import type { OccupationDetailViewModel } from "@/lib/occupation-detail-view-models";
import { formatOccupationDisplayLabel, getOccupationTextContext } from "@/lib/occupation-detail-pages";

type OccupationDetailPageProps = {
  detail: OccupationDetailViewModel;
};

const FEATURED_BLOG_POST = {
  href: "/blogg/hvordan-be-om-mer-lonn",
  title: "Hvordan be om mer lønn?",
};

const SIDEBAR_BLOG_LINKS = [
  {
    href: "/blogg/dette-er-norges-vanligste-yrker",
    title: "Dette er Norges vanligste yrker",
  },
  {
    href: "/blogg/hva-er-gjennomsnittlig-lonnsvekst-i-norge",
    title: "Hva er gjennomsnittlig lønnsvekst i Norge?",
  },
  {
    href: "/blogg/hvilke-yrker-tjener-over-1-million",
    title: "Hvilke yrker tjener over 1 million kroner?",
  },
];

const TOOL_LINKS = [
  {
    colorClassName: "text-sky-700",
    href: "/kalkulatorer",
    icon: "calculator",
    title: "Kalkulatorer",
  },
  {
    colorClassName: "text-emerald-700",
    href: "/lonnsjekk",
    icon: "check",
    title: "Lønnssjekk",
  },
  {
    colorClassName: "text-indigo-700",
    href: "/sammenlign-lonn",
    icon: "compare",
    title: "Sammenlign lønn",
  },
];

const SPECIAL_LINKS = [
  {
    href: "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest",
    title: "I disse yrkene øker kvinneandelen raskest",
  },
  {
    href: "/spesial/topp-10-yrker",
    title: "Topp 10 yrker med høyest lønn",
  },
];

const POPULAR_OCCUPATION_LINKS = [
  {
    href: "/yrke/politikere-lonn",
    title: "Politikere",
  },
  {
    href: "/yrke/elektrikere-lonn",
    title: "Elektrikere",
  },
  {
    href: "/yrke/flygere-lonn",
    title: "Flygere",
  },
  {
    href: "/yrke/legespesialister-lonn",
    title: "Legespesialister",
  },
  {
    href: "/yrke/sykepleiere-lonn",
    title: "Sykepleiere",
  },
  {
    href: "/yrke/dommere-lonn",
    title: "Dommere",
  },
];

const EXTERNAL_SOURCE_LINKS = [
  {
    href: "https://www.ssb.no/arbeid-og-lonn/lonn-og-arbeidskraftkostnader",
    label: "Se lønnsstatistikk hos Statistisk sentralbyrå",
  },
];

export async function OccupationDetailPage({ detail }: OccupationDetailPageProps) {
  const occupationText = getOccupationTextContext({
    occupationCode: detail.detailPage.occupationCode,
    label: detail.detailPage.label,
    editorialLabel: detail.detailPage.editorialLabel,
    displayLabel: detail.detailPage.displayLabel,
  });
  const distribution = detail.data.distribution;
  const contractedDistribution = detail.data.contractedDistribution;
  const laborMarket = detail.data.laborMarketStats;
  const medianGrowthMetrics = buildMedianGrowthMetrics(detail.data.medianBasicSalarySeries);
  const fiveYearGrowthComparison = await getOccupationFiveYearGrowthComparison(
    detail.detailPage.occupationCode,
  );
  const latestSalaryPoint =
    detail.data.medianBasicSalarySeries.points[
      detail.data.medianBasicSalarySeries.points.length - 1
    ];
  const latestSalaryPeriodLabel = latestSalaryPoint
    ? formatQuarterCodeLabel(latestSalaryPoint.periodLabel)
    : distribution?.periodLabel;
  const intro =
    detail.occupationDescription?.intro ??
    `${occupationText.seoLabel} er en yrkesgruppe i SSBs yrkesstatistikk.`;
  const estimateMonthlySalary = distribution?.total?.median;
  const estimateMonthlySalaryWomen = distribution?.women?.median;
  const estimateMonthlySalaryMen = distribution?.men?.median;
  const salaryCompositionCards = buildSalaryCompositionCards({
    distribution,
    contractedDistribution,
    latestSalaryPeriodLabel,
  });
  const hasEstimate =
    estimateMonthlySalary !== undefined ||
    estimateMonthlySalaryWomen !== undefined ||
    estimateMonthlySalaryMen !== undefined;
  const topSummary = buildTopSummary({
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
    womenEmployees: laborMarket?.genderBreakdown?.women,
    menEmployees: laborMarket?.genderBreakdown?.men,
    employmentPeriodLabel: laborMarket?.genderBreakdown?.periodLabel,
  });
  const topSummaryStats = buildTopSummaryStats({
    salaryGrowthPercent: medianGrowthMetrics?.salaryGrowth,
    employeeGrowthPercent: laborMarket?.growth?.yearOverYearChange,
    averageAge: laborMarket?.age?.averageAll,
    womenMedian: distribution?.women?.median,
    menMedian: distribution?.men?.median,
  });
  const distributionSummary = buildDistributionSummary({
    totalP25: distribution?.total?.p25,
    totalP75: distribution?.total?.p75,
    womenP25: distribution?.women?.p25,
    womenP75: distribution?.women?.p75,
    menP25: distribution?.men?.p25,
    menP75: distribution?.men?.p75,
  });
  const salaryDevelopmentSummary = buildSalaryDevelopmentSummary(fiveYearGrowthComparison);
  const purchasingPowerSummary = buildPurchasingPowerSummary(
    detail.data.trendData.purchasingPowerSeries,
  );
  const laborMarketSummary = buildLaborMarketSummary(laborMarket);
  const relatedRows = detail.data.relatedRows.slice(0, 6);
  const relatedJobsSummary = buildRelatedJobsSummary({
    currentMedian: estimateMonthlySalary,
    rows: relatedRows,
  });
  const apprenticeshipPage = await getApprenticeshipDetailPageByOccupationCode(
    detail.detailPage.occupationCode,
  );
  const sectionNavItems = [
    topSummary ? { href: "#kort-oppsummert", label: "Kort oppsummert" } : null,
    distribution ? { href: "#lonnsfordeling", label: "Lønnsfordeling" } : null,
    { href: "#lonnsutvikling", label: "Lønnsutvikling" },
    { href: "#reallonn", label: "Reallønn" },
    hasEstimate ? { href: "#lonnsestimat", label: "Lønnsestimat" } : null,
    relatedRows.length > 0 ? { href: "#relaterte-jobber", label: "Relaterte jobber" } : null,
    laborMarket ? { href: "#arbeidsmarked", label: "Arbeidsmarked" } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="px-4 pb-3 pt-3 text-white sm:px-6 lg:px-8">
        <div
          className="mx-auto w-full max-w-7xl rounded-[5px] bg-[radial-gradient(circle_at_20%_15%,rgba(12,116,77,0.56),transparent_32%),linear-gradient(135deg,#053428_0%,#072d25_52%,#0b3b2e_100%)] px-5 py-7 shadow-[0_24px_60px_rgba(15,47,34,0.16)] sm:px-8 sm:py-9 lg:px-12"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
                Lønn for {occupationText.titleLabel}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-emerald-50 sm:text-lg sm:leading-8">
                {buildHeroIntro(occupationText.seoLabel, intro)} Her finner du lønn,
                lønnsutvikling og arbeidsmarkedstall for {occupationText.seoLabel}, basert på
                tall fra Statistisk sentralbyrå.
              </p>
              <PageShareButton
                analytics={{
                  data: {
                    occupation_code: detail.detailPage.occupationCode,
                    occupation_label: occupationText.titleLabel,
                    occupation_slug: detail.detailPage.slug,
                    page_type: "occupation_detail",
                  },
                  eventName: "Occupation detail shared",
                }}
                text={`Se lønn, lønnsutvikling og arbeidsmarkedstall for ${occupationText.seoLabel}.`}
                title={`Lønn for ${occupationText.titleLabel}`}
              />
            </div>

            {medianGrowthMetrics ? (
              <div className="lg:justify-self-end">
                <div className="flex w-full max-w-sm items-start justify-between gap-4 rounded-[5px] bg-white px-5 py-5 text-slate-950 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:px-6 sm:py-6 lg:max-w-none">
                  <div className="flex flex-1 flex-col items-center text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`text-4xl leading-none ${
                          medianGrowthMetrics.salaryGrowth >= 0 ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {medianGrowthMetrics.salaryGrowth >= 0 ? "↑" : "↓"}
                      </span>
                      <p
                        className={`whitespace-nowrap text-4xl font-semibold sm:text-5xl ${
                          medianGrowthMetrics.salaryGrowth >= 0 ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {formatPercent(medianGrowthMetrics.salaryGrowth)}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-medium leading-5 text-slate-600 sm:whitespace-nowrap">
                      Lønnsvekst siste år ({medianGrowthMetrics.previousPeriodLabel}–{medianGrowthMetrics.latestPeriodLabel})
                    </p>
                  </div>
                  <MetricInfoButton
                    description={`Lønnsvekst siste år viser endringen i median månedslønn for begge kjønn fra ${medianGrowthMetrics.previousPeriodLabel.toLowerCase()} til ${medianGrowthMetrics.latestPeriodLabel.toLowerCase()}.`}
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
            occupationCode: detail.detailPage.occupationCode,
            occupationLabel: occupationText.titleLabel,
            occupationSlug: detail.detailPage.slug,
          }}
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
                  gridClassName="grid-cols-2 sm:grid-cols-4"
                  stats={topSummaryStats}
                />
              </section>
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2">
              {salaryCompositionCards.map((card) => (
                <SalaryCompositionCard card={card} key={card.key} />
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
                  <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {salaryDevelopmentSummary}{" "}
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
                  description="Se utviklingen i månedslønn per år. Grafen viser median månedslønn for begge kjønn, kvinner og menn basert på tilgjengelige tall fra SSB."
                  series={detail.data.medianBasicSalarySeries}
                  variant="classic-emphasis"
                  title={`Utvikling i månedslønn for ${occupationText.titleLabel}`}
                />
              </div>
            </section>

            <section
              className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
              id="reallonn"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Reallønnsvekst for {occupationText.titleLabel}
                </h2>
                <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                  {purchasingPowerSummary}
                </p>
              </div>
              <div className="mt-8">
                <OccupationPurchasingPowerLineChart
                  series={detail.data.trendData.purchasingPowerSeries}
                />
              </div>
            </section>

            {hasEstimate ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
                id="lonnsestimat"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Lønnsestimat for {occupationText.titleLabel}
                  </h2>
                  <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    Her ser du et forenklet lønnsestimat der du kan veksle mellom samlet median
                    månedslønn og avtalt månedslønn i yrket. Vi bruker vanlig heltidsstilling,
                    standard feriepengesats og et fast
                    skatteanslag for å vise timelønn, årslønn, feriepengeestimat og omtrent hva det
                    kan gi utbetalt.{" "}
                    <Link
                      className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
                      href="/blogg/hvor-mye-mer-kan-man-be-om-i-lonn"
                    >
                      Les også hvor mye mer kan man be om i lønn?
                    </Link>
                  </p>
                </div>
                <div className="mt-8">
                  <OccupationSalaryEstimate
                    contractedMonthlySalary={contractedDistribution?.total?.median}
                    contractedMonthlySalaryMen={contractedDistribution?.men?.median}
                    contractedMonthlySalaryWomen={contractedDistribution?.women?.median}
                    embedded
                    monthlySalary={estimateMonthlySalary}
                    monthlySalaryMen={estimateMonthlySalaryMen}
                    monthlySalaryWomen={estimateMonthlySalaryWomen}
                    occupationLabel={detail.detailPage.label}
                  />
                </div>
              </section>
            ) : null}

            {relatedRows.length > 0 ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
                id="relaterte-jobber"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Relaterte jobber for {occupationText.titleLabel}
                  </h2>
                  <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {relatedJobsSummary}
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
                              {formatKr(salaryRow.value)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {laborMarket ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
                id="arbeidsmarked"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Arbeidsmarkedet for {occupationText.titleLabel}
                  </h2>
                  <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {laborMarketSummary}
                  </p>
                </div>
                <div className="mt-8 space-y-5">
                  <OccupationWorkforceTimeSeriesChart
                    description="Se utviklingen i antall lønnstakere per kvartal, fordelt på kvinner og menn."
                    points={laborMarket.workforcePoints}
                  />
                  <OccupationAgeTimeSeriesChart
                    occupationLabel={occupationText.titleLabel}
                    points={laborMarket.ageSeries}
                  />
                  {detail.data.sectorSalarySeries ? (
                    <OccupationSectorSalaryTimeSeriesChart
                      occupationLabel={occupationText.titleLabel}
                      series={detail.data.sectorSalarySeries}
                    />
                  ) : null}
                </div>
              </section>
            ) : null}

          </div>

          <aside
            className="self-start rounded-[5px] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_44px_rgba(15,23,42,0.05)] lg:sticky lg:top-6"
          >
            <section className="pb-3">
              <p className="text-sm leading-6 text-slate-600">
                Data fra{" "}
                <a
                  className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-950"
                  href={EXTERNAL_SOURCE_LINKS[0].href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Statistisk sentralbyrå (SSB)
                </a>
                .
              </p>
            </section>

            {apprenticeshipPage ? (
              <Link
                className="flex items-center gap-2.5 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-950"
                href={apprenticeshipPage.href}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-slate-400"
                >
                  <ApprenticeshipIcon />
                </span>
                <span className="min-w-0">{buildApprenticeshipSidebarLabel(occupationText.titleLabel)}</span>
              </Link>
            ) : null}

            <section className="py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Spesial
              </p>
              <div className="mt-2.5 grid gap-2">
                {SPECIAL_LINKS.map((link) => (
                  <Link
                    className="text-sm font-medium leading-5 text-slate-700 transition hover:text-slate-950 hover:underline hover:decoration-slate-300 hover:underline-offset-4"
                    href={link.href}
                    key={link.href}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </section>

            <section className="py-3">
              <Link
                className="flex items-center gap-2.5 rounded-[5px] text-sm font-medium text-slate-700 transition hover:text-slate-950"
                href="/yrker"
              >
                <SidebarLinkIcon className="text-slate-500" icon="list" />
                <span>Alle yrker</span>
              </Link>
            </section>

            <section className="py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Populære yrker
              </p>
              <nav aria-label="Populære yrker" className="mt-2.5 grid gap-2">
                {POPULAR_OCCUPATION_LINKS.map((occupation) => (
                  <Link
                    className="flex items-center gap-2.5 rounded-[5px] text-sm font-medium text-slate-700 transition hover:text-slate-950"
                    href={occupation.href}
                    key={occupation.href}
                  >
                    <SidebarLinkIcon className="text-orange-600" icon="flame" />
                    <span>{occupation.title}</span>
                  </Link>
                ))}
              </nav>
            </section>

            <section className="py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Verktøy
              </p>
              <nav aria-label="Verktøy" className="mt-2.5 grid gap-2">
                {TOOL_LINKS.map((tool) => (
                  <Link
                    className="flex items-center gap-2.5 rounded-[5px] text-sm font-medium text-slate-700 transition hover:text-slate-950"
                    href={tool.href}
                    key={tool.href}
                  >
                    <SidebarLinkIcon className={tool.colorClassName} icon={tool.icon} />
                    <span>{tool.title}</span>
                  </Link>
                ))}
              </nav>
            </section>

            {SIDEBAR_BLOG_LINKS.length > 0 ? (
              <section className="pt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Fra bloggen
                </p>
                <div className="mt-2.5 grid gap-2">
                  {SIDEBAR_BLOG_LINKS.map((post) => (
                    <Link
                      className="text-sm font-medium leading-5 text-slate-700 transition hover:text-slate-950 hover:underline hover:decoration-slate-300 hover:underline-offset-4"
                      href={post.href}
                      key={post.href}
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl lg:pr-[364px]">
          <div
            className="rounded-[5px] border border-slate-200 bg-white px-5 py-5 text-sm leading-6 text-slate-600 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:px-6"
          >
            <p>
              Hensikten med Lønnsinnsikt er å gjøre lønnsstatistikk enklere å forstå og bruke for
              flere.
            </p>
            <p className="mt-2">
              Innholdet på denne siden er ment som veiledende informasjon og skal ikke forstås som et løfte om
              faktisk lønn, jobbmuligheter eller individuell lønnsutvikling. Lønn vil alltid kunne
              variere med erfaring, arbeidssted, ansiennitet, avtaleverk og ansvar.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

type SalaryCompositionCardData = {
  key: string;
  title: string;
  caption?: string;
  icon?: React.ReactNode;
  contractedMedian?: number;
  totalMedian?: number;
  extraMedian?: number;
  p25?: number;
  p75?: number;
  tone: "women" | "men" | "neutral";
};

type SalaryCompositionCardProps = {
  card: SalaryCompositionCardData;
};

function SalaryCompositionCard({ card }: SalaryCompositionCardProps) {
  const tone = getSalaryCompositionTone(card.tone);

  return (
    <article
      className="overflow-hidden rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:p-6"
    >
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
        <p className="text-sm font-medium text-slate-600">Månedslønn (median)</p>
        <MetricInfoButton
          description="Dette er samlet median månedslønn. Tallet inkluderer avtalt månedslønn, bonus og uregelmessige tillegg. Overtid er ikke med."
          label={`${card.title} månedslønn forklart`}
          variant="muted"
        />
      </div>
      <p className="mt-1 text-[2.5rem] font-bold leading-none text-slate-950 tabular-nums sm:text-[2.75rem]">
        {formatKr(card.totalMedian)}
      </p>

      <dl className={`mt-5 overflow-hidden rounded-[6px] ${tone.rows}`}>
        <SalaryCompositionRow
          info="Avtalt månedslønn er medianen for lønnen som er avtalt for jobben, uten bonus, uregelmessige tillegg og overtid."
          label="Avtalt månedslønn (median)"
          value={formatKr(card.contractedMedian)}
        />
        <SalaryCompositionRow
          info="Bonus og tillegg vises som forskjellen mellom samlet median månedslønn og avtalt median månedslønn når begge tall finnes. Det består av bonus og uregelmessige tillegg. Overtid er ikke med."
          label="Bonus og tillegg (median)"
          value={formatKr(card.extraMedian)}
        />
      </dl>

      <SalaryCompositionRangeLine
        max={card.p75}
        median={card.totalMedian}
        min={card.p25}
        tone={card.tone}
      />
    </article>
  );
}

function SalaryCompositionRow({
  label,
  value,
  info,
  strong = false,
}: {
  label: string;
  value: string;
  info?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/65 px-4 py-3 last:border-b-0">
      <dt className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-600">
        <span className="truncate">{label}</span>
        {info ? <MetricInfoButton description={info} label={`${label} forklart`} variant="muted" /> : null}
      </dt>
      <dd
        className={
          strong
            ? "text-2xl font-semibold tracking-[-0.03em] text-slate-950"
            : "text-base font-semibold text-slate-950"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function SalaryCompositionRangeLine({
  min,
  median,
  max,
  tone,
}: {
  min?: number;
  median?: number;
  max?: number;
  tone: SalaryCompositionCardData["tone"];
}) {
  if (min === undefined || median === undefined || max === undefined || min >= max) {
    return null;
  }

  const accent = getSalaryCompositionTone(tone).accent;
  const medianPosition = `${Math.min(100, Math.max(0, ((median - min) / (max - min)) * 100))}%`;

  return (
    <div className="mt-8">
      <div className={`relative h-0.5 rounded-full ${accent.line}`}>
        <span className={`absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${accent.dot}`} />
        <span
          className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${accent.dot}`}
          style={{ left: medianPosition }}
        />
        <span className={`absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${accent.dot}`} />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm text-slate-700">
        <p className="font-medium tabular-nums">{formatKrPlain(min)}</p>
        <p className="text-center font-medium text-slate-500">De fleste ligger mellom</p>
        <p className="text-right font-medium tabular-nums">{formatKrPlain(max)}</p>
      </div>
    </div>
  );
}

function buildSalaryCompositionCards({
  distribution,
  contractedDistribution,
  latestSalaryPeriodLabel,
}: {
  distribution: OccupationDetailViewModel["data"]["distribution"];
  contractedDistribution: OccupationDetailViewModel["data"]["contractedDistribution"];
  latestSalaryPeriodLabel?: string;
}) {
  const cards: SalaryCompositionCardData[] = [];
  const hasBothGenderMetrics =
    distribution?.women?.median !== undefined &&
    distribution?.men?.median !== undefined;

  if (distribution?.women?.median !== undefined || contractedDistribution?.women?.median !== undefined) {
    cards.push({
      key: "women",
      title: "Kvinner",
      caption: latestSalaryPeriodLabel,
      icon: <MetricAvatar tone="women" />,
      contractedMedian: contractedDistribution?.women?.median,
      totalMedian: distribution?.women?.median,
      p25: distribution?.women?.p25,
      p75: distribution?.women?.p75,
      extraMedian: calculatePositiveDifference(
        distribution?.women?.median,
        contractedDistribution?.women?.median,
      ),
      tone: "women",
    });
  }

  if (distribution?.men?.median !== undefined || contractedDistribution?.men?.median !== undefined) {
    cards.push({
      key: "men",
      title: "Menn",
      caption: latestSalaryPeriodLabel,
      icon: <MetricAvatar tone="men" />,
      contractedMedian: contractedDistribution?.men?.median,
      totalMedian: distribution?.men?.median,
      p25: distribution?.men?.p25,
      p75: distribution?.men?.p75,
      extraMedian: calculatePositiveDifference(
        distribution?.men?.median,
        contractedDistribution?.men?.median,
      ),
      tone: "men",
    });
  }

  if (!hasBothGenderMetrics && (distribution?.total?.median !== undefined || contractedDistribution?.total?.median !== undefined)) {
    cards.push({
      key: "all",
      title: "Alle",
      caption: latestSalaryPeriodLabel,
      contractedMedian: contractedDistribution?.total?.median,
      totalMedian: distribution?.total?.median,
      p25: distribution?.total?.p25,
      p75: distribution?.total?.p75,
      extraMedian: calculatePositiveDifference(
        distribution?.total?.median,
        contractedDistribution?.total?.median,
      ),
      tone: "neutral",
    });
  }

  return cards;
}

function buildTopSummaryStats({
  salaryGrowthPercent,
  employeeGrowthPercent,
  averageAge,
  womenMedian,
  menMedian,
}: {
  salaryGrowthPercent?: number;
  employeeGrowthPercent?: number;
  averageAge?: number;
  womenMedian?: number;
  menMedian?: number;
}) {
  return {
    salaryGrowthPercent,
    employeeGrowthPercent,
    averageAge,
    genderPayGapPercent: calculateGenderPayGapPercent(womenMedian, menMedian),
  };
}

function buildApprenticeshipSidebarLabel(occupationLabel: string) {
  return `Se lærlinglønn for ${occupationLabel.toLowerCase()}`;
}

function ApprenticeshipIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SidebarLinkIcon({
  className: colorClassName,
  icon,
}: {
  className: string;
  icon: string;
}) {
  const className = `h-4 w-4 shrink-0 ${colorClassName}`;
  const commonProps = {
    "aria-hidden": true,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: "1.8",
    viewBox: "0 0 24 24",
  };

  if (icon === "calculator") {
    return (
      <svg {...commonProps}>
        <rect height="18" rx="2.5" width="14" x="5" y="3" />
        <path d="M8 7h8" />
        <path d="M8 11h2" />
        <path d="M12 11h2" />
        <path d="M16 11h0" />
        <path d="M8 15h2" />
        <path d="M12 15h2" />
        <path d="M16 15h0" />
      </svg>
    );
  }

  if (icon === "check") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.5 12.2 2.2 2.2 4.8-5" />
      </svg>
    );
  }

  if (icon === "compare") {
    return (
      <svg {...commonProps}>
        <circle cx="6" cy="16" r="2" />
        <circle cx="12" cy="8" r="2" />
        <circle cx="18" cy="14" r="2" />
        <path d="m7.7 14.8 2.7-5" />
        <path d="m13.8 9.2 2.5 3.6" />
      </svg>
    );
  }

  if (icon === "list") {
    return (
      <svg {...commonProps}>
        <rect height="16" rx="2" width="16" x="4" y="4" />
        <path d="M8 9h8" />
        <path d="M8 12h8" />
        <path d="M8 15h5" />
      </svg>
    );
  }

  if (icon === "flame") {
    return (
      <svg {...commonProps}>
        <path d="M12.5 3.5c.7 3.1-1.8 4.4-1 6.7.4 1.1 1.4 1.7 2.4 1.2 1.3-.7 1.4-2.3 1.1-3.7 2.4 2 3.8 4.4 3.3 7.1-.6 3.4-3.3 5.7-6.6 5.7-3.7 0-6.5-2.6-6.5-6.2 0-3.9 2.6-7.2 7.3-10.8Z" />
        <path d="M12 13c1.5 1.3 2.1 2.4 1.8 3.6-.2 1.1-1 1.9-2.1 1.9-1.3 0-2.2-.9-2.2-2.2 0-1.2.8-2.4 2.5-3.3Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <rect height="13" rx="2" width="16" x="4" y="7" />
      <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
      <path d="M4 12h16" />
    </svg>
  );
}

function buildRelatedJobSalaryRows(
  row: OccupationDetailViewModel["data"]["relatedRows"][number],
) {
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

function MetricAvatar({ tone }: { tone: "women" | "men" }) {
  const className =
    tone === "women"
      ? "bg-pink-100 text-pink-600 shadow-[0_8px_18px_rgba(236,72,153,0.16)]"
      : "bg-sky-100 text-blue-600 shadow-[0_8px_18px_rgba(37,99,235,0.16)]";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-2xl font-semibold ${className}`}
    >
      {tone === "women" ? "♀" : "♂"}
    </span>
  );
}

function getSalaryCompositionTone(tone: SalaryCompositionCardData["tone"]) {
  if (tone === "women") {
    return {
      period: "bg-pink-50 text-pink-900",
      rows: "bg-gradient-to-r from-pink-50 to-white",
      accent: {
        dot: "bg-pink-500",
        line: "bg-pink-500",
      },
    };
  }

  if (tone === "men") {
    return {
      period: "bg-blue-50 text-blue-900",
      rows: "bg-gradient-to-r from-blue-50 to-white",
      accent: {
        dot: "bg-blue-600",
        line: "bg-blue-600",
      },
    };
  }

  return {
    period: "bg-slate-100 text-slate-700",
    rows: "bg-gradient-to-r from-slate-50 to-white",
    accent: {
      dot: "bg-slate-700",
      line: "bg-slate-700",
    },
  };
}

function formatKr(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

function formatPercent(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} %`;
}

function calculateGenderPayGapPercent(women?: number, men?: number) {
  if (women === undefined || men === undefined || men === 0) {
    return undefined;
  }

  return (Math.abs(men - women) / men) * 100;
}

function formatNumber(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 });
}

function buildMedianGrowthMetrics(series: {
  points: Array<{ periodCode: string; periodLabel: string; valueAll?: number }>;
}) {
  const pointsByPeriod = new Map(
    series.points
      .filter((point) => point.valueAll !== undefined)
      .map((point) => [normalizeQuarterPeriodCode(point.periodCode, point.periodLabel), point] as const)
      .filter(
        (entry): entry is [string, { periodCode: string; periodLabel: string; valueAll?: number }] =>
          Boolean(entry[0]),
      ),
  );

  const latestPeriodCode = Array.from(pointsByPeriod.keys()).sort((left, right) =>
    right.localeCompare(left, "nb-NO"),
  )[0];

  if (!latestPeriodCode) {
    return null;
  }

  const previousPeriodCode = getPreviousYearQuarterCode(latestPeriodCode);

  if (!previousPeriodCode) {
    return null;
  }

  const latestPoint = pointsByPeriod.get(latestPeriodCode);
  const previousPoint = pointsByPeriod.get(previousPeriodCode);

  if (
    latestPoint?.valueAll === undefined ||
    previousPoint?.valueAll === undefined ||
    previousPoint.valueAll === 0
  ) {
    return null;
  }

  return {
    latestPeriodLabel: formatQuarterCodeLabel(latestPeriodCode),
    previousPeriodLabel: formatQuarterCodeLabel(previousPeriodCode),
    salaryGrowth: ((latestPoint.valueAll - previousPoint.valueAll) / previousPoint.valueAll) * 100,
  };
}

function buildSalaryDevelopmentSummary(comparison: OccupationFiveYearGrowthComparison | null) {
  if (!comparison) {
    return "Her ser du hvordan lønnen i yrket har utviklet seg over tid.";
  }
  const growthAll = comparison.growthAll;
  const growthWomen = comparison.growthWomen;
  const growthMen = comparison.growthMen;

  const sentences = [
    growthAll !== undefined
      ? `Median månedslønn i yrket har økt med ${formatPercent(growthAll)} de siste 5 årene.`
      : null,
    growthAll !== undefined &&
    comparison.rankAll !== undefined &&
    comparison.comparableOccupationCount > 0
      ? `Det plasserer yrket som nummer ${comparison.rankAll} av ${comparison.comparableOccupationCount} yrker når vi ser på 5-års vekst i median månedslønn.`
      : null,
    growthWomen !== undefined
      ? `For kvinner har den økt med ${formatPercent(growthWomen)}.`
      : null,
    growthMen !== undefined
      ? `For menn har den økt med ${formatPercent(growthMen)}.`
      : null,
  ].filter((sentence): sentence is string => Boolean(sentence));

  return sentences.join(" ");
}

function buildPurchasingPowerSummary(
  series: OccupationDetailViewModel["data"]["trendData"]["purchasingPowerSeries"],
) {
  const fiveYearPoints = series.points.slice(-20).filter((point) => point.realGrowthAll !== undefined);

  if (fiveYearPoints.length === 0) {
    return "Her ser du reallønnsveksten i yrket de siste 5 årene, justert for prisvekst.";
  }

  const positiveCount = fiveYearPoints.filter((point) => (point.realGrowthAll ?? 0) > 0).length;
  const averageRealGrowth =
    fiveYearPoints.reduce((sum, point) => sum + (point.realGrowthAll ?? 0), 0) / fiveYearPoints.length;
  const latestPoint = fiveYearPoints[fiveYearPoints.length - 1];
  const genderInsight = buildPurchasingPowerGenderInsight(series);

  return `De siste 5 årene har reallønnsveksten i yrket vært positiv i ${positiveCount} av ${fiveYearPoints.length} kvartaler. I snitt har reallønnsveksten vært ${formatPercent(averageRealGrowth)} per kvartal, og i ${formatQuarterCodeLabel(latestPoint.periodLabel).toLowerCase()} var den ${formatPercent(latestPoint.realGrowthAll)}.${genderInsight ? ` ${genderInsight}` : ""}`;
}

function buildLaborMarketSummary(laborMarket: OccupationDetailViewModel["data"]["laborMarketStats"]) {
  if (!laborMarket) {
    return "Her ser du hvordan arbeidsmarkedet i yrket utvikler seg over tid, med lønnstakere og alder fordelt på kvinner og menn.";
  }

  const latestEmployees = laborMarket.latest?.employees;
  const latestPeriodLabel = laborMarket.latest?.periodLabel
    ? formatQuarterCodeLabel(laborMarket.latest.periodLabel)
    : null;
  const womenShare = laborMarket.genderBreakdown?.womenShare;
  const averageAge = laborMarket.age?.averageAll;

  const sentences = [
    latestEmployees !== undefined && latestPeriodLabel
      ? `I ${latestPeriodLabel.toLowerCase()} var det ${formatNumber(latestEmployees)} lønnstakere i yrket.`
      : null,
    womenShare !== undefined
      ? `Kvinner utgjorde ${formatPercent(womenShare)} av yrket i samme periode.`
      : null,
    averageAge !== undefined
      ? `Gjennomsnittsalderen var ${averageAge.toLocaleString("nb-NO", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })} år.`
      : null,
  ].filter((sentence): sentence is string => Boolean(sentence));

  if (sentences.length === 0) {
    return "Her ser du hvordan arbeidsmarkedet i yrket utvikler seg over tid, med lønnstakere og alder fordelt på kvinner og menn.";
  }

  return sentences.join(" ");
}

function buildPurchasingPowerGenderInsight(
  series: OccupationDetailViewModel["data"]["trendData"]["purchasingPowerSeries"],
) {
  const womenPoints = series.points.slice(-20).filter((point) => point.realGrowthWomen !== undefined);
  const menPoints = series.points.slice(-20).filter((point) => point.realGrowthMen !== undefined);

  if (womenPoints.length === 0 || menPoints.length === 0) {
    return null;
  }

  const womenAverage =
    womenPoints.reduce((sum, point) => sum + (point.realGrowthWomen ?? 0), 0) / womenPoints.length;
  const menAverage =
    menPoints.reduce((sum, point) => sum + (point.realGrowthMen ?? 0), 0) / menPoints.length;

  if (Math.abs(womenAverage - menAverage) < 0.05) {
    return "I samme periode har kvinner og menn hatt om lag samme reallønnsvekst.";
  }

  return womenAverage > menAverage
    ? `I samme periode har kvinner hatt høyest reallønnsvekst med ${formatPercent(womenAverage)} i snitt per kvartal, mot ${formatPercent(menAverage)} for menn.`
    : `I samme periode har menn hatt høyest reallønnsvekst med ${formatPercent(menAverage)} i snitt per kvartal, mot ${formatPercent(womenAverage)} for kvinner.`;
}

function buildRelatedJobsSummary({
  currentMedian,
  rows,
}: {
  currentMedian?: number;
  rows: OccupationDetailViewModel["data"]["relatedRows"];
}) {
  if (rows.length === 0) {
    return "Her ser du relaterte jobber basert på yrkeskoden.";
  }

  const placement = describeSalaryPlacement(
    currentMedian,
    rows.map((row) => row.medianAll),
  );
  const comparableRows = rows.filter((row): row is typeof row & { medianAll: number } => row.medianAll !== undefined);

  if (placement && comparableRows.length > 0) {
    const relatedAverage =
      comparableRows.reduce((sum, row) => sum + row.medianAll, 0) / comparableRows.length;

    return `Sammenlignet med relaterte jobber, ligger månedslønnen i yrket ${placement}. Median månedslønn i yrket er ${formatKr(currentMedian)}, mens den er ${formatKr(relatedAverage)} i gjennomsnitt for relaterte jobber.`;
  }

  return "Her ser du relaterte jobber basert på yrkeskoden.";
}

function describeSalaryPlacement(currentValue: number | undefined, comparisonValues: Array<number | undefined>) {
  if (currentValue === undefined) {
    return null;
  }

  const comparableValues = comparisonValues.filter((value): value is number => value !== undefined);

  if (comparableValues.length === 0) {
    return null;
  }

  const sortedValues = [...comparableValues, currentValue].sort((left, right) => left - right);
  const firstIndex = sortedValues.indexOf(currentValue);
  const lastIndex = sortedValues.lastIndexOf(currentValue);
  const rank = Math.round((firstIndex + lastIndex) / 2) + 1;
  const total = sortedValues.length;

  if (rank === 1) {
    return "lavest";
  }

  if (rank === total) {
    return "høyest";
  }

  const percentile = rank / total;

  if (percentile <= 0.34) {
    return "i det nedre sjiktet";
  }

  if (percentile >= 0.67) {
    return "i det øvre sjiktet";
  }

  return "omtrent midt i feltet";
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
    case "3":
      return (
        <svg {...commonProps}>
          <path d="M7 6h10v12H7z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M10 9h4M10 12h4M10 15h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "4":
      return (
        <svg {...commonProps}>
          <path d="M12 4v16M4 12h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "5":
      return (
        <svg {...commonProps}>
          <path d="M6 18 12 6l6 12" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M9.5 13h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "6":
      return (
        <svg {...commonProps}>
          <path d="M6 8h12v8H6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M9 8V6h6v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "7":
      return (
        <svg {...commonProps}>
          <path d="M5 16h14M7 16V8l5-3 5 3v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "8":
      return (
        <svg {...commonProps}>
          <path d="M8 7h8M8 12h8M8 17h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <circle cx="6" cy="7" r="1" fill="currentColor" />
          <circle cx="6" cy="12" r="1" fill="currentColor" />
          <circle cx="6" cy="17" r="1" fill="currentColor" />
        </svg>
      );
    case "9":
      return (
        <svg {...commonProps}>
          <path d="M7 17c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.5 12h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
  }
}

function normalizeQuarterPeriodCode(periodCode: string, periodLabel: string) {
  const yearMatch = periodCode.match(/^(\d{4})$/) ?? periodLabel.match(/^(\d{4})$/);

  if (yearMatch) {
    return yearMatch[1];
  }

  const match = periodCode.match(/^(\d{4})K([1-4])$/i) ?? periodLabel.match(/(\d{4})\s*K([1-4])/i);

  if (!match) {
    return null;
  }

  return `${match[1]}K${match[2]}`;
}

function getPreviousYearQuarterCode(periodCode: string) {
  const yearMatch = periodCode.match(/^(\d{4})$/);

  if (yearMatch) {
    return `${Number(yearMatch[1]) - 1}`;
  }

  const match = periodCode.match(/^(\d{4})K([1-4])$/i);

  if (!match) {
    return null;
  }

  const year = Number(match[1]) - 1;
  const quarter = match[2];
  return `${year}K${quarter}`;
}

function formatQuarterCodeLabel(value: string) {
  if (/^\d{4}$/.test(value)) {
    return value;
  }

  const match = value.match(/(\d{4})\s*K([1-4])/i) ?? value.match(/(\d{4})K([1-4])/i);

  if (!match) {
    return value;
  }

  return `${match[2]}. kvartal ${match[1]}`;
}

function buildHeroIntro(occupationLabel: string, intro: string) {
  const trimmedIntro = intro.trim();
  const normalizedLabel = occupationLabel.trim();

  if (!trimmedIntro) {
    return `${normalizedLabel} er en yrkesgruppe i SSBs yrkesstatistikk.`;
  }

  if (trimmedIntro.startsWith(normalizedLabel)) {
    return trimmedIntro;
  }

  const lowerCasedIntro = trimmedIntro.charAt(0).toLowerCase() + trimmedIntro.slice(1);
  return `${normalizedLabel} ${lowerCasedIntro}`;
}

function buildTopSummary({
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
  womenEmployees,
  menEmployees,
  employmentPeriodLabel,
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
  womenEmployees?: number;
  menEmployees?: number;
  employmentPeriodLabel?: string;
}) {
  if (totalMedian === undefined && womenMedian === undefined && menMedian === undefined) {
    return null;
  }

  const totalRange = formatSalaryRangeText(totalP25, totalP75);
  const womenRange = formatSalaryRangeText(womenP25, womenP75);
  const menRange = formatSalaryRangeText(menP25, menP75);
  const medianSentence =
    womenMedian !== undefined && menMedian !== undefined
      ? `Median lønn i yrket i Norge er ${formatKr(womenMedian)} for kvinner og ${formatKr(menMedian)} for menn.`
      : totalMedian !== undefined && womenMedian === undefined && menMedian === undefined
        ? `Median lønn i yrket i Norge er ${formatKr(totalMedian)}.`
      : womenMedian !== undefined
        ? `Median lønn for kvinner i yrket i Norge er ${formatKr(womenMedian)}.`
        : `Median lønn for menn i yrket i Norge er ${formatKr(menMedian)}.`;

  let rangeSentence: string | null = null;

  if (womenRange && menRange) {
    rangeSentence = `De fleste kvinner ligger mellom ${womenRange}, og de fleste menn ligger mellom ${menRange}`;
  } else if (totalRange && womenRange === null && menRange === null) {
    rangeSentence = `De fleste i yrket ligger mellom ${totalRange}`;
  } else if (womenRange) {
    rangeSentence = `De fleste kvinner ligger mellom ${womenRange}`;
  } else if (menRange) {
    rangeSentence = `De fleste menn ligger mellom ${menRange}`;
  }

  const sourceSentence = rangeSentence
    ? `${rangeSentence}, ${periodLabel ? `basert på SSB-data for ${periodLabel.toLowerCase()}` : "basert på siste tilgjengelige SSB-data"}.`
    : `${periodLabel ? `Basert på SSB-data for ${periodLabel.toLowerCase()}` : "Basert på siste tilgjengelige SSB-data"}.`;
  const employeeSentence =
    womenEmployees !== undefined && menEmployees !== undefined
      ? `SSB registrerer ${formatNumber(womenEmployees)} kvinner og ${formatNumber(menEmployees)} menn som arbeidstakere i yrket${employmentPeriodLabel ? ` i ${formatQuarterCodeLabel(employmentPeriodLabel).toLowerCase()}` : ""}.`
      : null;

  return [medianSentence, sourceSentence, employeeSentence]
    .filter((part): part is string => Boolean(part))
    .join(" ");
}

function buildDistributionSummary({
  totalP25,
  totalP75,
  womenP25,
  womenP75,
  menP25,
  menP75,
}: {
  totalP25?: number;
  totalP75?: number;
  womenP25?: number;
  womenP75?: number;
  menP25?: number;
  menP75?: number;
}) {
  const introSentence = "Her ser du hvordan lønnen typisk fordeler seg i yrket.";
  const totalSpread = calculateSpread(totalP25, totalP75);
  const womenSpread = calculateSpread(womenP25, womenP75);
  const menSpread = calculateSpread(menP25, menP75);

  if (womenSpread === undefined && menSpread === undefined) {
    if (totalSpread !== undefined) {
      return `${introSentence} Blant alle i yrket skiller det ${formatKrPlain(totalSpread)} mellom de som tjener mindre og de som tjener mer.`;
    }

    return introSentence;
  }

  if (womenSpread !== undefined && menSpread !== undefined) {
    const comparisonSentence =
      womenSpread === menSpread
        ? `Forskjellen mellom de lavere og høyere lønningene er like stor for kvinner og menn, på ${formatKrPlain(womenSpread)}.`
        : womenSpread > menSpread
          ? `Blant kvinner skiller det ${formatKrPlain(womenSpread)} mellom de som tjener mindre og de som tjener mer. For menn er forskjellen ${formatKrPlain(menSpread)}. Det betyr at lønnsforskjellen er størst blant kvinner, med ${formatKrPlain(womenSpread - menSpread)} mer mellom lav og høy enn blant menn.`
          : `Blant kvinner skiller det ${formatKrPlain(womenSpread)} mellom de som tjener mindre og de som tjener mer. For menn er forskjellen ${formatKrPlain(menSpread)}. Det betyr at lønnsforskjellen er størst blant menn, med ${formatKrPlain(menSpread - womenSpread)} mer mellom lav og høy enn blant kvinner.`;

    return `${introSentence} ${comparisonSentence}`;
  }

  if (womenSpread !== undefined) {
    return `${introSentence} Blant kvinner skiller det ${formatKrPlain(womenSpread)} mellom de som tjener mindre og de som tjener mer.`;
  }

  return `${introSentence} Blant menn skiller det ${formatKrPlain(menSpread)} mellom de som tjener mindre og de som tjener mer.`;
}

function formatSalaryRangeText(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return null;
  }

  return `${formatKr(min)} og ${formatKr(max)}`;
}

function calculateSpread(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return undefined;
  }

  return Math.max(0, max - min);
}

function calculatePositiveDifference(total?: number, base?: number) {
  if (total === undefined || base === undefined) {
    return undefined;
  }

  return Math.max(0, total - base);
}

function formatKrPlain(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

