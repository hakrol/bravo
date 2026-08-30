import type { TariffStep } from "./tariff-model";

export function findApplicableTariffStep(
  steps: readonly TariffStep[],
  seniorityYears: number,
): TariffStep | null {
  const normalizedSeniority = normalizeSeniority(seniorityYears);
  if (normalizedSeniority === null) return null;

  return [...steps]
    .sort((a, b) => b.seniorityYears - a.seniorityYears)
    .find((step) => step.seniorityYears <= normalizedSeniority) ?? null;
}

export function normalizeSeniority(value: number) {
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.floor(value);
}

export function calculateMonthlySalary(annualSalary: number) {
  return Math.round(annualSalary / 12);
}

export function formatNok(amount: number) {
  return `${amount.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

export function formatNorwegianDate(date: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Oslo",
  }).format(new Date(`${date}T12:00:00+02:00`));
}
