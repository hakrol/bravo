import Link from "next/link";
import { MetricInfoButton } from "@/components/metric-info-button";
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
  faqItems: HourlySalaryFaqItem[];
};

const FEATURED_BLOG_POST = {
  href: "/blogg/hvordan-be-om-mer-lonn",
  title: "Hvordan be om mer lønn",
};

const BLOG_DEMO_LINKS = [
  {
    href: "/blogg/hvor-mye-mer-kan-man-be-om-i-lonn",
    title: "Hvor mye mer kan man be om i lønn?",
  },
  {
    href: "/blogg/nar-bor-man-be-om-hoyere-lonn",
    title: "Når bør man be om høyere lønn?",
  },
];

export function HourlySalaryDetailPage({
  page,
  hourlySeries,
  hourlyDistribution,
  latestHourlyPoint,
  latestMonthlyPoint,
  summaryText,
  faqItems,
}: HourlySalaryDetailPageProps) {
  const hasHourlyValues = Boolean(
    latestHourlyPoint?.valueAll !== undefined ||
    latestHourlyPoint?.valueWomen !== undefined ||
      latestHourlyPoint?.valueMen !== undefined,
  );
  const heroHourlyValue =
    latestHourlyPoint?.valueAll ?? latestHourlyPoint?.valueWomen ?? latestHourlyPoint?.valueMen;

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <section className="px-4 pb-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-b-[8px] border-b border-l border-r border-black bg-[#1f3a5f] px-5 py-8 shadow-[0_24px_60px_rgba(31,58,95,0.16)] sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
                {page.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-blue-50 sm:text-lg sm:leading-8">
                Se estimert timelønn for {page.titleOccupationLabel}, basert på offisiell lønnsstatistikk fra SSB.
                Her finner du timesats, månedslønn, lønnsspredning og utvikling over tid.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div className="flex w-full max-w-sm items-start justify-between gap-4 rounded-md border border-black bg-white px-5 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:px-6 sm:py-5 lg:max-w-none">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Estimert timelønn
                  </p>
                  <p className="mt-1 whitespace-nowrap text-4xl font-semibold tracking-[-0.04em] text-emerald-700 sm:text-5xl">
                    {formatHeroHourlyValue(heroHourlyValue)}
                  </p>
                </div>
                <span
                  aria-label="Timelønn er estimert fra månedslønn og 1 950 timer per år."
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-500"
                  title="Timelønn er estimert fra månedslønn og 1 950 timer per år."
                >
                  i
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            {summaryText ? (
              <section className="rounded-md border border-black bg-[linear-gradient(135deg,rgba(244,239,230,0.72)_0%,rgba(230,240,234,0.78)_100%)] px-5 py-5 shadow-sm sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Kort oppsummert
                </p>
                <p className="mt-3 max-w-4xl text-base leading-7 text-slate-950 sm:text-lg sm:leading-8">
                  {summaryText}
                </p>
              </section>
            ) : null}

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
              <section className="rounded-md border border-black bg-white px-5 py-5 shadow-sm sm:px-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                    Lønnsspredning
                  </p>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
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
                containerClassName="rounded-md border-black"
                description={`Se utviklingen i estimert timelønn for ${page.titleOccupationLabel}. Grafen bygger på median samlet månedslønn fra SSB og viser utviklingen for kvinner og menn der data finnes.`}
                latestDataDescription={`Her ser du siste estimerte timelønn for ${page.titleOccupationLabel}. Tallene er regnet ut fra median samlet månedslønn i SSB og fordelt på kvinner og menn der det finnes data.`}
                series={hourlySeries}
                title={`Utvikling i timelønn for ${page.titleOccupationLabel}`}
                valueDisplay="hourly"
              />
            ) : null}

            <section className="rounded-md border border-black bg-white px-5 py-5 shadow-sm sm:px-6">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">Vanlige spørsmål om timeslønn</h2>
              <div className="mt-6 space-y-6">
                {faqItems.map((item) => (
                  <FaqItem key={item.question} answer={item.answer} question={item.question} />
                ))}
              </div>
            </section>
          </div>

          <HourlySalarySidebar
            detailHref={page.detailHref}
            occupationLabel={page.titleOccupationLabel}
          />
        </div>
      </section>
    </main>
  );
}

function HourlySalarySidebar({
  detailHref,
  occupationLabel,
}: {
  detailHref: string;
  occupationLabel: string;
}) {
  return (
    <aside className="space-y-6">
      <section className="rounded-md border border-black bg-white p-5 shadow-sm">
        <p className="text-sm leading-7 text-slate-600">
          Tallene på denne siden er hentet fra{" "}
          <a
            className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
            href="https://www.ssb.no/arbeid-og-lonn/lonn-og-arbeidskraftkostnader"
            rel="noopener noreferrer"
            target="_blank"
          >
            Statistisk sentralbyrå (SSB)
          </a>
          {" "}og bygger på offisiell lønnsstatistikk for 2025.
        </p>
      </section>

      <Link
        className="inline-flex w-full items-center justify-between gap-3 rounded-md border border-black bg-white px-4 py-3 text-left shadow-sm transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
        href={detailHref}
      >
        <span className="block text-sm font-semibold text-slate-950">
          Se vanlig lønn for {occupationLabel}
        </span>
        <span aria-hidden="true" className="text-lg leading-none text-[var(--primary-strong)]">
          →
        </span>
      </Link>

      <Link
        className="inline-flex w-full items-center justify-between gap-3 rounded-md border border-black bg-white px-4 py-3 text-left shadow-sm transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
        href="/timelonn"
      >
        <span className="block text-sm font-semibold text-slate-950">
          Se timelønn for alle yrker
        </span>
        <span aria-hidden="true" className="text-lg leading-none text-[var(--primary-strong)]">
          →
        </span>
      </Link>

      <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
          Verktøy
        </p>
        <div className="mt-4 space-y-3">
          <SidebarLink href="/lonnskalkulator" label="Lønnskalkulator" />
          <SidebarLink href="/lonnsjekk" label="Lønnssjekk" />
          <SidebarLink href="/lanekalkulator" label="Lånekalkulator" />
        </div>
      </section>

      <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
          Fra bloggen
        </p>
        <SidebarLink className="mt-4" href={FEATURED_BLOG_POST.href} label={FEATURED_BLOG_POST.title} />
        <div className="mt-4 space-y-3">
          {BLOG_DEMO_LINKS.map((post) => (
            <SidebarLink href={post.href} key={post.href} label={post.title} />
          ))}
        </div>
      </section>
    </aside>
  );
}

function SidebarLink({
  className,
  href,
  label,
}: {
  className?: string;
  href: string;
  label: string;
}) {
  return (
    <Link
      className={[
        "block rounded-md border border-black/10 px-4 py-3 transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]",
        className ?? "",
      ].join(" ")}
      href={href}
    >
      <span className="block text-sm font-semibold text-slate-950">{label}</span>
    </Link>
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
      <div className="flex items-start gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
        <MetricInfoButton
          description={`Timelønn for ${label.toLowerCase()} er estimert fra median samlet månedslønn i Statistisk sentralbyrå (SSB) og omregnet med 1 950 arbeidstimer per år. Tallet er derfor et beregnet sammenligningsmål, ikke en garantert faktisk timesats for en enkelt arbeidstaker.`}
          label={`${label} timelønn forklart`}
        />
      </div>
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

function formatHeroHourlyValue(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
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
