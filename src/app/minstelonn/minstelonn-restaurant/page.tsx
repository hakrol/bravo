import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdsenseAd } from "@/components/adsense-ad";
import { ArticleBreadcrumbs } from "@/components/article-breadcrumbs";
import { RestaurantMinimumWageChart } from "@/components/restaurant-minimum-wage-chart";
import { RestaurantMinimumWageFinder } from "@/components/restaurant-minimum-wage-finder";
import {
  getRestaurantMinimumWageForDate,
  restaurantAllmenngjoringStatus2026,
  restaurantImplementedMinimumWageRates,
  restaurantMinimumWageRates,
  restaurantMinimumWageRules,
  restaurantOccupationSalary2025,
  restaurantTariff2026,
  validateRestaurantMinimumWageRates,
} from "@/lib/restaurant-minimum-wage";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pagePath = "/minstelonn/minstelonn-restaurant";
const currentYear = new Date().getFullYear();
const title = `Minstelønn restaurant ${currentYear} – servitør, kokk og bartender`;
const description = `Se gjeldende minstelønn i restaurant i ${currentYear} for servitør, kokk, bartender og unge. Satser, fire måneders praksis, tillegg, tips og tariff.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pagePath },
  openGraph: { type: "website", locale: "nb_NO", url: pagePath, siteName: siteConfig.name, title: `${title} | ${siteConfig.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
};

const sections = [
  { id: "satser", label: "Minstelønn etter alder" },
  { id: "praksis", label: "Fire måneders praksis" },
  { id: "hvem-gjelder-det-for", label: "Hvilke jobber omfattes?" },
  { id: "tariff", label: "Minstelønn eller tariff?" },
  { id: "tillegg", label: "Kveld, natt og helg" },
  { id: "overtid", label: "Overtid" },
  { id: "tips", label: "Tips som lønn" },
  { id: "innkvartering", label: "Trekk for innkvartering" },
  { id: "laerlinger", label: "Lærlinger" },
  { id: "faktisk-lonn", label: "Hva tjener ansatte faktisk?" },
  { id: "faq", label: "Ofte stilte spørsmål" },
] as const;

const salaryTools = [
  { href: "/yrker", label: "Alle yrker", description: "Utforsk lønnstall for hundrevis av yrker" },
  { href: "/lonnsjekk", label: "Lønnsjekk", description: "Sammenlign lønnen din med relevant statistikk" },
  { href: "/jobbtilbud", label: "Lønnstilbud", description: "Vurder lønnen i et nytt jobbtilbud" },
  { href: "/lonnskalkulator", label: "Lønnskalkulator", description: "Regn om mellom års-, måneds- og timelønn" },
] as const;

const recommendedArticles = [
  { href: "/blogg/hva-er-lonnen-til-en-servitor", label: "Hva er lønnen til en servitør?", category: "Restaurantlønn" },
  { href: "/blogg/hva-tjener-en-bartender-i-maneden-og-aret", label: "Hva tjener en bartender?", category: "Restaurantlønn" },
  { href: "/nyheter/nye-lonnssatser-hotell-restaurant-riksavtalen-2026", label: "Nye satser i Riksavtalen i 2026", category: "Tariff" },
  { href: "/nyheter/ny-minstelonn-serveringsbransjen-2026-foreslatt", label: "Ny minstelønn i serveringsbransjen foreslått", category: "Minstelønn" },
] as const;

