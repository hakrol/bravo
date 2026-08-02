import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { OccupationSalaryTimeSeries } from "@/lib/types";

const VIEW_MODELS_DIR = path.join(
  process.cwd(),
  "src",
  "lib",
  "generated",
  "occupation-detail-view-models",
);

type ViewModelIndex = {
  generatedAt?: string;
  pages: Array<{
    occupationCode: string;
    fileName: string;
  }>;
};

type RankingViewModel = {
  detailPage: {
    occupationCode: string;
    label: string;
    slug: string;
    href: string;
  };
  data: {
    distribution?: {
      periodLabel?: string;
      updated?: string;
      total?: {
        median?: number;
      };
    } | null;
    medianBasicSalarySeries: OccupationSalaryTimeSeries;
    supplementAverage?: {
      periodLabel?: string;
      updated?: string;
      total?: {
        bonus?: number;
      };
    } | null;
    laborMarketStats?: {
      latest?: {
        periodLabel?: string;
        employees?: number;
        updated?: string;
      } | null;
      age?: {
        periodLabel?: string;
        averageAll?: number;
        updated?: string;
      } | null;
    } | null;
  };
};

export type OccupationRankingRow = {
  rank: number;
  occupationCode: string;
  occupationLabel: string;
  href: string;
  medianMonthlySalary?: number;
  salaryGrowthPercent?: number;
  latestSalary?: number;
  previousSalary?: number;
  averageMonthlyBonus?: number;
  averageAge?: number;
  employeeCount?: number;
};

export type OccupationRankingData = {
  salaryRows: OccupationRankingRow[];
  growthRows: OccupationRankingRow[];
  bonusRows: OccupationRankingRow[];
  oldestAgeRows: OccupationRankingRow[];
  youngestAgeRows: OccupationRankingRow[];
  employeeRows: OccupationRankingRow[];
  salaryPeriodLabel: string;
  growthLatestPeriodLabel: string;
  growthPreviousPeriodLabel: string;
  bonusPeriodLabel: string;
  agePeriodLabel: string;
  employeePeriodLabel: string;
  source: string;
  updated?: string;
};

export type OccupationHeroRankings = {
  salaryRank?: number;
  salaryGrowthRank?: number;
  averageBonusRank?: number;
  oldestAverageAgeRank?: number;
  youngestAverageAgeRank?: number;
  employeeCountRank?: number;
};

