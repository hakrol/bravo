import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageHero } from "@/components/info-page-hero";
import { siteConfig } from "@/lib/site-config";

const description = "Les hvordan Lønnsinnsikt behandler personopplysninger på nettstedet.";

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
        description="Vi behandler bare opplysninger vi trenger for å drive nettstedet og besvare henvendelser."
        imageSrc="/images/hero-personvern.png"
        imageAlt="Illustrasjon for personvern hos Lønnsinnsikt"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-4xl gap-10">
          <div className="grid gap-5 text-base leading-8 text-slate-700 sm:text-lg">
            <p>
              Lønnsinnsikt er laget for å gi oversikt over lønnsdata. Vi samler ikke inn mer
              informasjon enn det som er nødvendig for at nettstedet skal fungere, være
              stabilt og kunne forbedres.
            </p>
            <p>
              Har du spørsmål om hvordan vi behandler opplysninger, kan du skrive til{" "}
              <Link
                className="font-bold text-[var(--primary-strong)] underline underline-offset-4"
                href="mailto:lonnsinnsikt@gmail.com"
              >
                lonnsinnsikt@gmail.com
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-8 text-base leading-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">Kontaktskjema</h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Når du bruker kontaktskjemaet, behandler vi navnet, e-postadressen og meldingen
                  du sender. Opplysningene brukes til å vurdere og besvare henvendelsen.
                </p>
                <p>
                  E-posten leveres gjennom Resend og mottas i Lønnsinnsikts Gmail-konto. Vi
                  lagrer ikke en egen kopi av kontaktskjemaet i nettstedets database. Meldinger
                  beholdes så lenge det er nødvendig for å behandle henvendelsen og eventuell
                  relevant oppfølging.
                </p>
                <p>
                  Ikke send fødselsnummer, lønnsslipper, helseopplysninger eller andre sensitive
                  personopplysninger gjennom kontaktskjemaet.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Teknisk informasjon og analyse
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Når du bruker nettstedet, kan det bli registrert grunnleggende teknisk
                  informasjon som sidevisning, enhetstype og nettleser. Vi bruker Vercel
                  Analytics og Speed Insights for å forstå bruk, ytelse og stabilitet.
                </p>
                <p>
                  Kontaktskjemaet bruker også tekniske opplysninger for å begrense spam og
                  misbruk. Slike opplysninger brukes ikke til å bygge en egen brukerprofil.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-slate-950">
                Innsyn, retting og sletting
              </h2>
              <div className="mt-4 grid gap-4">
                <p>
                  Du kan kontakte oss hvis du ønsker innsyn i opplysninger vi har om deg, vil
                  rette feil eller ber om at en henvendelse slettes. Enkelte opplysninger kan
                  beholdes dersom vi har et saklig eller rettslig behov for det.
                </p>
                <p>
                  Personvernerklæringen oppdateres når behandlingen eller tjenestene våre
                  endres. Sist oppdatert 23. juli 2026.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
