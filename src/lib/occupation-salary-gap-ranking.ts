import "server-only";

import { cache } from "react";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getOccupationCardStatsByCode } from "@/lib/occupation-card-stats";
import { getOccupationGroupByCode } from "@/lib/occupation-groups";
import { getStoredDataset } from "@/lib/ssb-store";
import type { SsbNormalizedDataset, SsbObservation } from "@/lib/types";

export type OccupationSalaryGapRow = {
  rank: number;
  occupationCode: string;
  occupationLabel: string;
  occupationGroupLabel: string;
  occupationGroupHref: string;
  href?: string;
  menMedianMonthlySalary: number;
  womenMedianMonthlySalary: number;
  gapAmount: number;
  gapPercent: number;
  highestPaidGender: "men" | "women";
  salaryGrowthPercent?: number;
  employeeGrowthPercent?: number;
  averageAge?: number;
  salaryGapHistory: OccupationSalaryGapHistoryPoint[];
};

export type OccupationSalaryGapHistoryPoint = {
  periodLabel: string;
  menMedianMonthlySalary?: number;
  womenMedianMonthlySalary?: number;
  gapAmount?: number;
  gapPercent?: number;
  highestPaidGender?: "men" | "women";
  hasCompleteData: boolean;
};

export type OccupationSalaryGapRanking = {
  rows: OccupationSalaryGapRow[];
  periodLabel?: string;
  source: string;
  updated?: string;
};

type SalaryValues = {
  occupationLabel: string;
  men?: number;
  women?: number;
};

type DimensionCodes = {
  occupation?: string;
  gender?: string;
  measure?: string;
  period?: string;
};

const MAX_ROWS = 50;

export const getOccupationSalaryGapRanking = cache(
  async (): Promise<OccupationSalaryGapRanking> => {
    const [dataset, timeSeriesDataset, occupationIndex, occupationCardStatsByCode] =
      await Promise.all([
      getStoredDataset("occupationLatestMedian"),
      getStoredDataset("occupationMedianTimeSeries"),
      getOccupationDetailViewModelIndex(),
      getOccupationCardStatsByCode(),
    ]);
    const periodLabel = findLatestPeriodLabel(dataset);
    const salariesByCode = buildMedianSalaryMap(dataset, periodLabel);
    const salaryGapHistoryByCode = buildSalaryGapHistoryMap(timeSeriesDataset);
    const firstSlugByOccupationCode = new Map<string, string>();

    for (const page of occupationIndex.pages) {
      if (!firstSlugByOccupationCode.has(page.occupationCode)) {
        firstSlugByOccupationCode.set(page.occupationCode, page.slug);
      }
    }

    const rows = Array.from(salariesByCode.entries())
      .flatMap(([occupationCode, values]) => {
        if (values.men === undefined || values.women === undefined || values.men === 0) {
          return [];
        }

        const gapAmount = Math.abs(values.men - values.women);
        const gapPercent = getGapPercent(values.men, values.women);
        const slug = firstSlugByOccupationCode.get(occupationCode);
        const stats = occupationCardStatsByCode.get(occupationCode);
        const occupationGroup = getOccupationGroup(occupationCode);

        return [
          {
            rank: 0,
            occupationCode,
            occupationLabel: formatOccupationDisplayLabel(values.occupationLabel),
            occupationGroupLabel: occupationGroup.label,
            occupationGroupHref: occupationGroup.href,
            href: slug ? `/yrke/${slug}` : undefined,
            menMedianMonthlySalary: values.men,
            womenMedianMonthlySalary: values.women,
            gapAmount,
            gapPercent,
            highestPaidGender: values.men >= values.women ? "men" as const : "women" as const,
            salaryGrowthPercent: stats?.salaryGrowthPercent,
            employeeGrowthPercent: stats?.employeeGrowthPercent,
            averageAge: stats?.averageAge,
            salaryGapHistory: salaryGapHistoryByCode.get(occupationCode) ?? [],
          },
        ];
      })
      .sort((left, right) => {
        if (right.gapPercent !== left.gapPercent) {
          return right.gapPercent - left.gapPercent;
        }

        if (right.gapAmount !== left.gapAmount) {
          return right.gapAmount - left.gapAmount;
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
      source: dataset.source ?? "Statistisk sentralbyrå",
      updated: dataset.updated,
    };
  },
);

function buildMedianSalaryMap(dataset: SsbNormalizedDataset, periodLabel?: string) {
  const dimensions = getDimensionCodes(dataset, {
    occupation: ["yrke", "occupation"],
    gender: ["kjonn", "kjønn", "sex"],
    measure: ["maalemetode", "målemetode", "measure"],
    period: ["tid", "time"],
  });

  if (!dimensions.occupation || !dimensions.gender) {
    return new Map<string, SalaryValues>();
  }

  return dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const measure = dimensions.measure ? row.dimensions[dimensions.measure] : undefined;
    const period = dimensions.period ? row.dimensions[dimensions.period] : undefined;

    if (
      !occupation ||
      !gender ||
      !isFourDigitOccupationCode(occupation.code) ||
      row.value === null ||
      (measure && measure.code !== "01") ||
      (periodLabel && period?.label !== periodLabel)
    ) {
      return map;
    }

    const values = map.get(occupation.code) ?? {
      occupationLabel: occupation.label,
    };

    if (gender.code === "1") {
      values.men = row.value;
    }

    if (gender.code === "2") {
      values.women = row.value;
    }

    map.set(occupation.code, values);
    return map;
  }, new Map<string, SalaryValues>());
}

