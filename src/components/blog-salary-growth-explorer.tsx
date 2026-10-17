import { SalaryGrowthExplorer } from "@/components/salary-growth-explorer";
import { BlogSalaryGrowthPicker } from "@/components/blog-salary-growth-picker";
import { getBlogSalaryGrowthSnapshot, type BlogSalaryGrowthSnapshotId } from "@/lib/blog-salary-growth-snapshots";

// MDX-komponenten for standarddiagrammet «Interaktiv lønnsutvikling».
export function BlogSalaryGrowthExplorer({ snapshotId, snapshotIds }: {
  snapshotId: BlogSalaryGrowthSnapshotId;
  snapshotIds?: BlogSalaryGrowthSnapshotId[] | string;
}) {
  // Strengverdier bevares også når MDX filtrerer bort JavaScript-uttrykk.
  const additionalIds = typeof snapshotIds === "string"
    ? snapshotIds.split(/[\s,]+/).filter(Boolean) as BlogSalaryGrowthSnapshotId[]
    : snapshotIds ?? [];
  const ids = [...new Set([snapshotId, ...additionalIds])];
  if (ids.length > 1) {
    return <BlogSalaryGrowthPicker initialId={snapshotId} options={ids.map((id) => ({
      id,
      snapshot: getBlogSalaryGrowthSnapshot(id),
    }))} />;
  }
  return <SalaryGrowthExplorer key={snapshotId} snapshot={getBlogSalaryGrowthSnapshot(snapshotId)} />;
}
