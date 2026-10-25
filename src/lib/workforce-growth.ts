import type { OccupationWorkforceTimeSeriesPoint } from "./types";

export type WorkforceFilter = "all" | "men" | "women";
export type WorkforceYear = {
  year: number;
  men?: number | null;
  women?: number | null;
  reportedTotal?: number | null;
};
export type WorkforceGrowthDataset = {
  occupationCode: string;
  occupationLabel: string;
  /** Samme kvartal sammenlignes hvert år. Utelates bare for ekte årsdata. */
  quarter?: number;
  updated?: string;
  points: WorkforceYear[];
};
export type WorkforceObservation = {
  year: number;
  men: number | null;
  women: number | null;
  total: number | null;
  reportedTotal: number | null;
  totalMismatch: boolean;
  menShare: number | null;
  womenShare: number | null;
  annualChange: number | null;
};

function count(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export function workforcePercentChange(current: number | null, previous: number | null) {
  return current === null || previous === null || previous === 0 ? null : (current - previous) / previous * 100;
}

/** Bruk siste registrerte kvartal og samme kvartal bakover, aldri summer kvartalspersoner. */
export function buildWorkforceGrowthDataset(
  points: OccupationWorkforceTimeSeriesPoint[],
  metadata: Omit<WorkforceGrowthDataset, "points" | "quarter">,
): WorkforceGrowthDataset {
  const quarterly = points.flatMap((point) => {
    const match = /^(\d{4})K([1-4])$/i.exec(point.periodCode);
    return match ? [{ point, year: Number(match[1]), quarter: Number(match[2]) }] : [];
  }).sort((a, b) => a.year - b.year || a.quarter - b.quarter);
  const quarter = quarterly.at(-1)?.quarter;
  return {
    ...metadata,
    quarter,
    points: quarterly.filter((item) => item.quarter === quarter).map(({ point, year }) => ({
      year, men: point.employeesMen, women: point.employeesWomen, reportedTotal: point.employeesAll,
    })),
  };
}

/** Manglende kalenderår beholdes som hull; andeler bruker kun summen av to kjente kjønnstall. */
export function prepareWorkforceGrowth(dataset: WorkforceGrowthDataset): WorkforceObservation[] {
  if (dataset.quarter !== undefined && (!Number.isInteger(dataset.quarter) || dataset.quarter < 1 || dataset.quarter > 4)) {
    throw new Error("Kvartalet må være et helt tall fra 1 til 4.");
  }
  const byYear = new Map<number, WorkforceYear>();
  for (const point of dataset.points) {
    if (!Number.isInteger(point.year) || point.year < 1000 || point.year > 9999 || byYear.has(point.year)) {
      throw new Error("Lønnstakerdiagrammet krever unike, firesifrede årstall.");
    }
    byYear.set(point.year, point);
  }
  const ordered = [...byYear.keys()].sort((a, b) => a - b);
  if (!ordered.length) return [];
  const observations: WorkforceObservation[] = [];
  for (let year = ordered[0]; year <= ordered.at(-1)!; year += 1) {
    const point = byYear.get(year);
    const men = count(point?.men);
    const women = count(point?.women);
    const sum = men !== null && women !== null ? men + women : null;
    const total = sum !== null && Number.isSafeInteger(sum) ? sum : null;
    const reportedTotal = count(point?.reportedTotal);
    const previous = observations.at(-1);
    observations.push({
      year, men, women, total, reportedTotal,
      totalMismatch: total !== null && reportedTotal !== null && total !== reportedTotal,
      menShare: total !== null && total > 0 ? men! / total * 100 : null,
      womenShare: total !== null && total > 0 ? women! / total * 100 : null,
      annualChange: workforcePercentChange(total, previous?.total ?? null),
    });
  }
  return observations;
}

export function workforceValue(point: WorkforceObservation, filter: WorkforceFilter) {
  return filter === "all" ? point.total : point[filter];
}

/** Fire intervaller, heltallsetiketter og alltid null som nedre grense. */
export function buildWorkforceScale(points: WorkforceObservation[], filter: WorkforceFilter) {
  const maximum = points.reduce((max, point) => Math.max(max, workforceValue(point, filter) ?? 0), 0);
  const roughStep = Math.max(1, maximum / 4);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step = Math.ceil(([1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= roughStep) ?? 10) * magnitude);
  return { maximum: step * 4, ticks: Array.from({ length: 5 }, (_, index) => index * step) };
}

const integer = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export function formatWorkforceCount(value: number | null) {
  return value === null ? "—" : integer.format(value);
}
export function formatWorkforcePercent(value: number | null, signed = false, unit = "%") {
  if (value === null) return "—";
  // Ikke vis et fortegn foran et tall som avrundes til null.
  const sign = signed && Math.abs(value) >= 0.05 ? value > 0 ? "+" : "−" : "";
  return `${sign}${decimal.format(signed ? Math.abs(value) : value)} ${unit}`;
}
