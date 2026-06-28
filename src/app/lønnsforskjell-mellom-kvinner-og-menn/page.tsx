import type { Metadata } from "next";
import { OccupationSalaryGapRanking } from "@/components/occupation-salary-gap-ranking";
import { getOccupationSalaryGapRanking } from "@/lib/occupation-salary-gap-ranking";
import { siteConfig } from "@/lib/site-config";

const title = "Lønnsforskjell mellom kvinner og menn i Norge";
const description =
  "Se lønnsforskjell mellom kvinner og menn i norske yrker. Hvor er lønnsgapet størst?";
const pagePath = "/lønnsforskjell-mellom-kvinner-og-menn";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pagePath,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: pagePath,
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

export default async function OccupationSalaryGapPage() {
  const data = await getOccupationSalaryGapRanking();

  return (
    <main className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Hvor er lønnsgapet størst? Her finner du yrkene med størst lønnsforskjell mellom
            kvinner og menn i Norge.
          </p>
        </header>

        <OccupationSalaryGapRanking data={data} />

        <section className="rounded-[5px] border border-slate-200 bg-white px-5 py-5 text-sm leading-6 text-slate-600 shadow-[0_18px_46px_rgba(15,23,42,0.05)] sm:px-6">
          <h2 className="text-base font-semibold text-slate-950">Om tallene</h2>
          <p className="mt-2">
            Lønnsforskjellen er beregnet fra median månedslønn for menn og kvinner i samme
            fire-sifrede yrke. Rangeringen bruker prosentvis forskjell, og kronebeløpet viser hvor
            stor forskjellen er i månedslønn.
          </p>
          <p className="mt-2">
            Kilde: {data.source}. Periode: {data.periodLabel ?? "siste tilgjengelige periode"}.
          </p>
        </section>
      </div>
    </main>
  );
}
