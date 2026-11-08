import snapshot from "@/content/blog/data/renholder-lonn-2025.json";
import { BlogGenderSalaryExplorer } from "@/components/blog-gender-salary-explorer";
import { SalaryRangeExplorer } from "@/components/salary-range-explorer";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";
import type { RealWageDataset } from "@/lib/real-wage-growth";
import type { SalaryGenderGapDataset } from "@/lib/salary-gender-gap";
import type { SalaryRangeDataset } from "@/lib/salary-range";
import type { WorkforceGrowthDataset } from "@/lib/workforce-growth";

export function CleanerGenderSalaryExplorer() {
  return <BlogGenderSalaryExplorer {...snapshot.genderSalary} />;
}

export function CleanerSalaryRangeExplorer() {
  return <SalaryRangeExplorer dataset={snapshot.range satisfies SalaryRangeDataset} />;
}

export function CleanerOccupationSalaryComparisonExplorer() {
  return (
    <OccupationSalaryComparisonExplorer
      dataset={snapshot.comparison satisfies OccupationSalaryComparisonDataset}
      selectedOccupationCode="9112"
    />
  );
}

export function CleanerSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={snapshot.genderGap satisfies SalaryGenderGapDataset} />;
}

export function CleanerRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={snapshot.realWage satisfies RealWageDataset} />;
}

export function CleanerWorkforceGrowthExplorer() {
  return <WorkforceGrowthExplorer dataset={snapshot.workforce satisfies WorkforceGrowthDataset} />;
}
