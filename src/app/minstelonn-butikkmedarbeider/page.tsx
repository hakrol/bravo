import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { OccupationDetailSectionNav } from "@/components/occupation-detail-section-nav";
import { RetailRateFinder, RetailShiftCalculator, RetailTariffHistory } from "@/components/retail-tariff-tools";
import {
  RETAIL_TARIFF_VERIFIED_AT,
  retailRateKeys,
  retailRateLabels,
  retailTariffRateSets,
  retailUbSupplements,
  validateRetailTariffData,
} from "@/lib/retail-tariff";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pagePath = "/minstelonn-butikkmedarbeider";
const title = "Minstelønn butikkmedarbeider 2026 – tariff og lønnstrinn";
const description = "Se tariffsatser for butikkmedarbeidere i 2026. Finn lønnstrinn, ungdomssatser, ansiennitet og tillegg for kveld, lørdag og søndag.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: pagePath },
  openGraph: { type: "website", locale: "nb_NO", url: pagePath, siteName: siteConfig.name, title: `${title} | ${siteConfig.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
};

const sections = [
  { id: "dagens-satser", label: "Dagens tariffsats" }, { id: "finn-sats", label: "Finn din sats" },
  { id: "lonnstrinn", label: "Lønnstrinn" }, { id: "utvikling", label: "Utvikling" },
  { id: "ub", label: "Kveld og helg" }, { id: "overtid", label: "Overtid" },
  { id: "ungdom", label: "Ungdom" }, { id: "deltid", label: "Deltid og ansiennitet" },
  { id: "andre-avtaler", label: "Andre tariffavtaler" }, { id: "kilder", label: "Kilder" },
  { id: "faq", label: "FAQ" },
];

const agreementUrl = "https://hk.no/shared-files/3348/?Landsoverenskomsten+HK-Virke+2024-2026+Web.pdf=";
const virkeUrl = "https://www.virke.no/tariff-og-lonn/finn-tariffavtale/landsoverenskomsten-hk/";
const historyUrl = "https://www.virke.no/tariff-og-lonn/finn-tariffavtale/landsoverenskomsten-hk/historikk/";
const current = retailTariffRateSets.at(-1)!;

export default function MinstelonnButikkmedarbeiderPage() {
  const validationErrors = validateRetailTariffData();
  if (validationErrors.length) throw new Error(`Ugyldig tariffdatasett: ${validationErrors.join("; ")}`);
  const faq = getFaq();
  const structuredData = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hjem", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Minstelønn for butikkmedarbeidere", item: getAbsoluteUrl(pagePath) },
    ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  return <main className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
    {structuredData.map((data, index) => <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} key={index} type="application/ld+json" />)}
    <div className="mx-auto max-w-7xl">
      <nav aria-label="Brødsmulesti" className="mb-6 text-sm text-slate-600"><ol className="flex gap-2"><li><Link className="hover:underline" href="/">Hjem</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="font-medium text-slate-900">Minstelønn butikkmedarbeider</li></ol></nav>
      <header className="overflow-hidden rounded-[5px] border border-black/10 bg-[#f3f5ed] shadow-[0_24px_70px_rgba(15,23,42,.07)]">
        <div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:py-14">
          <div className="self-center">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--primary)]">Varehandel · Virke–HK</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-.055em] text-slate-950 sm:text-5xl lg:text-6xl">Minstelønn for butikkmedarbeidere</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">Det finnes ingen generell lovpålagt minstelønn for butikkmedarbeidere i Norge. Jobber du i en virksomhet med tariffavtale, kan du derimot ha krav på en bestemt minstelønn. Her finner du Virke–HK-satser, lønnstrinn, historikk og tillegg for kveld og helg.</p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[5px] bg-[#163d26] px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163d26]"
              href="/yrke/butikkmedarbeidere-lonn"
            >
              Se lønn og lønnsutvikling for butikkmedarbeidere
            </Link>
            <div className="mt-4">
              <Source href="https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/" label="Arbeidstilsynet – minstelønn" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <HeroCard eyebrow="Ikke lovbestemt" title="Ingen generell sats" text="Butikk er ikke en av de allmenngjorte bransjene." />
            <HeroCard eyebrow="Over 18 år · trinn 1" title={`${money(current.rates.step1.hourly)}/time`} text={`${wholeMoney(current.rates.step1.monthly)}/måned`} accent />
            <HeroCard eyebrow="Fra 25 år · normalt trinn 3*" title={`${money(current.rates.step3.hourly)}/time`} text="*Unntak kan gjelde elever og studenter i kortvarige jobber." />
            <HeroCard eyebrow="Trinn 6" title={`${money(current.rates.step6.hourly)}/time`} text="En minstesats på trinnet – ikke maksimal lønn." />
          </div>
        </div>
        <div className="border-t border-black/10 bg-white/70 px-5 py-3 text-sm text-slate-700 sm:px-8 lg:px-12"><strong>Gjeldende fra 1. april 2026.</strong> Oppgjøret ble godkjent i uravstemning 27. mai 2026. Kontrollert {date(RETAIL_TARIFF_VERIFIED_AT)}.</div>
      </header>

      <div className="mt-6 lg:hidden"><OccupationDetailSectionNav sections={sections} variant="mobile" /></div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden lg:block"><div className="sticky top-24"><OccupationDetailSectionNav sections={sections} /></div></aside>
        <div className="min-w-0">
          <Section id="dagens-satser" title="Tariffsatsene fra 1. april 2026">
            <p>Tabellen gjelder ansatte som omfattes av <strong>Landsoverenskomsten mellom Virke og HK</strong>. Den gjelder ikke automatisk i alle butikker. Månedslønn og timelønn er publisert av Virke.</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{retailRateKeys.map((key) => <article className="rounded-[5px] border border-black/10 bg-white p-4" key={key}><h3 className="font-semibold text-slate-950">{retailRateLabels[key]}</h3><p className="mt-3 text-2xl font-bold tabular-nums">{money(current.rates[key].hourly)}<span className="text-xs font-medium text-slate-500"> / time</span></p><p className="mt-1 text-sm tabular-nums text-slate-600">{wholeMoney(current.rates[key].monthly)} / måned</p></article>)}</div>
            <Source href={virkeUrl} label="Virke – gjeldende lønnssatser" />
          </Section>

          <Section id="finn-sats" title="Finn din tariffsats"><p>Verktøyet gir en veiledende minsteplassering etter alder, dokumentert praksis og relevant utdanning. Det brukes bare når arbeidsforholdet omfattes av Virke–HK-avtalen.</p><RetailRateFinder rateSet={current} /><Source href={agreementUrl} label="Landsoverenskomsten § 12.2" /></Section>

          <Section id="lonnstrinn" title="Hvordan fungerer lønnstrinnene?">
            <p>Ansatte som har fylt 18 år skal normalt minst ha trinn 1. Fra fylte 25 år er hovedregelen minst trinn 3, men skoleelever og studenter i visse kortvarige jobber kan være unntatt. Dokumentert praksis fra kontor, butikk og lager gir normalt ett trinn per år. Relevant yrkesutdanning etter videregående kan også gi ansiennitet.</p>
            <div className="grid gap-4 sm:grid-cols-3"><Info title="18 år">Minst trinn 1 etter hovedregelen.</Info><Info title="25 år">Normalt minst trinn 3, med et avgrenset student-/elevunntak.</Info><Info title="Erfaring og utdanning">Kan gi høyere innplassering. Lønn over minstesatsen kan avtales.</Info></div>
            <Source href={agreementUrl} label="Landsoverenskomsten §§ 12.2.2–12.2.6" />
          </Section>

          <Section id="utvikling" title="Utvikling i tariffsatsene for butikkmedarbeidere"><p>Historikken har separate perioder for garantiendringer 1. februar og tariffendringer 1. april. Velg lønnstrinn og enhet for å sammenligne.</p><RetailTariffHistory rateSets={[...retailTariffRateSets]} /><Source href={historyUrl} label="Virke – historiske satser" /></Section>

          <Section id="ub" title="Kvelds-, natt- og helgetillegg">
            <p>UB-tilleggene nedenfor følger Landsoverenskomsten. Den publiserte 2026-protokollen endret lønnssatsene, men oppga ikke nye UB-beløp; satsene i gjeldende avtaletekst er derfor videreført. UB utbetales ikke for timer som samtidig får overtids- eller skifttillegg.</p>
            <div className="grid gap-4 sm:grid-cols-3"><Timeline title="Mandag–fredag" rows={[`Etter 18:00 → +${retailUbSupplements.weekdayAfter18} kr/time`, `Etter 21:00 → +${retailUbSupplements.weekdayAfter21} kr/time`]} /><Timeline title="Lørdag" rows={[`Etter 13:00 → +${retailUbSupplements.saturdayAfter13} kr/time`, `Etter 15:00 → +${retailUbSupplements.saturdayAfter15} kr/time`, `Etter 18:00 → +${retailUbSupplements.saturdayAfter18} kr/time`]} /><Timeline title="Søndag" rows={[`Hele døgnet → +${retailUbSupplements.sunday} kr/time`]} /></div>
            <h3 className="pt-4 text-2xl font-semibold text-slate-950">Hva tjener jeg på denne vakten?</h3><RetailShiftCalculator rateSet={current} /><Source href={agreementUrl} label="Landsoverenskomsten § 14.3" />
          </Section>

          <Section id="overtid" title="Overtid for butikkmedarbeidere">
            <div className="grid gap-4 sm:grid-cols-2"><Info title="Lovens minimum">Arbeidsmiljøloven krever minst 40 prosent overtidstillegg når arbeidet er overtid etter loven.</Info><Info title="Virke–HK">50 prosent er hovedregelen. 100 prosent gjelder blant annet kl. 21–08 på hverdager, søn- og helligdager, 1. og 17. mai, etter ordinær arbeidstid før søn-/helligdag og etter kl. 13.15 jul-, nyttårs- og pinseaften.</Info></div>
            <p>For deltidsansatte utløser avtalen overtidsbetaling når arbeidet går over 37,5 timer i én uke eller samlet arbeidstid går over 9 timer samme dag. Merarbeid under disse grensene er ikke automatisk tariffmessig overtid.</p>
            <Source href={agreementUrl} label="Landsoverenskomsten § 3" />
          </Section>

          <Section id="ungdom" title="Minstelønn i butikk for ungdom"><p>Virke–HK-satsen er {money(current.rates.under16.hourly)} per time under 16 år og {money(current.rates.under18.hourly)} per time under 18 år. Dette er <strong>tariffsatsene i denne avtalen</strong>, ikke en generell lovpålagt ungdomslønn i norske butikker.</p><div className="grid gap-4 sm:grid-cols-2"><Info title="Under 16 år"><strong className="text-2xl">{money(current.rates.under16.hourly)}</strong><br />{wholeMoney(current.rates.under16.monthly)} per måned.</Info><Info title="16–17 år"><strong className="text-2xl">{money(current.rates.under18.hourly)}</strong><br />{wholeMoney(current.rates.under18.monthly)} per måned.</Info></div><Source href={virkeUrl} label="Virke – lønnssatser 2026" /></Section>

          <Section id="deltid" title="Deltidsjobb, ansiennitet og fagbrev">
            <h3 className="text-xl font-semibold">Deltidspraksis</h3><p>Gjennomsnittlig minst 15 timer per uke gir normalt ett års lønnsansiennitet per år. Under 15 timer gir normalt ett år for hvert andre år. Praksisperioder under to måneder med under 10 timer i snitt per uke godskrives ikke. Annet relevant arbeid skal vurderes rimelig.</p>
            <h3 className="pt-3 text-xl font-semibold">Har fagbrev betydning?</h3><p>Ja. Etter 2024–2026-avtalens bilag 2 A tilsvarer første år som faglært trinn 6. Andre år ligger over trinn 6. For faglærte fra treårig skole begynner stigen på trinn 2, går til trinn 6 andre år og over trinn 6 tredje år. De eksakte beløpene over trinn 6 må kontrolleres mot 2026-protokollen og bedriftens lønnsgrunnlag; derfor beregner verktøyet ikke faglærtsats automatisk.</p>
            <Source href={agreementUrl} label="Landsoverenskomsten §§ 12.2, 13.4 og bilag 2 A" />
          </Section>

          <Section id="arbeidstid" title="Arbeidstid i butikk"><p>Landsoverenskomsten setter ordinær arbeidstid til høyst 37,5 timer per uke. Når driften krever arbeid minst hver tredje søndag, er tariffgrensen 35,5 timer. Dette er tariffregler – ikke en generell lovbestemt 37,5-timersuke for alle butikkansatte.</p><Source href={agreementUrl} label="Landsoverenskomsten § 2.8" /></Section>

          <Section id="andre-avtaler" title="Hvilken tariffavtale gjelder i butikken din?">
            <p>Butikker med lignende arbeid kan være bundet av ulike avtaler med ulike satser. Spør arbeidsgiver eller tillitsvalgt hvilken avtale som står i arbeidsforholdet ditt.</p>
            <div className="grid gap-4 sm:grid-cols-3"><Info title="Landsoverenskomsten Virke–HK">Hovedgrunnlaget på denne siden. Omfatter varehandel og annen servicevirksomhet, blant annet butikk- og ekspedisjonsfunksjonærer.</Info><Info title="Handelsoverenskomsten HK–NHO Service og Handel">Kan gjelde detaljhandel direkte til forbruker. 2026-oppgjøret er gjennomført og godkjent; satsene er ikke blandet inn her.</Info><Info title="Butikkoverenskomsten HK–NHO">Partene ble enige 7. september 2026. Per 19. september var resultatet til uravstemning med frist 29. september og derfor ikke endelig godkjent.</Info></div>
            <Source href="https://hk.no/lonnsoppgjor-2026/" label="HK – tariffoppgjøret 2026" />
          </Section>

          <Section id="tariff-lov" title="Er minstelønnen i butikk lovpålagt?"><div className="grid gap-4 sm:grid-cols-3"><Info title="Lovpålagt minstelønn">Finnes bare i bestemte allmenngjorte bransjer. Varehandel er ikke blant dem.</Info><Info title="Tariffestet minstelønn">Gjelder når arbeidsplassen og arbeidsforholdet omfattes av relevant tariffavtale.</Info><Info title="Uten tariffavtale">Lønnen avtales i arbeidsavtalen innenfor øvrige regler i arbeidslivet.</Info></div><p><strong>Minstelønn er heller ikke gjennomsnittslønn.</strong> Tariffsatsen er et gulv. Se faktisk lønnsstatistikk på siden om <Link className="font-semibold text-[var(--primary)] hover:underline" href="/yrke/butikkmedarbeidere-lonn">lønn for butikkmedarbeidere</Link>, eller bruk <Link className="font-semibold text-[var(--primary)] hover:underline" href="/lonnskalkulator">lønnskalkulatoren</Link>.</p></Section>

          <Section id="kilder" title="Kilder og metode"><p>Alle satser ligger i ett versjonert datasett med virkningsdato, kilde og kontrolldato. Historisk timelønn merket «beregnet» er månedslønn delt på 162,5, i tråd med 37,5 × 4⅓ timer. Nåværende timelønner er Virkes publiserte tall.</p><div className="space-y-3">{sources.map((source) => <a className="block rounded-[5px] border border-black/10 bg-white p-4 hover:border-green-900/30" href={source.url} key={source.title}><strong className="text-slate-950">{source.title}</strong><span className="mt-1 block text-sm text-slate-600">{source.publisher} · {source.purpose} · Kontrollert {date(RETAIL_TARIFF_VERIFIED_AT)} ↗</span></a>)}</div></Section>

          <Section id="faq" title="Ofte stilte spørsmål"><div className="space-y-3">{faq.map((item) => <details className="group rounded-[5px] border border-black/10 bg-white p-5" key={item.question}><summary className="cursor-pointer list-none font-semibold text-slate-950">{item.question}<span className="float-right text-[var(--primary)] group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-6 text-slate-700">{item.answer}</p></details>)}</div></Section>
        </div>
      </div>
    </div>
  </main>;
}

const sources = [
  { title: "Minstelønn", publisher: "Arbeidstilsynet", purpose: "Dokumenterer hvilke bransjer som har lovpålagt minstelønn", url: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/" },
  { title: "Landsoverenskomsten HK – gjeldende satser", publisher: "Virke", purpose: "Dagens måneds- og timelønn og 2026-resultatet", url: virkeUrl },
  { title: "Historiske lønnssatser", publisher: "Virke", purpose: "Faktiske februar- og aprilperioder 2018–2026", url: historyUrl },
  { title: "Enighet mellom LO og Virke i 2017", publisher: "HK Norge", purpose: "Satsene fra 1. februar 2017", url: "https://hk.no/2017/03/enighet-mellom-lo-og-virke-fra-lavlonn-til-likelonn-i-varehandelen/" },
  { title: "Landsoverenskomsten Virke–HK 2024–2026", publisher: "HK Norge / Virke", purpose: "Innplassering, ansiennitet, UB, overtid, arbeidstid og faglærte", url: agreementUrl },
  { title: "Ja-flertall i uravstemning", publisher: "HK Norge", purpose: "Godkjenning og virkning av 2026-oppgjøret", url: "https://hk.no/2026/05/ja-flertall-i-uravstemming/" },
  { title: "Tariffoppgjøret 2026", publisher: "HK Norge", purpose: "Status for Handelsoverenskomsten og Butikkoverenskomsten", url: "https://hk.no/lonnsoppgjor-2026/" },
] as const;

function getFaq() {
  const r = current.rates;
  return [
    { question: "Hva er minstelønnen for en butikkmedarbeider i 2026?", answer: `Det finnes ingen generell lovpålagt sats. I virksomheter som følger Virke–HK, er laveste sats over 18 år normalt ${money(r.step1.hourly)} per time på trinn 1 fra 1. april 2026.` },
    { question: "Finnes det lovpålagt minstelønn i butikk?", answer: "Nei. Varehandel er ikke en allmenngjort bransje. En tariffavtale kan likevel gi bindende minstesatser på arbeidsplassen." },
    { question: "Hva er tariffen for butikkmedarbeidere?", answer: "Det avhenger av hvilken tariffavtale virksomheten er bundet av. Denne siden viser Landsoverenskomsten Virke–HK." },
    { question: "Hva tjener en butikkmedarbeider over 18 år?", answer: `Etter Virke–HK er trinn 1 minst ${money(r.step1.hourly)} eller ${wholeMoney(r.step1.monthly)} per måned. Erfaring og utdanning kan gi høyere trinn.` },
    { question: "Hva tjener en 16- eller 17-åring i butikk?", answer: `Tariffsatsen under 18 år i Virke–HK er ${money(r.under18.hourly)} per time. Den er ikke lovpålagt i butikker uten denne avtalen.` },
    { question: "Hva er lønnstrinn 1 i butikk?", answer: `Trinn 1 er ${money(r.step1.hourly)} per time og ${wholeMoney(r.step1.monthly)} per måned fra 1. april 2026.` },
    { question: "Hva er lønnstrinn 3?", answer: `Trinn 3 er ${money(r.step3.hourly)} per time og ${wholeMoney(r.step3.monthly)} per måned. Det er normalt minstetrinnet fra fylte 25 år.` },
    { question: "Hva er lønnstrinn 6?", answer: `Trinn 6 er ${money(r.step6.hourly)} per time og ${wholeMoney(r.step6.monthly)} per måned. Det er ikke maksimal lønn.` },
    { question: "Hvilket lønnstrinn skal jeg ha?", answer: "Det avgjøres blant annet av alder, dokumentert relevant praksis, arbeidstid i praksisperiodene og relevant utdanning. Kalkulatoren gir bare en veiledende hovedregel." },
    { question: "Får man høyere lønn med erfaring?", answer: "Ja, dokumentert praksis fra butikk, kontor og lager kan gi lønnsansiennitet og høyere trinn." },
    { question: "Teller deltidsjobb som ansiennitet?", answer: "Ja. Minst 15 timer per uke gir normalt full årlig opptjening; under 15 timer normalt halv opptjening. Svært korte perioder med under 10 timer kan falle utenfor." },
    { question: "Hva er minstelønn når man er 25 år?", answer: `I Virke–HK er hovedregelen minst trinn 3, nå ${money(r.step3.hourly)}. Et avgrenset unntak gjelder enkelte kortvarige elev- og studentjobber.` },
    { question: "Hva får man ekstra på lørdager?", answer: `Virke–HK gir ${retailUbSupplements.saturdayAfter13} kr etter kl. 13, ${retailUbSupplements.saturdayAfter15} kr etter kl. 15 og ${retailUbSupplements.saturdayAfter18} kr etter kl. 18 per time.` },
    { question: "Hva får man ekstra på søndager?", answer: `Virke–HK gir ${retailUbSupplements.sunday} kr per time hele søndagen for ordinært arbeid som utløser UB.` },
    { question: "Når får man kveldstillegg?", answer: `Mandag–fredag gir avtalen ${retailUbSupplements.weekdayAfter18} kr per time etter kl. 18 og ${retailUbSupplements.weekdayAfter21} kr etter kl. 21.` },
    { question: "Hva er overtidsbetalingen i butikk?", answer: "Lovens minimum er 40 prosent. Virke–HK har normalt 50 prosent og 100 prosent på særskilte tider. Tariffreglene gjelder bare der avtalen gjelder." },
    { question: "Har alle butikker samme tariff?", answer: "Nei. Blant annet Virke–HK, Handelsoverenskomsten og Butikkoverenskomsten kan være relevante, og en butikk kan også stå uten tariffavtale." },
  ];
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) { return <section className="scroll-mt-28 space-y-5 border-b border-slate-200 py-10 first:pt-0 last:border-0 [&>p]:max-w-3xl [&>p]:leading-7 [&>p]:text-slate-700" id={id}><h2 className="text-balance text-3xl font-semibold tracking-[-.04em] text-slate-950 sm:text-4xl">{title}</h2>{children}</section>; }
function HeroCard({ eyebrow, title, text, accent = false }: { eyebrow: string; title: string; text: string; accent?: boolean }) { return <article className={`rounded-[5px] border p-5 ${accent ? "border-green-900/20 bg-[#163d26] text-white" : "border-black/10 bg-white/90 text-slate-950"}`}><p className={`text-xs font-bold uppercase tracking-[.12em] ${accent ? "text-green-100" : "text-[var(--primary)]"}`}>{eyebrow}</p><p className="mt-2 text-2xl font-bold tracking-[-.03em]">{title}</p><p className={`mt-2 text-sm leading-5 ${accent ? "text-green-50" : "text-slate-600"}`}>{text}</p></article>; }
function Info({ title, children }: { title: string; children: ReactNode }) { return <article className="rounded-[5px] border border-black/10 bg-white p-5"><h3 className="text-lg font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{children}</p></article>; }
function Timeline({ title, rows }: { title: string; rows: string[] }) { return <article className="rounded-[5px] border border-black/10 bg-[#163d26] p-5 text-white"><h3 className="text-xs font-bold uppercase tracking-[.14em] text-green-100">{title}</h3><ul className="mt-4 space-y-3">{rows.map((row) => <li className="border-l-2 border-green-300 pl-3 font-semibold tabular-nums" key={row}>{row}</li>)}</ul></article>; }
function Source({ href, label }: { href: string; label: string }) { return <p className="text-xs leading-5 text-slate-500">Kilde: <a className="font-semibold text-[var(--primary)] hover:underline" href={href}>{label} ↗</a></p>; }
function money(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function wholeMoney(value: number) { return `${Math.round(value).toLocaleString("nb-NO")} kr`; }
function date(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
