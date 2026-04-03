import Link from "next/link";
import { MetricInfoButton } from "@/components/metric-info-button";
import {
  OccupationDetailSectionNav,
  type OccupationDetailSectionNavItem,
} from "@/components/occupation-detail-section-nav";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import { buildEstimatedHourlySalaryTimeSeries, getLatestPointWithValues, STANDARD_HOURS_PER_YEAR } from "@/lib/hourly-salary";
import type { HourlySalaryPage } from "@/lib/hourly-salary-pages";
import { getOccupationSalaryTimeSeries, OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS } from "@/lib/ssb";

type OccupationHourlySalaryPageProps = {
  page: HourlySalaryPage;
};

const sectionAnchorClassName = "scroll-mt-32";

export async function OccupationHourlySalaryPage({
  page,
}: OccupationHourlySalaryPageProps) {
  const monthlySalarySeries = await getOccupationSalaryTimeSeries(
    page.occupationCode,
    OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
  );
  const hourlySalarySeries = buildEstimatedHourlySalaryTimeSeries(monthlySalarySeries);
  const latestHourlyPoint = getLatestPointWithValues(hourlySalarySeries.points);
  const latestMonthlyPoint = getLatestPointWithValues(monthlySalarySeries.points);
  const updatedLabel = formatUpdatedLabel(hourlySalarySeries.updated);
  const detailSections: OccupationDetailSectionNavItem[] = [
    { id: "oversikt", label: "Oversikt" },
    { id: "utvikling", label: "Utvikling" },
    { id: "metode", label: "Metode" },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-3 rounded-md border border-black/10 bg-[linear-gradient(135deg,rgba(244,239,230,0.72)_0%,rgba(230,240,234,0.78)_100%)] px-3 py-3 shadow-[0_10px_24px_rgba(27,36,48,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Timelønn
              </p>
              <p className="mt-1 text-sm font-semibold leading-5 text-slate-950">
                {page.titleOccupationLabel}
              </p>
            </div>
            <OccupationDetailSectionNav sections={detailSections} variant="desktop" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          <OccupationDetailSectionNav
            className="lg:hidden"
            sections={detailSections}
            variant="mobile"
          />

          <section className={`${sectionAnchorClassName} pb-6`} id="oversikt">
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-6">
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                    {page.title}
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
                          d="M4.5 18.5h15M7.5 14.5V9.5M12 14.5V6.5M16.5 14.5v-3"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M5.5 7.5h13M8.5 5v5M15.5 5v5"
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
                  <p>{page.intro}</p>
                  <p className="mt-3">
                    Timelønnen er estimert fra median avtalt månedslønn og viser et standardisert
                    nivå per time i 100 % stilling. Dette er nyttig for sammenligning, men ikke det
                    samme som faktisk utbetalt timefortjeneste i en konkret jobb.
                  </p>
                </div>

                {latestHourlyPoint ? (
                  <div className="rounded-md border border-[var(--primary)]/20 bg-[linear-gradient(135deg,rgba(244,239,230,0.72)_0%,rgba(230,240,234,0.78)_100%)] px-5 py-5 shadow-[0_12px_36px_rgba(27,36,48,0.06)] sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                      Kort oppsummert
                    </p>
                    <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-950">
                      {buildTopSummary(page.titleOccupationLabel, latestHourlyPoint)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                      <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5">
                        Kilde: SSB tabell 11658
                      </span>
                      <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5">
                        Grunnlag: median avtalt månedslønn
                      </span>
                      <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5">
                        Formel: månedslønn × 12 / {STANDARD_HOURS_PER_YEAR}
                      </span>
                      {updatedLabel ? (
                        <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5">
                          Oppdatert hos SSB: {updatedLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <HourlyMetricCard
                  caption={
                    latestMonthlyPoint?.valueAll !== undefined
                      ? `Månedslønn: ${formatMonthlyValue(latestMonthlyPoint.valueAll)}`
                      : undefined
                  }
                  description="Estimert timelønn for begge kjønn er beregnet fra median avtalt månedslønn i siste tilgjengelige kvartal."
                  label="Begge kjønn"
                  value={formatHourlyValue(latestHourlyPoint?.valueAll)}
                />
                <HourlyMetricCard
                  caption={
                    latestMonthlyPoint?.valueWomen !== undefined
                      ? `Månedslønn: ${formatMonthlyValue(latestMonthlyPoint.valueWomen)}`
                      : undefined
                  }
                  description="Estimert timelønn for kvinner er beregnet fra median avtalt månedslønn for kvinner i yrket."
                  label="Kvinner"
                  value={formatHourlyValue(latestHourlyPoint?.valueWomen)}
                />
                <HourlyMetricCard
                  caption={
                    latestMonthlyPoint?.valueMen !== undefined
                      ? `Månedslønn: ${formatMonthlyValue(latestMonthlyPoint.valueMen)}`
                      : undefined
                  }
                  description="Estimert timelønn for menn er beregnet fra median avtalt månedslønn for menn i yrket."
                  label="Menn"
                  value={formatHourlyValue(latestHourlyPoint?.valueMen)}
                />
                <HourlyMetricCard
                  caption="Forskjellen er avrundet til hele kroner per time."
                  description="Viser forskjellen mellom estimert timelønn for menn og kvinner i siste tilgjengelige periode."
                  label="Forskjell"
                  tone={getGapTone(latestHourlyPoint?.valueWomen, latestHourlyPoint?.valueMen)}
                  value={formatHourlyGap(latestHourlyPoint?.valueWomen, latestHourlyPoint?.valueMen)}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  href={page.detailHref}
                >
                  Se full lønnsside for elektrikere
                </Link>
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700">
                  Viser første pilot for håndverksyrker
                </span>
              </div>
            </div>
          </section>

          <section className={sectionAnchorClassName} id="utvikling">
            <OccupationSalaryTimeSeriesChart
              ariaLabel={`Utvikling i estimert timelønn for ${page.titleOccupationLabel}`}
              description={`Grafen viser estimert timelønn for ${page.titleOccupationLabel} over tid. Serien er beregnet fra median avtalt månedslønn i SSB og viser begge kjønn, kvinner og menn per kvartal.`}
              latestDataDescription={`Her ser du siste estimerte timelønn for kvinner og menn. Tallene gjelder ${latestHourlyPoint ? formatPeriodLabel(latestHourlyPoint.periodLabel).toLowerCase() : "siste tilgjengelige periode"} og er beregnet fra median avtalt månedslønn i SSB tabell 11658.`}
              series={hourlySalarySeries}
              title={`Utvikling i timelønn for ${page.titleOccupationLabel}`}
              valueDisplay="hourly"
            />
          </section>

          <section
            className={`${sectionAnchorClassName} rounded-md border border-black/10 bg-white/75 px-6 py-6 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-8`}
            id="metode"
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Metode
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Slik beregner vi timelønn
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-700">
                  Siden bruker samme beregningsgrunnlag som detaljsiden: median avtalt månedslønn
                  fra SSB. Deretter regner vi om til et standardisert estimat per time i full stilling.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                <div className="rounded-md border border-slate-200 bg-[#f7fafc] px-5 py-5">
                  <div className="space-y-4 text-sm leading-7 text-slate-700">
                    <p>
                      Vi bruker median avtalt månedslønn for elektrikere per kvartal, fordelt på
                      begge kjønn, kvinner og menn. Dette er samme lønnsnivå som allerede brukes på
                      detaljsiden for yrket.
                    </p>
                    <p>
                      For å gjøre tallene lettere å sammenligne per time, regner vi om månedslønn til
                      timelønn med et standard årsverk på {STANDARD_HOURS_PER_YEAR.toLocaleString("nb-NO")} timer.
                    </p>
                    <p>
                      Estimatet inkluderer ikke overtid, bonus, tillegg eller lokale avtaler. Det er
                      derfor best egnet som sammenligningsgrunnlag, ikke som et eksakt lønnsløfte.
                    </p>
                  </div>
                </div>

                <div className="rounded-md border border-black/10 bg-[linear-gradient(135deg,rgba(244,239,230,0.72)_0%,rgba(230,240,234,0.78)_100%)] px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                    Formel
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    månedslønn × 12 / {STANDARD_HOURS_PER_YEAR}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    Hvis median månedslønn er 52 100 kr, blir estimert timelønn omtrent 321 kr per
                    time.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type HourlyMetricCardProps = {
  label: string;
  value: string;
  description: string;
  caption?: string;
  tone?: "default" | "positive" | "negative";
};

function HourlyMetricCard({
  label,
  value,
  description,
  caption,
  tone = "default",
}: HourlyMetricCardProps) {
  const valueClasses =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <div className="min-w-0 rounded-md border border-black/10 bg-white/70 px-5 py-5 shadow-[0_12px_32px_rgba(27,36,48,0.05)]">
      <div className="flex min-w-0 items-start gap-2">
        <p className="min-w-0 text-sm uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        <MetricInfoButton description={description} label={label} />
      </div>
      <p className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${valueClasses}`}>{value}</p>
      {caption ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{caption}</p> : null}
    </div>
  );
}

function formatHourlyValue(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${Math.round(value).toLocaleString("nb-NO")} kr/time`;
}

function formatHourlyGap(women?: number, men?: number) {
  if (women === undefined || men === undefined) {
    return ":";
  }

  const difference = Math.round(men - women);
  const prefix = difference > 0 ? "+" : "";
  return `${prefix}${difference.toLocaleString("nb-NO")} kr/time`;
}

function formatMonthlyValue(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
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

function formatPeriodLabel(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const compactQuarterMatch = normalized.match(/^(\d{4})K([1-4])$/i);
  const spacedQuarterMatch = normalized.match(/^(\d{4})\s*K([1-4])$/i);
  const longQuarterMatch = normalized.match(/^([1-4])\.\s*kvartal\s*(\d{4})$/i);

  if (compactQuarterMatch) {
    return `${compactQuarterMatch[2]}. kvartal ${compactQuarterMatch[1]}`;
  }

  if (spacedQuarterMatch) {
    return `${spacedQuarterMatch[2]}. kvartal ${spacedQuarterMatch[1]}`;
  }

  if (longQuarterMatch) {
    return `${longQuarterMatch[1]}. kvartal ${longQuarterMatch[2]}`;
  }

  return normalized;
}

function buildTopSummary(
  occupationLabel: string,
  latestPoint: {
    periodLabel: string;
    valueAll?: number;
    valueWomen?: number;
    valueMen?: number;
  },
) {
  const periodText = formatPeriodLabel(latestPoint.periodLabel).toLowerCase();
  const summaryParts = [
    latestPoint.valueAll !== undefined
      ? `Estimert timelønn for ${occupationLabel} er ${formatHourlyValue(latestPoint.valueAll)} i ${periodText}`
      : null,
    latestPoint.valueWomen !== undefined
      ? `kvinner: ${formatHourlyValue(latestPoint.valueWomen)}`
      : null,
    latestPoint.valueMen !== undefined
      ? `menn: ${formatHourlyValue(latestPoint.valueMen)}`
      : null,
  ].filter((part): part is string => Boolean(part));

  if (summaryParts.length === 0) {
    return "Vi mangler nok data til å beregne timelønn i siste periode.";
  }

  const [firstPart, ...rest] = summaryParts;

  if (rest.length === 0) {
    return `${firstPart}.`;
  }

  return `${firstPart}, med ${rest.join(" og ")}.`;
}

function getGapTone(women?: number, men?: number) {
  if (women === undefined || men === undefined || women === men) {
    return "default";
  }

  return men > women ? "negative" : "positive";
}
