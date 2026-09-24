import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CleaningMinimumWageChart } from "@/components/cleaning-minimum-wage-chart";
import { CleaningNightSupplementChart } from "@/components/cleaning-night-supplement-chart";
import {
  cleaningAllmenngjoringStatus2026,
  cleaningImplementedMinimumWageRates,
  cleaningMinimumWageRules,
  getCleaningMinimumWageForDate,
  validateCleaningMinimumWageRates,
} from "@/lib/cleaning-minimum-wage";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pagePath = "/minstelonn-renholder";
const currentYear = new Date().getFullYear();
const title = `Minstelønn renholder ${currentYear} – satser, tillegg og historikk`;
const description = "Se gjeldende minstelønn for renholdere i 2026. Finn satser for voksne og unge, nattillegg, overtid, reisetid og historisk utvikling.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pagePath },
  openGraph: { type: "website", locale: "nb_NO", url: pagePath, siteName: siteConfig.name, title: `${title} | ${siteConfig.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
};

const sections = [
  { id: "hvem-gjelder-det-for", label: "Hvem gjelder den for?" },
  { id: "nattarbeid", label: "Nattarbeid" },
  { id: "under-18", label: "Under 18 år" },
  { id: "overtid", label: "Overtid" },
  { id: "reisetid", label: "Reisetid" },
  { id: "tariff", label: "Tariff vs. minstelønn" },
  { id: "faq", label: "Ofte stilte spørsmål" },
];

const salaryTools = [
  { href: "/yrker", label: "Alle yrker", description: "Utforsk lønnstall for hundrevis av yrker" },
  { href: "/lonnsjekk", label: "Lønnsjekk", description: "Sammenlign lønnen din med relevant statistikk" },
  { href: "/jobbtilbud", label: "Lønnstilbud", description: "Vurder lønnen i et nytt jobbtilbud" },
  { href: "/lonnskalkulator", label: "Lønnskalkulator", description: "Regn om mellom års-, måneds- og timelønn" },
] as const;

const recommendedArticles = [
  { href: "/blogg/5-ting-du-bor-ha-klart-for-lonnssamtalen", label: "5 ting du bør ha klart før lønnssamtalen", category: "Lønnsforhandling" },
  { href: "/blogg/7-gode-argumenter-for-a-be-om-hoyere-lonn", label: "7 gode argumenter for å be om høyere lønn", category: "Lønnsforhandling" },
  { href: "/blogg/hvilke-yrker-tjener-over-1-million", label: "Hvilke yrker tjener over 1 million kroner?", category: "Lønnsinnsikt" },
  { href: "/blogg/dette-er-norges-vanligste-yrker", label: "Dette er Norges vanligste yrker", category: "Lønnsinnsikt" },
] as const;

export default function MinstelonnRenholderPage() {
  const validationErrors = validateCleaningMinimumWageRates();
  if (validationErrors.length) throw new Error(`Ugyldig minstelønnsdatasett: ${validationErrors.join("; ")}`);

  const today = new Date().toISOString().slice(0, 10);
  const currentRate = getCleaningMinimumWageForDate(today);
  if (!currentRate) throw new Error(`Fant ingen minstelønnssats som gjelder ${today}.`);

  const latestRateYear = Number(currentRate.effectiveFrom.slice(0, 4));
  const minimumWageGrowth = [1, 5, 10].map((period) => {
    const comparisonYear = latestRateYear - period;
    const comparisonRate = getCleaningMinimumWageForDate(`${comparisonYear}-12-31`);
    if (!comparisonRate) throw new Error(`Fant ingen sammenlignbar minstelønnssats for ${comparisonYear}.`);
    return {
      period,
      years: `${comparisonYear}–${latestRateYear}`,
      adult: ((currentRate.adultRate / comparisonRate.adultRate) - 1) * 100,
      under18: ((currentRate.under18Rate / comparisonRate.under18Rate) - 1) * 100,
    };
  });

  const faqItems = getFaqItems(currentRate.adultRate, currentRate.under18Rate, currentRate.nightSupplement);
  const structuredData = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Hjem", item: getAbsoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Minstelønn for renholdere", item: getAbsoluteUrl(pagePath) }] },
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: getAbsoluteUrl(pagePath), inLanguage: "nb-NO", dateModified: currentRate.verifiedAt },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      {structuredData.map((data, index) => <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} key={index} type="application/ld+json" />)}
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Brødsmulesti" className="text-center text-sm text-[#52627d]"><ol className="flex flex-wrap items-center justify-center gap-3"><li><Link className="hover:text-[var(--primary)] hover:underline" href="/">Hjem</Link></li><li aria-hidden="true">/</li><li><Link className="hover:text-[var(--primary)] hover:underline" href="/forklarer/minstelonn">Minstelønn</Link></li><li aria-hidden="true">/</li><li aria-current="page">Renholdere</li></ol></nav>

        <div className="relative mx-auto mt-7 max-w-[1080px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#fbfdfb_50%,#f1f7f2_100%)] px-5 pb-8 pt-8 sm:px-10 lg:min-h-[410px] lg:px-[250px] lg:pb-10">
          <div aria-hidden="true" className="absolute -left-24 top-8 hidden size-72 rotate-[28deg] rounded-[44%] bg-[#dfeee3]/75 lg:block" />
          <div className="absolute right-8 top-8 hidden h-[330px] w-[220px] overflow-hidden rounded-[46%_46%_18%_46%] lg:block">
            <Image alt="Sprayflasker i blåtoner, blå mikrofiberklut og børste brukt til profesjonelt renhold" className="h-full w-full object-cover object-[68%_72%]" fill priority sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 220px" src="/images/minimum-wage/renholder-hero-v2.png" />
          </div>
          <header className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full bg-[#e8f4eb] px-5 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#15533d]">Renholdsbransjen</p>
            <h1 className="mx-auto mt-6 max-w-[650px] text-[clamp(2.55rem,5.2vw,5.1rem)] font-[760] leading-[1.03] tracking-normal text-[#101820]">Minstelønn<br className="hidden sm:block" /> for renholdere</h1>
            <p className="mx-auto mt-5 max-w-[600px] text-base leading-[1.6] text-[#3f4a45] sm:text-[1.12rem] sm:leading-[1.62]">Renhold er en av bransjene i Norge med lovpålagt minstelønn. For arbeidstakere over 18 år som omfattes av renholdsforskriften, er minstelønnen {formatRate(currentRate.adultRate)} per time. Her finner du dagens satser, historisk utvikling og reglene for nattarbeid, overtid, reisetid og arbeidstøy.</p>
          </header>
          <div className="relative z-10 mx-auto mt-6 h-44 w-full max-w-sm overflow-hidden rounded-[28px] sm:h-52 lg:hidden"><Image alt="Sprayflasker i blåtoner, blå mikrofiberklut og børste brukt til profesjonelt renhold" className="h-full w-full object-cover object-[65%_70%]" fill priority sizes="(max-width: 1024px) 384px, 0px" src="/images/minimum-wage/renholder-hero-v2.png" /></div>
          <div className="relative z-10 mx-auto mt-6 grid max-w-[620px] gap-3 text-sm text-[#52627d] sm:grid-cols-3">
            <p><strong className="block text-[#15533d]">Gjeldende fra</strong>{formatDate(currentRate.effectiveFrom)}</p><p><strong className="block text-[#15533d]">Nattarbeid 21:00–06:00</strong>minst +{formatRate(currentRate.nightSupplement)}/time</p><p><strong className="block text-[#15533d]">Sist kontrollert</strong>{formatDate(currentRate.verifiedAt)}</p>
          </div>
        </div>

        <div className="mx-auto mt-9 grid max-w-[840px] gap-5 sm:grid-cols-2">
          <RateCard emphasized label="Over 18 år" rate={currentRate.adultRate} />
          <RateCard label="Under 18 år" rate={currentRate.under18Rate} />
        </div>

        <div id="utvikling" className="mx-auto mt-7 max-w-[900px] scroll-mt-24">
          <CleaningMinimumWageChart points={cleaningImplementedMinimumWageRates.map(({ effectiveFrom, adultRate, under18Rate }) => ({ effectiveFrom, adultRate, under18Rate }))} today={today} />
        </div>

        <div aria-label="Prosentvis utvikling i minstelønn" className="mx-auto mt-5 grid max-w-[900px] gap-3 sm:grid-cols-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-slate-500 sm:col-span-3">Prosentvis vekst i minstelønn</p>
          {minimumWageGrowth.map((growth) => <article className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:px-5" key={growth.period}><div className="flex items-baseline justify-between gap-3"><h2 className="font-bold text-slate-950">{growth.period} års vekst</h2><span className="text-xs tabular-nums text-slate-500">{growth.years}</span></div><dl className="mt-4 space-y-2.5"><div className="flex items-center justify-between gap-3"><dt className="flex items-center gap-2 text-sm text-slate-600"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#15533d]" />Over 18 år</dt><dd className="text-lg font-bold tabular-nums text-[#15533d]">+{formatPercent(growth.adult)}</dd></div><div className="flex items-center justify-between gap-3"><dt className="flex items-center gap-2 text-sm text-slate-600"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#93b4a5]" />Under 18 år</dt><dd className="text-lg font-bold tabular-nums text-[#557f6d]">+{formatPercent(growth.under18)}</dd></div></dl></article>)}
        </div>

        <nav aria-labelledby="innholdsfortegnelse" className="mx-auto mt-7 max-w-[900px] rounded-[11px] border border-slate-200 bg-slate-50 px-5 py-4 sm:px-7 sm:py-5">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-950" id="innholdsfortegnelse">Innhold på siden</h2>
          <ol className="mt-3 grid grid-cols-1 text-base">
            {sections.map((section, index) => <li key={section.id}><a className="group grid grid-cols-[2rem_minmax(0,1fr)] items-baseline rounded-[7px] px-2 py-1.5 text-slate-800 transition-colors hover:bg-white hover:text-[var(--primary)]" href={`#${section.id}`}><span className="text-xs tabular-nums text-slate-400">{String(index + 1).padStart(2, "0")}</span><span className="font-medium group-hover:underline">{section.label}</span></a></li>)}
          </ol>
        </nav>

        <div className="mx-auto mt-8 max-w-[900px] min-w-0">
            <Section id="hvem-gjelder-det-for" title="Hvem har krav på minstelønnen?">
              <div className="max-w-3xl space-y-7 text-[1.03rem] leading-[1.8] text-slate-950 sm:text-lg sm:leading-[1.95]">
                <div><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Virksomheten avgjør</h3><p className="mt-2">Forskriften gjelder private bedrifter som driver salg av renholdstjenester, og ansatte i slike bedrifter som utfører renhold. Yrkestittelen alene er ikke nok.</p></div>
                <div><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Direkte ansatte renholdere</h3><p className="mt-2">En renholder som er direkte ansatt hos virksomheten der renholdet utføres, omfattes ikke automatisk av akkurat denne forskriften.</p></div>
                <div><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Tariffbundne virksomheter</h3><p className="mt-2">Forskriften har særskilte unntak for enkelte virksomheter med tariffavtale inngått med fagforening med innstillingsrett. Renholdsoverenskomsten og rammetimetall har egne avgrensninger.</p></div>
                <div><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-2xl">Andre unntak</h3><p className="mt-2">Lærlinger under Reform 94 og personer på arbeidsmarkedstiltak er unntatt. Samlet gunstigere lønns- og arbeidsvilkår kan også innebære at forskriften ikke brukes.</p></div>
              </div>
              <SourceLine href={`${cleaningMinimumWageRules.sourceUrl}#§2`} label="Lovdata, § 2" />
            </Section>

            <Section id="nattarbeid" title="Tillegg for nattarbeid"><p>For arbeid mellom klokken {cleaningMinimumWageRules.nightFrom} og {cleaningMinimumWageRules.nightTo} skal lønnstillegg avtales i hvert enkelt tilfelle. Tillegget skal minst være {formatRate(currentRate.nightSupplement)} per time.</p><p>Har du høyere avtalt timelønn enn minstelønnen, beholder du den og får relevant tillegg etter reglene.</p><CleaningNightSupplementChart points={cleaningImplementedMinimumWageRates.map(({ effectiveFrom, nightSupplement }) => ({ effectiveFrom, nightSupplement }))} today={today} /><SourceLine href={`${cleaningMinimumWageRules.sourceUrl}#§3`} label="Lovdata, § 3" /></Section>

            <Section id="under-18" title="Minstelønn for renholdere under 18 år"><p>Arbeidstakere under 18 år som omfattes av forskriften, skal minst ha {formatRate(currentRate.under18Rate)} per time fra {formatDate(currentRate.effectiveFrom)}. Unge arbeidstakere er i tillegg omfattet av særskilte arbeidstids- og HMS-regler.</p><SourceLine href={cleaningMinimumWageRules.labourInspectionUrl} label="Arbeidstilsynet – minstelønn og unge arbeidstakere" /></Section>

            <Section id="overtid" title="Overtid for renholdere"><p>Arbeidsmiljøloven gir som hovedregel krav på minst 40 prosent overtidstillegg av avtalt timelønn. Overtidstillegget beregnes derfor ikke nødvendigvis av minstelønnssatsen.</p><p>Tariffavtale eller arbeidsavtale kan gi bedre vilkår.</p><SourceLine href={cleaningMinimumWageRules.labourInspectionUrl} label="Arbeidstilsynet – overtidstillegg i renholdsbransjen" /></Section>

            <Section id="reisetid" title="Skal renholdere ha betalt for reisetid?"><p>Når forskjellige renholdsoppdrag følger rett etter hverandre, skal reisetiden mellom oppdragene enten regnes inn i arbeidstiden eller lønnes særskilt. Ekstra kostnader som oppstår ved reisen, dekkes etter avtale.</p><div className="grid gap-4 md:grid-cols-2"><InfoCard title="Hjem → første oppdrag">Vanlig reise mellom hjem og arbeidssted er ikke det samme som forskriftens regel om reise mellom påfølgende oppdrag.</InfoCard><InfoCard title="Oppdrag A → oppdrag B">Denne forflytningen omfattes når oppdragene følger rett etter hverandre. Unntak gjelder for ansatte under Renholdsoverenskomsten som omfattes av rammetimetall.</InfoCard></div><SourceLine href={`${cleaningMinimumWageRules.sourceUrl}#§5`} label="Lovdata, § 5" /></Section>

            <Section id="tariff" title="Tariffsats og lovpålagt minstelønn er ikke alltid det samme"><p>Tariffavtalen kan få nye satser før Tariffnemnda eventuelt gjør dem bindende gjennom allmenngjøring. Tariffsatsen gjelder tariffbundne arbeidsforhold, mens allmenngjort minstelønn er det lovpålagte gulvet for arbeidstakere som omfattes av forskriften.</p><div className="grid gap-4 md:grid-cols-2"><ComparisonCard eyebrow="Gjeldende lovkrav" title="Allmenngjort minstelønn" rate={currentRate.adultRate}>Gjelder fra {formatDate(currentRate.effectiveFrom)} for ansatte over 18 år som omfattes av forskriften.</ComparisonCard><ComparisonCard eyebrow="Forslag – ikke vedtatt" title="Foreslått 2026-sats" rate={cleaningAllmenngjoringStatus2026.proposedAdultRate}>Tariffnemndas utkast foreslår også {formatRate(cleaningAllmenngjoringStatus2026.proposedUnder18Rate)} for arbeidstakere under 18 år. Forslaget har ingen fastsatt ikrafttredelsesdato.</ComparisonCard></div><div className="rounded-[5px] border border-amber-700/25 bg-amber-50 px-5 py-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Status 2026</p><h3 className="mt-2 text-xl font-semibold text-slate-950">Ny allmenngjøringsforskrift er under behandling</h3><p className="mt-2 text-sm leading-6 text-slate-700">Tariffnemnda oppgir status <strong>{cleaningAllmenngjoringStatus2026.status}</strong>. Høringsfristen var {formatDate(cleaningAllmenngjoringStatus2026.hearingDeadline)}. Dagens satser gjelder til et nytt vedtak eventuelt trer i kraft.</p><SourceLine href={cleaningAllmenngjoringStatus2026.sourceUrl} label="Tariffnemnda – renhold" /></div></Section>

            <Section id="faq" title="Ofte stilte spørsmål"><div className="divide-y divide-slate-200 overflow-hidden rounded-[5px] border border-black/10 bg-white">{faqItems.map((item) => <details className="group px-5 py-4 open:bg-[#fbfbf8]" key={item.question}><summary className="cursor-pointer list-none pr-8 font-semibold text-slate-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-[var(--primary)] group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{item.answer}</p></details>)}</div></Section>

            <section aria-labelledby="videre-title" className="mt-14 overflow-hidden rounded-[18px] border border-[#cfded6] bg-[#f7faf8] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="border-b border-[#dce7e1] bg-white px-5 py-6 sm:px-8 sm:py-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Utforsk videre</p>
                <h2 className="mt-2 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem]">Fra minstelønn til faktisk lønn</h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">Minstelønn er et lovpålagt gulv, ikke det samme som vanlig lønn i yrket. Bruk lønnsverktøyene eller les mer om lønnsnivå og lønnsforhandling.</p>
                <Link className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]" href="/yrke/renholdere-i-bedrifter-lonn">Se hva renholdere faktisk tjener <span aria-hidden="true">→</span></Link>
              </div>

              <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Nyttige lønnsverktøy</h3>
                  <div className="mt-4 grid gap-2">
                    {salaryTools.map((item) => <Link className="group flex items-center justify-between gap-4 rounded-[10px] border border-slate-200 bg-white px-4 py-3 transition hover:border-[#9fc5b5] hover:shadow-sm" href={item.href} key={item.href}><span><strong className="block text-sm text-slate-950 group-hover:text-[var(--primary)]">{item.label}</strong><span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.description}</span></span><span aria-hidden="true" className="shrink-0 text-lg text-[var(--primary)]">→</span></Link>)}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-lg font-bold text-slate-950">Anbefalte artikler</h3><Link className="text-xs font-semibold text-[var(--primary)] hover:underline" href="/blogg/kategori/lonnsforhandling">Alle om lønnsforhandling →</Link></div>
                  <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                    {recommendedArticles.map((article) => <Link className="group flex items-start justify-between gap-4 py-3.5" href={article.href} key={article.href}><span><span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{article.category}</span><strong className="mt-1 block text-sm leading-5 text-slate-950 group-hover:text-[var(--primary)] group-hover:underline">{article.label}</strong></span><span aria-hidden="true" className="mt-3 shrink-0 text-lg text-[var(--primary)]">→</span></Link>)}
                  </div>
                </div>
              </div>
            </section>
        </div>
      </div>
    </main>
  );
}

