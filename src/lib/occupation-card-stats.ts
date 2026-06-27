import "server-only";

import { cache } from "react";
import { getStoredDataset } from "@/lib/ssb-store";
import type { SsbNormalizedDataset, SsbObservation } from "@/lib/types";

export type OccupationCardStats = {
  salaryGrowthPercent?: number;
  employeeGrowthPercent?: number;
  averageAge?: number;
  genderPayGapPercent?: number;
};

type SalarySnapshot = {
  latestAll?: number;
  previousAll?: number;
  women?: number;
  men?: number;
};

type EmployeePoint = {
  periodCode: string;
  value: number;
};

type DimensionCodes = {
  occupation?: string;
  gender?: string;
  measure?: string;
  period?: string;
};

export const getOccupationCardStatsByCode = cache(async () => {
  const [latestMedian, previousMedian, workforceTimeSeries, ageTimeSeries] = await Promise.all([
    getStoredDataset("occupationLatestMedian"),
    getStoredDataset("occupationPreviousMedian"),
    getStoredDataset("occupationWorkforceTimeSeries"),
    getStoredDataset("occupationAgeTimeSeries"),
  ]);

  const salarySnapshots = buildSalarySnapshots(latestMedian, previousMedian);
  const employeeGrowthByCode = buildEmployeeGrowthMap(workforceTimeSeries);
  const averageAgeByCode = buildAverageAgeMap(ageTimeSeries);
  const occupationCodes = new Set([
    ...salarySnapshots.keys(),
    ...employeeGrowthByCode.keys(),
    ...averageAgeByCode.keys(),
  ]);

  return Array.from(occupationCodes).reduce((map, occupationCode) => {
    const salary = salarySnapshots.get(occupationCode);
    const stats: OccupationCardStats = {
      salaryGrowthPercent: calculatePercentChange(salary?.latestAll, salary?.previousAll),
      employeeGrowthPercent: employeeGrowthByCode.get(occupationCode),
      averageAge: averageAgeByCode.get(occupationCode),
      genderPayGapPercent: calculateGenderPayGap(salary?.women, salary?.men),
    };

    map.set(occupationCode, stats);
    return map;
  }, new Map<string, OccupationCardStats>());
});

function buildSalarySnapshots(
  latestDataset: SsbNormalizedDataset,
  previousDataset: SsbNormalizedDataset,
) {
  const latestValues = buildMedianValueMap(latestDataset);
  const previousValues = buildMedianValueMap(previousDataset);

  return Array.from(new Set([...latestValues.keys(), ...previousValues.keys()])).reduce(
    (map, occupationCode) => {
      const latest = latestValues.get(occupationCode);
      const previous = previousValues.get(occupationCode);

      map.set(occupationCode, {
        latestAll: latest?.all,
        previousAll: previous?.all,
        women: latest?.women,
        men: latest?.men,
      });

      return map;
    },
    new Map<string, SalarySnapshot>(),
  );
}

function buildMedianValueMap(dataset: SsbNormalizedDataset) {
  const dimensions = getDimensionCodes(dataset, {
    occupation: ["yrke", "occupation"],
    gender: ["kjonn", "kjønn", "sex"],
    measure: ["maalemetode", "målemetode", "measure"],
  });

  if (!dimensions.occupation || !dimensions.gender) {
    return new Map<string, { all?: number; women?: number; men?: number }>();
  }

  return dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const measure = dimensions.measure ? row.dimensions[dimensions.measure] : undefined;

    if (
      !occupation ||
      !gender ||
      !isFourDigitOccupationCode(occupation.code) ||
      row.value === null ||
      (measure && measure.code !== "01")
    ) {
      return map;
    }

    const values = map.get(occupation.code) ?? {};

    if (gender.code === "0") {
      values.all = row.value;
    }

    if (gender.code === "2") {
      values.women = row.value;
    }

    if (gender.code === "1") {
      values.men = row.value;
    }

    map.set(occupation.code, values);
    return map;
  }, new Map<string, { all?: number; women?: number; men?: number }>());
}

