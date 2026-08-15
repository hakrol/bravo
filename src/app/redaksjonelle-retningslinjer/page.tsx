import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageHero } from "@/components/info-page-hero";
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

const informationPages = [
  { href: "/om", label: "Om" },
  { href: "/kilder", label: "Kilder" },
  { href: "/forfatter/redaksjonen", label: "Redaksjonen" },
  { href: "/metode", label: "Metode" },
  {
    href: "/redaksjonelle-retningslinjer",
    label: "Redaksjonelle retningslinjer",
  },
] as const;

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
      <InfoPageHero
        title="Redaksjonelle retningslinjer"
        description="Prinsippene for redaksjonell kvalitet, kildebruk, AI og ansvarlig lønnsinnhold hos Lønnsinnsikt."
        imageSrc="/images/hero-redaksjonelle-retningslinjer.png"
        imageAlt="Illustrasjon av redaksjonelle prinsipper, balanse og kvalitetskontroll"
      />

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

          <nav
            aria-label="Andre informasjonssider"
            className="flex flex-wrap gap-3 border-t border-[rgba(27,36,48,0.12)] pt-12"
          >
            {informationPages.map((page) => (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-[5px] border border-[rgba(20,83,45,0.24)] bg-white px-5 py-2.5 text-sm font-extrabold text-[var(--primary-strong)] transition-colors hover:border-[var(--primary-strong)] hover:bg-[var(--primary-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                href={page.href}
                key={page.href}
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
