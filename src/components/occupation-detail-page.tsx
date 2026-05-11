import Link from "next/link";
import { OccupationAgeTimeSeriesChart } from "@/components/occupation-age-time-series";
import { OccupationPurchasingPowerLineChart } from "@/components/occupation-purchasing-power-line-chart";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { OccupationSalaryEstimate } from "@/components/occupation-salary-estimate";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import { OccupationWorkforceTimeSeriesChart } from "@/components/occupation-workforce-time-series";
import { getApprenticeshipDetailPageByOccupationCode } from "@/lib/apprenticeship-detail-view-models";
import {
  getOccupationFiveYearGrowthComparison,
  type OccupationFiveYearGrowthComparison,
} from "@/lib/occupation-five-year-growth";
import type { OccupationDetailViewModel } from "@/lib/occupation-detail-view-models";
import { formatOccupationDisplayLabel, getOccupationTextContext } from "@/lib/occupation-detail-pages";
import { buildHourlySalarySlugFromOccupationSlug } from "@/lib/hourly-salary-pages";

type OccupationDetailPageProps = {
  detail: OccupationDetailViewModel;
};

const FEATURED_BLOG_POST = {
  href: "/blogg/hvordan-be-om-mer-lonn",
  title: "Hvordan be om mer lønn?",
};

const BLOG_LINKS = [
  {
    href: "/blogg/hvor-mye-mer-kan-man-be-om-i-lonn",
    title: "Hvor mye mer kan man be om i lønn?",
  },
  {
    href: "/blogg/nar-bor-man-be-om-hoyere-lonn",
    title: "Når bør man be om høyere lønn?",
  },
  {
    href: "/blogg/hva-tjener-handverkere-disse-er-best-betalt",
    title: "Hva tjener håndverkere?",
  },
  {
    href: "/blogg/best-betalte-yrker-i-2025",
    title: "Best betalte yrker i 2025",
  },
];

