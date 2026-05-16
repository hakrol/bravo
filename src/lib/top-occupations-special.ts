import { readFileSync } from "node:fs";
import path from "node:path";
import { getOccupationDescription } from "@/lib/occupation-descriptions";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";
import type { SsbNormalizedDataset } from "@/lib/types";

export type TopOccupationMetric = {
  all?: number;
  women?: number;
  men?: number;
};

export type TopOccupationSpecialRow = {
  rank: number;
  occupationCode: string;
  occupationLabel: string;
  href: string | null;
  averageMonthlySalary: TopOccupationMetric;
  medianMonthlySalary: TopOccupationMetric;
  estimatedAnnualSalary: number;
  salaryGrowthPercent?: number;
  realSalaryGrowthPercent?: number;
  workforce?: number;
  intro: string;
  salaryDrivers: string[];
};

export type TopOccupationSpecialData = {
  rows: TopOccupationSpecialRow[];
  periodLabel: string;
  medianPeriodLabel: string;
  workforcePeriodLabel?: string;
  source: string;
  updated: string;
  averageMonthlySalaryAllOccupations?: number;
};

type GenderCode = "0" | "1" | "2";

const highResponsibilityDrivers = [
  "resultatansvar",
  "lederansvar",
  "knapp kompetanse",
  "store beslutninger",
];

const specialistDrivers = [
  "spesialisering",
  "risiko",
  "erfaring",
  "sektor og virksomhetsstørrelse",
];

export function getTopOccupationsSpecialData(): TopOccupationSpecialData {
  const monthlySalary = readGeneratedDataset("occupation-distribution-latest.json");
  const median = readGeneratedDataset("occupation-latest-median.json");
  const workforce = readGeneratedDataset("occupation-workforce-timeseries.json");
  const averageTimeseries = readGeneratedDataset("occupation-average-timeseries.json");
  const inflation = readGeneratedDataset("inflation-quarter-series.json");
  const averageRows = buildMonthlySalaryMetricMap(monthlySalary, "02");
  const medianRows = buildMonthlySalaryMetricMap(median, "01");
  const workforceRows = buildLatestWorkforceMap(workforce);
  const growthRows = buildSalaryGrowthMap(averageTimeseries, inflation);

  const rows = Array.from(averageRows.entries())
    .filter(([occupationCode, metric]) => isFourDigitOccupationCode(occupationCode) && metric.all)
    .sort((left, right) => (right[1].all ?? 0) - (left[1].all ?? 0))
    .slice(0, 10)
    .map(([occupationCode, averageMonthlySalary], index) => {
      const occupationLabel = findOccupationLabel(monthlySalary, occupationCode) ?? occupationCode;
      const intro =
        getOccupationDescription(occupationCode)?.intro ??
        `${occupationLabel} er en yrkesgruppe i SSBs yrkesstatistikk. Lønnsnivået bør tolkes sammen med ansvar, kompetansekrav og hvor mange som er registrert i yrket.`;

      return {
        rank: index + 1,
        occupationCode,
        occupationLabel,
        href: getOccupationDetailHref(occupationCode, occupationLabel),
        averageMonthlySalary,
        medianMonthlySalary: medianRows.get(occupationCode) ?? {},
        estimatedAnnualSalary: (averageMonthlySalary.all ?? 0) * 12,
        salaryGrowthPercent: growthRows.get(occupationCode)?.salaryGrowthPercent,
        realSalaryGrowthPercent: growthRows.get(occupationCode)?.realSalaryGrowthPercent,
        workforce: workforceRows.get(occupationCode),
        intro,
        salaryDrivers: buildSalaryDrivers(occupationLabel),
      };
    });

  return {
    rows,
    periodLabel: findLatestAnnualPeriodLabel(monthlySalary) ?? "siste tilgjengelige periode",
    medianPeriodLabel: findFirstPeriodLabel(median) ?? "siste tilgjengelige periode",
    workforcePeriodLabel: findLatestWorkforcePeriodLabel(workforce),
    source: monthlySalary.source ?? "Statistisk sentralbyrå",
    updated: monthlySalary.updated ?? "",
    averageMonthlySalaryAllOccupations: averageRows.get("0-9")?.all,
  };
}

