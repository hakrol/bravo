import "server-only";

import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  GeneratedSsbDatasetKey,
  GeneratedSsbManifest,
  SsbNormalizedDataset,
} from "./types";

const GENERATED_DIR = path.join(process.cwd(), "src", "lib", "generated");
const MANIFEST_PATH = path.join(GENERATED_DIR, "manifest.json");

const readJsonFile = cache(async <T>(filePath: string): Promise<T> => {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
});

export const getGeneratedSsbManifest = cache(async (): Promise<GeneratedSsbManifest> => {
  return readJsonFile<GeneratedSsbManifest>(MANIFEST_PATH);
});

export const getStoredDataset = cache(
  async (key: GeneratedSsbDatasetKey): Promise<SsbNormalizedDataset> => {
    const manifest = await getGeneratedSsbManifest();
    const entry = manifest.datasets.find((dataset) => dataset.key === key);

    if (!entry) {
      throw new Error(`Fant ikke generert SSB-datasett for ${key}. Kjør npm run ssb:sync.`);
    }

    return readJsonFile<SsbNormalizedDataset>(path.join(GENERATED_DIR, entry.fileName));
  },
);
