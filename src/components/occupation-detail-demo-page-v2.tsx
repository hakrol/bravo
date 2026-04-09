import Link from "next/link";
import Image from "next/image";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { MetricInfoButton } from "@/components/metric-info-button";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import type { OccupationDetailViewModel } from "@/lib/occupation-detail-view-models";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";

type OccupationDetailDemoPageProps = {
  detail: OccupationDetailViewModel;
};

export function OccupationDetailDemoPageV2({ detail }: OccupationDetailDemoPageProps) {
  const occupationLabel = formatOccupationDisplayLabel(detail.detailPage.label);
  const distribution = detail.data.distribution;
  const laborMarket = detail.data.laborMarketStats;
  const purchasingPower = detail.data.trendData.purchasingPower;
  const medianGrowthMetrics = buildMedianGrowthMetrics(detail.data.medianBasicSalarySeries);
  const updatedLabel = formatDate(
    distribution?.updated ??
      detail.data.medianBasicSalarySeries.updated ??
      laborMarket?.updated,
  );
  const intro =
    detail.occupationDescription?.intro ??
    `${occupationLabel} er en yrkesgruppe i SSBs yrkesstatistikk.`;
  const topSummary = buildTopSummary({
    occupationLabel,
    periodLabel: distribution?.periodLabel,
    womenMedian: distribution?.women?.median,
    menMedian: distribution?.men?.median,
    womenP25: distribution?.women?.p25,
    womenP75: distribution?.women?.p75,
    menP25: distribution?.men?.p25,
    menP75: distribution?.men?.p75,
  });

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="px-5 pb-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-b-[8px] border-b border-l border-r border-black bg-[#0f2f22] px-8 py-8 shadow-[0_24px_60px_rgba(15,47,34,0.14)] sm:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
                Lønn til {occupationLabel.toLowerCase()}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-emerald-50">
                {buildHeroIntro(occupationLabel, intro)} Her får du et bilde av lønnen til
                elektrikere basert på tall fra Statistisk sentralbyrå.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div className="inline-flex min-w-[220px] items-start justify-between gap-4 rounded-md border border-black bg-white px-6 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1 text-3xl leading-none ${
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
                    className={`whitespace-nowrap text-5xl font-semibold tracking-[-0.04em] ${
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
                      ? `Lønnsvekst siste 12 måneder viser endringen i median avtalt månedslønn for begge kjønn fra ${medianGrowthMetrics.previousPeriodLabel.toLowerCase()} til ${medianGrowthMetrics.latestPeriodLabel.toLowerCase()}.`
                      : "Lønnsvekst siste 12 måneder viser endringen i median avtalt månedslønn for begge kjønn sammenlignet med samme kvartal året før."
                  }
                  label="Lønnsvekst siste 12 måneder"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            {topSummary ? (
              <section className="rounded-md border border-black bg-[linear-gradient(135deg,rgba(244,239,230,0.72)_0%,rgba(230,240,234,0.78)_100%)] px-5 py-5 shadow-sm sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Kort oppsummert
                </p>
                <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-950">
                  {topSummary}
                </p>
              </section>
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KeyMetric
                icon={<MetricAvatar tone="women" />}
                caption={distribution?.periodLabel}
                description={`Median avtalt månedslønn for kvinnelige ${occupationLabel.toLowerCase()}. Tallet viser lønnen som ligger midt i fordelingen og er hentet fra siste tilgjengelige SSB-periode.`}
                label="Månedslønn"
                value={formatKr(distribution?.women?.median)}
              />
              <KeyMetric
                icon={<MetricAvatar tone="men" />}
                caption={distribution?.periodLabel}
                description={`Median avtalt månedslønn for mannlige ${occupationLabel.toLowerCase()}. Tallet viser lønnen som ligger midt i fordelingen og er hentet fra siste tilgjengelige SSB-periode.`}
                label="Månedslønn"
                value={formatKr(distribution?.men?.median)}
              />
              <KeyMetric
                caption={`${purchasingPower?.previousPeriodLabel ?? "Forrige periode"} til ${purchasingPower?.latestPeriodLabel ?? "siste periode"}`}
                description={`Reallønnsvekst viser lønnsutviklingen justert for prisvekst. Tallet bygger på lønnsvekst for ${occupationLabel.toLowerCase()} sammenlignet med inflasjon i samme periode.`}
                label="Reallønnsvekst"
                tone={
                  purchasingPower?.realGrowth === undefined
                    ? "default"
                    : purchasingPower.realGrowth >= 0
                      ? "positive"
                      : "negative"
                }
                value={formatPercent(purchasingPower?.realGrowth)}
              />
            </section>

            {distribution ? (
              <section className="space-y-4">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Lønnsfordeling blant elektrikere
                  </h2>
                  <p className="text-lg leading-8 text-slate-800">
                    Her ser du hvordan lønnen typisk fordeler seg blant elektrikere. Midtpunktet
                    viser hva som er vanlig lønn, mens punktene på hver side gir deg et enkelt
                    bilde av hvor mange ligger lavere og hvor mange ligger høyere. Det gjør det
                    lettere å forstå om en lønn er lav, vanlig eller ganske sterk i yrket.
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
                  Lønnsutvikling for elektrikere
                </h2>
                <p className="text-lg leading-8 text-slate-800">
                  Her kan du se hvordan lønnen til elektrikere har utviklet seg over tid. Grafen
                  gjør det enkelt å sammenligne nivået for kvinner og menn, og gir et tydelig
                  bilde av hvordan lønnen har beveget seg fra år til år.
                </p>
              </div>
              <div className="rounded-md border border-black bg-white p-5 shadow-sm sm:p-6">
                <OccupationSalaryTimeSeriesChart
                  description={`Se utviklingen i månedslønn for ${occupationLabel.toLowerCase()} per kvartal. Grafen viser median avtalt månedslønn for begge kjønn, kvinner og menn basert på tilgjengelige tall fra SSB.`}
                  series={detail.data.medianBasicSalarySeries}
                  variant="classic-emphasis"
                  title={`Utvikling i månedslønn for ${occupationLabel}`}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-md border border-black bg-white p-5 shadow-sm">
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Dataene på denne siden kommer fra Statistisk sentralbyrå (SSB), og tallene er
                sist oppdatert {updatedLabel ?? "i siste tilgjengelige publisering"}.
              </p>
              <Link
                className="mt-4 inline-flex rounded-md border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-strong)] transition hover:bg-[var(--primary)] hover:text-white"
                href={detail.detailPage.href}
              >
                Se dagens side
              </Link>
            </section>

            {BLOG_DEMO_LINKS.length > 0 ? (
              <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Fra bloggen
                </p>
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
  icon?: React.ReactNode;
  tone?: "default" | "positive" | "negative";
};

const BLOG_DEMO_LINKS = [
  {
    href: "/blogg/hvordan-be-om-mer-lonn",
    title: "Hvordan be om mer lønn",
  },
  {
    href: "/blogg/hvor-hoy-lonn-skal-du-ha",
    title: "Hvor høy lønn skal du ha",
  },
  {
    href: "/blogg/hva-avgjor-lonnsnivaet-ditt-i-et-yrke",
    title: "Hva avgjør lønnsnivået ditt i et yrke?",
  },
];

function KeyMetric({
  label,
  value,
  caption,
  description,
  icon,
  tone = "default",
}: KeyMetricProps) {
  const valueClassName =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <article className="rounded-md border border-black bg-white p-5 shadow-sm">
      <div className="flex items-start gap-2">
        {icon ? <div className="mr-1 shrink-0">{icon}</div> : null}
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        {description ? <MetricInfoButton description={description} label={label} /> : null}
      </div>
      <p className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${valueClassName}`}>{value}</p>
      {caption ? <p className="mt-2 text-sm text-slate-500">{caption}</p> : null}
    </article>
  );
}

function MetricAvatar({ tone }: { tone: "women" | "men" }) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-md border border-black/10 bg-white"
    >
      <Image
        alt=""
        className="h-9 w-9 object-cover"
        height={36}
        priority={false}
        src={tone === "women" ? "/images/woman.png" : "/images/men.png"}
        width={36}
      />
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

function formatQuarterCodeLabel(value: string) {
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
  occupationLabel,
  periodLabel,
  womenMedian,
  menMedian,
  womenP25,
  womenP75,
  menP25,
  menP75,
}: {
  occupationLabel: string;
  periodLabel?: string;
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
      ? `Median lønn for ${occupationLabel.toLowerCase()} i Norge er ${formatKr(womenMedian)} for kvinner og ${formatKr(menMedian)} for menn.`
      : womenMedian !== undefined
        ? `Median lønn for kvinner i ${occupationLabel.toLowerCase()} i Norge er ${formatKr(womenMedian)}.`
        : `Median lønn for menn i ${occupationLabel.toLowerCase()} i Norge er ${formatKr(menMedian)}.`;

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

function formatSalaryRangeText(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return null;
  }

  return `${formatKr(min)} og ${formatKr(max)}`;
}
