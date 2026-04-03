import type { OccupationSalaryTimeSeries, OccupationSalaryTimeSeriesPoint } from "@/lib/ssb";

export const STANDARD_HOURS_PER_YEAR = 1950;
const MONTHS_PER_YEAR = 12;

export function convertMonthlySalaryToHourly(monthlySalary: number) {
  return (monthlySalary * MONTHS_PER_YEAR) / STANDARD_HOURS_PER_YEAR;
}

export function buildEstimatedHourlySalaryTimeSeries(
  series: OccupationSalaryTimeSeries,
): OccupationSalaryTimeSeries {
  return {
    ...series,
    measureLabel: "Estimert timelønn (kr)",
    points: series.points.map((point) => ({
      ...point,
      valueAll:
        point.valueAll !== undefined ? convertMonthlySalaryToHourly(point.valueAll) : undefined,
      valueWomen:
        point.valueWomen !== undefined ? convertMonthlySalaryToHourly(point.valueWomen) : undefined,
      valueMen:
        point.valueMen !== undefined ? convertMonthlySalaryToHourly(point.valueMen) : undefined,
    })),
  };
}

export function getLatestPointWithValues(
  points: OccupationSalaryTimeSeriesPoint[],
) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index];

    if (
      point.valueAll !== undefined ||
      point.valueWomen !== undefined ||
      point.valueMen !== undefined
    ) {
      return point;
    }
  }

  return null;
}
