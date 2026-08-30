import {
  teacherTariffAgreement,
  type TeacherPositionId,
  type TeacherTariffAreaId,
} from "./teacher-tariffs";
import {
  calculateMonthlySalary,
  findApplicableTariffStep,
  normalizeSeniority,
} from "./tariff-calculator";

export type TeacherSalaryCalculation = Readonly<{
  tariffAreaId: TeacherTariffAreaId;
  tariffAreaLabel: string;
  positionId: TeacherPositionId;
  positionLabel: string;
  seniorityYears: number;
  appliedStepYears: number;
  rateType: "garantilønn";
  annualSalary: number;
  monthlySalary: number;
}>;

export function calculateTeacherSalary(
  positionId: TeacherPositionId,
  seniorityYears: number,
): TeacherSalaryCalculation | null {
  const normalizedSeniority = normalizeSeniority(seniorityYears);
  const position = teacherTariffAgreement.positions.find(
    (item) => item.id === positionId,
  );

  if (!position || normalizedSeniority === null) return null;

  const step = findApplicableTariffStep(position.steps, normalizedSeniority);
  if (!step) return null;

  return {
    tariffAreaId: teacherTariffAgreement.id,
    tariffAreaLabel: teacherTariffAgreement.label,
    positionId,
    positionLabel: position.label,
    seniorityYears: normalizedSeniority,
    appliedStepYears: step.seniorityYears,
    rateType: "garantilønn",
    annualSalary: step.annualSalary,
    monthlySalary: calculateMonthlySalary(step.annualSalary),
  };
}

export function compareTeacherPositions(seniorityYears: number) {
  const normalizedSeniority = normalizeSeniority(seniorityYears);
  if (normalizedSeniority === null) return [];

  return teacherTariffAgreement.positions.flatMap((position) => {
    const step = findApplicableTariffStep(position.steps, normalizedSeniority);
    return step
      ? [{
          positionId: position.id,
          positionLabel: position.label,
          appliedStepYears: step.seniorityYears,
          annualSalary: step.annualSalary,
        }]
      : [];
  });
}
