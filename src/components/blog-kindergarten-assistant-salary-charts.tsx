import snapshot from "@/content/blog/data/barnehageassistent-lonn-2025.json";
import { BlogGenderSalaryExplorer } from "@/components/blog-gender-salary-explorer";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";
import type { RealWageDataset } from "@/lib/real-wage-growth";
import type { SalaryGenderGapDataset } from "@/lib/salary-gender-gap";
import type { WorkforceGrowthDataset } from "@/lib/workforce-growth";

export function KindergartenAssistantGenderSalaryExplorer() {
  return <BlogGenderSalaryExplorer {...snapshot.genderSalary} />;
}

export function KindergartenAssistantOccupationSalaryComparisonExplorer() {
  return (
    <OccupationSalaryComparisonExplorer
      dataset={snapshot.comparison satisfies OccupationSalaryComparisonDataset}
      selectedOccupationCode="5311"
    />
  );
}

export function KindergartenAssistantSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={snapshot.genderGap satisfies SalaryGenderGapDataset} />;
}

export function KindergartenAssistantRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={snapshot.realWage satisfies RealWageDataset} />;
}

export function KindergartenAssistantWorkforceGrowthExplorer() {
  return <WorkforceGrowthExplorer dataset={snapshot.workforce satisfies WorkforceGrowthDataset} />;
}
