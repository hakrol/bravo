import {
  tariffAgreements,
  tariffAreaIds,
  type NursingPosition,
  type NursingPositionId,
  type RateType,
  type TariffAreaId,
  type TariffStep,
} from "./nurse-tariffs";

export type BaseSalaryCalculation = Readonly<{
  tariffAreaId: TariffAreaId;
  tariffAreaLabel: string;
  positionId: NursingPositionId;
  positionLabel: string;
  seniorityYears: number;
  appliedStepYears: number;
  rateType: RateType;
  annualSalary: number;
  monthlySalary: number;
  supplements: null;
  estimatedTotalAnnualSalary: null;
}>;

export type TariffComparison = Readonly<{
  tariffAreaId: TariffAreaId;
  tariffAreaLabel: string;
  positionLabel: string;
  rateType: RateType;
  appliedStepYears: number;
  annualSalary: number;
}>;

export function getAvailablePositions(tariffAreaId: TariffAreaId) {
  return tariffAgreements[tariffAreaId].positions;
}

export function calculateBaseSalary(
  tariffAreaId: TariffAreaId,
  positionId: NursingPositionId,
  seniorityYears: number,
): BaseSalaryCalculation | null {
  const normalizedSeniority = normalizeSeniority(seniorityYears);
  const agreement = tariffAgreements[tariffAreaId];
  const position = agreement?.positions.find((item) => item.id === positionId);

  if (!agreement || !position || normalizedSeniority === null) return null;

  const step = findApplicableStep(position.steps, normalizedSeniority);
  if (!step) return null;

  return {
    tariffAreaId,
    tariffAreaLabel: agreement.label,
    positionId,
    positionLabel: position.label,
    seniorityYears: normalizedSeniority,
    appliedStepYears: step.seniorityYears,
    rateType: agreement.rateType,
    annualSalary: step.annualSalary,
    monthlySalary: Math.round(step.annualSalary / 12),
    supplements: null,
    estimatedTotalAnnualSalary: null,
  };
}

export function compareTariffAreas(position: NursingPosition, seniorityYears: number): TariffComparison[] {
  const normalizedSeniority = normalizeSeniority(seniorityYears);
  if (normalizedSeniority === null) return [];

  return tariffAreaIds.flatMap((tariffAreaId) => {
    const agreement = tariffAgreements[tariffAreaId];
    const comparablePosition = agreement.positions.find(
      (item) => item.comparisonGroup === position.comparisonGroup,
    );
    if (!comparablePosition) return [];

    const step = findApplicableStep(comparablePosition.steps, normalizedSeniority);
    return step
      ? [{
          tariffAreaId,
          tariffAreaLabel: agreement.shortLabel,
          positionLabel: comparablePosition.label,
          rateType: agreement.rateType,
          appliedStepYears: step.seniorityYears,
          annualSalary: step.annualSalary,
        }]
      : [];
  });
}

export function findApplicableStep(steps: readonly TariffStep[], seniorityYears: number): TariffStep | null {
  const normalizedSeniority = normalizeSeniority(seniorityYears);
  if (normalizedSeniority === null) return null;

  return [...steps]
    .sort((a, b) => b.seniorityYears - a.seniorityYears)
    .find((step) => step.seniorityYears <= normalizedSeniority) ?? null;
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

function normalizeSeniority(value: number) {
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.floor(value);
}
