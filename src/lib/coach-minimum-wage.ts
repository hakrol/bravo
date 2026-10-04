export type CoachMinimumWagePoint = {
  effectiveFrom: string;
  effectiveTo: string | null;
  hourlyRate: number;
};

// Ikrafttredelsen ble utsatt fra 1. august til 1. oktober 2015 (FOR-2015-07-23-916).
export const coachMinimumWageHistory: CoachMinimumWagePoint[] = [
  { effectiveFrom: "2015-10-01", effectiveTo: "2017-05-31", hourlyRate: 150 },
  { effectiveFrom: "2017-06-01", effectiveTo: "2018-11-30", hourlyRate: 154.57 },
  { effectiveFrom: "2018-12-01", effectiveTo: "2019-06-30", hourlyRate: 155.87 },
  { effectiveFrom: "2019-07-01", effectiveTo: "2021-06-30", hourlyRate: 158.37 },
  { effectiveFrom: "2021-07-01", effectiveTo: "2022-12-14", hourlyRate: 174.12 },
  { effectiveFrom: "2022-12-15", effectiveTo: "2023-06-14", hourlyRate: 194.12 },
  { effectiveFrom: "2023-06-15", effectiveTo: "2024-10-31", hourlyRate: 202.62 },
  { effectiveFrom: "2024-11-01", effectiveTo: "2025-06-14", hourlyRate: 213.62 },
  { effectiveFrom: "2025-06-15", effectiveTo: null, hourlyRate: 218.62 },
];

export const coachMinimumWage = {
  effectiveFrom: "2025-06-15",
  effectiveTo: null,
  hourlyRate: 218.62,
  sourceType: "allmenngjoring",
  regulationId: "FOR-2024-10-21-2534",
  amendmentId: "FOR-2025-05-28-955",
  foodAndLodgingCoveredByEmployer: true,
  status: "active",
  verifiedAt: "2026-10-04",
} as const;

export const coachMinimumWageProposal = {
  effectiveFrom: null,
  hourlyRate: 229.62,
  status: "proposed",
  verifiedAt: "2026-10-04",
  hearingDeadline: "2026-08-20",
} as const;

export const coachTariff2026 = {
  effectiveFrom: "2026-04-01",
  withoutCertificate: 229.62,
  withCertificate: 243.62,
  status: "tariff",
} as const;

export const coachSources = {
  rates: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/lonn/minstelonn/",
  regulation: "https://lovdata.no/dokument/SF/forskrift/2024-10-21-2534",
  regulationText: "https://www.arbeidstilsynet.no/regelverk/forskrifter/forskrift-om-delvis-allmenngjoring-av-tariffavtaler-for-persontransport-med-turbil/",
  amendment: "https://lovdata.no/dokument/LTI/forskrift/2025-05-28-955",
  transportLaw: "https://lovdata.no/dokument/NL/lov/2002-06-21-45#%C2%A78",
  proposal: "https://www.tariffnemnda.no/horinger/turbil/",
  draft: "https://www.tariffnemnda.no/contentassets/b0630a103fcb463f83259706f06a9027/utkast---forskrift---turbil.pdf",
  hearing: "https://www.tariffnemnda.no/contentassets/b0630a103fcb463f83259706f06a9027/horing--fortsatt-allmenngjoring-av-tariffavtaler-om-persontransport-med-turbil.pdf",
  tariff: "https://www.fellesforbundet.no/aktuelt/nyheter/2026/enighet-pa-bussbransjeavtalene/",
  tariffApproved: "https://www.fellesforbundet.no/aktuelt/nyheter/2026/uravstemning-buss/",
  tariff2025: "https://www.fellesforbundet.no/globalassets/lonn-og-tariffsaker/tariffoppgjoret-2025/lonnstabell-minstelonnssatser-bba.pdf",
  tariffAgreement: "https://www.fellesforbundet.no/lonn-og-tariff/tariffavtaler/bussbransjeavtalene/",
  firstRegulation: "https://lovdata.no/dokument/SFO/forskrift/2015-05-27-815",
  postponed2015: "https://lovdata.no/dokument/LTI/forskrift/2015-07-23-916",
  regulation2017: "https://lovdata.no/dokument/LTI/forskrift/2017-05-19-631",
  regulation2018: "https://lovdata.no/dokument/LTI/forskrift/2018-10-12-1701",
  original2019: "https://www.tariffnemnda.no/globalassets/tariffnemnda/2019/protokoll-09-19-tariffnemnda---turbil.pdf",
  regulation2021: "https://lovdata.no/dokument/LTI/forskrift/2021-05-10-2076",
  regulation2022: "https://lovdata.no/dokument/LTI/forskrift/2022-12-09-2172",
  amendment2023: "https://lovdata.no/dokument/LTI/forskrift/2023-05-30-783",
  original2024: "https://www.tariffnemnda.no/contentassets/1401109f5bb9446ca218fc22978d9b6f/vedtak-1-2024-tariffnemnda---turbil.pdf",
  postedDrivers: "https://www.arbeidstilsynet.no/lonn-og-ansettelse/utsendte-sjaforer-gods--og-passasjertransport/",
  overtime: "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/overtid/",
  ssb: "https://www.ssb.no/statbank/table/11418/",
} as const;

