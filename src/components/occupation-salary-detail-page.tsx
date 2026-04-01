import { notFound } from "next/navigation";
import { InlineDefinitionModal } from "@/components/inline-definition-modal";
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
import {
  getOccupationDetailPage,
  getRelatedOccupationDetailPages,
} from "@/lib/occupation-detail-pages";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationLaborMarketStats,
  getOccupationSalaryDistribution,
  getOccupationPurchasingPowerDetail,
  getOccupationPurchasingPowerTimeSeries,
  getOccupationSalaryTimeSeries,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
  SSB_OCCUPATION_CONTRACT_TABLE_ID,
  SSB_OCCUPATION_EMPLOYMENT_TABLE_ID,
} from "@/lib/ssb";

type OccupationSalaryDetailPageProps = {
  occupationCode: string;
};

const sectionAnchorClassName = "scroll-mt-32";

export async function OccupationSalaryDetailPage({
  occupationCode,
}: OccupationSalaryDetailPageProps) {
  const detailPage = getOccupationDetailPage(occupationCode);

  if (!detailPage) {
    notFound();
  }

  const relatedPages = getRelatedOccupationDetailPages(occupationCode);
  const comparisonOccupationCodes = [occupationCode, ...relatedPages.map((page) => page.occupationCode)];

  const [series, distribution, purchasingPower, purchasingPowerSeries, latestDataset, laborMarketStats] =
    await Promise.all([
      getOccupationSalaryTimeSeries(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
      getOccupationSalaryDistribution(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
      getOccupationPurchasingPowerDetail(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
      getOccupationPurchasingPowerTimeSeries(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
      getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS),
      getOccupationLaborMarketStats(occupationCode),
    ]);

  const overview = buildOccupationSalaryOverview(latestDataset, {
    occupationCodes: comparisonOccupationCodes,
  });
  const overviewRowsByCode = new Map(
    overview.rows.map((row) => [row.occupationCode, row] as const),
  );
  const latestSalaryPoint = series.points.at(-1);
  const employment = laborMarketStats?.latest ?? null;
  const currentSalary = overviewRowsByCode.get(occupationCode)?.salaryAll ?? latestSalaryPoint?.valueAll;
  const currentSalaryWomen = overviewRowsByCode.get(occupationCode)?.salaryWomen ?? latestSalaryPoint?.valueWomen;
  const currentSalaryMen = overviewRowsByCode.get(occupationCode)?.salaryMen ?? latestSalaryPoint?.valueMen;
  const relatedRows = relatedPages
    .map((page) => {
      const row = overviewRowsByCode.get(page.occupationCode);

      return {
        occupationCode: page.occupationCode,
        occupationLabel: row?.occupationLabel ?? page.label,
        href: page.href,
        salaryAll: row?.salaryAll,
        salaryWomen: row?.salaryWomen,
        salaryMen: row?.salaryMen,
      };
    })
    .filter((row) => row.salaryAll !== undefined);
  const hasEstimate =
    currentSalary !== undefined || currentSalaryWomen !== undefined || currentSalaryMen !== undefined;
  const hasRelatedRows = relatedRows.length > 0;
  const hasPurchasingPowerSeries = purchasingPowerSeries.points.length > 0;
  const detailSections: OccupationDetailSectionNavItem[] = [
    { id: "oversikt", label: "Oversikt" },
    ...(hasEstimate ? [{ id: "lonnsutregning", label: "Lønnsutregning" }] : []),
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
                  {detailPage.label} lønn
                </h1>
                <div className="hidden shrink-0 rounded-2xl border border-black/10 bg-white/70 p-3 shadow-[0_10px_30px_rgba(27,36,48,0.08)] sm:flex">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#f4efe6_0%,#e6f0ea_100%)] text-[var(--primary-strong)]"
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
                <span>Viser </span>
                <InlineDefinitionModal
                  description="Dette er lønnsmålet som brukes i SSB-tabellen for denne siden."
                  label={series.measureLabel.toLowerCase()}
                  title="Gjennomsnittlig avtalt månedslønn (kr)"
                />
                <span>
                  {" "}
                  for {detailPage.label.toLowerCase()}. Tallene viser bruttolønn før skatt, og
                  inkluderer ikke overtid eller bonus. {detailPage.summary}
                </span>
              </div>
            </div>
            {purchasingPower ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <MetricStat
                    label="Lønnsvekst"
                    description={`Lønnsvekst viser hvor mye den gjennomsnittlige avtalte månedslønnen i yrket har endret seg fra ${purchasingPower.previousPeriodLabel.toLowerCase()} til ${purchasingPower.latestPeriodLabel.toLowerCase()}. Tallet er hentet fra SSB tabell 11658 og sammenligner samme kvartal i to påfølgende år, altså en 12-månedersendring.`}
                    value={`${purchasingPower.salaryGrowth.toLocaleString("nb-NO", {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    })} %`}
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
                  <MetricStat
                    label="Kvinner"
                    leadingSymbol="♀"
                    description={`Kvinner viser gjennomsnittlig avtalt månedslønn i kroner for kvinner i dette yrket. Tallet er hentet fra SSB tabell 11658 og gjelder siste tilgjengelige periode, ${latestSalaryPoint?.periodLabel?.toLowerCase() ?? "ukjent periode"}. Dette er et gjennomsnitt for registrerte kvinner i yrket, ikke et anslag for en enkeltperson.`}
                    value={formatSalaryMetric(latestSalaryPoint?.valueWomen)}
                    caption={formatAnnualSalaryCaption(latestSalaryPoint?.valueWomen)}
                  />
                  <MetricStat
                    label="Menn"
                    leadingSymbol="♂"
                    description={`Menn viser gjennomsnittlig avtalt månedslønn i kroner for menn i dette yrket. Tallet er hentet fra SSB tabell 11658 og gjelder siste tilgjengelige periode, ${latestSalaryPoint?.periodLabel?.toLowerCase() ?? "ukjent periode"}. Dette er et gjennomsnitt for registrerte menn i yrket, ikke et anslag for en enkeltperson.`}
                    value={formatSalaryMetric(latestSalaryPoint?.valueMen)}
                    caption={formatAnnualSalaryCaption(latestSalaryPoint?.valueMen)}
                  />
                  {employment ? (
                    <MetricStat
                      label="Sysselsatte"
                      description={`Sysselsatte viser hvor mange personer som i gjennomsnitt var sysselsatt i dette yrket i ${employment.periodLabel}. Tallet er hentet fra SSBs arbeidskraftundersøkelse i tabell ${SSB_OCCUPATION_EMPLOYMENT_TABLE_ID}. Verdien vises som antall personer, og tabellen dekker bare yrker med minst 5 000 sysselsatte.`}
                      value={formatEmploymentMetric(employment.value, employment.unit)}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
            {distribution ? <OccupationSalaryDistributionSection distribution={distribution} /> : null}
          </div>
        </section>

        {hasEstimate ? (
          <section
            aria-label="Lønnsutregning"
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
        {hasRelatedRows ? (
          <section
            aria-label="Relaterte yrker"
            className={sectionAnchorClassName}
            id="relaterte-yrker"
          >
            <RelatedOccupationSalaryComparison
              currentOccupationLabel={detailPage.label}
              currentSalary={currentSalary}
              currentSalaryWomen={currentSalaryWomen}
              currentSalaryMen={currentSalaryMen}
              periodLabel={overview.periodLabel}
              rows={relatedRows}
            />
          </section>
        ) : null}
        <section
          aria-label="Lønnsutvikling"
          className={sectionAnchorClassName}
          id="lonnsutvikling"
        >
          <OccupationSalaryTimeSeriesChart series={series} />
        </section>
        {hasPurchasingPowerSeries ? (
          <section aria-label="Kjøpekraft" className={sectionAnchorClassName} id="kjopekraft">
            <OccupationPurchasingPowerTimeSeriesChart series={purchasingPowerSeries} />
          </section>
        ) : null}
        {laborMarketStats ? (
          <section
            className={`${sectionAnchorClassName} rounded-3xl border border-black/10 bg-white/70 px-6 py-6 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-8`}
            id="arbeidsmarked"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Arbeidsmarked
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  SSB-tall for sysselsetting i yrket
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-700">
                  Denne seksjonen viser utvikling i sysselsetting, fordeling mellom kvinner og menn,
                  vekst i antall sysselsatte og ansettelsesform for {detailPage.label.toLowerCase()}.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                <LaborMarketCard
                  title="Sysselsatte over tid"
                  subtitle={laborMarketStats.latest?.periodLabel}
                >
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                    {laborMarketStats.latest
                      ? formatEmploymentMetric(
                          laborMarketStats.latest.value,
                          laborMarketStats.latest.unit,
                        )
                      : ":"}
                  </p>
                  <EmploymentSparkline points={laborMarketStats.points} />
                </LaborMarketCard>

                <LaborMarketCard
                  title="Kjønnsfordeling i yrket"
                  subtitle={laborMarketStats.genderBreakdown?.periodLabel}
                >
                  {laborMarketStats.genderBreakdown ? (
                    <div className="space-y-3">
                      <SplitRow
                        label="Kvinner"
                        value={`${formatEmploymentCount(laborMarketStats.genderBreakdown.women)}`}
                        detail={`${formatPercentage(laborMarketStats.genderBreakdown.womenShare)}`}
                      />
                      <SplitRow
                        label="Menn"
                        value={`${formatEmploymentCount(laborMarketStats.genderBreakdown.men)}`}
                        detail={`${formatPercentage(laborMarketStats.genderBreakdown.menShare)}`}
                      />
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-slate-700">Ingen kjønnsfordeling tilgjengelig.</p>
                  )}
                </LaborMarketCard>

                <LaborMarketCard
                  title="Vekst i sysselsatte"
                  subtitle={laborMarketStats.growth?.latestPeriodLabel}
                >
                  {laborMarketStats.growth ? (
                    <div className="space-y-3">
                      <SplitRow
                        label="Siste år"
                        value={formatPercentage(laborMarketStats.growth.yearOverYearChange)}
                        detail={
                          laborMarketStats.growth.previousValue !== undefined
                            ? `${formatEmploymentCount(laborMarketStats.growth.previousValue)} til ${formatEmploymentCount(laborMarketStats.growth.latestValue)}`
                            : undefined
                        }
                      />
                      <SplitRow
                        label="Siden 2021"
                        value={formatPercentage(laborMarketStats.growth.changeSinceBaseline)}
                        detail={
                          laborMarketStats.growth.baselineValue !== undefined
                            ? `${formatEmploymentCount(laborMarketStats.growth.baselineValue)} til ${formatEmploymentCount(laborMarketStats.growth.latestValue)}`
                            : undefined
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-slate-700">Ingen veksttall tilgjengelig.</p>
                  )}
                </LaborMarketCard>

                <LaborMarketCard
                  title="Ansettelsesform"
                  subtitle={laborMarketStats.contractType?.periodLabel}
                >
                  {laborMarketStats.contractType ? (
                    <div className="space-y-3">
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
            </div>
          </section>
        ) : null}

        </div>
      </div>

      <section className="mx-auto mt-10 w-full max-w-5xl" id="datakilder">
        <div className="grid gap-6 rounded-2xl border border-black/8 bg-white/45 px-5 py-5 shadow-[0_8px_24px_rgba(27,36,48,0.03)] sm:px-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Ansvarsfraskrivelse
            </p>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Tallene på denne siden er ment som informasjon og sammenligningsgrunnlag. De viser
              gjennomsnittlig avtalt månedslønn for registrerte personer i yrket, og er ikke et
              konkret lønnstilbud eller en garanti for hva en enkelt person bør tjene.
            </p>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Faktorer som erfaring, ansiennitet, arbeidssted, sektor, ansvar, utdanning og lokale
              forhandlinger kan gi stor variasjon fra SSB-snittet.
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
              <li>SSB tabell {SSB_OCCUPATION_EMPLOYMENT_TABLE_ID}</li>
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
    <div className="rounded-2xl border border-black/10 bg-[#fcfaf6] p-5">
      <div className="mb-4 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {title}
        </p>
        {subtitle ? <p className="text-sm leading-6 text-slate-600">{subtitle}</p> : null}
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

type EmploymentSparklineProps = {
  points: Array<{ periodCode: string; periodLabel: string; total?: number }>;
};

function EmploymentSparkline({ points }: EmploymentSparklineProps) {
  const relevantPoints = points.filter((point) => point.total !== undefined).slice(-5);
  const maxValue = Math.max(...relevantPoints.map((point) => point.total ?? 0), 0);

  if (relevantPoints.length === 0 || maxValue === 0) {
    return null;
  }

  return (
    <div className="mt-5 grid grid-cols-5 gap-2">
      {relevantPoints.map((point) => {
        const height = Math.max(24, Math.round(((point.total ?? 0) / maxValue) * 84));

        return (
          <div key={point.periodCode} className="space-y-2">
            <div className="flex h-24 items-end rounded-xl bg-[#f2ecdf] px-2 pb-2">
              <div
                className="w-full rounded-md bg-[var(--primary)]"
                style={{ height }}
                title={`${point.periodLabel}: ${formatEmploymentCount(point.total)}`}
              />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium text-slate-700">{point.periodCode}</p>
              <p className="text-xs leading-5 text-[var(--muted)]">
                {formatEmploymentCount(point.total)}
              </p>
            </div>
          </div>
        );
      })}
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

function formatEmploymentMetric(value: number, unit: string) {
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

function formatEmploymentCount(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${(value * 1000).toLocaleString("nb-NO", {
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

function formatAnnualSalaryCaption(value?: number) {
  if (value === undefined) {
    return undefined;
  }

  return `Årslønn: ${(value * 12).toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}
