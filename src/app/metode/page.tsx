import type { Metadata } from "next";
import Link from "next/link";
import { editorialIdentity } from "@/lib/editorial-identity";
import { siteConfig } from "@/lib/site-config";

const description =
  "Les hvordan Lønnsinnsikt henter, bearbeider, kontrollerer og forklarer lønnsdata, og hvordan AI brukes i arbeidet.";

const workflow = [
  {
    title: "1. Kildevalg",
    text: "Vi velger åpne og etterprøvbare kilder som er relevante for spørsmålet. Statistisk sentralbyrå er hovedkilden for lønns- og arbeidsmarkedsdata.",
  },
  {
    title: "2. Innhenting",
    text: "Data hentes fra de aktuelle tabellene og periodene. Vi forsøker å bevare kildens begreper, enheter og avgrensninger gjennom behandlingen.",
  },
  {
    title: "3. Bearbeiding",
    text: "Tall kan filtreres, sammenstilles eller omregnes for å gjøre dem lettere å bruke. Egne beregninger merkes og skal kunne forklares med en tydelig formel eller forutsetning.",
  },
  {
    title: "4. Kontroll",
    text: "Vi kontrollerer sentrale tall mot kilden, ser etter uventede avvik og vurderer om teksten skiller tydelig mellom fakta, beregning og råd.",
  },
  {
    title: "5. Publisering og oppdatering",
    text: "Siden skal vise hvilken periode tallene gjelder for. Innhold oppdateres når nye data er tilgjengelige eller når en dokumentert feil blir oppdaget.",
  },
];

export const metadata: Metadata = {
  title: "Metode",
  description,
  alternates: {
    canonical: "/metode",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/metode",
    siteName: siteConfig.name,
    title: `Metode | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary",
    title: `Metode | ${siteConfig.name}`,
    description,
  },
};

export default function MetodePage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <section className="bg-[#f4f7f1] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
            Åpenhet
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-tight text-slate-950 sm:text-6xl">
            Metode
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Slik arbeider Lønnsinnsikt med kilder, databehandling, beregninger, redaksjonell
            kontroll og bruk av AI.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-14">
          <div className="grid gap-6 text-base leading-8 text-slate-700 sm:text-lg">
            <p>
              Formålet er å gjøre norske lønnsdata lettere å forstå uten å skjule hva
              tallene bygger på eller hvor usikkerheten ligger. Vi forsøker derfor å vise
              dataperiode, kilde og relevante avgrensninger nær presentasjonen av tallene.
            </p>
            <p>
              Statistikken beskriver grupper og kan ikke fastslå riktig lønn for én bestemt
              person. Erfaring, ansvar, arbeidstid, tillegg, sektor, bransje, geografi og
              lokale avtaler kan gi store forskjeller som ikke alltid fremgår av
              yrkesstatistikken.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
              Fra kilde til publisert side
            </h2>
            <div className="mt-7 grid gap-4">
              {workflow.map((step) => (
                <article
                  className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-6 shadow-[0_14px_36px_rgba(27,36,48,0.04)]"
                  key={step.title}
                >
                  <h3 className="text-xl font-extrabold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-base leading-8 text-slate-700">{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-10 border-t border-[rgba(27,36,48,0.12)] pt-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
                Datakilder
              </h2>
              <div className="mt-5 grid gap-4 text-base leading-8 text-slate-700">
                <p>
                  SSB er hovedkilden for lønn, sysselsetting, arbeidstid, lærlinglønn og
                  prisutvikling. Utdanning.no kan brukes som støtte for faktabaserte
                  yrkesbeskrivelser.
                </p>
                <p>
                  Den konkrete tabellen eller kilden oppgis på relevante sider og i
                  kildeoversikten.
                </p>
                <Link
                  className="w-fit font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                  href="/kilder"
                >
                  Se alle sentrale kilder
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
                Beregninger og estimater
              </h2>
              <div className="mt-5 grid gap-4 text-base leading-8 text-slate-700">
                <p>
                  Når månedslønn omregnes til årslønn, brukes normalt tolv måneder. Estimert
                  timelønn, skatt, feriepenger og andre omregninger bygger på forutsetningene
                  som vises i det aktuelle verktøyet eller på siden.
                </p>
                <p>
                  Reallønnsberegninger sammenholder lønnsutvikling med relevant prisutvikling.
                  Slike resultater er beregninger, ikke egne publiserte SSB-tall, og skal
                  presenteres som dette.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[5px] border border-[rgba(20,83,45,0.18)] bg-[#f4f7f1] p-6 sm:p-8">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
              Hvordan AI brukes
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-slate-700">
              <p>
                AI-verktøy kan brukes som støtte til idéutvikling, struktur, språkbearbeiding,
                kodearbeid og forslag til kontrollpunkter. AI er ikke en kilde til
                lønnstall og skal ikke erstatte de åpne kildene som konkrete påstander bygger
                på.
              </p>
              <p>
                AI-genererte utkast og analyser kan inneholde feil. Innhold som publiseres,
                er Lønnsinnsikts ansvar og skal vurderes mot datagrunnlaget og de
                redaksjonelle retningslinjene. AI-genererte illustrasjoner merkes når de
                brukes.
              </p>
            </div>
          </div>

          <div className="grid gap-5 border-t border-[rgba(27,36,48,0.12)] pt-10">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
              Oppdateringer og feil
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-700">
              Metoden reduserer risikoen for feil, men kan ikke fjerne den. Hvis du finner
              et tall, en beregning eller en forklaring som virker feil, kan du kontakte
              Redaksjonen. Vesentlige rettelser skal håndteres åpent og så raskt som
              kapasiteten i hobbyprosjektet tillater.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/rettelser"
              >
                Meld fra om en feil
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href={editorialIdentity.authorPath}
              >
                Om Redaksjonen
              </Link>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-500">Sist oppdatert 24. juli 2026.</p>
        </div>
      </section>
    </main>
  );
}
