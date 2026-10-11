import { SalaryGrowthExplorer } from "@/components/salary-growth-explorer";
import { getBlogSalaryGrowthSnapshot, type BlogSalaryGrowthSnapshotId } from "@/lib/blog-salary-growth-snapshots";

// MDX-komponenten for standarddiagrammet «Interaktiv lønnsutvikling».
export function BlogSalaryGrowthExplorer({ snapshotId }: { snapshotId: BlogSalaryGrowthSnapshotId }) {
  return <SalaryGrowthExplorer key={snapshotId} snapshot={getBlogSalaryGrowthSnapshot(snapshotId)} />;
}