function buildEmployeeGrowthMap(dataset: SsbNormalizedDataset) {
  const dimensions = getDimensionCodes(dataset, {
    occupation: ["yrke", "occupation"],
    gender: ["kjonn", "kjønn", "sex"],
    measure: ["contentscode", "contents"],
    period: ["tid", "quarter", "time"],
  });

  if (!dimensions.occupation || !dimensions.gender || !dimensions.measure || !dimensions.period) {
    return new Map<string, number>();
  }

  const pointsByCode = dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const measure = row.dimensions[dimensions.measure as string];
    const period = row.dimensions[dimensions.period as string];

    if (
      !occupation ||
      !gender ||
      !measure ||
      !period ||
      !isFourDigitOccupationCode(occupation.code) ||
      gender.code !== "0" ||
      measure.code !== "Lonsstakere" ||
      row.value === null
    ) {
      return map;
    }

    const points = map.get(occupation.code) ?? [];
    points.push({ periodCode: period.code, value: row.value });
    map.set(occupation.code, points);
    return map;
  }, new Map<string, EmployeePoint[]>());

  return Array.from(pointsByCode.entries()).reduce((map, [occupationCode, points]) => {
    const sortedPoints = points.sort((left, right) =>
      left.periodCode.localeCompare(right.periodCode, "nb-NO"),
    );
    const latestPoint = sortedPoints.at(-1);
    const previousYearPeriodCode = latestPoint
      ? getPreviousYearPeriodCode(latestPoint.periodCode)
      : undefined;
    const previousPoint =
      (previousYearPeriodCode &&
        sortedPoints.find((point) => point.periodCode === previousYearPeriodCode)) ||
      sortedPoints.at(-2);
    const growth = calculatePercentChange(latestPoint?.value, previousPoint?.value);

    if (growth !== undefined) {
      map.set(occupationCode, growth);
    }

    return map;
  }, new Map<string, number>());
}

function buildAverageAgeMap(dataset: SsbNormalizedDataset) {
  const dimensions = getDimensionCodes(dataset, {
    occupation: ["yrke", "occupation"],
    gender: ["kjonn", "kjønn", "sex"],
    period: ["tid", "quarter", "time"],
  });

  if (!dimensions.occupation || !dimensions.gender || !dimensions.period) {
    return new Map<string, number>();
  }

  const pointsByCode = dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const period = row.dimensions[dimensions.period as string];

    if (
      !occupation ||
      !gender ||
      !period ||
      !isFourDigitOccupationCode(occupation.code) ||
      gender.code !== "0" ||
      row.value === null
    ) {
      return map;
    }

    const points = map.get(occupation.code) ?? [];
    points.push({ periodCode: period.code, value: row.value });
    map.set(occupation.code, points);
    return map;
  }, new Map<string, EmployeePoint[]>());

  return Array.from(pointsByCode.entries()).reduce((map, [occupationCode, points]) => {
    const latestPoint = points.sort((left, right) =>
      left.periodCode.localeCompare(right.periodCode, "nb-NO"),
    ).at(-1);

    if (latestPoint) {
      map.set(occupationCode, Math.round(latestPoint.value));
    }

    return map;
  }, new Map<string, number>());
}

function calculatePercentChange(current?: number, previous?: number) {
  if (current === undefined || previous === undefined || previous === 0) {
    return undefined;
  }

  return ((current - previous) / previous) * 100;
}

function calculateGenderPayGap(women?: number, men?: number) {
  if (women === undefined || men === undefined || men === 0) {
    return undefined;
  }

  return (Math.abs(men - women) / men) * 100;
}

function getPreviousYearPeriodCode(periodCode: string) {
  const quarterMatch = periodCode.match(/^(\d{4})K([1-4])$/i);

  if (quarterMatch) {
    return `${Number(quarterMatch[1]) - 1}K${quarterMatch[2]}`;
  }

  const yearMatch = periodCode.match(/^(\d{4})$/);

  if (yearMatch) {
    return `${Number(yearMatch[1]) - 1}`;
  }

  return undefined;
}

function getDimensionCodes(
  dataset: SsbNormalizedDataset,
  candidatesByKey: Partial<Record<keyof DimensionCodes, string[]>>,
) {
  return Object.fromEntries(
    Object.entries(candidatesByKey).map(([key, candidates]) => [
      key,
      findDimensionCode(dataset.rows, dataset.dimensions, candidates),
    ]),
  ) as DimensionCodes;
}

function findDimensionCode(
  rows: SsbObservation[],
  dimensions: string[],
  candidates: string[],
) {
  const normalizedCandidates = candidates.map(normalizeText);

  return dimensions.find((dimensionCode) => {
    const normalizedDimensionCode = normalizeText(dimensionCode);

    if (normalizedCandidates.some((candidate) => normalizedDimensionCode.includes(candidate))) {
      return true;
    }

    const sampleLabel = rows[0]?.dimensions[dimensionCode]?.label;

    if (!sampleLabel) {
      return false;
    }

    const normalizedLabel = normalizeText(sampleLabel);
    return normalizedCandidates.some((candidate) => normalizedLabel.includes(candidate));
  });
}

function isFourDigitOccupationCode(code?: string) {
  return Boolean(code && /^\d{4}$/.test(code) && code !== "0000");
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
