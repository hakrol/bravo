import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ElectricianMinimumWageCalculator } from "@/components/electrician-minimum-wage-calculator";
import { ElectricianMinimumWageChart } from "@/components/electrician-minimum-wage-chart";
import { OccupationDetailSectionNav } from "@/components/occupation-detail-section-nav";
import {
  calculateRateChange,
  electricianAllmenngjoringStatus2026,
  electricianMinimumWageRates,
  electricianMinimumWageRules,
  electricianTariff2026,
  getElectricianMinimumWageForDate,
  validateElectricianMinimumWageRates,
} from "@/lib/electrician-minimum-wage";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pagePath = "/minstelonn-elektriker";
const currentYear = new Date().getFullYear();
const title = `Minstelønn elektriker ${currentYear} – satser, tillegg og historikk`;
const description =
  "Se gjeldende minstelønn for elektrikere med og uten fagbrev. Utforsk historiske satser, overtid, skifttillegg og reglene for elektrobransjen.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pagePath },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: pagePath,
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

const sections = [
  { id: "dagens-sats", label: "Dagens minstelønn" },
  { id: "utvikling", label: "Utvikling" },
  { id: "historikk", label: "Historiske satser" },
  { id: "hvem-gjelder-det-for", label: "Hvem gjelder den for?" },
  { id: "tariff", label: "Tariff vs. minstelønn" },
  { id: "overtid", label: "Overtid" },
  { id: "skiftarbeid", label: "Skiftarbeid" },
  { id: "arbeidstid", label: "Arbeidstid" },
  { id: "kilder", label: "Kilder" },
  { id: "faq", label: "Ofte stilte spørsmål" },
];

const officialSources = [
  {
    title: "Minstelønn i elektrobransjen",
    publisher: "Arbeidstilsynet",
    purpose: "Kontroll av gjeldende satser og en praktisk oversikt over reglene.",
    url: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
  },
  {
    title: "Forskrift om delvis allmenngjøring av Landsoverenskomsten for elektrofagene",
    publisher: "Lovdata",
    purpose: "Gjeldende virkeområde, satser, skift, arbeidstid, overtid og reisevilkår.",
    url: "https://lovdata.no/forskrift/2024-10-21-2536",
  },
  {
    title: "Endringsforskrift 28. mai 2025 nr. 958",
    publisher: "Lovdata",
    purpose: "Gjeldende satser og ikrafttredelsesdato 15. juni 2025.",
    url: "https://lovdata.no/forskrift/2025-05-28-958",
  },
  {
    title: "Høring om fortsatt allmenngjøring – elektrofagene",
    publisher: "Tariffnemnda",
    purpose: "Status for behandlingen av ny allmenngjøringsforskrift i 2026.",
    url: electricianAllmenngjoringStatus2026.sourceUrl,
  },
  {
    title: "Landsoverenskomsten for elektrofagene 2026–2028",
    publisher: "NHO Elektro / EL og IT Forbundet",
    purpose: "Kontroll av tariffsatsen som gjelder tariffbundne virksomheter.",
    url: electricianTariff2026.sourceUrl,
  },
] as const;

