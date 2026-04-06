import { existsSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getHourlySalaryPages } from "@/lib/hourly-salary-pages";
import { getDynamicOccupationPageEntries } from "@/lib/occupation-detail-page-resolver";
import { getAbsoluteUrl } from "@/lib/site-config";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/lonnsjekk", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/kvinner-vs-menn", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/topp-jobber", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/yrker", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/blogg", priority: 0.7, changeFrequency: "weekly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, occupationPages, hourlySalaryPages] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getDynamicOccupationPageEntries().catch(() => []),
    getHourlySalaryPages().catch(() => []),
  ]);

  const routes = staticRoutes
    .filter((route) => {
      if (route.path === "/") {
        return true;
      }

      const routeSegments = route.path.split("/").filter(Boolean);
      return existsSync(path.join(process.cwd(), "src", "app", ...routeSegments, "page.tsx"));
    })
    .map((route) => ({
      url: getAbsoluteUrl(route.path),
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
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
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const hourlySalaryRoutes: MetadataRoute.Sitemap = hourlySalaryPages.map((page) => ({
    url: getAbsoluteUrl(page.href),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes, ...occupationRoutes, ...hourlySalaryRoutes];
}