import type { Metadata } from "next";
import Image from "next/image";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { TeacherSalaryCalculator } from "@/components/teacher-salary-calculator-dashboard";
import { siteConfig } from "@/lib/site-config";
import { getTeacherSsbBenchmarks } from "@/lib/teacher-ssb-benchmarks";

const pathname = "/laerer-lonn-kalkulator";
const title = "Lærer lønn 2026 – lønnskalkulator for KS";
const description = "Beregn sentral garantilønn for lærere i KS fra 1. mai 2026. Velg lærer, adjunkt eller lektor og se lønn etter ansiennitet.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "lærer lønn",
    "lærer lønn 2026",
    "lønn lærer",
    "lærer lønn ansiennitet",
    "adjunkt lønn",
    "lektor lønn",
    "KS lærer lønn",
    "lærer garantilønn",
  ],
  alternates: { canonical: pathname },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: pathname,
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lønnskalkulator for lærere 2026",
  description,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Alle",
  isAccessibleForFree: true,
  url: `${siteConfig.siteUrl}${pathname}`,
};

export default async function TeacherSalaryCalculatorPage() {
  const ssbBenchmarks = await getTeacherSsbBenchmarks();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf7_0%,#f8f7f3_100%)] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
        <header className="relative max-w-6xl pb-8 sm:pb-10">
          <div className="relative z-10 max-w-3xl sm:pr-40 md:pr-52 lg:pr-0">
            <p className="inline-flex rounded-full border border-[#3e7855] bg-[#f3f8f4] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#184d31]">Oppdaterte KS-satser · 2026</p>
            <h1 className="mt-5 text-[clamp(2.3rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.055em] text-[#111714]">
              Lønnskalkulator for lærere 2026
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Kalkulatoren viser sentral garantilønn i KS basert på stillingsgruppe og lønnsansiennitet. Lokale og individuelle tillegg kan gjøre faktisk lønn høyere.
            </p>
          </div>
          <Image
            alt="Åpen bok som symboliserer læreryrket"
            className="pointer-events-none absolute right-0 top-1/2 hidden h-auto w-40 -translate-y-1/2 rotate-[3deg] object-contain opacity-95 drop-shadow-[0_18px_20px_rgba(20,83,45,0.12)] sm:block md:right-4 md:w-52 lg:right-8 lg:w-60"
            height={721}
            priority
            src="/images/laerer-kalkulator-bok.png"
            width={1130}
          />
        </header>

        <TeacherSalaryCalculator ssbBenchmarks={ssbBenchmarks} />
        <CalculatorCrossLinks currentHref="/laerer-lonn-kalkulator" />
      </div>
    </main>
  );
}
