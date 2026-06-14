import type { Metadata } from "next";
import Link from "next/link";
import { SalaryGrowthCalculatorDashboard } from "@/components/salary-growth-calculator-dashboard";
import { siteConfig } from "@/lib/site-config";

const description =
  "Beregn egen lønnsvekst, reallønnsvekst og om lønnen din har gitt bedre kjøpekraft etter prisvekst.";

export const metadata: Metadata = {
  title: "Lønnsvekst kalkulator",
  description,
  alternates: {
    canonical: "/lonnsvekst",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/lonnsvekst",
    siteName: siteConfig.name,
    title: `Lønnsvekst kalkulator | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Lønnsvekst kalkulator | ${siteConfig.name}`,
    description,
  },
};

export default function LonnsvekstPage() {
  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <SalaryGrowthCalculatorDashboard />
        <SalaryGrowthGuide />
      </div>
    </div>
  );
}

function SalaryGrowthGuide() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Slik tolker du lønnsveksten
        </h2>
        <div className="mt-6 grid gap-8 text-base leading-8 text-slate-600">
          <section className="grid gap-3">
            <p>
              Kalkulatoren sammenligner startlønn med nåværende lønn. Resultatet viser både
              nominell lønnsvekst og reallønnsvekst. Reallønnsvekst betyr at lønnen er justert for
              prisvekst, slik at du ser om kjøpekraften faktisk har blitt bedre.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Lønnsvekst og reallønnsvekst
            </h3>
            <p>
              Nominell lønnsvekst er økningen i kroner og prosent før prisvekst tas med. Hvis
              lønnen din har gått fra 520 000 til 650 000 kroner, har lønnen økt tydelig i kroner.
              Men det sier ikke alene om du har fått bedre råd.
            </p>
            <p>
              Reallønnsvekst viser hva som er igjen når KPI-veksten trekkes inn. Hvis lønnen har
              økt mer enn prisene, har kjøpekraften økt. Hvis prisene har økt mer enn lønnen, har
              kjøpekraften blitt svakere.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hvilken lønn bør du skrive inn?
            </h3>
            <p>
              Bruk samme lønnstype i begge feltene. For de fleste er brutto årslønn best, fordi
              det gjør sammenligningen ryddig og lettere å koble til lønnstall fra arbeidsavtale,
              jobbtilbud eller statistikk.
            </p>
            <p>
              Hvis du bare kjenner månedslønnen din, kan du gange månedslønnen med 12 og bruke det
              som et enkelt årslønnsestimat.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Les videre
            </h3>
            <p>
              Vil du se hvordan lønnsveksten har utviklet seg i Norge, kan du lese guiden om{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/blogg/hva-er-gjennomsnittlig-lonnsvekst-i-norge"
              >
                gjennomsnittlig lønnsvekst i Norge
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
