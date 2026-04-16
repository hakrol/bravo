import type {
  OccupationSalaryDistribution,
  OccupationSalaryTimeSeries,
  SsbNormalizedDataset,
} from "@/lib/types";

export type ApprenticeshipMedianSalaryRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  medianAll?: number;
  medianWomen?: number;
  medianMen?: number;
};

export type ApprenticeshipMedianGrowthRow = ApprenticeshipMedianSalaryRow & {
  growthWomen?: number;
  growthMen?: number;
};

type BuildApprenticeshipOverviewOptions = {
  occupationCodes?: string[];
};

export function buildApprenticeshipMedianSalaryOverview(
  dataset: SsbNormalizedDataset,
  options: BuildApprenticeshipOverviewOptions = {},
) {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);
  const measureDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, [
    "maalemetode",
    "measure",
  ]);
  const periodDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["tid"]);
  const occupationCodes = options.occupationCodes ? new Set(options.occupationCodes) : null;

  if (!occupationDimensionCode || !genderDimensionCode || !measureDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner i SSB-datasettet for lærlinglønn.");
  }

  const rowMap = dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];
    const measure = row.dimensions[measureDimensionCode];

    if (
      !occupation ||
      !gender ||
      !measure ||
      measure.code !== "01" ||
      !isFourDigitOccupationCode(occupation.code) ||
      (occupationCodes && !occupationCodes.has(occupation.code))
    ) {
      return map;
    }

    const existing = map.get(occupation.code) ?? {
      rowKey: occupation.code,
      occupationCode: occupation.code,
      occupationLabel: occupation.label,
    };

    if (row.value !== null) {
      if (gender.code === "0") {
        existing.medianAll = row.value;
      }

      if (gender.code === "2") {
        existing.medianWomen = row.value;
      }

      if (gender.code === "1") {
        existing.medianMen = row.value;
      }
    }

    map.set(occupation.code, existing);
    return map;
  }, new Map<string, ApprenticeshipMedianSalaryRow>());

  return {
    rows: Array.from(rowMap.values()).sort(
      (left, right) => (right.medianAll ?? -1) - (left.medianAll ?? -1),
    ),
    periodLabel: periodDimensionCode
      ? dataset.rows[0]?.dimensions[periodDimensionCode]?.label
      : undefined,
    measureLabel: "Median avtalt månedslønn",
  };
}

export function buildApprenticeshipMedianGrowthOverview(
  latestDataset: SsbNormalizedDataset,
  previousDataset?: SsbNormalizedDataset | null,
  options: BuildApprenticeshipOverviewOptions = {},
) {
  const currentRows = buildMedianValueMap(latestDataset, options);
  const previousRows = previousDataset
    ? buildMedianValueMap(previousDataset, options)
    : new Map<string, ApprenticeshipMedianSalaryRow>();
  const periodDimensionCode = findDimensionCode(latestDataset.dimensions, latestDataset.rows, ["tid"]);

  return {
    rows: Array.from(currentRows.values())
      .map((row) => {
        const previousRow = previousRows.get(row.occupationCode);

        return {
          ...row,
          growthWomen: calculateYearOverYearGrowth(row.medianWomen, previousRow?.medianWomen),
          growthMen: calculateYearOverYearGrowth(row.medianMen, previousRow?.medianMen),
        };
      })
      .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO")),
    periodLabel: periodDimensionCode
      ? latestDataset.rows[0]?.dimensions[periodDimensionCode]?.label
      : undefined,
    measureLabel: "Median avtalt månedslønn",
  };
}

