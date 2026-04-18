import Link from "next/link";
import { MetricInfoButton } from "@/components/metric-info-button";
import {
  OccupationDetailSectionNav,
  type OccupationDetailSectionNavItem,
} from "@/components/occupation-detail-section-nav";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import { OccupationSalaryTimeSeriesChart } from "@/components/occupation-salary-time-series";
import type { TopPaidOccupationLink } from "@/lib/occupation-detail-view-models";
import type { NorwaySalaryViewModel } from "@/lib/types";

type NorwaySalaryPageProps = {
  viewModel: NorwaySalaryViewModel;
  topPaidOccupations: TopPaidOccupationLink[];
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

const EXTERNAL_SOURCE_LINKS = [
  {
    href: "https://www.ssb.no/arbeid-og-lonn/lonn-og-arbeidskraftkostnader",
    label: "Statistisk sentralbyrå (SSB)",
  },
];

const sectionAnchorClassName = "scroll-mt-32";

export function NorwaySalaryPage({ viewModel, topPaidOccupations }: NorwaySalaryPageProps) {
  const { summary, distribution, laborMarket, salarySeries } = viewModel;
  const updatedLabel = formatUpdatedLabel(summary.updated ?? viewModel.updated);
  const sectionItems: OccupationDetailSectionNavItem[] = [
    { id: "oversikt", label: "Oversikt" },
    { id: "kjonn", label: "Kvinner og menn" },
    { id: "best-betalt", label: "Best betalt" },
    { id: "lonnsutvikling", label: "Lønnsutvikling" },
    { id: "fordeling", label: "Fordeling" },
    { id: "arbeidsmarked", label: "Arbeidsmarked" },
  ];
  const laborCards = [
    {
      label: "Lønnstakere",
      value: formatInteger(laborMarket.employeesAll),
      detail: laborMarket.latestWorkforcePeriodLabel,
    },
    {
      label: "Jobber",
      value: formatInteger(laborMarket.jobsAll),
      detail: laborMarket.latestWorkforcePeriodLabel,
    },
    {
      label: "Midlertidig andel",
      value: formatPercent(laborMarket.temporaryShareAll),
      detail: laborMarket.contractPeriodLabel,
    },
    {
      label: "Snittalder",
      value: formatAge(laborMarket.averageAgeAll),
      detail: laborMarket.latestAgePeriodLabel,
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,250,243,0.92))] px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-8">
          <OccupationDetailSectionNav
            className="border-[#ba0c2f]/10 bg-white/90 lg:hidden"
            sections={sectionItems}
            variant="mobile"
          />

          <section className={sectionAnchorClassName} id="oversikt">
            <div className="relative overflow-hidden rounded-[5px] px-1 py-7 sm:py-9">
              <div className="relative">
                <div className="max-w-3xl space-y-4">
                  <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
                    Lønn i Norge
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
                    Her får du et enkelt og oppdatert bilde av hva folk tjener i Norge, hvordan
                    lønna har utviklet seg, og hvordan den varierer mellom kvinner og menn.
                    Tallene er hentet fra SSB.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  <HeroMetricCard
                    accent="red-soft"
                    description="Median avtalt månedslønn for kvinner i aggregatet Alle yrker i Norge."
                    detail={summary.latestPeriodLabel}
                    icon="woman"
                    label="Månedslønn kvinner"
                    value={formatCurrency(summary.medianWomen)}
                  />
                  <HeroMetricCard
                    accent="blue"
                    description="Median avtalt månedslønn for menn i aggregatet Alle yrker i Norge."
                    detail={summary.latestPeriodLabel}
                    icon="man"
                    label="Månedslønn menn"
                    value={formatCurrency(summary.medianMen)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={`${sectionAnchorClassName} space-y-4`} id="kjonn">
            <SectionIntro
              description="Her ser du hvordan lønna typisk fordeler seg for kvinner og menn i Norge. Midtpunktet viser medianlønna, mens punktene på hver side viser nivåene der mange ligger under og over."
              eyebrow="Kvinner og menn"
              title="Lønnsfordeling for kvinner og menn"
            />
            <div className="rounded-[5px] px-6 py-6 sm:px-8">
              {distribution ? (
                <OccupationSalaryDistributionSection
                  distribution={distribution}
                  scaleMode="focusBand"
                  visibleRows={["women", "men"]}
                />
              ) : (
                <p className="text-sm text-slate-600">Fant ikke kjønnsfordelte fordelingsdata.</p>
              )}
            </div>
          </section>

          <section className={`${sectionAnchorClassName} space-y-4`} id="best-betalt">
            <SectionIntro
              description="Her ser du hvilke yrker som ligger øverst på lønnslisten akkurat nå, basert på median månedslønn for begge kjønn. Klikk deg videre for å se hele yrkessiden."
              eyebrow="Best betalte yrker"
              title="De 10 best betalte yrkene i Norge"
            />
            <div className="grid gap-4">
              {topPaidOccupations.map((occupation) => (
                <Link
                  key={occupation.occupationCode}
                  className="rounded-[5px] border border-black/10 bg-white px-5 py-5 shadow-sm transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
                  href={occupation.href}
                >
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {occupation.title}
                  </h3>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                    {formatCurrency(occupation.medianAll)}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className={`${sectionAnchorClassName} space-y-4`} id="lonnsutvikling">
            <SectionIntro
              description="Grafen under bruker samme tidsserieoppsett som detaljsidene, men viser nå utviklingen for Alle yrker i Norge."
              eyebrow="Tidsserie"
              title="Lønnsutvikling for hele Norge"
            />
            <OccupationSalaryTimeSeriesChart
              ariaLabel="Lønnsutvikling for alle yrker i Norge"
              description="Se utviklingen i median avtalt månedslønn for alle yrker i Norge, fordelt på begge kjønn, kvinner og menn."
              latestDataDescription="Her ser du siste registrerte medianlønn for Alle yrker i Norge. Tallene bygger på aggregatet 0-9 fra SSB."
              series={salarySeries}
              title="Utvikling i medianlønn for Norge"
              variant="modern"
            />
          </section>

          <section className={`${sectionAnchorClassName} space-y-4`} id="fordeling">
            <SectionIntro
              description="Her ser du hele bildet for Norge samlet, med spennet mellom nedre kvartil, median og øvre kvartil for alle yrker under ett."
              eyebrow="Fordeling"
              title="Hvordan lønningene fordeler seg samlet"
            />
            <div className="rounded-[5px] px-6 py-6 sm:px-8">
              {distribution ? (
                <OccupationSalaryDistributionSection
                  distribution={distribution}
                  scaleMode="focusBand"
                  visibleRows={["total"]}
                />
              ) : (
                <p className="text-sm text-slate-600">Fant ikke fordelingsdata for nasjonal oversikt.</p>
              )}
            </div>
          </section>

          <section className={`${sectionAnchorClassName} space-y-4`} id="arbeidsmarked">
            <SectionIntro
              description="Arbeidsmarkedsseksjonen bruker de samme SSB-kildene som detaljsidene, men aggregert til hele Norge."
              eyebrow="Arbeidsmarked"
              title="Nøkkeltall rundt jobbene"
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {laborCards.map((card) => (
                <StatCard
                  detail={card.detail}
                  key={card.label}
                  label={card.label}
                  value={card.value}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden space-y-6 lg:block">
          <section className="rounded-[5px] border border-black bg-white p-5 shadow-sm">
            <p className="text-sm leading-7 text-slate-600">
              Dataene på denne siden kommer fra{" "}
              <a
                className="font-semibold text-[var(--primary-strong)] underline decoration-[var(--primary)] underline-offset-2"
                href={EXTERNAL_SOURCE_LINKS[0].href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {EXTERNAL_SOURCE_LINKS[0].label}
              </a>
              , og tallene er sist oppdatert {updatedLabel ?? "i siste tilgjengelige publisering"}.
            </p>
          </section>

          <section className="rounded-[5px] border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
              Fra bloggen
            </p>
            <Link
              className="mt-4 block rounded-[5px] border border-black/10 px-4 py-3 transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
              href={FEATURED_BLOG_POST.href}
            >
              <span className="block text-sm font-semibold text-slate-950">
                {FEATURED_BLOG_POST.title}
              </span>
            </Link>
            <div className="mt-4 space-y-3">
              {BLOG_DEMO_LINKS.map((post) => (
                <Link
                  className="block rounded-[5px] border border-black/10 px-4 py-3 transition hover:border-[var(--primary)]/40 hover:bg-[#f7fafc]"
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
        </aside>
      </div>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2 px-1">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b1e3f]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2rem]">
        {title}
      </h2>
      <p className="max-w-3xl text-base leading-7 text-slate-700">{description}</p>
    </div>
  );
}

function HeroMetricCard({
  label,
  description,
  value,
  detail,
  accent,
  icon,
}: {
  label: string;
  description: string;
  value: string;
  detail?: string;
  accent: "red-soft" | "blue";
  icon: "woman" | "man";
}) {
  return (
    <div className="rounded-[5px] p-5">
      <div className="flex items-stretch gap-4">
        <span
          aria-hidden="true"
          className={`inline-flex min-h-full w-16 shrink-0 items-center justify-center rounded-[5px] ${
            accent === "red-soft"
              ? "bg-[#fff1f4] text-[#a63b5d]"
              : "bg-[#eef5ff] text-[#00205b]"
          }`}
        >
          {icon === "woman" ? <WomanIcon /> : <ManIcon />}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <MetricInfoButton description={description} label={label} />
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            {value}
          </p>
          {detail ? <p className="mt-3 text-sm text-slate-600">{detail}</p> : null}
        </div>
      </div>
    </div>
  );
}

function WomanIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="28" viewBox="0 0 24 24" width="28">
      <circle cx="12" cy="7" fill="currentColor" r="3.25" />
      <path
        d="M12 11c-3.2 0-5.5 2.38-5.5 5.31V17h3.08v5H11v-4h2v4h1.42v-5h3.08v-.69C17.5 13.38 15.2 11 12 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ManIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="28" viewBox="0 0 24 24" width="28">
      <circle cx="12" cy="7" fill="currentColor" r="3.25" />
      <path
        d="M12 11c-3.18 0-5.5 2.24-5.5 5.09V17h3v5H11v-4h2v4h1.5v-5h3v-.91C17.5 13.24 15.18 11 12 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-[5px] px-5 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-600">{detail}</p> : null}
    </div>
  );
}

function formatCurrency(value?: number) {
  if (value === undefined) {
    return "Ukjent";
  }

  return `${value.toLocaleString("nb-NO")} kr`;
}

function formatInteger(value?: number) {
  if (value === undefined) {
    return "Ukjent";
  }

  return Math.round(value).toLocaleString("nb-NO");
}

function formatPercent(value?: number) {
  if (value === undefined) {
    return "Ukjent";
  }

  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function formatAge(value?: number) {
  if (value === undefined) {
    return "Ukjent";
  }

  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} år`;
}

function formatUpdatedLabel(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
