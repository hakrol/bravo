import { salaryGrowthSeriesDefinitions } from "@/lib/salary-growth-series";

export type RealWageGender = "women" | "men";
export type RealWageYear = {
  year: number;
  women?: number | null;
  men?: number | null;
  /** Samlet nominell median månedslønn for begge kjønn. Oppgis separat fra gjennomsnittslønnen. */
  median?: number | null;
  /** Årlig KPI-indeks, med samme basis og definisjon for alle år. */
  cpi?: number | null;
};
export type RealWageDataset = {
  title: string;
  source: string;
  isTestData?: boolean;
  baseline?: RealWageYear;
  points: RealWageYear[];
};
export type RealWageObservation = {
  year: number;
  gender: RealWageGender;
  salary: number | null;
  median: number | null;
  nominalGrowth: number | null;
  inflation: number | null;
  realGrowth: number | null;
  missingReason: string | null;
};

export const realWageGenders = [
  { key: "women", label: "Kvinner", symbol: "♀", color: salaryGrowthSeriesDefinitions.find((series) => series.key === "women")!.color },
  { key: "men", label: "Menn", symbol: "♂", color: salaryGrowthSeriesDefinitions.find((series) => series.key === "men")!.color },
] as const;
export const realWageColors = { positive: "#15803d", negative: "#b91c1c", neutral: "#64748b" };
const decimal = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatRealWagePercent(value: number | null) {
  if (value === null) return "—";
  if (value === 0) return "0 %";
  const formatter = Math.abs(value) < 0.05
    ? new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : decimal;
  return `${value > 0 ? "+" : "−"}${formatter.format(Math.abs(value))} %`;
}

/** Kompakt enhet på stolpene; tooltip og nøkkeltall beholder vanlig formatering. */
export function formatRealWageBarPercent(value: number | null) {
  return formatRealWagePercent(value).replace(/\s+%$/, "%");
}

function barLabelUnits(value: number | null) {
  return [...formatRealWageBarPercent(value)].reduce((width, character) => width
    + (/\d/.test(character) ? 0.6 : character === "," ? 0.28 : character === "%" ? 0.65
      : character === "+" || character === "−" ? 0.65 : /\s/.test(character) ? 0.3 : 1), 0);
}

export function calculateRealWageGrowth(nominalGrowth: number, inflation: number): number | null {
  if (!Number.isFinite(nominalGrowth) || !Number.isFinite(inflation) || inflation <= -100 || nominalGrowth <= -100) return null;
  const value = ((1 + nominalGrowth / 100) / (1 + inflation / 100) - 1) * 100;
  if (!Number.isFinite(value)) return null;
  return Math.abs(value) < 1e-10 ? 0 : value;
}

