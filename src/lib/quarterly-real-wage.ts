import { calculateRealWageGrowth } from "@/lib/real-wage-growth";
import type { JsonStat2Dataset, SsbNormalizedDataset, SsbQuarterlySalaryDataset } from "@/lib/types";

export const quarterlyRealWageTitle = "Interaktiv reallønn - stolpe per kvartal";
export const quarterlyRealWageSalaryLabels = {
  GjMdTotal: "Gjennomsnittlig månedslønn",
  MedianAvtMndLonn: "Median avtalt månedslønn",
} as const;
export type QuarterlyRealWageSalaryMeasure = keyof typeof quarterlyRealWageSalaryLabels;
export type QuarterlyRealWageLevel = { periodCode: string; salary: number | null; cpi: number | null };
export type QuarterlyRealWagePoint = QuarterlyRealWageLevel & {
  nominalGrowth: number | null;
  inflation: number | null;
  realGrowth: number | null;
  missingReason: string | null;
};
export type QuarterlyRealWageDataset = {
  occupationCode: string;
  occupationLabel: string;
  salaryTableId: string;
  salaryMeasure?: QuarterlyRealWageSalaryMeasure;
  inflationTableId: string;
  salaryUpdated?: string;
  inflationUpdated?: string;
  genders: { code: string; label: string }[];
  ages: { code: string; label: string }[];
  series: { genderCode: string; ageCode: string; points: QuarterlyRealWagePoint[] }[];
};
export type QuarterlyRealWagePeriod = {
  startPeriodCode: string;
  endPeriodCode: string;
  value: number | null;
};

export function quarterIndex(periodCode: string) {
  const match = /^(\d{4})K([1-4])$/.exec(periodCode);
  if (!match) throw new Error(`Ugyldig kvartal: ${periodCode}`);
  return Number(match[1]) * 4 + Number(match[2]) - 1;
}

function quarterCode(index: number) {
  return `${Math.floor(index / 4)}K${index % 4 + 1}`;
}

export function formatRealWageQuarter(periodCode: string) {
  const index = quarterIndex(periodCode);
  return `${index % 4 + 1}. kvartal ${Math.floor(index / 4)}`;
}

