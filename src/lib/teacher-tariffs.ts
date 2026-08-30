import type {
  TariffAgreementModel,
  TariffPosition,
} from "./tariff-model";

export type TeacherTariffAreaId = "ks";
export type TeacherPositionId =
  | "teacher"
  | "adjunct"
  | "adjunct-additional"
  | "lecturer"
  | "lecturer-additional";

export type TeacherPosition = TariffPosition<TeacherPositionId>;
export type TeacherTariffAgreement = TariffAgreementModel<
  TeacherTariffAreaId,
  TeacherPositionId
>;

export const TEACHER_TARIFF_YEAR = 2026;

export const teacherTariffAgreement: TeacherTariffAgreement = {
  id: "ks",
  shortLabel: "KS",
  label: "Kommuner og fylkeskommuner – KS",
  year: TEACHER_TARIFF_YEAR,
  validFrom: "2026-05-01",
  lastUpdated: "2026-08-30",
  rateType: "garantilønn",
  source: {
    id: "utdanningsforbundet-ks-lonnstabell-2026",
    label: "Utdanningsforbundet – Lønnstabell KS 2026",
    href: "https://www.utdanningsforbundet.no/lonn-og-arbeidsvilkar/tariffavtaler/ks/lonnstabell-ks/",
  },
  positions: [
    {
      id: "teacher",
      label: "Lærer",
      comparisonGroup: "teacher",
      steps: [
        { seniorityYears: 0, annualSalary: 545_400 },
        { seniorityYears: 6, annualSalary: 558_400 },
        { seniorityYears: 8, annualSalary: 568_600 },
        { seniorityYears: 10, annualSalary: 620_800 },
        { seniorityYears: 16, annualSalary: 639_900 },
      ],
    },
    {
      id: "adjunct",
      label: "Adjunkt",
      comparisonGroup: "adjunct",
      steps: [
        { seniorityYears: 0, annualSalary: 586_400 },
        { seniorityYears: 6, annualSalary: 601_800 },
        { seniorityYears: 8, annualSalary: 622_000 },
        { seniorityYears: 10, annualSalary: 647_900 },
        { seniorityYears: 16, annualSalary: 673_200 },
      ],
    },
    {
      id: "adjunct-additional",
      label: "Adjunkt med tilleggsutdanning",
      comparisonGroup: "adjunct-additional",
      steps: [
        { seniorityYears: 0, annualSalary: 624_700 },
        { seniorityYears: 6, annualSalary: 638_900 },
        { seniorityYears: 8, annualSalary: 652_300 },
        { seniorityYears: 10, annualSalary: 686_000 },
        { seniorityYears: 16, annualSalary: 735_300 },
      ],
    },
    {
      id: "lecturer",
      label: "Lektor",
      comparisonGroup: "lecturer",
      steps: [
        { seniorityYears: 0, annualSalary: 655_800 },
        { seniorityYears: 6, annualSalary: 676_700 },
        { seniorityYears: 8, annualSalary: 687_500 },
        { seniorityYears: 10, annualSalary: 723_100 },
        { seniorityYears: 16, annualSalary: 797_500 },
      ],
    },
    {
      id: "lecturer-additional",
      label: "Lektor med tilleggsutdanning",
      comparisonGroup: "lecturer-additional",
      steps: [
        { seniorityYears: 0, annualSalary: 676_200 },
        { seniorityYears: 6, annualSalary: 697_400 },
        { seniorityYears: 8, annualSalary: 711_000 },
        { seniorityYears: 10, annualSalary: 746_600 },
        { seniorityYears: 16, annualSalary: 833_300 },
      ],
    },
  ],
};

export const teacherControlSources = [
  {
    id: "ks-hovedtariffoppgjoret-2026",
    label: "KS – Hovedtariffoppgjøret 2026",
    href: "https://www.ks.no/fagomrader/lonn-og-tariff/tariffoppgjoret-2026/hovedtariffoppgjoret-2026--iverksetting-og-kommentarer/",
  },
  {
    id: "utdanningsforbundet-laerer-lektor-ks",
    label: "Utdanningsforbundet – Dette skal du tjene som lektor i KS",
    href: "https://www.utdanningsforbundet.no/medlemsgrupper/videregaende-opplaring/dette-skal-du-tjene-som-lektor-i-ks/",
  },
  {
    id: "utdanningsforbundet-oslo-2026",
    label: "Utdanningsforbundet – Eget lønnssystem i Oslo kommune",
    href: "https://www.utdanningsforbundet.no/fylkeslag/oslo/nyheter/felles/2026-nyhetssaker/lonnstabell-og-lonnskalkulator-for-oslo-kommune-fra-1.-mai-2026/",
  },
] as const;
