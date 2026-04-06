import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

const description = "Les mer om Lønnsinnsikt.";

export const metadata: Metadata = {
  title: "Om",
  description,
  alternates: {
    canonical: "/om",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/om",
    siteName: siteConfig.name,
    title: `Om | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Om | ${siteConfig.name}`,
    description,
  },
};

export default function OmPage() {
  return (
    <div className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto grid w-full max-w-4xl gap-8">
        <div className="grid gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
            Om
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Om Lønnsinnsikt
          </h1>
        </div>

        <div className="grid gap-6 text-base leading-8 text-[var(--muted)] sm:text-lg">
          <p>
            Vi har laget Lønnsinnsikt for å gjøre lønnsdata enklere å forstå, utforske og bruke i
            praksis. Når du besøker nettsiden, skal du raskt kunne finne ut hva folk tjener i ulike
            yrker, sammenligne tall og få bedre oversikt over hvordan arbeidsmarkedet faktisk ser
            ut.
          </p>

          <p>
            Målet vårt er å gi deg et tydeligere grunnlag for små og store valg. Kanskje du vurderer
            nytt yrke, vil forberede deg til lønnssamtale, sammenligne utvikling mellom roller eller
            bare forstå mer av tallene bak arbeidslivet. Vi ønsker at du skal kjenne deg trygg på at
            informasjonen er oversiktlig presentert og enkel å bruke.
          </p>

          <p>
            Vi tror gode beslutninger blir lettere når data føles tilgjengelig for vanlige mennesker.
            Derfor bygger vi Lønnsinnsikt som en tjeneste som oversetter statistikk til innsikt du
            faktisk kan bruke, uten unødvendig støy og uten at du må grave deg gjennom kompliserte
            tabeller på egen hånd.
          </p>
        </div>
      </div>
    </div>
  );
}
