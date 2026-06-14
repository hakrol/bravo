import salaryGrowthSnapshot from "@/content/blog/data/gjennomsnittlig-lonnsvekst-norge-2026.json";

type GrowthRow = {
  label: string;
  salaryGrowth: number;
  inflationGrowth: number;
};

export type SalaryGrowthCalculationInput = {
  startSalary: number;
  currentSalary: number;
  startYear: number;
};

export type SalaryGrowthCalculation = {
  startYear: number;
  endYear: number;
  yearsCalculated: number;
  startSalary: number;
  currentSalary: number;
  nominalChange: number;
  nominalGrowthPercent: number;
  annualNominalGrowthPercent: number;
  inflationGrowthPercent: number;
  realGrowthPercent: number;
  purchasingPowerSalary: number;
  purchasingPowerChange: number;
  hasImprovedPurchasingPower: boolean;
  marketGrowthPercent: number;
  marketSalary: number;
  marketDifference: number;
};

const growthRows = salaryGrowthSnapshot.growthRows satisfies GrowthRow[];

export const salaryGrowthYears = salaryGrowthSnapshot.salaryDevelopment.map((row) =>
  Number(row.label),
);

export const salaryGrowthSource = {
  source: salaryGrowthSnapshot.source,
  period: salaryGrowthSnapshot.period,
  latestPeriod: salaryGrowthSnapshot.metadata.latestPeriod,
  salaryUpdated: salaryGrowthSnapshot.metadata.salaryUpdated,
  inflationUpdated: salaryGrowthSnapshot.metadata.inflationUpdated,
};

export const firstSalaryGrowthYear = Math.min(...salaryGrowthYears);
export const latestSalaryGrowthYear = Math.max(...salaryGrowthYears);

export function calculateSalaryGrowth({
  startSalary,
  currentSalary,
  startYear,
}: SalaryGrowthCalculationInput): SalaryGrowthCalculation | undefined {
  const endYear = latestSalaryGrowthYear;
  const rowsInPeriod = growthRows.filter((row) => {
    const year = Number(row.label);

    return year > startYear && year <= endYear;
  });

  if (
    startSalary <= 0 ||
    currentSalary <= 0 ||
    startYear < firstSalaryGrowthYear ||
    endYear <= startYear ||
    rowsInPeriod.length === 0
  ) {
    return undefined;
  }

  const salaryFactor = currentSalary / startSalary;
  const inflationFactor = rowsInPeriod.reduce(
    (factor, row) => factor * (1 + row.inflationGrowth / 100),
    1,
  );
  const marketFactor = rowsInPeriod.reduce(
    (factor, row) => factor * (1 + row.salaryGrowth / 100),
    1,
  );
  const yearsCalculated = endYear - startYear;
  const purchasingPowerSalary = startSalary * inflationFactor;
  const marketSalary = startSalary * marketFactor;

  return {
    startYear,
    endYear,
    yearsCalculated,
    startSalary,
    currentSalary,
    nominalChange: currentSalary - startSalary,
    nominalGrowthPercent: (salaryFactor - 1) * 100,
    annualNominalGrowthPercent: (salaryFactor ** (1 / yearsCalculated) - 1) * 100,
    inflationGrowthPercent: (inflationFactor - 1) * 100,
    realGrowthPercent: (salaryFactor / inflationFactor - 1) * 100,
    purchasingPowerSalary,
    purchasingPowerChange: currentSalary - purchasingPowerSalary,
    hasImprovedPurchasingPower: currentSalary >= purchasingPowerSalary,
    marketGrowthPercent: (marketFactor - 1) * 100,
    marketSalary,
    marketDifference: currentSalary - marketSalary,
  };
}
