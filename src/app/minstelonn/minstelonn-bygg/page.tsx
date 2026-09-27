import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdsenseAd } from "@/components/adsense-ad";
import { ArticleBreadcrumbs } from "@/components/article-breadcrumbs";
import { ConstructionMinimumWageChart } from "@/components/construction-minimum-wage-chart";
import { StickyLeftAdRail } from "@/components/sticky-left-ad-rail";
import {
  constructionAllmenngjoringStatus2026,
  constructionImplementedMinimumWageRates,
  constructionMinimumWageRates,
  constructionMinimumWageRules,
  constructionOccupationSalary2025,
  constructionTariff2026,
  getConstructionMinimumWageForDate,
  validateConstructionMinimumWageRates,
} from "@/lib/construction-minimum-wage";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pagePath = "/minstelonn/minstelonn-bygg";
const currentYear = new Date().getFullYear();
const title = `Minstelønn bygg ${currentYear} – fagarbeider og ufaglært`;
const description = "Se gjeldende minstelønn i byggebransjen for fagarbeidere, ufaglærte og unge. Historiske satser, overtid, arbeidstøy, kost og losji.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pagePath },
  openGraph: { type: "website", locale: "nb_NO", url: pagePath, siteName: siteConfig.name, title: `${title} | ${siteConfig.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
};

const sections = [
  { id: "satser", label: "Satser etter fagbrev og erfaring" },
  { id: "virkeomrade", label: "Hvem omfattes?" },
  { id: "fagarbeider", label: "Fagarbeider og erfaring" },
  { id: "historikk", label: "Historiske satser" },
  { id: "tariff", label: "Lovpålagt sats eller tariff?" },
  { id: "overtid", label: "Overtid og tillegg" },
  { id: "reise", label: "Reise, kost og losji" },
  { id: "arbeidstoy", label: "Arbeidstøy og vernesko" },
  { id: "laerlinger", label: "Lærlinger og elektrikere" },
  { id: "faktisk-lonn", label: "Hva tjener byggarbeidere?" },
  { id: "faq", label: "Ofte stilte spørsmål" },
] as const;

const coveredTrades: readonly { label: string; href?: string }[] = [
  { label: "Anleggsgartner", href: "/yrke/gartnere-lonn" },
  { label: "Betongarbeider", href: "/yrke/betongarbeidere-lonn" },
  { label: "Tømrer", href: "/yrke/tomrere-og-snekkere-lonn" },
  { label: "Murer", href: "/yrke/murere-lonn" },
  { label: "Rørlegger", href: "/yrke/rorleggere-og-vvs-montorer-lonn" },
  { label: "Ventilasjons- og blikkenslager", href: "/yrke/kopper-og-blikkenslagere-lonn" },
  { label: "Maler", href: "/yrke/malere-og-byggtapetserere-lonn" },
  { label: "Isolatør", href: "/yrke/isolatorer-mv-lonn" },
  { label: "Taktekker", href: "/yrke/taktekkere-lonn" },
  { label: "Stillasbygger" },
  { label: "Industrimaler" },
  { label: "Glass- og fasadearbeider", href: "/yrke/glassarbeidere-lonn" },
  { label: "Kulde- og varmepumpetekniker", href: "/yrke/kuldemontorer-mv-lonn" },
  { label: "Ventilasjonstekniker" },
  { label: "Anleggsmaskinfører", href: "/yrke/anleggsmaskinforere-lonn" },
  { label: "Riving og kildesortering" },
];

export default function MinstelonnByggPage() {
  const validationErrors = validateConstructionMinimumWageRates();
  if (validationErrors.length) throw new Error(`Ugyldig minstelønnsdatasett: ${validationErrors.join("; ")}`);
  const today = new Date().toISOString().slice(0, 10);
  const currentRate = getConstructionMinimumWageForDate(today);
  if (!currentRate) throw new Error(`Fant ingen byggsats som gjelder ${today}.`);
  const proposedRate = constructionMinimumWageRates.find((item) => item.status === "proposed");
  if (!proposedRate) throw new Error("Fant ikke foreslåtte byggsatser for 2026.");
  const firstRate = constructionImplementedMinimumWageRates[0];
  const previousRate = constructionImplementedMinimumWageRates.at(-2);
  const fiveYearRate = getConstructionMinimumWageForDate("2020-12-31");
  if (!firstRate || !previousRate || !fiveYearRate) throw new Error("Mangler sammenlignbare historiske byggsatser.");
  const minimumWageGrowth = [
    { label: "Siste satsendring", period: "2024–2025", previous: previousRate },
    { label: "Fem års vekst", period: "2020–2025", previous: fiveYearRate },
    { label: "Siden 2016", period: "2016–2025", previous: firstRate },
  ].map((item) => ({
    ...item,
    categories: [
      { label: "Fagarbeider", current: currentRate.skilledRate, previous: item.previous.skilledRate },
      { label: "Ufaglært, minst 1 år", current: currentRate.unskilledOneYearRate, previous: item.previous.unskilledOneYearRate },
      { label: "Ufaglært, uten erfaring", current: currentRate.unskilledNoExperienceRate, previous: item.previous.unskilledNoExperienceRate },
      { label: "Under 18 år", current: currentRate.under18Rate, previous: item.previous.under18Rate },
    ].map((category) => ({ ...category, amount: category.current - category.previous, percent: ((category.current / category.previous) - 1) * 100 })),
  }));

  const rateCards = [
    { label: "Fagarbeider", rate: currentRate.skilledRate, note: "Med fag- eller svennebrev" },
    { label: "Ufaglært, minst 1 år", rate: currentRate.unskilledOneYearRate, note: "Minst ett års bransjeerfaring" },
    { label: "Ufaglært, uten erfaring", rate: currentRate.unskilledNoExperienceRate, note: "Uten dokumentert bransjeerfaring" },
    { label: "Under 18 år", rate: currentRate.under18Rate, note: "Arbeidstaker under 18 år" },
  ];
  const faqItems = getFaqItems(currentRate.skilledRate, currentRate.unskilledNoExperienceRate, currentRate.unskilledOneYearRate, currentRate.under18Rate, proposedRate.skilledRate);
  const structuredData = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Hjem", item: getAbsoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Minstelønn", item: getAbsoluteUrl("/minstelonn") }, { "@type": "ListItem", position: 3, name: "Minstelønn i bygg", item: getAbsoluteUrl(pagePath) }] },
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: getAbsoluteUrl(pagePath), inLanguage: "nb-NO", dateModified: currentRate.verifiedAt },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      {structuredData.map((data, index) => <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} key={index} type="application/ld+json" />)}
      <div className="relative mx-auto max-w-7xl">
        <StickyLeftAdRail />
        <ArticleBreadcrumbs href="/minstelonn" section="Minstelønn" title="Bygg" />

        <div className="relative mx-auto mt-7 max-w-[1080px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#fbfdfb_48%,#edf5ef_100%)] px-5 py-9 sm:px-10 lg:min-h-[400px] lg:px-[230px] lg:py-11">
          <div aria-hidden="true" className="absolute -left-20 top-10 hidden size-64 rotate-12 rounded-[38px] bg-[#dfeee3] lg:block" />
          <div className="absolute right-8 top-8 hidden h-[330px] w-[220px] overflow-hidden rounded-[46%_46%_18%_46%] lg:block">
            <Image alt="Gul vernehjelm, arbeidshansker, tommestokk, blyant og hammer på en arbeidsbenk i et lyst bygg" className="h-full w-full object-cover object-[58%_70%]" fill priority sizes="220px" src="/images/minimum-wage/bygg-hero.png" />
          </div>
          <header className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full bg-[#e8f4eb] px-5 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#15533d]">Bygg og byggeplass</p>
            <h1 className="mx-auto mt-6 max-w-[700px] text-[clamp(2.55rem,5.2vw,5rem)] font-[760] leading-[1.03] text-[#101820]">Minstelønn<br className="hidden sm:block" /> i byggebransjen</h1>
            <p className="mx-auto mt-5 max-w-[650px] text-base leading-[1.65] text-[#3f4a45] sm:text-[1.12rem]">Den gjeldende lovpålagte satsen for fagarbeidere er <strong>{formatRate(currentRate.skilledRate)} per time</strong>. Her finner du også satsene for ufaglærte og unge, hvem reglene gjelder for og forskjellen mellom minstelønn og tariff.</p>
          </header>
          <div className="relative z-10 mx-auto mt-6 h-44 w-full max-w-sm overflow-hidden rounded-[28px] sm:h-52 lg:hidden"><Image alt="Gul vernehjelm, arbeidshansker, tommestokk, blyant og hammer på en arbeidsbenk i et lyst bygg" className="h-full w-full object-cover object-[52%_68%]" fill priority sizes="(max-width: 1024px) 384px, 0px" src="/images/minimum-wage/bygg-hero.png" /></div>
          <div className="relative z-10 mx-auto mt-7 grid max-w-[650px] gap-3 text-sm text-[#52627d] sm:grid-cols-3">
            <p><strong className="block text-[#15533d]">Gjeldende fra</strong>{formatDate(currentRate.effectiveFrom)}</p>
            <p><strong className="block text-[#15533d]">Fagarbeidersats</strong>{formatRate(currentRate.skilledRate)}/time</p>
            <p><strong className="block text-[#15533d]">Sist kontrollert</strong>{formatDate(currentRate.verifiedAt)}</p>
          </div>
        </div>

        <div className="mx-auto mt-9 grid max-w-[1000px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rateCards.map((item, index) => <RateCard emphasized={index === 0} key={item.label} {...item} />)}
        </div>

        <div className="mx-auto mt-7 max-w-[900px] rounded-[11px] border border-amber-700/25 bg-amber-50 px-5 py-5 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Viktig status i 2026</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">{formatRate(proposedRate.skilledRate)} er foreslått – ikke vedtatt som lovpålagt sats</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Tariffnemndas sak står fortsatt som <strong>{constructionAllmenngjoringStatus2026.status}</strong>. Tariffsatsen gjelder fra 1. april 2026 i tariffbundne arbeidsforhold, men dagens allmenngjorte fagarbeidersats er fortsatt {formatRate(currentRate.skilledRate)}.</p>
          <SourceLine href={constructionAllmenngjoringStatus2026.sourceUrl} label="Tariffnemnda – byggfag" />
        </div>

        <div className="mx-auto mt-8 max-w-[900px] scroll-mt-24" id="utvikling">
          <ConstructionMinimumWageChart points={constructionImplementedMinimumWageRates.map(({ effectiveFrom, skilledRate, unskilledNoExperienceRate, unskilledOneYearRate, under18Rate }) => ({ effectiveFrom, skilledRate, unskilledNoExperienceRate, unskilledOneYearRate, under18Rate }))} today={today} />
        </div>

        <div aria-label="Vekst i de fire lovpålagte minstelønnssatsene i bygg" className="mx-auto mt-5 grid max-w-[900px] gap-3 lg:grid-cols-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-slate-500 lg:col-span-3">Vekst i alle fire satsene</p>
          {minimumWageGrowth.map((growth) => <article className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:px-5" key={growth.label}>
            <div className="flex items-baseline justify-between gap-3"><h2 className="font-bold text-slate-950">{growth.label}</h2><span className="text-xs tabular-nums text-slate-500">{growth.period}</span></div>
            <div className="mt-4 divide-y divide-slate-100">
              {growth.categories.map((category) => <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-3 first:pt-0 last:pb-0" key={category.label}><p className="truncate text-xs font-medium text-slate-600" title={category.label}>{category.label}</p><p className="row-span-2 text-xl font-bold tabular-nums text-[#15533d]">+{formatPercent(category.percent)}</p><p className="text-xs tabular-nums text-slate-500">+{formatRate(category.amount)} per time</p></div>)}
            </div>
          </article>)}
        </div>

        <AdsenseAd className="mx-auto mt-8 max-w-[900px]" placement="overview-between-sections" />

        <nav aria-labelledby="innholdsfortegnelse" className="mx-auto mt-7 max-w-[900px] rounded-[11px] border border-slate-200 bg-slate-50 px-5 py-4 sm:px-7 sm:py-5">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-950" id="innholdsfortegnelse">Innhold på siden</h2>
          <ol className="mt-3 grid grid-cols-1 text-base sm:grid-cols-2">{sections.map((section, index) => <li key={section.id}><a className="group grid grid-cols-[2rem_minmax(0,1fr)] items-baseline rounded-[7px] px-2 py-1.5 text-slate-800 hover:bg-white hover:text-[var(--primary)]" href={`#${section.id}`}><span className="text-xs tabular-nums text-slate-400">{String(index + 1).padStart(2, "0")}</span><span className="font-medium group-hover:underline">{section.label}</span></a></li>)}</ol>
        </nav>

        <div className="mx-auto mt-8 max-w-[900px] min-w-0 divide-y divide-slate-200">
          <Section id="satser" title="Minstelønn etter fagbrev og erfaring">
            <p>Satsen bestemmes av fagbrev, relevant bransjeerfaring og alder. Den er et lovpålagt gulv for arbeid som omfattes av forskriften, ikke et uttrykk for vanlig lønn i yrket.</p>
            <DataTable headers={["Kategori", "Minstelønn per time", "Gjelder fra"]} rows={rateCards.map((item) => [<span key="category"><strong className="block text-slate-950">{item.label}</strong><span className="text-xs text-slate-500">{item.note}</span></span>, <strong className="text-lg tabular-nums text-[#15533d]" key="rate">{formatRate(item.rate)}</strong>, formatDate(currentRate.effectiveFrom)])} />
            <SourceLine href={`${constructionMinimumWageRules.regulationUrl}#§4`} label="Lovdata, § 4" />
          </Section>

          <Section id="virkeomrade" title="Hvem gjelder minstelønnen for?">
            <p>Forskriften gjelder faglærte og ufaglærte arbeidstakere som utfører bygningsarbeid på byggeplasser. Arbeidet som faktisk utføres og tilknytningen til byggearbeidet er avgjørende – ikke yrkestittelen alene.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{coveredTrades.map((trade) => trade.href ? <Link className="group flex items-center gap-3 rounded-[9px] border border-[#dce9e1] bg-[#f5faf7] px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-[#93b4a5] hover:bg-[#edf7f1] hover:text-[#15533d]" href={trade.href} key={trade.label}><span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#15533d]" /><span className="group-hover:underline">{trade.label}</span><span aria-hidden="true" className="ml-auto text-[#15533d]">→</span></Link> : <div className="flex items-center gap-3 rounded-[9px] border border-[#dce9e1] bg-[#f5faf7] px-4 py-3 text-sm font-medium text-slate-800" key={trade.label}><span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#15533d]" />{trade.label}</div>)}</div>
            <p>Verkstedarbeidere, reparatører, sjåfører og lagerarbeidere kan også omfattes når arbeidet faller innenfor virkeområdet. «Bygg og anlegg» som bred næringskategori betyr derfor ikke automatisk at alle arbeidstakere omfattes.</p>
            <SourceLine href={`${constructionMinimumWageRules.regulationUrl}#§2`} label="Lovdata, virkeområde" />
          </Section>

          <Section id="fagarbeider" title="Hva er en fagarbeider – og hva betyr ett års erfaring?">
            <div className="grid gap-4 md:grid-cols-2"><InfoCard title="Fagarbeider">Du må ha fag- eller svennebrev i det aktuelle faget. Utenlandske fagbrev som er godkjent av NOKUT, likestilles med norske fagbrev.</InfoCard><InfoCard title="Ufaglært med erfaring">Har du minst ett års relevant bransjeerfaring, gjelder den høyere ufaglærtsatsen. Mange års erfaring gjør deg ikke automatisk til fagarbeider uten fag- eller svennebrev.</InfoCard></div>
            <p>Forskriften gir ikke en detaljert omregningsmodell for deltidsarbeid. Er det tvil om tidligere arbeid teller som bransjeerfaring, bør du avklare dette med arbeidsgiver, Arbeidstilsynet eller tariffpartene.</p>
          </Section>

          <Section id="historikk" title="Historiske minstelønnssatser i bygg">
            <p>Historikken følger de faktiske ikrafttredelsesdatoene. Den korte perioden fra 1. til 8. juni 2017 er med fordi ettårssatsen ble korrigert fra 185,80 til 185,50 kroner 9. juni.</p>
            <DataTable headers={["Periode", "Fagarbeider", "Ufaglært uten erfaring", "Ufaglært ≥1 år", "Under 18"]} minWidth="820px" rows={constructionImplementedMinimumWageRates.map((item) => [formatPeriod(item.effectiveFrom, item.effectiveTo), formatRate(item.skilledRate), formatRate(item.unskilledNoExperienceRate), formatRate(item.unskilledOneYearRate), formatRate(item.under18Rate)])} />
            <p className="text-sm text-slate-600">Forslaget for 2026 er utelatt fra historikken fordi det ikke har en vedtatt ikrafttredelsesdato.</p>
          </Section>

          <Section id="tariff" title="Lovpålagt minstelønn eller tariff i 2026?">
            <p>Begge satssettene nedenfor er reelle, men de betyr forskjellige ting. Den allmenngjorte satsen gjelder som lovpålagt gulv for alle som omfattes av forskriften. FOB-satsene gjelder i arbeidsforhold bundet av Fellesoverenskomsten for byggfag.</p>
            <DataTable headers={["Kategori", "Lovpålagt allmenngjort", "FOB-tariff fra 1. april 2026"]} rows={[
              ["Fagarbeider", formatRate(currentRate.skilledRate), formatRate(constructionTariff2026.skilledRate)],
              ["Ufaglært uten erfaring", formatRate(currentRate.unskilledNoExperienceRate), formatRate(constructionTariff2026.unskilledNoExperienceRate)],
              ["Ufaglært med minst ett år", formatRate(currentRate.unskilledOneYearRate), formatRate(constructionTariff2026.unskilledOneYearRate)],
              ["Under 18 år", formatRate(currentRate.under18Rate), formatRate(constructionTariff2026.under18Rate)],
            ]} />
            <div className="rounded-[9px] border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-sm leading-6 text-slate-800"><strong>Ikke bruk 276,48 kroner som dagens lovpålagte sats.</strong> Tariffnemndas utkast mangler fortsatt ikrafttredelsesdato. Målet om ikrafttredelse innen utgangen av oktober 2026 er ikke et vedtak.</div>
            <SourceLine href={constructionTariff2026.sourceUrl} label="NHO Byggenæringen – lønns- og satstabeller" />
          </Section>

          <AdsenseAd className="my-8 sm:my-10" placement="minimum-wage-mid-content" />

          <Section id="overtid" title="Overtid, kveld, natt og helg">
            <p>Byggeforskriften fastsetter ikke en egen overtidsprosent. Etter arbeidsmiljøloven skal overtid minst gi <strong>40 prosent tillegg av den avtalte ordinære lønnen</strong>. Tariffavtale eller arbeidsavtale kan gi bedre vilkår.</p>
            <div className="rounded-[11px] bg-[#f1f7f2] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#15533d]">Regneeksempel for fagarbeider på minstelønn</p><div className="mt-4 grid gap-3 sm:grid-cols-3"><Metric label="Ordinær lønn" value={formatRate(currentRate.skilledRate)} /><Metric label="40 % tillegg" value={formatRate(currentRate.skilledRate * 0.4)} /><Metric label="Sum per overtidstime" value={formatRate(currentRate.skilledRate * 1.4)} /></div><p className="mt-4 text-xs leading-5 text-slate-600">Tillegget beregnes av din avtalte ordinære lønn. Er den høyere enn minstelønnen, blir overtidsbetalingen også høyere.</p></div>
            <p>Det finnes ikke egne allmenngjorte kveld-, natt- eller helgetillegg i byggeforskriften. Slike tillegg kan følge av tariffavtale, arbeidsavtale eller lokal avtale.</p>
            <SourceLine href={constructionMinimumWageRules.workingEnvironmentActUrl} label="Arbeidsmiljøloven § 10-6" />
          </Section>

          <Section id="reise" title="Reise, kost og losji ved arbeid borte">
            <p>Når et oppdrag krever overnatting utenfor hjemmet, skal arbeidsgiver dekke nødvendige reiseutgifter ved begynnelsen og slutten av oppdraget. Før avreise skal det også være avtalt hvordan kost og losji ordnes.</p>
            <div className="grid gap-4 md:grid-cols-3"><InfoCard title="Reise">Nødvendig reise ved oppdragets start og slutt skal dekkes.</InfoCard><InfoCard title="Kost">Arbeidsgiver kan sørge for mat, bruke fast diettsats eller refundere dokumenterte utgifter.</InfoCard><InfoCard title="Losji">Arbeidsgiver skal som hovedregel sørge for losji, eller avtale en annen dekkende ordning.</InfoCard></div>
            <SourceLine href={`${constructionMinimumWageRules.regulationUrl}#§5`} label="Lovdata, reise, kost og losji" />
          </Section>

          <Section id="arbeidstoy" title="Arbeidstøy og vernesko skal holdes av arbeidsgiver">
            <p>Arbeidsgiver skal stille nødvendig arbeidstøy og vernefottøy til rådighet, tilpasset årstid og arbeidsplass. Det omfatter blant annet ordinært arbeidstøy, varmetøy, regntøy og hansker når dette er nødvendig.</p>
            <div className="rounded-[11px] border border-[#cfe3d7] bg-[#f5faf7] px-5 py-5 sm:px-6"><strong className="text-slate-950">Du skal ikke kjøpe nødvendig arbeidstøy selv.</strong><p className="mt-2 text-sm leading-6 text-slate-700">Utstyret er arbeidsgivers eiendom, skal leveres ut ved ansettelse og erstattes ved innbytte når det er utslitt.</p></div>
            <SourceLine href={constructionMinimumWageRules.labourInspectionUrl} label="Arbeidstilsynet – byggebransjen" />
          </Section>

          <Section id="laerlinger" title="Lærlinger og elektrikere følger andre regler">
            <div className="grid gap-4 md:grid-cols-2"><InfoCard title="Lærlinger">Lærlinger og personer på arbeidsmarkedstiltak omfattes ikke av den allmenngjorte minstelønnsforskriften. Lærlinglønn kan følge tariffavtale og lærekontrakt.</InfoCard><InfoCard title="Elektrikere">Elektrikere på byggeplass har en egen allmenngjøringsforskrift og egne satser. De skal ikke plasseres i kategoriene på denne siden.</InfoCard></div>
            <div className="flex flex-wrap gap-3"><Link className="rounded-[8px] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-strong)]" href="/laerling">Se lærlinglønn</Link><Link className="rounded-[8px] border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-[#15533d]" href="/minstelonn/minstelonn-elektriker">Se minstelønn for elektrikere</Link></div>
          </Section>

          <Section id="faktisk-lonn" title="Hva tjener byggarbeidere faktisk?">
            <p>Minstelønn er det lovpålagte gulvet. SSBs medianlønn beskriver hva arbeidstakere faktisk tjente i 2025, og er derfor et annet mål. Medianen betyr at halvparten tjente mer og halvparten mindre.</p>
            <div className="overflow-hidden rounded-[11px] border border-slate-200 bg-white"><div className="grid grid-cols-[1fr_auto] bg-[#f1f7f2] px-5 py-3 text-sm font-semibold text-slate-700"><span>Yrke</span><span>Median månedslønn 2025</span></div><div className="divide-y divide-slate-200">{constructionOccupationSalary2025.map((item) => <Link className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 text-sm hover:bg-slate-50" href={item.href} key={item.occupation}><span className="font-medium text-slate-900 hover:text-[var(--primary)]">{item.occupation}</span><strong className="tabular-nums text-slate-950">{formatMonthly(item.median)}</strong></Link>)}</div></div>
            <p className="text-sm text-slate-600">Kilde: SSB tabell 11418, sist oppdatert 28. august 2026. Tallene skal ikke leses som lovpålagte satser.</p>
            <Link className="inline-flex items-center gap-2 font-semibold text-[var(--primary)] hover:underline" href="/blogg/dette-er-arslonnen-til-bygningsarbeidere">Les mer om lønn i byggyrkene <span aria-hidden="true">→</span></Link>
          </Section>

          <AdsenseAd className="my-8 sm:my-10" placement="minimum-wage-before-faq" />

          <Section id="faq" title="Ofte stilte spørsmål om minstelønn i bygg">
            <div className="divide-y divide-slate-200 border-y border-slate-200">{faqItems.map((item) => <details className="group py-5" key={item.question}><summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-lg font-semibold leading-7 text-slate-950 marker:hidden"><span>{item.question}</span><span aria-hidden="true" className="text-2xl font-normal text-[var(--primary)] transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{item.answer}</p></details>)}</div>
          </Section>

          <section className="py-10" aria-labelledby="kilder-title"><h2 className="text-2xl font-bold text-slate-950" id="kilder-title">Kilder og metode</h2><p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">Satsene er kontrollert mot gjeldende og historiske forskrifter hos Lovdata, Arbeidstilsynet og Tariffnemnda. Tariffopplysningene er holdt separat fra allmenngjort minstelønn. SSB-tallene er statistiske medianer for 2025.</p><ul className="mt-5 grid gap-2 text-sm font-medium text-[var(--primary)]"><li><a className="hover:underline" href={constructionMinimumWageRules.labourInspectionUrl}>Arbeidstilsynet – gjeldende minstelønn ↗</a></li><li><a className="hover:underline" href={constructionMinimumWageRules.regulationUrl}>Lovdata – gjeldende byggeforskrift ↗</a></li><li><a className="hover:underline" href={constructionAllmenngjoringStatus2026.sourceUrl}>Tariffnemnda – byggfag 2026 ↗</a></li></ul></section>
        </div>
      </div>
    </main>
  );
}

function RateCard({ emphasized, label, note, rate }: { emphasized?: boolean; label: string; note: string; rate: number }) { return <article className={`rounded-[11px] border px-5 py-5 shadow-[0_10px_30px_rgba(19,37,64,0.05)] ${emphasized ? "border-[#15533d] bg-[linear-gradient(135deg,#1d634c,#104733)] text-white" : "border-[#d8eadf] bg-[#f3faf5] text-[#19243b]"}`}><p className={`text-xs font-bold uppercase tracking-[0.1em] ${emphasized ? "text-white/75" : "text-[#15533d]"}`}>{label}</p><p className="mt-3 whitespace-nowrap text-[clamp(2rem,4vw,2.8rem)] font-bold leading-none tabular-nums tracking-[-0.05em]">{formatRate(rate)}</p><p className={`mt-3 text-sm ${emphasized ? "text-white/80" : "text-[#52627d]"}`}>{note}</p></article>; }
function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) { return <section className="scroll-mt-6 space-y-6 py-10 [&>p]:max-w-3xl [&>p]:text-[1.03rem] [&>p]:leading-[1.8] [&>p]:text-slate-800 sm:[&>p]:text-lg" id={id}><h2 className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem]">{title}</h2>{children}</section>; }
function InfoCard({ children, title }: { children: ReactNode; title: string }) { return <article className="rounded-[9px] border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{children}</p></article>; }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums text-slate-950">{value}</p></div>; }
function SourceLine({ href, label }: { href: string; label: string }) { return <p className="text-xs leading-5 text-slate-500">Kilde: <a className="font-semibold text-[var(--primary)] hover:underline" href={href}>{label} ↗</a></p>; }
function DataTable({ headers, minWidth = "650px", rows }: { headers: string[]; minWidth?: string; rows: ReactNode[][] }) { return <div className="overflow-x-auto rounded-[5px] border border-black/10 bg-white"><table className="w-full border-collapse text-left" style={{ minWidth }}><thead className="bg-[#f1f7f2] text-sm text-slate-700"><tr>{headers.map((header) => <th className="px-4 py-3 font-semibold" key={header}>{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 text-sm text-slate-800">{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td className="px-4 py-3.5" key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }

function getFaqItems(skilled: number, noExperience: number, oneYear: number, under18: number, proposed: number) {
  return [
    { question: `Hva er minstelønnen i byggebransjen i ${currentYear}?`, answer: `Gjeldende lovpålagt minstelønn er ${formatRate(skilled)} per time for fagarbeidere, ${formatRate(noExperience)} for ufaglærte uten bransjeerfaring, ${formatRate(oneYear)} for ufaglærte med minst ett års erfaring og ${formatRate(under18)} for arbeidstakere under 18 år.` },
    { question: "Hva er minstelønnen for en tømrer, murer eller rørlegger?", answer: `Har du fag- eller svennebrev i det aktuelle faget og arbeidet omfattes av forskriften, er minstesatsen ${formatRate(skilled)} per time. Uten fagbrev gjelder en av ufaglærtsatsene.` },
    { question: "Hva regnes som en fagarbeider?", answer: "En fagarbeider har fag- eller svennebrev i det aktuelle faget. Et utenlandsk fagbrev som er godkjent av NOKUT, likestilles med norsk fagbrev. Erfaring alene gjør deg ikke automatisk til fagarbeider." },
    { question: "Har lærlinger samme minstelønn?", answer: "Nei. Lærlinger omfattes ikke av den allmenngjorte minstelønnsforskriften for bygg. Lærlinglønn kan følge tariffavtale og lærekontrakt." },
    { question: "Hva får man i overtid i byggebransjen?", answer: "Arbeidsmiljøloven krever minst 40 prosent tillegg av den avtalte ordinære lønnen. Tariffavtale eller arbeidsavtale kan gi bedre vilkår." },
    { question: "Har byggarbeidere krav på kveld- eller helgetillegg?", answer: "Det finnes ikke egne allmenngjorte kveld-, natt- eller helgetillegg i byggeforskriften. Slike tillegg kan følge av tariffavtale, arbeidsavtale eller lokale avtaler." },
    { question: "Må arbeidsgiver betale arbeidstøy og vernesko?", answer: "Ja. For arbeid som omfattes av forskriften, skal arbeidsgiver holde nødvendig arbeidstøy og vernefottøy tilpasset årstid og arbeidsplass." },
    { question: "Er 276,48 kroner den nye lovpålagte minstelønnen?", answer: `Nei. ${formatRate(proposed)} er tariffsatsen fra 1. april 2026 og satsen Tariffnemnda har foreslått allmenngjort. Forslaget er fortsatt under behandling. Gjeldende lovpålagt fagarbeidersats er ${formatRate(skilled)}.` },
  ];
}

function formatRate(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function formatPercent(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`; }
function formatMonthly(value: number) { return `${value.toLocaleString("nb-NO")} kr`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
function formatPeriod(from: string, to: string | null) { return `${new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${from}T00:00:00Z`))}–${to ? new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${to}T00:00:00Z`)) : "nå"}`; }
