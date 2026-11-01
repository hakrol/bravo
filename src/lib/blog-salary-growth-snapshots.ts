import arealPlannerSnapshot from "@/content/blog/data/arealplanlegger-interaktiv-lonnsutvikling-2025.json";
import rorleggerSnapshot from "@/content/blog/data/rorlegger-interaktiv-lonnsutvikling-2025.json";
import vekterSnapshot from "@/content/blog/data/vektere-interaktiv-lonnsutvikling-2025.json";
import engineerSnapshot from "@/content/blog/data/sivilingeniorer-lonn-2025.json";
import storeManagerSnapshot from "@/content/blog/data/butikksjef-interaktive-diagrammer-2025.json";
import chemistSnapshot from "@/content/blog/data/kjemiker-lonn-2026.json";
import caretakerSnapshot from "@/content/blog/data/vaktmester-lonn-2026.json";
import dentistSnapshot from "@/content/blog/data/tannlege-lonn-2026.json";
import kindergartenTeacherSnapshot from "@/content/blog/data/barnehagelaerer-lonn-2025.json";
import kindergartenAssistantSnapshot from "@/content/blog/data/barnehageassistent-lonn-2025.json";
import type { SalaryGrowthSnapshot } from "@/lib/salary-growth-snapshot";

// Registrer faktiske bloggdata her. Testdata brukes bare av utviklingsvisningen.
const snapshots = {
  "barnehageassistent-lonnsutvikling-2025": kindergartenAssistantSnapshot.salaryGrowth,
  "barnehagelaerer-lonnsutvikling-2025": kindergartenTeacherSnapshot.salaryGrowth,
  ...engineerSnapshot.salaryGrowthSnapshots,
  "arealplanlegger-lonnsutvikling-2025": arealPlannerSnapshot,
  "rorlegger-lonnsutvikling-2025": rorleggerSnapshot,
  "vektere-lonnsutvikling-2025": vekterSnapshot,
  "butikksjef-lonnsutvikling-2025": storeManagerSnapshot.salaryGrowth,
  "kjemiker-lonnsutvikling-2026": chemistSnapshot.salaryGrowth,
  "vaktmester-lonnsutvikling-2026": caretakerSnapshot.salaryGrowth,
  "tannlege-lonnsutvikling-2026": dentistSnapshot.salaryGrowth,
} satisfies Record<string, SalaryGrowthSnapshot>;

export type BlogSalaryGrowthSnapshotId = keyof typeof snapshots;

export function getBlogSalaryGrowthSnapshot(snapshotId: BlogSalaryGrowthSnapshotId): SalaryGrowthSnapshot {
  if (!Object.prototype.hasOwnProperty.call(snapshots, snapshotId)) {
    throw new Error(`Ukjent snapshotId for Interaktiv lønnsutvikling: ${snapshotId}`);
  }

  return snapshots[snapshotId];
}
