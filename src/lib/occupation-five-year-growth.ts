import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { OccupationSalaryTimeSeries } from "@/lib/types";

const OCCUPATION_DETAIL_VIEW_MODELS_DIR = path.join(
  process.cwd(),
  "src",
  "lib",
  "generated",
  "occupation-detail-view-models",
);
const OCCUPATION_DETAIL_VIEW_MODELS_INDEX_PATH = path.join(
  OCCUPATION_DETAIL_VIEW_MODELS_DIR,
  "index.json",
);

type OccupationDetailViewModelIndex = {
  pages: Array<{
    occupationCode: string;
    fileName: string;
  }>;
};

type OccupationDetailViewModelFile = {
  detailPage: {
    occupationCode: string;
    label: string;
  };
  data: {
    medianBasicSalarySeries: OccupationSalaryTimeSeries;
  };
};

type OccupationSeriesGrowthSnapshot = {
  occupationCode: string;
  occupationLabel: string;
  latestPeriodCode: string;
  latestPeriodLabel: string;
  baselinePeriodCode: string;
  baselinePeriodLabel: string;
  growthAll?: number;
  growthWomen?: number;
  growthMen?: number;
};

export type OccupationFiveYearGrowthComparison = OccupationSeriesGrowthSnapshot & {
  rankAll?: number;
  comparableOccupationCount: number;
  percentile?: number;
};

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

const getOccupationSeriesGrowthSnapshots = cache(async () => {
  const index = await readJsonFile<OccupationDetailViewModelIndex>(
    OCCUPATION_DETAIL_VIEW_MODELS_INDEX_PATH,
  );
  const uniquePages = Array.from(
    new Map(index.pages.map((page) => [page.fileName, page] as const)).values(),
  );
  const files = await Promise.all(
    uniquePages.map((page) =>
      readJsonFile<OccupationDetailViewModelFile>(
        path.join(OCCUPATION_DETAIL_VIEW_MODELS_DIR, page.fileName),
      ),
    ),
  );
  const latestPeriodCode = files
    .flatMap((file) =>
      file.data.medianBasicSalarySeries.points.map((point) =>
        normalizeQuarterPeriodCode(point.periodCode, point.periodLabel),
      ),
    )
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => right.localeCompare(left, "nb-NO"))[0];

  if (!latestPeriodCode) {
    return [];
  }

  const baselinePeriodCode = getPreviousYearsQuarterCode(latestPeriodCode, 5);

  if (!baselinePeriodCode) {
    return [];
  }

  return files.flatMap((file) => {
    const latestPoint = file.data.medianBasicSalarySeries.points.find(
      (point) =>
        normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === latestPeriodCode,
    );
    const baselinePoint = file.data.medianBasicSalarySeries.points.find(
      (point) =>
        normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === baselinePeriodCode,
    );

    if (!latestPoint || !baselinePoint) {
      return [];
    }

    return [
      {
        occupationCode: file.detailPage.occupationCode,
        occupationLabel: file.detailPage.label,
        latestPeriodCode,
        latestPeriodLabel: formatQuarterCodeLabel(latestPeriodCode),
        baselinePeriodCode,
        baselinePeriodLabel: formatQuarterCodeLabel(baselinePeriodCode),
        growthAll: calculateGrowth(baselinePoint.valueAll, latestPoint.valueAll),
        growthWomen: calculateGrowth(baselinePoint.valueWomen, latestPoint.valueWomen),
        growthMen: calculateGrowth(baselinePoint.valueMen, latestPoint.valueMen),
      },
    ];
  });
});

export const getOccupationFiveYearGrowthComparisons = cache(async () => {
  const snapshots = await getOccupationSeriesGrowthSnapshots();
  const rankedSnapshots = snapshots
    .filter((snapshot) => snapshot.growthAll !== undefined)
    .sort((left, right) => (right.growthAll ?? -Infinity) - (left.growthAll ?? -Infinity));
  const comparableOccupationCount = rankedSnapshots.length;
  const ranksByOccupationCode = new Map(
    rankedSnapshots.map((snapshot, index) => [snapshot.occupationCode, index + 1] as const),
  );

  return snapshots.map<OccupationFiveYearGrowthComparison>((snapshot) => {
    const rankAll = ranksByOccupationCode.get(snapshot.occupationCode);

    return {
      ...snapshot,
      rankAll,
      comparableOccupationCount,
      percentile:
        rankAll && comparableOccupationCount > 0
          ? ((comparableOccupationCount - rankAll) / comparableOccupationCount) * 100
          : undefined,
    };
  });
});

export const getOccupationFiveYearGrowthComparison = cache(async (occupationCode: string) => {
  const comparisons = await getOccupationFiveYearGrowthComparisons();
  return comparisons.find((comparison) => comparison.occupationCode === occupationCode) ?? null;
});

function calculateGrowth(previous?: number, latest?: number) {
  if (previous === undefined || latest === undefined || previous === 0) {
    return undefined;
  }

  return ((latest - previous) / previous) * 100;
}

function normalizeQuarterPeriodCode(periodCode: string, periodLabel: string) {
  const match = periodCode.match(/^(\d{4})K([1-4])$/i) ?? periodLabel.match(/(\d{4})\s*K([1-4])/i);

  if (!match) {
    return null;
  }

  return `${match[1]}K${match[2]}`;
}

function getPreviousYearsQuarterCode(periodCode: string, yearsBack: number) {
  const match = periodCode.match(/^(\d{4})K([1-4])$/i);

  if (!match) {
    return null;
  }

  const year = Number(match[1]) - yearsBack;
  const quarter = match[2];
  return `${year}K${quarter}`;
}

function formatQuarterCodeLabel(value: string) {
  const match = value.match(/(\d{4})\s*K([1-4])/i) ?? value.match(/(\d{4})K([1-4])/i);

  if (!match) {
    return value;
  }

  return `${match[2]}. kvartal ${match[1]}`;
}
