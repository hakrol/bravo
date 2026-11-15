import type { Metadata } from "next";
import { QuarterlyRealWageExplorer } from "@/components/quarterly-real-wage-explorer";
import { RealWageAgeOverview } from "@/components/real-wage-age-overview";
import { RealWageExplainer } from "@/components/real-wage-explainer";
import { RealWageSummaryCard } from "@/components/real-wage-summary-card";
import { RealWageOccupationOverview } from "@/components/real-wage-occupation-overview";
import { MedianAgreedSalaryInfo } from "@/components/median-agreed-salary-info";
import { RealWageDevelopmentSummary } from "@/components/real-wage-development-summary";
import { getNationalRealWagePageData } from "@/lib/quarterly-real-wage-data";
import { siteConfig } from "@/lib/site-config";

const title = "Reallønn i Norge – utvikling kvartal for kvartal";
const description = "Se hvordan reallønnen i Norge har utviklet seg. Utforsk kvartalsvis reallønnsvekst og utviklingen de siste fire kvartalene, siste hele år og siste kvartal med tall fra SSB.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/reallonn-norge" },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/reallonn-norge",
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default async function ReallonnNorgePage() {
  const { nationalDataset: dataset, summary, leaders, ageDataset, ageComparisons, occupationData } = await getNationalRealWagePageData();
  const nationalSeries = dataset.series.filter((series) => series.genderCode === "0" && series.ageCode === "999D");
  const stats = [
    { label: "Siste fire kvartaler", period: summary?.fourQuarters, detail: "Samlet endring over fire kvartaler" },
    { label: "Siste hele år", period: summary?.lastFullYear, detail: "Fra 4. kvartal til 4. kvartal" },
    { label: "Siste kvartal", period: summary?.lastQuarter, detail: "Endring fra kvartalet før" },
  ];
  const leaderStats = [
    { label: "Yrke med høyest utvikling", leader: leaders.occupation },
    { label: "Aldersgruppe med høyest utvikling", leader: leaders.age },
    { label: "Yrkesgruppe med høyest utvikling", leader: leaders.group },
  ];

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <section className="flex flex-col gap-6 sm:gap-7" aria-labelledby="reallonn-title">
          <header className="text-center">
            <h1 id="reallonn-title" className="text-balance text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
              Reallønn i Norge
            </h1>
            <p className="mx-auto mt-5 max-w-4xl text-lg font-medium leading-8 text-slate-700 sm:text-xl sm:leading-9">
              Har lønnen økt mer enn prisene? Se hvordan reallønnen i Norge har utviklet seg,
              basert på <MedianAgreedSalaryInfo /> justert for prisvekst.
            </p>
          </header>

          <dl className="grid gap-3 md:grid-cols-3">
            {stats.map(({ label, period, detail }) => <RealWageSummaryCard key={label}
              label={label} value={period?.value ?? null} period={period} detail={detail} />)}
            {leaderStats.map(({ label, leader }) => <RealWageSummaryCard key={label}
              label={label} value={leader?.value ?? null} subject={leader?.label} period={summary?.lastFullYear}
              detail={leader && leader.tiedCount > 1 ? `Delt høyest (${leader.tiedCount})` : undefined} />)}
          </dl>

          <RealWageDevelopmentSummary summary={summary} />

          <QuarterlyRealWageExplorer
            dataset={{ ...dataset, series: nationalSeries }}
            variant="national"
            annotation={summary ? {
              startPeriodCode: summary.highlightStartPeriodCode,
              endPeriodCode: summary.fourQuarters.endPeriodCode,
              value: summary.fourQuarters.value,
            } : undefined}
          />
        </section>
        <RealWageAgeOverview dataset={ageDataset} comparisons={ageComparisons} period={summary?.lastFullYear ?? null} />
        <RealWageOccupationOverview data={occupationData} initialOccupationCode={leaders.occupation?.code} />
        <RealWageExplainer />
      </div>
    </div>
  );
}
