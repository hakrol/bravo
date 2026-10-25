import arealPlannerSnapshot from "@/content/blog/data/arealplanlegger-interaktiv-lonnsutvikling-2025.json";
import rorleggerSnapshot from "@/content/blog/data/rorlegger-interaktiv-lonnsutvikling-2025.json";
import vekterSnapshot from "@/content/blog/data/vektere-interaktiv-lonnsutvikling-2025.json";
import engineerSnapshot from "@/content/blog/data/sivilingeniorer-lonn-2025.json";
import storeManagerSnapshot from "@/content/blog/data/butikksjef-interaktive-diagrammer-2025.json";
import type { SalaryGrowthSnapshot } from "@/lib/salary-growth-snapshot";

// Registrer faktiske bloggdata her. Testdata brukes bare av utviklingsvisningen.
const snapshots = {
  ...engineerSnapshot.salaryGrowthSnapshots,
  "arealplanlegger-lonnsutvikling-2025": arealPlannerSnapshot,
  "rorlegger-lonnsutvikling-2025": rorleggerSnapshot,
  "vektere-lonnsutvikling-2025": vekterSnapshot,
  "butikksjef-lonnsutvikling-2025": storeManagerSnapshot.salaryGrowth,
} satisfies Record<string, SalaryGrowthSnapshot>;

export type BlogSalaryGrowthSnapshotId = keyof typeof snapshots;

export function getBlogSalaryGrowthSnapshot(snapshotId: BlogSalaryGrowthSnapshotId): SalaryGrowthSnapshot {
  if (!Object.prototype.hasOwnProperty.call(snapshots, snapshotId)) {
    throw new Error(`Ukjent snapshotId for Interaktiv lønnsutvikling: ${snapshotId}`);
  }

  return snapshots[snapshotId];
}
