import type { Metadata } from "next";
import Image from "next/image";
import { NurseSalaryCalculator } from "@/components/nurse-salary-calculator-dashboard";
import { getNurseSsbBenchmarks } from "@/lib/nurse-ssb-benchmarks";
import { siteConfig } from "@/lib/site-config";

const pathname = "/sykepleier-lonn-kalkulator";
const title = "Sykepleier lønn 2026 – lønnskalkulator";
const description = "Beregn tariffestet grunnlønn for sykepleiere i 2026 etter tariffområde, stilling og ansiennitet. Se satser for KS, Spekter og Oslo kommune.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pathname },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: pathname,
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lønnskalkulator for sykepleiere 2026",
  description,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Alle",
  isAccessibleForFree: true,
  url: `${siteConfig.siteUrl}${pathname}`,
};

export default async function NurseSalaryCalculatorPage() {
  const ssbBenchmarks = await getNurseSsbBenchmarks();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf7_0%,#f8f7f3_100%)] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
      <div className="mx-auto w-full max-w-6xl">
        <header className="relative max-w-6xl pb-8 sm:pb-10">
          <div className="relative z-10 max-w-3xl sm:pr-36 md:pr-44 lg:pr-0">
            <p className="inline-flex rounded-full border border-[#3e7855] bg-[#f3f8f4] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#184d31]">Oppdaterte tariffsatser · 2026</p>
            <h1 className="mt-5 text-[clamp(2.3rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.055em] text-[#111714]">
              Lønnskalkulator for sykepleiere 2026
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Kalkulatoren viser tariffestet grunnlønn basert på tariffområde, stilling og ansiennitet. Lokale og individuelle tillegg kan komme i tillegg.
            </p>
          </div>
          <Image
            alt="Stetoskop som symboliserer sykepleieryrket"
            className="pointer-events-none absolute right-2 top-1/2 hidden h-auto w-32 -translate-y-1/2 rotate-[4deg] object-contain opacity-95 drop-shadow-[0_18px_20px_rgba(20,83,45,0.12)] sm:block md:right-6 md:w-40 lg:right-14 lg:w-48"
            height={1254}
            priority
            src="/images/sykepleier-kalkulator-stetoskop.png"
            width={1254}
          />
        </header>

        <NurseSalaryCalculator ssbBenchmarks={ssbBenchmarks} />
      </div>
    </main>
  );
}
