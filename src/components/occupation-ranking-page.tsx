import Link from "next/link";
import type {
  OccupationRankingData,
  OccupationRankingRow,
} from "@/lib/occupation-hero-rankings";

type OccupationRankingPageProps = {
  data: OccupationRankingData;
  variant: OccupationRankingVariant;
};

export type OccupationRankingVariant =
  | "salary"
  | "growth"
  | "bonus"
  | "oldest-age"
  | "youngest-age"
  | "employees";

const rankingPages = {
  salary: {
    href: "/topp-50-lonnsniva",
    navLabel: "Lønnsnivå",
    eyebrow: "Topp 50 · Lønnsnivå",
    title: "Yrker med høyest lønnsnivå",
    description:
      "Se de 50 yrkene med høyest median månedslønn i Norge, basert på siste tilgjengelige årstall fra SSB.",
  },
  growth: {
    href: "/topp-50-lonnsvekst",
    navLabel: "Lønnsvekst",
    eyebrow: "Topp 50 · Lønnsvekst",
    title: "Yrker med størst lønnsvekst siste år",
    description:
      "Se de 50 yrkene med størst prosentvis vekst i median månedslønn fra siste tilgjengelige år til året før.",
  },
  bonus: {
    href: "/topp-50-gjennomsnittlig-bonus",
    navLabel: "Gjennomsnittlig bonus",
    eyebrow: "Topp 50 · Bonus",
    title: "Yrker med høyest gjennomsnittlig bonus",
    description:
      "Se de 50 yrkene med høyest gjennomsnittlig bonus per måned i Norge, basert på siste tilgjengelige årstall fra SSB.",
  },
  "oldest-age": {
    href: "/topp-50-eldste-snittalder",
    navLabel: "Eldste snittalder",
    eyebrow: "Topp 50 · Snittalder",
    title: "Yrker med høyest snittalder",
    description:
      "Se de 50 yrkene med høyest gjennomsnittsalder blant arbeidstakerne, basert på siste felles periode med tilgjengelige tall fra SSB.",
  },
  "youngest-age": {
    href: "/topp-50-yngste-snittalder",
    navLabel: "Yngste snittalder",
    eyebrow: "Topp 50 · Snittalder",
    title: "Yrker med lavest snittalder",
    description:
      "Se de 50 yrkene med lavest gjennomsnittsalder blant arbeidstakerne, basert på siste felles periode med tilgjengelige tall fra SSB.",
  },
  employees: {
    href: "/topp-50-arbeidstakere",
    navLabel: "Flest arbeidstakere",
    eyebrow: "Topp 50 · Arbeidstakere",
    title: "Yrker med flest arbeidstakere",
    description:
      "Se de 50 yrkene med flest arbeidstakere i Norge, basert på siste felles periode med tilgjengelige tall fra SSB.",
  },
} as const;