async function readJson<T>(filePath: string) {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

export const getOccupationRankingData = cache(async (): Promise<OccupationRankingData> => {
  const index = await readJson<ViewModelIndex>(path.join(VIEW_MODELS_DIR, "index.json"));
  const uniqueFiles = Array.from(
    new Map(index.pages.map((page) => [page.fileName, page] as const)).values(),
  );
  const viewModels = await Promise.all(
    uniqueFiles.map((page) =>
      readJson<RankingViewModel>(path.join(VIEW_MODELS_DIR, page.fileName)),
    ),
  );
  const latestGrowthPeriodCode = findLatestPeriodCode(viewModels);
  const previousGrowthPeriodCode = latestGrowthPeriodCode
    ? getPreviousYearPeriodCode(latestGrowthPeriodCode)
    : undefined;
  const salaryRows = rankRows(
    viewModels.flatMap((viewModel) => {
      const medianMonthlySalary = viewModel.data.distribution?.total?.median;

      if (!isFourDigitOccupationCode(viewModel.detailPage.occupationCode) ||
          !isPositiveNumber(medianMonthlySalary)) {
        return [];
      }

      return [{
        rank: 0,
        occupationCode: viewModel.detailPage.occupationCode,
        occupationLabel: viewModel.detailPage.label,
        href: viewModel.detailPage.href || `/yrke/${viewModel.detailPage.slug}`,
        medianMonthlySalary,
      }];
    }),
    (row) => row.medianMonthlySalary,
  );
  const growthRows = rankRows(
    viewModels.flatMap((viewModel) => {
      if (!latestGrowthPeriodCode ||
          !previousGrowthPeriodCode ||
          !isFourDigitOccupationCode(viewModel.detailPage.occupationCode)) {
        return [];
      }

      const latestPoint = viewModel.data.medianBasicSalarySeries.points.find(
        (point) => normalizePeriodCode(point.periodCode, point.periodLabel) === latestGrowthPeriodCode,
      );
      const previousPoint = viewModel.data.medianBasicSalarySeries.points.find(
        (point) => normalizePeriodCode(point.periodCode, point.periodLabel) === previousGrowthPeriodCode,
      );
      const latestSalary = latestPoint?.valueAll;
      const previousSalary = previousPoint?.valueAll;

      if (!isPositiveNumber(latestSalary) || !isPositiveNumber(previousSalary)) {
        return [];
      }

      return [{
        rank: 0,
        occupationCode: viewModel.detailPage.occupationCode,
        occupationLabel: viewModel.detailPage.label,
        href: viewModel.detailPage.href || `/yrke/${viewModel.detailPage.slug}`,
        latestSalary,
        previousSalary,
        salaryGrowthPercent: ((latestSalary - previousSalary) / previousSalary) * 100,
      }];
    }),
    (row) => row.salaryGrowthPercent,
  );
  const bonusRows = rankRows(
    viewModels.flatMap((viewModel) => {
      const averageMonthlyBonus = viewModel.data.supplementAverage?.total?.bonus;

      if (!isFourDigitOccupationCode(viewModel.detailPage.occupationCode) ||
          !isPositiveNumber(averageMonthlyBonus)) {
        return [];
      }

      return [{
        rank: 0,
        occupationCode: viewModel.detailPage.occupationCode,
        occupationLabel: viewModel.detailPage.label,
        href: viewModel.detailPage.href || `/yrke/${viewModel.detailPage.slug}`,
        averageMonthlyBonus,
      }];
    }),
    (row) => row.averageMonthlyBonus,
  );
  const latestAgePeriodCode = findLatestAgePeriodCode(viewModels);
  const ageRows = viewModels.flatMap((viewModel) => {
    const age = viewModel.data.laborMarketStats?.age;

    if (!latestAgePeriodCode ||
        normalizePeriodCode(age?.periodLabel ?? "", age?.periodLabel ?? "") !== latestAgePeriodCode ||
        !isFourDigitOccupationCode(viewModel.detailPage.occupationCode) ||
        !isPositiveNumber(age?.averageAll)) {
      return [];
    }

    return [{
      rank: 0,
      occupationCode: viewModel.detailPage.occupationCode,
      occupationLabel: viewModel.detailPage.label,
      href: viewModel.detailPage.href || `/yrke/${viewModel.detailPage.slug}`,
      averageAge: age.averageAll,
    }];
  });
  const oldestAgeRows = rankRows(ageRows, (row) => row.averageAge);
  const youngestAgeRows = rankRows(ageRows, (row) => row.averageAge, "ascending");
  const latestEmployeePeriodCode = findLatestEmployeePeriodCode(viewModels);
  const employeeRows = rankRows(
    viewModels.flatMap((viewModel) => {
      const latest = viewModel.data.laborMarketStats?.latest;

      if (!latestEmployeePeriodCode ||
          normalizePeriodCode(latest?.periodLabel ?? "", latest?.periodLabel ?? "") !== latestEmployeePeriodCode ||
          !isFourDigitOccupationCode(viewModel.detailPage.occupationCode) ||
          !isPositiveNumber(latest?.employees)) {
        return [];
      }

      return [{
        rank: 0,
        occupationCode: viewModel.detailPage.occupationCode,
        occupationLabel: viewModel.detailPage.label,
        href: viewModel.detailPage.href || `/yrke/${viewModel.detailPage.slug}`,
        employeeCount: latest.employees,
      }];
    }),
    (row) => row.employeeCount,
  );
  const firstDistribution = viewModels.find(
    (viewModel) => viewModel.data.distribution?.periodLabel,
  )?.data.distribution;

  return {
    salaryRows,
    growthRows,
    bonusRows,
    oldestAgeRows,
    youngestAgeRows,
    employeeRows,
    salaryPeriodLabel: firstDistribution?.periodLabel ?? "siste tilgjengelige periode",
    growthLatestPeriodLabel: formatPeriodLabel(latestGrowthPeriodCode),
    growthPreviousPeriodLabel: formatPeriodLabel(previousGrowthPeriodCode),
    bonusPeriodLabel: viewModels.find((viewModel) => viewModel.data.supplementAverage?.periodLabel)
      ?.data.supplementAverage?.periodLabel ?? "siste tilgjengelige periode",
    agePeriodLabel: formatPeriodLabel(latestAgePeriodCode),
    employeePeriodLabel: formatPeriodLabel(latestEmployeePeriodCode),
    source: "Statistisk sentralbyrå (SSB)",
    updated: firstDistribution?.updated ?? index.generatedAt,
  };
});

export async function getOccupationHeroRankings(
  occupationCode: string,
): Promise<OccupationHeroRankings> {
  const rankings = await getOccupationRankingData();

  return {
    salaryRank: rankings.salaryRows.find((row) => row.occupationCode === occupationCode)?.rank,
    salaryGrowthRank: rankings.growthRows.find((row) => row.occupationCode === occupationCode)?.rank,
    averageBonusRank: rankings.bonusRows.find((row) => row.occupationCode === occupationCode)?.rank,
    oldestAverageAgeRank: rankings.oldestAgeRows.find(
      (row) => row.occupationCode === occupationCode,
    )?.rank,
    youngestAverageAgeRank: rankings.youngestAgeRows.find(
      (row) => row.occupationCode === occupationCode,
    )?.rank,
    employeeCountRank: rankings.employeeRows.find(
      (row) => row.occupationCode === occupationCode,
    )?.rank,
  };
}

function rankRows(
  rows: OccupationRankingRow[],
  getValue: (row: OccupationRankingRow) => number | undefined,
  direction: "ascending" | "descending" = "descending",
) {
  return rows
    .toSorted((left, right) => {
      const leftValue = getValue(left);
      const rightValue = getValue(right);
      const difference = direction === "ascending"
        ? (leftValue ?? Number.POSITIVE_INFINITY) - (rightValue ?? Number.POSITIVE_INFINITY)
        : (rightValue ?? Number.NEGATIVE_INFINITY) - (leftValue ?? Number.NEGATIVE_INFINITY);

      return difference || left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO");
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function findLatestAgePeriodCode(viewModels: RankingViewModel[]) {
  return viewModels
    .map((viewModel) => viewModel.data.laborMarketStats?.age?.periodLabel)
    .filter((value): value is string => Boolean(value))
    .map((value) => normalizePeriodCode(value, value))
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => left.localeCompare(right, "nb-NO", { numeric: true }))
    .at(-1);
}

function findLatestEmployeePeriodCode(viewModels: RankingViewModel[]) {
  return viewModels
    .map((viewModel) => viewModel.data.laborMarketStats?.latest?.periodLabel)
    .filter((value): value is string => Boolean(value))
    .map((value) => normalizePeriodCode(value, value))
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => left.localeCompare(right, "nb-NO", { numeric: true }))
    .at(-1);
}

function findLatestPeriodCode(viewModels: RankingViewModel[]) {
  return viewModels
    .flatMap((viewModel) => viewModel.data.medianBasicSalarySeries.points)
    .map((point) => normalizePeriodCode(point.periodCode, point.periodLabel))
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => left.localeCompare(right, "nb-NO", { numeric: true }))
    .at(-1);
}

function normalizePeriodCode(periodCode: string, periodLabel: string) {
  const value = periodCode || periodLabel;
  const annualMatch = value.match(/^(\d{4})$/);

  if (annualMatch) {
    return annualMatch[1];
  }

  const quarterMatch = value.match(/^(\d{4})K([1-4])$/i);
  return quarterMatch ? `${quarterMatch[1]}K${quarterMatch[2]}` : undefined;
}

function getPreviousYearPeriodCode(periodCode: string) {
  const annualMatch = periodCode.match(/^(\d{4})$/);

  if (annualMatch) {
    return `${Number(annualMatch[1]) - 1}`;
  }

  const quarterMatch = periodCode.match(/^(\d{4})K([1-4])$/i);
  return quarterMatch ? `${Number(quarterMatch[1]) - 1}K${quarterMatch[2]}` : undefined;
}

function formatPeriodLabel(periodCode?: string) {
  if (!periodCode) {
    return "siste tilgjengelige periode";
  }

  const quarterMatch = periodCode.match(/^(\d{4})K([1-4])$/i);
  return quarterMatch ? `${quarterMatch[2]}. kvartal ${quarterMatch[1]}` : periodCode;
}

function isFourDigitOccupationCode(code: string) {
  return /^\d{4}$/.test(code) && code !== "0000";
}

function isPositiveNumber(value?: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
