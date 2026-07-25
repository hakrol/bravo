import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageHero } from "@/components/info-page-hero";
import { siteConfig } from "@/lib/site-config";

const description =
  "Lønnsinnsikt gjør norske lønnsdata enklere å forstå, sammenligne og bruke i praksis.";

const audiences = [
  {
    title: "Arbeidstakere",
    text: "Forstå hvordan lønnen din står seg mot nivået i yrket, og møt bedre forberedt til lønnssamtalen.",
  },
  {
    title: "Jobbsøkere",
    text: "Undersøk realistiske lønnsnivåer før du vurderer et jobbtilbud, bytter retning eller går inn i en forhandling.",
  },
  {
    title: "Ledere og HR",
    text: "Få et overordnet markedsperspektiv når roller, lønnsnivåer og utvikling skal vurderes.",
  },
] as const;

const productLinks = [
  {
    title: "Utforsk yrker",
    href: "/yrker",
    text: "Finn lønnstall, utvikling og forklaringer for norske yrker.",
  },
  {
    title: "Sjekk lønnen din",
    href: "/lonnsjekk",
    text: "Sammenlign egen lønn med tilgjengelig statistikk for yrket ditt.",
  },
  {
    title: "Les guider og forklaringer",
    href: "/blogg",
    text: "Lær mer om lønn, begreper, lønnsforhandling og arbeidsliv.",
  },
] as const;

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
        title="Om Lønnsinnsikt"
        description="Vi bygger en datadrevet lønnsplattform for Norge, der lønnstall blir forklart på en måte som er nyttig før lønnssamtaler, jobbskifter og karrierevalg."
        imageSrc="/images/hero-om-redaksjonell.png"
        imageAlt="Illustrasjon av lønnsdata, sammenligning og informerte karrierevalg"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
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

      <section className="border-y border-black/6 bg-white px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Bedre lønnsinnsikt er nyttig i flere situasjoner.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {audiences.map((audience) => (
              <article
                key={audience.title}
                className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-[#fafafa] p-6"
              >
                <h3 className="text-xl font-extrabold text-slate-950">{audience.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-700">{audience.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
                Offisiell statistikk, forklart i en praktisk sammenheng.
              </h2>
            </div>

            <div className="grid gap-5 text-base leading-8 text-slate-700 sm:text-lg">
              <p>
                Statistisk sentralbyrå er hovedkilden for lønnsdataene på Lønnsinnsikt.
                Avhengig av tema bruker vi blant annet statistikk om yrke, kjønn, sektor,
                arbeidstid, lærlinger, sysselsetting og prisutvikling.
              </p>
              <p>
                Vi forsøker å vise hvilken periode et tall gjelder for, skille mellom median
                og gjennomsnitt og gjøre beregninger forståelige. Når vi omregner eller
                sammenstiller tall, skal det komme tydelig frem hva som er offisiell statistikk
                og hva som er vår beregning eller tolkning.
              </p>
              <p>
                Lønnsstatistikk beskriver grupper, ikke fasiten for én bestemt stilling.
                Erfaring, ansvar, bransje, geografi, arbeidstid og lokale avtaler kan gjøre at
                den faktiske lønnen avviker fra statistikken.
              </p>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/kilder"
              >
                Se kildene og datagrunnlaget
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7f1] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Gå fra spørsmål til et mer konkret beslutningsgrunnlag.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {productLinks.map((item) => (
              <Link
                key={item.href}
                className="group rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-6 shadow-[0_14px_36px_rgba(27,36,48,0.05)] transition hover:-translate-y-0.5 hover:border-[rgba(20,83,45,0.28)]"
                href={item.href}
              >
                <h3 className="text-xl font-extrabold text-slate-950 transition group-hover:text-[var(--primary-strong)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-700">{item.text}</p>
                <span className="mt-5 inline-block text-sm font-extrabold text-[var(--primary-strong)]">
                  Gå videre <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Et uavhengig hobbyprosjekt i løpende utvikling.
            </h2>
          </div>

          <div className="grid gap-5 text-base leading-8 text-slate-700 sm:text-lg">
            <p>
              Lønnsinnsikt utvikles og drives av Håkon Rolfsen som et norsk hobbyprosjekt.
              Virksomheten er registrert som enkeltpersonforetak med organisasjonsnummer
              920 850 324.
            </p>
            <p>
              Prosjektet er ikke en del av Statistisk sentralbyrå eller en offentlig
              myndighet. SSB og andre kilder leverer datagrunnlag, mens utvalg, beregninger,
              presentasjon og redaksjonelle forklaringer er Lønnsinnsikts ansvar.
            </p>
            <p>
              Innhold og verktøy forbedres etter hvert som nye data blir tilgjengelige og
              nettstedet videreutvikles. Feil kan forekomme, og konkrete tilbakemeldinger om
              tall, forklaringer og brukeropplevelse er velkomne.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1 text-base">
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/forfatter/redaksjonen"
              >
                Om Redaksjonen
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/metode"
              >
                Metode
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/redaksjonelle-retningslinjer"
              >
                Redaksjonelle retningslinjer
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/rettelser"
              >
                Rettelser
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/kontakt"
              >
                Kontakt Lønnsinnsikt
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/6 bg-white px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <p className="max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
            Informasjonen på Lønnsinnsikt er generell og erstatter ikke individuell juridisk,
            økonomisk eller karrieremessig rådgivning. Bruk statistikken som ett av flere
            grunnlag, og vurder alltid egen rolle, erfaring, arbeidsavtale og situasjon.
          </p>
        </div>
      </section>
    </main>
  );
}
