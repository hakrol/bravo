import Link from "next/link";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import type { OccupationDetailViewModel } from "@/lib/occupation-detail-view-models";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";

type OccupationDetailDemoPageProps = {
  detail: OccupationDetailViewModel;
};

export function OccupationDetailDemoPage({ detail }: OccupationDetailDemoPageProps) {
  const occupationLabel = formatOccupationDisplayLabel(detail.detailPage.label);
  const distribution = detail.data.distribution;
  const laborMarket = detail.data.laborMarketStats;
  const updatedLabel = formatDate(
    distribution?.updated ??
      detail.data.medianBasicSalarySeries.updated ??
      laborMarket?.updated,
  );
  const womenShare = laborMarket?.genderBreakdown?.womenShare;
  const intro =
    detail.occupationDescription?.intro ??
    `${occupationLabel} er en yrkesgruppe i SSBs yrkesstatistikk.`;

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="border-b border-black bg-[#0f2f22] px-5 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-4xl space-y-6">
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
                Lønn til {occupationLabel.toLowerCase()}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-emerald-50">
                {intro} Her får du et rolig og oversiktlig bilde av lønnsnivået, lønnsspennet
                og utviklingen over tid, basert på registrerte tall fra Statistisk sentralbyrå.
                Målet er å gjøre det enklere å forstå hva som er vanlig lønn i yrket, og hva
                som har endret seg i den siste perioden.
              </p>
            </div>
          </div>

          <aside className="rounded-md border border-black bg-white p-5 text-slate-950 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
              Oversikt
            </p>
            <p className="mt-3 text-5xl font-semibold tracking-[-0.04em]">
              {formatKr(distribution?.total?.median)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Avtalt m\u00e5nedsl\u00f8nn f\u00f8r skatt. Tall fra SSB for{" "}
              {distribution?.periodLabel ?? "siste tilgjengelige periode"}.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="Kvinner" value={formatKr(distribution?.women?.median)} />
              <MiniStat label="Menn" value={formatKr(distribution?.men?.median)} />
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KeyMetric
                caption={distribution?.periodLabel}
                description={`Median avtalt månedslønn for kvinner i ${occupationLabel.toLowerCase()}. Tallet viser lønnen som ligger midt i fordelingen og er hentet fra siste tilgjengelige SSB-periode.`}
                label="Månedslønn"
                value={formatKr(distribution?.women?.median)}
              />
              <KeyMetric
                caption={distribution?.periodLabel}
                description={`Median avtalt månedslønn for menn i ${occupationLabel.toLowerCase()}. Tallet viser lønnen som ligger midt i fordelingen og er hentet fra siste tilgjengelige SSB-periode.`}
                label="Månedslønn"
                value={formatKr(distribution?.men?.median)}
              />
              <KeyMetric
                caption={laborMarket?.latest?.periodLabel}
                label="Sysselsatte"
                value={formatNumber(laborMarket?.latest?.employees)}
              />
              <KeyMetric
                caption="Andel av yrket"
                label="Kvinner"
                value={formatPercent(womenShare)}
              />
            </section>

            {distribution ? (
              <section className="rounded-md border border-black bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 max-w-3xl space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                    Lønnsspenn
                  </p>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                    Hvor lønningene samler seg
                  </h2>
                  <p className="text-sm leading-7 text-slate-600">
                    Her testes en mer kompakt presentasjon av 25-persentil, median og
                    75-persentil for kvinner og menn.
                  </p>
                </div>
                <OccupationSalaryDistributionSection distribution={distribution} />
              </section>
            ) : null}

            <OccupationSalaryTimeSeriesChart
              containerClassName="rounded-md"
              description={`Median avtalt månedslønn for ${occupationLabel.toLowerCase()} per kvartal, fordelt på kvinner og menn.`}
              series={detail.data.medianBasicSalarySeries}
              title="Lønnsutvikling over tid"
            />
          </div>

          <aside className="space-y-6">
            <section className="rounded-md border border-black bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                Om demoen
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Dataene på denne siden er hentet fra Statistisk sentralbyrå og bygger på de
                samme strukturerte datasettmodellene som brukes i resten av løsningen. Her
                vises blant annet lønnsfordeling, median avtalt månedslønn og utvikling over
                tid for {occupationLabel.toLowerCase()}.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Tallene er sist oppdatert {updatedLabel ?? "i siste tilgjengelige publisering"}.
                Ved å vise både kildegrunnlag, oppdateringstidspunkt og flere perspektiver på
                lønn, blir siden mer etterprøvbar og lettere å stole på for brukere som vil
                sammenligne, forstå og ta bedre beslutninger.
              </p>
              <Link
                className="mt-4 inline-flex rounded-md border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-strong)] transition hover:bg-[var(--primary)] hover:text-white"
                href={detail.detailPage.href}
              >
                Se dagens side
              </Link>
            </section>

            {detail.data.relatedRows.length > 0 ? (
              <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Relaterte yrker
                </p>
                <div className="mt-4 space-y-3">
                  {detail.data.relatedRows.slice(0, 5).map((row) => (
                    <Link
                      className="block rounded-md border border-black/10 px-4 py-3 transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
                      href={row.href}
                      key={row.occupationCode}
                    >
                      <span className="block text-sm font-semibold text-slate-950">
                        {formatOccupationDisplayLabel(row.occupationLabel)}
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        Median: {formatKr(row.medianAll)}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

type KeyMetricProps = {
  label: string;
  value: string;
  caption?: string;
  description?: string;
};

function KeyMetric({ label, value, caption, description }: KeyMetricProps) {
  return (
    <article className="rounded-md border border-black bg-white p-5 shadow-sm">
      <div className="flex items-start gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        {description ? <MetricInfoButton description={description} label={label} /> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
      {caption ? <p className="mt-2 text-sm text-slate-500">{caption}</p> : null}
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black bg-[#f7fafc] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatKr(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

function formatPercent(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} %`;
}

function formatNumber(value?: number) {
  if (value === undefined) {
    return ":";
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
