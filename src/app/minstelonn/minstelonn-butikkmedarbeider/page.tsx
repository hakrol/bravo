import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdsenseAd } from "@/components/adsense-ad";
import { ArticleBreadcrumbs } from "@/components/article-breadcrumbs";
import { RetailTariffChart } from "@/components/retail-tariff-chart";
import { RetailRateFinder, RetailShiftCalculator, RetailTariffHistoryTable } from "@/components/retail-tariff-tools";
import { getRetailRateSetForDate, RETAIL_TARIFF_VERIFIED_AT, retailRateKeys, retailRateLabels, retailTariffRateSets, retailUbSupplements, validateRetailTariffData } from "@/lib/retail-tariff";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pagePath = "/minstelonn/minstelonn-butikkmedarbeider";
const title = "Minstelønn butikkmedarbeider 2026 – tariff og lønnstrinn";
const description = "Se tariffsatser for butikkmedarbeidere i 2026. Finn lønnstrinn, ungdomssatser, ansiennitet og tillegg for kveld, lørdag og søndag.";
const agreementUrl = "https://hk.no/shared-files/3348/?Landsoverenskomsten+HK-Virke+2024-2026+Web.pdf=";
const virkeUrl = "https://www.virke.no/tariff-og-lonn/finn-tariffavtale/landsoverenskomsten-hk/";
const historyUrl = "https://www.virke.no/tariff-og-lonn/finn-tariffavtale/landsoverenskomsten-hk/historikk/";
const labourInspectionUrl = "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/";
const current = retailTariffRateSets.at(-1)!;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pagePath },
  openGraph: { type: "website", locale: "nb_NO", url: pagePath, siteName: siteConfig.name, title: `${title} | ${siteConfig.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
};

const sections = [
  { id: "hvem-gjelder-det-for", label: "Hvem gjelder satsene for?" },
  { id: "lonnstrinn", label: "Hvordan fungerer lønnstrinnene?" },
  { id: "finn-sats", label: "Finn din sats" },
  { id: "ub", label: "Kveld, natt og helg" },
  { id: "overtid", label: "Overtid" },
  { id: "ungdom", label: "Ungdomssatser" },
  { id: "ansiennitet", label: "Ansiennitet og fagbrev" },
  { id: "arbeidstid", label: "Arbeidstid" },
  { id: "tariff-lov", label: "Tariff og lovpålagt lønn" },
  { id: "historikk", label: "Historiske satser" },
  { id: "faq", label: "Ofte stilte spørsmål" },
] as const;

const salaryTools = [
  { href: "/yrker", label: "Alle yrker", description: "Utforsk lønnstall for hundrevis av yrker" },
  { href: "/lonnsjekk", label: "Lønnsjekk", description: "Sammenlign lønnen din med relevant statistikk" },
  { href: "/jobbtilbud", label: "Lønnstilbud", description: "Vurder lønnen i et nytt jobbtilbud" },
  { href: "/lonnskalkulator", label: "Lønnskalkulator", description: "Regn om mellom års-, måneds- og timelønn" },
] as const;

const recommendedArticles = [
  { href: "/blogg/dette-er-norges-vanligste-yrker", label: "Dette er Norges vanligste yrker", category: "Lønnsinnsikt" },
  { href: "/blogg/butikksjef-eller-salgsleder", label: "Butikksjef eller salgsleder: hvilket yrke lønner seg mest?", category: "Varehandel" },
  { href: "/blogg/5-ting-du-bor-ha-klart-for-lonnssamtalen", label: "5 ting du bør ha klart før lønnssamtalen", category: "Lønnsforhandling" },
  { href: "/blogg/7-gode-argumenter-for-a-be-om-hoyere-lonn", label: "7 gode argumenter for å be om høyere lønn", category: "Lønnsforhandling" },
] as const;

export default function MinstelonnButikkmedarbeiderPage() {
  const validationErrors = validateRetailTariffData();
  if (validationErrors.length) throw new Error(`Ugyldig tariffdatasett: ${validationErrors.join("; ")}`);

  const latestYear = Number(current.effectiveFrom.slice(0, 4));
  const tariffGrowth = [1, 5, 10].map((period) => {
    const comparisonYear = latestYear - period;
    const comparison = getRetailRateSetForDate(`${comparisonYear}-12-31`);
    if (!comparison) throw new Error(`Fant ingen sammenlignbar tariffsats for ${comparisonYear}.`);
    return {
      period,
      years: `${comparisonYear}–${latestYear}`,
      rates: Object.fromEntries(retailRateKeys.map((key) => [
        key,
        ((current.rates[key].hourly / comparison.rates[key].hourly) - 1) * 100,
      ])) as Record<(typeof retailRateKeys)[number], number>,
    };
  });
  const faqItems = getFaqItems();
  const structuredData = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Hjem", item: getAbsoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Minstelønn", item: getAbsoluteUrl("/minstelonn") }, { "@type": "ListItem", position: 3, name: "Minstelønn for butikkmedarbeidere", item: getAbsoluteUrl(pagePath) }] },
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: getAbsoluteUrl(pagePath), inLanguage: "nb-NO", dateModified: RETAIL_TARIFF_VERIFIED_AT },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      {structuredData.map((data, index) => <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} key={index} type="application/ld+json" />)}
      <div className="mx-auto max-w-7xl">
        <ArticleBreadcrumbs href="/minstelonn" section="Minstelønn" title="Butikkmedarbeidere" />

        <div className="relative mx-auto mt-7 max-w-[1080px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#fbfdfb_50%,#f1f7f2_100%)] px-5 pb-8 pt-8 sm:px-10 lg:min-h-[410px] lg:px-[250px] lg:pb-10">
          <div aria-hidden="true" className="absolute -left-24 top-8 hidden size-72 rotate-[28deg] rounded-[44%] bg-[#dfeee3]/75 lg:block" />
          <div className="absolute right-8 top-8 hidden h-[330px] w-[205px] overflow-hidden rounded-[46%_46%_18%_46%] lg:block"><Image alt="Strekkodeskanner, varer og handlenett ved en moderne butikkasse" className="h-full w-full object-cover object-[65%_72%]" fill priority sizes="205px" src="/images/minimum-wage/butikkmedarbeider-hero.png" /></div>
          <header className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full bg-[#e8f4eb] px-5 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#15533d]">Varehandel · Virke–HK</p>
            <h1 className="mx-auto mt-6 flex max-w-[590px] flex-col items-center text-center text-[clamp(1.7rem,4vw,3.25rem)] font-[760] leading-[1.06] tracking-[-0.025em] text-[#101820]"><span>Minstelønn</span><span>for</span><span className="whitespace-nowrap">butikkmedarbeidere</span></h1>
            <p className="mx-auto mt-5 max-w-[640px] text-base leading-[1.6] text-[#3f4a45] sm:text-[1.12rem] sm:leading-[1.62]">Butikkmedarbeidere har ikke en generell lovpålagt minstelønn. Er arbeidsplassen bundet av tariffavtale, kan du likevel ha krav på en bestemt minstesats. Her viser vi satsene i Landsoverenskomsten mellom Virke og HK.</p>
          </header>
          <div className="relative z-10 mx-auto mt-6 h-44 w-full max-w-sm overflow-hidden rounded-[28px] sm:h-52 lg:hidden"><Image alt="Strekkodeskanner, varer og handlenett ved en moderne butikkasse" className="h-full w-full object-cover object-[62%_70%]" fill priority sizes="(max-width: 1024px) 384px, 0px" src="/images/minimum-wage/butikkmedarbeider-hero.png" /></div>
          <div className="relative z-10 mx-auto mt-6 grid max-w-[620px] gap-3 text-sm text-[#52627d] sm:grid-cols-3"><p><strong className="block text-[#15533d]">Type sats</strong>Tariff – ikke lovbestemt</p><p><strong className="block text-[#15533d]">Gjeldende fra</strong>{date(current.effectiveFrom)}</p><p><strong className="block text-[#15533d]">Sist kontrollert</strong>{date(RETAIL_TARIFF_VERIFIED_AT)}</p></div>
        </div>

        <section aria-labelledby="dagens-satser-title" className="mx-auto mt-9 max-w-[900px]" id="dagens-satser">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">Virke–HK</p><h2 className="mt-1 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem]" id="dagens-satser-title">Tariffsatsene fra 1. april 2026</h2></div><p className="text-sm text-slate-500">Per time · per måned</p></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{retailRateKeys.map((key) => <article className="rounded-[11px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]" key={key}><h3 className="font-semibold text-slate-950">{retailRateLabels[key]}</h3><p className="mt-3 whitespace-nowrap text-2xl font-bold tabular-nums text-[#15533d]">{money(current.rates[key].hourly)}<span className="text-xs font-medium text-slate-500"> / time</span></p><p className="mt-1 text-sm tabular-nums text-slate-600">{wholeMoney(current.rates[key].monthly)} / måned</p></article>)}</div>
          <p className="mt-4 text-sm leading-6 text-slate-600">Satsene gjelder arbeidsforhold som omfattes av Landsoverenskomsten mellom Virke og HK. De er ikke generell lovpålagt minstelønn i butikk.</p>
        </section>

        <div id="utvikling" className="mx-auto mt-7 max-w-[900px] scroll-mt-24"><RetailTariffChart rateSets={retailTariffRateSets.map((set) => ({ effectiveFrom: set.effectiveFrom, rates: set.rates }))} /></div>

        <div aria-label="Prosentvis utvikling i tariffsatsene" className="mx-auto mt-5 grid max-w-[900px] gap-3 sm:grid-cols-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-slate-500 sm:col-span-3">Prosentvis vekst i tariffsatsene</p>
          {tariffGrowth.map((growth) => <article className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:px-5" key={growth.period}><div className="flex items-baseline justify-between gap-3"><h2 className="font-bold text-slate-950">{growth.period} års vekst</h2><span className="text-xs tabular-nums text-slate-500">{growth.years}</span></div><dl className="mt-4 space-y-2">{retailRateKeys.map((key, index) => <div className="flex items-center justify-between gap-3" key={key}><dt className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm"><span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${index % 2 === 0 ? "bg-[#15533d]" : "bg-[#93b4a5]"}`} />{growthLabel(key)}</dt><dd className="text-sm font-bold tabular-nums text-[#15533d] sm:text-base">+{percent(growth.rates[key])}</dd></div>)}</dl></article>)}
        </div>

        <AdsenseAd className="mx-auto mt-8 max-w-[900px]" placement="overview-between-sections" />

        <nav aria-labelledby="innholdsfortegnelse" className="mx-auto mt-7 max-w-[900px] rounded-[11px] border border-slate-200 bg-slate-50 px-5 py-4 sm:px-7 sm:py-5">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-950" id="innholdsfortegnelse">Innhold på siden</h2>
          <ol className="mt-3 grid grid-cols-1 text-base">{sections.map((section, index) => <li key={section.id}><a className="group grid grid-cols-[2rem_minmax(0,1fr)] items-baseline rounded-[7px] px-2 py-1.5 text-slate-800 transition-colors hover:bg-white hover:text-[var(--primary)]" href={`#${section.id}`}><span className="text-xs tabular-nums text-slate-400">{String(index + 1).padStart(2, "0")}</span><span className="font-medium group-hover:underline">{section.label}</span></a></li>)}</ol>
        </nav>

        <div className="mx-auto mt-8 max-w-[900px] min-w-0">
          <Section id="hvem-gjelder-det-for" title="Hvem gjelder tariffsatsene for?">
            <div className="max-w-3xl space-y-7 text-[1.03rem] leading-[1.8] text-slate-950 sm:text-lg sm:leading-[1.95]">
              <div><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] sm:text-2xl">Butikk har ikke generell lovpålagt minstelønn</h3><p className="mt-2">Varehandel er ikke blant bransjene med allmenngjort minstelønn. Uten tariffavtale avtales lønnen i arbeidsavtalen innenfor de øvrige reglene i arbeidslivet.</p></div>
              <div><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] sm:text-2xl">Tariffavtalen må gjelde på arbeidsplassen</h3><p className="mt-2">Satsene på denne siden gjelder ansatte som omfattes av Landsoverenskomsten mellom Virke og HK. De gjelder ikke automatisk for alle som jobber i butikk.</p></div>
              <div><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] sm:text-2xl">Spør hvilken avtale virksomheten følger</h3><p className="mt-2">Arbeidsgiver eller tillitsvalgt kan bekrefte om arbeidsforholdet ditt følger Virke–HK eller en annen tariffavtale. Avtalen avgjør hvilke lønnstrinn, tillegg og arbeidstidsregler du har krav på.</p></div>
            </div>
            <Source href={labourInspectionUrl} label="Arbeidstilsynet – minstelønn" />
          </Section>

          <Section id="lonnstrinn" title="Hvordan fungerer lønnstrinnene?">
            <p>Måneds- og timelønnen er publisert av Virke. Satsene er et gulv i den aktuelle tariffavtalen, ikke et tak for hva du kan avtale i lønn. Oppgjøret ble godkjent i uravstemning 27. mai 2026.</p>
            <p>Ansatte som har fylt 18 år skal normalt minst ha trinn 1. Fra fylte 25 år er hovedregelen minst trinn 3, men skoleelever og studenter i visse kortvarige jobber kan være unntatt. Dokumentert praksis fra kontor, butikk og lager gir normalt ett trinn per år. Relevant yrkesutdanning etter videregående kan også gi ansiennitet.</p>
            <Source href={agreementUrl} label="Landsoverenskomsten §§ 12.2.2–12.2.6" />
          </Section>

          <Section id="finn-sats" title="Finn din tariffsats"><p>Verktøyet gir en veiledende minsteplassering etter alder, dokumentert praksis og relevant utdanning. Det brukes bare når arbeidsforholdet omfattes av Virke–HK-avtalen.</p><RetailRateFinder rateSet={current} /><Source href={agreementUrl} label="Landsoverenskomsten § 12.2" /></Section>

          <Section id="ub" title="Kvelds-, natt- og helgetillegg"><p>UB-tilleggene følger Landsoverenskomsten. Den publiserte 2026-protokollen endret lønnssatsene, men oppga ikke nye UB-beløp; satsene i gjeldende avtaletekst er derfor videreført. UB utbetales ikke for timer som samtidig får overtids- eller skifttillegg.</p><div className="grid gap-4 sm:grid-cols-3"><Timeline title="Mandag–fredag" rows={[`Etter 18:00 → +${retailUbSupplements.weekdayAfter18} kr/time`, `Etter 21:00 → +${retailUbSupplements.weekdayAfter21} kr/time`]} /><Timeline title="Lørdag" rows={[`Etter 13:00 → +${retailUbSupplements.saturdayAfter13} kr/time`, `Etter 15:00 → +${retailUbSupplements.saturdayAfter15} kr/time`, `Etter 18:00 → +${retailUbSupplements.saturdayAfter18} kr/time`]} /><Timeline title="Søndag" rows={[`Hele døgnet → +${retailUbSupplements.sunday} kr/time`]} /></div><h3 className="pt-4 text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] sm:text-2xl">Hva tjener jeg på denne vakten?</h3><RetailShiftCalculator rateSet={current} /><Source href={agreementUrl} label="Landsoverenskomsten § 14.3" /></Section>

          <Section id="overtid" title="Overtid for butikkmedarbeidere"><p>Arbeidsmiljøloven krever minst 40 prosent overtidstillegg når arbeidet er overtid etter loven. Virke–HK har normalt 50 prosent tillegg og 100 prosent blant annet klokken 21–08 på hverdager, på søn- og helligdager, 1. og 17. mai, etter ordinær arbeidstid før søn- og helligdag og etter klokken 13.15 jul-, nyttårs- og pinseaften.</p><p>For deltidsansatte utløser avtalen overtidsbetaling når arbeidet går over 37,5 timer i én uke eller samlet arbeidstid går over 9 timer samme dag. Merarbeid under disse grensene er ikke automatisk tariffmessig overtid.</p><Source href={agreementUrl} label="Landsoverenskomsten § 3" /></Section>

          <Section id="ungdom" title="Tariffsatsene for unge butikkmedarbeidere"><p>Virke–HK-satsen er {money(current.rates.under16.hourly)} per time for ansatte under 16 år og {money(current.rates.under18.hourly)} per time for ansatte mellom 16 og 17 år. Dette er tariffsatsene i denne avtalen, ikke en generell lovpålagt ungdomslønn i norske butikker.</p><div className="grid gap-4 sm:grid-cols-2"><ComparisonCard label="Under 16 år" monthly={current.rates.under16.monthly} rate={current.rates.under16.hourly} /><ComparisonCard label="16–17 år" monthly={current.rates.under18.monthly} rate={current.rates.under18.hourly} /></div><Source href={virkeUrl} label="Virke – lønnssatser 2026" /></Section>

          <Section id="ansiennitet" title="Deltidsjobb, ansiennitet og fagbrev"><h3 className="text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] sm:text-2xl">Deltidspraksis</h3><p>Gjennomsnittlig minst 15 timer per uke gir normalt ett års lønnsansiennitet per år. Under 15 timer gir normalt ett år for hvert andre år. Praksisperioder under to måneder med under 10 timer i snitt per uke godskrives ikke. Annet relevant arbeid skal vurderes rimelig.</p><h3 className="pt-3 text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] sm:text-2xl">Har fagbrev betydning?</h3><p>Ja. Etter 2024–2026-avtalens bilag 2 A tilsvarer første år som faglært trinn 6. Andre år ligger over trinn 6. For faglærte fra treårig skole begynner stigen på trinn 2, går til trinn 6 andre år og over trinn 6 tredje år. De eksakte beløpene over trinn 6 må kontrolleres mot 2026-protokollen og bedriftens lønnsgrunnlag; derfor beregner verktøyet ikke faglærtsats automatisk.</p><Source href={agreementUrl} label="Landsoverenskomsten §§ 12.2, 13.4 og bilag 2 A" /></Section>

          <Section id="arbeidstid" title="Arbeidstid i butikk"><p>Landsoverenskomsten setter ordinær arbeidstid til høyst 37,5 timer per uke. Når driften krever arbeid minst hver tredje søndag, er tariffgrensen 35,5 timer. Dette er tariffregler – ikke en generell lovbestemt 37,5-timersuke for alle butikkansatte.</p><Source href={agreementUrl} label="Landsoverenskomsten § 2.8" /></Section>

          <Section id="tariff-lov" title="Tariffavtale og lovpålagt minstelønn er ikke det samme"><p>Tariffavtalen gir bindende minstesatser når arbeidsplassen og arbeidsforholdet omfattes av avtalen. Uten tariffavtale finnes det ingen generell minstelønn for butikkarbeid, og lønnen må avtales i arbeidsavtalen.</p><h3 className="pt-2 text-[1.35rem] font-bold leading-[1.2] tracking-[-0.03em] sm:text-2xl">Andre avtaler kan gjelde</h3><p>Butikker med lignende arbeid kan være bundet av ulike avtaler med ulike satser. Handelsoverenskomsten mellom HK og NHO Service og Handel kan gjelde detaljhandel direkte til forbruker. 2026-oppgjøret for denne avtalen er gjennomført og godkjent, men satsene er ikke blandet inn i tallene på denne siden.</p><p>Butikkoverenskomsten mellom HK og NHO er en annen avtale. Partene ble enige 7. september 2026. Ved siste kontroll 19. september var resultatet sendt til uravstemning med frist 29. september og derfor ikke endelig godkjent.</p><p>Spør arbeidsgiver eller tillitsvalgt hvilken avtale som gjelder. Minstesatsen er heller ikke det samme som vanlig eller forventet lønn i yrket.</p><Source href="https://hk.no/lonnsoppgjor-2026/" label="HK – tariffoppgjøret 2026" /></Section>

          <Section id="historikk" title="Historiske tariffsatser"><p>Tabellen viser de faktiske virkningsperiodene for garantiendringer i februar og tariffendringer i april. Velg lønnstrinn eller ungdomssats for å se hele utviklingen.</p><RetailTariffHistoryTable rateSets={[...retailTariffRateSets]} /><Source href={historyUrl} label="Virke – historiske satser" /></Section>

          <AdsenseAd className="my-8 sm:my-10" placement="occupation-before-faq" />

          <Section id="faq" title="Ofte stilte spørsmål"><div className="divide-y divide-slate-200 overflow-hidden rounded-[5px] border border-black/10 bg-white">{faqItems.map((item) => <details className="group px-5 py-4 open:bg-[#fbfbf8]" key={item.question}><summary className="cursor-pointer list-none pr-8 font-semibold text-slate-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-[var(--primary)] group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{item.answer}</p></details>)}</div></Section>

          <section aria-labelledby="videre-title" className="mt-14 overflow-hidden rounded-[18px] border border-[#cfded6] bg-[#f7faf8] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="border-b border-[#dce7e1] bg-white px-5 py-6 sm:px-8 sm:py-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Utforsk videre</p><h2 className="mt-2 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem]" id="videre-title">Fra tariffsats til faktisk butikklønn</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">Tariffsatsen er et gulv, ikke det samme som vanlig lønn i yrket. Sammenlign med SSB-tall eller bruk verktøyene våre før neste lønnssamtale.</p><Link className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]" href="/yrke/butikkmedarbeidere-lonn">Se hva butikkmedarbeidere faktisk tjener <span aria-hidden="true">→</span></Link></div>
            <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-2"><div><h3 className="text-lg font-bold text-slate-950">Nyttige lønnsverktøy</h3><div className="mt-4 grid gap-2">{salaryTools.map((item) => <Link className="group flex items-center justify-between gap-4 rounded-[10px] border border-slate-200 bg-white px-4 py-3 transition hover:border-[#9fc5b5] hover:shadow-sm" href={item.href} key={item.href}><span><strong className="block text-sm text-slate-950 group-hover:text-[var(--primary)]">{item.label}</strong><span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.description}</span></span><span aria-hidden="true" className="shrink-0 text-lg text-[var(--primary)]">→</span></Link>)}</div></div><div><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-lg font-bold text-slate-950">Anbefalte artikler</h3><Link className="text-xs font-semibold text-[var(--primary)] hover:underline" href="/blogg/kategori/lonnsforhandling">Alle om lønnsforhandling →</Link></div><div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">{recommendedArticles.map((article) => <Link className="group flex items-start justify-between gap-4 py-3.5" href={article.href} key={article.href}><span><span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{article.category}</span><strong className="mt-1 block text-sm leading-5 text-slate-950 group-hover:text-[var(--primary)] group-hover:underline">{article.label}</strong></span><span aria-hidden="true" className="mt-3 shrink-0 text-lg text-[var(--primary)]">→</span></Link>)}</div></div></div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) { return <section className="scroll-mt-6 space-y-6 py-10 first:pt-0 [&>p]:max-w-3xl [&>p]:text-[1.03rem] [&>p]:leading-[1.8] [&>p]:text-slate-950 sm:[&>p]:text-lg sm:[&>p]:leading-[1.95]" id={id}><h2 className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem] sm:leading-[1.1]">{title}</h2>{children}</section>; }
function Timeline({ rows, title }: { rows: string[]; title: string }) { return <article className="rounded-[11px] border border-[#15533d] bg-[linear-gradient(135deg,#1d634c,#104733)] p-5 text-white"><h3 className="text-xs font-bold uppercase tracking-[0.14em] text-green-100">{title}</h3><ul className="mt-4 space-y-3">{rows.map((row) => <li className="border-l-2 border-green-300 pl-3 font-semibold tabular-nums" key={row}>{row}</li>)}</ul></article>; }
function ComparisonCard({ label, monthly, rate }: { label: string; monthly: number; rate: number }) { return <article className="rounded-[11px] border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[var(--primary)]">Virke–HK</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{label}</h3><p className="mt-3 text-3xl font-bold tabular-nums text-slate-950">{money(rate)}<span className="text-sm font-medium text-slate-500">/time</span></p><p className="mt-2 text-sm text-slate-600">{wholeMoney(monthly)} per måned</p></article>; }
function Source({ href, label }: { href: string; label: string }) { return <p className="text-xs leading-5 text-slate-500">Kilde: <a className="font-semibold text-[var(--primary)] hover:underline" href={href}>{label} ↗</a></p>; }

function getFaqItems() {
  const rates = current.rates;
  return [
    { question: "Finnes det lovpålagt minstelønn for butikkmedarbeidere?", answer: "Nei. Varehandel er ikke en allmenngjort bransje. En tariffavtale kan likevel gi bindende minstesatser på arbeidsplassen." },
    { question: "Hva er laveste Virke–HK-sats over 18 år?", answer: `Lønnstrinn 1 er ${money(rates.step1.hourly)} per time eller ${wholeMoney(rates.step1.monthly)} per måned fra 1. april 2026.` },
    { question: "Hvilket lønnstrinn skal jeg ha?", answer: "Det avgjøres blant annet av alder, dokumentert relevant praksis, arbeidstid i praksisperiodene og relevant utdanning. Satsfinneren viser bare den veiledende hovedregelen." },
    { question: "Hva er tariffsatsen for en 16- eller 17-åring?", answer: `Virke–HK-satsen under 18 år er ${money(rates.under18.hourly)} per time. Den er ikke lovpålagt i butikker uten denne avtalen.` },
    { question: "Hvilke tillegg gjelder på kveld og helg?", answer: `Virke–HK gir UB etter klokken 18 på hverdager, fra klokken 13 på lørdager og hele søndagen. Satsene varierer fra ${money(retailUbSupplements.weekdayAfter18)} til ${money(retailUbSupplements.sunday)} per time.` },
  ];
}

function money(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function wholeMoney(value: number) { return `${Math.round(value).toLocaleString("nb-NO")} kr`; }
function percent(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`; }
function growthLabel(key: (typeof retailRateKeys)[number]) { return retailRateLabels[key].replace("Lønnstrinn", "Trinn"); }
function date(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
