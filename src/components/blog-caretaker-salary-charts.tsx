import snapshot from "@/content/blog/data/vaktmester-lonn-2026.json";
import { BlogGenderSalaryExplorer } from "@/components/blog-gender-salary-explorer";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";

export function CaretakerGenderSalaryExplorer() {
  return <BlogGenderSalaryExplorer {...snapshot.genderSalary} />;
}

export function CaretakerOccupationSalaryComparisonExplorer() {
  return <OccupationSalaryComparisonExplorer dataset={snapshot.comparison} selectedOccupationCode="5153" />;
}

export function CaretakerSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={snapshot.genderGap} />;
}

export function CaretakerRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={snapshot.realWage} />;
}

export function CaretakerWorkforceGrowthExplorer() {
  return <WorkforceGrowthExplorer dataset={snapshot.workforce} />;
}
