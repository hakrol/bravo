import { calculateRealWageGrowth, type RealWageDataset, type RealWageYear } from "@/lib/real-wage-growth";

export const realWageLineGroups = [
  { key: "both", label: "Begge kjønn" },
  { key: "men", label: "Menn" },
  { key: "women", label: "Kvinner" },
] as const;

export type RealWageLineGroup = typeof realWageLineGroups[number]["key"];
export type RealWageLineYear = RealWageYear & {
  /** Samlet nominell gjennomsnittslønn. Må oppgis separat, ikke som snitt av kjønnene. */
  both?: number | null;
};
export type RealWageLineDataset = Omit<RealWageDataset, "points" | "baseline"> & {
  baseline?: RealWageLineYear;
  points: RealWageLineYear[];
};
export type RealWageLinePoint = {
  year: number;
  nominalGrowth: number | null;
  inflation: number | null;
  realGrowth: number | null;
};

function growth(current: number | null | undefined, previous: number | null | undefined) {
  if (typeof current !== "number" || typeof previous !== "number"
    || !Number.isFinite(current) || !Number.isFinite(previous) || current <= 0 || previous <= 0) return null;
  const value = (current / previous - 1) * 100;
  return Number.isFinite(value) ? value : null;
}

export function prepareRealWageLine(dataset: RealWageLineDataset, group: RealWageLineGroup): RealWageLinePoint[] {
  const byYear = new Map<number, RealWageLineYear>();
  for (const point of [...(dataset.baseline ? [dataset.baseline] : []), ...dataset.points]) {
    if (!Number.isInteger(point.year) || byYear.has(point.year)) {
      throw new Error("Reallønnsdiagrammet krever unike, hele årstall.");
    }
    byYear.set(point.year, point);
  }
  return [...dataset.points].sort((a, b) => a.year - b.year).slice(-10).map((point) => {
    const previous = byYear.get(point.year - 1);
    const nominalGrowth = growth(point[group], previous?.[group]);
    const inflation = growth(point.cpi, previous?.cpi);
    return {
      year: point.year, nominalGrowth, inflation,
      realGrowth: nominalGrowth !== null && inflation !== null
        ? calculateRealWageGrowth(nominalGrowth, inflation) : null,
    };
  });
}

/** Hull i data eller kalenderår skal bryte linjen, også arealfyllet. */
export function splitRealWageLine(points: RealWageLinePoint[]) {
  const runs: (RealWageLinePoint & { realGrowth: number })[][] = [];
  for (const point of points) {
    if (point.realGrowth === null) continue;
    const last = runs.at(-1);
    if (last?.at(-1)?.year === point.year - 1) last.push({ ...point, realGrowth: point.realGrowth });
    else runs.push([{ ...point, realGrowth: point.realGrowth }]);
  }
  return runs;
}
