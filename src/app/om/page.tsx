import type { Metadata } from "next";
import { InfoPageHero } from "@/components/info-page-hero";
import { siteConfig } from "@/lib/site-config";

const description =
  "Lønnsinnsikt gjør norske lønnsdata enklere å forstå, sammenligne og bruke i praksis.";

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
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        eyebrow="Om"
        title="Om Lønnsinnsikt"
        description="Vi bygger en datadrevet lønnsplattform for Norge, der lønnstall blir forklart på en måte som er nyttig før lønnssamtaler, jobbskifter og karrierevalg."
        imageSrc="/images/hero-om.png"
        imageAlt="Illustrasjon for Lønnsinnsikt sin om-side"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
              Formål
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Lønnstall skal være forståelige nok til å brukes.
            </h2>
          </div>

          <div className="grid gap-6 text-base leading-8 text-slate-700 sm:text-lg">
            <p>
              Lønnsinnsikt er laget for deg som vil forstå hva ulike yrker tjener, hvordan
              lønn varierer mellom grupper, og hvordan egen lønn står seg mot markedet. Vi
              bruker strukturerte tall fra blant annet Statistisk sentralbyrå og presenterer
              dem i et enklere og mer praktisk format.
            </p>
            <p>
              Målet er ikke bare å vise statistikk. Målet er å gjøre lønnsdata nyttig i
              situasjoner der du faktisk trenger et godt beslutningsgrunnlag: når du vurderer
              et jobbtilbud, forbereder en lønnssamtale, sammenligner yrker eller prøver å
              forstå utviklingen i arbeidsmarkedet.
            </p>
            <p>
              Vi ønsker at Lønnsinnsikt skal oppleves nøktern, presis og enkel å bruke. Tallene
              skal forklares tydelig, kilder skal være synlige, og rådene skal bygge på det
              datagrunnlaget faktisk kan fortelle.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
