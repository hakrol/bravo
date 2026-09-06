import "server-only";

import {
  getOccupationMedianSalaryOverview,
  OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
} from "./queries";

export type SalaryCalculatorSsbBenchmark<BenchmarkId extends string = string> = Readonly<{
  id: BenchmarkId;
  occupationCode: string;
  occupationLabel: string;
  occupationHref: string;
  monthlyMedianSalary: number;
  annualMedianSalary: number;
  period: string;
  source: "Statistisk sentralbyrå";
  sourceHref: "https://www.ssb.no/statbank/table/11418";
  tableId: "11418";
}>;

type BenchmarkDefinition = Readonly<{
  occupationCode: string;
  occupationHref: string;
}>;

export async function getSalaryCalculatorSsbBenchmarks<BenchmarkId extends string>(
  definitions: Readonly<Record<BenchmarkId, BenchmarkDefinition>>,
): Promise<Partial<Record<BenchmarkId, SalaryCalculatorSsbBenchmark<BenchmarkId>>>> {
  const entries = Object.entries(definitions) as Array<[BenchmarkId, BenchmarkDefinition]>;
  const overview = await getOccupationMedianSalaryOverview(
    entries.map(([, definition]) => definition.occupationCode),
    OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
  );
  const benchmarks: Partial<Record<BenchmarkId, SalaryCalculatorSsbBenchmark<BenchmarkId>>> = {};

  for (const [id, definition] of entries) {
    const observation = overview.rows.find(
      (row) => row.occupationCode === definition.occupationCode,
    );

    if (observation?.medianAll === undefined) continue;

    benchmarks[id] = {
      id,
      occupationCode: definition.occupationCode,
      occupationLabel: observation.occupationLabel,
      occupationHref: definition.occupationHref,
      monthlyMedianSalary: observation.medianAll,
      annualMedianSalary: observation.medianAll * 12,
      period: overview.periodLabel ?? "Ukjent periode",
      source: "Statistisk sentralbyrå",
      sourceHref: "https://www.ssb.no/statbank/table/11418",
      tableId: "11418",
    };
  }

  return benchmarks;
}
