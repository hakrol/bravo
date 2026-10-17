import type { RealWageDataset, RealWageYear } from "@/lib/real-wage-growth";

// Fiktive årlige vekstrater. 2015 brukes bare som beregningsgrunnlag for 2016.
const growthRates = [
  { year: 2016, women: 2.5, men: 2.2, cpi: 3.6, median: 41000 },
  { year: 2017, women: 3.2, men: 3.0, cpi: 1.8, median: 42100 },
  { year: 2018, women: 2.1, men: 3.0, cpi: 2.7, median: 43300 },
  { year: 2019, women: 4.4, men: 4.0, cpi: 2.2, median: 45000 },
  { year: 2020, women: 1.3, men: 1.3, cpi: 1.3, median: 45600 },
  { year: 2021, women: 3.7, men: 3.2, cpi: 3.5, median: 47000 },
  { year: 2022, women: 4.5, men: 4.0, cpi: 5.8, median: 49000 },
  { year: 2023, women: 5.0, men: 5.4, cpi: 5.5, median: 51600 },
  { year: 2024, women: 6.2, men: 5.5, cpi: 3.1, median: 54700 },
  { year: 2025, women: 4.8, men: 4.6, cpi: 3.0, median: 57200 },
];
const baseline = { year: 2015, women: 40400, men: 43200, cpi: 100 };
let previous = baseline;
const points: RealWageYear[] = growthRates.map((rate) => {
  const point = {
    year: rate.year, women: previous.women * (1 + rate.women / 100),
    men: previous.men * (1 + rate.men / 100), cpi: previous.cpi * (1 + rate.cpi / 100),
    median: rate.median,
  };
  previous = point;
  return point;
});

export const realWageTestDataset: RealWageDataset = {
  title: "Slik har kjøpekraften utviklet seg",
  source: "Fiktive lønnstall og KPI-tall for testing",
  isTestData: true,
  baseline,
  points,
};
