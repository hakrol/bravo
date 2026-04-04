import { existsSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAbsoluteUrl } from "@/lib/site-config";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/din-lonn", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/kvinner-vs-menn", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/topp-jobber", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/yrker", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/blogg", priority: 0.7, changeFrequency: "weekly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getAllBlogPosts().catch(() => []);

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

  return [...routes, ...blogRoutes];
}
