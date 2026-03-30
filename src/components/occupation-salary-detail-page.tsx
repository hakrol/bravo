import { notFound } from "next/navigation";
import { InlineDefinitionModal } from "@/components/inline-definition-modal";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationPurchasingPowerTimeSeriesChart } from "@/components/occupation-purchasing-power-time-series";
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
  getOccupationPurchasingPowerDetail,
  getOccupationPurchasingPowerTimeSeries,
  getOccupationSalaryTimeSeries,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";

type OccupationSalaryDetailPageProps = {
  occupationCode: string;
};

export async function OccupationSalaryDetailPage({
  occupationCode,
}: OccupationSalaryDetailPageProps) {
  const detailPage = getOccupationDetailPage(occupationCode);

  if (!detailPage) {
    notFound();
  }

  const relatedPages = getRelatedOccupationDetailPages(occupationCode);
  const comparisonOccupationCodes = [occupationCode, ...relatedPages.map((page) => page.occupationCode)];

  const [series, purchasingPower, purchasingPowerSeries, latestDataset] = await Promise.all([
    getOccupationSalaryTimeSeries(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
    getOccupationPurchasingPowerDetail(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
    getOccupationPurchasingPowerTimeSeries(occupationCode, OCCUPATION_MONTHLY_SALARY_FILTERS),
    getLatestSalaryDataset("occupationDetailed", OCCUPATION_MONTHLY_SALARY_FILTERS),
  ]);

  const overview = buildOccupationSalaryOverview(latestDataset, {
    occupationCodes: comparisonOccupationCodes,
  });
  const overviewRowsByCode = new Map(
    overview.rows.map((row) => [row.occupationCode, row] as const),
  );
  const latestSalaryPoint = series.points.at(-1);
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

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="border-b border-black/10 pb-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                {detailPage.label} lønn
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
                Viser{" "}
                <InlineDefinitionModal
                  description="Dette er lønnsmålet som brukes i SSB-tabellen for denne siden."
                  label={series.measureLabel.toLowerCase()}
                  title="Gjennomsnittlig avtalt månedslønn (kr)"
                />{" "}
                for {detailPage.label.toLowerCase()}. Tallene viser bruttolønn før skatt, og
                inkluderer ikke overtid eller bonus. {detailPage.summary}
              </p>
            </div>
            {purchasingPower ? (
              <div className="space-y-4">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
                  <MetricStat
                    label="Lønnsvekst"
                    description="Lønnsvekst viser hvor mye gjennomsnittlig månedslønn har økt fra samme kvartal året før til siste tilgjengelige kvartal."
                    value={`${purchasingPower.salaryGrowth.toLocaleString("nb-NO", {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    })} %`}
                  />
                  <MetricStat
                    label="Inflasjon"
                    description="Inflasjon viser prisveksten i samme 12-månedersperiode, basert på KPI fra SSB."
                    value={`${purchasingPower.inflationGrowth.toLocaleString("nb-NO", {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    })} %`}
                  />
                  <MetricStat
                    label={purchasingPower.realGrowth >= 0 ? "Reallønnsvekst" : "Reallønnsfall"}
                    description="Reallønn viser forskjellen mellom lønnsvekst og inflasjon. Positiv verdi betyr at lønnen har økt mer enn prisene."
                    value={`${purchasingPower.realGrowth.toLocaleString("nb-NO", {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    })} %`}
                    tone={purchasingPower.realGrowth >= 0 ? "positive" : "negative"}
                  />
                  <MetricStat
                    label="Kvinner"
                    leadingSymbol="♀"
                    value={formatSalaryMetric(latestSalaryPoint?.valueWomen)}
                  />
                  <MetricStat
                    label="Menn"
                    leadingSymbol="♂"
                    value={formatSalaryMetric(latestSalaryPoint?.valueMen)}
                  />
                </div>
                <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
                  Tallene viser utviklingen fra{" "}
                  {purchasingPower.previousPeriodLabel.toLowerCase()} til{" "}
                  {purchasingPower.latestPeriodLabel.toLowerCase()}, altså de siste 12 månedene.
                </p>
              </div>
            ) : null}
            {detailPage.salaryDistribution ? (
              <OccupationSalaryDistributionSection distribution={detailPage.salaryDistribution} />
            ) : null}
          </div>
        </section>

        <RelatedOccupationSalaryComparison
          currentOccupationLabel={detailPage.label}
          currentSalary={currentSalary}
          currentSalaryWomen={currentSalaryWomen}
          currentSalaryMen={currentSalaryMen}
          periodLabel={overview.periodLabel}
          rows={relatedRows}
        />
        <OccupationSalaryTimeSeriesChart series={series} />
        <OccupationPurchasingPowerTimeSeriesChart series={purchasingPowerSeries} />
      </div>
    </main>
  );
}

type MetricStatProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  leadingSymbol?: string;
  description?: string;
};

function MetricStat({
  label,
  value,
  tone = "default",
  leadingSymbol,
  description,
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
    <div>
      <div className="flex items-center gap-2">
        {leadingSymbol ? (
          <span
            aria-hidden="true"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f4efe6] text-sm text-[var(--primary-strong)]"
          >
            {leadingSymbol}
          </span>
        ) : null}
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        {description ? <MetricInfoButton description={description} label={label} /> : null}
      </div>
      <p className={`mt-2 flex items-center gap-2 text-3xl font-semibold tracking-[-0.04em] ${valueClasses}`}>
        {trendSymbol ? <span aria-hidden="true" className="text-2xl leading-none">{trendSymbol}</span> : null}
        <span>{value}</span>
      </p>
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
