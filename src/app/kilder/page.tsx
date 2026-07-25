import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageHero } from "@/components/info-page-hero";
import { siteConfig } from "@/lib/site-config";

const description =
  "Se hvilke kilder Lønnsinnsikt bygger på, og hvordan lønnsdata fra SSB brukes og forklares.";

const sourceLinks = [
  {
    title: "SSB tabell 11418",
    href: "https://www.ssb.no/statbank/table/11418",
    text: "Yrkesfordelt månedslønn etter sektor, kjønn og arbeidstid. Brukes som sentral kilde for medianlønn, gjennomsnitt og lønnsfordeling etter yrke.",
  },
  {
    title: "SSB tabell 11658",
    href: "https://www.ssb.no/statbank/table/11658",
    text: "Detaljerte lønnstall per yrke. Brukes der yrkesnivå og lønnsmål skal forklares mer presist.",
  },
  {
    title: "SSB tabell 09792",
    href: "https://www.ssb.no/statbank/table/09792",
    text: "Sysselsatte etter kjønn og yrke. Brukes for å gi bedre kontekst om størrelsen på yrkesgrupper.",
  },
  {
    title: "SSB tabell 12851",
    href: "https://www.ssb.no/statbank/table/12851",
    text: "Lærlinglønn etter yrke. Brukes på sider som handler om lærlingfag og lønn for lærlinger.",
  },
  {
    title: "SSB tabell 14437",
    href: "https://www.ssb.no/statbank/table/14437",
    text: "Arbeidsforhold etter yrke og avtalt arbeidstid. Brukes som støtte for å forstå arbeidsforhold og kontraktstyper.",
  },
  {
    title: "SSB konsumprisindeksen",
    href: "https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen",
    text: "Brukes når lønn ses i sammenheng med prisvekst og kjøpekraft.",
  },
  {
    title: "Utdanning.no",
    href: "https://utdanning.no/",
    text: "Brukes som støtte for yrkesbeskrivelser der det er relevant å forklare hva et yrke innebærer.",
  },
];

export const metadata: Metadata = {
  title: "Kilder",
  description,
  alternates: {
    canonical: "/kilder",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/kilder",
    siteName: siteConfig.name,
    title: `Kilder | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Kilder | ${siteConfig.name}`,
    description,
  },
};

export default function KilderPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        title="Kilder og datagrunnlag"
        description="Lønnsinnsikt skal være tydelig på hvor tallene kommer fra, hva de kan brukes til og hvilke begrensninger de har."
        imageSrc="/images/hero-kilder-redaksjonell.png"
        imageAlt="Illustrasjon av oppslagsverk, datakilder og kontrollert statistikk"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-12">
          <div className="grid gap-6 text-base leading-8 text-slate-700 sm:text-lg">
            <p>
              Hovedkilden for lønnsdata på Lønnsinnsikt er Statistisk sentralbyrå (SSB).
              SSB publiserer offisiell statistikk gjennom Statistikkbanken, med tabeller som
              kan filtreres etter blant annet yrke, kjønn, sektor, arbeidstid, periode og
              statistikkmål.
            </p>
            <p>
              Når vi viser lønnstall, forsøker vi å skille tydelig mellom selve tallet,
              forklaringen av tallet og praktiske råd. Statistikken kan gi et godt bilde av
              markedet, men den sier ikke alt om én konkret stilling. Ansvar, erfaring,
              bransje, sted, resultater og lokale avtaler kan påvirke faktisk lønn.
            </p>
            <p>
              Der Lønnsinnsikt bruker AI i innholdsarbeid, er formålet å gjøre forklaringer
              mer forståelige og strukturere tekst bedre. AI skal ikke være kilde til
              lønnsstatistikk. Tall, tabeller og konkrete datagrunnlag skal kunne spores til
              åpne kilder.
            </p>
          </div>

          <div className="grid gap-4">
            {sourceLinks.map((source) => (
              <article
                key={source.href}
                className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-5 shadow-[0_14px_36px_rgba(27,36,48,0.05)]"
              >
                <h2 className="text-xl font-extrabold leading-tight text-slate-950">
                  <Link
                    className="text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                    href={source.href}
                  >
                    {source.title}
                  </Link>
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-700">{source.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
