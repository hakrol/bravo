import salaryGrowthSnapshot from "@/content/blog/data/gjennomsnittlig-lonnsvekst-norge-2026.json";
import { cache } from "react";
import {
  getOccupationDetailViewModelBySlug,
  getOccupationDetailViewModelIndex,
  type OccupationDetailViewModel,
} from "@/lib/occupation-detail-view-models";

const OCCUPATION_SLUG_SUFFIX = "-lonn";

type InflationGrowthRow = {
  label: string;
  inflationGrowth: number;
};

export type OccupationSalaryGrowthRow = {
  year: number;
  salary: number;
  salaryGrowth?: number;
  inflationGrowth?: number;
  realGrowth?: number;
};

export type OccupationSalaryGrowthChartPoint = {
  year: number;
  salaryAll?: number;
  salaryWomen?: number;
  salaryMen?: number;
  inflationAdjustedAll?: number;
  inflationAdjustedWomen?: number;
  inflationAdjustedMen?: number;
};

const inflationGrowthByYear = new Map(
  (salaryGrowthSnapshot.growthRows as InflationGrowthRow[]).map((row) => [
    Number(row.label),
    row.inflationGrowth,
  ]),
);

export async function getOccupationSalaryGrowthStaticParams() {
  const pages = await getAvailableOccupationSalaryGrowthPages();

  return pages.map((page) => ({
    slug: buildOccupationSalaryGrowthSlug(page.slug),
  }));
}

export const getAvailableOccupationSalaryGrowthPages = cache(async () => {
  const index = await getOccupationDetailViewModelIndex();
  const pages = await Promise.all(
    index.pages.map(async (page) => {
      const detail = await getOccupationDetailViewModelBySlug(page.slug);

      if (!detail) {
        return null;
      }

      const { rows } = buildOccupationSalaryGrowthData(detail);

      return hasOccupationSalaryGrowthData(rows) ? page : null;
    }),
  );

  return pages.filter((page) => page !== null);
});

export async function getOccupationSalaryGrowthDetail(slug: string) {
  return getOccupationDetailViewModelBySlug(buildOccupationDetailSlug(slug));
}

export function buildOccupationSalaryGrowthSlug(occupationSlug: string) {
  return occupationSlug.endsWith(OCCUPATION_SLUG_SUFFIX)
    ? occupationSlug.slice(0, -OCCUPATION_SLUG_SUFFIX.length)
    : occupationSlug;
}

export function buildOccupationSalaryGrowthHref(occupationSlug: string) {
  return `/lonnsvekst-${buildOccupationSalaryGrowthSlug(occupationSlug)}`;
}

export function buildOccupationSalaryGrowthData(detail: OccupationDetailViewModel) {
  const medianAnnualSeries = detail.data.medianBasicSalarySeries.points
    .flatMap((point) => {
      const year = Number(point.periodCode);

      return Number.isInteger(year) ? [{ ...point, year }] : [];
    })
    .sort((left, right) => left.year - right.year);
  const quarterlyFallbackSeries = detail.data.trendData.series.points
    .flatMap((point) => {
      const year = point.periodCode.match(/^(20\d{2})K1$/)?.[1];

      return year ? [{ ...point, year: Number(year) }] : [];
    })
    .sort((left, right) => left.year - right.year);
  const medianComparableRows = countComparableGrowthRows(medianAnnualSeries);
  const fallbackComparableRows = countComparableGrowthRows(quarterlyFallbackSeries);
  const usesMedian =
    medianComparableRows > 0 ||
    (fallbackComparableRows === 0 && medianAnnualSeries.length >= quarterlyFallbackSeries.length);
  const annualSeries = usesMedian ? medianAnnualSeries : quarterlyFallbackSeries;
  const salaryByYear = new Map(annualSeries.map((point) => [point.year, point]));

  const rows = annualSeries.flatMap((point): OccupationSalaryGrowthRow[] => {
    const previousPoint = salaryByYear.get(point.year - 1);
    const inflationGrowth = inflationGrowthByYear.get(point.year);

    if (point.valueAll === undefined) {
      return [];
    }

    const salaryGrowth =
      previousPoint?.valueAll !== undefined && previousPoint.valueAll !== 0
        ? ((point.valueAll - previousPoint.valueAll) / previousPoint.valueAll) * 100
        : undefined;

    return [{
      year: point.year,
      salary: point.valueAll,
      salaryGrowth,
      inflationGrowth,
      realGrowth:
        salaryGrowth !== undefined && inflationGrowth !== undefined
          ? calculateRealGrowth(salaryGrowth, inflationGrowth)
          : undefined,
    }];
  });

  const latestYear = rows.at(-1)?.year;
  const chartPoints: OccupationSalaryGrowthChartPoint[] = annualSeries
    .filter((point) => latestYear !== undefined && point.year <= latestYear)
    .map((point) => {
      const inflationFactor = getInflationFactor(point.year, latestYear ?? point.year);

      if (inflationFactor === null) {
        return {
          year: point.year,
          salaryAll: point.valueAll,
          salaryWomen: point.valueWomen,
          salaryMen: point.valueMen,
        };
      }

      return {
        year: point.year,
        salaryAll: point.valueAll,
        salaryWomen: point.valueWomen,
        salaryMen: point.valueMen,
        inflationAdjustedAll: multiplyOptional(point.valueAll, inflationFactor),
        inflationAdjustedWomen: multiplyOptional(point.valueWomen, inflationFactor),
        inflationAdjustedMen: multiplyOptional(point.valueMen, inflationFactor),
      };
    });

  return {
    rows: rows.sort((left, right) => right.year - left.year),
    chartPoints,
    latestYear,
    measureLabel: usesMedian
      ? detail.data.medianBasicSalarySeries.measureLabel
      : detail.data.trendData.series.measureLabel,
    sourceTableId: usesMedian ? "11418" : "11658",
  };
}

export function hasOccupationSalaryGrowthData(rows: OccupationSalaryGrowthRow[]) {
  return rows.some((row) => row.realGrowth !== undefined);
}

function buildOccupationDetailSlug(slug: string) {
  return slug.endsWith(OCCUPATION_SLUG_SUFFIX) ? slug : `${slug}${OCCUPATION_SLUG_SUFFIX}`;
}

function getInflationFactor(fromYear: number, toYear: number) {
  let factor = 1;

  for (let year = fromYear + 1; year <= toYear; year += 1) {
    const inflationGrowth = inflationGrowthByYear.get(year);

    if (inflationGrowth === undefined) {
      return null;
    }

    factor *= 1 + inflationGrowth / 100;
  }

  return factor;
}

function countComparableGrowthRows(
  points: Array<{ year: number; valueAll?: number }>,
) {
  const valuesByYear = new Map(points.map((point) => [point.year, point.valueAll]));

  return points.filter((point) => {
    const previousValue = valuesByYear.get(point.year - 1);

    return (
      point.valueAll !== undefined &&
      previousValue !== undefined &&
      previousValue !== 0 &&
      inflationGrowthByYear.has(point.year)
    );
  }).length;
}

function calculateRealGrowth(salaryGrowth: number, inflationGrowth: number) {
  return (((1 + salaryGrowth / 100) / (1 + inflationGrowth / 100)) - 1) * 100;
}

function multiplyOptional(value: number | undefined, factor: number) {
  return value === undefined ? undefined : value * factor;
}
