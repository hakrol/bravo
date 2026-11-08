import { realWageTestDataset } from "@/lib/development-real-wage-data";
import type { RealWageLineDataset } from "@/lib/real-wage-line";

// Egen fiktiv totalserie, ikke et uvektet gjennomsnitt av kvinner og menn.
const combinedGrowthRates = [2.3, 3.1, 2.6, 4.2, 1.3, 3.4, 4.2, 5.2, 5.8, 4.7];
let previousSalary = 42000;

export const realWageLineTestDataset: RealWageLineDataset = {
  title: "Slik endrer kjøpekraften seg fra år til år",
  source: "Fiktive lønnstall og KPI-tall for testing",
  isTestData: true,
  baseline: { ...realWageTestDataset.baseline!, both: previousSalary },
  points: realWageTestDataset.points.map((point, index) => {
    previousSalary *= 1 + combinedGrowthRates[index] / 100;
    return { ...point, both: previousSalary };
  }),
};
