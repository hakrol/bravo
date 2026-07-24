import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageHero } from "@/components/info-page-hero";
import { siteConfig } from "@/lib/site-config";

const description = "Les hvordan Lønnsinnsikt behandler personopplysninger på nettstedet.";
const externalLinkClass =
  "font-bold text-[var(--primary-strong)] underline underline-offset-4";

export const metadata: Metadata = {
  title: "Personvern",
  description,
  alternates: {
    canonical: "/personvern",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/personvern",
    siteName: siteConfig.name,
    title: `Personvern | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Personvern | ${siteConfig.name}`,
    description,
  },
};

export default function PersonvernPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        eyebrow="Personvern"
        title="Personvern hos Lønnsinnsikt"
        description="Her forklarer vi hvilke opplysninger som behandles, hvorfor de brukes, hvem de deles med, og hvilke valg og rettigheter du har."
        imageSrc="/images/hero-personvern.png"
        imageAlt="Illustrasjon for personvern hos Lønnsinnsikt"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-4xl gap-10">
          <div className="grid gap-5 text-base leading-8 text-slate-700 sm:text-lg">
            <p>
              Lønnsinnsikt er et hobbyprosjekt som drives av Håkon Rolfsen,
              enkeltpersonforetak med organisasjonsnummer 920 850 324. Håkon Rolfsen er
              behandlingsansvarlig for personopplysninger som behandles som en del av
              nettstedet.
            </p>
            <p>
              Dette gjelder blant annet opplysninger som sendes gjennom kontaktskjemaet og
              tekniske opplysninger som brukes til drift, sikkerhet og statistikk. Har du
              spørsmål om hvordan opplysninger behandles, kan du skrive til{" "}
              <Link className={externalLinkClass} href="mailto:lonnsinnsikt@gmail.com">
                lonnsinnsikt@gmail.com
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-8 text-base leading-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Hvilke opplysninger vi behandler
              </h2>
              <div className="mt-4 grid gap-4">
                <p>Avhengig av hvordan du bruker nettstedet, kan vi behandle:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>navn, e-postadresse og innholdet i en kontakthenvendelse</li>
                  <li>
                    tekniske data som IP-adresse, tidspunkt, sideadresse, henvisende side,
                    nettleser, operativsystem og enhetstype
                  </li>
                  <li>
                    aggregerte opplysninger om sidevisninger, omtrentlig geografisk område og
                    nettstedets ytelse
                  </li>
                  <li>
                    ved annonsering: informasjonskapsel-ID-er, samtykkevalg, annonsevisninger,
                    annonseinteraksjoner og andre nettidentifikatorer
                  </li>
                </ul>
                <p>
                  Vi ber ikke om fødselsnummer, lønnsslipper, helseopplysninger eller andre
                  særlige kategorier av personopplysninger.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">Kontaktskjema</h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Når du bruker kontaktskjemaet, behandler vi navnet, e-postadressen og
                  meldingen du sender. Formålet er å vurdere, besvare og følge opp
                  henvendelsen. Behandlingen bygger normalt på vår berettigede interesse i å
                  kunne kommunisere med brukere. Dersom henvendelsen gjelder en mulig avtale,
                  kan behandlingen også være nødvendig for å gjennomføre tiltak før en avtale
                  inngås.
                </p>
                <p>
                  E-posten leveres gjennom Resend og mottas i Lønnsinnsikts Gmail-konto. Vi
                  lagrer ikke en egen kopi av kontaktskjemaet i nettstedets database.
                  Opplysningene beholdes så lenge det er nødvendig for å behandle
                  henvendelsen og relevant oppfølging, og slettes eller anonymiseres når vi
                  ikke lenger har et saklig eller rettslig behov for dem.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Teknisk informasjon og analyse
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Nettstedet driftes på Vercel. Ved bruk av nettstedet behandles nødvendige
                  tekniske opplysninger for å levere sidene, føre driftslogger, oppdage misbruk
                  og ivareta sikkerhet og stabilitet. Behandlingen bygger på vår berettigede
                  interesse i å tilby en sikker og fungerende tjeneste.
                </p>
                <p>
                  Vi bruker Vercel Web Analytics og Speed Insights for aggregert
                  besøksstatistikk og måling av nettstedets faktiske ytelse. Vercel Web
                  Analytics bruker ikke tredjeparts informasjonskapsler og opplyser at
                  sidevisninger ikke knyttes til en identifiserbar bruker eller IP-adresse. Vi
                  bruker ikke disse verktøyene til å lage egne markedsføringsprofiler.
                </p>
                <p>
                  Kontaktskjemaet bruker en midlertidig, kryptografisk verdi basert på
                  IP-adressen for å begrense spam og gjentatte innsendinger. Selve IP-adressen
                  lagres ikke i denne begrensningen, og verdien slettes når
                  begrensningsperioden ikke lenger er relevant. Vanlige plattform- og
                  sikkerhetslogger kan likevel inneholde IP-adresse i en begrenset periode.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">Google AdSense</h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Nettstedet er integrert med Google AdSense, som kan brukes til å vise og måle
                  annonser. Google og andre annonseteknologileverandører kan behandle
                  opplysninger fra nettleseren eller enheten din når annonser er aktive.
                  Opplysningene kan omfatte IP-adresse, nettleser- og enhetsinformasjon,
                  sideadressen du besøker, omtrentlig posisjon, informasjonskapsel-ID-er,
                  annonsevisninger og interaksjoner med annonser.
                </p>
                <p>
                  Tredjepartsleverandører, inkludert Google, bruker informasjonskapsler og
                  lignende teknologier til å vise annonser basert på tidligere besøk på
                  Lønnsinnsikt eller andre nettsteder. Googles bruk av
                  annonseringsinformasjonskapsler gjør det mulig for Google og deres partnere
                  å vise annonser basert på besøk på dette og andre nettsteder.
                </p>
                <p>Opplysningene kan brukes til å:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>levere og velge annonser</li>
                  <li>tilpasse annonser når du har samtykket til det</li>
                  <li>begrense hvor ofte den samme annonsen vises</li>
                  <li>måle annonsevisninger, interaksjoner og effekt</li>
                  <li>oppdage og forhindre svindel, misbruk og ugyldig trafikk</li>
                  <li>rapportere og forbedre annonsetjenestene</li>
                </ul>
                <p>
                  Personlig tilpassede annonser kan bygge på tidligere aktivitet, interesser,
                  omtrentlig område og besøk på dette eller andre nettsteder. Ikke-personlig
                  tilpassede annonser bygger hovedsakelig på sammenhengen de vises i, som
                  innholdet på siden, tidspunkt og omtrentlig område. Også
                  ikke-personlig tilpassede eller begrensede annonser kan innebære behandling
                  av tekniske data for levering, måling, frekvensbegrensning, sikkerhet og
                  svindelforebygging.
                </p>
                <p>
                  Du kan lese mer om{" "}
                  <a
                    className={externalLinkClass}
                    href="https://policies.google.com/technologies/partner-sites?hl=no"
                    rel="noreferrer"
                    target="_blank"
                  >
                    hvordan Google bruker opplysninger fra nettsteder som benytter Googles
                    tjenester
                  </a>
                  , og administrere Googles bruk av personlige annonser i{" "}
                  <a
                    className={externalLinkClass}
                    href="https://myadcenter.google.com/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Mitt annonsesenter
                  </a>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Informasjonskapsler og samtykke
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Informasjonskapsler er små tekstfiler som lagres i nettleseren. Nettstedet
                  kan også bruke lignende lokal lagring. Strengt nødvendige teknologier kan
                  brukes for sikkerhet, grunnleggende funksjonalitet og for å huske
                  personvernvalgene dine. Valgfrie annonse- og sporingsteknologier skal ikke
                  aktiveres før det foreligger gyldig samtykke når dette er påkrevd.
                </p>
                <p>
                  For besøkende i Norge, EØS, Storbritannia og Sveits skal samtykke til
                  annonser håndteres gjennom en Google-sertifisert samtykkeplattform som
                  støtter IAB Transparency and Consent Framework. Der får du informasjon om
                  formålene og leverandørene før du velger. Du skal kunne godta, avvise eller
                  velge enkelte formål og leverandører. Det skal være like enkelt å trekke
                  tilbake et samtykke som å gi det.
                </p>
                <p>
                  Samtykkevalget kan lagres sammen med tidspunkt og en teknisk
                  samtykkestreng, slik at valget kan dokumenteres og huskes. Når
                  samtykkeløsningen er aktivert, kan du åpne personvernvalgene på nytt fra
                  nettstedets lenke for personvern- og informasjonskapselvalg. Tilbaketrekking
                  påvirker ikke lovligheten av behandling som allerede har skjedd.
                </p>
                <p>
                  Hvis du ikke samtykker til personlig tilpassede annonser, kan du få
                  ikke-personlig tilpassede eller begrensede annonser, eller ingen annonser.
                  Du kan i tillegg slette eller blokkere informasjonskapsler i nettleseren,
                  men dette erstatter ikke nettstedets samtykkevalg og kan påvirke enkelte
                  funksjoner.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Leverandører og deling
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Vi bruker Vercel til drift, besøksstatistikk og ytelsesmåling, Resend til
                  levering av kontakthenvendelser, Gmail til mottak og oppfølging av e-post,
                  og Google AdSense til annonsering. Leverandørene behandler opplysninger etter
                  egne personvernvilkår og, der de er databehandlere for oss, etter avtale og
                  våre instrukser.
                </p>
                <p>
                  Ved annonsering kan Google og andre valgte annonseteknologileverandører motta
                  data. Den oppdaterte listen over leverandører, formål, behandlingsgrunnlag og
                  lagringstider skal vises i samtykkeløsningen. Google gjør også informasjon
                  om{" "}
                  <a
                    className={externalLinkClass}
                    href="https://support.google.com/admanager/answer/9012903?hl=no"
                    rel="noreferrer"
                    target="_blank"
                  >
                    annonseteknologileverandører
                  </a>{" "}
                  tilgjengelig.
                </p>
                <p>
                  Enkelte leverandører kan behandle opplysninger utenfor Norge og EØS. Slik
                  overføring skal skje på et gyldig overføringsgrunnlag, for eksempel en
                  adekvansbeslutning eller EUs standard personvernbestemmelser, med nødvendige
                  tilleggstiltak.
                </p>
                <p>
                  Vi selger ikke personopplysningene dine. Opplysninger kan ellers utleveres
                  når det er nødvendig for å levere tjenesten, oppfylle en rettslig
                  forpliktelse eller fastsette, gjøre gjeldende eller forsvare rettskrav.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Lagring og sletting
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Vi oppbevarer personopplysninger bare så lenge de er nødvendige for formålet
                  de ble samlet inn for, eller så lenge loven krever det. Kontakthenvendelser
                  vurderes og slettes når oppfølgingen er avsluttet og vi ikke lenger har et
                  dokumentasjonsbehov. Sikkerhets- og driftslogger oppbevares i en begrenset
                  periode som fastsettes ut fra sikkerhets- og feilsøkingsbehov.
                </p>
                <p>
                  Google og andre selvstendige mottakere fastsetter egne lagringstider.
                  Gjeldende opplysninger om dette skal være tilgjengelige i
                  samtykkeløsningen og i leverandørenes personvernerklæringer.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Rettighetene dine
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Når vilkårene i personvernregelverket er oppfylt, kan du be om innsyn,
                  retting, sletting, begrensning og dataportabilitet. Du kan protestere mot
                  behandling som bygger på berettiget interesse, og du kan når som helst
                  trekke tilbake et samtykke. Enkelte opplysninger kan beholdes dersom vi har
                  et rettslig eller tungtveiende behov for det.
                </p>
                <p>
                  Send forespørselen til{" "}
                  <Link className={externalLinkClass} href="mailto:lonnsinnsikt@gmail.com">
                    lonnsinnsikt@gmail.com
                  </Link>
                  . Du har også rett til å klage til{" "}
                  <a
                    className={externalLinkClass}
                    href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Datatilsynet
                  </a>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Endringer i erklæringen
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Personvernerklæringen oppdateres når behandlingen, leverandørene eller
                  tjenestene våre endres. Vesentlige endringer vil bli gjort tydelige på
                  nettstedet og kan kreve at du tar et nytt samtykkevalg.
                </p>
                <p>Sist oppdatert 24. juli 2026.</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
