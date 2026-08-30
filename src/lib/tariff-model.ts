export type RateType = "garantilønn" | "minstelønn" | "tariffestet grunnlønn";

export type TariffStep = Readonly<{
  seniorityYears: number;
  annualSalary: number;
}>;

export type TariffPosition<PositionId extends string> = Readonly<{
  id: PositionId;
  label: string;
  comparisonGroup: PositionId;
  steps: readonly TariffStep[];
}>;

export type TariffAgreementModel<
  TariffAreaId extends string,
  PositionId extends string,
> = Readonly<{
  id: TariffAreaId;
  shortLabel: string;
  label: string;
  year: number;
  validFrom: string;
  lastUpdated: string;
  rateType: RateType;
  source: Readonly<{ id: string; label: string; href?: string }>;
  positions: readonly TariffPosition<PositionId>[];
}>;
