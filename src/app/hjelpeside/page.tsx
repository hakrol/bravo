import type { Metadata } from "next";
import { InfoPageHero } from "@/components/info-page-hero";
import { siteConfig } from "@/lib/site-config";

const description =
  "Svar på vanlige spørsmål om Lønnsinnsikt, lønnsdata, kilder og bruk av AI.";

const faqs = [
  {
    question: "Hvor kommer lønnsdata fra?",
    answer:
      "Lønnsdata kommer hovedsakelig fra Statistisk sentralbyrå (SSB). Vi bruker åpne tabeller fra Statistikkbanken og gjør tallene enklere å søke i, sammenligne og forstå. Når en side bruker andre kilder, skal det komme tydelig frem.",
  },
  {
    question: "Hva er målet med Lønnsinnsikt?",
    answer:
      "Målet er å gjøre norske lønnstall mer praktisk nyttige. Du skal raskt kunne se hva folk tjener i ulike yrker, forstå forskjellen på median og gjennomsnitt, og bruke innsikten når du vurderer lønn, jobbtilbud eller karrierevalg.",
  },
  {
    question: "Hvordan brukes AI?",
    answer:
      "AI kan brukes til å forklare tall, strukturere tekst og gjøre innhold lettere å forstå. AI skal ikke finne opp lønnstall. Tallgrunnlaget skal komme fra kilder som SSB, og innholdet skal bygge på data som kan kontrolleres.",
  },
  {
    question: "Hvor ofte oppdateres tallene?",
    answer:
      "Oppdateringsfrekvensen avhenger av kilden og tabellen. SSB publiserer ulike statistikker med ulike intervaller. Lønnsinnsikt bør vise den nyeste tilgjengelige perioden der tall presenteres.",
  },
  {
    question: "Hva betyr medianlønn?",
    answer:
      "Medianlønn er lønnen som ligger midt i fordelingen. Halvparten tjener mindre og halvparten tjener mer. Median kan ofte gi et mer robust bilde av vanlig lønnsnivå enn gjennomsnitt, særlig når noen få svært høye lønninger trekker snittet opp.",
  },
  {
    question: "Kan jeg bruke tallene i en lønnssamtale?",
    answer:
      "Ja, tallene kan gi et godt utgangspunkt. De bør likevel brukes sammen med egen erfaring, ansvar, resultater, bransje, geografi og arbeidsgivers situasjon. Statistikken viser markedet, men avgjør ikke automatisk hva du bør tjene.",
  },
  {
    question: "Hva er forskjellen på avtalt lønn og SSBs månedslønn?",
    answer:
      "Avtalt lønn er den faste lønnen som er avtalt for jobben. SSBs samlede månedslønn kan i tillegg omfatte bonus og uregelmessige tillegg, mens overtidsbetaling vises som en egen lønnsart. Se derfor hvilket lønnsmål som brukes før du sammenligner tallet med arbeidsavtalen eller lønnsslippen din.",
  },
  {
    question: "Hvorfor kan lønnen min avvike fra statistikken?",
    answer:
      "Statistikken beskriver en gruppe, ikke én bestemt stilling. Erfaring, ansvar, sektor, bransje, geografi, arbeidstid, tillegg, lokale avtaler og tidspunktet for siste lønnsjustering kan gjøre at lønnen din ligger både over og under medianen eller gjennomsnittet.",
  },
  {
    question: "Hvordan melder jeg fra om en mulig feil?",
    answer:
      "Bruk kontaktskjemaet og legg ved lenken til siden, hva du mener er feil, og gjerne en kilde som viser riktig informasjon. Konkrete opplysninger gjør det enklere å kontrollere og rette feilen.",
  },
];

export const metadata: Metadata = {
  title: "Hjelpeside",
  description,
  alternates: {
    canonical: "/hjelpeside",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/hjelpeside",
    siteName: siteConfig.name,
    title: `Hjelpeside | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Hjelpeside | ${siteConfig.name}`,
    description,
  },
};

export default function HjelpesidePage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <InfoPageHero
        title="Hjelpeside"
        description="Finn svar på de vanligste spørsmålene om hvordan Lønnsinnsikt fungerer, hvor tallene kommer fra og hvordan du bør tolke dem."
        imageSrc="/images/hero-hjelpeside-redaksjonell.png"
        imageAlt="Illustrasjon av en åpen hjelpeguide med spørsmål og kvalitetssikrede svar"
      />

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-5 shadow-[0_14px_36px_rgba(27,36,48,0.05)]"
            >
              <summary className="cursor-pointer list-none text-xl font-extrabold leading-tight text-slate-950 marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[5px] bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)] transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
