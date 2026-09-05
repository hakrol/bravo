import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { OccupationComparisonCalculator } from "@/components/occupation-comparison-calculator";
import { buildLonnsjekkPageData } from "@/lib/lonnsjekk";
import { buildOccupationComparisonPageData } from "@/lib/occupation-comparison";
import { buildOccupationSalaryOverview } from "@/lib/occupation-salary-overview";
import {
  getLatestSalaryDataset,
  getOccupationMedianSalaryOverview,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
} from "@/lib/ssb";
import { siteConfig } from "@/lib/site-config";

const description =
  "Sammenlign to yrker med årslønn, månedslønn, timelønn, alder, antall i jobb og reallønnsvekst basert på SSB-tall.";

export const metadata: Metadata = {
  title: "Sammenlign lønn mellom to yrker",
  description,
  alternates: {
    canonical: "/sammenlign-lonn",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/sammenlign-lonn",
    siteName: siteConfig.name,
    title: `Sammenlign lønn mellom to yrker | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Sammenlign lønn mellom to yrker | ${siteConfig.name}`,
    description,
  },
};

export default async function SammenlignLonnPage() {
  const averageDataset = await getLatestSalaryDataset(
    "occupationDetailed",
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const averageOverview = buildOccupationSalaryOverview(averageDataset);
  const medianOverview = await getOccupationMedianSalaryOverview(
    averageOverview.rows.map((row) => row.occupationCode),
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const lonnsjekkData = buildLonnsjekkPageData({
    averageRows: averageOverview.rows,
    medianRows: medianOverview.rows,
    averageMonthlySalaryAll: averageOverview.averageMonthlySalary,
    periodLabel: averageOverview.periodLabel ?? medianOverview.periodLabel,
    updated: averageDataset.updated,
  });
  const comparisonData = buildOccupationComparisonPageData({
    options: lonnsjekkData.options,
    periodLabel: lonnsjekkData.periodLabel,
    updated: lonnsjekkData.updated,
  });

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <OccupationComparisonCalculator data={comparisonData} />
        <AdSlot placement="sammenlign-lonn-after-tool" />
        <SammenlignLonnGuide />
        <CalculatorCrossLinks currentHref="/sammenlign-lonn" />
      </div>
    </div>
  );
}

function SammenlignLonnGuide() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Slik bruker du sammenligningen
        </h2>
        <div className="mt-6 grid gap-8 text-base leading-8 text-slate-600">
          <section className="grid gap-3">
            <p>
              Velg to yrker og bytt mellom begge kjønn, menn og kvinner øverst. Da endres lønn,
              alder, antall i jobb og reallønnsvekst til samme kjønnsutvalg for begge yrker.
            </p>
            <p>
              Lønnstallene bruker median månedslønn fra SSB. Årslønn og timelønn er regnet om fra
              månedslønnen, slik at yrkene blir enklere å sammenligne side om side.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Les videre
            </h3>
            <p>
              Du kan også bruke{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/lonnsjekk"
              >
                Lønnssjekk
              </Link>{" "}
              for å sammenligne din egen lønn med markedet, eller se alle{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/yrker"
              >
                yrker
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
