import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageHero } from "@/components/info-page-hero";
import { editorialIdentity } from "@/lib/editorial-identity";
import { siteConfig } from "@/lib/site-config";

const description =
  "Slik melder du fra om feil på Lønnsinnsikt, og slik vurderer, retter og dokumenterer Redaksjonen vesentlige feil.";

const reportDetails = [
  "lenken til siden der du fant feilen",
  "hvilket tall, avsnitt, diagram eller resultat det gjelder",
  "hvorfor du mener informasjonen er feil eller misvisende",
  "en relevant kilde eller dokumentasjon, dersom du har det",
];

const correctionProcess = [
  {
    title: "1. Vi registrerer henvendelsen",
    text: "Tips sendt via kontaktskjema eller e-post vurderes av den redaksjonelt ansvarlige.",
  },
  {
    title: "2. Vi kontrollerer mot kilden",
    text: "Påstanden eller beregningen sammenholdes med originalkilden, kodegrunnlaget og eventuelle andre relevante opplysninger.",
  },
  {
    title: "3. Vi vurderer omfanget",
    text: "Vi skiller mellom mindre språk- og skrivefeil og feil som kan endre forståelsen av et tall, en sammenligning eller et råd.",
  },
  {
    title: "4. Vi retter og dokumenterer",
    text: "Feilen korrigeres dersom den kan bekreftes. Ved vesentlige innholdsendringer oppdateres datoen, og rettelsen forklares på den aktuelle siden når det er nødvendig for å forstå endringen.",
  },
];

export const metadata: Metadata = {
  title: "Rettelser",
  description,
  alternates: {
    canonical: "/rettelser",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/rettelser",
    siteName: siteConfig.name,
    title: `Rettelser | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary",
    title: `Rettelser | ${siteConfig.name}`,
    description,
  },
};

export default function RettelserPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        title="Rettelser"
        description="Lønnsinnsikt skal rette dokumenterte feil. Her kan du melde fra, og se hvordan Redaksjonen vurderer og håndterer rettelser."
        imageSrc="/images/hero-rettelser.png"
        imageAlt="Illustrasjon av et diagram som blir korrigert og kontrollert"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
                Meld fra om en mulig feil
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">
                Bruk kontaktskjemaet eller send e-post til{" "}
                <a
                  className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                  href={`mailto:${editorialIdentity.contactEmail}`}
                >
                  {editorialIdentity.contactEmail}
                </a>
                . Jo mer konkret henvendelsen er, desto enklere er det å undersøke den.
              </p>
              <Link
                className="mt-6 inline-flex h-11 items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-5 text-sm font-extrabold text-white transition hover:bg-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                href="/kontakt"
              >
                Åpne kontaktskjemaet
              </Link>
            </div>

            <div className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-6 shadow-[0_14px_36px_rgba(27,36,48,0.05)]">
              <h2 className="text-xl font-extrabold text-slate-950">Ta gjerne med</h2>
              <ul className="mt-5 grid gap-3">
                {reportDetails.map((detail) => (
                  <li className="flex gap-3 text-base leading-7 text-slate-700" key={detail}>
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-strong)]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[rgba(27,36,48,0.12)] pt-12">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950">
              Slik behandler vi rettelser
            </h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {correctionProcess.map((step) => (
                <article
                  className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-6"
                  key={step.title}
                >
                  <h3 className="text-xl font-extrabold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-base leading-8 text-slate-700">{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-10 border-t border-[rgba(27,36,48,0.12)] pt-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Mindre endringer</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Retting av skrivefeil, tegnsetting, formatering og andre små språklige
                forbedringer blir normalt ikke forklart særskilt når meningsinnholdet er
                uendret.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Vesentlige rettelser</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">
                Feil i tall, kildebruk, beregninger eller konklusjoner som kan påvirke
                leserens forståelse, skal rettes tydelig. Den aktuelle siden får oppdatert
                dato og ved behov en kort forklaring av hva som er endret.
              </p>
            </div>
          </div>

          <div className="rounded-[5px] border border-[rgba(20,83,45,0.18)] bg-[#f4f7f1] p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-950">Ansvar og behandlingstid</h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
              {editorialIdentity.responsibleName} er ansvarlig for å vurdere
              rettelseshendelser. Lønnsinnsikt er et hobbyprosjekt, og det gis derfor ingen
              garanti for en bestemt svartid. Dokumenterte feil prioriteres etter hvor stor
              betydning de kan ha for leseren.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href={editorialIdentity.authorPath}
              >
                Om Redaksjonen
              </Link>
              <Link
                className="font-extrabold text-[var(--primary-strong)] underline decoration-[rgba(20,83,45,0.24)] underline-offset-4 transition hover:decoration-[var(--primary-strong)]"
                href="/metode"
              >
                Les om metoden
              </Link>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-500">Sist oppdatert 24. juli 2026.</p>
        </div>
      </section>
    </main>
  );
}
