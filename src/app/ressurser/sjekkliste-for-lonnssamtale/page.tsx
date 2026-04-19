import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { siteConfig } from "@/lib/site-config";

const description =
  "En praktisk sjekkliste før lønnssamtale, med punkter for lønnsdata, resultater, argumenter, ønsket nivå og plan for samtalen.";

const checklistSections = [
  {
    title: "1. Finn riktig sammenligningsgrunnlag",
    items: [
      "Sjekk lønnsnivå for yrket ditt, helst med medianlønn og ikke bare gjennomsnitt.",
      "Sammenlign med samme type rolle, ansvarsnivå og bransje der det er mulig.",
      "Noter om tallene gjelder månedslønn eller årslønn, og hvilken periode de er hentet fra.",
      "Vurder om erfaring, geografi, utdanning eller særskilt kompetanse gjør at du bør ligge over eller under medianen.",
    ],
  },
  {
    title: "2. Skriv ned hva du faktisk har levert",
    items: [
      "Lag tre til fem konkrete resultater fra det siste året.",
      "Knytt resultatene til verdi for arbeidsgiver, for eksempel inntekt, effektivitet, kvalitet, kundetilfredshet eller ansvar.",
      "Ta med oppgaver du har overtatt, prosjekter du har løftet eller kompetanse du har bygget.",
      "Skill mellom det som er forventet i rollen, og det som viser at du har tatt et større ansvar.",
    ],
  },
  {
    title: "3. Bestem nivået du vil be om",
    items: [
      "Sett et konkret ønsket lønnsnivå før samtalen.",
      "Regn om ønsket økning til både kroner per måned og kroner per år.",
      "Definer et lavere nivå du fortsatt kan akseptere, og hva du vil be om hvis arbeidsgiver ikke kan møte lønnskravet nå.",
      "Forbered en kort begrunnelse som kobler ønsket nivå til marked, ansvar og resultater.",
    ],
  },
  {
    title: "4. Forbered formuleringen din",
    items: [
      "Start med at du ønsker en ryddig vurdering av lønnen din, ikke med misnøye alene.",
      "Bruk tall og konkrete leveranser før du nevner ønsket nivå.",
      "Øv på en setning som er tydelig, rolig og enkel å si høyt.",
      "Forbered svar på vanlige innvendinger, for eksempel budsjett, timing eller behov for mer dokumentasjon.",
    ],
  },
  {
    title: "5. Avtal neste steg",
    items: [
      "Be om en tydelig konklusjon eller en dato for når du får svar.",
      "Spør hva som konkret skal til for høyere lønn hvis svaret er nei eller utsettes.",
      "Noter hvem som følger opp, hva som skal vurderes og når dere skal ta samtalen videre.",
      "Send en kort oppsummering etter møtet hvis dere avtalte nye mål, ny vurdering eller videre prosess.",
    ],
  },
] as const;

const noteFields = [
  "Mitt nåværende lønnsnivå",
  "Relevant markedstall eller medianlønn",
  "Ønsket nytt lønnsnivå",
  "Min viktigste begrunnelse",
  "Neste steg etter samtalen",
] as const;

export const metadata: Metadata = {
  title: "Sjekkliste før lønnssamtale",
  description,
  alternates: {
    canonical: "/ressurser/sjekkliste-for-lonnssamtale",
  },
  openGraph: {
    type: "article",
    locale: "nb_NO",
    url: "/ressurser/sjekkliste-for-lonnssamtale",
    siteName: siteConfig.name,
    title: `Sjekkliste før lønnssamtale | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Sjekkliste før lønnssamtale | ${siteConfig.name}`,
    description,
  },
};

export default function SjekklisteForLonnssamtalePage() {
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
                  Sjekkliste før lønnssamtale
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-[var(--muted)] print:text-base print:leading-7">
                  Bruk listen til å samle fakta, argumenter og konkrete mål før møtet. Du kan krysse
                  av underveis, skrive ut siden eller velge «Lagre som PDF» i utskriftsdialogen.
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
            Mine notater før samtalen
          </h2>
          <div className="mt-5 grid gap-4">
            {noteFields.map((field) => (
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
