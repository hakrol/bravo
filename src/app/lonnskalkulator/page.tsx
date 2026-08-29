import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import Link from "next/link";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import { SalaryCalculatorDashboard } from "@/components/salary-calculator-dashboard";
import { siteConfig } from "@/lib/site-config";

const description =
  "Beregn brutto, netto, timelønn, daglønn, skatt og feriepenger med en moderne lønnskalkulator for norske arbeidstakere.";

export const metadata: Metadata = {
  title: "Lønnskalkulator: beregn brutto, netto og feriepenger",
  description,
  alternates: {
    canonical: "/lonnskalkulator",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/lonnskalkulator",
    siteName: siteConfig.name,
    title: `Lønnskalkulator: beregn brutto, netto og feriepenger | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Lønnskalkulator: beregn brutto, netto og feriepenger | ${siteConfig.name}`,
    description,
  },
};

export default function LonnskalkulatorPage() {
  return (
    <div className="min-h-screen px-5 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <CalculatorCrossLinks currentHref="/lonnskalkulator" />
        <SalaryCalculatorDashboard />
        <AdSlot placement="lonnskalkulator-after-tool" />
        <SalaryCalculatorGuide />
      </div>
    </div>
  );
}

function SalaryCalculatorGuide() {
  return (
    <article className="px-1 py-4 sm:px-2 sm:py-6 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
          Slik bruker du lønnskalkulatoren
        </h2>
        <div className="mt-6 grid gap-8 text-base leading-8 text-slate-600">
          <section className="grid gap-3">
            <p>
              Lønnskalkulatoren hjelper deg å beregne brutto lønn, netto lønn, timelønn,
              daglønn, skatt, feriepenger og ferietrekk. Du kan bruke den enten du kjenner
              årslønnen, månedslønnen eller timelønnen din.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Arbeidstid og stillingsprosent
            </h3>
          <p>
            Først legger du inn hvor mange timer som tilsvarer 100 % stilling hos deg. For mange
            er dette 37,5 timer per uke, men noen bruker for eksempel 40 timer.
          </p>
          <p>
            Deretter legger du inn hvor mange timer du faktisk jobber per uke.
            Kalkulatoren bruker dette til å beregne stillingsprosenten din automatisk.
          </p>
          <p>
            Hvis du har en avtalt stillingsprosent som avviker fra timene du legger inn, kan du
            skrive den inn manuelt.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Begreper i lønnskalkulatoren
            </h3>
            <p>
              Når du bruker en lønnskalkulator, møter du flere begreper som ofte brukes i
              arbeidsavtaler, lønnsslipper og stillingsannonser. Her er en enkel forklaring på de
              viktigste begrepene.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva er brutto lønn?
            </h3>
            <p>
              Brutto lønn er lønnen din før skatt og andre trekk. Hvis du har en avtalt årslønn
              på 600 000 kroner, er dette vanligvis brutto årslønn. Det betyr at skatt ikke er
              trukket fra ennå.
            </p>
            <p>
              Brutto lønn brukes ofte når arbeidsgivere oppgir lønn i kontrakt, jobbannonse eller
              lønnsforhandling. Derfor er brutto lønn et viktig utgangspunkt når du skal beregne
              månedslønn, timelønn og netto utbetaling.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva er netto lønn?
            </h3>
            <p>
              Netto lønn er det du sitter igjen med etter at skatt er trukket fra. Det er ofte
              dette tallet folk mener når de spør hvor mye de får utbetalt på konto.
            </p>
            <p>
              I kalkulatoren beregnes netto lønn med en enkel skatteprosent. Det gir et nyttig
              estimat, men faktisk netto utbetaling kan variere ut fra skattekort, fradrag,
              tabelltrekk og andre forhold.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva er årslønn, månedslønn og timelønn?
            </h3>
            <p>
              Årslønn er lønnen du tjener i løpet av ett år før skatt. Månedslønn er årslønnen
              fordelt på 12 måneder. Timelønn viser hvor mye lønnen tilsvarer per arbeidstime.
            </p>
            <p>
              Hvis du kjenner én av disse lønnstypene, kan kalkulatoren regne ut de andre. Dette
              er nyttig hvis du for eksempel har fått oppgitt årslønn, men vil vite hva det
              tilsvarer per måned eller per time.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva betyr stillingsprosent?
            </h3>
            <p>
              Stillingsprosent sier hvor stor del av en full stilling du jobber. Hvis full
              stilling er 37,5 timer per uke og du jobber 30 timer, tilsvarer det 80 %
              stilling.
            </p>
            <p>
              Stillingsprosenten påvirker lønnen direkte. En årslønn i 100 % stilling må derfor
              justeres ned hvis du jobber deltid.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva er feriepenger?
            </h3>
            <p>
              Feriepenger er penger du får i forbindelse med ferie. De skal erstatte vanlig lønn
              når du tar ferie, og beregnes vanligvis som en prosent av lønnen du tjente året før.
            </p>
            <p>
              Vanlige feriepengesatser er 10,2 % og 12 %. Satsen på 12 % brukes ofte når du har
              fem ferieuker. Kalkulatoren lar deg endre feriepengesatsen slik at du kan tilpasse
              beregningen til din situasjon.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva betyr ferieuker og ferietrekk?
            </h3>
            <p>
              Ferieuker er antall uker ferie som brukes i beregningen. Mange arbeidstakere har
              fem ferieuker, men dette kan variere.
            </p>
            <p>
              Ferietrekk er et trekk i lønn som gjøres fordi du ikke får vanlig lønn for
              feriedagene på samme måte som en ordinær arbeidsmåned. I stedet får du feriepenger.
              Derfor kan utbetalingen i feriemåneden se annerledes ut enn en vanlig månedslønn.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Årslønn, månedslønn og timelønn
            </h3>
          <p>
            Du trenger bare å fylle inn én lønnstype. Hvis du skriver inn årslønn, beregnes
            månedslønn og timelønn automatisk.
          </p>
          <p>
            Hvis du heller kjenner månedslønnen din, kan du bruke den som utgangspunkt.
            Kalkulatoren regner da om til årslønn og timelønn.
          </p>
          <p>
            Timelønn beregnes med utgangspunkt i arbeidstid per uke og antall uker i året.
          </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Skatt og netto lønn
            </h3>
          <p>
            Skattefeltet bruker en enkel prosentmodell. Det betyr at kalkulatoren trekker en fast
            prosent av brutto lønn for å gi et estimat på netto lønn.
          </p>
          <p>
            Dette er nyttig for raske overslag, men det erstatter ikke skattekortet ditt.
            Fradrag, tabelltrekk, trinnskatt og andre forhold kan påvirke faktisk utbetaling.
          </p>
          <p>
            Resultatet viser både årlig skatt og månedlig skatt, slik at du lettere kan forstå
            forskjellen mellom brutto og netto.
          </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Hva betyr feriejusteringen?
            </h3>
            <p>
              Feriepenger er penger du normalt får utbetalt i forbindelse med ferie. I
              kalkulatoren kan du endre feriepengesatsen, for eksempel til 10,2 % eller 12 %.
              Mange arbeidstakere med fem ferieuker bruker 12 %.
            </p>
            <p>
              Ferietrekk er et estimat på lønnen som trekkes når ferie skal avvikles.
              Kalkulatoren beregner dette basert på antall ferieuker du legger inn.
            </p>
            <p>
              Feltet for utbetaling i juni viser et forenklet estimat på feriemåneden:
              månedslønn minus ferietrekk pluss feriepenger. Faktisk utbetaling kan variere
              etter arbeidsgiver, tariffavtale og hvordan feriepenger er opptjent året før.
            </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Brutto lønn
            </h3>
          <p>
            Brutto lønn er lønn før skatt og andre trekk. Når kalkulatoren viser brutto årslønn,
            månedslønn, daglønn og timelønn, er dette tall før skatten er trukket fra.
          </p>
          <p>
            Brutto-tallene er nyttige når du skal sammenligne lønn med stillingsannonser,
            arbeidskontrakt eller lønnsstatistikk.
          </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Netto lønn
            </h3>
          <p>
            Netto lønn er estimert lønn etter skatt. Dette er ofte det viktigste tallet i
            hverdagen, fordi det sier noe om hvor mye du omtrent sitter igjen med.
          </p>
          <p>
            Netto månedslønn er derfor fremhevet øverst i kalkulatoren, mens netto daglønn og
            netto timelønn gir et mer detaljert bilde av hva arbeidstiden din tilsvarer.
          </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              100 % stilling vs. faktisk lønn
            </h3>
          <p>
            Kalkulatoren skiller mellom lønn i 100 % stilling og lønnen du faktisk beregner ut
            fra. Dette er spesielt viktig hvis du jobber deltid.
          </p>
          <p>
            Hvis årslønnen gjelder full stilling, men du jobber 80 %, beregnes faktisk lønn ut
            fra stillingsprosenten din.
          </p>
          </section>

          <section className="grid gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Når bør du bruke en lønnskalkulator?
            </h3>
          <p>
            En lønnskalkulator er nyttig når du vurderer et jobbtilbud, skal forhandle lønn,
            bytter stillingsprosent eller vil forstå forskjellen mellom brutto og netto lønn.
          </p>
          <p>
            Den kan også brukes til å se hvordan endringer i timer, skattesats eller
            feriepengesats påvirker månedlig utbetaling.
          </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Viktig å vite
            </h3>
          <p>
            Kalkulatoren gir et estimat. Den bruker ikke skattekort, fradrag, tabelltrekk,
            arbeidsgiverordninger eller individuelle avtaler.
          </p>
          <p>
            Bruk resultatene som et godt overslag, og sjekk alltid arbeidskontrakt, lønnsslipp
              eller Skatteetaten hvis du trenger et helt nøyaktig svar.
            </p>
          </section>

          <section className="grid gap-3 border-t border-black/8 pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Les videre om lønn
            </h3>
            <p>
              Vil du bruke tallene fra lønnskalkulatoren videre, kan du lese mer om{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/blogg/hvordan-be-om-mer-lonn"
              >
                hvordan du kan be om mer lønn
              </Link>
              ,{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/blogg/hvor-mye-mer-kan-man-be-om-i-lonn"
              >
                hvor mye mer lønn det er vanlig å be om
              </Link>{" "}
              eller utforske{" "}
              <Link
                className="font-semibold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.22)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/yrkesgrupper"
              >
                lønn etter yrkesgrupper
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
