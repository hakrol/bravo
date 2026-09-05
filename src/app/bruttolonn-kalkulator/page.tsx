import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { GrossSalaryCalculatorDashboard } from "@/components/gross-salary-calculator-dashboard";
import { siteConfig } from "@/lib/site-config";

const description =
  "Beregn nettolønn fra bruttolønn eller bruttolønn fra nettolønn med en enkel brutto- og nettolønn kalkulator.";

export const metadata: Metadata = {
  title: "Brutto- og nettolønn kalkulator",
  description,
  alternates: {
    canonical: "/bruttolonn-kalkulator",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/bruttolonn-kalkulator",
    siteName: siteConfig.name,
    title: `Brutto- og nettolønn kalkulator | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Brutto- og nettolønn kalkulator | ${siteConfig.name}`,
    description,
  },
};

export default function BruttolonnKalkulatorPage() {
  return (
    <div className="min-h-screen px-5 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <GrossSalaryCalculatorDashboard />
        <AdSlot placement="bruttolonn-after-tool" />
        <GrossSalaryCalculatorGuide />
        <CalculatorCrossLinks currentHref="/bruttolonn-kalkulator" />
      </div>
    </div>
  );
}

function GrossSalaryCalculatorGuide() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Begreper i brutto- og nettolønn kalkulatoren
        </h2>
        <div className="mt-6 grid gap-8 text-base leading-8 text-slate-600">
          <section className="grid gap-3">
            <p>
              Brutto- og nettolønn kalkulatoren kan brukes begge veier. Du kan beregne nettolønn
              fra bruttolønn, eller beregne omtrent hvilken bruttolønn som må ligge bak en gitt
              nettolønn.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Bruttolønn
            </h3>
            <p>
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/forklarer/bruttolonn"
              >
                Bruttolønn
              </Link>{" "}
              er lønn før skatt, pensjonstrekk og andre trekk. Det er vanligvis bruttolønn som
              brukes i arbeidsavtaler, jobbtilbud og lønnssammenligninger.
            </p>
            <p>
              Når du velger Netto → Brutto, er bruttolønn resultatet du prøver å finne. Da
              regner kalkulatoren bakover fra nettolønn og estimert skattesats.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Netto årslønn
            </h3>
            <p>
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/forklarer/nettolonn"
              >
                Nettolønn
              </Link>{" "}
              er beløpet du sitter igjen med etter skatt og andre trekk. Netto årslønn er derfor
              samlet utbetalt lønn gjennom året, ikke lønnen før trekk.
            </p>
            <p>
              Når du velger Brutto → Netto, er nettolønn resultatet du prøver å finne. Da
              regner kalkulatoren fra bruttolønn til estimert lønn etter trekk.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Skattesats
            </h3>
            <p>
              Skattesatsen brukes til å regne fra netto årslønn til beregnet brutto årslønn. Hvis
              netto årslønn er 420 000 kroner og skattesatsen er 30 prosent, antar kalkulatoren at
              420 000 kroner utgjør 70 prosent av bruttolønnen.
            </p>
            <p>
              Dette er en forenkling. Faktisk skattetrekk kan påvirkes av skattekort, fradrag,
              tabelltrekk, pensjonstrekk og andre forhold som ikke ligger i denne kalkulatoren.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Brutto månedslønn og timelønn
            </h3>
            <p>
              Når brutto årslønn er beregnet, deler kalkulatoren tallet på 12 for å vise brutto
              månedslønn. Timelønn beregnes ut fra antall timer per uke og 52 uker per år.
            </p>
            <p>
              Dette gjør det enklere å sammenligne nettobeløpet ditt med lønnstall som ofte oppgis
              som brutto årslønn, brutto månedslønn eller brutto timelønn.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Timer per uke
            </h3>
            <p>
              Timer per uke brukes til å regne timelønn om til årslønn, og motsatt. Mange bruker
              37,5 timer som standard, men noen arbeidsforhold bruker for eksempel 35,5, 36 eller
              40 timer.
            </p>
            <p>
              Hvis du vil sammenligne to lønnstilbud, bør du kontrollere at begge bygger på samme
              arbeidstid. En høyere månedslønn kan gi lavere timelønn hvis arbeidstiden også er
              høyere.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Feriepengesats
            </h3>
            <p>
              Feriepengesatsen brukes til å anslå feriepenger basert på bruttolønn. Vanlige satser
              er 10,2 prosent og 12 prosent, men hva som gjelder for deg avhenger av ferieordning,
              alder, avtale og tariff.
            </p>
            <p>
              Estimatet i kalkulatoren er bare en enkel omregning. Faktisk feriepengegrunnlag kan
              avvike fra vanlig årslønn fordi det handler om hva som inngår i grunnlaget for
              feriepenger.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Bruttolønn og nettolønn
            </h3>
            <p>
              Kalkulatoren bruker en forenklet prosentmodell. Den er nyttig for raske overslag,
              men faktisk lønnsslipp kan avvike fordi skatt, pensjon, fradrag og andre trekk
              varierer.
            </p>
            <p>
              Vil du lese mer om begrepene, se forklaringene av{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/forklarer/nettolonn"
              >
                nettolønn
              </Link>
              {" "}og{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/forklarer/bruttolonn"
              >
                bruttolønn
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
