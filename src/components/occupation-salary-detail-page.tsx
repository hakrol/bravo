import { notFound } from "next/navigation";
import { InlineDefinitionModal } from "@/components/inline-definition-modal";
import { OccupationAgeTimeSeriesChart } from "@/components/occupation-age-time-series";
import { MetricInfoButton } from "@/components/metric-info-button";
import {
  OccupationDetailSectionNav,
  type OccupationDetailSectionNavItem,
} from "@/components/occupation-detail-section-nav";
import { OccupationPurchasingPowerTimeSeriesChart } from "@/components/occupation-purchasing-power-time-series";
import { OccupationSalaryEstimate } from "@/components/occupation-salary-estimate";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { RelatedOccupationSalaryComparison } from "@/components/related-occupation-salary-comparison";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import { OccupationWorkforceTimeSeriesChart } from "@/components/occupation-workforce-time-series";
import type { OccupationDetailPage } from "@/lib/occupation-detail-pages";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { buildOccupationMedianGrowthOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestAndPreviousYearSalaryDatasets,
  getOccupationDetailTrendData,
  getOccupationLaborMarketStats,
  getOccupationMedianSalaryOverview,
  getOccupationSalaryDistribution,
  getOccupationSalaryTimeSeries,
  OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
  SSB_OCCUPATION_CONTRACT_TABLE_ID,
} from "@/lib/ssb";

type OccupationSalaryDetailPageProps = {
  occupationCode: string;
  detailPageOverride: OccupationDetailPage;
  relatedPagesOverride?: OccupationDetailPage[];
};

const sectionAnchorClassName = "scroll-mt-32";
void notFound;