function positive(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/** Periodene forankres i siste publiserte kvartal, også når verdier mangler. */
export function calculateQuarterlyRealWageSummary(levels: readonly QuarterlyRealWageLevel[]) {
  if (!levels.length) return null;
  const byPeriod = new Map<number, QuarterlyRealWageLevel>();
  for (const level of levels) {
    const index = quarterIndex(level.periodCode);
    if (byPeriod.has(index)) throw new Error(`Duplikat kvartal: ${level.periodCode}`);
    byPeriod.set(index, level);
  }
  const latest = Math.max(...byPeriod.keys());
  const lastFullYear = Math.floor(latest / 4) - (latest % 4 === 3 ? 0 : 1);
  function change(startIndex: number, endIndex: number): QuarterlyRealWagePeriod {
    const start = byPeriod.get(startIndex);
    const end = byPeriod.get(endIndex);
    const startSalary = positive(start?.salary);
    const endSalary = positive(end?.salary);
    const startCpi = positive(start?.cpi);
    const endCpi = positive(end?.cpi);
    return {
      startPeriodCode: quarterCode(startIndex),
      endPeriodCode: quarterCode(endIndex),
      value: startSalary !== null && endSalary !== null && startCpi !== null && endCpi !== null
        ? calculateRealWageGrowth((endSalary / startSalary - 1) * 100, (endCpi / startCpi - 1) * 100)
        : null,
    };
  }
  return {
    fourQuarters: change(latest - 4, latest),
    highlightStartPeriodCode: quarterCode(latest - 3),
    lastFullYear: change((lastFullYear - 1) * 4 + 3, lastFullYear * 4 + 3),
    lastQuarter: change(latest - 1, latest),
  };
}

/** Eksakt foregående kvartal, aldri samme kvartal året før eller en eldre observasjon. */
export function prepareQuarterlyRealWage(levels: QuarterlyRealWageLevel[]): QuarterlyRealWagePoint[] {
  const byPeriod = new Map<number, QuarterlyRealWageLevel>();
  for (const level of levels) {
    const index = quarterIndex(level.periodCode);
    if (byPeriod.has(index)) throw new Error(`Duplikat kvartal: ${level.periodCode}`);
    byPeriod.set(index, level);
  }
  return [...byPeriod.entries()].sort(([a], [b]) => a - b).map(([index, level]) => {
    const previous = byPeriod.get(index - 1);
    const salary = positive(level.salary);
    const previousSalary = positive(previous?.salary);
    const cpi = positive(level.cpi);
    const previousCpi = positive(previous?.cpi);
    const nominalGrowth = salary !== null && previousSalary !== null ? (salary / previousSalary - 1) * 100 : null;
    const inflation = cpi !== null && previousCpi !== null ? (cpi / previousCpi - 1) * 100 : null;
    const realGrowth = nominalGrowth !== null && inflation !== null ? calculateRealWageGrowth(nominalGrowth, inflation) : null;
    const missingReason = salary === null ? "Mangler lønnstall for dette kvartalet."
      : !previous ? "Mangler sammenligningsgrunnlag fra foregående kvartal."
      : previousSalary === null ? "Mangler lønnstall fra foregående kvartal."
      : cpi === null || previousCpi === null ? "Mangler KPI for dette eller foregående kvartals midtmåned."
      : realGrowth === null ? "Reallønnsendringen kan ikke beregnes." : null;
    return { ...level, salary, cpi, nominalGrowth, inflation, realGrowth, missingReason };
  });
}

/** Samlet nivåendring over nøyaktig fem år (20 kvartaler), for samme utvalg. */
export function calculateFiveYearQuarterlyRealWageGrowth(levels: readonly QuarterlyRealWageLevel[]) {
  if (!levels.length) return null;
  const byPeriod = new Map<number, QuarterlyRealWageLevel>();
  for (const level of levels) {
    const index = quarterIndex(level.periodCode);
    if (byPeriod.has(index)) throw new Error(`Duplikat kvartal: ${level.periodCode}`);
    byPeriod.set(index, level);
  }
  const endIndex = Math.max(...byPeriod.keys());
  const startIndex = endIndex - 20;
  const start = byPeriod.get(startIndex);
  const end = byPeriod.get(endIndex)!;
  const startSalary = positive(start?.salary);
  const endSalary = positive(end.salary);
  const startCpi = positive(start?.cpi);
  const endCpi = positive(end.cpi);
  const value = startSalary !== null && endSalary !== null && startCpi !== null && endCpi !== null
    ? calculateRealWageGrowth((endSalary / startSalary - 1) * 100, (endCpi / startCpi - 1) * 100)
    : null;
  return { startPeriodCode: quarterCode(startIndex), endPeriodCode: quarterCode(endIndex), value };
}

/** Direkte oppslag unngår å normalisere over én million irrelevante yrkesceller. */
export function readQuarterlySalary(chunk: JsonStat2Dataset, selections: Record<string, string>) {
  const dimensions = chunk.id ?? Object.keys(chunk.dimension);
  let offset = 0;
  for (const [index, dimension] of dimensions.entries()) {
    const category = chunk.dimension[dimension].category;
    const coordinate = category.index[selections[dimension]];
    if (coordinate === undefined) return null;
    offset = offset * (chunk.size?.[index] ?? Object.keys(category.index).length) + coordinate;
  }
  const status = Array.isArray(chunk.status) ? chunk.status[offset] : chunk.status?.[String(offset)];
  if (status === ":") return null;
  return positive(chunk.value[offset]);
}

export function buildQuarterlyRealWageDataset(
  salary: SsbQuarterlySalaryDataset,
  inflation: SsbNormalizedDataset,
  occupationCode = "0-9",
  salaryMeasure: QuarterlyRealWageSalaryMeasure = "GjMdTotal",
): QuarterlyRealWageDataset {
  const occupationChunks = salary.chunks.filter((chunk) => chunk.dimension.Yrke?.category.index[occupationCode] !== undefined);
  const first = occupationChunks[0];
  if (!first || !/^(0-9|\d{4})$/.test(occupationCode)) throw new RangeError("Fant ikke dette yrket i kvartalsdataene.");
  const occupationLabel = first.dimension.Yrke.category.label?.[occupationCode] ?? occupationCode;
  const genders = ["0", "2", "1"].filter((code) => first.dimension.Kjonn.category.index[code] !== undefined)
    .map((code) => ({ code, label: first.dimension.Kjonn.category.label?.[code] ?? code }));
  const ages = Object.entries(first.dimension.Alder.category.index).sort(([, a], [, b]) => a - b)
    .map(([code]) => ({ code, label: first.dimension.Alder.category.label?.[code] ?? code }));
  const periods = [...new Set(salary.chunks.flatMap((chunk) => Object.keys(chunk.dimension.Tid.category.index)))];
  const latest = Math.max(...periods.map(quarterIndex));
  const firstIndex = quarterIndex("2016K1");
  const allPeriods = Array.from({ length: Math.max(0, latest - firstIndex + 1) }, (_, index) => quarterCode(firstIndex + index));
  const cpiByMonth = new Map(inflation.rows.filter((row) => row.dimensions.VareTjenesteGrp?.code === "00"
    && row.dimensions.ContentsCode?.code === "KpiIndMnd")
    .map((row) => [row.dimensions.Tid.code, positive(row.value)]));
  const series = genders.flatMap((gender) => ages.map((age) => {
    const levels = allPeriods.map((periodCode) => {
      const index = quarterIndex(periodCode);
      const midMonth = `${Math.floor(index / 4)}M${String((index % 4) * 3 + 2).padStart(2, "0")}`;
      const chunk = occupationChunks.find((candidate) => candidate.dimension.Tid.category.index[periodCode] !== undefined
        && candidate.dimension.Kjonn.category.index[gender.code] !== undefined
        && candidate.dimension.Alder.category.index[age.code] !== undefined);
      return {
        periodCode,
        salary: chunk ? readQuarterlySalary(chunk, { Kjonn: gender.code, Alder: age.code, Yrke: occupationCode, ContentsCode: salaryMeasure, Tid: periodCode }) : null,
        // Lønn gjelder midtmåneden; bruk februar, mai, august og november, ikke kvartalsgjennomsnitt av KPI.
        cpi: cpiByMonth.get(midMonth) ?? null,
      };
    });
    return { genderCode: gender.code, ageCode: age.code, points: prepareQuarterlyRealWage(levels) };
  }));
  return {
    occupationCode, occupationLabel,
    salaryTableId: salary.tableId, salaryMeasure, inflationTableId: inflation.tableId,
    salaryUpdated: salary.updated, inflationUpdated: inflation.updated, genders, ages, series,
  };
}
