import type { SsbNormalizedDataset } from "@/lib/types";

export type OccupationSalaryRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  salaryAll?: number;
  salaryWomen?: number;
  salaryMen?: number;
};

export type OccupationMedianSalaryRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  medianAll?: number;
  medianWomen?: number;
  medianMen?: number;
};

export type OccupationMedianGrowthRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  medianAll?: number;
  medianWomen?: number;
  medianMen?: number;
  growthWomen?: number;
  growthMen?: number;
};

type BuildOccupationSalaryOverviewOptions = {
  occupationCodes?: string[];
};

export function buildOccupationSalaryOverview(
  dataset: SsbNormalizedDataset,
  options: BuildOccupationSalaryOverviewOptions = {},
) {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);
  const measureDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["contentscode"]);
  const periodDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["tid"]);
  const occupationCodes = options.occupationCodes ? new Set(options.occupationCodes) : null;

  if (!occupationDimensionCode || !genderDimensionCode) {
    throw new Error("Fant ikke yrkesdimensjon i SSB-datasettet for tabell 11658.");
  }

  const rowMap = dataset.rows.reduce((map, row) => {
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
        existing.salaryAll = row.value;
      }

      if (gender.code === "2") {
        existing.salaryWomen = row.value;
      }

      if (gender.code === "1") {
        existing.salaryMen = row.value;
      }
    }

    map.set(occupation.code, existing);
    return map;
  }, new Map<string, OccupationSalaryRow>());

  const rows = Array.from(rowMap.values()).sort(
    (left, right) => (right.salaryAll ?? -1) - (left.salaryAll ?? -1),
  );

  const periodLabel = periodDimensionCode
    ? dataset.rows[0]?.dimensions[periodDimensionCode]?.label
    : undefined;
  const averageMonthlySalary = findAverageMonthlySalary(
    dataset.rows,
    occupationDimensionCode,
    genderDimensionCode,
  );
  const measureLabel = measureDimensionCode
    ? dataset.rows[0]?.dimensions[measureDimensionCode]?.label
    : undefined;

  return {
    averageMonthlySalary,
    rows,
    periodLabel,
    measureLabel: formatMeasureLabel(measureLabel),
  };
}

export function buildOccupationMedianSalaryOverview(
  dataset: SsbNormalizedDataset,
  options: BuildOccupationSalaryOverviewOptions = {},
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
    throw new Error("Fant ikke forventede dimensjoner i SSB-datasettet for medianlønn.");
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
  }, new Map<string, OccupationMedianSalaryRow>());

  const rows = Array.from(rowMap.values()).sort(
    (left, right) => (right.medianAll ?? -1) - (left.medianAll ?? -1),
  );

  const periodLabel = periodDimensionCode
    ? dataset.rows[0]?.dimensions[periodDimensionCode]?.label
    : undefined;

  return {
    rows,
    periodLabel,
    measureLabel: "Median avtalt månedslønn",
  };
}

export function buildOccupationMedianGrowthOverview(
  latestDataset: SsbNormalizedDataset,
  previousDataset?: SsbNormalizedDataset | null,
  options: BuildOccupationSalaryOverviewOptions = {},
) {
  const occupationDimensionCode = findDimensionCode(latestDataset.dimensions, latestDataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(latestDataset.dimensions, latestDataset.rows, ["kjonn"]);
  const periodDimensionCode = findDimensionCode(latestDataset.dimensions, latestDataset.rows, ["tid"]);
  const occupationCodes = options.occupationCodes ? new Set(options.occupationCodes) : null;

  if (!occupationDimensionCode || !genderDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner i SSB-datasettet for median basic monthly earnings.");
  }

  const previousValuesByOccupation = previousDataset
    ? buildMedianValueMap(previousDataset, options)
    : new Map<string, OccupationMedianGrowthRow>();

  const rowMap = latestDataset.rows.reduce((map, row) => {
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
  }, new Map<string, OccupationMedianGrowthRow>());

  const rows = Array.from(rowMap.values())
    .map((row) => {
      const previousRow = previousValuesByOccupation.get(row.occupationCode);

      return {
        ...row,
        growthWomen: calculateYearOverYearGrowth(row.medianWomen, previousRow?.medianWomen),
        growthMen: calculateYearOverYearGrowth(row.medianMen, previousRow?.medianMen),
      };
    })
    .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb"));

  const periodLabel = periodDimensionCode
    ? latestDataset.rows[0]?.dimensions[periodDimensionCode]?.label
    : undefined;

  return {
    rows,
    periodLabel,
    measureLabel: "Median avtalt månedslønn",
  };
}

function buildMedianValueMap(
  dataset: SsbNormalizedDataset,
  options: BuildOccupationSalaryOverviewOptions = {},
) {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);
  const occupationCodes = options.occupationCodes ? new Set(options.occupationCodes) : null;

  if (!occupationDimensionCode || !genderDimensionCode) {
    return new Map<string, OccupationMedianGrowthRow>();
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
  }, new Map<string, OccupationMedianGrowthRow>());
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

    const normalizedLabel = normalizeText(sampleLabel);
    return normalizedCandidates.some((candidate) => normalizedLabel.includes(candidate));
  });
}

function findAverageMonthlySalary(
  rows: Array<{ dimensions: Record<string, { code: string; label: string }>; value: number | null }>,
  occupationDimensionCode: string,
  genderDimensionCode: string,
) {
  const aggregateRow = rows.find((row) => {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];
    return occupation?.code === "0000" && gender?.code === "0" && row.value !== null;
  });

  return aggregateRow?.value ?? undefined;
}

function isFourDigitOccupationCode(code?: string) {
  return Boolean(code && /^\d{4}$/.test(code) && code !== "0000");
}

function formatMeasureLabel(label?: string) {
  if (!label) {
    return "Gjennomsnittlig avtalt månedslønn";
  }

  const normalized = normalizeText(label);

  if (normalized.includes("avtalt") && normalized.includes("manedslonn")) {
    return "Gjennomsnittlig avtalt månedslønn";
  }

  if (normalized.includes("manedslonn")) {
    return "Gjennomsnittlig månedslønn";
  }

  return label;
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
