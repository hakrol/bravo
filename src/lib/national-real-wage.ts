import {
  buildQuarterlyRealWageDataset, calculateQuarterlyRealWageSummary, prepareQuarterlyRealWage,
  quarterIndex, readQuarterlySalary, type QuarterlyRealWageDataset, type QuarterlyRealWagePeriod,
} from "@/lib/quarterly-real-wage";
import { calculateRealWageGrowth } from "@/lib/real-wage-growth";
import type { SsbNormalizedDataset, SsbQuarterlySalaryDataset } from "@/lib/types";
import type { OccupationRealWageData } from "@/lib/occupation-real-wage";

export type RealWageComparison = { code: string; label: string; value: number | null };
export type RealWageLeader = RealWageComparison & { value: number; tiedCount: number };

/** Beholder også høyeste verdi når alle gruppene har negativ utvikling. */
export function findRealWageLeader(items: readonly RealWageComparison[]): RealWageLeader | null {
  const available = items.filter((item): item is RealWageComparison & { value: number } =>
    item.value !== null && Number.isFinite(item.value));
  if (!available.length) return null;
  const highest = Math.max(...available.map((item) => item.value));
  const tied = available.filter((item) => Math.abs(item.value - highest) < 1e-10)
    .sort((a, b) => a.code.localeCompare(b.code, "nb-NO", { numeric: true }));
  return { ...tied[0], tiedCount: tied.length };
}

export function buildNationalRealWagePageData(
  occupations: SsbQuarterlySalaryDataset,
  norway: SsbQuarterlySalaryDataset,
  inflation: SsbNormalizedDataset,
) {
  const nationalDataset = buildQuarterlyRealWageDataset(occupations, inflation, "0-9", "MedianAvtMndLonn");
  const nationalPoints = nationalDataset.series.find((series) => series.genderCode === "0" && series.ageCode === "999D")?.points ?? [];
  const summary = calculateQuarterlyRealWageSummary(nationalPoints);
  const period = summary?.lastFullYear ?? null;
  const cpiByMonth = new Map(inflation.rows.filter((row) => row.dimensions.VareTjenesteGrp?.code === "00"
    && row.dimensions.ContentsCode?.code === "KpiIndMnd").map((row) => [row.dimensions.Tid.code, row.value]));
  function cpi(periodCode: string) {
    const index = quarterIndex(periodCode);
    const month = `${Math.floor(index / 4)}M${String(index % 4 * 3 + 2).padStart(2, "0")}`;
    const value = cpiByMonth.get(month);
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
  }
  function salary(source: SsbQuarterlySalaryDataset, selections: Record<string, string>, periodCode: string) {
    const coordinates = { ...selections, Kjonn: "0", ContentsCode: "MedianAvtMndLonn", Tid: periodCode };
    const chunk = source.chunks.find((candidate) => Object.entries(coordinates)
      .every(([dimension, code]) => candidate.dimension[dimension]?.category.index[code] !== undefined));
    return chunk ? readQuarterlySalary(chunk, coordinates) : null;
  }
  function growth(source: SsbQuarterlySalaryDataset, selections: Record<string, string>, comparison: QuarterlyRealWagePeriod | null) {
    if (!comparison) return null;
    const startSalary = salary(source, selections, comparison.startPeriodCode);
    const endSalary = salary(source, selections, comparison.endPeriodCode);
    const startCpi = cpi(comparison.startPeriodCode);
    const endCpi = cpi(comparison.endPeriodCode);
    return startSalary !== null && endSalary !== null && startCpi !== null && endCpi !== null
      ? calculateRealWageGrowth((endSalary / startSalary - 1) * 100, (endCpi / startCpi - 1) * 100) : null;
  }
  function categories(source: SsbQuarterlySalaryDataset, dimension: string) {
    const labels = new Map<string, string>();
    for (const chunk of source.chunks) {
      const category = chunk.dimension[dimension]?.category;
      if (!category) continue;
      for (const code of Object.keys(category.index)) labels.set(code, category.label?.[code] ?? code);
    }
    return [...labels].map(([code, label]) => ({ code, label }));
  }

  const ages = categories(norway, "Alder").filter((age) => age.code !== "999A");
  const ageDataset: QuarterlyRealWageDataset = {
    occupationCode: "0-9", occupationLabel: "Alle yrker",
    salaryTableId: norway.tableId, salaryMeasure: "MedianAvtMndLonn", inflationTableId: inflation.tableId,
    salaryUpdated: norway.updated, inflationUpdated: inflation.updated,
    genders: [{ code: "0", label: "Begge kjønn" }], ages,
    series: ages.map((age) => ({
      genderCode: "0", ageCode: age.code,
      // Bruk samme publiserte tidsakse som landstallet, også ved manglende aldersdata.
      points: prepareQuarterlyRealWage(nationalPoints.map((point) => ({
        periodCode: point.periodCode,
        salary: salary(norway, { Region: "Ialt", Alder: age.code }, point.periodCode),
        cpi: cpi(point.periodCode),
      }))),
    })),
  };
  const ageComparisons: RealWageComparison[] = ages.map((age) => ({
    ...age, value: growth(norway, { Region: "Ialt", Alder: age.code }, period),
  }));
  const occupationCategories = categories(occupations, "Yrke");
  const occupationData: OccupationRealWageData = {
    salaryTableId: occupations.tableId, inflationTableId: inflation.tableId,
    salaryUpdated: occupations.updated, inflationUpdated: inflation.updated,
    periods: nationalPoints.map((point) => point.periodCode), cpi: nationalPoints.map((point) => cpi(point.periodCode)),
    occupations: occupationCategories.filter((item) => /^(?!0000)\d{4}$/.test(item.code))
      .map((item) => ({ ...item, salaries: nationalPoints.map((point) => salary(occupations, { Yrke: item.code, Alder: "999D" }, point.periodCode)) }))
      .filter((item) => item.salaries.some((value) => value !== null))
      .sort((a, b) => a.label.localeCompare(b.label, "nb-NO")),
  };
  function occupationComparisons(pattern: RegExp) {
    return occupationCategories.filter((item) => pattern.test(item.code)).map((item) => ({
      ...item, value: growth(occupations, { Yrke: item.code, Alder: "999D" }, period),
    }));
  }
  return {
    nationalDataset, summary, ageDataset, ageComparisons, occupationData,
    leaders: {
      occupation: findRealWageLeader(occupationComparisons(/^(?!0000)\d{4}$/)),
      age: findRealWageLeader(ageComparisons),
      // SSBs publiserte hovedgruppemedianer; aldri median av detaljyrkenes medianer.
      group: findRealWageLeader(occupationComparisons(/^[1-9]$/)),
    },
  };
}