function validValue(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/** Beregner begge kjønn separat, med samme KPI og kun mot foregående kalenderår. */
export function prepareRealWageGrowth(
  dataset: RealWageDataset,
  { includeHistory = false }: { includeHistory?: boolean } = {},
): RealWageObservation[][] {
  const byYear = new Map<number, RealWageYear>();
  for (const point of [...(dataset.baseline ? [dataset.baseline] : []), ...dataset.points]) {
    if (!Number.isInteger(point.year) || byYear.has(point.year)) throw new Error("Reallønnsdiagrammet krever unike, hele årstall.");
    byYear.set(point.year, point);
  }
  const ordered = [...dataset.points].sort((a, b) => a.year - b.year);
  const points = includeHistory ? ordered : ordered.slice(-10);
  return points.map((point) => {
    const previous = byYear.get(point.year - 1);
    const cpi = validValue(point.cpi);
    const previousCpi = validValue(previous?.cpi);
    const inflation = cpi !== null && previousCpi !== null ? (cpi / previousCpi - 1) * 100 : null;
    return realWageGenders.map(({ key }) => {
      const salary = validValue(point[key]);
      const previousSalary = validValue(previous?.[key]);
      const nominalGrowth = salary !== null && previousSalary !== null ? (salary / previousSalary - 1) * 100 : null;
      const missingReason = salary === null ? "Mangler lønnstall for dette kjønnet og året."
        : !previous ? "Mangler sammenligningsgrunnlag fra året før."
        : previousSalary === null ? "Mangler lønnstall for dette kjønnet året før."
        : inflation === null ? "Mangler KPI for dette året eller året før." : null;
      return {
        year: point.year, gender: key, salary, median: validValue(point.median), nominalGrowth, inflation,
        realGrowth: nominalGrowth !== null && inflation !== null ? calculateRealWageGrowth(nominalGrowth, inflation) : null,
        missingReason,
      };
    });
  });
}

/** Sammenligner første og siste nivå blant de siste 5 eller 10 årgangene. */
export function calculateCumulativeRealWageGrowth(
  years: RealWageObservation[][],
  gender: RealWageGender,
  period: 5 | 10,
) {
  const observations = years.flat();
  const validRate = (value: number | null): value is number => value !== null && Number.isFinite(value) && value > -100;
  const endYear = Math.max(...observations.filter((point) => validRate(point.realGrowth)).map((point) => point.year));
  if (!Number.isFinite(endYear)) return null;
  const byYear = new Map(observations.filter((point) => point.gender === gender).map((point) => [point.year, point]));
  const startYear = endYear - period + 1;
  if (!byYear.has(startYear)) return null;
  let factor = 1;
  // Første årgang er startnivået; endringen inn i dette året inngår ikke.
  for (let year = startYear + 1; year <= endYear; year += 1) {
    const rate = byYear.get(year)?.realGrowth ?? null;
    if (!validRate(rate)) return null;
    factor *= 1 + rate / 100;
  }
  const value = (factor - 1) * 100;
  if (!Number.isFinite(value)) return null;
  return { value: Math.abs(value) < 1e-10 ? 0 : value, startYear, endYear };
}

export function realWageExplanation(observation: RealWageObservation) {
  if (observation.realGrowth === null) return `${observation.missingReason ?? "Mangler beregningsgrunnlag."} Reallønnsendringen kan ikke beregnes.`;
  if (observation.realGrowth === 0) return "Lønnen holdt tritt med prisene. Kjøpekraften var uendret fra året før.";
  return observation.realGrowth > 0
    ? "Lønnen utviklet seg sterkere enn prisene."
    : "Lønnen utviklet seg svakere enn prisene.";
}

function niceStep(value: number) {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return ([1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= value) ?? 10) * magnitude;
}

export function buildRealWageGeometry(years: RealWageObservation[][], availableWidth: number) {
  if (!years.length) throw new Error("Diagrammet trenger minst ett år.");
  const values = years.flat().flatMap((point) => point.realGrowth === null ? [] : [point.realGrowth]);
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values);
  const span = Math.max(2, high - low);
  const step = niceStep(span / 5);
  const padding = Math.max(step, span * 0.2);
  const min = Math.floor((low - padding) / step) * step;
  const max = Math.ceil((high + padding) / step) * step;
  const margin = { left: 64, right: 24, top: 50, bottom: 68 };
  const plotHeight = 300;
  const minimumFontSize = availableWidth < 440 ? 12 : 10;
  const maxLabelUnits = Math.max(...years.flat().map((point) => barLabelUnits(point.realGrowth)));
  const labelClearance = 2.5;
  const desiredLabelWidth = maxLabelUnits * minimumFontSize + labelClearance;
  const barFraction = 0.37;
  const innerGap = Math.max(7, desiredLabelWidth - 30);
  // Reserver plass både mellom kjønnene og mellom to år, framfor å flytte etikettene.
  // Mellom to år er det alltid minst to piksler mer luft enn mellom kjønnene.
  const groupingMinimum = Math.min((2 * innerGap + 2) / (1 - 2 * barFraction), 60 + 2 * innerGap + 2);
  const minimumSlot = Math.max(availableWidth < 440 ? 88 : 62, groupingMinimum,
    (desiredLabelWidth - innerGap) / barFraction, (desiredLabelWidth + innerGap) / (1 - barFraction));
  const width = Math.max(280, availableWidth);
  const slotWidth = (width - margin.left - margin.right) / years.length;
  const compactLabels = slotWidth < minimumSlot;
  const barWidth = Math.min(30, slotWidth * (compactLabels ? 0.3 : barFraction));
  const barGap = compactLabels ? Math.min(innerGap, slotWidth * 0.14) : innerGap;
  const closestCenterGap = Math.min(barWidth + barGap, slotWidth - barWidth - barGap);
  const fontSize = compactLabels ? 12 : Math.floor(Math.min(12, (closestCenterGap - labelClearance) / maxLabelUnits) * 10) / 10;
  const y = (value: number) => margin.top + ((max - value) / (max - min)) * plotHeight;
  const zeroY = y(0);
  const yearZones = years.map((points, index) => ({
    year: points[0].year, x: margin.left + slotWidth * index, y: margin.top,
    width: slotWidth, height: plotHeight + 58, centerX: margin.left + slotWidth * (index + 0.5),
  }));
  const bars = years.flatMap((points, yearIndex) => points.map((observation, genderIndex) => {
    const centerX = yearZones[yearIndex].centerX;
    const x = centerX + (genderIndex === 0 ? -1 : 1) * (barWidth + barGap) / 2;
    const endY = y(observation.realGrowth ?? 0);
    return {
      observation, x, centerX, endY, top: Math.min(zeroY, endY), height: Math.abs(endY - zeroY),
      labelY: endY + (observation.realGrowth !== null && observation.realGrowth < 0 ? fontSize + 8 : -8),
      labelWidth: barLabelUnits(observation.realGrowth) * fontSize,
    };
  }));
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step);
  return { width, height: margin.top + plotHeight + margin.bottom, margin, plotHeight, slotWidth, barWidth, zeroY, min, max, ticks, bars, yearZones, fontSize, compactLabels, y };
}
