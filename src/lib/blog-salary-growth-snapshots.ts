import arealPlannerSnapshot from "@/content/blog/data/arealplanlegger-interaktiv-lonnsutvikling-2025.json";
import type { SalaryGrowthSnapshot } from "@/lib/salary-growth-snapshot";

// Registrer faktiske bloggdata her. Testdata brukes bare av utviklingsvisningen.
const snapshots = {
  "arealplanlegger-lonnsutvikling-2025": arealPlannerSnapshot,
} satisfies Record<string, SalaryGrowthSnapshot>;

export type BlogSalaryGrowthSnapshotId = keyof typeof snapshots;

export function getBlogSalaryGrowthSnapshot(snapshotId: BlogSalaryGrowthSnapshotId): SalaryGrowthSnapshot {
  if (!Object.prototype.hasOwnProperty.call(snapshots, snapshotId)) {
    throw new Error(`Ukjent snapshotId for Interaktiv lønnsutvikling: ${snapshotId}`);
  }

  return snapshots[snapshotId];
}
