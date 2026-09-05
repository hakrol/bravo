import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import Link from "next/link";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { LoanCalculatorDashboard } from "@/components/loan-calculator-dashboard";
import { siteConfig } from "@/lib/site-config";

const description =
  "Beregn hvor mye du kan låne til bolig med inntektsgrense, betjeningsevne, egenkapital, rentesensitivitet og månedlig kostnad.";

export const metadata: Metadata = {
  title: "Lånekalkulator: hvor mye kan jeg låne?",
  description,
  alternates: {
    canonical: "/lanekalkulator",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/lanekalkulator",
    siteName: siteConfig.name,
    title: `Lånekalkulator: hvor mye kan jeg låne? | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Lånekalkulator: hvor mye kan jeg låne? | ${siteConfig.name}`,
    description,
  },
};

export default function LanekalkulatorPage() {
  return (
    <div className="min-h-screen px-5 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <LoanCalculatorDashboard />
        <AdSlot placement="lanekalkulator-after-tool" />
        <LoanCalculatorGuide />
        <CalculatorCrossLinks currentHref="/lanekalkulator" />
      </div>
    </div>
  );
}

function LoanCalculatorGuide() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Slik bruker du lånekalkulatoren
        </h2>
        <div className="mt-6 grid gap-8 text-base leading-8 text-slate-600">
          <section className="grid gap-3">
            <p>
              Lånekalkulatoren viser tre parallelle grenser: inntekt, betjeningsevne og
              egenkapital. Det laveste tallet blir den veiledende låneevnen, fordi det er denne
              faktoren som stopper lånet først.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              De tre grensene
            </h3>
            <p>
              Inntektsgrensen beregnes som fem ganger brutto årsinntekt minus eksisterende gjeld.
              Dette følger hovedregelen om samlet gjeldsgrad i Utlånsforskriften.
            </p>
            <p>
              Betjeningsevnen beregnes ved å teste om økonomien tåler høyere rente etter
              livsopphold og annen gjeld. Kalkulatoren bruker en forenklet modell, men viser
              tydelig hvordan rente og nedbetalingstid påvirker låneevnen.
            </p>
            <p>
              Egenkapitalgrensen tar utgangspunkt i at nedbetalingslån med pant i bolig normalt
              ikke skal overstige 90 % av forsvarlig boligverdi.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva resultatet betyr
            </h3>
            <p>
              Hovedtallet viser omtrent hvor mye du kan låne. Under ser du hvilken faktor som er
              flaskehals, og hva som kan gi størst effekt videre: høyere inntekt, lavere gjeld,
              mer egenkapital eller lavere månedskostnad.
            </p>
            <p>
              Rentesensitiviteten viser hvor sårbart lånet er ved ulike rentenivåer. Månedlig
              kostnad viser både terminbeløp og første måneds fordeling mellom renter og avdrag.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Begreper i lånekalkulatoren
            </h3>
            <p>
              <strong className="font-semibold text-slate-950">Låneevne:</strong> hvor mye
              banken omtrent kan vurdere at du har økonomi til å låne. I kalkulatoren vises
              låneevnen som laveste verdi av inntektsgrense, betjeningsevne og egenkapital.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Årsinntekt:</strong> brutto
              inntekt før skatt. Hvis dere er flere som søker sammen, bør samlet brutto
              årsinntekt legges inn.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Eksisterende gjeld:</strong> gjeld
              du allerede har, for eksempel studielån, billån, kredittkortgjeld, forbrukslån eller
              andre lån. Denne gjelden teller med når samlet gjeldsgrad beregnes.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Gjeldsgrad:</strong> samlet gjeld i
              forhold til brutto årsinntekt. Hovedregelen i Utlånsforskriften er at samlet gjeld
              normalt ikke skal overstige 5 ganger årsinntekt.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Egenkapital:</strong> pengene du
              selv stiller med i boligkjøpet. Jo mer egenkapital du har, desto høyere boligpris kan
              du normalt tåle innenfor kravet til belåningsgrad.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Belåningsgrad:</strong> hvor stor
              del av boligverdien som finansieres med lån. For nedbetalingslån med pant i bolig er
              hovedregelen at lånet normalt ikke skal overstige 90 % av forsvarlig boligverdi.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Betjeningsevne:</strong> hvor mye
              du kan betale hver måned etter skatt, livsopphold og eksisterende gjeld. Banken
              vurderer om du tåler både renter, avdrag og vanlige utgifter.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Rentestress:</strong> at lånet
              testes med høyere rente enn dagens rente. Kalkulatoren bruker rente pluss 3
              prosentpoeng, men minst 7 %, for å vise om økonomien tåler renteøkning.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Rente:</strong> prisen du betaler
              for å låne penger. Høyere rente gir høyere terminbeløp og lavere betjeningsevne,
              mens lavere rente kan øke hvor mye du kan betjene.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Nedbetalingstid:</strong> hvor
              mange år lånet betales ned over. Lengre nedbetalingstid gir lavere terminbeløp, men
              samlet rentekostnad over lånets levetid blir høyere.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Voksne i husstanden:</strong>{" "}
              brukes til å anslå normale levekostnader i betjeningsevnen. Kalkulatoren legger inn
              12 000 kroner per måned per voksen, i tillegg til et fast husholdningsbeløp på 4 000
              kroner per måned. Inntekten bør legges inn samlet hvis dere søker sammen.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Barn i husstanden:</strong> øker
              beregnet livsopphold i modellen. Kalkulatoren legger inn 6 500 kroner per måned per
              barn. Det betyr at mer av inntekten antas å gå til faste hverdagsutgifter, og mindre
              blir tilgjengelig til å betjene boliglån.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Terminbeløp:</strong> beløpet du
              betaler på lånet hver måned. Det består vanligvis av både renter og avdrag.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Renter:</strong> kostnaden for å
              låne pengene. <strong className="font-semibold text-slate-950">Avdrag:</strong>{" "}
              delen av terminbeløpet som faktisk betaler ned lånet.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Flaskehals:</strong> faktoren som
              begrenser lånet mest. Hvis egenkapital er flaskehalsen, hjelper mer egenkapital mest.
              Hvis betjeningsevne er flaskehalsen, hjelper lavere månedskostnad, lavere rente
              eller lavere annen gjeld mest.
            </p>
            <p>
              <strong className="font-semibold text-slate-950">Omvendt kalkulator:</strong> viser
              omtrent hvilken brutto årsinntekt og egenkapital som kreves for et ønsket lånebeløp,
              gitt forutsetningene du har lagt inn.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Viktig å vite
            </h3>
            <p>
              Dette er en veiledende beregning og ikke et lånetilbud, finansieringsbevis eller en
              garanti for hvor mye du får låne. Kalkulatoren bruker forenklede forutsetninger og
              kan avvike fra bankens vurdering.
            </p>
            <p>
              Kalkulatoren tar utgangspunkt i Utlånsforskriften, tidligere omtalt som
              boliglånsforskriften. Hovedreglene som brukes her er at samlet gjeld normalt ikke
              skal overstige 5 ganger inntekt, at boliglån normalt ikke skal overstige 90 % av
              boligverdien, og at betjeningsevnen skal tåle rentestress.
            </p>
            <p>
              Betjeningsevne beregnes med rentestress på +3 prosentpoeng, minst 7 %. Modellen
              bruker forenklede satser for livsopphold, der antall voksne og barn øker beregnede
              husholdningsutgifter med 12 000 kroner per voksen per måned, 6 500 kroner per barn
              per måned og 4 000 kroner i fast husholdningsbeløp.
            </p>
            <p>
              Livsoppholdssatsene i kalkulatoren er ikke offisielle satser. De er forenklede og
              avrundede modellanslag inspirert av{" "}
              <a
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="https://www.oslomet.no/no/om/sifo/referansebudsjettet"
                rel="noreferrer"
                target="_blank"
              >
                SIFOs referansebudsjett for forbruksutgifter
              </a>
              , som viser alminnelige forbruksutgifter for ulike typer husholdninger.
            </p>
            <p>
              Eksisterende gjeld trekkes fra inntektsgrensen og inngår i betjeningsevnen. I denne
              kalkulatoren antas eksisterende gjeld å betjenes over samme nedbetalingstid som
              boliglånet, fordi feltet kan inneholde både studielån, billån og annen langsiktig
              gjeld.
            </p>
            <p>
              Reglene for gjeldsgrad, betjeningsevne og belåningsgrad er basert på{" "}
              <a
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648"
                rel="noreferrer"
                target="_blank"
              >
                Utlånsforskriften hos Lovdata
              </a>
              .
            </p>
            <p>
              Kontakt banken din for riktige tall for din situasjon. Banken vurderer blant annet
              inntekt, eksisterende gjeld, faste utgifter, barn, sikkerhet, fellesgjeld,
              kredittscore, fleksibilitetskvote og dokumentasjon før de gir endelig svar.
            </p>
            <p>
              Vil du sammenligne låneevnen med lønnstall, kan du også bruke{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/lonnskalkulator"
              >
                lønnskalkulatoren
              </Link>{" "}
              eller utforske{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/yrker"
              >
                lønn etter yrke
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