function RateCard({ label, rate, emphasized = false }: { label: string; rate: number; emphasized?: boolean }) { return <div className={`min-w-0 rounded-[11px] border px-6 py-6 shadow-[0_10px_30px_rgba(19,37,64,0.05)] sm:px-7 ${emphasized ? "border-[#15533d] bg-[linear-gradient(135deg,#1d634c,#104733)] text-white" : "border-[#d8eadf] bg-[#f3faf5] text-[#19243b]"}`}><div className="flex items-center gap-5"><span aria-hidden="true" className={`flex size-14 shrink-0 items-center justify-center rounded-full ${emphasized ? "bg-white/18 text-white" : "bg-[#dff0e4] text-[#15533d]"}`}><svg fill="none" height="30" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="30"><circle cx="12" cy="7" r="3.5" /><path d="M4.5 21v-2.5A5.5 5.5 0 0 1 10 13h4a5.5 5.5 0 0 1 5.5 5.5V21z" /></svg></span><p className={`text-base leading-7 ${emphasized ? "text-white" : "text-[#19243b]"}`}>Minstelønn per time<br /><span className="font-medium">{label}</span></p></div><p className={`mt-5 whitespace-nowrap text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-none tabular-nums tracking-[-0.06em] ${emphasized ? "text-white" : "text-[#15533d]"}`}>{formatRate(rate)}<span className={`ml-2 text-lg font-normal tracking-normal sm:text-2xl ${emphasized ? "text-white/80" : "text-[#52627d]"}`}>/ time</span></p><p className={`mt-4 text-sm ${emphasized ? "text-white/80" : "text-[#52627d]"}`}>Lovpålagt minstelønn for renholdere {label.toLowerCase()}</p></div>; }
function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) { return <section className="scroll-mt-6 space-y-6 py-10 first:pt-0 [&>p]:max-w-3xl [&>p]:text-[1.03rem] [&>p]:leading-[1.8] [&>p]:text-slate-950 sm:[&>p]:text-lg sm:[&>p]:leading-[1.95]" id={id}><h2 className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem] sm:leading-[1.1]">{title}</h2>{children}</section>; }
function InfoCard({ children, title }: { children: ReactNode; title: string }) { return <article className="rounded-[5px] border border-black/10 bg-white p-5"><h3 className="text-lg font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{children}</p></article>; }
function ComparisonCard({ children, eyebrow, rate, title }: { children: ReactNode; eyebrow: string; rate: number; title: string }) { return <article className="rounded-[5px] border border-black/10 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[var(--primary)]">{eyebrow}</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{title}</h3><p className="mt-3 text-3xl font-bold tabular-nums text-slate-950">{formatRate(rate)}<span className="text-sm font-medium text-slate-500">/time</span></p><p className="mt-3 text-sm leading-6 text-slate-700">{children}</p></article>; }
function SourceLine({ href, label }: { href: string; label: string }) { return <p className="text-xs leading-5 text-slate-500">Kilde: <a className="font-semibold text-[var(--primary)] hover:underline" href={href}>{label} ↗</a></p>; }

function getFaqItems(adultRate: number, under18Rate: number, nightSupplement: number) {
  return [
    { question: `Hva er minstelønnen for en renholder i ${currentYear}?`, answer: `Den gjeldende lovpålagte satsen er ${formatRate(adultRate)} per time for arbeidstakere over 18 år og ${formatRate(under18Rate)} for arbeidstakere under 18 år som omfattes av renholdsforskriften. Satsene gjelder fra 15. juni 2025.` },
    { question: "Gjelder minstelønnen alle renholdere?", answer: "Nei. Forskriften gjelder ansatte som utfører renhold i private bedrifter som selger renholdstjenester. En renholder som er direkte ansatt på for eksempel et hotell, sykehus eller kontor, omfattes ikke nødvendigvis av denne forskriften." },
    { question: "Hva er minstelønnen for renholdere under 18 år?", answer: `Satsen er ${formatRate(under18Rate)} per time fra 15. juni 2025 for unge arbeidstakere som omfattes av forskriften.` },
    { question: "Hva er nattillegget for renholdere?", answer: `For arbeid mellom klokken 21:00 og 06:00 skal tillegg avtales i hvert enkelt tilfelle. Tillegget skal minst være ${formatRate(nightSupplement)} per time.` },
    { question: "Hva får en renholder i overtidsbetaling?", answer: "Arbeidsmiljøloven gir som hovedregel minst 40 prosent tillegg av den avtalte timelønnen. Tariff- eller arbeidsavtale kan gi bedre vilkår." },
  ];
}

function formatRate(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function formatPercent(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
