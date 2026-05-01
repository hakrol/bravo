import type { LonnsjekkOccupationOption } from "@/lib/lonnsjekk";
import type { OccupationLaborMarketStats, OccupationPurchasingPowerTimeSeries } from "@/lib/ssb";

export type OccupationComparisonGender = "all" | "men" | "women";

export type OccupationComparisonOption = Pick<
  LonnsjekkOccupationOption,
  | "occupationCode"
  | "occupationLabel"
  | "groupCode"
  | "groupLabel"
  | "href"
  | "medianSalaryAll"
  | "medianSalaryWomen"
  | "medianSalaryMen"
>;

export type OccupationComparisonPageData = {
  options: OccupationComparisonOption[];
  periodLabel?: string;
  updated?: string;
};

export type OccupationComparisonInsights = {
  occupationCode: string;
  age: {
    all?: number;
    women?: number;
    men?: number;
    periodLabel?: string;
  } | null;
  workforce: {
    all?: number;
    women?: number;
    men?: number;
    periodLabel?: string;
    unit: string;
  } | null;
  realGrowth: {
    all?: number;
    women?: number;
    men?: number;
    periodLabel?: string;
  } | null;
};

export function buildOccupationComparisonPageData(input: {
  options: LonnsjekkOccupationOption[];
  periodLabel?: string;
  updated?: string;
}): OccupationComparisonPageData {
  return {
    options: input.options.map((option) => ({
      occupationCode: option.occupationCode,
      occupationLabel: option.occupationLabel,
      groupCode: option.groupCode,
      groupLabel: option.groupLabel,
      href: option.href,
      medianSalaryAll: option.medianSalaryAll,
      medianSalaryWomen: option.medianSalaryWomen,
      medianSalaryMen: option.medianSalaryMen,
    })),
    periodLabel: input.periodLabel,
    updated: input.updated,
  };
}

export function buildOccupationComparisonInsights(input: {
  occupationCode: string;
  laborMarketStats: OccupationLaborMarketStats | null;
  purchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
}): OccupationComparisonInsights {
  const latestWorkforcePoint = input.laborMarketStats?.workforcePoints.at(-1);
  const latestPurchasingPowerPoint = input.purchasingPowerSeries.points.at(-1);

  return {
    occupationCode: input.occupationCode,
    age: input.laborMarketStats?.age
      ? {
          all: input.laborMarketStats.age.averageAll,
          women: input.laborMarketStats.age.averageWomen,
          men: input.laborMarketStats.age.averageMen,
          periodLabel: input.laborMarketStats.age.periodLabel,
        }
      : null,
    workforce: latestWorkforcePoint
      ? {
          all: latestWorkforcePoint.employeesAll,
          women: latestWorkforcePoint.employeesWomen,
          men: latestWorkforcePoint.employeesMen,
          periodLabel: latestWorkforcePoint.periodLabel,
          unit: input.laborMarketStats?.employeeUnit ?? "personer",
        }
      : null,
    realGrowth: latestPurchasingPowerPoint
      ? {
          all: latestPurchasingPowerPoint.realGrowthAll,
          women: latestPurchasingPowerPoint.realGrowthWomen,
          men: latestPurchasingPowerPoint.realGrowthMen,
          periodLabel: latestPurchasingPowerPoint.periodLabel,
        }
      : null,
  };
}

export function pickComparisonGenderValue(
  values:
    | {
        all?: number;
        women?: number;
        men?: number;
      }
    | null
    | undefined,
  gender: OccupationComparisonGender,
) {
  if (!values) {
    return undefined;
  }

  if (gender === "women") {
    return values.women ?? values.all;
  }

  if (gender === "men") {
    return values.men ?? values.all;
  }

  return values.all;
}
