import type { RateType, TariffStep } from "./tariff-model";

export type VernepleierTariffAreaId = "ks" | "spekter" | "oslo";
export type VernepleierPositionId =
  | "vernepleier"
  | "spesialvernepleier"
  | "spekter-vernepleier"
  | "spekter-spesialutdanning"
  | "oslo-vernepleier"
  | "oslo-vernepleierkonsulent";

export type TariffSource = Readonly<{
  id: string;
  label: string;
  href: string;
  documents: "satser" | "stillingsgruppe" | "stillingsregister" | "lønnsramme";
}>;

export type VernepleierPosition = Readonly<{
  id: VernepleierPositionId;
  label: string;
  tariffCode: string;
  salaryGroup: string;
  qualificationNote: string;
  steps: readonly TariffStep[];
}>;

export type VernepleierTariffAgreement = Readonly<{
  id: VernepleierTariffAreaId;
  shortLabel: string;
  label: string;
  year: 2026;
  validFrom: string;
  lastUpdated: string;
  rateType: RateType;
  scopeNote: string;
  sources: readonly TariffSource[];
  positions: readonly VernepleierPosition[];
}>;

const ksSources: readonly TariffSource[] = [
  {
    id: "fagforbundet-ks-2026",
    label: "Fagforbundet – sentrale lønnstillegg og garantilønn i KS fra 1. mai 2026",
    href: "https://www.fagforbundet.no/lonn-og-avtaler/ks/?article_id=54057",
    documents: "satser",
  },
  {
    id: "ks-hta-2024-2026",
    label: "KS – Hovedtariffavtalen 2024–2026, vedlegg 1",
    href: "https://www.ks.no/globalassets/fagomrader/lonn-og-tariff/tariff-2024/Hovedtariffavtalen-2024-2026-interactive.pdf",
    documents: "stillingsgruppe",
  },
];

const spekterSources: readonly TariffSource[] = [
  {
    id: "spekter-lo-a2-omrade-10-2026",
    label: "Spekter og LO – A2-protokoll område 10, 2026",
    href: "https://www.fo.no/content/uploads/2026/05/Protokoll-A2-omrade-10-2026-LO.pdf",
    documents: "satser",
  },
  {
    id: "spekter-lo-a2-omrade-13-2026",
    label: "Spekter og LO – A2-protokoll område 13, 2026",
    href: "https://www.fo.no/content/uploads/2026/05/Protokoll-A2-omrade-13-2026-LO.pdf",
    documents: "satser",
  },
  {
    id: "fo-spekter-a2-2026",
    label: "FO – A2-forhandlingene i Spekter 2026",
    href: "https://www.fo.no/nyheter/alt-om-lonnsoppgjoret/a2-forhandlingene-i-spekter-i-mal-lonnsloft-pa-minst-19-000-kroner/",
    documents: "stillingsgruppe",
  },
];

const osloSources: readonly TariffSource[] = [
  {
    id: "oslo-lonnstabell-2026",
    label: "Oslo kommune – lønnstabell per 1. mai 2026",
    href: "https://www.oslo.kommune.no/jobb-i-oslo-kommune/?page=/Lonnstrinn",
    documents: "satser",
  },
  {
    id: "oslo-stillingsregister-2026",
    label: "Oslo kommune – stillingsregister per 1. mai 2026",
    href: "https://www.oslo.kommune.no/get-file/2063470/1822004f222471a57e8ea5360be69c51973ce54ee96d819920105a3e093aa692",
    documents: "stillingsregister",
  },
  {
    id: "oslo-lonnsrammer-2026",
    label: "Oslo kommune – lønnsrammer per 1. mai 2026",
    href: "https://www.oslo.kommune.no/get-file/2063476/3c81594aac52a3fb02313bd00670c117bd651bad1bd2720d0e3b8f82c3fd33a8",
    documents: "lønnsramme",
  },
];

export const VERNEPLEIER_TARIFF_YEAR = 2026;

