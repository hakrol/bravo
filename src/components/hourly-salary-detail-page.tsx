import Link from "next/link";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import type { HourlySalaryPage } from "@/lib/hourly-salary-pages";
import type {
  OccupationSalaryDistribution,
  OccupationSalaryTimeSeriesPoint,
  OccupationSalaryTimeSeries,
} from "@/lib/ssb";

type HourlySalaryFaqItem = {
  question: string;
  answer: string;
};

type HourlySalaryDetailPageProps = {
  page: HourlySalaryPage;
  hourlySeries: OccupationSalaryTimeSeries;
  hourlyDistribution?: OccupationSalaryDistribution | null;
  latestHourlyPoint: OccupationSalaryTimeSeriesPoint | null;
  latestMonthlyPoint: OccupationSalaryTimeSeriesPoint | null;
  summaryText?: string | null;
  sourceNote?: string | null;
  faqItems: HourlySalaryFaqItem[];
};

export function HourlySalaryDetailPage({
  page,
  hourlySeries,
  hourlyDistribution,
  latestHourlyPoint,
  latestMonthlyPoint,
  summaryText,
  sourceNote,
  faqItems,
}: HourlySalaryDetailPageProps) {
  const hasHourlyValues = Boolean(
    latestHourlyPoint?.valueWomen !== undefined ||
      latestHourlyPoint?.valueMen !== undefined,
  );
  const hasDistribution = Boolean(hourlyDistribution?.women || hourlyDistribution?.men);

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="space-y-4">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {page.title}
          </h1>
          {summaryText ? (
            <p className="max-w-5xl text-base leading-8 text-slate-700 sm:text-lg">{summaryText}</p>
          ) : null}
          {sourceNote ? (
            <p className="max-w-5xl text-sm leading-7 text-slate-600">{sourceNote}</p>
          ) : null}
          <div>
            <Link
              className="inline-flex items-center gap-3 rounded-[5px] border border-[var(--border)] bg-white px-5 py-3 text-base font-medium text-slate-900 shadow-sm transition hover:border-[var(--primary)]/35 hover:bg-[#fcfaf6]"
              href={page.detailHref}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-slate-900"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  d="M6 14L14 6M8 6H14V12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
              <span>Utforsk lønn til {page.titleOccupationLabel}</span>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <MetricCard
            label="Kvinner"
            hourlyValue={latestHourlyPoint?.valueWomen}
            monthlyValue={latestMonthlyPoint?.valueWomen}
          />
          <MetricCard
            label="Menn"
            hourlyValue={latestHourlyPoint?.valueMen}
            monthlyValue={latestMonthlyPoint?.valueMen}
          />
        </section>

        {hourlyDistribution ? (
          <section className="rounded-[5px] border border-[var(--border)] bg-white px-6 py-7 shadow-sm sm:px-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                Lønnsspredning
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Hvor i timeslønnsspennet de fleste ligger
              </h2>
              <p className="max-w-4xl text-sm leading-7 text-slate-700">
                Ikke alle som jobber som {page.titleOccupationLabel} ligger på samme nivå. Figuren under viser hvordan timelønnen
                fordeler seg i yrket, med medianen i midten og spennene rundt som viser hvor mange som ligger litt lavere eller
                høyere.
              </p>
            </div>
            <div className="mt-5">
              <OccupationSalaryDistributionSection distribution={hourlyDistribution} scaleMode="focusBand" />
            </div>
          </section>
        ) : null}

        {hasHourlyValues ? (
          <OccupationSalaryTimeSeriesChart
            containerClassName="rounded-[5px]"
            description={`Se utviklingen i estimert timelønn for ${page.titleOccupationLabel} per kvartal. Grafen bygger på median avtalt månedslønn fra SSB og viser utviklingen for kvinner og menn der data finnes.`}
            latestDataDescription={`Her ser du siste estimerte timelønn for ${page.titleOccupationLabel}. Tallene er regnet ut fra median avtalt månedslønn i SSB og fordelt på kvinner og menn der det finnes data.`}
            series={hourlySeries}
            title={`Utvikling i timelønn for ${page.titleOccupationLabel}`}
            valueDisplay="hourly"
          />
        ) : null}

        <section className="rounded-[5px] border border-[var(--border)] bg-white px-6 py-7 shadow-sm sm:px-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Vanlige spørsmål om timeslønn</h2>
          <div className="mt-6 space-y-6">
            {faqItems.map((item) => (
              <FaqItem key={item.question} answer={item.answer} question={item.question} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  hourlyValue,
  monthlyValue,
}: {
  label: string;
  hourlyValue?: number;
  monthlyValue?: number;
}) {
  const annualValue = monthlyValue !== undefined ? monthlyValue * 12 : undefined;

  return (
    <article className="rounded-[5px] border border-[var(--border)] bg-white px-6 py-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
        {formatHourlyValue(hourlyValue)}
      </p>
      <div className="mt-3 space-y-1 text-sm text-slate-700">
        <p>Tilsvarer ca. {formatMonthlyValue(monthlyValue)} per måned</p>
        <p>Tilsvarer ca. {formatAnnualValue(annualValue)} per år</p>
      </div>
    </article>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-slate-950">{question}</h3>
      <p className="max-w-4xl text-sm leading-7 text-slate-700">{answer}</p>
    </div>
  );
}

function formatHourlyValue(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${Math.round(value).toLocaleString("nb-NO")} kr/time`;
}

function formatMonthlyValue(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
}

function formatAnnualValue(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
}
