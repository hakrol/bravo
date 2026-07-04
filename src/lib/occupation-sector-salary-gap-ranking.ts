import "server-only";

import { cache } from "react";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import { getStoredDataset } from "@/lib/ssb-store";
import type { SsbNormalizedDataset, SsbObservation } from "@/lib/types";

type PublicSectorKey = "municipal" | "state";

export type OccupationSectorSalaryGapComparison = {
  publicSectorKey: PublicSectorKey;
  publicSectorLabel: string;
  privateMedianMonthlySalary: number;
  publicMedianMonthlySalary: number;
  gapAmount: number;
  gapPercent: number;
  highestPaidSector: "private" | "public";
  history: OccupationSectorSalaryGapHistoryPoint[];
};

export type OccupationSectorSalaryGapHistoryPoint = {
  periodLabel: string;
  privateMedianMonthlySalary?: number;
  publicMedianMonthlySalary?: number;
  gapAmount?: number;
  gapPercent?: number;
  highestPaidSector?: "private" | "public";
  hasCompleteData: boolean;
};

export type OccupationSectorSalaryGapRow = {
  rank: number;
  occupationCode: string;
  occupationLabel: string;
  occupationGroupLabel: string;
  occupationGroupHref: string;
  href?: string;
  privateMedianMonthlySalary: number;
  privateWorkRelationCount?: number;
  municipalMedianMonthlySalary?: number;
  municipalWorkRelationCount?: number;
  stateMedianMonthlySalary?: number;
  stateWorkRelationCount?: number;
  topComparison: OccupationSectorSalaryGapComparison;
  comparisons: OccupationSectorSalaryGapComparison[];
  salaryGrowthPercent?: number;
  employeeGrowthPercent?: number;
  averageAge?: number;
};

export type OccupationSectorSalaryGapRanking = {
  rows: OccupationSectorSalaryGapRow[];
  periodLabel?: string;
  source: string;
  updated?: string;
};

type SectorSalaryValues = {
  occupationLabel: string;
  private?: number;
  municipal?: number;
  state?: number;
};

type DimensionCodes = {
  occupation?: string;
  gender?: string;
  measure?: string;
  sector?: string;
  period?: string;
};

const MAX_ROWS = 50;

const publicSectorLabels = {
  municipal: "Kommune",
  state: "Stat",
} as const satisfies Record<PublicSectorKey, string>;

export const getOccupationSectorSalaryGapRanking = cache(
  async (): Promise<OccupationSectorSalaryGapRanking> => {
    const [
      dataset,
      workRelationsDataset,
      occupationIndex,
      occupationCardStatsByCode,
    ] = await Promise.all([
      getStoredDataset("occupationSectorSalaryLatest"),
      getStoredDataset("occupationSectorWorkRelationsLatest"),
      getOccupationDetailViewModelIndex(),
      getOccupationCardStatsByCode(),
    ]);
    const periodLabel = findLatestPeriodLabel(dataset);
    const latestSalariesByCode = buildSectorSalaryMap(dataset, periodLabel);
    const historyByCode = buildSectorSalaryHistoryMap(dataset);
    const workRelationsByCode = buildSectorWorkRelationMap(workRelationsDataset, periodLabel);
    const firstSlugByOccupationCode = new Map<string, string>();

    for (const page of occupationIndex.pages) {
      if (!firstSlugByOccupationCode.has(page.occupationCode)) {
        firstSlugByOccupationCode.set(page.occupationCode, page.slug);
      }
    }

    const rows = Array.from(latestSalariesByCode.entries())
      .flatMap(([occupationCode, values]) => {
        if (values.private === undefined || values.private === 0) {
          return [];
        }

        const comparisons = buildComparisons({
          values,
          history: historyByCode.get(occupationCode),
        });

        if (comparisons.length === 0) {
          return [];
        }

        const topComparison = [...comparisons].sort((left, right) => {
          if (right.gapPercent !== left.gapPercent) {
            return right.gapPercent - left.gapPercent;
          }

          return right.gapAmount - left.gapAmount;
        })[0];

        if (!topComparison) {
          return [];
        }

        const slug = firstSlugByOccupationCode.get(occupationCode);
        const stats = occupationCardStatsByCode.get(occupationCode);
        const occupationGroup = getOccupationGroup(occupationCode);
        const workRelations = workRelationsByCode.get(occupationCode);

        return [
          {
            rank: 0,
            occupationCode,
            occupationLabel: formatOccupationDisplayLabel(values.occupationLabel),
            occupationGroupLabel: occupationGroup.label,
            occupationGroupHref: occupationGroup.href,
            href: slug ? `/yrke/${slug}` : undefined,
            privateMedianMonthlySalary: values.private,
            privateWorkRelationCount: workRelations?.private,
            municipalMedianMonthlySalary: values.municipal,
            municipalWorkRelationCount: workRelations?.municipal,
            stateMedianMonthlySalary: values.state,
            stateWorkRelationCount: workRelations?.state,
            topComparison,
            comparisons,
            salaryGrowthPercent: stats?.salaryGrowthPercent,
            employeeGrowthPercent: stats?.employeeGrowthPercent,
            averageAge: stats?.averageAge,
          },
        ];
      })
      .sort((left, right) => {
        if (right.topComparison.gapPercent !== left.topComparison.gapPercent) {
          return right.topComparison.gapPercent - left.topComparison.gapPercent;
        }

        if (right.topComparison.gapAmount !== left.topComparison.gapAmount) {
          return right.topComparison.gapAmount - left.topComparison.gapAmount;
        }

        return left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO");
      })
      .slice(0, MAX_ROWS)
      .map((row, index) => ({
        ...row,
        rank: index + 1,
      }));

    return {
      rows,
      periodLabel,
      source: "Statistisk sentralbyrå (SSB) tabell 11418",
      updated: dataset.updated,
    };
  },
);