export const vernepleierTariffAgreements: Readonly<Record<VernepleierTariffAreaId, VernepleierTariffAgreement>> = {
  ks: {
    id: "ks",
    shortLabel: "KS",
    label: "Kommune – KS",
    year: 2026,
    validFrom: "2026-05-01",
    lastUpdated: "2026-09-06",
    rateType: "garantilønn",
    scopeNote: "Garantilønn i HTA kapittel 4. Lokal eller individuell lønn kan være høyere.",
    sources: ksSources,
    positions: [
      {
        id: "vernepleier",
        label: "Vernepleier",
        tariffCode: "6455",
        salaryGroup: "Stillinger med krav om 3-årig U/H-utdanning",
        qualificationNote: "Stillingskode 6455. Vernepleier er innplassert i gruppen for stillinger med krav om 3-årig universitets-/høgskoleutdanning.",
        steps: [
          { seniorityYears: 0, annualSalary: 545_400 },
          { seniorityYears: 6, annualSalary: 558_400 },
          { seniorityYears: 8, annualSalary: 568_600 },
          { seniorityYears: 10, annualSalary: 620_800 },
          { seniorityYears: 16, annualSalary: 639_900 },
        ],
      },
      {
        id: "spesialvernepleier",
        label: "Spesialvernepleier / klinisk vernepleier",
        tariffCode: "7733",
        salaryGroup: "Stillinger med krav om 4-årig U/H-utdanning",
        qualificationNote: "Stillingskode 7733. Det er stillingens formelle utdanningskrav og innplassering som avgjør – videreutdanning alene gir ikke automatisk denne garantilønnen.",
        steps: [
          { seniorityYears: 0, annualSalary: 586_400 },
          { seniorityYears: 6, annualSalary: 601_800 },
          { seniorityYears: 8, annualSalary: 622_000 },
          { seniorityYears: 10, annualSalary: 647_900 },
          { seniorityYears: 16, annualSalary: 673_200 },
        ],
      },
    ],
  },
  spekter: {
    id: "spekter",
    shortLabel: "Spekter helse",
    label: "Helseforetak – Spekter",
    year: 2026,
    validFrom: "2026-05-01",
    lastUpdated: "2026-09-06",
    rateType: "minstelønn",
    scopeNote: "Sentrale A2-satser. Lokale B-deler og lokale forhandlinger kan gi høyere lønn i det enkelte helseforetak.",
    sources: spekterSources,
    positions: [
      {
        id: "spekter-vernepleier",
        label: "Vernepleier",
        tariffCode: "Stillingsgruppe 4",
        salaryGroup: "Stillinger hvor det kreves høyskoleutdanning",
        qualificationNote: "FO oppgir at medlemmene i helseforetakene ligger i stillingsgruppe 4 og 5. Ordinær vernepleier følger gruppe 4 når stillingen krever høyskoleutdanning.",
        steps: [
          { seniorityYears: 0, annualSalary: 522_000 },
          { seniorityYears: 4, annualSalary: 539_000 },
          { seniorityYears: 6, annualSalary: 543_000 },
          { seniorityYears: 8, annualSalary: 567_000 },
          { seniorityYears: 10, annualSalary: 629_000 },
        ],
      },
      {
        id: "spekter-spesialutdanning",
        label: "Vernepleierstilling med spesialutdanning",
        tariffCode: "Stillingsgruppe 5",
        salaryGroup: "Stillinger hvor det kreves høyskoleutdanning med spesialutdanning",
        qualificationNote: "Gruppe 5 gjelder når spesialutdanning er et krav i stillingen. Egen videreutdanning gir ikke automatisk innplassering i gruppe 5.",
        steps: [
          { seniorityYears: 0, annualSalary: 574_000 },
          { seniorityYears: 4, annualSalary: 598_000 },
          { seniorityYears: 6, annualSalary: 609_000 },
          { seniorityYears: 8, annualSalary: 637_000 },
          { seniorityYears: 10, annualSalary: 718_000 },
        ],
      },
    ],
  },
  oslo: {
    id: "oslo",
    shortLabel: "Oslo kommune",
    label: "Oslo kommune",
    year: 2026,
    validFrom: "2026-05-01",
    lastUpdated: "2026-09-06",
    rateType: "tariffestet grunnlønn",
    scopeNote: "Oslo kommune er et eget tariffområde. Tabellen viser lønnstrinnene i kommunens lønnsrammesystem; lokal eller individuell lønn kan være høyere.",
    sources: osloSources,
    positions: [
      {
        id: "oslo-vernepleier",
        label: "Vernepleier",
        tariffCode: "Stillingskode 77 · lønnsramme 1802",
        salaryGroup: "Lønnsramme 1802",
        qualificationNote: "Oslo kommunes stillingsregister plasserer vernepleier i stillingskode 77 og lønnsramme 1802.",
        steps: [
          { seniorityYears: 0, annualSalary: 545_150 },
          { seniorityYears: 1, annualSalary: 545_150 },
          { seniorityYears: 2, annualSalary: 545_150 },
          { seniorityYears: 3, annualSalary: 550_050 },
          { seniorityYears: 4, annualSalary: 550_050 },
          { seniorityYears: 5, annualSalary: 550_050 },
          { seniorityYears: 6, annualSalary: 554_750 },
          { seniorityYears: 7, annualSalary: 559_350 },
          { seniorityYears: 8, annualSalary: 566_600 },
          { seniorityYears: 9, annualSalary: 571_000 },
          { seniorityYears: 10, annualSalary: 576_000 },
          { seniorityYears: 11, annualSalary: 581_200 },
          { seniorityYears: 12, annualSalary: 586_800 },
          { seniorityYears: 13, annualSalary: 592_700 },
          { seniorityYears: 14, annualSalary: 599_100 },
          { seniorityYears: 15, annualSalary: 606_200 },
          { seniorityYears: 16, annualSalary: 614_600 },
        ],
      },
      {
        id: "oslo-vernepleierkonsulent",
        label: "Vernepleierkonsulent",
        tariffCode: "Stillingskode 18 · lønnsramme 5406",
        salaryGroup: "Lønnsramme 5406",
        qualificationNote: "Oslo kommunes stillingsregister har vernepleierkonsulent som egen stillingskode 18 i lønnsramme 5406. Rammen ligger på lønnstrinn 32 ved alle sentrale ansiennitetstrinn.",
        steps: Array.from({ length: 17 }, (_, seniorityYears) => ({ seniorityYears, annualSalary: 614_600 })),
      },
    ],
  },
};

export const vernepleierTariffAreaIds = Object.keys(vernepleierTariffAgreements) as VernepleierTariffAreaId[];
