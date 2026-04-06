import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

const description = "Les hvordan Lønnsinnsikt behandler personvern på nettstedet.";

export const metadata: Metadata = {
  title: "Personvern",
  description,
  alternates: {
    canonical: "/personvern",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/personvern",
    siteName: siteConfig.name,
    title: `Personvern | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Personvern | ${siteConfig.name}`,
    description,
  },
};

export default function PersonvernPage() {
  return (
    <div className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto grid w-full max-w-4xl gap-8">
        <div className="grid gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
            Personvern
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Personvern hos Lønnsinnsikt
          </h1>
        </div>

        <div className="grid gap-6 text-base leading-8 text-[var(--muted)] sm:text-lg">
          <p>
            Vi ønsker å behandle informasjon på en enkel og ansvarlig måte. Lønnsinnsikt er laget
            for å gi oversikt over lønnsdata, og vi samler ikke inn mer informasjon enn det som er
            nødvendig for at nettstedet skal fungere godt.
          </p>

          <p>
            Når du bruker nettsiden, kan det bli registrert grunnleggende teknisk informasjon som
            hjelper oss å forstå bruk, forbedre innhold og sikre stabil drift. Dette kan for
            eksempel være anonymiserte besøksdata, hvilken side som blir vist og generell
            informasjon om enhet og nettleser.
          </p>

          <p>
            Hvis vi endrer hvordan personopplysninger behandles, vil denne siden bli oppdatert. Har
            du spørsmål om personvern eller innholdet på siden, kan du ta kontakt med oss.
          </p>
        </div>
      </div>
    </div>
  );
}
