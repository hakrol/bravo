import "server-only";

import {
  getOccupationMedianSalaryOverview,
  OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
} from "./queries";
import type { NursingPositionId } from "./nurse-tariffs";

export type NurseSsbBenchmark = Readonly<{
  positionId: NursingPositionId;
  occupationCode: string;
  occupationLabel: string;
  occupationHref: string;
  monthlyMedianSalary: number;
  annualMedianSalary: number;
  period: string;
  source: string;
  sourceHref: string;
  tableId: string;
  updatedAt?: string;
}>;

const occupationByPosition: Record<
  NursingPositionId,
  Pick<NurseSsbBenchmark, "occupationCode" | "occupationHref">
> = {
  nurse: {
    occupationCode: "2223",
    occupationHref: "/yrke/sykepleiere-lonn",
  },
  specialist: {
    occupationCode: "2221",
    occupationHref: "/yrke/spesialsykepleiere-lonn",
  },
};

export async function getNurseSsbBenchmarks(): Promise<
  Partial<Record<NursingPositionId, NurseSsbBenchmark>>
> {
  const occupations = Object.values(occupationByPosition);
  const overview = await getOccupationMedianSalaryOverview(
    occupations.map((occupation) => occupation.occupationCode),
    OCCUPATION_CONTRACTED_MONTHLY_SALARY_FILTERS,
  );
  const benchmarks: Partial<Record<NursingPositionId, NurseSsbBenchmark>> = {};

  for (const [positionId, occupation] of Object.entries(occupationByPosition) as Array<
    [NursingPositionId, (typeof occupationByPosition)[NursingPositionId]]
  >) {
    const observation = overview.rows.find(
      (row) => row.occupationCode === occupation.occupationCode,
    );

    if (observation?.medianAll === undefined) {
      continue;
    }

    benchmarks[positionId] = {
      positionId,
      occupationCode: occupation.occupationCode,
      occupationLabel: observation.occupationLabel,
      occupationHref: occupation.occupationHref,
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
