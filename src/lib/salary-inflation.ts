export type AnnualValuePoint = {
  year: number;
  value: number;
};

/** Omregner lønn til referanseårets prisnivå uten å avrunde mellomregninger. */
export function adjustSalaryPointsForInflation(
  salaryPoints: AnnualValuePoint[],
  priceIndexPoints: AnnualValuePoint[],
  referenceYear: number,
): AnnualValuePoint[] | null {
  const priceIndexByYear = new Map(priceIndexPoints.map((point) => [point.year, point.value]));
  const referenceIndex = priceIndexByYear.get(referenceYear);

  if (!referenceIndex || !Number.isFinite(referenceIndex) || referenceIndex <= 0) {
    return null;
  }

  const adjustedPoints: AnnualValuePoint[] = [];

  for (const point of salaryPoints) {
    const priceIndex = priceIndexByYear.get(point.year);

    if (!priceIndex || !Number.isFinite(priceIndex) || priceIndex <= 0 || !Number.isFinite(point.value)) {
      return null;
    }

    adjustedPoints.push({
      year: point.year,
      value: point.value * (referenceIndex / priceIndex),
    });
  }

  return adjustedPoints;
}
