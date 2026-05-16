import { readFileSync } from "node:fs";
import path from "node:path";
import type { SsbNormalizedDataset } from "@/lib/types";

export type WomenShareSpecialRow = {
  rank: number;
  occupationCode: string;
  occupationLabel: string;
  startShare: number;
  endShare: number;
  changePercentagePoints: number;
  startTotal: number;
  endTotal: number;
  startWomen: number;
  endWomen: number;
  totalChange: number;
};

export type WomenShareSpecialData = {
  rows: WomenShareSpecialRow[];
  comparisonRows: WomenShareSpecialRow[];
  startPeriod: string;
  endPeriod: string;
  minimumWorkforce: number;
  source: string;
  tableId: string;
  updated: string;
  totalOccupations: number;
  topFinding: WomenShareSpecialRow;
  lowStartFinding: WomenShareSpecialRow;
  largestWomenGrowth: WomenShareSpecialRow;
};

type WorkforceDraft = {
  occupationCode: string;
  occupationLabel: string;
  period: string;
  total?: number;
  women?: number;
};

const WORKFORCE_FILE_NAME = "occupation-workforce-timeseries.json";
const START_PERIOD = "2016K4";
const MINIMUM_WORKFORCE = 5000;

export function getWomenShareSpecialData(): WomenShareSpecialData {
  const dataset = readGeneratedDataset(WORKFORCE_FILE_NAME);
  const endPeriod = findLatestFourthQuarter(dataset) ?? "2025K4";
  const rowMap = buildWorkforceRowMap(dataset, START_PERIOD, endPeriod);
  const rows = buildRankedRows(rowMap, START_PERIOD, endPeriod, MINIMUM_WORKFORCE);
  const topRows = rows.slice(0, 10);
  const topFinding = topRows[0];
  const lowStartFinding =
    topRows
      .filter((row) => row.startShare < 25)
      .sort((left, right) => right.changePercentagePoints - left.changePercentagePoints)[0] ??
    topFinding;
  const largestWomenGrowth =
    topRows
      .slice()
      .sort(
        (left, right) =>
          right.endWomen - right.startWomen - (left.endWomen - left.startWomen),
      )[0] ??
    topFinding;

  return {
    rows: topRows,
    comparisonRows: rows.slice(0, 16),
    startPeriod: START_PERIOD,
    endPeriod,
    minimumWorkforce: MINIMUM_WORKFORCE,
    source: dataset.source ?? "Statistisk sentralbyrå",
    tableId: dataset.tableId ?? "11658",
    updated: dataset.updated ?? "",
    totalOccupations: rows.length,
    topFinding,
    lowStartFinding,
    largestWomenGrowth,
  };
}

function readGeneratedDataset(fileName: string): SsbNormalizedDataset {
  const filePath = path.join(process.cwd(), "src", "lib", "generated", fileName);
  return JSON.parse(readFileSync(filePath, "utf8")) as SsbNormalizedDataset;
}

function buildWorkforceRowMap(
  dataset: SsbNormalizedDataset,
  startPeriod: string,
  endPeriod: string,
) {
  const rowMap = new Map<string, WorkforceDraft>();
  const acceptedPeriods = new Set([startPeriod, endPeriod]);

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const age = row.dimensions.Alder;
    const content = row.dimensions.ContentsCode;
    const period = row.dimensions.Tid;

    if (
      !occupation ||
      !gender ||
      !age ||
      !content ||
      !period ||
      row.value === null ||
      age.code !== "999D" ||
      content.code !== "Lonsstakere" ||
      !acceptedPeriods.has(period.code) ||
      !isFourDigitOccupationCode(occupation.code)
    ) {
      continue;
    }

    const key = `${occupation.code}|${period.code}`;
    const draft =
      rowMap.get(key) ??
      {
        occupationCode: occupation.code,
        occupationLabel: occupation.label,
        period: period.code,
      };

    if (gender.code === "0") {
      draft.total = row.value;
    }

    if (gender.code === "2") {
      draft.women = row.value;
    }

    rowMap.set(key, draft);
  }

  return rowMap;
}

function buildRankedRows(
  rowMap: Map<string, WorkforceDraft>,
  startPeriod: string,
  endPeriod: string,
  minimumWorkforce: number,
) {
  const rows: WomenShareSpecialRow[] = [];

  for (const endDraft of rowMap.values()) {
    if (endDraft.period !== endPeriod) {
      continue;
    }

    const startDraft = rowMap.get(`${endDraft.occupationCode}|${startPeriod}`);

    if (
      !startDraft?.total ||
      !endDraft.total ||
      startDraft.total < minimumWorkforce ||
      endDraft.total < minimumWorkforce ||
      startDraft.women === undefined ||
      endDraft.women === undefined
    ) {
      continue;
    }

    const startShare = (startDraft.women / startDraft.total) * 100;
    const endShare = (endDraft.women / endDraft.total) * 100;

    rows.push({
      rank: 0,
      occupationCode: endDraft.occupationCode,
      occupationLabel: endDraft.occupationLabel,
      startShare,
      endShare,
      changePercentagePoints: endShare - startShare,
      startTotal: startDraft.total,
      endTotal: endDraft.total,
      startWomen: startDraft.women,
      endWomen: endDraft.women,
      totalChange: endDraft.total - startDraft.total,
    });
  }

  return rows
    .sort((left, right) => right.changePercentagePoints - left.changePercentagePoints)
    .map((row, index) => ({
      ...row,
      rank: index + 1,
    }));
}

function findLatestFourthQuarter(dataset: SsbNormalizedDataset) {
  const periods = new Set<string>();

  for (const row of dataset.rows) {
    const period = row.dimensions.Tid;
    const content = row.dimensions.ContentsCode;

    if (period?.code.endsWith("K4") && content?.code === "Lonsstakere") {
      periods.add(period.code);
    }
  }

  return Array.from(periods).sort(comparePeriodLabels).at(-1);
}

function comparePeriodLabels(left: string, right: string) {
  return left.localeCompare(right, "nb", { numeric: true });
}

function isFourDigitOccupationCode(code?: string) {
  return Boolean(code && /^[0-9]{4}$/.test(code) && code !== "0000");
}
