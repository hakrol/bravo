import type { SalaryGenderGapDataset } from "@/lib/salary-gender-gap";

// Fiktive medianlønninger, med begge retninger, lik lønn og små forskjeller.
export const salaryGenderGapTestDataset: SalaryGenderGapDataset = {
  title: "Slik har lønnsforskjellen utviklet seg",
  source: "Fiktive medianlønninger for testing",
  isTestData: true,
  points: [
    { year: 2016, men: 45200, women: 42100 },
    { year: 2017, men: 46600, women: 44200 },
    { year: 2018, men: 48200, women: 47500 },
    { year: 2019, men: 49400, women: 49600 },
    { year: 2020, men: 50800, women: 50800 },
    { year: 2021, men: 52600, women: 52550 },
    { year: 2022, men: 55200, women: 56700 },
    { year: 2023, men: 57800, women: 59300 },
    { year: 2024, men: 60800, women: 58800 },
    { year: 2025, men: 63900, women: 61100 },
  ],
};
