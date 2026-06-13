import type { Metadata } from "next";
import Link from "next/link";
import { LoanPaymentCalculatorDashboard } from "@/components/loan-payment-calculator-dashboard";
import { siteConfig } from "@/lib/site-config";

const description =
  "Beregn renter, avdrag, terminbeløp og total lånekostnad med annuitetslån eller serielån.";

export const metadata: Metadata = {
  title: "Rente- og avdragskalkulator",
  description,
  alternates: {
    canonical: "/rente-og-avdrag-kalkulator",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/rente-og-avdrag-kalkulator",
    siteName: siteConfig.name,
    title: `Rente- og avdragskalkulator | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Rente- og avdragskalkulator | ${siteConfig.name}`,
    description,
  },
};

export default function RenteOgAvdragKalkulatorPage() {
  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <LoanPaymentCalculatorDashboard />
        <LoanPaymentCalculatorGuide />
      </div>
    </div>
  );
}

function LoanPaymentCalculatorGuide() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Slik bruker du rente- og avdragskalkulatoren
        </h2>
        <div className="mt-6 grid gap-8 text-base leading-8 text-slate-600">
          <section className="grid gap-3">
            <p>
              Legg inn lånebeløp, nominell rente og nedbetalingstid. Kalkulatoren viser
              terminbeløp, renter, avdrag, samlet rentekostnad og en enkel nedbetalingsplan for de
              første 12 månedene.
            </p>
            <p>
              Du kan bytte mellom annuitetslån og serielån for å se hvordan betalingsprofilen
              endrer seg. Tallene oppdateres direkte når du endrer forutsetningene.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Annuitetslån eller serielån
            </h3>
            <p>
              <strong className="font-semibold text-slate-950">Annuitetslån</strong> har normalt
              samme terminbeløp hver måned. I starten går en større del av betalingen til renter,
              mens avdragsdelen blir større etter hvert som restgjelden faller.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Serielån</strong> har samme avdrag
              hver måned. Rentene beregnes av restgjelden, så terminbeløpet er høyest i starten og
              lavere mot slutten av lånet.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Renter, avdrag og total kostnad
            </h3>
            <p>
              Terminbeløpet er summen av renter og avdrag i en måned. Renter er prisen du betaler
              for å låne pengene, mens avdrag er delen som faktisk reduserer gjelden.
            </p>
            <p>
              Totale renter viser hvor mye lånet koster gjennom hele nedbetalingstiden med renten
              du har lagt inn. Lengre nedbetalingstid gir lavere månedlig betaling, men vanligvis
              høyere samlet rentekostnad.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Viktig å vite
            </h3>
            <p>
              Dette er en forenklet beregning. Den tar ikke hensyn til etableringsgebyr,
              termingebyr, effektiv rente, skattefradrag, avdragsfrihet eller renteendringer
              underveis.
            </p>
            <p>
              Vil du heller beregne hvor mye du kan låne, bruker du den vanlige{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/lanekalkulator"
              >
                lånekalkulatoren
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
