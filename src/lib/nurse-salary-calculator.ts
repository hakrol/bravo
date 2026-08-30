import {
  tariffAgreements,
  tariffAreaIds,
  type NursingPosition,
  type NursingPositionId,
  type RateType,
  type TariffAreaId,
} from "./nurse-tariffs";
import {
  calculateMonthlySalary,
  findApplicableTariffStep,
  normalizeSeniority,
} from "./tariff-calculator";

export { formatNok, formatNorwegianDate } from "./tariff-calculator";

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
    monthlySalary: calculateMonthlySalary(step.annualSalary),
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

export const findApplicableStep = findApplicableTariffStep;
