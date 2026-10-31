import snapshot from "@/content/blog/data/kjemiker-lonn-2026.json";
import { BlogGenderSalaryExplorer } from "@/components/blog-gender-salary-explorer";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";

export function ChemistGenderSalaryExplorer() {
  return <BlogGenderSalaryExplorer {...snapshot.genderSalary} />;
}

export function ChemistOccupationSalaryComparisonExplorer() {
  return <OccupationSalaryComparisonExplorer dataset={snapshot.comparison} selectedOccupationCode="2113" />;
}

export function ChemistSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={snapshot.genderGap} />;
}

export function ChemistRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={snapshot.realWage} />;
}

export function ChemistWorkforceGrowthExplorer() {
  return <WorkforceGrowthExplorer dataset={snapshot.workforce} />;
}
