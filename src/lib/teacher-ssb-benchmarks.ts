import "server-only";

import {
  getSalaryCalculatorSsbBenchmarks,
  type SalaryCalculatorSsbBenchmark,
} from "./salary-calculator-ssb";

export type TeacherSsbBenchmarkId = "primary-school" | "upper-secondary";
export type TeacherSsbBenchmark = SalaryCalculatorSsbBenchmark<TeacherSsbBenchmarkId>;

const definitions = {
  "primary-school": {
    occupationCode: "2341",
    occupationHref: "/yrke/grunnskolelaerere-lonn",
  },
  "upper-secondary": {
    occupationCode: "2330",
    occupationHref: "/yrke/lektorer-mv-videregaende-skole-lonn",
  },
} as const;

export function getTeacherSsbBenchmarks() {
  return getSalaryCalculatorSsbBenchmarks<TeacherSsbBenchmarkId>(definitions);
}