export function buildApprenticeshipSalaryDistribution(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationSalaryDistribution | null {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);
  const measureDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, [
    "maalemetode",
    "measure",
  ]);
  const periodDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["tid"]);

  if (!occupationDimensionCode || !genderDimensionCode || !measureDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner for lærlingfordeling.");
  }

  const rowsByGender = new Map<
    string,
    {
      p25?: number;
      median?: number;
      p75?: number;
      average?: number;
    }
  >();
  let occupationLabel = occupationCode;

  for (const row of dataset.rows) {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];
    const measure = row.dimensions[measureDimensionCode];

    if (
      !occupation ||
      occupation.code !== occupationCode ||
      !gender ||
      !measure ||
      row.value === null
    ) {
      continue;
    }

    occupationLabel = occupation.label;
    const metrics = rowsByGender.get(gender.code) ?? {};

    switch (measure.code) {
      case "051":
        metrics.p25 = row.value;
        break;
      case "01":
        metrics.median = row.value;
        break;
      case "061":
        metrics.p75 = row.value;
        break;
      case "02":
        metrics.average = row.value;
        break;
    }

    rowsByGender.set(gender.code, metrics);
  }

  const distribution: OccupationSalaryDistribution = {
    occupationCode,
    occupationLabel,
    periodLabel: periodDimensionCode
      ? dataset.rows.find((row) => row.dimensions[periodDimensionCode])?.dimensions[periodDimensionCode]?.label
      : undefined,
    updated: dataset.updated,
    total: rowsByGender.get("0"),
    women: rowsByGender.get("2"),
    men: rowsByGender.get("1"),
  };

  return hasAnyDistributionMetrics(distribution.total) ||
    hasAnyDistributionMetrics(distribution.women) ||
    hasAnyDistributionMetrics(distribution.men)
    ? distribution
    : null;
}

export function buildApprenticeshipSalaryTimeSeries(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
  measureLabel = "Median avtalt månedslønn",
): OccupationSalaryTimeSeries {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);
  const periodDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["tid"]);

  if (!occupationDimensionCode || !genderDimensionCode || !periodDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner i lærlingtidsserien.");
  }

  const pointsByPeriod = new Map<
    string,
    {
      periodCode: string;
      periodLabel: string;
      valueAll?: number;
      valueWomen?: number;
      valueMen?: number;
    }
  >();
  let occupationLabel = occupationCode;

  for (const row of dataset.rows) {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];
    const period = row.dimensions[periodDimensionCode];

    if (!occupation || occupation.code !== occupationCode || !gender || !period || row.value === null) {
      continue;
    }

    occupationLabel = occupation.label;
    const existing = pointsByPeriod.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: period.label,
    };

    if (gender.code === "0") {
      existing.valueAll = row.value;
    }

    if (gender.code === "2") {
      existing.valueWomen = row.value;
    }

    if (gender.code === "1") {
      existing.valueMen = row.value;
    }

    pointsByPeriod.set(period.code, existing);
  }

  return {
    occupationCode,
    occupationLabel,
    measureLabel,
    updated: dataset.updated,
    points: Array.from(pointsByPeriod.values()).sort((left, right) =>
      left.periodCode.localeCompare(right.periodCode, "nb-NO"),
    ),
  };
}

function buildMedianValueMap(
  dataset: SsbNormalizedDataset,
  options: BuildApprenticeshipOverviewOptions,
) {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);
  const occupationCodes = options.occupationCodes ? new Set(options.occupationCodes) : null;

  if (!occupationDimensionCode || !genderDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner for lærlingvekst.");
  }

  return dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];

    if (
      !occupation ||
      !gender ||
      !isFourDigitOccupationCode(occupation.code) ||
      (occupationCodes && !occupationCodes.has(occupation.code))
    ) {
      return map;
    }

    const existing = map.get(occupation.code) ?? {
      rowKey: occupation.code,
      occupationCode: occupation.code,
      occupationLabel: occupation.label,
    };

    if (row.value !== null) {
      if (gender.code === "0") {
        existing.medianAll = row.value;
      }

      if (gender.code === "2") {
        existing.medianWomen = row.value;
      }

      if (gender.code === "1") {
        existing.medianMen = row.value;
      }
    }

    map.set(occupation.code, existing);
    return map;
  }, new Map<string, ApprenticeshipMedianSalaryRow>());
}

function hasAnyDistributionMetrics(
  metrics?:
    | OccupationSalaryDistribution["total"]
    | OccupationSalaryDistribution["women"]
    | OccupationSalaryDistribution["men"],
) {
  return Boolean(
    metrics &&
      [metrics.p25, metrics.median, metrics.p75, metrics.average].some((value) =>
        Number.isFinite(value),
      ),
  );
}

function calculateYearOverYearGrowth(current?: number, previous?: number) {
  if (current === undefined || previous === undefined || previous === 0) {
    return undefined;
  }

  return ((current - previous) / previous) * 100;
}

function findDimensionCode(
  dimensions: string[],
  rows: Array<{ dimensions: Record<string, { label: string }> }>,
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

    return normalizedCandidates.some((candidate) =>
      normalizeText(sampleLabel).includes(candidate),
    );
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