function buildComparisons({
  values,
  history,
}: {
  values: SectorSalaryValues;
  history?: Map<string, SectorSalaryValues>;
}) {
  return (["municipal", "state"] as const).flatMap((publicSectorKey) => {
    const publicMedianMonthlySalary = values[publicSectorKey];

    if (values.private === undefined || publicMedianMonthlySalary === undefined) {
      return [];
    }

    const gapAmount = Math.abs(publicMedianMonthlySalary - values.private);

    return [
      {
        publicSectorKey,
        publicSectorLabel: publicSectorLabels[publicSectorKey],
        privateMedianMonthlySalary: values.private,
        publicMedianMonthlySalary,
        gapAmount,
        gapPercent: getGapPercent(values.private, publicMedianMonthlySalary),
        highestPaidSector: publicMedianMonthlySalary >= values.private ? "public" as const : "private" as const,
        history: buildComparisonHistory(history, publicSectorKey),
      },
    ];
  });
}

function buildComparisonHistory(
  history: Map<string, SectorSalaryValues> | undefined,
  publicSectorKey: PublicSectorKey,
) {
  if (!history) {
    return [];
  }

  return Array.from(history.entries()).map(([periodLabel, values]) => {
    const publicMedianMonthlySalary = values[publicSectorKey];

    if (
      values.private === undefined ||
      values.private === 0 ||
      publicMedianMonthlySalary === undefined
    ) {
      return {
        periodLabel,
        hasCompleteData: false,
      };
    }

    return {
      periodLabel,
      privateMedianMonthlySalary: values.private,
      publicMedianMonthlySalary,
      gapAmount: Math.abs(publicMedianMonthlySalary - values.private),
      gapPercent: getGapPercent(values.private, publicMedianMonthlySalary),
      highestPaidSector: publicMedianMonthlySalary >= values.private ? "public" as const : "private" as const,
      hasCompleteData: true,
    };
  });
}

function buildSectorSalaryMap(dataset: SsbNormalizedDataset, periodLabel?: string) {
  const dimensions = getDimensionCodes(dataset);

  if (!dimensions.occupation || !dimensions.gender || !dimensions.sector) {
    return new Map<string, SectorSalaryValues>();
  }

  return dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const sector = row.dimensions[dimensions.sector as string];
    const measure = dimensions.measure ? row.dimensions[dimensions.measure] : undefined;
    const period = dimensions.period ? row.dimensions[dimensions.period] : undefined;
    const sectorKey = sector ? getSectorKey(sector.code) : null;

    if (
      !occupation ||
      !gender ||
      !sectorKey ||
      !isFourDigitOccupationCode(occupation.code) ||
      row.value === null ||
      gender.code !== "0" ||
      (measure && measure.code !== "01") ||
      (periodLabel && period?.label !== periodLabel)
    ) {
      return map;
    }

    const values = map.get(occupation.code) ?? {
      occupationLabel: occupation.label,
    };

    values[sectorKey] = row.value;
    map.set(occupation.code, values);
    return map;
  }, new Map<string, SectorSalaryValues>());
}

