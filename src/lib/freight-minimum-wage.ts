export type FreightMinimumWagePoint = {
  effectiveFrom: string;
  effectiveTo: string | null;
  hourlyRate: number;
};

// Bare faktiske satsendringer. Virkeområdeendringer lagres separat.
export const freightMinimumWageHistory: FreightMinimumWagePoint[] = [
  { effectiveFrom: "2015-07-01", effectiveTo: "2017-05-31", hourlyRate: 158.32 },
  { effectiveFrom: "2017-06-01", effectiveTo: "2018-11-30", hourlyRate: 167.65 },
  { effectiveFrom: "2018-12-01", effectiveTo: "2019-06-30", hourlyRate: 171.45 },
  { effectiveFrom: "2019-07-01", effectiveTo: "2021-06-30", hourlyRate: 175.95 },
  { effectiveFrom: "2021-07-01", effectiveTo: "2022-12-14", hourlyRate: 185.5 },
  { effectiveFrom: "2022-12-15", effectiveTo: "2023-06-14", hourlyRate: 196.5 },
  { effectiveFrom: "2023-06-15", effectiveTo: "2024-10-31", hourlyRate: 207 },
  { effectiveFrom: "2024-11-01", effectiveTo: "2025-06-14", hourlyRate: 222 },
  { effectiveFrom: "2025-06-15", effectiveTo: null, hourlyRate: 229 },
];

export const freightScopeHistory = [
  { effectiveFrom: "2015-07-01", vehicleWeightOverKg: 3500, event: "initial-scope" },
  { effectiveFrom: "2025-06-01", vehicleWeightOverKg: 2500, event: "scope-change" },
] as const;

export const freightMinimumWage = {
  effectiveFrom: "2025-06-15", effectiveTo: null, hourlyRate: 229,
  vehicleWeightOverKg: 2500,
  multiDayTrip: { minimumPaidHoursPerFullIntermediateDay: 7.5 },
  diet: { fullDay: "tax-free-government-rate", partialDayFraction: 0.25, partialDayIntervalHours: 6, countsAsWage: false },
  wagePaymentDeadlineDay: 20, status: "active",
  regulationId: "FOR-2024-10-29-2601", amendmentId: "FOR-2025-05-28-959",
  verifiedAt: "2026-10-04",
} as const;

export const freightMinimumWageProposal = {
  effectiveFrom: null, hourlyRate: 244.5, vehicleWeightOverKg: 2500,
  status: "proposed", verifiedAt: "2026-10-04",
} as const;

export const freightTariff2026 = {
  effectiveFrom: "2026-08-01", lowestHourlyRate: 244.5,
  generalIncrease: 6.5, freightIncrease: 4, additionalMinimumIncrease: 5,
  skilledSupplement: 15, supplementEffectiveFrom: "2026-04-01", status: "approved",
} as const;

export const freightSources = {
  rates: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
  regulation: "https://lovdata.no/dokument/SF/forskrift/2024-10-29-2601",
  regulationText: "https://www.arbeidstilsynet.no/regelverk/forskrifter/forskrift-om-delvis-allmenngjoring-av-tariffavtaler-for-godstransport-pa-vei/",
  amendment: "https://lovdata.no/dokument/SF/forskrift/2025-05-28-959",
  proposal: "https://www.tariffnemnda.no/horinger/godstransport-pa-vei/",
  draft: "https://www.tariffnemnda.no/contentassets/f0d5da27f45c4d649f509cfd892a83dd/utkast-forskrift---godstransport-pa-vei.pdf",
  hearing: "https://www.tariffnemnda.no/contentassets/f0d5da27f45c4d649f509cfd892a83dd/horing---fortsatt-allmenngjoring-av-tariffavtaler-om-godstransport-pa-vei.pdf",
  tariff: "https://www.fellesforbundet.no/lonn-og-tariff/lonnsoppgjorene/hovedoppgjoret-2026/uravstemming/godsoverenskomsten/",
  tariffApproved: "https://ytf.no/2026/07/godsoppgjoret-er-vedtatt/",
  tariff2024: "https://www.fellesforbundet.no/globalassets/lonn-og-tariffsaker/tariffavtaler/overenskomster-2024-2026/godsoverenskomsten-nho-2024-2026-nett.pdf",
  postedDrivers: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/utsendte-sjaforer-gods--og-passasjertransport/",
  overtime: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/overtid/",
  firstRegulation: "https://lovdata.no/dokument/SFO/forskrift/2015-05-11-554",
  regulation2017: "https://lovdata.no/SFO/forskrift/2017-03-31-535",
  original2018: "https://www.tariffnemnda.no/globalassets/tariffnemnda/2018/protokoll-05-18-tariffnemnda---godstransport-pa-vei.pdf",
  regulation2018: "https://lovdata.no/dokument/SFO/forskrift/2018-10-12-1703",
  amendment2019: "https://lovdata.no/dokument/LTI/forskrift/2019-05-31-700",
  regulation2021: "https://www.tariffnemnda.no/contentassets/84a15fc526e846c2a5eaa57dc89fe574/protokoll---vedtak---godstransport.pdf",
  regulation2022: "https://lovdata.no/dokument/SFO/forskrift/2022-12-09-2171",
  original2022: "https://www.tariffnemnda.no/contentassets/d600181bcf0647ddb45f3f7f4978645c/protokoll-6-2022---godstransport.pdf",
  original2024: "https://www.tariffnemnda.no/contentassets/5d8b8a1a978842569804561e87c97cef/vedtak-9-2024-tariffnemnda---godstransport.pdf",
  ssb: "https://www.ssb.no/statbank/table/11418/",
} as const;

