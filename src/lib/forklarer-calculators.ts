export function calculateRealWage(previousSalary: number, newSalary: number, inflationPercent: number) {
  if (
    ![previousSalary, newSalary, inflationPercent].every(Number.isFinite)
    || previousSalary <= 0
    || newSalary < 0
    || inflationPercent <= -100
  ) return null;

  const adjustedSalary = newSalary / (1 + inflationPercent / 100);
  const growthPercent = (adjustedSalary / previousSalary - 1) * 100;

  if (![adjustedSalary, growthPercent].every(Number.isFinite)) return null;

  return { adjustedSalary, growthPercent: Math.abs(growthPercent) < 1e-10 ? 0 : growthPercent };
}

export function calculateOvertimePay(hourlyRate: number, hours: number, supplementPercent: number) {
  if (
    ![hourlyRate, hours, supplementPercent].every(Number.isFinite)
    || hourlyRate < 0
    || hours < 0
    || supplementPercent < 40
  ) return null;

  const basePay = hourlyRate * hours;
  const supplement = basePay * (supplementPercent / 100);
  const total = basePay + supplement;

  if (![basePay, supplement, total].every(Number.isFinite)) return null;

  return { basePay, supplement, total };
}