export async function OccupationSalaryDetailPage({
  occupationCode,
  detailPageOverride,
  relatedPagesOverride,
}: OccupationSalaryDetailPageProps) {
  const detailPage = detailPageOverride;
  const relatedPages = relatedPagesOverride ?? [];
  const formattedOccupationLabel = formatOccupationDisplayLabel(detailPage.label);
  const comparisonOccupationCodes = [occupationCode, ...relatedPages.map((page) => page.occupationCode)];

  const [trendData, distribution, medianOverview, laborMarketStats, medianBasicSalarySeries, yearlyMedianDatasets] =
    await Promise.all([
      getOccupationDetailTrendData(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
      getOccupationSalaryDistribution(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
      getOccupationMedianSalaryOverview(comparisonOccupationCodes, OCCUPATION_MONTHLY_SALARY_FILTERS),
      getOccupationLaborMarketStats(occupationCode),
      getOccupationSalaryTimeSeries(
        occupationCode,
        OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
      ),
      getLatestAndPreviousYearSalaryDatasets(
        "occupationDetailed",
        OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
      ),
    ]);
  const { series, purchasingPower, purchasingPowerSeries } = trendData;
  const medianGrowthMetrics = buildMedianGrowthMetrics(medianBasicSalarySeries);

  const medianRowsByCode = new Map(
    medianOverview.rows.map((row) => [row.occupationCode, row] as const),
  );
  const medianPeriodLabel = medianOverview.periodLabel ?? distribution?.periodLabel;
  const currentMedianRow = medianRowsByCode.get(occupationCode);
  const currentSalary = currentMedianRow?.medianAll ?? distribution?.total?.median;
  const currentSalaryWomen = currentMedianRow?.medianWomen ?? distribution?.women?.median;
  const currentSalaryMen = currentMedianRow?.medianMen ?? distribution?.men?.median;
  const salaryUpdatedLabel = formatUpdatedLabel(
    distribution?.updated ?? medianBasicSalarySeries.updated ?? laborMarketStats?.updated,
  );
  const salarySourceText = buildSalarySourceText(medianPeriodLabel, salaryUpdatedLabel);
  const topSummary = buildTopSummary({
    occupationLabel: formattedOccupationLabel,
    periodLabel: medianPeriodLabel,
    updatedLabel: salaryUpdatedLabel,
    womenMedian: currentSalaryWomen,
    menMedian: currentSalaryMen,
    womenP25: distribution?.women?.p25,
    womenP75: distribution?.women?.p75,
    menP25: distribution?.men?.p25,
    menP75: distribution?.men?.p75,
  });
  const growthOverview = buildOccupationMedianGrowthOverview(
    yearlyMedianDatasets.latestDataset,
    yearlyMedianDatasets.previousDataset,
    { occupationCodes: comparisonOccupationCodes },
  );
  const growthByOccupationCode = new Map(
    growthOverview.rows.map((row) => [row.occupationCode, row] as const),
  );
  const relatedRows = relatedPages
    .map((page) => {
      const row = medianRowsByCode.get(page.occupationCode);
      const growthRow = growthByOccupationCode.get(page.occupationCode);

      return {
        occupationCode: page.occupationCode,
        occupationLabel: row?.occupationLabel ?? page.label,
        href: page.href,
        medianWomen: row?.medianWomen,
        medianMen: row?.medianMen,
        growthWomen: growthRow?.growthWomen,
        growthMen: growthRow?.growthMen,
        groupCode: page.occupationCode.charAt(0),
      };
    })
    .filter((row) => row.occupationCode !== occupationCode)
    .filter((row) => row.medianWomen !== undefined || row.medianMen !== undefined)
    .slice(0, 6);
  const hasEstimate =
    currentSalary !== undefined || currentSalaryWomen !== undefined || currentSalaryMen !== undefined;
  const hasRelatedRows = relatedRows.length > 0;
  const hasPurchasingPowerSeries = purchasingPowerSeries.points.length > 0;
  const hasAgeSeries = (laborMarketStats?.ageSeries.length ?? 0) > 0;
  const detailSections: OccupationDetailSectionNavItem[] = [
    { id: "oversikt", label: "Oversikt" },
    ...(hasEstimate ? [{ id: "lonnsutregning", label: "Lønn" }] : []),
    ...(hasRelatedRows ? [{ id: "relaterte-yrker", label: "Relaterte yrker" }] : []),
    { id: "lonnsutvikling", label: "Lønnsutvikling" },
    ...(hasPurchasingPowerSeries ? [{ id: "kjopekraft", label: "Kjøpekraft" }] : []),
    ...(laborMarketStats ? [{ id: "arbeidsmarked", label: "Arbeidsmarked" }] : []),
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <OccupationDetailSectionNav sections={detailSections} variant="desktop" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          <OccupationDetailSectionNav
            className="lg:hidden"
            sections={detailSections}
            variant="mobile"
          />
          <section
            aria-label="Oversikt"
            className={`${sectionAnchorClassName} border-b border-black/10 pb-8`}
            id="oversikt"
          >
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-6">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                  Lønn til {formattedOccupationLabel}
                </h1>
                <div className="hidden shrink-0 rounded-md border border-black/10 bg-white/70 p-3 shadow-[0_10px_30px_rgba(27,36,48,0.08)] sm:flex">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[linear-gradient(135deg,#f4efe6_0%,#e6f0ea_100%)] text-[var(--primary-strong)]"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 18.5h14M7 15.5V10.5M12 15.5V6.5M17 15.5V12.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M6 8.5 10.2 5l3.6 3 4.2-3.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="max-w-3xl text-base leading-7 text-slate-950">
                <span>Denne siden viser </span>
                <InlineDefinitionModal
                  description="Dette er lønnsmålet som brukes for nivåtallene på denne siden."
                  label="median avtalt månedslønn"
                  title="Median avtalt månedslønn (kr)"
                />
                <span>
                  {" "}
                  for {formattedOccupationLabel.toLowerCase()}, lønnsutvikling og andre relevante
                  nøkkeltall basert på siste tilgjengelige tall fra SSB. {detailPage.summary} Tallene
                  viser bruttolønn før skatt og inkluderer ikke overtid eller bonus.
                </span>
              </div>
              {topSummary ? (
                <div className="rounded-md border border-[var(--primary)]/20 bg-[linear-gradient(135deg,rgba(244,239,230,0.72)_0%,rgba(230,240,234,0.78)_100%)] px-5 py-5 shadow-[0_12px_36px_rgba(27,36,48,0.06)] sm:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                    Kort oppsummert
                  </p>
                  <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-950">
                    {topSummary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                    <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5">
                      Kilde: SSB tabell 11418
                    </span>
                    {medianPeriodLabel ? (
                      <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5">
                        Periode: {medianPeriodLabel}
                      </span>
                    ) : null}
                    {salaryUpdatedLabel ? (
                      <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5">
                        Oppdatert hos SSB: {salaryUpdatedLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            {purchasingPower ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <MetricStat
                    label="Kvinner"
                    leadingSymbol="♀"
                    description={`Kvinner viser median avtalt månedslønn i kroner for kvinner i dette yrket. Tallet er hentet fra SSB tabell 11418 og gjelder siste tilgjengelige periode, ${medianPeriodLabel?.toLowerCase() ?? "ukjent periode"}. Dette er median avtalt månedslønn for registrerte kvinner i dette yrket, ikke et anslag for en enkeltperson.`}
                    value={formatSalaryMetric(currentSalaryWomen)}
                    caption={formatAnnualSalaryCaption(currentSalaryWomen)}
                  />
                  <MetricStat
                    label="Menn"
                    leadingSymbol="♂"
                    description={`Menn viser median avtalt månedslønn i kroner for menn i dette yrket. Tallet er hentet fra SSB tabell 11418 og gjelder siste tilgjengelige periode, ${medianPeriodLabel?.toLowerCase() ?? "ukjent periode"}. Dette er median avtalt månedslønn for registrerte menn i dette yrket, ikke et anslag for en enkeltperson.`}
                    value={formatSalaryMetric(currentSalaryMen)}
                    caption={formatAnnualSalaryCaption(currentSalaryMen)}
                  />
                  <MetricStat
                    label="Lønnsvekst"
                    description={
                      medianGrowthMetrics
                        ? `Lønnsvekst viser hvor mye median avtalt månedslønn i yrket har endret seg fra ${medianGrowthMetrics.previousPeriodLabel.toLowerCase()} til ${medianGrowthMetrics.latestPeriodLabel.toLowerCase()}. Tallet er hentet fra SSB tabell 11658 og sammenligner samme kvartal i to påfølgende år.`
                        : undefined
                    }
                    value={formatPercentage(medianGrowthMetrics?.salaryGrowth)}
                  />
                  <MetricStat
                    label="Inflasjon"
                    description={`Inflasjon viser prisveksten i samme periode som lønnsveksten, fra ${purchasingPower.previousPeriodLabel.toLowerCase()} til ${purchasingPower.latestPeriodLabel.toLowerCase()}. Tallet er hentet fra KPI i SSB tabell 14700 og brukes her for å vise hvor mye prisnivået har steget i løpet av de siste 12 månedene.`}
                    value={`${purchasingPower.inflationGrowth.toLocaleString("nb-NO", {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    })} %`}
                  />
                  <MetricStat
                    label={purchasingPower.realGrowth >= 0 ? "Reallønnsvekst" : "Reallønnsfall"}
                    description={`${purchasingPower.realGrowth >= 0 ? "Reallønnsvekst" : "Reallønnsfall"} viser hvordan lønnsutviklingen i yrket står seg mot prisveksten fra ${purchasingPower.previousPeriodLabel.toLowerCase()} til ${purchasingPower.latestPeriodLabel.toLowerCase()}. Tallet er beregnet ved å sammenligne lønnsvekst fra SSB tabell 11658 med inflasjon fra SSB tabell 14700. Positiv verdi betyr at lønnen har økt mer enn prisene, mens negativ verdi betyr at prisene har steget mer enn lønnen.`}
                    value={`${purchasingPower.realGrowth.toLocaleString("nb-NO", {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    })} %`}
                    tone={purchasingPower.realGrowth >= 0 ? "positive" : "negative"}
                  />
                </div>
              </div>
            ) : null}
            {distribution ? (
              <section
                aria-labelledby="lonnsfordeling-tittel"
                className="space-y-4 rounded-md border border-black/10 bg-white/70 px-5 py-5 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-6"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                    Lønnsfordeling
                  </p>
                  <h2
                    className="text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    id="lonnsfordeling-tittel"
                  >
                    Hvor i lønnsspennet de fleste ligger
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-slate-700">
                    Grafen under viser lønnsspennet for kvinner og menn i yrket. Midtpunktet er median
                    avtalt månedslønn, mens feltet mellom 25- og 75-persentilen viser hvor de fleste
                    lønnstakere ligger i siste tilgjengelige SSB-periode.
                  </p>
                </div>
                <OccupationSalaryDistributionSection distribution={distribution} />
                <div className="space-y-2 text-sm leading-7 text-slate-700">
                  <p>
                    Tallene viser bruttolønn før skatt og inkluderer ikke overtid eller bonus. For denne
                    siden betyr "de fleste" lønnstakere mellom 25- og 75-persentilen.
                  </p>
                  <p>{salarySourceText}</p>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        {hasEstimate ? (
          <section
            aria-label="Lønn"
            className={sectionAnchorClassName}
            id="lonnsutregning"
          >
            <OccupationSalaryEstimate
              monthlySalary={currentSalary}
              monthlySalaryMen={currentSalaryMen}
              monthlySalaryWomen={currentSalaryWomen}
              occupationLabel={detailPage.label}
            />
          </section>
        ) : null}
        {hasRelatedRows && hasEstimate ? (
          <section
            aria-label="Annonse"
            className={sectionAnchorClassName}
          >
            <div className="rounded-md border border-dashed border-[var(--primary)]/35 bg-[linear-gradient(135deg,rgba(244,239,230,0.85)_0%,rgba(230,240,234,0.85)_100%)] px-6 py-6 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
                    Annonseplassholder
                  </p>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Reklame kommer her
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-slate-700">
                    Dette er en midlertidig filler-boks mellom lønnsestimatet og relaterte yrker.
                  </p>
                </div>
                <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
                  320 x 250 / responsiv
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {hasRelatedRows ? (
          <section
            aria-label="Relaterte yrker"
            className={sectionAnchorClassName}
            id="relaterte-yrker"
          >
            <RelatedOccupationSalaryComparison
              rows={relatedRows}
            />
          </section>
        ) : null}
        <section
          aria-label="Lønnsutvikling"
          className={sectionAnchorClassName}
          id="lonnsutvikling"
        >
          <OccupationSalaryTimeSeriesChart
            description={`Se utviklingen i månedslønn for ${formattedOccupationLabel.toLowerCase()} per kvartal. Grafen viser median avtalt månedslønn for begge kjønn, kvinner og menn basert på tilgjengelige tall fra SSB.`}
            series={medianBasicSalarySeries}
            title={`Utvikling i månedslønn for ${formattedOccupationLabel}`}
          />
        </section>
        {hasPurchasingPowerSeries ? (
          <section aria-label="Kjøpekraft" className={sectionAnchorClassName} id="kjopekraft">
            <OccupationPurchasingPowerTimeSeriesChart series={purchasingPowerSeries} />
          </section>
        ) : null}
        {laborMarketStats ? (
          <section
            className={`${sectionAnchorClassName} rounded-md border border-black/10 bg-white/70 px-6 py-6 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-8`}
            id="arbeidsmarked"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Arbeidsmarked
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  SSB-tall for arbeidsmarkedet i yrket
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-700">
                  Denne seksjonen viser utvikling i antall lønnstakere og jobber, fordeling mellom kvinner og menn,
                  vekst i antall lønnstakere, ansettelsesform og gjennomsnittsalder for {detailPage.label.toLowerCase()}.
                </p>
              </div>

              <div className="space-y-4">
                <OccupationWorkforceTimeSeriesChart
                  currentValue={
                    laborMarketStats.latest
                      ? formatEmploymentMetric(
                          laborMarketStats.latest.employees,
                          laborMarketStats.latest.employeeUnit,
                        )
                      : ":"
                  }
                  description="Antall personer registrert som lønnstakere i midtmåneden i kvartalet."
                  points={laborMarketStats.workforcePoints}
                />

                <LaborMarketCard
                  title="Gjennomsnittsalder"
                  subtitle={laborMarketStats.age?.periodLabel}
                >
                  {laborMarketStats.age ? (
                    <div className="space-y-3">
                      <SplitRow label="Alle" value={formatAgeMetric(laborMarketStats.age.averageAll)} />
                      <SplitRow
                        label="Kvinner"
                        value={formatAgeMetric(laborMarketStats.age.averageWomen)}
                      />
                      <SplitRow label="Menn" value={formatAgeMetric(laborMarketStats.age.averageMen)} />
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-slate-700">Ingen alderstall tilgjengelig.</p>
                  )}
                </LaborMarketCard>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Fordeling og utvikling
                </p>
                <div className="grid gap-6 xl:grid-cols-2">
                  <LaborMarketCard
                    title="Kjønnsfordeling blant lønnstakere"
                    subtitle={laborMarketStats.genderBreakdown?.periodLabel}
                  >
                    {laborMarketStats.genderBreakdown ? (
                      <div className="space-y-3">
                        <SplitRow
                          label="Kvinner"
                          value={formatWorkforceCount(laborMarketStats.genderBreakdown.women)}
                          detail={formatPercentage(laborMarketStats.genderBreakdown.womenShare)}
                        />
                        <SplitRow
                          label="Menn"
                          value={formatWorkforceCount(laborMarketStats.genderBreakdown.men)}
                          detail={formatPercentage(laborMarketStats.genderBreakdown.menShare)}
                        />
                      </div>
                    ) : (
                      <p className="text-sm leading-7 text-slate-700">Ingen kjønnsfordeling tilgjengelig.</p>
                    )}
                  </LaborMarketCard>

                  <LaborMarketCard
                    title="Vekst i lønnstakere"
                    subtitle={laborMarketStats.growth?.latestPeriodLabel}
                  >
                    {laborMarketStats.growth ? (
                      <div className="space-y-3">
                        <SplitRow
                          label="Siste år"
                          value={formatPercentage(laborMarketStats.growth.yearOverYearChange)}
                          detail={
                            laborMarketStats.growth.previousValue !== undefined
                              ? `${formatWorkforceCount(laborMarketStats.growth.previousValue)} til ${formatWorkforceCount(laborMarketStats.growth.latestValue)}`
                              : undefined
                          }
                        />
                        <SplitRow
                          label="Siden 2021"
                          value={formatPercentage(laborMarketStats.growth.changeSinceBaseline)}
                          detail={
                            laborMarketStats.growth.baselineValue !== undefined
                              ? `${formatWorkforceCount(laborMarketStats.growth.baselineValue)} til ${formatWorkforceCount(laborMarketStats.growth.latestValue)}`
                              : undefined
                          }
                        />
                      </div>
                    ) : (
                      <p className="text-sm leading-7 text-slate-700">Ingen veksttall tilgjengelig.</p>
                    )}
                  </LaborMarketCard>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Ansettelsesform
                </p>
                <LaborMarketCard
                  title="Fast og midlertidig"
                  subtitle={laborMarketStats.contractType?.periodLabel}
                >
                  {laborMarketStats.contractType ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      <SplitRow
                        label="Fast stilling"
                        value={formatExactPersonCount(laborMarketStats.contractType.permanent)}
                        detail={formatPercentage(laborMarketStats.contractType.permanentShare)}
                      />
                      <SplitRow
                        label="Midlertidig"
                        value={formatExactPersonCount(laborMarketStats.contractType.temporary)}
                        detail={formatPercentage(laborMarketStats.contractType.temporaryShare)}
                      />
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-slate-700">Ingen tall for ansettelsesform tilgjengelig.</p>
                  )}
                </LaborMarketCard>
              </div>

              {hasAgeSeries ? (
                <OccupationAgeTimeSeriesChart
                  occupationLabel={detailPage.label}
                  points={laborMarketStats.ageSeries}
                />
              ) : null}
            </div>
          </section>
        ) : null}

        </div>
      </div>

      <section className="mx-auto mt-10 w-full max-w-5xl" id="datakilder">
        <div className="grid gap-6 rounded-md border border-black/8 bg-white/45 px-5 py-5 shadow-[0_8px_24px_rgba(27,36,48,0.03)] sm:px-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Ansvarsfraskrivelse
            </p>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Tallene på denne siden er ment som informasjon og sammenligningsgrunnlag. Nivåtallene
              viser median avtalt månedslønn for registrerte personer i yrket, og er ikke et konkret
              lønnstilbud eller en garanti for hva en enkelt person bør tjene.
            </p>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Vekst- og kjøpekraftseksjonene bygger foreløpig på gjennomsnittstall over tid.
              Erfaring, ansiennitet, arbeidssted, sektor, ansvar, utdanning og lokale forhandlinger
              kan gi stor variasjon fra SSB-tallene.
            </p>
          </div>

          <div className="space-y-3 lg:min-w-[220px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
              Datakilder
            </p>
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              <li>SSB tabell 11658</li>
              <li>SSB tabell 11418</li>
              <li>SSB tabell 14700</li>
              <li>SSB tabell {SSB_OCCUPATION_CONTRACT_TABLE_ID}</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

type MetricStatProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  leadingSymbol?: string;
  description?: string;
  caption?: string;
};

function MetricStat({
  label,
  value,
  tone = "default",
  leadingSymbol,
  description,
  caption,
}: MetricStatProps) {
  const isPositive = tone === "positive";
  const isNegative = tone === "negative";
  const trendSymbol = isPositive ? "↑" : isNegative ? "↓" : null;
  const valueClasses = isPositive
    ? "text-emerald-700"
    : isNegative
      ? "text-red-700"
      : "text-slate-950";

  return (
    <div className="min-w-0 px-1 py-2">
      <div className="flex items-start">
        {leadingSymbol ? (
          <span
            aria-hidden="true"
            className="mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f4efe6] text-sm text-[var(--primary-strong)]"
          >
            {leadingSymbol}
          </span>
        ) : null}
        <div className="flex min-w-0 items-start gap-2">
          <p className="min-w-0 text-sm uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
          {description ? <MetricInfoButton description={description} label={label} /> : null}
        </div>
      </div>
      <p className={`mt-2 break-words text-3xl font-semibold tracking-[-0.04em] ${valueClasses}`}>
        {trendSymbol ? <span aria-hidden="true" className="text-2xl leading-none">{trendSymbol}</span> : null}
        <span>{value}</span>
      </p>
      {caption ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{caption}</p> : null}
    </div>
  );
}

type LaborMarketCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function LaborMarketCard({ title, subtitle, children }: LaborMarketCardProps) {
  return (
    <div className="rounded-md border border-black/10 bg-[#fcfaf6] p-5">
      <div className="mb-4 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {title}
        </p>
        {subtitle ? (
          <p className="text-sm leading-6 text-slate-600">{formatQuarterCodeLabel(subtitle)}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

type SplitRowProps = {
  label: string;
  value: string;
  detail?: string;
};

function SplitRow({ label, value, detail }: SplitRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-black/5 pb-3 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {detail ? <p className="text-sm leading-6 text-[var(--muted)]">{detail}</p> : null}
      </div>
      <p className="shrink-0 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function formatSalaryMetric(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatQuarterCodeLabel(value: string) {
  const match = value.match(/(\d{4})\s*K([1-4])/i) ?? value.match(/(\d{4})K([1-4])/i);

  if (!match) {
    return value;
  }

  return `${match[2]}.kv.${match[1]}`;
}

function formatEmploymentMetric(value?: number, unit?: string) {
  if (value === undefined || !unit) {
    return ":";
  }

  if (unit.includes("1 000")) {
    const fullValue = value * 1000;

    return `${fullValue.toLocaleString("nb-NO", {
      maximumFractionDigits: 0,
    })}`;
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} ${unit}`;
}

function formatWorkforceCount(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })}`;
}

function formatExactPersonCount(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })}`;
}

function formatPercentage(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function formatAgeMetric(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} år`;
}

function formatJobsPerEmployee(jobs?: number, employees?: number) {
  if (jobs === undefined || employees === undefined || employees === 0) {
    return ":";
  }

  return `${(jobs / employees).toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatAnnualSalaryCaption(value?: number) {
  if (value === undefined) {
    return undefined;
  }

  return `Årslønn: ${(value * 12).toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatSalaryRangeText(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return null;
  }

  return `${formatSalaryMetric(min)} og ${formatSalaryMetric(max)}`;
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

function buildSalarySourceText(periodLabel?: string, updatedLabel?: string | null) {
  const segments = [
    "Kilde: SSB tabell 11418",
    periodLabel ? `periode ${periodLabel}` : null,
    updatedLabel ? `oppdatert hos SSB ${updatedLabel}` : null,
  ].filter((segment): segment is string => Boolean(segment));

  return `${segments.join(", ")}.`;
}

function buildTopSummary({
  occupationLabel,
  periodLabel,
  updatedLabel,
  womenMedian,
  menMedian,
  womenP25,
  womenP75,
  menP25,
  menP75,
}: {
  occupationLabel: string;
  periodLabel?: string;
  updatedLabel?: string | null;
  womenMedian?: number;
  menMedian?: number;
  womenP25?: number;
  womenP75?: number;
  menP25?: number;
  menP75?: number;
}) {
  if (womenMedian === undefined && menMedian === undefined) {
    return null;
  }

  const womenRange = formatSalaryRangeText(womenP25, womenP75);
  const menRange = formatSalaryRangeText(menP25, menP75);
  const medianSentence =
    womenMedian !== undefined && menMedian !== undefined
      ? `Median lønn for ${occupationLabel.toLowerCase()} i Norge er ${formatSalaryMetric(womenMedian)} for kvinner og ${formatSalaryMetric(menMedian)} for menn.`
      : womenMedian !== undefined
        ? `Median lønn for kvinner i ${occupationLabel.toLowerCase()} i Norge er ${formatSalaryMetric(womenMedian)}.`
        : `Median lønn for menn i ${occupationLabel.toLowerCase()} i Norge er ${formatSalaryMetric(menMedian)}.`;

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

function buildMedianGrowthMetrics(series: {
  points: Array<{ periodCode: string; periodLabel: string; valueAll?: number }>;
}) {
  const pointsByPeriod = new Map(
    series.points
      .filter((point) => point.valueAll !== undefined)
      .map((point) => [normalizeQuarterPeriodCode(point.periodCode, point.periodLabel), point] as const)
      .filter((entry): entry is [string, { periodCode: string; periodLabel: string; valueAll?: number }] => Boolean(entry[0])),
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

function normalizeQuarterPeriodCode(periodCode: string, periodLabel: string) {
  const match = periodCode.match(/^(\d{4})K([1-4])$/i) ?? periodLabel.match(/(\d{4})\s*K([1-4])/i);

  if (!match) {
    return null;
  }

  return `${match[1]}K${match[2]}`;
}

function getPreviousYearQuarterCode(periodCode: string) {
  const match = periodCode.match(/^(\d{4})K([1-4])$/i);

  if (!match) {
    return null;
  }

  const year = Number(match[1]) - 1;
  const quarter = match[2];
  return `${year}K${quarter}`;
}

