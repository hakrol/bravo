import type { SsbNormalizedDataset } from "@/lib/types";

export type OccupationGroupSalaryRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  salaryAll?: number;
  salaryWomen?: number;
  salaryMen?: number;
};

export type OccupationGroupSalaryOverview = {
  groupRow: OccupationGroupSalaryRow;
  rows: OccupationGroupSalaryRow[];
  periodLabel?: string;
  measureLabel?: string;
};

export function buildOccupationGroupSalaryOverview(
  dataset: SsbNormalizedDataset,
  groupCode: string,
): OccupationGroupSalaryOverview {
  const occupationDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["yrke"]);
  const genderDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["kjonn"]);
  const measureDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["contentscode"]);
  const periodDimensionCode = findDimensionCode(dataset.dimensions, dataset.rows, ["tid"]);

  if (!occupationDimensionCode || !genderDimensionCode) {
    throw new Error("Fant ikke yrkesdimensjon i SSB-datasettet for yrkesfelt.");
  }

  const rowMap = dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];

    if (!occupation || !gender || !belongsToGroup(occupation.code, groupCode)) {
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
  }, new Map<string, OccupationGroupSalaryRow>());

  const groupRow = rowMap.get(groupCode);

  if (!groupRow) {
    throw new Error(`Fant ingen toppnivådata for yrkeskode ${groupCode}.`);
  }

  const rows = Array.from(rowMap.values())
    .filter((row) => isFourDigitOccupationCode(row.occupationCode))
    .sort((left, right) => (right.salaryAll ?? -1) - (left.salaryAll ?? -1));

  const periodLabel = periodDimensionCode
    ? dataset.rows[0]?.dimensions[periodDimensionCode]?.label
    : undefined;
  const measureLabel = measureDimensionCode
    ? dataset.rows[0]?.dimensions[measureDimensionCode]?.label
    : undefined;

  return {
    groupRow,
    rows,
    periodLabel,
    measureLabel: formatMeasureLabel(measureLabel),
  };
}

function belongsToGroup(code: string, groupCode: string) {
  if (code === groupCode) {
    return true;
  }

  return isFourDigitOccupationCode(code) && code.startsWith(groupCode);
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
