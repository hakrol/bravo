import snapshot from "@/content/blog/data/politi-interaktive-diagrammer-2025.json";
import { BlogGenderSalaryExplorer } from "@/components/blog-gender-salary-explorer";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";
import type { RealWageDataset } from "@/lib/real-wage-growth";
import type { SalaryGenderGapDataset } from "@/lib/salary-gender-gap";
import type { WorkforceGrowthDataset } from "@/lib/workforce-growth";

export function PoliceGenderSalaryExplorer() {
  return <BlogGenderSalaryExplorer {...snapshot.genderSalary} />;
}

export function PoliceOccupationSalaryComparisonExplorer() {
  return (
    <OccupationSalaryComparisonExplorer
      dataset={snapshot.comparison satisfies OccupationSalaryComparisonDataset}
      selectedOccupationCode="3355"
    />
  );
}

export function PoliceSalaryGenderGapExplorer() {
  return <SalaryGenderGapExplorer dataset={snapshot.genderGap satisfies SalaryGenderGapDataset} />;
}

export function PoliceRealWageGrowthExplorer() {
  return <RealWageGrowthExplorer dataset={snapshot.realWage satisfies RealWageDataset} />;
}

export function PoliceWorkforceGrowthExplorer() {
  return <WorkforceGrowthExplorer dataset={snapshot.workforce satisfies WorkforceGrowthDataset} />;
}
