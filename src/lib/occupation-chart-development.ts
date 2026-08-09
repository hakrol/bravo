export const OCCUPATION_CHART_HORIZONS = [
  { key: "1-year", label: "Det siste året", years: 1 },
  { key: "3-years", label: "De siste 3 årene", years: 3 },
  { key: "5-years", label: "De siste 5 årene", years: 5 },
  { key: "10-years", label: "De siste 10 årene", years: 10 },
] as const;

type DevelopmentPoint = {
  periodCode: string;
  periodLabel: string;
  value?: number;
};

export type OccupationChartDevelopmentResult = {
  endPeriodLabel: string;
  startPeriodLabel: string;
  value: number;
};

export function calculateEndpointDevelopment(
  points: DevelopmentPoint[],
  years: number,
  mode: "percent" | "difference",
): OccupationChartDevelopmentResult | null {
  const latestPoint = findLatestPoint(points);

  if (!latestPoint) {
    return null;
  }

  const latestCode = normalizePeriodCode(latestPoint.periodCode, latestPoint.periodLabel);
  const startCode = latestCode ? subtractYearsFromPeriodCode(latestCode, years) : null;
  const startPoint = startCode
    ? points.find(
        (point) => normalizePeriodCode(point.periodCode, point.periodLabel) === startCode,
      )
    : null;

  if (!startPoint || !isFiniteNumber(startPoint.value)) {
    return null;
  }

  if (mode === "percent" && startPoint.value === 0) {
    return null;
  }

  return {
    endPeriodLabel: latestPoint.periodLabel,
    startPeriodLabel: startPoint.periodLabel,
    value:
      mode === "percent"
        ? ((latestPoint.value - startPoint.value) / startPoint.value) * 100
        : latestPoint.value - startPoint.value,
  };
}

export function calculateCumulativeAnnualDevelopment(
  points: DevelopmentPoint[],
  years: number,
): OccupationChartDevelopmentResult | null {
  const latestPoint = findLatestPoint(points);

  if (!latestPoint) {
    return null;
  }

  const latestCode = normalizePeriodCode(latestPoint.periodCode, latestPoint.periodLabel);

  if (!latestCode) {
    return null;
  }

  const annualGrowthPoints = Array.from({ length: years }, (_, index) => {
    const periodCode = subtractYearsFromPeriodCode(latestCode, index);
    return points.find(
      (point) => normalizePeriodCode(point.periodCode, point.periodLabel) === periodCode,
    );
  });

  if (annualGrowthPoints.some((point) => !point || !isFiniteNumber(point.value))) {
    return null;
  }

  const startCode = subtractYearsFromPeriodCode(latestCode, years);
  const startPoint = points.find(
    (point) => normalizePeriodCode(point.periodCode, point.periodLabel) === startCode,
  );
  const cumulativeFactor = annualGrowthPoints.reduce(
    (factor, point) => factor * (1 + (point?.value ?? 0) / 100),
    1,
  );

  return {
    endPeriodLabel: latestPoint.periodLabel,
    startPeriodLabel: startPoint?.periodLabel ?? startCode,
    value: (cumulativeFactor - 1) * 100,
  };
}

function findLatestPoint(points: DevelopmentPoint[]) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index];

    if (isFiniteNumber(point.value)) {
      return point as DevelopmentPoint & { value: number };
    }
  }

  return null;
}

function normalizePeriodCode(periodCode: string, periodLabel: string) {
  const value = periodCode || periodLabel;
  const annualMatch = value.match(/^(\d{4})$/);

  if (annualMatch) {
    return annualMatch[1];
  }

  const quarterMatch = value.match(/^(\d{4})\s*K([1-4])$/i);
  return quarterMatch ? `${quarterMatch[1]}K${quarterMatch[2]}` : null;
}

function subtractYearsFromPeriodCode(periodCode: string, years: number) {
  const annualMatch = periodCode.match(/^(\d{4})$/);

  if (annualMatch) {
    return `${Number(annualMatch[1]) - years}`;
  }

  const quarterMatch = periodCode.match(/^(\d{4})K([1-4])$/i);
  return quarterMatch
    ? `${Number(quarterMatch[1]) - years}K${quarterMatch[2]}`
    : periodCode;
}

function isFiniteNumber(value?: number): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