export function formatCoachRate(rate: number) {
  return rate.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kr";
}

export const coachFaq = [
  { question: "Hva er minstelønnen for turbussjåfør i 2026?", answer: "Per 4. oktober 2026 er den lovpålagte minstelønnen 218,62 kroner per time for ansatte som omfattes av turbilforskriften. Satsen gjelder fra 15. juni 2025." },
  { question: "Gjelder minstelønnen alle bussjåfører og rutebusser?", answer: "Nei. Forskriften gjelder persontransport med turvogn eller buss når transporten ikke krever tildeling av løyve ved konkurranse etter yrkestransportlova § 8. Konkurranseutsatte oppdrag følger andre krav til lønns- og arbeidsvilkår. Yrkestittelen bussjåfør avgjør ikke alene om du er omfattet." },
  { question: "Er minstelønnen høyere med fagbrev?", answer: "Forskriften har ett lovpålagt gulv på 218,62 kroner per time, uten fagbrevtillegg eller egne alders- og ansiennitetstrinn. Bussbransjeavtalens turbilkapittel har fra 1. april 2026 tariffsatser på 229,62 kroner uten fagbrev og 243,62 kroner med fagbrev når avtalen gjelder." },
  { question: "Er 229,62 kroner den nye lovpålagte minstelønnen?", answer: "Ikke per 4. oktober 2026. Beløpet er tariffsatsen uten fagbrev og foreslått neste allmenngjorte sats. Tariffnemndas sak er under behandling, og utkastet har ingen fastsatt ikrafttredelsesdato. Gjeldende lovsats er fortsatt 218,62 kroner." },
  { question: "Hvem betaler mat og overnatting på tur?", answer: "Arbeidsgiver skal dekke kost og losji for arbeidstakere som omfattes, når bestemmelsen kommer til anvendelse. Fast diett, betaling etter regning, avtalt dekning fra oppdragsgiver eller en tilsvarende løsning kan avtales." },
  { question: "Hva får en turbilsjåfør i overtidsbetaling?", answer: "Ved faktisk overtidsarbeid er lovens minimum 40 prosent tillegg av avtalt ordinær timelønn, med mindre en bedre ordning gjelder. Ved avtalt timelønn på 218,62 kroner blir betalingen minst 306,07 kroner per overtidstime. Høyere avtalt timelønn gir et høyere beregningsgrunnlag." },
  { question: "Har lærlinger krav på samme minstelønn?", answer: "Nei. Lærlinger og personer på arbeidsmarkedstiltak er unntatt fra allmenngjøringsforskriften. Lærlinglønn må vurderes etter lærekontrakt, eventuell tariffavtale og øvrige relevante regler." },
] as const;
