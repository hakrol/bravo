import snapshot from "@/content/blog/data/tannlege-lonn-2026.json";
import { BlogGenderSalaryExplorer } from "@/components/blog-gender-salary-explorer";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";

export function DentistGenderSalaryExplorer() {
  return <BlogGenderSalaryExplorer {...snapshot.genderSalary} />;
}

export function DentistOccupationSalaryComparisonExplorer() {
  return <OccupationSalaryComparisonExplorer dataset={snapshot.comparison} selectedOccupationCode="2261" />;
}

export function DentistSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={snapshot.genderGap} />;
}

export function DentistRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={snapshot.realWage} />;
}

export function DentistWorkforceGrowthExplorer() {
  return <WorkforceGrowthExplorer dataset={snapshot.workforce} />;
}
