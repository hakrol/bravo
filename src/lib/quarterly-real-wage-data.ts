import "server-only";

import { getStoredDataset, getStoredQuarterlySalaryDataset } from "@/lib/ssb-store";
import { buildQuarterlyRealWageDataset, type QuarterlyRealWageSalaryMeasure } from "@/lib/quarterly-real-wage";
import { buildNationalRealWagePageData } from "@/lib/national-real-wage";

export async function getQuarterlyRealWageDataset(
  occupationCode = "0-9",
  salaryMeasure: QuarterlyRealWageSalaryMeasure = "GjMdTotal",
) {
  const [salary, inflation] = await Promise.all([
    getStoredQuarterlySalaryDataset("occupationQuarterlySalaryTimeSeries"),
    getStoredDataset("inflationQuarterSeries"),
  ]);
  return buildQuarterlyRealWageDataset(salary, inflation, occupationCode, salaryMeasure);
}

export async function getNationalRealWagePageData() {
  const [occupations, norway, inflation] = await Promise.all([
    getStoredQuarterlySalaryDataset("occupationQuarterlySalaryTimeSeries"),
    getStoredQuarterlySalaryDataset("norwayQuarterlySalaryTimeSeries"),
    getStoredDataset("inflationQuarterSeries"),
  ]);
  return buildNationalRealWagePageData(occupations, norway, inflation);
}