const TOOL_LINKS = [
  {
    colorClassName: "text-sky-700",
    href: "/lonnskalkulator",
    icon: "calculator",
    title: "Lønnskalkulator",
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
  {
    colorClassName: "text-amber-700",
    href: "/lanekalkulator",
    icon: "briefcase",
    title: "Lånekalkulator",
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
  const updatedLabel = formatDate(
    distribution?.updated ??
      detail.data.medianBasicSalarySeries.updated ??
      laborMarket?.updated,
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
  const hourlySalaryHref = `/timelonn/${buildHourlySalarySlugFromOccupationSlug(detail.detailPage.slug)}`;
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
  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="px-4 pb-6 text-white sm:px-6 lg:px-8">
        <div
          className="mx-auto w-full max-w-7xl rounded-b-[8px] bg-[#0f2f22] px-5 py-6 shadow-[0_24px_60px_rgba(15,47,34,0.14)] sm:px-8 sm:py-8 lg:px-12"
          style={{
            borderBottom: "2px solid #000",
            borderLeft: "2px solid #000",
            borderRight: "2px solid #000",
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
                Lønn for {occupationText.titleLabel}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-emerald-50 sm:text-lg sm:leading-8">
                {buildHeroIntro(occupationText.seoLabel, intro)} Her finner du lønn,
                lønnsutvikling og arbeidsmarkedstall for {occupationText.seoLabel}, basert på
                tall fra Statistisk sentralbyrå.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div
                className="flex w-full max-w-sm items-start justify-between gap-4 rounded-[5px] bg-white px-5 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:px-6 sm:py-5 lg:max-w-none"
                style={{ border: "2px solid #000" }}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1 text-2xl leading-none sm:text-3xl ${
                      medianGrowthMetrics === null
                        ? "text-slate-950"
                        : medianGrowthMetrics.salaryGrowth >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                    }`}
                  >
                    {medianGrowthMetrics === null ? "→" : medianGrowthMetrics.salaryGrowth >= 0 ? "↑" : "↓"}
                  </span>
                  <p
                    className={`whitespace-nowrap text-4xl font-semibold tracking-[-0.04em] sm:text-5xl ${
                      medianGrowthMetrics === null
                        ? "text-slate-950"
                        : medianGrowthMetrics.salaryGrowth >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                    }`}
                  >
                    {formatPercent(medianGrowthMetrics?.salaryGrowth)}
                  </p>
                </div>
                <MetricInfoButton
                  description={
                    medianGrowthMetrics
                      ? `Lønnsvekst siste år viser endringen i median månedslønn for begge kjønn fra ${medianGrowthMetrics.previousPeriodLabel.toLowerCase()} til ${medianGrowthMetrics.latestPeriodLabel.toLowerCase()}.`
                      : "Lønnsvekst siste år viser endringen i median månedslønn for begge kjønn sammenlignet med året før."
                  }
                  label="Lønnsvekst siste år"
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
                className="rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:px-6"
                style={{ border: "2px solid #000" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Kort oppsummert
                </p>
                <p className="mt-3 max-w-4xl text-base leading-7 text-slate-950 sm:text-lg sm:leading-8">
                  {topSummary}
                </p>
              </section>
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2">
              {salaryCompositionCards.map((card) => (
                <SalaryCompositionCard card={card} key={card.key} />
              ))}
            </section>

            {distribution ? (
              <section className="space-y-4">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Lønnsfordeling for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {distributionSummary}
                  </p>
                </div>
                <div
                  className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-6"
                  style={{ border: "2px solid #000" }}
                >
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
                    {salaryDevelopmentSummary}{" "}
                  <Link
                    className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
                    href={FEATURED_BLOG_POST.href}
                  >
                    Les også {FEATURED_BLOG_POST.title.toLowerCase()}.
                  </Link>
                </p>
              </div>
              <OccupationSalaryTimeSeriesChart
                description="Se utviklingen i månedslønn per år. Grafen viser median månedslønn for begge kjønn, kvinner og menn basert på tilgjengelige tall fra SSB."
                series={detail.data.medianBasicSalarySeries}
                variant="classic-emphasis"
                title={`Utvikling i månedslønn for ${occupationText.titleLabel}`}
              />
            </section>

            <section className="space-y-4">
              <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                {purchasingPowerSummary}
              </p>
              <OccupationPurchasingPowerLineChart
                series={detail.data.trendData.purchasingPowerSeries}
              />
            </section>

            {hasEstimate ? (
              <section className="space-y-4">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Lønnsestimat for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    Her ser du et forenklet lønnsestimat basert på median samlet månedslønn i yrket.
                    Vi bruker vanlig heltidsstilling, standard feriepengesats og et fast
                    skatteanslag for å vise timelønn, årslønn, feriepengeestimat og omtrent hva det
                    kan gi utbetalt.{" "}
                    <Link
                      className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
                      href="/blogg/hvor-mye-mer-kan-man-be-om-i-lonn"
                    >
                      Les også hvor mye mer kan man be om i lønn?
                    </Link>
                  </p>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    Vil du se mer om timesats for yrket?{" "}
                    <Link
                      className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
                      href={hourlySalaryHref}
                    >
                      Se estimert timelønn for {occupationText.titleLabel}
                    </Link>
                    .
                  </p>
                </div>
                <div
                  className="rounded-[5px] bg-white p-5 shadow-sm sm:p-6"
                  style={{ border: "2px solid #000" }}
                >
                  <OccupationSalaryEstimate
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
              <section className="space-y-4">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Relaterte jobber for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {relatedJobsSummary}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {relatedRows.map((row) => (
                    <Link
                      className="rounded-[5px] bg-white px-4 py-4 transition hover:bg-[#f7fafc]"
                      href={row.href}
                      key={row.occupationCode}
                      style={{ border: "2px solid #000" }}
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
              <section className="space-y-4">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Arbeidsmarkedet for {occupationText.titleLabel}
                  </h2>
                  <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-8">
                    {laborMarketSummary}
                  </p>
                </div>
                <OccupationWorkforceTimeSeriesChart
                  description="Se utviklingen i antall lønnstakere per kvartal, fordelt på kvinner og menn."
                  points={laborMarket.workforcePoints}
                />
                <OccupationAgeTimeSeriesChart
                  occupationLabel={occupationText.titleLabel}
                  points={laborMarket.ageSeries}
                />
              </section>
            ) : null}

          </div>

          <aside
            className="self-start space-y-7 rounded-[5px] bg-white px-6 py-6 shadow-[0_16px_44px_rgba(15,23,42,0.04)]"
            style={{ border: "2px solid #000" }}
          >
            <section>
              <p className="text-sm leading-6 text-slate-600">
                Data fra{" "}
                <a
                  className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-950"
                  href={EXTERNAL_SOURCE_LINKS[0].href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Statistisk sentralbyrå (SSB)
                </a>
                .
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Sist oppdatert {updatedLabel ?? "i siste tilgjengelige publisering"}.
              </p>
            </section>

            {apprenticeshipPage ? (
              <Link
                className="flex items-center gap-3 rounded-[5px] px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
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

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Verktøy
              </p>
              <nav aria-label="Verktøy" className="mt-4 grid gap-3">
                {TOOL_LINKS.map((tool) => (
                  <Link
                    className="flex items-center gap-3 rounded-[5px] text-sm font-medium text-slate-700 transition hover:text-slate-950"
                    href={tool.href}
                    key={tool.href}
                  >
                    <SidebarToolIcon className={tool.colorClassName} icon={tool.icon} />
                    <span>{tool.title}</span>
                  </Link>
                ))}
              </nav>
            </section>

            {BLOG_LINKS.length > 0 ? (
              <section>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Fra bloggen
                </p>
                <div className="mt-4 grid gap-3">
                  {[FEATURED_BLOG_POST, ...BLOG_LINKS].map((post) => (
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
            className="rounded-[5px] bg-white px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm sm:px-5"
            style={{ border: "2px solid #000" }}
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
};

type SalaryCompositionCardProps = {
  card: SalaryCompositionCardData;
};

function SalaryCompositionCard({ card }: SalaryCompositionCardProps) {
  return (
    <article
      className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-6"
      style={{ border: "2px solid #000" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          {card.icon ? <div className="mr-1 shrink-0">{card.icon}</div> : null}
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            {card.title}
          </p>
        </div>
        {card.caption ? <p className="shrink-0 text-sm text-slate-500">{card.caption}</p> : null}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <p className="text-sm font-medium text-slate-600">Månedslønn</p>
        <MetricInfoButton
          description="Dette er median samlet månedslønn. Tallet inkluderer avtalt månedslønn, bonus og uregelmessige tillegg. Overtid er ikke med."
          label={`${card.title} månedslønn forklart`}
        />
      </div>
      <p className="mt-1 text-4xl font-semibold tracking-[-0.05em] text-slate-950 tabular-nums sm:text-5xl">
        {formatKr(card.totalMedian)}
      </p>

      <dl className="mt-5 grid gap-2">
        <SalaryCompositionRow
          info="Avtalt månedslønn er lønnen som er avtalt for jobben, uten bonus, uregelmessige tillegg og overtid."
          label="Avtalt månedslønn"
          value={formatKr(card.contractedMedian)}
        />
        <SalaryCompositionRow
          info="Bonus og tillegg er forskjellen mellom samlet og avtalt månedslønn. Det består av bonus og uregelmessige tillegg. Overtid er ikke med."
          label="Bonus og tillegg"
          value={formatKr(card.extraMedian)}
        />
      </dl>
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
    <div className="flex items-baseline justify-between gap-4 rounded-[5px] bg-slate-50 px-4 py-3">
      <dt className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
        <span className="truncate">{label}</span>
        {info ? <MetricInfoButton description={info} label={`${label} forklart`} /> : null}
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
      extraMedian: calculatePositiveDifference(
        distribution?.women?.median,
        contractedDistribution?.women?.median,
      ),
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
      extraMedian: calculatePositiveDifference(
        distribution?.men?.median,
        contractedDistribution?.men?.median,
      ),
    });
  }

  if (!hasBothGenderMetrics && (distribution?.total?.median !== undefined || contractedDistribution?.total?.median !== undefined)) {
    cards.push({
      key: "all",
      title: "Alle",
      caption: latestSalaryPeriodLabel,
      contractedMedian: contractedDistribution?.total?.median,
      totalMedian: distribution?.total?.median,
      extraMedian: calculatePositiveDifference(
        distribution?.total?.median,
        contractedDistribution?.total?.median,
      ),
    });
  }

  return cards;
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

function SidebarToolIcon({
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

function formatDate(value?: string) {
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

  return [medianSentence, sourceSentence]
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

