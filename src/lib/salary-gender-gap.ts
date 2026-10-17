export type SalaryGenderGapPoint = {
  year: number;
  /** Nominell median månedslønn for menn, i kroner. */
  men: number;
  /** Nominell median månedslønn for kvinner, i kroner, med samme populasjon som menns tall. */
  women: number;
};

export type SalaryGenderGapDataset = {
  title: string;
  source: string;
  isTestData?: boolean;
  points: SalaryGenderGapPoint[];
};

const currency = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const percentage = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatGenderGapSalary(value: number) {
  return `${currency.format(value)} kr`;
}

export function getSalaryGenderGap(point: SalaryGenderGapPoint) {
  const difference = point.men - point.women;
  return {
    difference,
    absoluteDifference: Math.abs(difference),
    percent: (difference / point.men) * 100,
    low: Math.min(point.men, point.women),
    high: Math.max(point.men, point.women),
    higherGender: difference > 0 ? "men" as const : difference < 0 ? "women" as const : null,
  };
}

export function formatGenderGapPercent(value: number) {
  if (value === 0) return "0 %";
  // Retningen vises med kjønnsfargen og teksten om hvem som tjener mest.
  return `${percentage.format(Math.abs(value))} %`;
}

export function prepareSalaryGenderGapPoints(points: SalaryGenderGapPoint[]) {
  const years = new Set<number>();
  for (const point of points) {
    if (!Number.isInteger(point.year) || years.has(point.year)
      || !Number.isFinite(point.men) || !Number.isFinite(point.women)
      || point.men <= 0 || point.women <= 0) {
      throw new Error("Lønnsforskjellsdiagrammet krever unike årstall og positive, endelige lønnsverdier.");
    }
    years.add(point.year);
  }
  return [...points].sort((a, b) => a.year - b.year).slice(-10);
}

function niceStep(value: number) {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, value)));
  return Math.max(1, ([1, 2, 5, 10].find((factor) => factor * magnitude >= value) ?? 10) * magnitude);
}

/** Stolpens topp er høyeste lønn, aldri summen av de to lønningene. */
export function buildSalaryGenderGapGeometry(points: SalaryGenderGapPoint[], availableWidth: number) {
  if (points.length === 0) throw new Error("Diagrammet trenger minst ett år med lønnsdata.");
  const gaps = points.map(getSalaryGenderGap);
  const lowest = Math.min(...gaps.map((gap) => gap.low));
  const highest = Math.max(...gaps.map((gap) => gap.high));
  const span = Math.max(highest - lowest, highest * 0.12, 1);
  const step = niceStep(span / 4);
  const min = Math.max(0, Math.floor((lowest - span * 0.14) / step) * step);
  const margin = { top: 38, left: availableWidth < 440 ? 72 : 80, right: 24, bottom: 54 };
  const plotHeight = 330;
  // Fast luft til begge lønnsverdiene. Skalaen endres ikke ved hover eller trykk.
  const labelHeadroom = 80 / plotHeight;
  const max = Math.ceil(Math.max(highest + span * 0.22,
    (highest - labelHeadroom * min) / (1 - labelHeadroom)) / step) * step;
  const height = margin.top + plotHeight + margin.bottom;
  const labelWidth = Math.max(...gaps.map((gap) => formatGenderGapPercent(gap.percent).length * 7.5 + 14));
  // Hele perioden får plass. Tette etiketter begrenses til valgt år i komponenten.
  const minimumSlotWidth = Math.max(48, labelWidth);
  const width = Math.max(280, availableWidth);
  const plotWidth = width - margin.left - margin.right;
  const slotWidth = plotWidth / points.length;
  const barWidth = Math.min(36, slotWidth * 0.4);
  const baseline = margin.top + plotHeight;
  const y = (value: number) => margin.top + ((max - value) / (max - min)) * plotHeight;
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step);
  const bars = points.map((point, index) => {
    const gap = gaps[index];
    const x = margin.left + slotWidth * (index + 0.5);
    const highY = y(gap.high);
    const lowY = y(gap.low);
    return {
      point, gap, x, highY, lowY,
      baseHeight: baseline - lowY,
      gapHeight: lowY - highY,
      measureX: x + barWidth / 2 + Math.min(9, slotWidth * 0.15),
      // Pilspissene krymper ved små forskjeller; de forlenger aldri målelinjen.
      arrowSize: Math.min(3.5, (lowY - highY) / 3),
      percentY: highY - 14,
    };
  });
  return { width, height, margin, min, max, ticks, plotWidth, plotHeight, baseline, slotWidth, barWidth, bars, y,
    compactLabels: slotWidth < minimumSlotWidth };
}

/** Plasserer to verdier over valgt stolpe, innenfor den synlige delen ved scrolling. */
export function placeSalaryGenderGapValues(
  chart: ReturnType<typeof buildSalaryGenderGapGeometry>,
  year: number,
  viewport: { left: number; width: number },
) {
  const active = chart.bars.find((bar) => bar.point.year === year);
  if (!active) return null;
  if (active.x + chart.barWidth / 2 <= viewport.left
    || active.x - chart.barWidth / 2 >= viewport.left + viewport.width) return null;
  const menText = formatGenderGapSalary(active.point.men);
  const womenText = formatGenderGapSalary(active.point.women);
  const fontSize = viewport.width < 440 ? 12 : 14;
  const width = Math.max(menText.length, womenText.length) * 8 + 32;
  const leftBound = Math.max(chart.margin.left + 8, viewport.left + 8);
  const rightBound = Math.min(chart.width - chart.margin.right - 8, viewport.left + viewport.width - 8);
  const center = Math.min(rightBound - width / 2, Math.max(leftBound + width / 2, active.x));
  const left = center - width / 2;
  const right = left + width;
  let bottom = active.percentY - 20;
  for (const bar of chart.bars) {
    const percentHalfWidth = formatGenderGapPercent(bar.gap.percent).length * 7.5 / 2 + 4;
    if (left < bar.x + 3 + percentHalfWidth && right > bar.x + 3 - percentHalfWidth) {
      bottom = Math.min(bottom, bar.percentY - 20);
    }
    if (left < bar.x + chart.barWidth / 2 && right > bar.x - chart.barWidth / 2) {
      bottom = Math.min(bottom, bar.highY - 8);
    }
  }
  const top = bottom - 40;
  const womenFirst = active.point.women > active.point.men;
  return {
    left, right, top, bottom, width, fontSize, menText, womenText,
    menY: top + (womenFirst ? 35 : 15),
    womenY: top + (womenFirst ? 15 : 35),
  };
}
