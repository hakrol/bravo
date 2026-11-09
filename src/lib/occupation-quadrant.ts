import type { SsbNormalizedDataset } from "@/lib/types";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";

export type OccupationQuadrantPoint = {
  code: string;
  name: string;
  href?: string;
  employees: number;
  salary: number;
};

export type OccupationQuadrantGender = "all" | "men" | "women";

export type OccupationQuadrantSeries = {
  excludedCount: number;
  points: OccupationQuadrantPoint[];
};

export type OccupationQuadrantDataset = OccupationQuadrantSeries & {
  title?: string;
  subtitle?: string;
  source?: string;
  testDataNote?: string;
  year: string | null;
  workforcePeriod: string | null;
  men?: OccupationQuadrantSeries;
  women?: OccupationQuadrantSeries;
};

export const occupationQuadrants = [
  { label: "Høy lønn, få lønnstakere", color: "#0b376d", background: "#f0f5fa" },
  { label: "Høy lønn, mange lønnstakere", color: "#047857", background: "#f0f9f5" },
  { label: "Lav lønn, få lønnstakere", color: "#9a5b00", background: "#fffbf2" },
  { label: "Lav lønn, mange lønnstakere", color: "#7c5596", background: "#f8f5fb" },
] as const;

export function quadrantMedian(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/** Verdier på grensen regnes som høy lønn / mange lønnstakere. */
export function occupationQuadrant(point: OccupationQuadrantPoint, employeesMedian: number, salaryMedian: number) {
  return (point.salary >= salaryMedian ? 0 : 2) + (point.employees >= employeesMedian ? 1 : 0);
}

/** Samme år og novemberreferanse: årslønnstabellen kobles til 4. kvartal. */
export function buildOccupationQuadrantDataset(
  salaryDataset: SsbNormalizedDataset,
  workforceDataset: SsbNormalizedDataset,
): OccupationQuadrantDataset {
  const salaryRows = salaryDataset.rows.filter(({ dimensions: d }) =>
    /^\d{4}$/.test(d.Yrke?.code ?? "") && ["0", "1", "2"].includes(d.Kjonn?.code)
    && d.Sektor?.code === "ALLE" && d.AvtaltVanlig?.code === "0"
    && d.MaaleMetode?.code === "01" && d.ContentsCode?.code === "Manedslonn",
  );
  const workforceRows = workforceDataset.rows.filter(({ dimensions: d }) =>
    /^\d{4}$/.test(d.Yrke?.code ?? "") && ["0", "1", "2"].includes(d.Kjonn?.code)
    && d.Alder?.code === "999D" && d.ContentsCode?.code === "Lonsstakere",
  );
  const workforcePeriods = new Set(workforceRows.map((row) => row.dimensions.Tid.code));
  const year = [...new Set(salaryRows.map((row) => row.dimensions.Tid.code))]
    .filter((year) => /^\d{4}$/.test(year) && workforcePeriods.has(`${year}K4`)).sort().at(-1) ?? null;
  const workforcePeriod = year ? `${year}K4` : null;
  function buildSeries(genderCode: string): OccupationQuadrantSeries {
    const employees = new Map(workforceRows.filter((row) =>
      row.dimensions.Tid.code === workforcePeriod && row.dimensions.Kjonn.code === genderCode)
      .map((row) => [row.dimensions.Yrke.code, row.value]));
    const candidates = salaryRows.filter((row) => row.dimensions.Tid.code === year && row.dimensions.Kjonn.code === genderCode);
    const points = candidates.flatMap((row) => {
      const count = employees.get(row.dimensions.Yrke.code);
      return typeof count === "number" && Number.isSafeInteger(count) && count >= 0
        && row.value !== null && Number.isFinite(row.value) && row.value > 0
        ? [{ code: row.dimensions.Yrke.code, name: row.dimensions.Yrke.label,
          href: getOccupationDetailHref(row.dimensions.Yrke.code, row.dimensions.Yrke.label) ?? undefined,
          employees: count, salary: row.value }]
        : [];
    }).sort((a, b) => a.employees - b.employees || a.code.localeCompare(b.code));
    return { excludedCount: candidates.length - points.length, points };
  }
  return { year, workforcePeriod, ...buildSeries("0"), men: buildSeries("1"), women: buildSeries("2") };
}

export function quadrantAxis(values: number[], startAtZero = false) {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const padding = Math.max((high - low) * 0.06, high * 0.02, 1);
  const rawMin = startAtZero ? 0 : Math.max(0, low - padding);
  const rawMax = high + padding;
  const roughStep = (rawMax - rawMin) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step = ([1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= roughStep) ?? 10) * magnitude;
  const min = Math.floor(rawMin / step) * step;
  const max = Math.ceil(rawMax / step) * step;
  return { min, max, ticks: Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step) };
}

/** Logaritmisk domene rundt yrkene som sammenlignes, også når antall er null. */
export function quadrantLogAxis(values: number[]) {
  const transformed = (values.length ? values : [0, 1]).map((value) => Math.log10(1 + value));
  const low = Math.min(...transformed);
  const high = Math.max(...transformed);
  const padding = Math.max((high - low) * 0.08, 0.05);
  const minLog = Math.max(0, low - padding);
  const maxLog = high + padding;
  const candidates = [0, ...Array.from({ length: Math.ceil(maxLog) }, (_, exponent) =>
    [1, 2, 5].map((factor) => factor * 10 ** exponent)).flat()]
    .filter((tick) => Math.log10(1 + tick) >= minLog && Math.log10(1 + tick) <= maxLog);
  const ticks = candidates.length >= 2 ? candidates : [...new Set(Array.from({ length: 3 }, (_, index) =>
    Math.round(10 ** (minLog + (maxLog - minLog) * index / 2) - 1)))];
  return { minLog, maxLog, ticks };
}
