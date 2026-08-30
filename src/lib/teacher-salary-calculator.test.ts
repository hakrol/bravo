import assert from "node:assert/strict";
import test from "node:test";
import { calculateTeacherSalary } from "./teacher-salary-calculator";
import type { TeacherPositionId } from "./teacher-tariffs";

const salaryCases: Array<[TeacherPositionId, number, number]> = [
  ["teacher", 0, 545_400],
  ["teacher", 7, 558_400],
  ["adjunct", 8, 622_000],
  ["adjunct-additional", 10, 686_000],
  ["lecturer", 10, 723_100],
  ["lecturer", 16, 797_500],
  ["lecturer-additional", 16, 833_300],
];

for (const [positionId, seniorityYears, expectedSalary] of salaryCases) {
  test(`${positionId} med ${seniorityYears} års ansiennitet`, () => {
    assert.equal(
      calculateTeacherSalary(positionId, seniorityYears)?.annualSalary,
      expectedSalary,
    );
  });
}

const seniorityCases: Array<[number, number]> = [
  [5, 0],
  [6, 6],
  [7, 6],
  [8, 8],
  [9, 8],
  [10, 10],
  [15, 10],
  [16, 16],
  [24, 16],
];

for (const [seniorityYears, expectedStep] of seniorityCases) {
  test(`${seniorityYears} år bruker ${expectedStep}-årstrinnet`, () => {
    assert.equal(
      calculateTeacherSalary("teacher", seniorityYears)?.appliedStepYears,
      expectedStep,
    );
  });
}

test("ugyldig ansiennitet avvises", () => {
  assert.equal(calculateTeacherSalary("teacher", -1), null);
  assert.equal(calculateTeacherSalary("teacher", Number.NaN), null);
});
