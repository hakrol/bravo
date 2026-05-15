import type { Metadata } from "next";
import { InfoPageHero } from "@/components/info-page-hero";
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
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        eyebrow="Personvern"
        title="Personvern hos Lønnsinnsikt"
        description="Vi ønsker å behandle informasjon på en enkel, ansvarlig og forståelig måte."
        imageSrc="/images/hero-personvern.png"
        imageAlt="Illustrasjon for personvern hos Lønnsinnsikt"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-4xl gap-8">
          <div className="grid gap-6 text-base leading-8 text-slate-700 sm:text-lg">
            <p>
              Lønnsinnsikt er laget for å gi oversikt over lønnsdata. Vi samler ikke inn mer
              informasjon enn det som er nødvendig for at nettstedet skal fungere godt, være
              stabilt og kunne forbedres over tid.
            </p>

            <p>
              Når du bruker nettsiden, kan det bli registrert grunnleggende teknisk informasjon
              som hjelper oss å forstå bruk og sikre drift. Dette kan for eksempel være
              anonymiserte besøksdata, hvilken side som blir vist og generell informasjon om
              enhet og nettleser.
            </p>

            <p>
              Hvis vi endrer hvordan personopplysninger behandles, vil denne siden bli
              oppdatert. Har du spørsmål om personvern eller innholdet på siden, kan du ta
              kontakt med oss.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
