import snapshot from "@/content/blog/data/vektere-interaktiv-lonnsutvikling-2025.json";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";
import type { RealWageDataset } from "@/lib/real-wage-growth";
import type { SalaryGenderGapDataset } from "@/lib/salary-gender-gap";

const genderPoints = snapshot.points.map((point, index) => ({
  year: point.year,
  median: point.value,
  women: snapshot.womenPoints[index].value,
  men: snapshot.menPoints[index].value,
  cpi: snapshot.inflation.points[index].value,
}));

const genderDataset = {
  title: "Slik har lønnsforskjellen blant vektere utviklet seg",
  source: snapshot.source,
  points: genderPoints,
} satisfies SalaryGenderGapDataset;

const realWageDataset = {
  title: "Slik har kjøpekraften til vektere utviklet seg",
  source: `${snapshot.source} og 14700 · KPI for november`,
  baseline: snapshot.realWageBaseline,
  points: genderPoints,
} satisfies RealWageDataset;

const currentCpi = snapshot.inflation.points.at(-1)!;
const previousCpi = snapshot.inflation.points.at(-2)!;
const comparisonDataset = {
  ...snapshot.comparison,
  inflation: {
    year: currentCpi.year,
    annualGrowth: (currentCpi.value / previousCpi.value - 1) * 100,
    source: `${snapshot.inflation.source} · november til november`,
  },
  points: snapshot.comparison.points.map((point) => ({
    ...point,
    nominalGrowth: (point.medianMonthlySalary / point.previousMedianMonthlySalary - 1) * 100,
  })),
} satisfies OccupationSalaryComparisonDataset;

export function VekterSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={genderDataset} />;
}

export function VekterRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={realWageDataset} />;
}

export function VekterOccupationSalaryComparisonExplorer() {
  return <OccupationSalaryComparisonExplorer dataset={comparisonDataset} selectedOccupationCode="5414" />;
}
