import Link from "next/link";
import { OccupationAgeTimeSeriesChart } from "@/components/occupation-age-time-series";
import { OccupationPurchasingPowerLineChart } from "@/components/occupation-purchasing-power-line-chart";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { OccupationSalaryEstimate } from "@/components/occupation-salary-estimate";
import {
  SalarySupplementOverview,
  type SalarySupplementCardData,
} from "@/components/salary-supplement-overview";
import {
  MonthlySalaryOverview,
  type MonthlySalaryOverviewCardData,
} from "@/components/monthly-salary-overview";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import {
  buildOccupationSectorSalarySummary,
  OccupationSectorSalaryLatest,
} from "@/components/occupation-sector-salary-latest";
import { OccupationWorkforceTimeSeriesChart } from "@/components/occupation-workforce-time-series";
import { OccupationSectionLinkNav } from "@/components/occupation-section-link-nav";
import { OccupationHero } from "@/components/occupation-hero";
import { OccupationFaq, type OccupationFaqItem } from "@/components/occupation-faq";
import { getApprenticeshipDetailPageByOccupationCode } from "@/lib/apprenticeship-detail-view-models";
import {
  getOccupationFiveYearGrowthComparison,
  type OccupationFiveYearGrowthComparison,
} from "@/lib/occupation-five-year-growth";
import type { OccupationDetailViewModel } from "@/lib/occupation-detail-view-models";
import type { OccupationSupplementMetrics } from "@/lib/occupation-detail-view-model-types";
import { getOccupationHeroImages } from "@/lib/occupation-hero-images";
import { getOccupationHeroRankings } from "@/lib/occupation-hero-rankings";
import { formatOccupationDisplayLabel, getOccupationTextContext } from "@/lib/occupation-detail-pages";
import type { OccupationSalaryDistributionMetrics } from "@/lib/ssb";