export function formatFreightRate(value: number) {
  return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
}

// Tabellen kombinerer lønnsperioder og virkeområde uten å skape ekstra grafpunkter.
export function getFreightHistoryPeriods() {
  const dates = [...new Set([
    ...freightMinimumWageHistory.map((point) => point.effectiveFrom),
    ...freightScopeHistory.map((event) => event.effectiveFrom),
  ])].sort();
  return dates.map((effectiveFrom, index) => {
    const rate = freightMinimumWageHistory.find((point) => point.effectiveFrom <= effectiveFrom && (!point.effectiveTo || point.effectiveTo >= effectiveFrom))!;
    const scope = freightScopeHistory.filter((event) => event.effectiveFrom <= effectiveFrom).at(-1)!;
    const next = dates[index + 1];
    const effectiveTo = next ? new Date(Date.parse(`${next}T00:00:00Z`) - 86400000).toISOString().slice(0, 10) : null;
    return { effectiveFrom, effectiveTo, hourlyRate: rate.hourlyRate, vehicleWeightOverKg: scope.vehicleWeightOverKg };
  });
}

export const freightFaq = [
  { question: "Hva er minstelønnen for lastebil- og trailersjåfører i 2026?", answer: "Gjeldende lovpålagt minstelønn er 229,00 kr per time fra 15. juni 2025 for godstransport på vei med kjøretøy med tillatt totalvekt over 2,5 tonn. Forskriften har én sats, uten egne trinn for alder, fagbrev eller ansiennitet. Lærlinger og personer på arbeidsmarkedstiltak er unntatt." },
  { question: "Har varebilsjåfører krav på minstelønn, og hvor tung må bilen være?", answer: "Varebiltransport kan omfattes fra 1. juni 2025 når kjøretøyets tillatte totalvekt er over 2 500 kg. Det er tillatt totalvekt, ikke dagens last, som er avgjørende. Kjøretøy på nøyaktig 2,5 tonn eller lettere omfattes ikke av denne forskriften. Egentransport er unntatt." },
  { question: "Gjelder minstelønnen ved egentransport?", answer: "Nei. Forskriften gjelder ikke transport av virksomhetens egne varer. Arbeidstilsynet beskriver dette som varer virksomheten selv har produsert, transportert av virksomhetens egne ansatte." },
  { question: "Hvor mange timer skal jeg få betalt på flerdagsturer?", answer: "Alle døgn mellom oppstarts- og avslutningsdøgnet skal lønnes med minst 7,5 timer. På en tur mandag til torsdag gjelder garantien tirsdag og onsdag. Unntaket for første og siste døgn betyr ikke at disse døgnene kan være ulønnet." },
  { question: "Har godssjåfører krav på diett?", answer: "Ja, på flerdagsturer. Fullt reisedøgn gir full diett etter satsen myndighetene til enhver tid godkjenner som skattefri. Ufullstendig reisedøgn gir en firedel av diettsatsen per påbegynte seks timer. Diett er en separat ytelse og kan ikke brukes til å fylle opp timelønnen til minstelønnen." },
  { question: "Når skal godssjåfører få utbetalt lønn?", answer: "Lønn skal normalt betales senest den 20. hver måned. Faller dagen på en helligdag, skal den betales dagen før. Variable tillegg betales med ordinær lønn påfølgende måned. Bedrift med tariffavtale inngått med fagforening med innstillingsrett kan avtale andre betalingsordninger med de tillitsvalgte." },
  { question: "Er 244,50 kroner den nye lovpålagte minstelønnen?", answer: "Nei, per 4. oktober 2026 er 244,50 kr laveste nye tariffsats fra 1. august 2026 og foreslått allmenngjort sats. Tariffnemndas forslag er under behandling og har ingen vedtatt ikrafttredelsesdato. Dagens lovpålagte sats er fortsatt 229,00 kr per time." },
];
