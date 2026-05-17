import { stat } from "node:fs/promises";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getApprenticeshipDetailViewModelIndex } from "@/lib/apprenticeship-detail-view-models";
import { getHourlySalaryPages } from "@/lib/hourly-salary-pages";
import { getDynamicOccupationPageEntries } from "@/lib/occupation-detail-page-resolver";
import { listOccupationGroups } from "@/lib/occupation-groups";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getAbsoluteUrl } from "@/lib/site-config";

const staticRoutes = [
  { path: "/", filePath: "src/app/page.tsx", priority: 1, changeFrequency: "weekly" as const },
  {
    path: "/lonnsjekk",
    filePath: "src/app/lonnsjekk/page.tsx",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/lonnskalkulator",
    filePath: "src/app/lonnskalkulator/page.tsx",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/lanekalkulator",
    filePath: "src/app/lanekalkulator/page.tsx",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/verktoy",
    filePath: "src/app/verktoy/page.tsx",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/ressurser",
    filePath: "src/app/ressurser/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/ressurser/sjekkliste-for-lonnssamtale",
    filePath: "src/app/ressurser/sjekkliste-for-lonnssamtale/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/ressurser/sjekkliste-vurdere-mer-lonn",
    filePath: "src/app/ressurser/sjekkliste-vurdere-mer-lonn/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/analyse",
    filePath: "src/app/analyse/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/kvinner-vs-menn",
    filePath: "src/app/kvinner-vs-menn/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/topp-jobber",
    filePath: "src/app/topp-jobber/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/yrkesgrupper",
    filePath: "src/app/yrkesgrupper/page.tsx",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/yrker",
    filePath: "src/app/yrker/page.tsx",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/timelonn",
    filePath: "src/app/timelonn/page.tsx",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/laerling",
    filePath: "src/app/laerling/page.tsx",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/yrkesgrupper/yrker",
    filePath: "src/app/yrkesgrupper/yrker/page.tsx",
    priority: 0.5,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/blogg",
    filePath: "src/app/blogg/page.tsx",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/spesial",
    filePath: "src/app/spesial/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/spesial/topp-10-yrker",
    filePath: "src/app/spesial/topp-10-yrker/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/spesial/i-disse-yrkene-oker-kvinneandelen-raskest",
    filePath: "src/app/spesial/i-disse-yrkene-oker-kvinneandelen-raskest/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/om",
    filePath: "src/app/om/page.tsx",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/hjelpeside",
    filePath: "src/app/hjelpeside/page.tsx",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/kilder",
    filePath: "src/app/kilder/page.tsx",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/ordbok",
    filePath: "src/app/ordbok/page.tsx",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/redaksjonelle-retningslinjer",
    filePath: "src/app/redaksjonelle-retningslinjer/page.tsx",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/personvern",
    filePath: "src/app/personvern/page.tsx",
    priority: 0.2,
    changeFrequency: "yearly" as const,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, occupationPages, hourlySalaryPages, occupationIndex, apprenticeshipIndex] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getDynamicOccupationPageEntries().catch(() => []),
    getHourlySalaryPages().catch(() => []),
    getOccupationDetailViewModelIndex().catch(() => null),
    getApprenticeshipDetailViewModelIndex().catch(() => null),
  ]);

  const latestBlogDate = getLatestDate(blogPosts.map((post) => post.publishedAt));
  const occupationContentLastModified = occupationIndex?.generatedAt
    ? new Date(occupationIndex.generatedAt)
    : undefined;
  const apprenticeshipContentLastModified = apprenticeshipIndex?.generatedAt
    ? new Date(apprenticeshipIndex.generatedAt)
    : undefined;

  const routes: MetadataRoute.Sitemap = await Promise.all(staticRoutes.map(async (route) => ({
      url: getAbsoluteUrl(route.path),
      lastModified:
        route.path === "/blogg"
          ? latestBlogDate
          : await readLastModifiedFromFile(route.filePath),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })));

  const groupRoutes: MetadataRoute.Sitemap = listOccupationGroups().map((group) => ({
    url: getAbsoluteUrl(`/yrkesgrupper/${group.slug}`),
    lastModified: occupationContentLastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: getAbsoluteUrl(`/blogg/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
    images: post.coverImage ? [getAbsoluteUrl(post.coverImage)] : undefined,
  }));

  const occupationRoutes: MetadataRoute.Sitemap = occupationPages.map((entry) => ({
    url: getAbsoluteUrl(entry.page.href),
    lastModified: occupationContentLastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const hourlySalaryRoutes: MetadataRoute.Sitemap = hourlySalaryPages.map((page) => ({
    url: getAbsoluteUrl(page.href),
    lastModified: occupationContentLastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const apprenticeshipRoutes: MetadataRoute.Sitemap = (apprenticeshipIndex?.pages ?? []).map((page) => ({
    url: getAbsoluteUrl(`/laerling/${page.slug}`),
    lastModified: apprenticeshipContentLastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...routes,
    ...groupRoutes,
    ...blogRoutes,
    ...occupationRoutes,
    ...hourlySalaryRoutes,
    ...apprenticeshipRoutes,
  ];
}

async function readLastModifiedFromFile(filePath: string) {
  try {
    const fileStats = await stat(path.join(process.cwd(), filePath));
    return fileStats.mtime;
  } catch {
    return undefined;
  }
}

function getLatestDate(values: Array<string | Date>) {
  const timestamps = values
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()))
    .map((value) => value.getTime());

  if (timestamps.length === 0) {
    return undefined;
  }

  return new Date(Math.max(...timestamps));
}
