import type { SsbNormalizedDataset } from "@/lib/types";

export type OccupationSalaryRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  salaryAll?: number;
  salaryWomen?: number;
  salaryMen?: number;
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
    return "Gjennomsnittlig avtalt manedslonn";
  }

  const normalized = normalizeText(label);

  if (normalized.includes("avtalt") && normalized.includes("manedslonn")) {
    return "Gjennomsnittlig avtalt manedslonn";
  }

  if (normalized.includes("manedslonn")) {
    return "Gjennomsnittlig manedslonn";
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