function buildSalaryGapHistoryMap(dataset: SsbNormalizedDataset) {
  const dimensions = getDimensionCodes(dataset, {
    occupation: ["yrke", "occupation"],
    gender: ["kjonn", "kjønn", "sex"],
    measure: ["maalemetode", "målemetode", "measure"],
    period: ["tid", "time"],
  });

  if (!dimensions.occupation || !dimensions.gender || !dimensions.period) {
    return new Map<string, OccupationSalaryGapHistoryPoint[]>();
  }

  const latestPeriodLabels = findLatestPeriodLabels(dataset, 5);

  const salariesByOccupationAndPeriod = dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[dimensions.occupation as string];
    const gender = row.dimensions[dimensions.gender as string];
    const measure = dimensions.measure ? row.dimensions[dimensions.measure] : undefined;
    const period = row.dimensions[dimensions.period as string];

    if (
      !occupation ||
      !gender ||
      !period ||
      !isFourDigitOccupationCode(occupation.code) ||
      row.value === null ||
      (measure && measure.code !== "01")
    ) {
      return map;
    }

    const occupationPeriods = map.get(occupation.code) ?? new Map<string, SalaryValues>();
    const values = occupationPeriods.get(period.label) ?? {
      occupationLabel: occupation.label,
    };

    if (gender.code === "1") {
      values.men = row.value;
    }

    if (gender.code === "2") {
      values.women = row.value;
    }

    occupationPeriods.set(period.label, values);
    map.set(occupation.code, occupationPeriods);
    return map;
  }, new Map<string, Map<string, SalaryValues>>());

  return Array.from(salariesByOccupationAndPeriod.entries()).reduce((map, [occupationCode, periods]) => {
    const history = latestPeriodLabels.map((periodLabel) => {
      const values = periods.get(periodLabel);

      if (!values || values.men === undefined || values.women === undefined || values.men === 0) {
        return {
          periodLabel,
          hasCompleteData: false,
        };
      }

      const gapAmount = Math.abs(values.men - values.women);

      return {
        periodLabel,
        menMedianMonthlySalary: values.men,
        womenMedianMonthlySalary: values.women,
        gapAmount,
        gapPercent: getGapPercent(values.men, values.women),
        highestPaidGender: values.men >= values.women ? "men" as const : "women" as const,
        hasCompleteData: true,
      };
    });

    if (history.some((point) => point.hasCompleteData)) {
      map.set(occupationCode, history);
    }

    return map;
  }, new Map<string, OccupationSalaryGapHistoryPoint[]>());
}

function findLatestPeriodLabels(dataset: SsbNormalizedDataset, count: number) {
  const dimensions = getDimensionCodes(dataset, {
    period: ["tid", "time"],
  });

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

function getGapPercent(menMedianMonthlySalary: number, womenMedianMonthlySalary: number) {
  return (Math.abs(menMedianMonthlySalary - womenMedianMonthlySalary) / menMedianMonthlySalary) * 100;
}

function findLatestPeriodLabel(dataset: SsbNormalizedDataset) {
  const dimensions = getDimensionCodes(dataset, {
    period: ["tid", "time"],
  });

  if (!dimensions.period) {
    return undefined;
  }

  const periods = new Set<string>();

  for (const row of dataset.rows) {
    const period = row.dimensions[dimensions.period];

    if (period?.label) {
      periods.add(period.label);
    }
  }

  return Array.from(periods).sort((left, right) =>
    left.localeCompare(right, "nb-NO", { numeric: true }),
  ).at(-1);
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
