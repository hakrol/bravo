import "server-only";

import {
  getSalaryCalculatorSsbBenchmarks,
  type SalaryCalculatorSsbBenchmark,
} from "./salary-calculator-ssb";

export type VernepleierSsbBenchmark = SalaryCalculatorSsbBenchmark<"vernepleier">;

export async function getVernepleierSsbBenchmark() {
  const benchmarks = await getSalaryCalculatorSsbBenchmarks({
    vernepleier: {
      occupationCode: "2224",
      occupationHref: "/yrke/vernepleiere-lonn",
    },
  });

  return benchmarks.vernepleier;
}
