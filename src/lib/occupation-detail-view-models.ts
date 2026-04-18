import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { OccupationSalaryDetailPageData } from "@/components/occupation-salary-detail-page";
import type { OccupationDescription } from "@/lib/occupation-descriptions";
import type { OccupationDetailPage } from "@/lib/occupation-detail-pages";

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
  data: OccupationSalaryDetailPageData;
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

export type TopPaidOccupationLink = {
  occupationCode: string;
  title: string;
  href: string;
  medianAll: number;
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

export const getTopPaidOccupationLinks = cache(async (limit = 2) => {
  const index = await getOccupationDetailViewModelIndex();
  const uniquePages = Array.from(
    new Map(index.pages.map((page) => [page.fileName, page])).values(),
  );
  const details = await Promise.all(
    uniquePages.map((page) =>
      readJsonFile<OccupationDetailViewModel>(
        path.join(OCCUPATION_DETAIL_VIEW_MODELS_DIR, page.fileName),
      ),
    ),
  );

  return details
    .map((detail) => ({
      occupationCode: detail.detailPage.occupationCode,
      title: detail.detailPage.displayLabel ?? detail.detailPage.editorialLabel ?? detail.detailPage.label,
      href: detail.detailPage.href,
      medianAll: detail.data.distribution?.total?.median,
    }))
    .filter((item): item is TopPaidOccupationLink => item.medianAll !== undefined)
    .sort((left, right) => right.medianAll - left.medianAll)
    .slice(0, limit);
});