export default function MinstelonnRestaurantPage() {
  const validationErrors = validateRestaurantMinimumWageRates();
  if (validationErrors.length) throw new Error(`Ugyldig minstelønnsdatasett: ${validationErrors.join("; ")}`);

  const today = new Date().toISOString().slice(0, 10);
  const currentRate = getRestaurantMinimumWageForDate(today);
  if (!currentRate) throw new Error(`Fant ingen minstelønnssats som gjelder ${today}.`);
  if (currentRate.singleRoomDeduction === null || currentRate.doubleRoomDeduction === null) throw new Error("Gjeldende trekk for innkvartering mangler.");
  const proposedRate = restaurantMinimumWageRates.find((rate) => rate.status === "proposed");
  if (!proposedRate) throw new Error("Fant ikke foreslåtte 2026-satser.");

  const firstRate = restaurantImplementedMinimumWageRates[0];
  const previousRate = restaurantImplementedMinimumWageRates.at(-2);
  const latestRateYear = Number(currentRate.effectiveFrom.slice(0, 4));
  const fiveYearComparison = getRestaurantMinimumWageForDate(`${latestRateYear - 5}-12-31`);
  if (!firstRate || !previousRate || !fiveYearComparison) throw new Error("Mangler sammenlignbare historiske satser.");
  const minimumWageGrowth = [
    { label: "Siste satsendring", period: `${previousRate.effectiveFrom.slice(0, 4)}–${latestRateYear}`, previous: previousRate.adultRate },
    { label: "Fem års vekst", period: `${latestRateYear - 5}–${latestRateYear}`, previous: fiveYearComparison.adultRate },
    { label: "Siden starten", period: `2018–${latestRateYear}`, previous: firstRate.adultRate },
  ].map((item) => ({ ...item, amount: currentRate.adultRate - item.previous, percent: ((currentRate.adultRate / item.previous) - 1) * 100 }));

  const faqItems = getFaqItems(currentRate.adultRate, currentRate.under17Rate, currentRate.age17Rate, currentRate.age18Rate, proposedRate.adultRate);
  const structuredData = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Hjem", item: getAbsoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Minstelønn", item: getAbsoluteUrl("/minstelonn") }, { "@type": "ListItem", position: 3, name: "Minstelønn i restaurant", item: getAbsoluteUrl(pagePath) }] },
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: getAbsoluteUrl(pagePath), inLanguage: "nb-NO", dateModified: currentRate.verifiedAt },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ];

  const ageRates = [
    { label: "Inntil 17 år", rate: currentRate.under17Rate, note: "Fram til 17-årsdagen" },
    { label: "17 år", rate: currentRate.age17Rate, note: "Fra fylte 17 år" },
    { label: "18 år", rate: currentRate.age18Rate, note: "Før fire måneders praksis" },
    { label: "Voksensats", rate: currentRate.adultRate, note: "Over 20 år / etter fire måneders praksis over 18 år" },
  ];

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      {structuredData.map((data, index) => <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} key={index} type="application/ld+json" />)}
      <div className="mx-auto max-w-7xl">
        <ArticleBreadcrumbs href="/minstelonn" section="Minstelønn" title="Restaurant" />

        <div className="relative mx-auto mt-7 max-w-[1080px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#fbfdfb_50%,#f1f7f2_100%)] px-5 pb-8 pt-8 sm:px-10 lg:min-h-[410px] lg:px-[250px] lg:pb-10">
          <div aria-hidden="true" className="absolute -left-24 top-8 hidden size-72 rotate-[28deg] rounded-[44%] bg-[#dfeee3]/75 lg:block" />
          <div className="absolute right-8 top-8 hidden h-[330px] w-[220px] overflow-hidden rounded-[46%_46%_18%_46%] lg:block">
            <Image alt="Serveringsbrett, mørkegrønt forkle, kjøkkenvisp og notatblokk i en lys restaurant" className="h-full w-full object-cover object-[61%_70%]" fill priority sizes="220px" src="/images/minimum-wage/restaurant-hero.png" />
          </div>
          <header className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full bg-[#e8f4eb] px-5 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#15533d]">Restaurant og servering</p>
            <h1 className="mx-auto mt-6 max-w-[680px] text-[clamp(2.55rem,5.2vw,5.1rem)] font-[760] leading-[1.03] tracking-normal text-[#101820]">Minstelønn<br className="hidden sm:block" /> i restaurant</h1>
            <p className="mx-auto mt-5 max-w-[620px] text-base leading-[1.6] text-[#3f4a45] sm:text-[1.12rem] sm:leading-[1.62]">Den gjeldende lovpålagte voksensatsen er <strong>{formatRate(currentRate.adultRate)} per time</strong>. Den gjelder for ansatte over 20 år eller etter fire måneders praksis etter fylte 18 år. Her finner du satsene for servitører, kokker, bartendere, kaféansatte og unge arbeidstakere.</p>
          </header>
          <div className="relative z-10 mx-auto mt-6 h-44 w-full max-w-sm overflow-hidden rounded-[28px] sm:h-52 lg:hidden"><Image alt="Serveringsbrett, mørkegrønt forkle, kjøkkenvisp og notatblokk i en lys restaurant" className="h-full w-full object-cover object-[55%_70%]" fill priority sizes="(max-width: 1024px) 384px, 0px" src="/images/minimum-wage/restaurant-hero.png" /></div>
          <div className="relative z-10 mx-auto mt-6 grid max-w-[650px] gap-3 text-sm text-[#52627d] sm:grid-cols-3">
            <p><strong className="block text-[#15533d]">Gjeldende fra</strong>{formatDate(currentRate.effectiveFrom)}</p>
            <p><strong className="block text-[#15533d]">Lovpålagt voksensats</strong>{formatRate(currentRate.adultRate)}/time</p>
            <p><strong className="block text-[#15533d]">Sist kontrollert</strong>{formatDate(currentRate.verifiedAt)}</p>
          </div>
        </div>

        <div className="mx-auto mt-9 grid max-w-[960px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ageRates.map((item, index) => <RateCard emphasized={index === ageRates.length - 1} key={item.label} {...item} />)}
        </div>

        <div className="mx-auto mt-7 max-w-[900px] scroll-mt-24" id="utvikling">
          <RestaurantMinimumWageChart points={restaurantImplementedMinimumWageRates.map(({ effectiveFrom, adultRate }) => ({ effectiveFrom, adultRate }))} today={today} />
        </div>

        <div aria-label="Vekst i lovpålagt minstelønn i restaurant" className="mx-auto mt-5 grid max-w-[900px] gap-3 sm:grid-cols-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-slate-500 sm:col-span-3">Vekst i voksensatsen</p>
          {minimumWageGrowth.map((growth) => <article className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:px-5" key={growth.label}><div className="flex items-baseline justify-between gap-3"><h2 className="font-bold text-slate-950">{growth.label}</h2><span className="text-xs tabular-nums text-slate-500">{growth.period}</span></div><p className="mt-4 text-3xl font-bold tabular-nums text-[#15533d]">+{formatPercent(growth.percent)}</p><p className="mt-1 text-sm tabular-nums text-slate-600">+{formatRate(growth.amount)} per time</p></article>)}
        </div>

        <div className="mx-auto mt-6 max-w-[900px] rounded-[11px] border border-amber-700/25 bg-amber-50 px-5 py-5 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Viktig status i 2026</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">{formatRate(proposedRate.adultRate)} er foreslått – ikke gjeldende lovpålagt sats</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Tariffnemnda vurderer en ny allmenngjøringsforskrift, men saken står fortsatt som <strong>{restaurantAllmenngjoringStatus2026.status}</strong>. Inntil et nytt vedtak trer i kraft, er voksensatsen {formatRate(currentRate.adultRate)}.</p>
          <SourceLine href={restaurantAllmenngjoringStatus2026.sourceUrl} label="Tariffnemnda – overnatting, servering og catering" />
        </div>

        <AdsenseAd className="mx-auto mt-8 max-w-[900px]" placement="overview-between-sections" />

        <nav aria-labelledby="innholdsfortegnelse" className="mx-auto mt-7 max-w-[900px] rounded-[11px] border border-slate-200 bg-slate-50 px-5 py-4 sm:px-7 sm:py-5">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-950" id="innholdsfortegnelse">Innhold på siden</h2>
          <ol className="mt-3 grid grid-cols-1 text-base sm:grid-cols-2">
            {sections.map((section, index) => <li key={section.id}><a className="group grid grid-cols-[2rem_minmax(0,1fr)] items-baseline rounded-[7px] px-2 py-1.5 text-slate-800 transition-colors hover:bg-white hover:text-[var(--primary)]" href={`#${section.id}`}><span className="text-xs tabular-nums text-slate-400">{String(index + 1).padStart(2, "0")}</span><span className="font-medium group-hover:underline">{section.label}</span></a></li>)}
          </ol>
        </nav>

        <div className="mx-auto mt-8 max-w-[900px] min-w-0">
          <Section id="satser" title="Minstelønn i restaurant etter alder">
            <p>Den lovpålagte satsen bestemmes av alder og praksis – ikke av om du er servitør, kokk eller bartender. Satsene gjelder arbeid som omfattes av forskriften for overnatting, servering og catering.</p>
            <div className="overflow-x-auto rounded-[5px] border border-black/10 bg-white"><table className="w-full min-w-[620px] border-collapse text-left"><thead className="bg-[#f1f7f2] text-sm text-slate-700"><tr><th className="px-5 py-3 font-semibold">Alder og praksis</th><th className="px-5 py-3 font-semibold">Minstelønn per time</th><th className="px-5 py-3 font-semibold">Gjelder fra</th></tr></thead><tbody className="divide-y divide-slate-200 text-sm text-slate-800">{ageRates.map((item) => <tr key={item.label}><td className="px-5 py-4"><strong className="block text-slate-950">{item.label}</strong><span className="mt-1 block text-xs text-slate-500">{item.note}</span></td><td className="px-5 py-4 text-lg font-bold tabular-nums text-[#15533d]">{formatRate(item.rate)}</td><td className="px-5 py-4">{formatDate(currentRate.effectiveFrom)}</td></tr>)}</tbody></table></div>
            <SourceLine href={`${restaurantMinimumWageRules.regulationUrl}#§3`} label="Lovdata, § 3" />
          </Section>

          <Section id="praksis" title="Hvordan fungerer fire måneders praksis?">
            <p>Er du 18 eller 19 år, går du over til voksensatsen når du har minst fire måneders relevant praksis opptjent etter at du fylte 18 år. Arbeid før 18-årsdagen teller ikke med.</p>
            <div className="grid gap-4 md:grid-cols-3"><InfoCard title="Heltid og deltid">Begge opptjener praksis på lik linje. Det avgjørende er at praksisen er reell og opptjent etter fylte 18 år.</InfoCard><InfoCard title="Tilkallingsvakter">Noen enkeltstående vakter spredt over fire kalendermåneder er ikke automatisk nok. Arbeidsmengden må tilsvare fire måneder.</InfoCard><InfoCard title="Fra måned fem">Når praksisvilkåret er oppfylt, gjelder dagens voksensats på {formatRate(currentRate.adultRate)} per time.</InfoCard></div>
            <RestaurantMinimumWageFinder rates={{ under17: currentRate.under17Rate, age17: currentRate.age17Rate, age18: currentRate.age18Rate, adult: currentRate.adultRate }} />
            <SourceLine href={restaurantMinimumWageRules.labourInspectionUrl} label="Arbeidstilsynet – praksis og minstelønn" />
          </Section>

          <Section id="hvem-gjelder-det-for" title="Hvilke jobber omfattes?">
            <p>Forskriften gjelder ansatte i overnattings-, serverings- og cateringvirksomheter og lignende virksomheter på land. Det er virksomheten og arbeidet som avgjør – ikke stillingstittelen alene.</p>
            <div className="grid gap-4 md:grid-cols-2"><InfoCard title="Normalt omfattet">Servitører, restaurantmedarbeidere, bartendere, kokker og andre ansatte i restauranter, hoteller og cateringvirksomheter omfattes normalt når arbeidet faller innenfor virkeområdet.</InfoCard><InfoCard title="Kafé og grensetilfeller">En kafé som driver serveringsvirksomhet omfattes normalt. Rene bakeriutsalg, kiosker, bensinstasjoner og kantiner i andre virksomheter kan kreve en konkret vurdering.</InfoCard><InfoCard title="Kokk med fagbrev">Fagbrev gir ikke i seg selv en høyere lovpålagt sats. En tariffavtale kan derimot gi kokker egne satser etter fagbrev og praksis.</InfoCard><InfoCard title="Unntak">Lærlinger, personer på arbeidsmarkedstiltak og enkelte ansatte under Landforpleiningsavtalen eller FLT/LO-området er unntatt.</InfoCard></div>
            <SourceLine href={`${restaurantMinimumWageRules.regulationUrl}#§2`} label="Lovdata, § 2" />
          </Section>

          <Section id="tariff" title="Lovpålagt minstelønn eller Riksavtalen?">
            <p>Lovpålagt minstelønn er gulvet for alle som omfattes av forskriften. Riksavtalen gjelder bare der arbeidsforholdet er bundet av tariffavtalen, og kan gi høyere og mer detaljerte satser.</p>
            <div className="grid gap-4 md:grid-cols-2"><ComparisonCard eyebrow="Gjeldende lovkrav" rate={currentRate.adultRate} title="Allmenngjort voksensats">Gjelder fra {formatDate(currentRate.effectiveFrom)} for arbeidstakere over 20 år eller etter fire måneders praksis over 18 år.</ComparisonCard><ComparisonCard eyebrow="Riksavtalen fra 1. juni 2026" rate={restaurantTariff2026.otherUnskilledStartingRate} title="Øvrig ansatt uten fagbrev">Dette er en tariffsats, og samtidig satsen som er foreslått allmenngjort. Den er ikke dagens lovpålagte sats.</ComparisonCard></div>
            <div className="overflow-x-auto rounded-[5px] border border-black/10 bg-white"><table className="w-full min-w-[650px] border-collapse text-left"><thead className="bg-slate-50 text-sm text-slate-700"><tr><th className="px-5 py-3">Riksavtalen, begynnersats</th><th className="px-5 py-3">37,5 t/uke</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-200 text-sm"><TariffRow label="Øvrig ansatt uten fagbrev" rate={restaurantTariff2026.otherUnskilledStartingRate} /><TariffRow label="Øvrig ansatt med fagbrev" rate={restaurantTariff2026.otherSkilledStartingRate} /><TariffRow label="Kokk uten fagbrev" rate={restaurantTariff2026.cookUnskilledStartingRate} /><TariffRow label="Kokk med fagbrev" rate={restaurantTariff2026.cookSkilledStartingRate} /></tbody></table></div>
            <p>Riksavtalen har også ansiennitetstrinn og egne garantibestemmelser for prosentlønnede servitører. Tabellen er derfor ikke en fullstendig tarifftabell for alle arbeidssituasjoner.</p>
            <SourceLine href={restaurantTariff2026.sourceUrl} label="Fellesforbundet – Riksavtalen" />
          </Section>

          <Section id="tillegg" title="Kvelds-, natt- og helgetillegg">
            <p>Den allmenngjorte forskriften gir ikke et generelt lovpålagt krav på kvelds-, natt- eller helgetillegg i restaurantbransjen. Slike tillegg kan følge av arbeidsavtalen eller en tariffavtale.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MiniRate label="Kveld" rate={restaurantTariff2026.eveningSupplement} /><MiniRate label="Helg" rate={restaurantTariff2026.weekendSupplement} /><MiniRate label="Natt – nattevakt" rate={restaurantTariff2026.nightWatchSupplement} /><MiniRate label="Natt – øvrige" rate={restaurantTariff2026.nightOtherSupplement} /></div>
            <p>Beløpene over er tariffbaserte tillegg i Riksavtalen fra 1. juni 2026 – ikke tillegg alle restaurantansatte automatisk har krav på. Kontroller arbeidsavtalen og hvilken tariffavtale som eventuelt gjelder.</p>
            <SourceLine href={restaurantMinimumWageRules.labourInspectionUrl} label="Arbeidstilsynet – tillegg i restaurantbransjen" />
          </Section>

          <Section id="overtid" title="Overtid i restaurant">
            <p>Når arbeidet faktisk er overtid etter arbeidsmiljøloven, har du krav på minst 40 prosent tillegg av den avtalte timelønnen. Ekstra timer for en deltidsansatt kan være merarbeid og er ikke automatisk overtid.</p>
            <div className="rounded-[10px] border border-[#d8eadf] bg-[#f3faf5] p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#15533d]">Regneeksempel</p><p className="mt-2 text-lg text-slate-950">Avtalt lønn {formatRate(currentRate.adultRate)} × 1,40 = <strong>{formatRate(currentRate.adultRate * 1.4)} per overtidstime</strong>.</p><p className="mt-2 text-sm leading-6 text-slate-600">Eksemplet forutsetter at timen er overtid etter loven, og at avtalt ordinær timelønn er lik minstelønnen. Bedre avtaler kan gi høyere tillegg.</p></div>
            <SourceLine href={restaurantMinimumWageRules.workingEnvironmentActUrl} label="Arbeidsmiljøloven § 10-6 (11)" />
          </Section>

          <Section id="tips" title="Kan tips regnes som en del av lønnen?">
            <p>Tips kan regnes som lønn når arbeidsgiver innberetter den som inntekt og tipsen inngår i beregningsgrunnlaget for feriepenger, skatt og trygdeytelser.</p>
            <p>Det betyr ikke at arbeidsgiver fritt kan bruke uregistrert eller tilfeldig tips til å erstatte fast lønn. Arbeidsgiver må kunne dokumentere at arbeidstakeren faktisk får minst den lovpålagte lønnen.</p>
            <SourceLine href={restaurantMinimumWageRules.labourInspectionUrl} label="Arbeidstilsynet – tips i serveringsbransjen" />
          </Section>

          <Section id="innkvartering" title="Trekk i lønn for innkvartering">
            <p>Når arbeidstakeren bor i et enkelt, innredet rom i samme bygning som virksomheten drives i, setter forskriften grenser for hvor mye arbeidsgiver kan trekke fra bruttolønnen.</p>
            <div className="grid gap-4 sm:grid-cols-2"><ComparisonCard eyebrow="Maksimalt trekk per måned" rate={currentRate.singleRoomDeduction} title="Enkeltrom">Gjelder typisk et enkelt hotellrom i samme bygning som arbeidsplassen.</ComparisonCard><ComparisonCard eyebrow="Maksimalt trekk per måned" rate={currentRate.doubleRoomDeduction} title="Dobbeltrom">For en mer selvstendig boenhet med kokemuligheter avtales husleien separat.</ComparisonCard></div>
            <SourceLine href={`${restaurantMinimumWageRules.regulationUrl}#§4`} label="Lovdata, § 4" />
          </Section>

          <Section id="laerlinger" title="Minstelønn for lærlinger i restaurantfag">
            <p>Lærlinger er uttrykkelig unntatt fra den allmenngjorte minstelønnsforskriften. De lovpålagte alderssatsene på denne siden skal derfor ikke presenteres som lærlinglønn.</p>
            <p>Riksavtalen har egne tariffbaserte lærlingesatser. For 37,5 timers uke er satsene fra første til fjerde halvår henholdsvis {restaurantTariff2026.apprenticeRates37_5Hours.map(formatRate).join(", ")} per time. Disse gjelder bare når tariffbestemmelsene kommer til anvendelse.</p>
            <SourceLine href={restaurantTariff2026.sourceUrl} label="Fellesforbundet – lærlingesatser i Riksavtalen" />
          </Section>

          <Section id="faktisk-lonn" title="Hva tjener kokker, servitører og bartendere faktisk?">
            <p>Minstelønn er et juridisk gulv. SSBs lønnsstatistikk viser hva heltids- og deltidsansatte samlet faktisk mottar i omregnet heltidslønn, og er verken en rettighet eller en tariffsats.</p>
            <div className="overflow-x-auto rounded-[5px] border border-black/10 bg-white"><table className="w-full min-w-[620px] border-collapse text-left"><thead className="bg-[#f1f7f2] text-sm text-slate-700"><tr><th className="px-5 py-3">Yrke</th><th className="px-5 py-3">Median 2025</th><th className="px-5 py-3">Gjennomsnitt 2025</th></tr></thead><tbody className="divide-y divide-slate-200 text-sm">{restaurantOccupationSalary2025.map((item) => <tr key={item.code}><td className="px-5 py-4"><Link className="font-semibold text-[#15533d] hover:underline" href={item.href}>{item.occupation}</Link><span className="ml-2 text-xs text-slate-400">{item.code}</span></td><td className="px-5 py-4 font-bold tabular-nums">{formatWholeKr(item.median)}/md.</td><td className="px-5 py-4 tabular-nums">{formatWholeKr(item.average)}/md.</td></tr>)}</tbody></table></div>
            <SourceLine href="https://www.ssb.no/statbank/table/11418/" label="SSB tabell 11418, oppdatert 28. august 2026" />
          </Section>

          <AdsenseAd className="my-8 sm:my-10" placement="occupation-before-faq" />

          <Section id="faq" title="Ofte stilte spørsmål"><div className="divide-y divide-slate-200 overflow-hidden rounded-[5px] border border-black/10 bg-white">{faqItems.map((item) => <details className="group px-5 py-4 open:bg-[#fbfbf8]" key={item.question}><summary className="cursor-pointer list-none pr-8 font-semibold text-slate-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-[var(--primary)] group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{item.answer}</p></details>)}</div></Section>

          <section aria-labelledby="videre-title" className="mt-14 overflow-hidden rounded-[18px] border border-[#cfded6] bg-[#f7faf8] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="border-b border-[#dce7e1] bg-white px-5 py-6 sm:px-8 sm:py-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Utforsk videre</p><h2 className="mt-2 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem]" id="videre-title">Fra minstelønn til faktisk restaurantlønn</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">Sammenlign det lovpålagte gulvet med oppdatert lønnsstatistikk for yrket ditt.</p><div className="mt-5 flex flex-wrap gap-3"><Link className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-strong)]" href="/yrke/servitorer-lonn">Se servitørlønn <span aria-hidden="true">→</span></Link><Link className="inline-flex items-center gap-2 rounded-[8px] border border-[#9fc5b5] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] hover:border-[var(--primary)]" href="/yrke/kokker-lonn">Se kokkelønn <span aria-hidden="true">→</span></Link></div></div>
            <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-2"><div><h3 className="text-lg font-bold text-slate-950">Nyttige lønnsverktøy</h3><div className="mt-4 grid gap-2">{salaryTools.map((item) => <Link className="group flex items-center justify-between gap-4 rounded-[10px] border border-slate-200 bg-white px-4 py-3 transition hover:border-[#9fc5b5] hover:shadow-sm" href={item.href} key={item.href}><span><strong className="block text-sm text-slate-950 group-hover:text-[var(--primary)]">{item.label}</strong><span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.description}</span></span><span aria-hidden="true" className="shrink-0 text-lg text-[var(--primary)]">→</span></Link>)}</div></div><div><h3 className="text-lg font-bold text-slate-950">Anbefalte artikler</h3><div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">{recommendedArticles.map((article) => <Link className="group flex items-start justify-between gap-4 py-3.5" href={article.href} key={article.href}><span><span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{article.category}</span><strong className="mt-1 block text-sm leading-5 text-slate-950 group-hover:text-[var(--primary)] group-hover:underline">{article.label}</strong></span><span aria-hidden="true" className="mt-3 text-lg text-[var(--primary)]">→</span></Link>)}</div></div></div>
          </section>
        </div>
      </div>
    </main>
  );
}

function RateCard({ emphasized = false, label, note, rate }: { emphasized?: boolean; label: string; note: string; rate: number }) {
  return <article className={`min-w-0 rounded-[11px] border px-5 py-5 shadow-[0_10px_30px_rgba(19,37,64,0.05)] ${emphasized ? "border-[#15533d] bg-[linear-gradient(135deg,#1d634c,#104733)] text-white" : "border-[#d8eadf] bg-[#f3faf5] text-[#19243b]"}`}><p className={`text-sm font-semibold ${emphasized ? "text-white/80" : "text-[#15533d]"}`}>{label}</p><p className="mt-3 whitespace-nowrap text-[clamp(1.8rem,4vw,2.5rem)] font-bold leading-none tabular-nums tracking-[-0.05em]">{formatRate(rate)}</p><p className={`mt-3 text-xs leading-5 ${emphasized ? "text-white/75" : "text-[#52627d]"}`}>{note}</p></article>;
}
function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) { return <section className="scroll-mt-6 space-y-6 py-10 first:pt-0 [&>p]:max-w-3xl [&>p]:text-[1.03rem] [&>p]:leading-[1.8] [&>p]:text-slate-950 sm:[&>p]:text-lg sm:[&>p]:leading-[1.95]" id={id}><h2 className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-950 sm:text-[2.1rem] sm:leading-[1.1]">{title}</h2>{children}</section>; }
function InfoCard({ children, title }: { children: ReactNode; title: string }) { return <article className="rounded-[5px] border border-black/10 bg-white p-5"><h3 className="text-lg font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{children}</p></article>; }
function ComparisonCard({ children, eyebrow, rate, title }: { children: ReactNode; eyebrow: string; rate: number; title: string }) { return <article className="rounded-[5px] border border-black/10 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[var(--primary)]">{eyebrow}</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{title}</h3><p className="mt-3 text-3xl font-bold tabular-nums text-slate-950">{formatRate(rate)}<span className="ml-1 text-sm font-medium text-slate-500">/time</span></p><p className="mt-3 text-sm leading-6 text-slate-700">{children}</p></article>; }
function MiniRate({ label, rate }: { label: string; rate: number }) { return <article className="rounded-[8px] border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Tariff · {label}</p><p className="mt-2 text-2xl font-bold tabular-nums text-[#15533d]">+{formatRate(rate)}</p><p className="mt-1 text-xs text-slate-500">per time</p></article>; }
function TariffRow({ label, rate }: { label: string; rate: number }) { return <tr><td className="px-5 py-4 font-medium text-slate-950">{label}</td><td className="px-5 py-4 text-lg font-bold tabular-nums text-[#15533d]">{formatRate(rate)}</td><td className="px-5 py-4 text-slate-600">Tariff</td></tr>; }
function SourceLine({ href, label }: { href: string; label: string }) { return <p className="text-xs leading-5 text-slate-500">Kilde: <a className="font-semibold text-[var(--primary)] hover:underline" href={href}>{label} ↗</a></p>; }

function getFaqItems(adult: number, under17: number, age17: number, age18: number, proposed: number) {
  return [
    { question: `Hva er minstelønnen i restaurant i ${currentYear}?`, answer: `Den gjeldende lovpålagte voksensatsen er ${formatRate(adult)} per time for arbeidstakere over 20 år eller etter fire måneders praksis opptjent etter fylte 18 år. Satsen gjelder fra 15. juni 2025.` },
    { question: "Hva er minstelønnen for en servitør, kokk eller bartender?", answer: `Den lovpålagte satsen bestemmes av alder og praksis, ikke av om du er servitør, kokk eller bartender. Voksensatsen er ${formatRate(adult)}. Tariffavtalen kan gi ulike og høyere satser etter yrke, fagbrev og ansiennitet.` },
    { question: "Hva er minstelønnen for unge restaurantansatte?", answer: `Satsen er ${formatRate(under17)} inntil 17 år, ${formatRate(age17)} for 17-åringer og ${formatRate(age18)} for 18-åringer før fire måneders praksis er oppfylt.` },
    { question: "Teller deltidsjobb og tilkallingsvakter som praksis?", answer: "Heltid og deltid opptjener praksis på lik linje. For tilkalling er ikke noen enkeltstående vakter over fire kalendermåneder automatisk nok; arbeidsmengden må tilsvare fire måneders praksis." },
    { question: "Har restaurantansatte krav på kveld-, natt- eller søndagstillegg?", answer: "Ikke etter den allmenngjorte minstelønnsforskriften. Slike tillegg kan følge av arbeidsavtale eller tariffavtale, blant annet Riksavtalen." },
    { question: "Kan tips regnes som lønn?", answer: "Tips kan regnes som lønn når arbeidsgiver innberetter den som inntekt og den inngår i grunnlaget for feriepenger, skatt og trygdeytelser. Arbeidsgiver må kunne dokumentere at lovpålagt minstelønn faktisk oppnås." },
    { question: `Er ${formatRate(proposed)} den nye lovpålagte minstelønnen?`, answer: `Nei. ${formatRate(proposed)} er en tariffsats fra Riksavtalen og en foreslått ny allmenngjort sats. Tariffnemndas sak er fortsatt under behandling, så dagens lovpålagte voksensats er ${formatRate(adult)}.` },
    { question: "Gjelder minstelønnen for lærlinger?", answer: "Nei. Lærlinger er unntatt fra den allmenngjorte forskriften. De kan i stedet ha egne tariffbaserte lærlingesatser." },
  ];
}

function formatRate(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function formatPercent(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`; }
function formatWholeKr(value: number) { return `${value.toLocaleString("nb-NO")} kr`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