function buildSectorWorkRelationMap(dataset: SsbNormalizedDataset, periodLabel?: string) {
  const dimensions = getDimensionCodes(dataset);

  if (!dimensions.occupation || !dimensions.gender || !dimensions.sector) {
    return new Map<string, SectorSalaryValues>();
  }

  return dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const sector = row.dimensions[dimensions.sector as string];
    const measure = dimensions.measure ? row.dimensions[dimensions.measure] : undefined;
    const period = dimensions.period ? row.dimensions[dimensions.period] : undefined;
    const sectorKey = sector ? getSectorKey(sector.code) : null;

    if (
      !occupation ||
      !gender ||
      !sectorKey ||
      !isFourDigitOccupationCode(occupation.code) ||
      row.value === null ||
      gender.code !== "0" ||
      (measure && measure.code !== "10") ||
      (periodLabel && period?.label !== periodLabel)
    ) {
      return map;
    }

    const values = map.get(occupation.code) ?? {
      occupationLabel: occupation.label,
    };

    values[sectorKey] = row.value;
    map.set(occupation.code, values);
    return map;
  }, new Map<string, SectorSalaryValues>());
}

function buildSectorSalaryHistoryMap(dataset: SsbNormalizedDataset) {
  const dimensions = getDimensionCodes(dataset);

  if (!dimensions.occupation || !dimensions.gender || !dimensions.sector || !dimensions.period) {
    return new Map<string, Map<string, SectorSalaryValues>>();
  }

  const latestPeriodLabels = findLatestPeriodLabels(dataset, 5);
  const selectedPeriods = new Set(latestPeriodLabels);

  return dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const sector = row.dimensions[dimensions.sector as string];
    const measure = dimensions.measure ? row.dimensions[dimensions.measure] : undefined;
    const period = row.dimensions[dimensions.period as string];
    const sectorKey = sector ? getSectorKey(sector.code) : null;

    if (
      !occupation ||
      !gender ||
      !sectorKey ||
      !period ||
      !selectedPeriods.has(period.label) ||
      !isFourDigitOccupationCode(occupation.code) ||
      row.value === null ||
      gender.code !== "0" ||
      (measure && measure.code !== "01")
    ) {
      return map;
    }

    const occupationPeriods = map.get(occupation.code) ?? new Map<string, SectorSalaryValues>();
    const values = occupationPeriods.get(period.label) ?? {
      occupationLabel: occupation.label,
    };

    values[sectorKey] = row.value;
    occupationPeriods.set(period.label, values);
    map.set(occupation.code, occupationPeriods);
    return map;
  }, new Map<string, Map<string, SectorSalaryValues>>());
}

function getSectorKey(sectorCode: string) {
  switch (sectorCode) {
    case "A+B+D+E":
      return "private";
    case "6500":
      return "municipal";
    case "6100":
      return "state";
    default:
      return null;
  }
}

function getGapPercent(privateMedianMonthlySalary: number, publicMedianMonthlySalary: number) {
  return (Math.abs(publicMedianMonthlySalary - privateMedianMonthlySalary) / privateMedianMonthlySalary) * 100;
}

function findLatestPeriodLabels(dataset: SsbNormalizedDataset, count: number) {
  const dimensions = getDimensionCodes(dataset);

  if (!dimensions.period) {
    return [];
  }

  const periods = new Set<string>();

  for (const row of dataset.rows) {
    const period = row.dimensions[dimensions.period];

    if (period?.label) {
      periods.add(period.label);
    }
  }

  return Array.from(periods)
    .sort((left, right) => left.localeCompare(right, "nb-NO", { numeric: true }))
    .slice(-count);
}

function findLatestPeriodLabel(dataset: SsbNormalizedDataset) {
  return findLatestPeriodLabels(dataset, 1)[0];
}

function getDimensionCodes(dataset: SsbNormalizedDataset) {
  return {
    occupation: findDimensionCode(dataset.rows, dataset.dimensions, ["yrke", "occupation"]),
    gender: findDimensionCode(dataset.rows, dataset.dimensions, ["kjonn", "kjønn", "sex"]),
    measure: findDimensionCode(dataset.rows, dataset.dimensions, ["maalemetode", "målemetode", "measure"]),
    sector: findDimensionCode(dataset.rows, dataset.dimensions, ["sektor", "sector"]),
    period: findDimensionCode(dataset.rows, dataset.dimensions, ["tid", "time"]),
  } satisfies DimensionCodes;
}

function findDimensionCode(
  rows: SsbObservation[],
  dimensions: string[],
  candidates: string[] = [],
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

function getOccupationGroup(occupationCode: string) {
  const groupCode = occupationCode.charAt(0);
  const group = getOccupationGroupByCode(groupCode);

  if (group) {
    return {
      label: group.label,
      href: `/yrkesgrupper/${group.slug}`,
    };
  }

  if (groupCode === "0") {
    return {
      label: "Militære yrker",
      href: "/yrkesgrupper",
    };
  }

  if (groupCode === "3") {
    return {
      label: "Høyskoleyrker",
      href: "/yrkesgrupper",
    };
  }

  return {
    label: "Andre yrker",
    href: "/yrkesgrupper",
  };
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
