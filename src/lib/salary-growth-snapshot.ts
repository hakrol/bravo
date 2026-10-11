import type { AnnualValuePoint } from "@/lib/salary-inflation";

export type SalaryGrowthSnapshot = {
  title: string;
  subtitle: string;
  source: string;
  note: string;
  points: AnnualValuePoint[];
  womenPoints?: AnnualValuePoint[];
  menPoints?: AnnualValuePoint[];
  inflation: {
    source: string;
    sourceUrl?: string;
    referenceMonth: string;
    updated: string;
    points: AnnualValuePoint[];
  };
};
