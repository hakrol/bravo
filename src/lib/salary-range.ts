import { salaryGrowthSeriesDefinitions } from "./salary-growth-series";

export type SalaryRangeGender = "all" | "women" | "men";
export type SalaryRangeUnit = "year" | "month";
export type SalaryRangeQuartiles = { p25: number; median: number; p75: number };
export type SalaryRangeYear = {
  year: number;
  /** Egen fordeling for begge kjønn samlet; skal ikke beregnes fra kjønnskvartilene. */
  all?: SalaryRangeQuartiles | null;
  women?: SalaryRangeQuartiles | null;
  men?: SalaryRangeQuartiles | null;
};
/** Alle kvartiler gjelder fast avtalt brutto månedslønn i heltidsekvivalenter. */
export type SalaryRangeDataset = {
  title: string;
  source: string;
  isTestData?: boolean;
  points: SalaryRangeYear[];
};
export type PreparedSalaryRangeYear = {
  year: number;
  all: SalaryRangeQuartiles | null;
  women: SalaryRangeQuartiles | null;
  men: SalaryRangeQuartiles | null;
};

export const salaryRangeSeries = (["all", "men", "women"] as const).map((key) => ({
  key,
  label: key === "all" ? "Begge kjønn" : key === "women" ? "Kvinner" : "Menn",
  symbol: key === "all" ? "" : key === "women" ? "♀" : "♂",
  color: salaryGrowthSeriesDefinitions.find((series) => series.key === key)!.color,
}));

function validQuartiles(value: SalaryRangeQuartiles | null | undefined): SalaryRangeQuartiles | null {
  if (!value || ![value.p25, value.median, value.p75].every((number) => Number.isFinite(number) && number > 0)
    || value.p25 > value.median || value.median > value.p75) return null;
  return value;
}

export function prepareSalaryRange(dataset: SalaryRangeDataset): PreparedSalaryRangeYear[] {
  const years = new Set<number>();
  for (const point of dataset.points) {
    if (!Number.isInteger(point.year) || years.has(point.year)) {
      throw new Error("Lønnsspennet krever unike, hele årstall.");
    }
    years.add(point.year);
  }
  return [...dataset.points].sort((a, b) => a.year - b.year).slice(-10).map((point) => ({
    year: point.year, all: validQuartiles(point.all), women: validQuartiles(point.women), men: validQuartiles(point.men),
  }));
}

export function parseSalaryRangeInput(raw: string): number | null {
  const normalized = raw.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 && value <= Number.MAX_SAFE_INTEGER ? value : null;
}

export function toSalaryRangeMonthly(value: number, unit: SalaryRangeUnit) {
  return unit === "year" ? value / 12 : value;
}

export function salaryRangePosition(salary: number, quartiles: SalaryRangeQuartiles) {
  if (salary === quartiles.median) return "På medianen";
  if (salary === quartiles.p25) return "På nedre kvartil";
  if (salary === quartiles.p75) return "På øvre kvartil";
  if (salary < quartiles.p25) return "Under nedre kvartil · laveste 25 %";
  if (salary < quartiles.median) return "Mellom nedre kvartil og medianen";
  if (salary < quartiles.p75) return "Mellom medianen og øvre kvartil";
  return "Over øvre kvartil · høyeste 25 %";
}

export function compareSalaryRange(salary: number, quartiles: SalaryRangeQuartiles) {
  return {
    position: salaryRangePosition(salary, quartiles),
    difference: salary - quartiles.median,
    percent: ((salary - quartiles.median) / quartiles.median) * 100,
  };
}

/** Hver sammenhengende sekvens tegnes separat, også ved manglende kalenderår. */
export function salaryRangeSegments(years: PreparedSalaryRangeYear[], gender: SalaryRangeGender) {
  const segments: { year: number; values: SalaryRangeQuartiles }[][] = [];
  let current: { year: number; values: SalaryRangeQuartiles }[] = [];
  for (const point of years) {
    const values = point[gender];
    if (!values || current.length && point.year !== current.at(-1)!.year + 1) {
      if (current.length) segments.push(current);
      current = [];
    }
    if (values) current.push({ year: point.year, values });
  }
  if (current.length) segments.push(current);
  return segments;
}

export function buildSalaryRangeGeometry(years: PreparedSalaryRangeYear[], width: number) {
  const values = years.flatMap((point) => salaryRangeSeries.flatMap(({ key }) => point[key] ? [point[key]!.p25, point[key]!.p75] : []));
  if (!years.length || !values.length) return null;
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = Math.max(5000, high - low);
  const magnitude = 10 ** Math.floor(Math.log10(span / 5));
  const step = ([1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= span / 5) ?? 10) * magnitude;
  const min = Math.max(0, Math.floor((low - step / 5) / step) * step);
  const max = Math.ceil((high + step / 5) / step) * step;
  const margin = { top: 52, right: 24, bottom: 54, left: width < 440 ? 66 : 78 };
  const plotHeight = 300;
  const plotWidth = width - margin.left - margin.right;
  const firstYear = years[0].year;
  const lastYear = years.at(-1)!.year;
  const x = (year: number) => margin.left + (firstYear === lastYear ? plotWidth / 2 : (year - firstYear) / (lastYear - firstYear) * plotWidth);
  const y = (value: number) => margin.top + (max - value) / (max - min) * plotHeight;
  return {
    width, height: margin.top + plotHeight + margin.bottom, margin, plotWidth, plotHeight, min, max, x, y,
    ticks: Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step),
  };
}
