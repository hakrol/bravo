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
  const average = readGeneratedDataset("occupation-latest-average.json");
  const median = readGeneratedDataset("occupation-latest-median.json");
  const workforce = readGeneratedDataset("occupation-workforce-timeseries.json");
  const averageRows = buildSalaryMetricMap(average);
  const medianRows = buildSalaryMetricMap(median);
  const workforceRows = buildLatestWorkforceMap(workforce);

  const rows = Array.from(averageRows.entries())
    .filter(([occupationCode, metric]) => isFourDigitOccupationCode(occupationCode) && metric.all)
    .sort((left, right) => (right[1].all ?? 0) - (left[1].all ?? 0))
    .slice(0, 10)
    .map(([occupationCode, averageMonthlySalary], index) => {
      const occupationLabel = findOccupationLabel(average, occupationCode) ?? occupationCode;
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
        workforce: workforceRows.get(occupationCode),
        intro,
        salaryDrivers: buildSalaryDrivers(occupationLabel),
      };
    });

  return {
    rows,
    periodLabel: findFirstPeriodLabel(average) ?? "siste tilgjengelige periode",
    medianPeriodLabel: findFirstPeriodLabel(median) ?? "siste tilgjengelige periode",
    workforcePeriodLabel: findLatestWorkforcePeriodLabel(workforce),
    source: average.source ?? "Statistisk sentralbyrå",
    updated: average.updated ?? "",
    averageMonthlySalaryAllOccupations: averageRows.get("0-9")?.all,
  };
}

function readGeneratedDataset(fileName: string): SsbNormalizedDataset {
  const filePath = path.join(process.cwd(), "src", "lib", "generated", fileName);
  return JSON.parse(readFileSync(filePath, "utf8")) as SsbNormalizedDataset;
}

function buildSalaryMetricMap(dataset: SsbNormalizedDataset) {
  const rowMap = new Map<string, TopOccupationMetric>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;

    if (!occupation || !gender || row.value === null) {
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