export function OccupationRankingPage({ data, variant }: OccupationRankingPageProps) {
  const config = rankingPages[variant];
  const rows = getRankingRows(data, variant).slice(0, 50);
  const periodLabel = getPeriodLabel(data, variant);

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#071a36]">
      <section className="relative isolate overflow-hidden border-b border-emerald-950/10 px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-12 lg:px-12 lg:pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_24%,rgba(131,173,133,0.2),transparent_25rem),linear-gradient(135deg,#fbfcfa_0%,#f3f8f2_100%)]" />
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 opacity-30 [background-image:radial-gradient(#4d8561_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(90deg,transparent,#000)]" />

        <div className="mx-auto max-w-7xl">
          <nav aria-label="Brødsmulesti">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
              <li><Link className="rounded-sm hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700" href="/">Hjem</Link></li>
              <li aria-hidden="true" className="text-emerald-700">›</li>
              <li aria-current="page">Topp 50 {config.navLabel.toLowerCase()}</li>
            </ol>
          </nav>

          <div className="mt-10 max-w-4xl sm:mt-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              {config.eyebrow}
            </p>
            <h1 className="mt-4 text-[clamp(2.7rem,6vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.055em]">
              {config.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl sm:leading-9">
              {config.description}
            </p>
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-emerald-950/10 pt-6 text-sm">
            <div>
              <dt className="font-medium text-slate-500">Periode</dt>
              <dd className="mt-1 font-semibold text-slate-900">{periodLabel}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Datakilde</dt>
              <dd className="mt-1 font-semibold text-slate-900">{data.source}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Antall yrker</dt>
              <dd className="mt-1 font-semibold text-slate-900">{rows.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Velg rangering" className="flex flex-wrap gap-2">
            {Object.entries(rankingPages).map(([key, page]) => {
              const isActive = key === variant;

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-emerald-700 ${
                    isActive
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-emerald-950/15 bg-white text-emerald-900 hover:border-emerald-700 hover:bg-emerald-50"
                  }`}
                  href={page.href}
                  key={page.href}
                >
                  Topp 50 {page.navLabel.toLowerCase()}
                </Link>
              );
            })}
          </nav>

          <div className="mt-7 overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-[0_18px_50px_rgba(15,47,34,0.06)]">
            <div className="hidden grid-cols-[3.5rem_minmax(0,1fr)_minmax(180px,230px)] gap-4 border-b border-slate-200 bg-slate-50/80 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 sm:grid sm:px-7">
              <span>Plass</span>
              <span>Yrke</span>
              <span className="text-right">{getValueHeading(variant)}</span>
            </div>

            <ol className="divide-y divide-slate-200">
              {rows.map((row) => (
                <RankingRow key={row.occupationCode} row={row} variant={variant} />
              ))}
            </ol>
          </div>

          <section className="mt-10 rounded-2xl border border-emerald-950/10 bg-[#edf5ed] p-6 sm:p-8">
            <h2 className="text-xl font-bold sm:text-2xl">Slik er rangeringen beregnet</h2>
            <p className="mt-3 max-w-4xl leading-7 text-slate-700">
              {getMethodDescription(data, variant)}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

function RankingRow({
  row,
  variant,
}: {
  row: OccupationRankingRow;
  variant: OccupationRankingPageProps["variant"];
}) {
  return (
    <li>
      <Link
        className="group grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-4 transition hover:bg-emerald-50/60 focus-visible:bg-emerald-50 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-emerald-700 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(180px,230px)] sm:items-center sm:gap-4 sm:px-7 sm:py-5"
        href={row.href}
      >
        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
          row.rank <= 10
            ? "bg-emerald-800 text-white"
            : "bg-emerald-50 text-emerald-800"
        }`}>
          {row.rank}
        </span>

        <span className="min-w-0 self-center">
          <span className="block text-base font-semibold text-slate-950 transition group-hover:text-emerald-800 sm:text-lg">
            {row.occupationLabel}
          </span>
          <span className="mt-1 block text-xs text-slate-500">Yrkesnummer {row.occupationCode}</span>
        </span>

        <span className="col-start-2 text-left sm:col-start-3 sm:text-right">
          <span className="block text-lg font-bold text-emerald-800 sm:text-xl">
            {formatRankingValue(row, variant)}
          </span>
          {variant === "growth" ? (
            <span className="mt-1 block text-xs text-slate-500">
              {formatCurrency(row.previousSalary)} → {formatCurrency(row.latestSalary)}
            </span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}

function getRankingRows(data: OccupationRankingData, variant: OccupationRankingVariant) {
  switch (variant) {
    case "salary":
      return data.salaryRows;
    case "growth":
      return data.growthRows;
    case "bonus":
      return data.bonusRows;
    case "oldest-age":
      return data.oldestAgeRows;
    case "youngest-age":
      return data.youngestAgeRows;
    case "employees":
      return data.employeeRows;
  }
}

function getPeriodLabel(data: OccupationRankingData, variant: OccupationRankingVariant) {
  switch (variant) {
    case "salary":
      return data.salaryPeriodLabel;
    case "growth":
      return `${data.growthPreviousPeriodLabel}–${data.growthLatestPeriodLabel}`;
    case "bonus":
      return data.bonusPeriodLabel;
    case "oldest-age":
    case "youngest-age":
      return data.agePeriodLabel;
    case "employees":
      return data.employeePeriodLabel;
  }
}

function getValueHeading(variant: OccupationRankingVariant) {
  switch (variant) {
    case "salary":
      return "Median månedslønn";
    case "growth":
      return "Vekst siste år";
    case "bonus":
      return "Gjennomsnittlig bonus";
    case "oldest-age":
    case "youngest-age":
      return "Snittalder";
    case "employees":
      return "Antall arbeidstakere";
  }
}

function formatRankingValue(row: OccupationRankingRow, variant: OccupationRankingVariant) {
  switch (variant) {
    case "salary":
      return formatCurrency(row.medianMonthlySalary);
    case "growth":
      return formatPercent(row.salaryGrowthPercent);
    case "bonus":
      return formatCurrency(row.averageMonthlyBonus);
    case "oldest-age":
    case "youngest-age":
      return formatAge(row.averageAge);
    case "employees":
      return formatCount(row.employeeCount);
  }
}

function getMethodDescription(data: OccupationRankingData, variant: OccupationRankingVariant) {
  switch (variant) {
    case "salary":
      return `Listen rangerer firesifrede yrkeskoder etter median månedslønn for begge kjønn i ${data.salaryPeriodLabel}. Medianen er lønnen i midten når alle observasjonene sorteres, og påvirkes mindre av svært høye enkeltlønninger enn gjennomsnittet.`;
    case "growth":
      return `Listen sammenligner median månedslønn i ${data.growthLatestPeriodLabel} med ${data.growthPreviousPeriodLabel} for samme firesifrede yrkeskode. Endringen er nominell og ikke justert for prisvekst. Yrker som mangler et gyldig lønnstall i én av periodene, er ikke med i rangeringen.`;
    case "bonus":
      return `Listen rangerer firesifrede yrkeskoder etter gjennomsnittlig bonus per måned for begge kjønn i ${data.bonusPeriodLabel}. Yrker uten en positiv, rapportert bonus er ikke med i rangeringen.`;
    case "oldest-age":
      return `Listen rangerer firesifrede yrkeskoder fra høyest til lavest gjennomsnittsalder blant arbeidstakere i ${data.agePeriodLabel}. Bare yrker med alderstall fra denne perioden er med.`;
    case "youngest-age":
      return `Listen rangerer firesifrede yrkeskoder fra lavest til høyest gjennomsnittsalder blant arbeidstakere i ${data.agePeriodLabel}. Bare yrker med alderstall fra denne perioden er med.`;
    case "employees":
      return `Listen rangerer firesifrede yrkeskoder etter antall arbeidstakere i ${data.employeePeriodLabel}. Tallet viser personer, ikke antall arbeidsforhold, og bare yrker med tall fra denne perioden er med.`;
  }
}

function formatCurrency(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

function formatPercent(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} %`;
}

function formatAge(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} år`;
}

function formatCount(value?: number) {
  if (value === undefined) {
    return "Mangler tall";
  }

  return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 });
}
