import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { siteConfig } from "@/lib/site-config";

const description =
  "En praktisk sjekkliste som hjelper deg å vurdere om du har grunnlag for å be om høyere lønn.";

const checklistSections = [
  {
    title: "1. Sammenlign lønnen din med markedet",
    items: [
      "Finn medianlønn for yrket ditt og sammenlign den med din egen brutto månedslønn.",
      "Sjekk om du sammenligner med riktig rolle, ansiennitet, ansvarsnivå og bransje.",
      "Se om lønnen din ligger tydelig under, rundt eller over det som er vanlig for rollen.",
      "Vurder om du har særskilt kompetanse, sertifiseringer eller erfaring som bør trekke lønnen opp.",
    ],
  },
  {
    title: "2. Vurder om rollen din har blitt større",
    items: [
      "Har du fått flere oppgaver, større ansvar eller mer selvstendig beslutningsmyndighet?",
      "Har du overtatt ansvar fra andre uten at lønnen er justert?",
      "Har du blitt en person andre lærer av, spør om hjelp eller er avhengige av i hverdagen?",
      "Har stillingen din i praksis blitt mer krevende enn stillingstittelen tilsier?",
    ],
  },
  {
    title: "3. Dokumenter verdien du skaper",
    items: [
      "Skriv ned konkrete resultater fra de siste 6 til 12 månedene.",
      "Koble resultatene til verdi for arbeidsgiver, som bedre kvalitet, høyere salg, lavere kostnader eller mer effektive prosesser.",
      "Ta med positive tilbakemeldinger, måloppnåelse, prosjekter, kundeeffekt eller forbedringer du har bidratt til.",
      "Skil mellom generell innsats og resultater som gjør deg mer verdifull enn før.",
    ],
  },
  {
    title: "4. Sjekk timing og rammer",
    items: [
      "Vurder om du nærmer deg medarbeidersamtale, lønnsoppgjør, budsjettprosess eller avslutning av et viktig prosjekt.",
      "Sjekk om virksomheten har økonomi, vekst eller behov som gjør tidspunktet realistisk.",
      "Tenk gjennom om du nylig har fått lønnsjustering, ny rolle eller nye fordeler.",
      "Hvis timingen er dårlig, skriv ned når det vil være riktig å ta samtalen.",
    ],
  },
  {
    title: "5. Vurder styrken i argumentet ditt",
    items: [
      "Du har et sterkere grunnlag hvis markedstall, ansvar og resultater peker i samme retning.",
      "Du har et svakere grunnlag hvis ønsket først og fremst handler om personlig økonomi eller generell misnøye.",
      "Du bør kunne forklare hvorfor lønnen bør endres nå, ikke bare hvorfor du ønsker mer.",
      "Hvis argumentet fortsatt er tynt, lag en plan for hvilke resultater eller ansvar du må bygge først.",
    ],
  },
] as const;

const decisionFields = [
  "Min nåværende lønn",
  "Relevant markedstall",
  "Hva taler for at jeg bør be om mer lønn?",
  "Hva taler mot å be akkurat nå?",
  "Min konklusjon og neste steg",
] as const;

export const metadata: Metadata = {
  title: "Sjekkliste: Kan jeg be om mer lønn?",
  description,
  alternates: {
    canonical: "/ressurser/sjekkliste-vurdere-mer-lonn",
  },
  openGraph: {
    type: "article",
    locale: "nb_NO",
    url: "/ressurser/sjekkliste-vurdere-mer-lonn",
    siteName: siteConfig.name,
    title: `Sjekkliste: Kan jeg be om mer lønn? | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Sjekkliste: Kan jeg be om mer lønn? | ${siteConfig.name}`,
    description,
  },
};

export default function SjekklisteVurdereMerLonnPage() {
  return (
    <div className="min-h-screen px-5 py-10 print:bg-white print:px-0 print:py-0 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <article className="mx-auto flex w-full max-w-5xl flex-col gap-10 print:max-w-none print:gap-6">
        <header className="fade-up grid gap-6 print:gap-3">
          <div className="print:hidden">
            <Link
              className="text-sm font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
              href="/ressurser"
            >
              Tilbake til ressurser
            </Link>
          </div>

          <div className="grid gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)] print:text-xs">
              Sjekkliste
            </p>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid max-w-4xl gap-4">
                <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl print:text-3xl">
                  Kan jeg be om mer lønn?
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-[var(--muted)] print:text-base print:leading-7">
                  Bruk sjekklisten til å vurdere om du har et godt grunnlag før du ber om høyere
                  lønn. Målet er ikke å finne ett perfekt svar, men å se om marked, ansvar,
                  resultater og timing peker i samme retning.
                </p>
              </div>
              <PrintButton />
            </div>
          </div>
        </header>

        <section className="fade-up-delay grid gap-5 print:gap-3" aria-label="Sjekklistepunkter">
          {checklistSections.map((section) => (
            <section
              className="rounded-[5px] border border-[var(--border)] bg-white p-5 shadow-[0_14px_36px_rgba(27,36,48,0.06)] print:break-inside-avoid print:border-slate-300 print:p-4 print:shadow-none sm:p-6"
              key={section.title}
            >
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 print:text-lg">
                {section.title}
              </h2>
              <ul className="mt-4 grid gap-3">
                {section.items.map((item) => (
                  <li className="flex gap-3 text-base leading-7 text-[var(--foreground)]" key={item}>
                    <input
                      aria-label={item}
                      className="mt-1 h-5 w-5 shrink-0 rounded-[3px] border border-slate-400 accent-[var(--primary-strong)]"
                      type="checkbox"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </section>

        <section className="rounded-[5px] border border-[var(--border)] bg-[rgba(255,250,243,0.78)] p-5 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 sm:p-6">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Min vurdering
          </h2>
          <div className="mt-5 grid gap-4">
            {decisionFields.map((field) => (
              <label className="grid gap-2" key={field}>
                <span className="text-sm font-semibold text-[var(--foreground)]">{field}</span>
                <textarea
                  className="min-h-28 resize-y rounded-[5px] border border-[var(--border)] bg-white px-3 py-3 text-base leading-7 text-[var(--foreground)] outline-none transition focus:border-[rgba(20,83,45,0.45)] focus:ring-2 focus:ring-[rgba(20,83,45,0.12)] print:min-h-24 print:resize-none print:border-slate-300 print:ring-0"
                  rows={4}
                />
              </label>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
