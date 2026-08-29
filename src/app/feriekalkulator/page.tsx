import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import { VacationCalculator } from "@/components/vacation-calculator";
import { siteConfig } from "@/lib/site-config";

const description =
  "Finn inneklemte dager og beregn hvordan du kan fordele feriedagene for å få mest mulig sammenhengende fri.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feriekalkulator – få mest mulig fri",
  description,
  alternates: {
    canonical: "/feriekalkulator",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/feriekalkulator",
    siteName: siteConfig.name,
    title: `Feriekalkulator – få mest mulig fri | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Feriekalkulator – få mest mulig fri | ${siteConfig.name}`,
    description,
  },
};

export default function FeriekalkulatorPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <VacationCalculator referenceDate={new Date().toISOString()} />
        <AdSlot className="mt-8" placement="feriekalkulator-after-tool" />
      </div>
    </main>
  );
}
