import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { OccupationDescription } from "@/lib/occupation-descriptions";
import type { OccupationDetailPage } from "@/lib/occupation-detail-pages";
import type { OccupationDetailPageData } from "@/lib/occupation-detail-view-model-types";

const OCCUPATION_DETAIL_VIEW_MODELS_DIR = path.join(
  process.cwd(),
  "src",
  "lib",
  "generated",
  "occupation-detail-view-models",
);
const OCCUPATION_DETAIL_VIEW_MODELS_INDEX_PATH = path.join(
  OCCUPATION_DETAIL_VIEW_MODELS_DIR,
  "index.json",
);

export type OccupationDetailViewModel = {
  detailPage: OccupationDetailPage;
  relatedPages: OccupationDetailPage[];
  occupationDescription: OccupationDescription | null;
  data: OccupationDetailPageData;
};

type OccupationDetailViewModelIndex = {
  version: number;
  generatedAt: string;
  pages: Array<{
    slug: string;
    occupationCode: string;
    fileName: string;
  }>;
};

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

export const getOccupationDetailViewModelIndex = cache(async () => {
  return readJsonFile<OccupationDetailViewModelIndex>(
    OCCUPATION_DETAIL_VIEW_MODELS_INDEX_PATH,
  );
});

export async function getOccupationDetailViewModelStaticParams() {
  const index = await getOccupationDetailViewModelIndex();

  return index.pages.map((page) => ({ slug: page.slug }));
}

export const getOccupationDetailViewModelBySlug = cache(async (slug: string) => {
  const index = await getOccupationDetailViewModelIndex();
  const page = index.pages.find((entry) => entry.slug === slug);

  if (!page) {
    return null;
  }

  return readJsonFile<OccupationDetailViewModel>(
    path.join(OCCUPATION_DETAIL_VIEW_MODELS_DIR, page.fileName),
  );
});
