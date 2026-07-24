import { stat } from "node:fs/promises";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { blogCategories } from "@/lib/blog-taxonomy";
import { getApprenticeshipDetailViewModelIndex } from "@/lib/apprenticeship-detail-view-models";
import { getAllForklarerPosts } from "@/lib/forklarer";
import { listOccupationAreas } from "@/lib/occupation-areas";
import { getDynamicOccupationPageEntries } from "@/lib/occupation-detail-page-resolver";
import { listOccupationFamilies } from "@/lib/occupation-families";
import { listOccupationGroups } from "@/lib/occupation-groups";
import { getOccupationDetailViewModelIndex } from "@/lib/occupation-detail-view-models";
import { getLatestOccupationMedianMonthlySalaryDataset } from "@/lib/ssb";
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
    path: "/bruttolonn-kalkulator",
    filePath: "src/app/bruttolonn-kalkulator/page.tsx",
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
    path: "/rente-og-avdrag-kalkulator",
    filePath: "src/app/rente-og-avdrag-kalkulator/page.tsx",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/kilometergodtgjorelse-kalkulator",
    filePath: "src/app/kilometergodtgjorelse-kalkulator/page.tsx",
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
    path: "/feriedager-norge",
    filePath: "src/app/feriedager-norge/page.tsx",
    priority: 0.7,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/feriekalkulator",
    filePath: "src/app/feriekalkulator/page.tsx",
    priority: 0.7,
    changeFrequency: "yearly" as const,
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
    path: "/lønnsforskjell-mellom-kvinner-og-menn",
    filePath: "src/app/lønnsforskjell-mellom-kvinner-og-menn/page.tsx",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/lønnsforskjeller-mellom-offentlige-og-private-yrker",
    filePath: "src/app/lønnsforskjeller-mellom-offentlige-og-private-yrker/page.tsx",
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
    changeFrequency: "monthly" as const,
  },
  {
    path: "/yrkesomrader",
    filePath: "src/app/yrkesomrader/page.tsx",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/yrkesfamilier",
    filePath: "src/app/yrkesfamilier/page.tsx",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/yrker",
    filePath: "src/app/yrker/page.tsx",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/laerling",
    filePath: "src/app/laerling/page.tsx",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/yrkesgrupper/yrker",
    filePath: "src/app/yrkesgrupper/yrker/page.tsx",
    priority: 0.5,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/blogg",
    filePath: "src/app/blogg/page.tsx",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/forklarer",
    filePath: "src/app/forklarer/page.tsx",
    priority: 0.6,
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
    path: "/kontakt",
    filePath: "src/app/kontakt/page.tsx",
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
    path: "/forfatter/redaksjonen",
    filePath: "src/app/forfatter/redaksjonen/page.tsx",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/metode",
    filePath: "src/app/metode/page.tsx",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/rettelser",
    filePath: "src/app/rettelser/page.tsx",
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
  const [
    blogPosts,
    forklarerPosts,
    occupationPages,
    occupationIndex,
    apprenticeshipIndex,
    occupationMedianDataset,
  ] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getAllForklarerPosts().catch(() => []),
    getDynamicOccupationPageEntries().catch(() => []),
    getOccupationDetailViewModelIndex().catch(() => null),
    getApprenticeshipDetailViewModelIndex().catch(() => null),
    getLatestOccupationMedianMonthlySalaryDataset().catch(() => null),
  ]);

  const latestBlogDate = getLatestDate(blogPosts.map((post) => post.publishedAt));
  const latestForklarerDate = getLatestDate(forklarerPosts.map((post) => post.publishedAt));
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
          : route.path === "/forklarer"
            ? latestForklarerDate
          : await readLastModifiedFromFile(route.filePath),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })));

  const groupRoutes: MetadataRoute.Sitemap = listOccupationGroups().map((group) => ({
    url: getAbsoluteUrl(`/yrkesgrupper/${group.slug}`),
    lastModified: occupationContentLastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const familyRoutes: MetadataRoute.Sitemap = occupationMedianDataset
    ? listOccupationFamilies(occupationMedianDataset).map((family) => ({
        url: getAbsoluteUrl(`/yrkesfamilie/${family.slug}`),
        lastModified: occupationContentLastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      }))
    : [];

  const areaRoutes: MetadataRoute.Sitemap = occupationMedianDataset
    ? listOccupationAreas(occupationMedianDataset).map((area) => ({
        url: getAbsoluteUrl(`/yrkesomrade/${area.slug}`),
        lastModified: occupationContentLastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      }))
    : [];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: getAbsoluteUrl(`/blogg/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
    images: post.coverImage ? [getAbsoluteUrl(post.coverImage)] : undefined,
  }));

  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategories.map((category) => {
    const postsInCategory = blogPosts.filter((post) => post.category === category.slug);

    return {
      url: getAbsoluteUrl(category.href),
      lastModified: getLatestDate(postsInCategory.map((post) => post.publishedAt)),
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  const forklarerRoutes: MetadataRoute.Sitemap = forklarerPosts.map((post) => ({
    url: getAbsoluteUrl(`/forklarer/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const occupationRoutes: MetadataRoute.Sitemap = occupationPages.map((entry) => ({
    url: getAbsoluteUrl(entry.page.href),
    lastModified: occupationContentLastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const apprenticeshipRoutes: MetadataRoute.Sitemap = (apprenticeshipIndex?.pages ?? []).map((page) => ({
    url: getAbsoluteUrl(`/laerling/${page.slug}`),
    lastModified: apprenticeshipContentLastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...routes,
    ...groupRoutes,
    ...areaRoutes,
    ...familyRoutes,
    ...blogRoutes,
    ...blogCategoryRoutes,
    ...forklarerRoutes,
    ...occupationRoutes,
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
