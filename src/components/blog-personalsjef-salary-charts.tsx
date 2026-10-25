import snapshot from "@/content/blog/data/personalsjef-lonn-2025.json";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { SalaryRangeExplorer } from "@/components/salary-range-explorer";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";
import type { RealWageDataset } from "@/lib/real-wage-growth";
import type { SalaryGenderGapDataset } from "@/lib/salary-gender-gap";
import type { SalaryRangeDataset } from "@/lib/salary-range";

const rangeDataset = snapshot.range satisfies SalaryRangeDataset;

const genderDataset = {
  title: "Slik har lønnsforskjellen blant personalsjefer utviklet seg",
  source: "SSB tabell 11418",
  points: snapshot.points,
} satisfies SalaryGenderGapDataset;

// November 2016 er grunnlaget for den første årlige endringen i 2017.
// Da unngår vi å sammenligne med septembermålingen fra 2015.
const realWageDataset = {
  title: "Slik har kjøpekraften til personalsjefer utviklet seg",
  source: "SSB tabell 11418 og 14700 · KPI for november",
  baseline: snapshot.points[0],
  points: snapshot.points.slice(1),
} satisfies RealWageDataset;

const current = snapshot.points.at(-1)!;
const previous = snapshot.points.at(-2)!;
const comparisonDataset = {
  ...snapshot.comparison,
  inflation: {
    year: current.year,
    annualGrowth: (current.cpi / previous.cpi - 1) * 100,
    source: "SSB tabell 14700 · november til november",
  },
  points: snapshot.comparison.points.map((point) => ({
    ...point,
    nominalGrowth: (point.medianMonthlySalary / point.previousMedianMonthlySalary - 1) * 100,
  })),
} satisfies OccupationSalaryComparisonDataset;

export function PersonalsjefSalaryRangeExplorer() {
  return <SalaryRangeExplorer dataset={rangeDataset} />;
}

export function PersonalsjefSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={genderDataset} />;
}

export function PersonalsjefRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={realWageDataset} />;
}

export function PersonalsjefOccupationSalaryComparisonExplorer() {
  return <OccupationSalaryComparisonExplorer dataset={comparisonDataset} selectedOccupationCode="1212" />;
}
