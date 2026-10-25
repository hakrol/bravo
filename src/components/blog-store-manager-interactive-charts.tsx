import snapshot from "@/content/blog/data/butikksjef-interaktive-diagrammer-2025.json";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";
import type { WorkforceGrowthDataset } from "@/lib/workforce-growth";

const workforceDataset = snapshot.workforce satisfies WorkforceGrowthDataset;
const comparisonDataset = snapshot.comparison satisfies OccupationSalaryComparisonDataset;

export function StoreManagerWorkforceGrowthExplorer() {
  return <WorkforceGrowthExplorer dataset={workforceDataset} />;
}

export function StoreManagerOccupationSalaryComparisonExplorer() {
  return <OccupationSalaryComparisonExplorer dataset={comparisonDataset} selectedOccupationCode="5222" />;
}