function buildSalaryGrowthMap(
  salaryDataset: SsbNormalizedDataset,
  inflationDataset: SsbNormalizedDataset,
) {
  const latestPeriod = findLatestSalaryPeriodLabel(salaryDataset);
  const previousPeriod = latestPeriod ? getPreviousYearQuarter(latestPeriod) : undefined;
  const inflationGrowth = latestPeriod && previousPeriod
    ? calculateInflationGrowth(inflationDataset, latestPeriod, previousPeriod)
    : undefined;
  const growthMap = new Map<
    string,
    {
      salaryGrowthPercent?: number;
      realSalaryGrowthPercent?: number;
    }
  >();

  if (!latestPeriod || !previousPeriod) {
    return growthMap;
  }

  const latestValues = buildPeriodSalaryValueMap(salaryDataset, latestPeriod);
  const previousValues = buildPeriodSalaryValueMap(salaryDataset, previousPeriod);

  for (const [occupationCode, latestValue] of latestValues.entries()) {
    const previousValue = previousValues.get(occupationCode);

    if (!previousValue || previousValue === 0) {
      continue;
    }

    const salaryGrowthPercent = ((latestValue - previousValue) / previousValue) * 100;
    const realSalaryGrowthPercent =
      inflationGrowth === undefined
        ? undefined
        : (((1 + salaryGrowthPercent / 100) / (1 + inflationGrowth / 100)) - 1) * 100;

    growthMap.set(occupationCode, {
      salaryGrowthPercent,
      realSalaryGrowthPercent,
    });
  }

  return growthMap;
}

function buildPeriodSalaryValueMap(dataset: SsbNormalizedDataset, periodLabel: string) {
  const valueMap = new Map<string, number>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const period = row.dimensions.Tid;

    if (
      !occupation ||
      !gender ||
      !period ||
      row.value === null ||
      gender.code !== "0" ||
      period.label !== periodLabel ||
      !isFourDigitOccupationCode(occupation.code)
    ) {
      continue;
    }

    valueMap.set(occupation.code, row.value);
  }

  return valueMap;
}

function findLatestSalaryPeriodLabel(dataset: SsbNormalizedDataset) {
  const periods = new Set<string>();

  for (const row of dataset.rows) {
    const period = row.dimensions.Tid;

    if (period?.label) {
      periods.add(period.label);
    }
  }

  return Array.from(periods).sort(comparePeriodLabels).at(-1);
}

function findLatestAnnualPeriodLabel(dataset: SsbNormalizedDataset) {
  const periods = new Set<string>();

  for (const row of dataset.rows) {
    const period = row.dimensions.Tid;

    if (period?.label) {
      periods.add(period.label);
    }
  }

  return Array.from(periods).sort(comparePeriodLabels).at(-1);
}

function getPreviousYearQuarter(periodLabel: string) {
  const match = periodLabel.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return undefined;
  }

  return `${Number(match[1]) - 1}K${match[2]}`;
}

function calculateInflationGrowth(
  dataset: SsbNormalizedDataset,
  latestQuarter: string,
  previousQuarter: string,
) {
  const latestMonth = quarterToMonth(latestQuarter);
  const previousMonth = quarterToMonth(previousQuarter);

  if (!latestMonth || !previousMonth) {
    return undefined;
  }

  const latestValue = findInflationValue(dataset, latestMonth);
  const previousValue = findInflationValue(dataset, previousMonth);

  if (!latestValue || !previousValue) {
    return undefined;
  }

  return ((latestValue - previousValue) / previousValue) * 100;
}

function quarterToMonth(periodLabel: string) {
  const match = periodLabel.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return undefined;
  }

  const monthByQuarter: Record<string, string> = {
    "1": "03",
    "2": "06",
    "3": "09",
    "4": "12",
  };

  return `${match[1]}M${monthByQuarter[match[2]]}`;
}

