import "server-only";

import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { findGrunnbeloepForDate } from "./nav";
import type { NavGrunnbeloepHistorySnapshot } from "./nav";

const GENERATED_DIR = path.join(process.cwd(), "src", "lib", "generated");
const GRUNNBELOEP_HISTORY_PATH = path.join(GENERATED_DIR, "nav-grunnbeloep-history.json");

const readJsonFile = cache(async <T>(filePath: string): Promise<T> => {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
});

export const getStoredGrunnbeloepHistory = cache(
  async (): Promise<NavGrunnbeloepHistorySnapshot> => {
    return readJsonFile<NavGrunnbeloepHistorySnapshot>(GRUNNBELOEP_HISTORY_PATH);
  },
);

export const getLatestStoredGrunnbeloep = cache(async () => {
  const snapshot = await getStoredGrunnbeloepHistory();
  return snapshot.latest;
});

export async function getStoredGrunnbeloepForDate(date: string | Date) {
  const snapshot = await getStoredGrunnbeloepHistory();
  return findGrunnbeloepForDate(snapshot.entries, date);
}
