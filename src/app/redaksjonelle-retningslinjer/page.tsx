import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

const description =
  "Les hvordan Lønnsinnsikt jobber med redaksjonell kvalitet, kilder, AI og ansvarlig lønnsinnhold.";

const principles = [
  {
    title: "Presist",
    text: "Vi skal forklare lønnstall, begreper og datagrunnlag så nøyaktig som mulig. Når innhold bygger på statistikk, skal kilden være tydelig og tallene presenteres uten overdrivelser.",
  },
  {
    title: "Kildebasert",
    text: "Vi bruker åpne og etterprøvbare kilder, særlig Statistisk sentralbyrå. Når vi omtaler lønn, arbeidsmarked, kjøpekraft eller yrkesdata, skal leseren kunne forstå hvor informasjonen kommer fra.",
  },
  {
    title: "Nyttig",
    text: "Innholdet skal hjelpe brukeren å ta bedre valg i praksis. Vi prioriterer forklaringer, eksempler og konkrete vurderinger fremfor generelle råd som ikke kan brukes.",
  },
  {
    title: "Tydelig om AI",
    text: "AI kan brukes til struktur, språk og forklaring, men skal ikke være kilde til lønnstall. Statistikk og konkrete påstander skal bygge på kontrollerbare datakilder.",
  },
];

export const metadata: Metadata = {
  title: "Redaksjonelle retningslinjer",
  description,
  alternates: {
    canonical: "/redaksjonelle-retningslinjer",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/redaksjonelle-retningslinjer",
    siteName: siteConfig.name,
    title: `Redaksjonelle retningslinjer | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Redaksjonelle retningslinjer | ${siteConfig.name}`,
    description,
  },
};

export default function RedaksjonelleRetningslinjerPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <section className="bg-[#f4f7f1] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
            Redaksjonelle retningslinjer
          </h1>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-12">
          <div className="grid max-w-5xl gap-6 text-base leading-8 text-slate-800">
            <p>
              Hos Lønnsinnsikt jobber vi for å gjøre norske lønnsdata mer tilgjengelige,
              forståelige og nyttige. Det redaksjonelle innholdet vårt skal gi arbeidstakere,
              jobbsøkere, ledere og andre et bedre grunnlag for å forstå lønn, marked og
              lønnsutvikling.
            </p>
            <p>
              Vi ønsker å gi deg informasjon som kan brukes til informerte vurderinger,
              enten du undersøker et yrke, forbereder en lønnssamtale, vurderer et jobbtilbud
              eller prøver å forstå hvordan lønn varierer mellom grupper.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
                Vår redaksjonelle retning
              </h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-slate-800">
                Vi utvikler innhold som skal være saklig, praktisk og etterprøvbart. Disse
                prinsippene styrer hvordan vi skriver, forklarer og oppdaterer innhold.
              </p>
            </div>

            <ul className="grid gap-4" aria-label="Redaksjonelle prinsipper">
              {principles.map((principle) => (
                <li key={principle.title} className="flex gap-3 text-base leading-8 text-slate-800">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-strong)]" />
                  <span>
                    <strong className="font-extrabold text-slate-950">{principle.title}:</strong>{" "}
                    {principle.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-5xl border-t border-[rgba(27,36,48,0.12)] pt-8">
            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              Informasjonen på Lønnsinnsikt er ment som generell informasjon og utgjør ikke
              juridisk, økonomisk eller personlig karriererådgivning. Bruk tallene som et
              beslutningsgrunnlag, og vurder dem sammen med egen situasjon, arbeidsavtale,
              ansvar, erfaring og relevante råd fra fagpersoner der det er nødvendig.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
