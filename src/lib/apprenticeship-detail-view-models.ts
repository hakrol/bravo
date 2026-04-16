import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { ApprenticeshipSalaryDetailPageData } from "@/components/apprenticeship-salary-detail-page";
import type { OccupationDescription } from "@/lib/occupation-descriptions";
import type { ApprenticeshipDetailPage } from "@/lib/apprenticeship-detail-pages";

const APPRENTICESHIP_DETAIL_VIEW_MODELS_DIR = path.join(
  process.cwd(),
  "src",
  "lib",
  "generated",
  "apprenticeship-detail-view-models",
);
const APPRENTICESHIP_DETAIL_VIEW_MODELS_INDEX_PATH = path.join(
  APPRENTICESHIP_DETAIL_VIEW_MODELS_DIR,
  "index.json",
);

export type ApprenticeshipDetailViewModel = {
  detailPage: ApprenticeshipDetailPage;
  relatedPages: ApprenticeshipDetailPage[];
  occupationDescription: OccupationDescription | null;
  data: ApprenticeshipSalaryDetailPageData;
};

type ApprenticeshipDetailViewModelIndex = {
  version: number;
  generatedAt: string;
  sourceGeneratedAt?: string;
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

export const getApprenticeshipDetailViewModelIndex = cache(async () => {
  return readJsonFile<ApprenticeshipDetailViewModelIndex>(
    APPRENTICESHIP_DETAIL_VIEW_MODELS_INDEX_PATH,
  );
});

export async function getApprenticeshipDetailViewModelStaticParams() {
  const index = await getApprenticeshipDetailViewModelIndex();
  return index.pages.map((page) => ({ slug: page.slug }));
}

export const getApprenticeshipDetailPageByOccupationCode = cache(async (occupationCode: string) => {
  const index = await getApprenticeshipDetailViewModelIndex();
  const page = index.pages.find((entry) => entry.occupationCode === occupationCode);

  if (!page) {
    return null;
  }

  return {
    occupationCode: page.occupationCode,
    slug: page.slug,
    href: `/laerling/${page.slug}`,
  };
});

export const getApprenticeshipDetailViewModelBySlug = cache(async (slug: string) => {
  const index = await getApprenticeshipDetailViewModelIndex();
  const page = index.pages.find((entry) => entry.slug === slug);

  if (!page) {
    return null;
  }

  return readJsonFile<ApprenticeshipDetailViewModel>(
    path.join(APPRENTICESHIP_DETAIL_VIEW_MODELS_DIR, page.fileName),
  );
});
