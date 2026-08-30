export type TariffAreaId = "ks" | "spekter" | "oslo";
export type NursingPositionId = "nurse" | "specialist";
export type RateType = "garantilønn" | "minstelønn" | "tariffestet grunnlønn";

export type TariffStep = Readonly<{ seniorityYears: number; annualSalary: number }>;

export type NursingPosition = Readonly<{
  id: NursingPositionId;
  label: string;
  comparisonGroup: NursingPositionId;
  steps: readonly TariffStep[];
}>;

export type TariffAgreement = Readonly<{
  id: TariffAreaId;
  shortLabel: string;
  label: string;
  validFrom: string;
  lastUpdated: string;
  rateType: RateType;
  source: Readonly<{ id: string; label: string; href?: string }>;
  positions: readonly NursingPosition[];
}>;

export const TARIFF_YEAR = 2026;

const tariffs2026: Readonly<Record<TariffAreaId, TariffAgreement>> = {
  ks: {
    id: "ks",
    shortLabel: "KS",
    label: "Kommune – KS",
    validFrom: "2026-05-01",
    lastUpdated: "2026-08-30",
    rateType: "garantilønn",
    source: {
      id: "nsf-ks-2026",
      label: "Norsk Sykepleierforbund – KS",
      href: "https://www.nsf.no/lonn-og-tariff/ks",
    },
    positions: [
      {
        id: "nurse",
        label: "Sykepleier",
        comparisonGroup: "nurse",
        steps: [
          { seniorityYears: 0, annualSalary: 545_400 },
          { seniorityYears: 6, annualSalary: 558_400 },
          { seniorityYears: 8, annualSalary: 568_600 },
          { seniorityYears: 10, annualSalary: 620_800 },
          { seniorityYears: 16, annualSalary: 639_900 },
        ],
      },
      {
        id: "specialist",
        label: "Spesialsykepleier / helsesykepleier",
        comparisonGroup: "specialist",
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
    shortLabel: "Spekter",
    label: "Sykehus – Spekter",
    validFrom: "2026-05-01",
    lastUpdated: "2026-08-30",
    rateType: "minstelønn",
    source: {
      id: "nsf-spekter-2026",
      label: "Norsk Sykepleierforbund – Spekter",
      href: "https://www.nsf.no/lonn-og-tariff/spekter",
    },
    positions: [
      {
        id: "nurse",
        label: "Sykepleier",
        comparisonGroup: "nurse",
        steps: [
          { seniorityYears: 0, annualSalary: 522_000 },
          { seniorityYears: 4, annualSalary: 539_000 },
          { seniorityYears: 6, annualSalary: 543_000 },
          { seniorityYears: 8, annualSalary: 567_000 },
          { seniorityYears: 10, annualSalary: 629_000 },
        ],
      },
      {
        id: "specialist",
        label: "Spesialsykepleier / jordmor",
        comparisonGroup: "specialist",
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
    validFrom: "2026-05-01",
    lastUpdated: "2026-08-30",
    rateType: "tariffestet grunnlønn",
    source: {
      id: "nsf-oslo-2026",
      label: "Norsk Sykepleierforbund – Oslo kommune",
      href: "https://www.nsf.no/lonn-og-tariff/oslo-kommune",
    },
    positions: [
      {
        id: "nurse",
        label: "Sykepleier",
        comparisonGroup: "nurse",
        steps: [
          { seniorityYears: 0, annualSalary: 559_350 },
          { seniorityYears: 1, annualSalary: 566_600 },
          { seniorityYears: 2, annualSalary: 571_000 },
          { seniorityYears: 3, annualSalary: 576_000 },
          { seniorityYears: 4, annualSalary: 576_000 },
          { seniorityYears: 5, annualSalary: 576_000 },
          { seniorityYears: 6, annualSalary: 581_200 },
          { seniorityYears: 7, annualSalary: 586_800 },
          { seniorityYears: 8, annualSalary: 592_700 },
          { seniorityYears: 9, annualSalary: 599_100 },
          { seniorityYears: 10, annualSalary: 606_200 },
          { seniorityYears: 11, annualSalary: 606_200 },
          { seniorityYears: 12, annualSalary: 614_600 },
          { seniorityYears: 13, annualSalary: 623_400 },
          { seniorityYears: 14, annualSalary: 633_200 },
          { seniorityYears: 15, annualSalary: 643_000 },
          { seniorityYears: 16, annualSalary: 654_100 },
        ],
      },
    ],
  },
};

export const nurseTariffsByYear = {
  [TARIFF_YEAR]: tariffs2026,
} as const;

export const tariffAgreements = nurseTariffsByYear[TARIFF_YEAR];
export const tariffAreaIds = Object.keys(tariffAgreements) as TariffAreaId[];
