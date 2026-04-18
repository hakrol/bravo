import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { NorwaySalaryViewModel } from "@/lib/types";

const NORWAY_SALARY_VIEW_MODEL_PATH = path.join(
  process.cwd(),
  "src",
  "lib",
  "generated",
  "norway-salary-view-model",
  "index.json",
);

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

export const getNorwaySalaryViewModel = cache(async () => {
  return readJsonFile<NorwaySalaryViewModel>(NORWAY_SALARY_VIEW_MODEL_PATH);
});