function findInflationValue(dataset: SsbNormalizedDataset, monthLabel: string) {
  return dataset.rows.find((row) => row.dimensions.Tid?.label === monthLabel)?.value ?? undefined;
}

function readGeneratedDataset(fileName: string): SsbNormalizedDataset {
  const filePath = path.join(process.cwd(), "src", "lib", "generated", fileName);
  return JSON.parse(readFileSync(filePath, "utf8")) as SsbNormalizedDataset;
}

function buildMonthlySalaryMetricMap(dataset: SsbNormalizedDataset, measureCode: "01" | "02") {
  const latestPeriod = findLatestAnnualPeriodLabel(dataset);
  const rowMap = new Map<string, TopOccupationMetric>();

  if (!latestPeriod) {
    return rowMap;
  }

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const period = row.dimensions.Tid;
    const measure = row.dimensions.MaaleMetode;
    const content = row.dimensions.ContentsCode;
    const sector = row.dimensions.Sektor;
    const workingTime = row.dimensions.AvtaltVanlig;

    if (
      !occupation ||
      !gender ||
      !period ||
      row.value === null ||
      period.label !== latestPeriod ||
      measure?.code !== measureCode ||
      content?.code !== "Manedslonn" ||
      sector?.code !== "ALLE" ||
      workingTime?.code !== "0"
    ) {
      continue;
    }

    const metric = rowMap.get(occupation.code) ?? {};

    assignGenderValue(metric, gender.code as GenderCode, row.value);
    rowMap.set(occupation.code, metric);
  }

  return rowMap;
}

function buildLatestWorkforceMap(dataset: SsbNormalizedDataset) {
  const latestPeriod = findLatestWorkforcePeriodLabel(dataset);
  const rowMap = new Map<string, number>();

  if (!latestPeriod) {
    return rowMap;
  }

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const content = row.dimensions.ContentsCode;
    const period = row.dimensions.Tid;

    if (
      !occupation ||
      !gender ||
      !content ||
      !period ||
      row.value === null ||
      gender.code !== "0" ||
      content.code !== "Lonsstakere" ||
      period.label !== latestPeriod ||
      !isFourDigitOccupationCode(occupation.code)
    ) {
      continue;
    }

    rowMap.set(occupation.code, row.value);
  }

  return rowMap;
}

function assignGenderValue(metric: TopOccupationMetric, genderCode: GenderCode, value: number) {
  if (genderCode === "0") {
    metric.all = value;
  }

  if (genderCode === "1") {
    metric.men = value;
  }

  if (genderCode === "2") {
    metric.women = value;
  }
}

function findOccupationLabel(dataset: SsbNormalizedDataset, occupationCode: string) {
  return dataset.rows.find((row) => row.dimensions.Yrke?.code === occupationCode)?.dimensions.Yrke
    ?.label;
}

function findFirstPeriodLabel(dataset: SsbNormalizedDataset) {
  return dataset.rows[0]?.dimensions.Tid?.label;
}

function findLatestWorkforcePeriodLabel(dataset: SsbNormalizedDataset) {
  const periods = new Set<string>();

  for (const row of dataset.rows) {
    const content = row.dimensions.ContentsCode;
    const period = row.dimensions.Tid;

    if (content?.code === "Lonsstakere" && period?.label) {
      periods.add(period.label);
    }
  }

  return Array.from(periods).sort(comparePeriodLabels).at(-1);
}

function comparePeriodLabels(left: string, right: string) {
  return left.localeCompare(right, "nb", { numeric: true });
}

function isFourDigitOccupationCode(code?: string) {
  return Boolean(code && /^\d{4}$/.test(code) && code !== "0000");
}

function buildSalaryDrivers(label: string) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("leder") || normalizedLabel.includes("direktør")) {
    return highResponsibilityDrivers;
  }

  return specialistDrivers;
}