type OccupationDetailPageProps = {
  detail: OccupationDetailViewModel;
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
  const heroRankings = await getOccupationHeroRankings(detail.detailPage.occupationCode);
  const heroImages = getOccupationHeroImages(detail.detailPage.occupationCode);
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
  const monthlySalaryOverviewCards = buildMonthlySalaryOverviewCards({
    distribution,
    contractedDistribution,
    latestSalaryPeriodLabel,
  });
  const sectorSalarySummary = detail.data.sectorSalarySeries
    ? buildOccupationSectorSalarySummary({
        occupationLabel: occupationText.seoLabel,
        series: detail.data.sectorSalarySeries,
      })
    : null;
  const salarySupplementCards = buildSalarySupplementCards({
    median: detail.data.supplementMedian,
    average: detail.data.supplementAverage,
  });
  const hasEstimate =
    estimateMonthlySalary !== undefined ||
    estimateMonthlySalaryWomen !== undefined ||
    estimateMonthlySalaryMen !== undefined;
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
  const faqItems = buildOccupationFaqItems({
    distribution,
    laborMarket,
    occupationLabel: occupationText.sentenceLabel,
    purchasingPowerSeries: detail.data.trendData.purchasingPowerSeries,
  });
  const apprenticeshipPage = await getApprenticeshipDetailPageByOccupationCode(
    detail.detailPage.occupationCode,
  );
  const sectionNavItems = [
    monthlySalaryOverviewCards.length > 0 || distribution || detail.data.sectorSalarySeries
      ? { href: "#lonn", label: "Lønn" }
      : null,
    salarySupplementCards.length > 0 ? { href: "#tillegg", label: "Overtid" } : null,
    { href: "#lonnsutvikling", label: "Lønnsutvikling" },
    { href: "#reallonn", label: "Reallønn" },
    hasEstimate ? { href: "#lonnsestimat", label: "Lønnsestimat" } : null,
    laborMarket ? { href: "#arbeidsmarked", label: "Arbeidsmarked" } : null,
    relatedRows.length > 0 ? { href: "#relaterte-jobber", label: "Relaterte jobber" } : null,
    { href: "#vanlige-sporsmal", label: "Vanlige spørsmål" },
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <OccupationHero
        averageBonusRank={heroRankings.averageBonusRank}
        averageAge={laborMarket?.age?.averageAll}
        backgroundImage={heroImages.desktop}
        contentDescription={`Her finner du lønn, lønnsutvikling og arbeidsmarkedsdata for ${occupationText.seoLabel}, basert på tall fra Statistisk sentralbyrå.`}
        description={buildHeroIntro(occupationText.seoLabel, intro)}
        employeeCount={laborMarket?.latest?.employees}
        employeeGrowthPercent={laborMarket?.growth?.yearOverYearChange}
        employeeCountRank={heroRankings.employeeCountRank}
        occupationName={occupationText.titleLabel}
        medianMonthlySalary={estimateMonthlySalary}
        mobileBackgroundImage={heroImages.mobile}
        oldestAverageAgeRank={heroRankings.oldestAverageAgeRank}
        realSalaryGrowthRank={heroRankings.realSalaryGrowthRank}
        salaryGrowthRank={heroRankings.salaryGrowthRank}
        salaryGrowthPercent={medianGrowthMetrics?.salaryGrowth}
        salaryRank={heroRankings.salaryRank}
        youngestAverageAgeRank={heroRankings.youngestAverageAgeRank}
      />

      <OccupationSectionLinkNav
        analytics={{
          occupationCode: detail.detailPage.occupationCode,
          occupationLabel: occupationText.titleLabel,
          occupationSlug: detail.detailPage.slug,
        }}
        items={sectionNavItems}
      />

      <section className="px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            {monthlySalaryOverviewCards.length > 0 ||
            distribution ||
            detail.data.sectorSalarySeries ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
                id="lonn"
              >
                <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Lønn for {occupationText.titleLabel}
                </h2>

                {monthlySalaryOverviewCards.length > 0 ? (
                  <div className="mt-8">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">
                        Median og gjennomsnittlig lønn
                      </h3>
                      <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                        {buildMonthlySalaryOverviewSummary({
                          cards: monthlySalaryOverviewCards,
                          occupationLabel: occupationText.seoLabel,
                        })}
                      </p>
                    </div>
                    <MonthlySalaryOverview cards={monthlySalaryOverviewCards} />
                    <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                      Når gjennomsnittet er høyere enn medianen, tyder det ofte på at noen høye
                      lønninger trekker gjennomsnittet opp. Når gjennomsnittet er lavere, kan noen
                      lave lønninger trekke det ned.
                    </p>
                  </div>
                ) : null}

                {distribution ? (
                  <div className="mt-10">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">
                        Lønnsfordeling
                      </h3>
                      <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                        {distributionSummary}
                      </p>
                    </div>
                    <div className="mt-8">
                      <OccupationSalaryDistributionSection distribution={distribution} />
                    </div>
                  </div>
                ) : null}

                {detail.data.sectorSalarySeries ? (
                  <div className="mt-10">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">
                        Lønn etter sektor
                      </h3>
                      {sectorSalarySummary ? (
                        <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                          {sectorSalarySummary}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-6">
                      <OccupationSectorSalaryLatest series={detail.data.sectorSalarySeries} />
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {salarySupplementCards.length > 0 ? (
              <section
                className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
                id="tillegg"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Overtid, bonus og uregelmessige tillegg for {occupationText.titleLabel}
                  </h2>
                  <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {buildSalarySupplementSummary({
                      cards: salarySupplementCards,
                      occupationLabel: occupationText.seoLabel,
                    })}
                  </p>
                </div>
                <SalarySupplementOverview cards={salarySupplementCards} />
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
                  {salaryDevelopmentSummary}
                </p>
              </div>
              <div className="mt-8">
                <OccupationSalaryTimeSeriesChart
                  controlsVariant="reference"
                  mobileOptimized
                  series={detail.data.medianBasicSalarySeries}
                  showIntro={false}
                  variant="classic-emphasis"
                />
              </div>

              <section className="mt-10" id="reallonn">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">
                    Reallønnsvekst og kjøpekraft for {occupationText.titleLabel}
                  </h3>
                  <p className="max-w-4xl text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {purchasingPowerSummary}
                  </p>
                </div>
                <div className="mt-8">
                  <OccupationPurchasingPowerLineChart
                    controlsVariant="reference"
                    mobileOptimized
                    series={detail.data.trendData.purchasingPowerSeries}
                    showTitle={false}
                  />
                </div>
              </section>
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

            <OccupationFaq items={faqItems} occupationLabel={occupationText.titleLabel} />

          </div>

          <aside
            className="self-start rounded-[5px] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_44px_rgba(15,23,42,0.05)] lg:sticky lg:top-16"
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
              <Link
                className="flex w-full items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(20,83,45,0.18)] transition hover:bg-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                href="/yrker"
              >
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

function buildMonthlySalaryOverviewCards({
  distribution,
  contractedDistribution,
  latestSalaryPeriodLabel,
}: {
  distribution: OccupationDetailViewModel["data"]["distribution"];
  contractedDistribution: OccupationDetailViewModel["data"]["contractedDistribution"];
  latestSalaryPeriodLabel?: string;
}) {
  const cards: MonthlySalaryOverviewCardData[] = [];
  const hasWomen =
    hasSalaryDistributionMetrics(distribution?.women) ||
    hasSalaryDistributionMetrics(contractedDistribution?.women);
  const hasMen =
    hasSalaryDistributionMetrics(distribution?.men) ||
    hasSalaryDistributionMetrics(contractedDistribution?.men);

  if (hasWomen) {
    cards.push({
      key: "women",
      title: "Kvinner",
      caption: latestSalaryPeriodLabel,
      tone: "women",
      totalMedian: distribution?.women?.median,
      totalAverage: distribution?.women?.average,
      contractedMedian: contractedDistribution?.women?.median,
      contractedAverage: contractedDistribution?.women?.average,
    });
  }

  if (hasMen) {
    cards.push({
      key: "men",
      title: "Menn",
      caption: latestSalaryPeriodLabel,
      tone: "men",
      totalMedian: distribution?.men?.median,
      totalAverage: distribution?.men?.average,
      contractedMedian: contractedDistribution?.men?.median,
      contractedAverage: contractedDistribution?.men?.average,
    });
  }

  if (
    (!hasWomen || !hasMen) &&
    (hasSalaryDistributionMetrics(distribution?.total) ||
      hasSalaryDistributionMetrics(contractedDistribution?.total))
  ) {
    cards.push({
      key: "all",
      title: "Alle",
      caption: latestSalaryPeriodLabel,
      tone: "neutral",
      totalMedian: distribution?.total?.median,
      totalAverage: distribution?.total?.average,
      contractedMedian: contractedDistribution?.total?.median,
      contractedAverage: contractedDistribution?.total?.average,
    });
  }

  return cards;
}

function buildMonthlySalaryOverviewSummary({
  cards,
  occupationLabel,
}: {
  cards: MonthlySalaryOverviewCardData[];
  occupationLabel: string;
}) {
  const womenSalary = cards.find((card) => card.key === "women")?.totalMedian;
  const menSalary = cards.find((card) => card.key === "men")?.totalMedian;
  const womenContractedSalary = cards.find((card) => card.key === "women")?.contractedMedian;
  const menContractedSalary = cards.find((card) => card.key === "men")?.contractedMedian;
  const salaryDescriptions: string[] = [];

  if (womenSalary !== undefined && menSalary !== undefined) {
    const comparison =
      womenSalary === menSalary
        ? `Blant ${occupationLabel} har kvinner og menn lik månedslønn.`
        : `Blant ${occupationLabel} tjener ${womenSalary > menSalary ? "kvinner" : "menn"} mest.`;
    salaryDescriptions.push(
      comparison,
      `Månedslønnen er ${formatKr(womenSalary)} for kvinner og ${formatKr(menSalary)} for menn.`,
    );
  } else if (womenSalary !== undefined) {
    salaryDescriptions.push(
      `SSB har ikke publisert månedslønn for menn blant ${occupationLabel}.`,
      `Månedslønnen er ${formatKr(womenSalary)} for kvinner.`,
    );
  } else if (menSalary !== undefined) {
    salaryDescriptions.push(
      `SSB har ikke publisert månedslønn for kvinner blant ${occupationLabel}.`,
      `Månedslønnen er ${formatKr(menSalary)} for menn.`,
    );
  } else {
    salaryDescriptions.push(
      `SSB har ikke publisert månedslønn for kvinner eller menn blant ${occupationLabel}.`,
    );
  }

  salaryDescriptions.push(
    "Avtalt månedslønn er den faste lønnen uten bonus, uregelmessige tillegg og overtid.",
  );

  if (womenContractedSalary !== undefined && menContractedSalary !== undefined) {
    salaryDescriptions.push(
      `Den er ${formatKr(womenContractedSalary)} for kvinner og ${formatKr(menContractedSalary)} for menn.`,
    );
  } else if (womenContractedSalary !== undefined) {
    salaryDescriptions.push(
      `Den er ${formatKr(womenContractedSalary)} for kvinner. SSB har ikke publisert avtalt månedslønn for menn.`,
    );
  } else if (menContractedSalary !== undefined) {
    salaryDescriptions.push(
      `Den er ${formatKr(menContractedSalary)} for menn. SSB har ikke publisert avtalt månedslønn for kvinner.`,
    );
  } else {
    salaryDescriptions.push(
      "SSB har ikke publisert avtalt månedslønn for kvinner eller menn.",
    );
  }

  return salaryDescriptions.join(" ");
}

function hasSalaryDistributionMetrics(metrics?: OccupationSalaryDistributionMetrics) {
  return Boolean(
    metrics &&
      (metrics.median !== undefined ||
        metrics.average !== undefined),
  );
}

function buildSalarySupplementCards({
  median,
  average,
}: {
  median: OccupationDetailViewModel["data"]["supplementMedian"];
  average: OccupationDetailViewModel["data"]["supplementAverage"];
}) {
  const cards: SalarySupplementCardData[] = [];
  const hasWomen = hasSupplementMetrics(median?.women) || hasSupplementMetrics(average?.women);
  const hasMen = hasSupplementMetrics(median?.men) || hasSupplementMetrics(average?.men);
  const caption =
    median?.periodLabel === average?.periodLabel
      ? median?.periodLabel
      : median?.periodLabel ?? average?.periodLabel;

  if (hasWomen) {
    cards.push(buildSalarySupplementCard({
      key: "women",
      title: "Kvinner",
      caption,
      tone: "women",
      median: median?.women,
      average: average?.women,
    }));
  }

  if (hasMen) {
    cards.push(buildSalarySupplementCard({
      key: "men",
      title: "Menn",
      caption,
      tone: "men",
      median: median?.men,
      average: average?.men,
    }));
  }

  if (
    (!hasWomen || !hasMen) &&
    (hasSupplementMetrics(median?.total) || hasSupplementMetrics(average?.total))
  ) {
    cards.push(buildSalarySupplementCard({
      key: "all",
      title: "Alle",
      caption,
      tone: "neutral",
      median: median?.total,
      average: average?.total,
    }));
  }

  return cards;
}

function buildSalarySupplementCard({
  key,
  title,
  caption,
  tone,
  median,
  average,
}: Pick<SalarySupplementCardData, "key" | "title" | "caption" | "tone"> & {
  median?: OccupationSupplementMetrics;
  average?: OccupationSupplementMetrics;
}): SalarySupplementCardData {
  return {
    key,
    title,
    caption,
    tone,
    bonusMedian: median?.bonus,
    bonusAverage: average?.bonus,
    overtimeMedian: median?.overtime,
    overtimeAverage: average?.overtime,
    irregularAdditionsMedian: median?.irregularAdditions,
    irregularAdditionsAverage: average?.irregularAdditions,
  };
}

function hasSupplementMetrics(metrics?: OccupationSupplementMetrics) {
  return Boolean(
    metrics &&
      (metrics.bonus !== undefined ||
        metrics.overtime !== undefined ||
        metrics.irregularAdditions !== undefined),
  );
}

function buildSalarySupplementSummary({
  cards,
  occupationLabel,
}: {
  cards: SalarySupplementCardData[];
  occupationLabel: string;
}) {
  const womenCard = cards.find((card) => card.key === "women");
  const menCard = cards.find((card) => card.key === "men");

  if (hasOnlyZeroAverageSupplements(cards)) {
    return `For ${occupationLabel} er det ingen registrerte gjennomsnittsbeløp for overtid, bonus eller uregelmessige tillegg.`;
  }

  const metrics = [
    { key: "bonusAverage", label: "bonus" },
    { key: "irregularAdditionsAverage", label: "uregelmessige tillegg" },
    { key: "overtimeAverage", label: "overtidsbetaling" },
  ] as const;
  const womenHighest: string[] = [];
  const menHighest: string[] = [];
  const equal: string[] = [];

  metrics.forEach((metric) => {
    const womenValue = womenCard?.[metric.key];
    const menValue = menCard?.[metric.key];

    if (womenValue === undefined || menValue === undefined) {
      return;
    }

    if (womenValue === menValue) {
      equal.push(metric.label);
    } else if (womenValue > menValue) {
      womenHighest.push(metric.label);
    } else {
      menHighest.push(metric.label);
    }
  });

  const descriptions: string[] = [];

  if (womenHighest.length > 0) {
    descriptions.push(
      `Blant ${occupationLabel} har kvinner høyest ${formatNorwegianList(womenHighest)}.`,
    );
  }

  if (menHighest.length > 0) {
    descriptions.push(
      `${womenHighest.length > 0 ? "Menn har" : `Blant ${occupationLabel} har menn`} høyest ${formatNorwegianList(menHighest)}.`,
    );
  }

  if (equal.length > 0) {
    descriptions.push(`Kvinner og menn har like mye i ${formatNorwegianList(equal)}.`);
  }

  if (womenHighest.length === 0 && menHighest.length === 0 && equal.length === 0) {
    descriptions.push(
      `SSB har ikke publisert nok kjønnstall til å sammenligne tilleggene blant ${occupationLabel}.`,
    );
  }

  descriptions.push(...buildSupplementGenderDescriptions("kvinner", womenCard, metrics));
  descriptions.push(...buildSupplementGenderDescriptions("menn", menCard, metrics));

  return descriptions.join(" ");
}

function hasOnlyZeroAverageSupplements(cards: SalarySupplementCardData[]) {
  const averageKeys = [
    "bonusAverage",
    "irregularAdditionsAverage",
    "overtimeAverage",
  ] as const;
  const genderCards = cards.filter((card) => card.key === "women" || card.key === "men");
  const relevantCards = genderCards.length > 0 ? genderCards : cards.filter((card) => card.key === "all");

  if (genderCards.length === 1 || relevantCards.length === 0) {
    return false;
  }

  return relevantCards.every((card) => averageKeys.every((key) => card[key] === 0));
}

function buildSupplementGenderDescriptions(
  genderLabel: "kvinner" | "menn",
  card: SalarySupplementCardData | undefined,
  metrics: ReadonlyArray<{
    key: "bonusAverage" | "irregularAdditionsAverage" | "overtimeAverage";
    label: string;
  }>,
) {
  const publishedValues = metrics.flatMap((metric) => {
    const value = card?.[metric.key];
    return value === undefined ? [] : [`${formatKr(value)} i ${metric.label}`];
  });
  const missingLabels = metrics
    .filter((metric) => card?.[metric.key] === undefined)
    .map((metric) => metric.label);
  const descriptions: string[] = [];

  if (publishedValues.length > 0) {
    descriptions.push(
      `Gjennomsnittsbeløpene per måned for ${genderLabel} er ${formatNorwegianList(publishedValues)}.`,
    );
  }

  if (missingLabels.length > 0) {
    descriptions.push(
      `SSB har ikke publisert gjennomsnittsbeløp for ${formatNorwegianList(missingLabels)} for ${genderLabel}.`,
    );
  }

  return descriptions;
}

function formatNorwegianList(values: string[]) {
  if (values.length < 2) {
    return values[0] ?? "";
  }

  return `${values.slice(0, -1).join(", ")} og ${values.at(-1)}`;
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

function buildOccupationFaqItems({
  distribution,
  laborMarket,
  occupationLabel,
  purchasingPowerSeries,
}: {
  distribution: OccupationDetailViewModel["data"]["distribution"];
  laborMarket: OccupationDetailViewModel["data"]["laborMarketStats"];
  occupationLabel: string;
  purchasingPowerSeries: OccupationDetailViewModel["data"]["trendData"]["purchasingPowerSeries"];
}): OccupationFaqItem[] {
  const label = occupationLabel.toLowerCase();
  const employeeCount = laborMarket?.latest?.employees;
  const employeePeriod = laborMarket?.latest?.periodLabel
    ? formatQuarterCodeLabel(laborMarket.latest.periodLabel).toLowerCase()
    : null;
  const womenMedian = distribution?.women?.median;
  const menMedian = distribution?.men?.median;
  const salaryPeriod = distribution?.periodLabel
    ? formatQuarterCodeLabel(distribution.periodLabel).toLowerCase()
    : null;
  const latestRealGrowthPoint = [...purchasingPowerSeries.points]
    .reverse()
    .find((point) => point.realGrowthAll !== undefined);
  const averageAge = laborMarket?.age?.averageAll;
  const agePeriod = laborMarket?.age?.periodLabel
    ? formatQuarterCodeLabel(laborMarket.age.periodLabel).toLowerCase()
    : null;
  const medianMonthlySalary = distribution?.total?.median;

  return [
    {
      question: `Hvor mange arbeider som ${label} i Norge?`,
      answer:
        employeeCount !== undefined
          ? `Det var ${formatNumber(employeeCount)} lønnstakere i yrket${employeePeriod ? ` i ${employeePeriod}` : ""}, ifølge SSB. Tallet omfatter personer som er registrert som lønnstakere i denne yrkesgruppen.`
          : "SSB har ikke publisert et tilgjengelig tall for antall lønnstakere i denne yrkesgruppen.",
    },
    {
      question: `Tjener kvinnelige eller mannlige ${label} mest?`,
      answer: buildGenderSalaryFaqAnswer({ menMedian, salaryPeriod, womenMedian }),
    },
    {
      question: `Har ${label} hatt reallønnsvekst?`,
      answer: buildRealWageFaqAnswer(latestRealGrowthPoint),
    },
    {
      question: `Hva er gjennomsnittsalderen blant ${label}?`,
      answer:
        averageAge !== undefined
          ? `Gjennomsnittsalderen var ${averageAge.toLocaleString("nb-NO", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })} år${agePeriod ? ` i ${agePeriod}` : ""}, ifølge SSB.`
          : "SSB har ikke publisert en tilgjengelig gjennomsnittsalder for denne yrkesgruppen.",
    },
    {
      question: `Hva er årslønnen for ${label}?`,
      answer:
        medianMonthlySalary !== undefined
          ? `Beregnet median årslønn er ${formatKr(medianMonthlySalary * 12)} før skatt${salaryPeriod ? `, basert på median månedslønn i ${salaryPeriod}` : ""}. Årslønnen er et estimat der månedslønnen er ganget med 12.`
          : "Det finnes ikke et tilgjengelig tall for median månedslønn som kan brukes til å beregne årslønn for denne yrkesgruppen.",
    },
  ];
}

function buildGenderSalaryFaqAnswer({
  menMedian,
  salaryPeriod,
  womenMedian,
}: {
  menMedian?: number;
  salaryPeriod: string | null;
  womenMedian?: number;
}) {
  if (womenMedian === undefined || menMedian === undefined) {
    return "SSB har ikke publisert sammenlignbare medianlønnstall for både kvinner og menn i denne yrkesgruppen.";
  }

  const periodSuffix = salaryPeriod ? ` i ${salaryPeriod}` : "";

  if (womenMedian === menMedian) {
    return `Kvinner og menn hadde samme median månedslønn på ${formatKr(womenMedian)}${periodSuffix}.`;
  }

  const highestGroup = womenMedian > menMedian ? "Kvinner" : "Menn";
  const highestSalary = Math.max(womenMedian, menMedian);
  const lowestGroup = womenMedian > menMedian ? "menn" : "kvinner";
  const lowestSalary = Math.min(womenMedian, menMedian);

  return `${highestGroup} hadde høyest median månedslønn${periodSuffix}, med ${formatKr(highestSalary)} mot ${formatKr(lowestSalary)} for ${lowestGroup}. Forskjellen var ${formatKr(highestSalary - lowestSalary)} per måned.`;
}

function buildRealWageFaqAnswer(
  point:
    | OccupationDetailViewModel["data"]["trendData"]["purchasingPowerSeries"]["points"][number]
    | undefined,
) {
  if (point?.realGrowthAll === undefined) {
    return "Det finnes ikke nok tilgjengelige data til å beregne reallønnsveksten for denne yrkesgruppen.";
  }

  const period = formatQuarterCodeLabel(point.periodLabel).toLowerCase();
  const growth = point.realGrowthAll;

  if (growth > 0) {
    return `Ja. Reallønnen økte med ${formatPercent(growth)} i den siste sammenlignbare perioden, ${period}. Det betyr at lønnen økte mer enn prisene.`;
  }

  if (growth < 0) {
    return `Nei, ikke i den siste sammenlignbare perioden. Reallønnen falt med ${formatPercent(Math.abs(growth))} i ${period}, noe som betyr at prisene økte mer enn lønnen.`;
  }

  return `Reallønnen var uendret i den siste sammenlignbare perioden, ${period}. Lønnen og prisene økte da omtrent like mye.`;
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

function calculateSpread(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return undefined;
  }

  return Math.max(0, max - min);
}

function formatKrPlain(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

