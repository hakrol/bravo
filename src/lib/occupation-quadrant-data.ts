import "server-only";

import { getStoredDataset } from "@/lib/ssb-store";
import { buildOccupationQuadrantDataset } from "@/lib/occupation-quadrant";

/** Bruk eksisterende SSB-lager uten ekstra API-kall eller kopierte snapshots. */
export async function getOccupationQuadrantDataset() {
  const [salary, workforce] = await Promise.all([
    getStoredDataset("occupationLatestMedian"),
    getStoredDataset("occupationWorkforceTimeSeries"),
  ]);
  return buildOccupationQuadrantDataset(salary, workforce);
}
