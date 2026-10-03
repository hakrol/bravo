import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BookbeatAd } from "@/components/bookbeat-ad";
import { AgricultureMinimumWageChart } from "@/components/agriculture-minimum-wage-chart";
import { AgricultureMinimumWageFinder } from "@/components/agriculture-minimum-wage-finder";
import { ArticleBreadcrumbs } from "@/components/article-breadcrumbs";
import { StickyLeftAdRail } from "@/components/sticky-left-ad-rail";
import { agricultureMinimumWageRates, agricultureMinimumWageRules, agricultureOccupations, agricultureTariff2026, getAgricultureMinimumWageForDate, validateAgricultureMinimumWageRates } from "@/lib/agriculture-minimum-wage";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pagePath = "/minstelonn/minstelonn-jordbruk-gartneri";
const title = "Minstelønn jordbruk og gartneri 2026 – satser og regler";
const description = "Se minstelønn i jordbruk og gartneri for sesongarbeidere, faste ansatte og unge. Satser, ansiennitet, fagarbeidertillegg og helgetillegg.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: pagePath },
  openGraph: { type: "website", locale: "nb_NO", url: pagePath, siteName: siteConfig.name, title: `${title} | ${siteConfig.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
};

const sections = [
  ["finn-sats", "Finn riktig sats"], ["sesong", "Sesong- og innhøstingshjelp"], ["ansiennitet", "Slik teller praksis"], ["fast", "Fast ansatte"], ["unge", "Unge arbeidstakere"], ["fagarbeider", "Fagarbeidertillegg"], ["helg", "Helg og helligdager"], ["overtid", "Overtid"], ["virkeomrade", "Hvem omfattes?"], ["historikk", "Historiske satser"], ["tariff", "Minstelønn, tariff og lønn"], ["faq", "Ofte stilte spørsmål"],
] as const;

export default function MinstelonnJordbrukGartneriPage() {
  const errors = validateAgricultureMinimumWageRates();
  if (errors.length) throw new Error(`Ugyldig minstelønnsdatasett: ${errors.join("; ")}`);
  const today = new Date().toISOString().slice(0, 10);
  const current = getAgricultureMinimumWageForDate(today);
  if (!current) throw new Error(`Fant ingen minstelønnssats som gjelder ${today}.`);

  const cards = [
    { label: "Sesong under 18 år", rate: current.seasonalUnder18Rate, note: "Ferie- og innhøstingshjelp" },
    { label: "Sesong over 18 år", rate: current.seasonalAdultUpTo12WeeksRate, note: "Inntil 12 ukers praksis" },
    { label: "Sesong over 18 år", rate: current.seasonalAdultOver12WeeksRate, note: "Mer enn 12 uker, inntil 6 måneder" },
    { label: "Fast ansatt under 18 år", rate: current.permanentUnder18Rate, note: "Fast arbeidsforhold" },
    { label: "Fast ansatt, ufaglært", rate: current.permanentUnskilledRate, note: "Også sesongarbeider med over 6 måneders praksis", emphasized: true },
  ];
  const faq = getFaq(current);
  const structuredData = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Hjem", item: getAbsoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Minstelønn", item: getAbsoluteUrl("/minstelonn") }, { "@type": "ListItem", position: 3, name: "Jordbruk og gartneri", item: getAbsoluteUrl(pagePath) }] },
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: getAbsoluteUrl(pagePath), inLanguage: "nb-NO", dateModified: current.verifiedAt },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  return <main className="min-h-screen bg-white px-4 pb-16 pt-5 sm:px-6 lg:px-8">
    {structuredData.map((data, index) => <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} key={index} type="application/ld+json" />)}
    <div className="relative mx-auto max-w-7xl">
      <StickyLeftAdRail />
      <ArticleBreadcrumbs href="/minstelonn" section="Minstelønn" title="Jordbruk og gartneri" />

      <div className="relative mx-auto mt-7 max-w-[1080px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_70%_25%,#f3ead4_0%,#fbfdf9_38%,#e8f3e9_100%)] px-5 pb-8 pt-8 sm:px-10 lg:min-h-[410px] lg:px-[250px] lg:pb-10 lg:pt-10">
        <div aria-hidden="true" className="absolute -left-20 bottom-[-95px] size-72 rounded-full bg-[#b9d6ae]/50" /><div aria-hidden="true" className="absolute -right-12 top-4 size-56 rounded-[45%] bg-[#e4cf91]/35" />
        <div className="absolute right-8 top-8 hidden h-[330px] w-[220px] overflow-hidden rounded-[46%_46%_18%_46%] lg:block"><Image alt="Arbeidsforkle, hansker, hageredskaper, grønnsaker og planter i et lyst veksthus" className="h-full w-full object-cover object-[52%_58%]" fill priority sizes="220px" src="/images/minimum-wage/jordbruk-gartneri-hero.png" /></div>
        <header className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-[#e4f2e7] px-5 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#15533d]">Jordbruk og gartneri</p>
          <h1 className="mx-auto mt-6 text-[clamp(2.45rem,5vw,4.8rem)] font-[760] leading-[1.03] tracking-[-0.035em] text-[#101820]">Minstelønn i jordbruk og gartneri</h1>
          <p className="mx-auto mt-5 max-w-[690px] text-base leading-[1.65] text-[#3f4a45] sm:text-[1.12rem]">Satsen avhenger av om du er sesongarbeider eller fast ansatt, alder, dokumentert praksis og fagarbeiderstatus. Gjeldende ufaglærte sats for fast ansatte er <strong>{formatRate(current.permanentUnskilledRate)} per time</strong>.</p>
          <div className="mx-auto mt-7 grid max-w-[650px] gap-3 text-sm text-[#52627d] sm:grid-cols-3"><p><strong className="block text-[#15533d]">Gjeldende fra</strong>{formatDate(current.effectiveFrom)}</p><p><strong className="block text-[#15533d]">Høyeste grunnsats</strong>{formatRate(current.permanentUnskilledRate)}/time</p><p><strong className="block text-[#15533d]">Sist kontrollert</strong>{formatDate(current.verifiedAt)}</p></div>
        </header>
        <div className="relative z-10 mx-auto mt-6 h-44 w-full max-w-sm overflow-hidden rounded-[28px] sm:h-52 lg:hidden"><Image alt="Arbeidsforkle, hansker, hageredskaper, grønnsaker og planter i et lyst veksthus" className="h-full w-full object-cover object-[50%_60%]" fill priority sizes="(max-width: 1024px) 384px, 0px" src="/images/minimum-wage/jordbruk-gartneri-hero.png" /></div>
      </div>

      <div className="mx-auto mt-9 grid max-w-[1000px] gap-4 sm:grid-cols-2 lg:grid-cols-5">{cards.map((item) => <RateCard key={`${item.label}-${item.note}`} {...item} />)}</div>
      <div className="mx-auto mt-7 max-w-[920px]"><AgricultureMinimumWageChart points={agricultureMinimumWageRates.map(({ effectiveFrom, seasonalUnder18Rate, seasonalAdultUpTo12WeeksRate, seasonalAdultOver12WeeksRate, permanentUnder18Rate, permanentUnskilledRate, skilledSupplement }) => ({ effectiveFrom, seasonalUnder18Rate, seasonalAdultUpTo12WeeksRate, seasonalAdultOver12WeeksRate, permanentUnder18Rate, permanentUnskilledRate, skilledSupplement }))} today={today} /></div>

      <div className="mx-auto mt-6 max-w-[920px] rounded-[11px] border border-amber-700/25 bg-amber-50 px-5 py-5 sm:px-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Status i 2026</p><h2 className="mt-2 text-xl font-semibold text-slate-950">Tarifftillegg er ikke automatisk ny lovpålagt minstelønn</h2><p className="mt-2 text-sm leading-6 text-slate-700">Partene ble 2. september 2026 enige om et tillegg på til sammen {formatRate(agricultureTariff2026.generalAndIndustryIncrease)} fra 1. april for tariffbundne arbeidsforhold. Uravstemningen har frist 29. september, og resultatet er derfor ikke lagt inn i de lovpålagte satsene.</p><SourceLine href={agricultureTariff2026.sourceUrl} label="NHO Mat og Drikke – tariffoppgjøret 2026" /></div>
      <BookbeatAd className="mx-auto mt-8 max-w-[920px]" placement="overview-between-sections" />

      <nav aria-labelledby="innhold" className="mx-auto mt-7 max-w-[920px] rounded-[11px] border border-slate-200 bg-slate-50 px-5 py-4 sm:px-7"><h2 className="text-xl font-bold text-slate-950" id="innhold">Innhold på siden</h2><ol className="mt-3 grid sm:grid-cols-2">{sections.map(([id, label], index) => <li key={id}><a className="grid grid-cols-[2rem_1fr] rounded-[7px] px-2 py-1.5 text-slate-800 hover:bg-white hover:text-[#15533d]" href={`#${id}`}><span className="text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span><span className="font-medium">{label}</span></a></li>)}</ol></nav>

      <div className="mx-auto mt-8 max-w-[920px] min-w-0">
        <Section id="finn-sats" title="Finn riktig minstelønnssats"><p>Velg alder, arbeidsforhold og dokumentert praksis. Resultatet er veiledende og forutsetter at arbeidet omfattes av forskriften.</p><AgricultureMinimumWageFinder rates={{ seasonalUnder18: current.seasonalUnder18Rate, seasonalUpTo12: current.seasonalAdultUpTo12WeeksRate, seasonalOver12: current.seasonalAdultOver12WeeksRate, permanentUnder18: current.permanentUnder18Rate, permanentAdult: current.permanentUnskilledRate, skilledSupplement: current.skilledSupplement }} /></Section>

        <Section id="sesong" title="Minstelønn for sesong- og innhøstingshjelp"><p>Ferie- og innhøstingshjelp har egne satser. For arbeidstakere over 18 år er satsen {formatRate(current.seasonalAdultUpTo12WeeksRate)} de første 12 ukene og {formatRate(current.seasonalAdultOver12WeeksRate)} etter mer enn 12 uker og fram til seks måneders praksis.</p><InfoGrid items={[["Inntil 12 uker", `${formatRate(current.seasonalAdultUpTo12WeeksRate)} per time for arbeidstakere over 18 år.`], ["12 uker–6 måneder", `${formatRate(current.seasonalAdultOver12WeeksRate)} per time når praksisen passerer 12 uker.`], ["Over 6 måneder", `${formatRate(current.permanentUnskilledRate)} per time – samme grunnsats som fast ansatte ufaglærte.`]]} /></Section>

        <Section id="ansiennitet" title="Slik fungerer relevant praksis"><p>All relevant og dokumentert praksis fra jordbruk og gartneri skal telle. Praksisen er ikke begrenset til tiden hos nåværende arbeidsgiver, og arbeidstakeren bør kunne dokumentere tidligere arbeidsperioder.</p><p>Når en sesongarbeider har mer enn seks måneders relevant praksis, skal den ufaglærte satsen for fast ansatte brukes. Det er den samlede relevante praksisen som er avgjørende.</p></Section>

        <Section id="fast" title="Minstelønn for fast ansatte"><p>Fast ansatte ufaglærte over 18 år har krav på minst {formatRate(current.permanentUnskilledRate)} per time. Fast ansatte under 18 år har krav på minst {formatRate(current.permanentUnder18Rate)} per time.</p><div className="grid gap-4 sm:grid-cols-2"><Comparison label="Under 18 år" rate={current.permanentUnder18Rate} /><Comparison label="Ufaglært voksen" rate={current.permanentUnskilledRate} /></div></Section>

        <Section id="unge" title="Minstelønn for unge i jordbruk og gartneri"><p>En sesongarbeider på 16 eller 17 år har krav på minst {formatRate(current.seasonalUnder18Rate)} per time. En fast ansatt under 18 år har krav på minst {formatRate(current.permanentUnder18Rate)}.</p><p>Arbeidstakere under 16 år og over 70 år er unntatt fra de allmenngjorte satsene. Lønn må da avtales, men andre arbeidsrettslige regler gjelder fortsatt.</p></Section>

        <Section id="fagarbeider" title="Fagarbeidertillegg"><p>Fagarbeidere skal ha minst {formatRate(current.skilledSupplement)} per time i tillegg til grunnsatsen. En fast ansatt fagarbeider med ufaglært voksengrunnsats vil dermed ha minst <strong>{formatRate(current.permanentUnskilledRate + current.skilledSupplement)} per time</strong>.</p><p>Arbeidstakeren må oppfylle vilkårene for fagarbeiderstatus. Erfaring alene er ikke automatisk det samme som fagbrev eller godkjent fagkompetanse.</p></Section>

        <BookbeatAd className="my-8 sm:my-10" placement="minimum-wage-mid-content" />

        <Section id="helg" title="Helge- og helligdagstillegg for røktere og avløsere"><p>Røktere og avløsere som arbeider i fast turnus, skal ha et tillegg på 25 prosent for arbeid mellom lørdag klokken 00 og søndag klokken 24. Tillegget gjelder også på bevegelige helligdager, 1. og 17. mai samt hele jule- og nyttårsaften.</p><div className="rounded-[10px] border border-[#d8eadf] bg-[#f3faf5] p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#15533d]">Regneeksempel</p><p className="mt-2 text-lg">Grunnsats {formatRate(current.permanentUnskilledRate)} × 1,25 = <strong>{formatRate(current.permanentUnskilledRate * 1.25)} per time</strong>.</p><p className="mt-2 text-sm text-slate-600">Tillegget er ikke et generelt helgetillegg for alle ansatte i jordbruk og gartneri.</p></div></Section>

        <Section id="overtid" title="Overtid"><p>Ved overtidsarbeid har arbeidstakeren krav på minst 40 prosent tillegg til den avtalte ordinære timelønnen. Tariffavtale eller arbeidsavtale kan gi bedre vilkår.</p><div className="rounded-[10px] border border-slate-200 bg-white p-5"><p className="text-lg">Avtalt timelønn {formatRate(current.permanentUnskilledRate)} × 1,40 = <strong>{formatRate(current.permanentUnskilledRate * 1.4)}</strong>.</p></div><SourceLine href={agricultureMinimumWageRules.workingEnvironmentActUrl} label="Arbeidsmiljøloven § 10-6" /></Section>

        <Section id="virkeomrade" title="Hvem omfattes av minstelønnen?"><p>Forskriften gjelder arbeid innen jordbruks- og gartnerinæringene, blant annet gårdsarbeid, husdyrhold, innhøsting, gartneri, planteskole, hagesenter og naturlig tilknyttet lager- og terminalarbeid. Arbeidsoppgavene og virksomheten avgjør – ikke bare stillingstittelen.</p><ul className="grid gap-2 rounded-[9px] border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 sm:p-6">{agricultureOccupations.map((occupation) => <li className="flex items-start gap-2 text-sm leading-6" key={occupation.href}><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#15533d]" /><Link className="font-semibold text-[#15533d] hover:underline" href={occupation.href}>{occupation.title}</Link></li>)}</ul><div className="grid gap-4 sm:grid-cols-2"><InfoCard title="Gartner eller anleggsgartner?">Arbeid i gartneri og hagesenter kan omfattes her. Anleggsgartnerarbeid på byggeplass kan i stedet falle inn under <Link className="font-semibold text-[#15533d] hover:underline" href="/minstelonn/minstelonn-bygg">forskriften for byggeplasser</Link>.</InfoCard><InfoCard title="Unntak">Lærlinger og deltakere på arbeidsmarkedstiltak er unntatt. Den gamle særregelen med 70/80 prosent for praktikanter er ikke en gjeldende generell regel.</InfoCard></div></Section>

        <Section id="historikk" title="Historiske minstelønnssatser"><p>Tabellen viser når de lovpålagte satsene faktisk ble endret. Derfor kan samme kalenderår ha flere nivåer.</p><DataTable minWidth="900px" headers={["Fra", "Sesong <18", "Sesong 0–12 uker", "Sesong >12 uker", "Fast <18", "Fast ufaglært", "Fagtillegg"]} rows={agricultureMinimumWageRates.map((item) => [formatDate(item.effectiveFrom), formatRate(item.seasonalUnder18Rate), formatRate(item.seasonalAdultUpTo12WeeksRate), formatRate(item.seasonalAdultOver12WeeksRate), formatRate(item.permanentUnder18Rate), formatRate(item.permanentUnskilledRate), `+${formatRate(item.skilledSupplement)}`])} /></Section>

        <Section id="tariff" title="Lovpålagt minstelønn, tariff og faktisk lønn"><p>Lovpålagt minstelønn er gulvet for alle som omfattes av forskriften. Tariffsatsene gjelder i tariffbundne arbeidsforhold og kan være høyere eller ha flere tillegg. Faktisk lønn er det arbeidsgiver og arbeidstaker avtaler, og kan ligge over begge nivåene.</p><InfoGrid items={[["Lovpålagt minstelønn", "Bindende lønnsgulv for arbeid som omfattes av den allmenngjorte forskriften."], ["Tarifflønn", "Følger tariffavtalen der arbeidsforholdet er bundet av den. Tariffoppgjøret i 2026 endrer ikke automatisk lovsatsen."], ["Faktisk lønn", "Avtalt lønn påvirkes blant annet av ansvar, erfaring, fagbrev, arbeidstid og arbeidsmarked."]]} /><p>Se faktisk lønnsstatistikk for <Link className="font-semibold text-[#15533d] hover:underline" href="/yrke/gartnere-lonn">gartnere</Link> og andre relevante yrker i listen over.</p></Section>

        <BookbeatAd className="my-8 sm:my-10" placement="minimum-wage-before-faq" />
        <Section id="faq" title="Ofte stilte spørsmål"><div className="divide-y divide-slate-200 overflow-hidden rounded-[5px] border border-black/10 bg-white">{faq.map((item) => <details className="group px-5 py-4 open:bg-[#fbfbf8]" key={item.question}><summary className="cursor-pointer list-none pr-8 font-semibold text-slate-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-[#15533d] group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{item.answer}</p></details>)}</div></Section>

        <section className="mt-12 rounded-[16px] border border-[#cfded6] bg-[#f7faf8] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#15533d]">Kilder og metode</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Offisielle kilder</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">Satsene er kontrollert mot Arbeidstilsynet, gjeldende forskrift og endringsforskriften fra 28. mai 2025. Tariffstatusen er holdt tydelig atskilt fra lovpålagt minstelønn.</p><ul className="mt-4 space-y-2 text-sm font-semibold text-[#15533d]"><li><a className="hover:underline" href={agricultureMinimumWageRules.labourInspectionUrl}>Arbeidstilsynet – minstelønn ↗</a></li><li><a className="hover:underline" href={agricultureMinimumWageRules.regulationUrl}>Lovdata – gjeldende forskrift ↗</a></li><li><a className="hover:underline" href={current.sourceUrl}>Lovdata – satsendring fra 15. juni 2025 ↗</a></li><li><a className="hover:underline" href={agricultureTariff2026.sourceUrl}>NHO Mat og Drikke – tariffoppgjøret 2026 ↗</a></li></ul></section>
      </div>
    </div>
  </main>;
}

function RateCard({ emphasized = false, label, note, rate }: { emphasized?: boolean; label: string; note: string; rate: number }) { return <article className={`min-w-0 rounded-[11px] border px-4 py-5 shadow-[0_10px_30px_rgba(19,37,64,0.05)] ${emphasized ? "border-[#15533d] bg-[linear-gradient(135deg,#1d634c,#104733)] text-white" : "border-[#d8eadf] bg-[#f3faf5] text-[#19243b]"}`}><p className={`text-xs font-semibold ${emphasized ? "text-white/80" : "text-[#15533d]"}`}>{label}</p><p className="mt-3 whitespace-nowrap text-[clamp(1.65rem,3.3vw,2.25rem)] font-bold leading-none tabular-nums tracking-[-0.05em]">{formatRate(rate)}</p><p className={`mt-3 text-xs leading-5 ${emphasized ? "text-white/75" : "text-[#52627d]"}`}>{note}</p></article>; }
function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) { return <section className="scroll-mt-6 space-y-6 py-10 first:pt-0 [&>p]:max-w-3xl [&>p]:text-[1.03rem] [&>p]:leading-[1.8] [&>p]:text-slate-950 sm:[&>p]:text-lg" id={id}><h2 className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem]">{title}</h2>{children}</section>; }
function InfoCard({ children, title }: { children: ReactNode; title: string }) { return <article className="rounded-[8px] border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{children}</p></article>; }
function InfoGrid({ items }: { items: readonly (readonly [string, string])[] }) { return <div className="grid gap-4 md:grid-cols-3">{items.map(([heading, text]) => <InfoCard key={heading} title={heading}>{text}</InfoCard>)}</div>; }
function Comparison({ label, rate }: { label: string; rate: number }) { return <article className="rounded-[9px] border border-[#d8eadf] bg-[#f3faf5] p-5"><p className="font-semibold text-slate-950">{label}</p><p className="mt-3 text-3xl font-bold tabular-nums text-[#15533d]">{formatRate(rate)}<span className="ml-2 text-sm font-medium text-slate-500">/time</span></p></article>; }
function SourceLine({ href, label }: { href: string; label: string }) { return <p className="text-xs leading-5 text-slate-500">Kilde: <a className="font-semibold text-[#15533d] hover:underline" href={href}>{label} ↗</a></p>; }
function DataTable({ headers, minWidth = "620px", rows }: { headers: string[]; minWidth?: string; rows: ReactNode[][] }) { return <div className="overflow-x-auto rounded-[5px] border border-black/10 bg-white"><table className="w-full border-collapse text-left" style={{ minWidth }}><thead className="bg-[#f1f7f2] text-sm text-slate-700"><tr>{headers.map((header) => <th className="px-4 py-3 font-semibold" key={header}>{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 text-sm text-slate-800">{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td className="px-4 py-3.5" key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }

function getFaq(rate: NonNullable<ReturnType<typeof getAgricultureMinimumWageForDate>>) { return [
  { question: "Hva er minstelønnen i jordbruk og gartneri i 2026?", answer: `Gjeldende sats avhenger av arbeidsforhold, alder og praksis. Fast ansatte ufaglærte har minst ${formatRate(rate.permanentUnskilledRate)} per time. Sesongarbeidere over 18 år har minst ${formatRate(rate.seasonalAdultUpTo12WeeksRate)} de første 12 ukene og ${formatRate(rate.seasonalAdultOver12WeeksRate)} fram til seks måneders praksis.` },
  { question: "Hva er minstelønnen for sesongarbeidere over 18 år?", answer: `Satsen er ${formatRate(rate.seasonalAdultUpTo12WeeksRate)} per time inntil 12 ukers relevant praksis og ${formatRate(rate.seasonalAdultOver12WeeksRate)} etter mer enn 12 uker og fram til seks måneder.` },
  { question: "Hva får en sesongarbeider under 18 år?", answer: `Ferie- og innhøstingshjelp under 18 år har krav på minst ${formatRate(rate.seasonalUnder18Rate)} per time. Fast ansatte under 18 år har minst ${formatRate(rate.permanentUnder18Rate)}.` },
  { question: "Når får en sesongarbeider satsen for fast ansatte?", answer: `Etter mer enn seks måneders relevant og dokumentert praksis gjelder den ufaglærte satsen for fast ansatte, som nå er ${formatRate(rate.permanentUnskilledRate)} per time.` },
  { question: "Teller praksis fra tidligere arbeidsgivere?", answer: "Ja. Relevant og dokumentert praksis fra jordbruk og gartneri skal telle, ikke bare praksis hos nåværende arbeidsgiver." },
  { question: "Har alle krav på 25 prosent helgetillegg?", answer: "Nei. Det lovpålagte tillegget gjelder røktere og avløsere som arbeider i fast turnus på de angitte helge- og helligdagstidene." },
  { question: "Gjelder minstelønnen for lærlinger?", answer: "Nei. Lærlinger og deltakere på arbeidsmarkedstiltak er unntatt fra den allmenngjorte forskriften." },
  { question: "Er tarifftillegget i 2026 ny lovpålagt minstelønn?", answer: "Nei. Tariffoppgjøret gjelder tariffbundne arbeidsforhold og blir ikke automatisk lovpålagt for alle. De allmenngjorte satsene fra 15. juni 2025 gjelder inntil en ny forskrift trer i kraft." },
]; }
function formatRate(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