export default function MinstelonnElektrikerPage() {
  const validationErrors = validateElectricianMinimumWageRates();
  if (validationErrors.length > 0) {
    throw new Error(`Ugyldig minstelønnsdatasett: ${validationErrors.join("; ")}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentRate = getElectricianMinimumWageForDate(today);
  if (!currentRate) {
    throw new Error(`Fant ingen minstelønnssats som gjelder ${today}.`);
  }

  const firstRate = electricianMinimumWageRates[0];
  const historicalChange = currentRate.skilledRate - firstRate.skilledRate;
  const historicalChangePercent = (historicalChange / firstRate.skilledRate) * 100;
  const overtime50 = currentRate.skilledRate * 1.5;
  const overtime100 = currentRate.skilledRate * 2;
  const twoShift = currentRate.skilledRate * 1.17;
  const threeShift = currentRate.skilledRate * 1.273;
  const faqItems = getFaqItems(currentRate.skilledRate, currentRate.otherRate);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hjem", item: getAbsoluteUrl("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: "Minstelønn for elektrikere",
          item: getAbsoluteUrl(pagePath),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {structuredData.map((data, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
          key={index}
          type="application/ld+json"
        />
      ))}

      <div className="mx-auto max-w-7xl">
        <nav aria-label="Brødsmulesti" className="mb-6 text-sm text-slate-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="hover:text-[var(--primary)] hover:underline" href="/">Hjem</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-900">Minstelønn for elektrikere</li>
          </ol>
        </nav>

        <header className="overflow-hidden rounded-[5px] border border-black/10 bg-[#f3f5ed] shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
          <div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-14">
            <div className="self-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Elektrobransjen</p>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
                Minstelønn for elektrikere
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-650 sm:text-lg">
                Elektrikere er blant yrkesgruppene i Norge som har lovpålagt minstelønn. Her finner
                du gjeldende sats, tidligere minstelønnssatser og reglene for blant annet overtid,
                skiftarbeid og arbeidstid.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <RateCard label="Faglært som utfører fagarbeid" rate={currentRate.skilledRate} emphasized />
              <RateCard label="Andre arbeidstakere" rate={currentRate.otherRate} />
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2 rounded-[5px] border border-green-900/15 bg-white/75 px-4 py-3 text-sm leading-6 text-slate-600">
                <p><strong className="text-slate-900">Gjeldende fra:</strong> {formatDate(currentRate.effectiveFrom)}</p>
                <p><strong className="text-slate-900">Sist kontrollert:</strong> {formatDate(currentRate.verifiedAt)}</p>
                <p>
                  Kilde: <a className="font-semibold text-[var(--primary)] underline decoration-green-800/30 underline-offset-2" href="https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/">Arbeidstilsynet</a>
                  {" / "}<a className="font-semibold text-[var(--primary)] underline decoration-green-800/30 underline-offset-2" href={currentRate.sourceUrl}>Lovdata</a>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <OccupationDetailSectionNav sections={sections} />
            </div>
          </aside>

          <div className="min-w-0">
            <OccupationDetailSectionNav className="mb-8 lg:hidden" sections={sections} variant="mobile" />

            <Section id="dagens-sats" title="Hva betyr minstelønnen i praksis?">
              <p>
                Velg arbeidstakergruppe og arbeidstid for å omregne timesatsen. Tallene under er
                et regneeksempel, ikke et mål på hva elektrikere vanligvis tjener.
              </p>
              <ElectricianMinimumWageCalculator
                otherRate={currentRate.otherRate}
                skilledRate={currentRate.skilledRate}
              />
            </Section>

            <Section id="utvikling" title="Utvikling i minstelønn for elektrikere">
              <p>
                Diagrammet følger de faktiske ikrafttredelsesdatoene. En sats står stille frem til
                den blir erstattet av en ny forskrift eller endringsforskrift.
              </p>
              <ElectricianMinimumWageChart
                points={electricianMinimumWageRates.map(({ effectiveFrom, effectiveTo, skilledRate }) => ({ effectiveFrom, effectiveTo, skilledRate }))}
                today={today}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Stat label="Endring siden innføringen i mai 2015" value={`+${formatRate(historicalChange)}`} />
                <Stat label="Prosentvis endring" value={`+${formatPercent(historicalChangePercent)}`} />
              </div>
            </Section>

            <Section id="historikk" title="Historiske minstelønnssatser">
              <p>
                Hver rad er kontrollert mot den opprinnelige Lovdata-forskriften. Periodene er ikke
                slått sammen etter kalenderår.
              </p>
              <div className="overflow-x-auto rounded-[5px] border border-black/10 bg-white">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="bg-[#f3f5ed] text-xs uppercase tracking-[0.08em] text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Gjelder fra</th><th className="px-4 py-3">Gjelder til</th>
                      <th className="px-4 py-3 text-right">Faglært</th><th className="px-4 py-3 text-right">Andre</th>
                      <th className="px-4 py-3 text-right">Endring</th><th className="px-4 py-3">Kilde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...electricianMinimumWageRates].reverse().map((rate) => {
                      const originalIndex = electricianMinimumWageRates.findIndex((entry) => entry.effectiveFrom === rate.effectiveFrom);
                      const change = calculateRateChange(rate, electricianMinimumWageRates[originalIndex - 1]);
                      return (
                        <tr className="border-t border-slate-200 text-slate-700" key={rate.effectiveFrom}>
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-950">{formatShortDate(rate.effectiveFrom)}</td>
                          <td className="whitespace-nowrap px-4 py-3">{rate.effectiveTo ? formatShortDate(rate.effectiveTo) : "Gjeldende"}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums">{formatRate(rate.skilledRate)}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{formatRate(rate.otherRate)}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{change ? `+${formatPercent(change.percent)}` : "–"}</td>
                          <td className="px-4 py-3"><a className="font-semibold text-[var(--primary)] hover:underline" href={rate.sourceUrl}>{rate.regulationId}</a></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="hvem-gjelder-det-for" title="Hvem har krav på minstelønnen?">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard title="Arbeidet som omfattes">
                  Forskriften gjelder arbeidstakere i bedrifter som utfører installasjon, montasje og
                  vedlikehold av elektriske anlegg for automatisering, data, telekommunikasjon og
                  lignende. Det er arbeidet og virksomheten som avgjør, ikke yrkestittelen alene.
                </InfoCard>
                <InfoCard title="Uavhengig av medlemskap">
                  Når arbeidet faller inn under den allmenngjorte forskriften, gjelder minstekravene
                  uavhengig av om arbeidstakeren er fagorganisert. Forskriften er et lovpålagt gulv.
                </InfoCard>
                <InfoCard title="Hvem regnes som faglært?">
                  En faglært arbeidstaker har offentlig godkjent fagbrev, DSB-godkjenning eller
                  tilsvarende utdanning innen fagfeltet arbeidet utføres i. Utenlandske fagbrev som
                  er godkjent av NOKUT, sidestilles med norske fagbrev.
                </InfoCard>
                <InfoCard title="Hvem omfattes ikke?">
                  Forskriften gjelder ikke petroleumsvirksomhet til havs. Lærlinger og personer på
                  arbeidsmarkedstiltak er også unntatt fra disse minstelønnsbestemmelsene.
                </InfoCard>
              </div>
              <SourceLine href="https://lovdata.no/forskrift/2024-10-21-2536" label="Lovdata, §§ 2–3" />
            </Section>

            <Section id="tariff" title="Minstelønn og tarifflønn er ikke det samme">
              <p>
                Den lovpålagte minstelønnen kommer fra allmenngjøring av deler av
                Landsoverenskomsten. Selve tariffavtalen kan få nye eller høyere satser uten at de
                automatisk blir lovpålagt minstelønn for hele bransjen.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <ComparisonCard eyebrow="Lovpålagt" title="Allmenngjort minstelønn" rate={currentRate.skilledRate}>
                  Gulvet for faglærte som utfører fagarbeid omfattet av forskriften. Satsen gjelder
                  fra {formatDate(currentRate.effectiveFrom)}.
                </ComparisonCard>
                <ComparisonCard eyebrow="Tariffbundet" title="Tariffsats 2026" rate={electricianTariff2026.skilledRate}>
                  Minstesats for fagarbeider i Landsoverenskomsten 2026–2028 fra
                  {" "}{formatDate(electricianTariff2026.effectiveFrom)}. Den er ikke per
                  {" "}{formatDate(electricianTariff2026.verifiedAt)} vedtatt som ny allmenngjort sats.
                </ComparisonCard>
              </div>
              <SourceLine href={electricianTariff2026.sourceUrl} label="NHO Elektro / EL og IT Forbundet, Landsoverenskomsten 2026–2028" />

              <div className="rounded-[5px] border border-amber-700/25 bg-amber-50 px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Status 2026</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">Ny minstelønn i 2026?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Tariffnemndas sak står som <strong>{electricianAllmenngjoringStatus2026.status}</strong>.
                  Utkastet foreslår {formatRate(electricianAllmenngjoringStatus2026.proposedSkilledRate)}
                  for faglærte og {formatRate(electricianAllmenngjoringStatus2026.proposedOtherRate)} for
                  andre arbeidstakere, men forslaget er ikke gjeldende rett. Satsene fra 15. juni
                  2025 gjelder frem til et nytt vedtak trer i kraft.
                </p>
                <SourceLine href={electricianAllmenngjoringStatus2026.sourceUrl} label="Tariffnemnda – status under behandling" />
              </div>
            </Section>

            <Section id="overtid" title="Minstelønn og overtid">
              <p>
                Arbeid utover ordinær arbeidstid gir 50 prosent tillegg. For slikt arbeid mellom
                klokken 21.00 og 06.00, og på søndager og helligdager, er tillegget 100 prosent.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Vanlig time" value={formatRate(currentRate.skilledRate)} />
                <Stat label="Overtid +50 %" value={formatRate(overtime50)} />
                <Stat label="Overtid +100 %" value={formatRate(overtime100)} />
              </div>
              <p className="text-sm text-slate-600">Eksemplene er beregnet programmatisk fra gjeldende faglærtsats.</p>
              <SourceLine href={`${electricianMinimumWageRules.sourceUrl}#§6`} label="Lovdata, § 6" />
            </Section>

            <Section id="skiftarbeid" title="Tillegg ved skiftarbeid">
              <p>
                Minstetillegget er 17 prosent ved toskiftsarbeid og 27,3 prosent ved
                treskiftsarbeid. Regelmessig skiftarbeid er sammenhengende arbeidsoppdrag på minst
                14 dager; helgen bryter ikke sammenhengen.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Stat label="Toskift · sats inkludert 17 %" value={formatRate(twoShift)} />
                <Stat label="Treskift · sats inkludert 27,3 %" value={formatRate(threeShift)} />
              </div>
              <SourceLine href={`${electricianMinimumWageRules.sourceUrl}#§3`} label="Lovdata, § 3" />
            </Section>

            <Section id="arbeidstid" title="Arbeidstid">
              <p>
                Ordinær arbeidstid etter forskriften skal ikke overstige 37,5 timer per uke. Ved
                omregning til kortere skiftordninger skal lønnen kompenseres etter satsene under.
                Kompensasjonen regnes av reell timelønn.
              </p>
              <div className="overflow-hidden rounded-[5px] border border-black/10 bg-white">
                {electricianMinimumWageRules.workingTimeCompensation.map((item) => (
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0" key={item.weeklyHours}>
                    <span className="text-sm text-slate-700">37,5 → {formatDecimal(item.weeklyHours)} timer</span>
                    <strong className="tabular-nums text-slate-950">{formatPercent(item.supplement * 100)}</strong>
                  </div>
                ))}
              </div>
              <SourceLine href={`${electricianMinimumWageRules.sourceUrl}#§3`} label="Lovdata, §§ 3 og 5" />
            </Section>

            <Section id="reise" title="Reise, kost og losji">
              <p>
                Når arbeidsoppdrag krever overnatting utenfor hjemmet, skal arbeidsgiver dekke
                nødvendige reiseutgifter ved oppdragets start og slutt. Før utsending skal kost og
                losji være avtalt. Hovedregelen er at arbeidsgiver sørger for kost og losji, men
                fast diettsats, refusjon etter regning eller lignende kan avtales.
              </p>
              <SourceLine href={`${electricianMinimumWageRules.sourceUrl}#§7`} label="Lovdata, § 7" />
            </Section>

            <Section id="kilder" title="Kilder og metode">
              <p>
                Lønnsinnsikt bruker gjeldende forskrift som rettslig hovedkilde og kontrollerer
                presentasjonen mot Arbeidstilsynet og Tariffnemnda. Historiske satser er hentet fra
                hver enkelt forskrift eller endringsforskrift som er lenket i tabellen over.
              </p>
              <div className="grid gap-3">
                {officialSources.map((source) => (
                  <article className="rounded-[5px] border border-black/10 bg-white px-5 py-4" key={source.url}>
                    <h3 className="font-semibold text-slate-950">{source.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{source.publisher}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{source.purpose}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-slate-500">Kontrollert {formatDate(currentRate.verifiedAt)}</span>
                      <a className="font-semibold text-[var(--primary)] hover:underline" href={source.url}>Åpne kilde ↗</a>
                    </div>
                  </article>
                ))}
              </div>
              <p className="rounded-[5px] bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">
                Merk: Opplysningene er en generell oversikt, ikke en individuell juridisk vurdering.
                Arbeidsavtale, tariffavtale og arbeidets faktiske art kan være avgjørende.
              </p>
            </Section>

            <Section id="faq" title="Ofte stilte spørsmål">
              <div className="divide-y divide-slate-200 overflow-hidden rounded-[5px] border border-black/10 bg-white">
                {faqItems.map((item) => (
                  <details className="group px-5 py-4 open:bg-[#fbfbf8]" key={item.question}>
                    <summary className="cursor-pointer list-none pr-8 font-semibold text-slate-950 marker:hidden">
                      {item.question}<span aria-hidden="true" className="float-right text-[var(--primary)] group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{item.answer}</p>
                  </details>
                ))}
              </div>
            </Section>

            <div className="mt-12 rounded-[5px] border border-green-900/15 bg-[#f3f5ed] px-5 py-6 sm:px-7">
              <h2 className="text-xl font-semibold text-slate-950">Se hva elektrikere faktisk tjener</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Minstelønn er et gulv. Sammenlign med oppdatert lønnsstatistikk for yrket.
              </p>
              <Link className="mt-4 inline-flex rounded-[5px] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-strong)]" href="/yrke/elektrikere-lonn">
                Se elektrikerlønn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function RateCard({ label, rate, emphasized = false }: { label: string; rate: number; emphasized?: boolean }) {
  return (
    <div className={`rounded-[5px] border px-5 py-5 ${emphasized ? "border-green-900/25 bg-[#163d26] text-white" : "border-black/10 bg-white/90 text-slate-950"}`}>
      <p className={`text-sm font-semibold ${emphasized ? "text-green-50" : "text-slate-600"}`}>{label}</p>
      <p className="mt-3 whitespace-nowrap text-3xl font-bold tabular-nums tracking-[-0.04em] sm:text-4xl">{formatRate(rate)}<span className={`ml-1 text-sm font-medium tracking-normal ${emphasized ? "text-green-100" : "text-slate-500"}`}>/time</span></p>
    </div>
  );
}

function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) {
  return (
    <section className="scroll-mt-6 space-y-5 border-b border-slate-200 py-10 first:pt-0 last:border-b-0 [&>p]:max-w-3xl [&>p]:text-base [&>p]:leading-7 [&>p]:text-slate-700" id={id}>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{title}</h2>
      {children}
    </section>
  );
}

function InfoCard({ children, title }: { children: ReactNode; title: string }) {
  return <article className="rounded-[5px] border border-black/10 bg-white p-5"><h3 className="text-lg font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{children}</p></article>;
}

function ComparisonCard({ children, eyebrow, rate, title }: { children: ReactNode; eyebrow: string; rate: number; title: string }) {
  return <article className="rounded-[5px] border border-black/10 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[var(--primary)]">{eyebrow}</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{title}</h3><p className="mt-3 text-3xl font-bold tabular-nums text-slate-950">{formatRate(rate)}<span className="text-sm font-medium text-slate-500">/time</span></p><p className="mt-3 text-sm leading-6 text-slate-700">{children}</p></article>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[5px] border border-black/10 bg-white px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p><p className="mt-1.5 text-2xl font-bold tabular-nums text-slate-950">{value}</p></div>;
}

function SourceLine({ href, label }: { href: string; label: string }) {
  return <p className="text-xs leading-5 text-slate-500">Kilde: <a className="font-semibold text-[var(--primary)] hover:underline" href={href}>{label} ↗</a></p>;
}

function getFaqItems(skilledRate: number, otherRate: number) {
  return [
    { question: `Hva er minstelønnen for en elektriker i ${currentYear}?`, answer: `Den gjeldende lovpålagte satsen er ${formatRate(skilledRate)} per time for faglærte som utfører fagarbeid og ${formatRate(otherRate)} for andre arbeidstakere. Satsene gjelder fra 15. juni 2025. Tariffnemndas 2026-sak er fortsatt under behandling.` },
    { question: "Hva er minstelønnen for en elektriker med fagbrev?", answer: `En faglært som utfører fagarbeid omfattet av forskriften, skal minst ha ${formatRate(skilledRate)} per time. Det er det utførte arbeidet og forskriftens virkeområde som er avgjørende.` },
    { question: "Har elektrikere lovpålagt minstelønn?", answer: "Ja, arbeid innen elektrobransjen som faller inn under den allmenngjorte forskriften, har lovpålagte minstekrav til lønn og enkelte andre arbeidsvilkår." },
    { question: "Gjelder minstelønnen alle elektrikere?", answer: "Nei. Forskriften har et avgrenset virkeområde og gjelder blant annet ikke petroleumsvirksomhet til havs, lærlinger eller personer på arbeidsmarkedstiltak." },
    { question: "Er tarifflønn og minstelønn det samme?", answer: "Nei. Tariffavtalen gjelder tariffbundne virksomheter og kan gi høyere satser og flere rettigheter. En tariffsats blir ikke lovpålagt for hele bransjen før Tariffnemnda eventuelt allmenngjør den." },
    { question: "Hva får elektrikere i overtidsbetaling?", answer: `Forskriften krever 50 prosent tillegg utover ordinær arbeidstid. Med dagens faglærtsats blir det ${formatRate(skilledRate * 1.5)} per time. Mellom klokken 21.00 og 06.00, og på søndager og helligdager, er tillegget 100 prosent, tilsvarende ${formatRate(skilledRate * 2)}.` },
    { question: "Har lærlinger samme minstelønn?", answer: "Nei. Lærlinger er uttrykkelig unntatt fra minstelønnsbestemmelsene i denne allmenngjøringsforskriften. Lærlinglønn kan følge tariffavtale eller arbeidsavtale." },
    { question: "Hvor ofte endres minstelønnen for elektrikere?", answer: "Det finnes ingen fast årlig dato. Endringer skjer når Tariffnemnda vedtar ny forskrift eller regulerer satsene, og gjelder fra den konkrete ikrafttredelsesdatoen." },
  ];
}

function formatRate(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function formatPercent(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`; }
function formatDecimal(value: number) { return value.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
function formatShortDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
