import {
  vernepleierTariffAgreements,
  type VernepleierPositionId,
  type VernepleierTariffAreaId,
} from "./vernepleier-tariffs";
import {
  calculateMonthlySalary,
  findApplicableTariffStep,
  normalizeSeniority,
} from "./tariff-calculator";

export { formatNok, formatNorwegianDate } from "./tariff-calculator";

export function getVernepleierPositions(tariffAreaId: VernepleierTariffAreaId) {
  return vernepleierTariffAgreements[tariffAreaId].positions;
}

export function calculateVernepleierSalary(
  tariffAreaId: VernepleierTariffAreaId,
  positionId: VernepleierPositionId,
  seniorityYears: number,
) {
  const normalizedSeniority = normalizeSeniority(seniorityYears);
  const agreement = vernepleierTariffAgreements[tariffAreaId];
  const position = agreement?.positions.find((item) => item.id === positionId);
  if (!agreement || !position || normalizedSeniority === null) return null;

  const step = findApplicableTariffStep(position.steps, normalizedSeniority);
  if (!step) return null;

  return {
    tariffAreaId,
    tariffAreaLabel: agreement.label,
    positionId,
    positionLabel: position.label,
    tariffCode: position.tariffCode,
    salaryGroup: position.salaryGroup,
    seniorityYears: normalizedSeniority,
    appliedStepYears: step.seniorityYears,
    rateType: agreement.rateType,
    annualSalary: step.annualSalary,
    monthlySalary: calculateMonthlySalary(step.annualSalary),
  } as const;
}
