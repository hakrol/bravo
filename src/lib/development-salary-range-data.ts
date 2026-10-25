import type { SalaryRangeDataset } from "@/lib/salary-range";

// Fiktive kvartiler, ikke statistikk for personalsjefer. Samlede kvartiler oppgis separat.
export const salaryRangeTestDataset: SalaryRangeDataset = {
  title: "Slik har lønnsspennet utviklet seg",
  source: "Fiktive kvartiltall for testing",
  isTestData: true,
  points: [
    { year: 2016, all: { p25: 51000, median: 64500, p75: 80000 }, women: { p25: 49000, median: 62000, p75: 78000 }, men: { p25: 54000, median: 68000, p75: 82000 } },
    { year: 2017, all: { p25: 53000, median: 66500, p75: 83000 }, women: { p25: 51000, median: 64000, p75: 81000 }, men: { p25: 56000, median: 70000, p75: 84000 } },
    { year: 2018, all: { p25: 55000, median: 69500, p75: 86000 }, women: { p25: 53500, median: 67500, p75: 85000 }, men: { p25: 58000, median: 72500, p75: 87000 } },
    { year: 2019, all: { p25: 58000, median: 73000, p75: 89500 }, women: { p25: 56000, median: 71000, p75: 89000 }, men: { p25: 60500, median: 75000, p75: 90000 } },
    { year: 2020, all: { p25: 59000, median: 74800, p75: 92500 }, women: { p25: 57500, median: 74000, p75: 93000 }, men: { p25: 62000, median: 76000, p75: 91500 } },
    { year: 2021, all: { p25: 62000, median: 77700, p75: 96500 }, women: { p25: 60000, median: 77500, p75: 98000 }, men: { p25: 64000, median: 78000, p75: 94500 } },
    { year: 2022, all: { p25: 65500, median: 81600, p75: 101000 }, women: { p25: 64000, median: 82000, p75: 103000 }, men: { p25: 67000, median: 81000, p75: 98000 } },
    { year: 2023, all: { p25: 69500, median: 85800, p75: 106500 }, women: { p25: 68000, median: 86500, p75: 109000 }, men: { p25: 71000, median: 85000, p75: 103000 } },
    { year: 2024, all: { p25: 73500, median: 90600, p75: 112000 }, women: { p25: 72000, median: 91000, p75: 115000 }, men: { p25: 74500, median: 90000, p75: 108000 } },
    { year: 2025, all: { p25: 77500, median: 95800, p75: 118000 }, women: { p25: 76000, median: 96000, p75: 121000 }, men: { p25: 79000, median: 95500, p75: 114000 } },
  ],
};
