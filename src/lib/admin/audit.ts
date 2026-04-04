import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { cache } from "react";
import { metadata as blogIndexMetadata } from "@/app/blogg/page";
import { metadata as dinLonnMetadata } from "@/app/din-lonn/page";
import { metadata as kvinnerVsMennMetadata } from "@/app/kvinner-vs-menn/page";
import { metadata as rootMetadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as toppJobberMetadata } from "@/app/topp-jobber/page";
import type {
  AdminContentItem,
  AdminDashboardSnapshot,
  AdminDatasetCheck,
  AdminIssue,
  AdminSeoCheck,
  AdminStatus,
} from "@/lib/admin/types";
import { siteConfig } from "@/lib/site-config";

const BLOG_DIRECTORY = path.join(process.cwd(), "src", "content", "blog");
const PUBLIC_DIRECTORY = path.join(process.cwd(), "public");
const GENERATED_MANIFEST_PATH = path.join(process.cwd(), "src", "lib", "generated", "manifest.json");

type StaticRouteDefinition = {
  id: string;
  title: string;
  url: string;
  metadata?: Metadata | null;
  metadataSource: "layout" | "page" | "none";
  inSitemap: boolean;
  pageFilePath: string;
};

type DynamicRouteFamilyDefinition = {
  id: string;
  title: string;
  url: string;
  hasGenerateMetadata: boolean;
  hasCanonical: boolean;
};

type GeneratedManifest = {
  generatedAt?: string;
  datasets?: Array<{
    key?: string;
    fileName?: string;
    tableId?: string;
    title?: string;
    updated?: string;
    rowCount?: number;
  }>;
};

const staticRouteDefinitions: StaticRouteDefinition[] = [
  {
    id: "page:/",
    title: "Forside",
    url: "/",
    metadata: rootMetadata,
    metadataSource: "layout",
    inSitemap: true,
    pageFilePath: path.join(process.cwd(), "src", "app", "page.tsx"),
  },
  {
    id: "page:/blogg",
    title: "Blogg",
    url: "/blogg",
    metadata: blogIndexMetadata,
    metadataSource: "page",
    inSitemap: true,
    pageFilePath: path.join(process.cwd(), "src", "app", "blogg", "page.tsx"),
  },
  {
    id: "page:/din-lonn",
    title: "Din lønn",
    url: "/din-lonn",
    metadata: dinLonnMetadata,
    metadataSource: "page",
    inSitemap: true,
    pageFilePath: path.join(process.cwd(), "src", "app", "din-lonn", "page.tsx"),
  },
  {
    id: "page:/kvinner-vs-menn",
    title: "Kvinner vs menn",
    url: "/kvinner-vs-menn",
    metadata: kvinnerVsMennMetadata,
    metadataSource: "page",
    inSitemap: true,
    pageFilePath: path.join(process.cwd(), "src", "app", "kvinner-vs-menn", "page.tsx"),
  },
  {
    id: "page:/topp-jobber",
    title: "Topp jobber",
    url: "/topp-jobber",
    metadata: toppJobberMetadata,
    metadataSource: "page",
    inSitemap: true,
    pageFilePath: path.join(process.cwd(), "src", "app", "topp-jobber", "page.tsx"),
  },
  {
    id: "page:/yrker",
    title: "Yrker",
    url: "/yrker",
    metadata: null,
    metadataSource: "none",
    inSitemap: false,
    pageFilePath: path.join(process.cwd(), "src", "app", "yrker", "page.tsx"),
  },
];

const dynamicRouteFamilies: DynamicRouteFamilyDefinition[] = [
  {
    id: "group:/yrke/[slug]",
    title: "Yrkesdetaljer",
    url: "/yrke/[slug]",
    hasGenerateMetadata: true,
    hasCanonical: false,
  },
  {
    id: "group:/yrker/[slug]",
    title: "Yrkesgrupper",
    url: "/yrker/[slug]",
    hasGenerateMetadata: true,
    hasCanonical: false,
  },
  {
    id: "group:/timelonn/[slug]",
    title: "Timelønn-detaljer",
    url: "/timelonn/[slug]",
    hasGenerateMetadata: true,
    hasCanonical: true,
  },
  {
    id: "group:/blogg/[slug]",
    title: "Bloggdetaljer",
    url: "/blogg/[slug]",
    hasGenerateMetadata: true,
    hasCanonical: true,
  },
];

function addIssue(issues: AdminIssue[], status: AdminStatus, label: string, details?: string) {
  issues.push({ status, label, details });
}

function getStatusFromIssues(issues: AdminIssue[]): AdminStatus {
  if (issues.some((issue) => issue.status === "error")) {
    return "error";
  }

  if (issues.some((issue) => issue.status === "warning")) {
    return "warning";
  }

  return "ok";
}

function readMetadataTitle(metadata?: Metadata | null) {
  if (!metadata?.title) {
    return null;
  }

  if (typeof metadata.title === "string") {
    return metadata.title;
  }

  if ("default" in metadata.title && typeof metadata.title.default === "string") {
    return metadata.title.default;
  }

  if ("absolute" in metadata.title && typeof metadata.title.absolute === "string") {
    return metadata.title.absolute;
  }

  return null;
}

function readMetadataDescription(metadata?: Metadata | null) {
  return typeof metadata?.description === "string" ? metadata.description : null;
}

function readMetadataCanonical(metadata?: Metadata | null) {
  const canonical = metadata?.alternates?.canonical;

  if (!canonical) {
    return null;
  }

  return typeof canonical === "string" ? canonical : canonical.toString();
}

function getAgeInDays(value: string | null) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

function summarizeStatuses(items: Array<{ status: AdminStatus }>) {
  return {
    warningCount: items.filter((item) => item.status === "warning").length,
    errorCount: items.filter((item) => item.status === "error").length,
  };
}

async function fileExists(absolutePath: string) {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function collectBlogItems(): Promise<AdminContentItem[]> {
  const fileEntries = await fs.readdir(BLOG_DIRECTORY, { withFileTypes: true });
  const mdxFiles = fileEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));

  return Promise.all(
    mdxFiles.map(async (entry) => {
      const filePath = path.join(BLOG_DIRECTORY, entry.name);
      const source = await fs.readFile(filePath, "utf8");
      const stats = await fs.stat(filePath);
      const parsed = matter(source);
      const frontmatter = parsed.data as Record<string, unknown>;
      const issues: AdminIssue[] = [];
      const slug = typeof frontmatter.slug === "string" ? frontmatter.slug.trim() : "";
      const publishedAt = typeof frontmatter.publishedAt === "string" ? frontmatter.publishedAt.trim() : "";
      const coverImage = typeof frontmatter.coverImage === "string" ? frontmatter.coverImage.trim() : "";

      for (const field of ["title", "description", "slug", "publishedAt", "coverImage", "author"] as const) {
        const value = frontmatter[field];

        if (typeof value !== "string" || value.trim().length === 0) {
          addIssue(issues, "error", `Mangler påkrevd felt: ${field}`);
        }
      }

      if (!frontmatter.seoTitle || typeof frontmatter.seoTitle !== "string" || !frontmatter.seoTitle.trim()) {
        addIssue(issues, "warning", "Mangler seoTitle");
      }

      if (
        !frontmatter.seoDescription ||
        typeof frontmatter.seoDescription !== "string" ||
        !frontmatter.seoDescription.trim()
      ) {
        addIssue(issues, "warning", "Mangler seoDescription");
      }

      if (slug && slug !== entry.name.replace(/\.mdx$/, "")) {
        addIssue(issues, "warning", "Slug matcher ikke filnavnet", `${slug} vs ${entry.name}`);
      }

      if (publishedAt && Number.isNaN(new Date(publishedAt).getTime())) {
        addIssue(issues, "error", "Ugyldig publiseringsdato", publishedAt);
      }

      if (!slug) {
        addIssue(issues, "error", "Kan ikke bygge canonical uten gyldig slug");
      }

      if (coverImage?.startsWith("/")) {
        const imageExists = await fileExists(path.join(PUBLIC_DIRECTORY, coverImage.slice(1)));

        if (!imageExists) {
          addIssue(issues, "error", "Cover-bilde finnes ikke i public", coverImage);
        }
      } else if (coverImage) {
        addIssue(issues, "warning", "Cover-bilde er ikke lokal absolutt sti", coverImage);
      }

      return {
        id: `blog:${entry.name}`,
        type: "blogg",
        title:
          typeof frontmatter.title === "string" && frontmatter.title.trim()
            ? frontmatter.title.trim()
            : entry.name,
        url: slug ? `/blogg/${slug}` : `/blogg/${entry.name.replace(/\.mdx$/, "")}`,
        canonical: slug ? `/blogg/${slug}` : null,
        metadataTitle:
          typeof frontmatter.seoTitle === "string" && frontmatter.seoTitle.trim()
            ? frontmatter.seoTitle.trim()
            : null,
        description:
          typeof frontmatter.description === "string" && frontmatter.description.trim()
            ? frontmatter.description.trim()
            : null,
        lastUpdated: stats.mtime.toISOString(),
        status: getStatusFromIssues(issues),
        issues,
      } satisfies AdminContentItem;
    }),
  );
}

function collectStaticPageItems(): AdminContentItem[] {
  return staticRouteDefinitions.map((route) => {
    const issues: AdminIssue[] = [];
    const metadataTitle = readMetadataTitle(route.metadata);
    const description = readMetadataDescription(route.metadata);
    const canonical = readMetadataCanonical(route.metadata);
    const pageFileExists = existsSync(route.pageFilePath);

    if (route.metadataSource === "none") {
      addIssue(issues, "warning", "Mangler eksportert metadata");
    }

    if (!pageFileExists) {
      addIssue(issues, "error", "Mangler page.tsx for ruten");
    }

    if (!metadataTitle) {
      addIssue(issues, "warning", "Mangler metadata-tittel");
    }

    if (!description) {
      addIssue(issues, "warning", "Mangler metadata-beskrivelse");
    }

    if (!canonical) {
      addIssue(issues, "warning", "Mangler canonical");
    }

    if (!route.inSitemap) {
      addIssue(issues, "warning", "Siden er ikke inkludert i sitemap");
    }

    return {
      id: route.id,
      type: "side",
      title: route.title,
      url: route.url,
      canonical,
      metadataTitle,
      description,
      lastUpdated: null,
      status: getStatusFromIssues(issues),
      issues,
    };
  });
}

function collectDynamicRouteItems(): AdminContentItem[] {
  return dynamicRouteFamilies.map((route) => {
    const issues: AdminIssue[] = [];

    if (!route.hasGenerateMetadata) {
      addIssue(issues, "warning", "Mangler generateMetadata");
    }

    if (!route.hasCanonical) {
      addIssue(issues, "warning", "Mangler eksplisitt canonical");
    }

    return {
      id: route.id,
      type: "rutegruppe",
      title: route.title,
      url: route.url,
      canonical: route.hasCanonical ? route.url : null,
      metadataTitle: route.hasGenerateMetadata ? "Genereres dynamisk" : null,
      description: null,
      lastUpdated: null,
      status: getStatusFromIssues(issues),
      issues,
    };
  });
}

async function collectDatasetChecks() {
  const manifestSource = await fs.readFile(GENERATED_MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestSource) as GeneratedManifest;
  const checks: AdminDatasetCheck[] = (manifest.datasets ?? []).map((dataset, index) => {
    const issues: AdminIssue[] = [];
    const updated = typeof dataset.updated === "string" ? dataset.updated : null;
    const generatedAt = typeof manifest.generatedAt === "string" ? manifest.generatedAt : null;
    const rowCount = typeof dataset.rowCount === "number" ? dataset.rowCount : 0;

    if (rowCount <= 0) {
      addIssue(issues, "error", "Datasettet har ingen rader");
    }

    if (getAgeInDays(updated) > 45) {
      addIssue(issues, "warning", "Kildedata virker gammel", formatAdminTimestamp(updated));
    }

    if (getAgeInDays(generatedAt) > 7) {
      addIssue(issues, "warning", "Manifestet er ikke nylig generert", formatAdminTimestamp(generatedAt));
    }

    return {
      id: dataset.key ?? dataset.fileName ?? `dataset-${index}`,
      label: dataset.title ?? dataset.key ?? dataset.fileName ?? "Ukjent datasett",
      tableId: dataset.tableId ?? "Ukjent",
      fileName: dataset.fileName ?? "Ukjent",
      updated,
      generatedAt,
      rowCount,
      status: getStatusFromIssues(issues),
      issues,
    };
  });

  return {
    generatedAt: typeof manifest.generatedAt === "string" ? manifest.generatedAt : null,
    checks,
  };
}

async function collectSeoChecks(contentItems: AdminContentItem[]) {
  const checks: AdminSeoCheck[] = [];
  const sitemapEntries = await sitemap();
  const robotsConfig = robots();
  const indexedPaths = new Set(
    sitemapEntries.map((entry) => {
      try {
        return new URL(entry.url).pathname;
      } catch {
        return entry.url;
      }
    }),
  );

  const expectedPaths = [
    ...staticRouteDefinitions.filter((route) => route.inSitemap).map((route) => route.url),
    ...contentItems.filter((item) => item.type === "blogg").map((item) => item.url),
  ];

  for (const expectedPath of expectedPaths) {
    if (!indexedPaths.has(expectedPath)) {
      checks.push({
        id: `sitemap:${expectedPath}`,
        label: `Sitemap mangler ${expectedPath}`,
        status: "error",
        details: "Ruten forventes å være med, men ble ikke funnet i sitemap.",
      });
    }
  }

  const blogSlugs = new Map<string, number>();

  for (const item of contentItems.filter((entry) => entry.type === "blogg")) {
    const slug = item.url.replace("/blogg/", "");
    blogSlugs.set(slug, (blogSlugs.get(slug) ?? 0) + 1);
  }

  for (const [slug, count] of blogSlugs) {
    if (count > 1) {
      checks.push({
        id: `slug:${slug}`,
        label: `Duplikat blogg-slug: ${slug}`,
        status: "error",
        details: `Sluggen forekommer ${count} ganger.`,
      });
    }
  }

  const robotsRules = robotsConfig.rules;
  const blocksAdmin =
    !Array.isArray(robotsRules) && String(robotsRules.disallow ?? "").includes("/admin");

  checks.push({
    id: "robots",
    label: "Robots-regler",
    status: blocksAdmin ? "ok" : "warning",
    details: blocksAdmin
      ? "Robots blokkerer /admin eksplisitt."
      : "Robots blokkerer ikke /admin eksplisitt. Admin er fortsatt beskyttet av innlogging.",
  });

  if (checks.length === 1) {
    checks.unshift({
      id: "sitemap:ok",
      label: "Sitemap dekker forventede offentlige ruter",
      status: "ok",
      details: `${indexedPaths.size} ruter ble funnet i sitemap.`,
    });
  }

  return {
    checks,
    indexedRouteCount: indexedPaths.size,
  };
}

export const getAdminDashboardSnapshot = cache(async (): Promise<AdminDashboardSnapshot> => {
  const sectionIssues: AdminIssue[] = [];
  let contentItems: AdminContentItem[] = [];
  let datasetChecks: AdminDatasetCheck[] = [];
  let seoChecks: AdminSeoCheck[] = [];
  let indexedRouteCount = 0;
  let lastDataSyncAt: string | null = null;

  try {
    const blogItems = await collectBlogItems();
    contentItems = [...collectStaticPageItems(), ...collectDynamicRouteItems(), ...blogItems].sort((left, right) =>
      left.title.localeCompare(right.title, "nb-NO"),
    );
  } catch (error) {
    addIssue(sectionIssues, "error", "Kunne ikke lese innholdsaudit", (error as Error).message);
  }

  try {
    const datasetAudit = await collectDatasetChecks();
    datasetChecks = datasetAudit.checks;
    lastDataSyncAt = datasetAudit.generatedAt;
  } catch (error) {
    addIssue(sectionIssues, "error", "Kunne ikke lese datasettmanifest", (error as Error).message);
  }

  try {
    const seoAudit = await collectSeoChecks(contentItems);
    seoChecks = seoAudit.checks;
    indexedRouteCount = seoAudit.indexedRouteCount;
  } catch (error) {
    addIssue(sectionIssues, "error", "Kunne ikke kjøre SEO-kontroller", (error as Error).message);
  }

  const { warningCount, errorCount } = summarizeStatuses([
    ...contentItems,
    ...datasetChecks,
    ...seoChecks,
    ...sectionIssues,
  ]);

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      blogPostCount: contentItems.filter((item) => item.type === "blogg").length,
      trackedPageCount: contentItems.filter((item) => item.type !== "blogg").length,
      indexedRouteCount,
      datasetCount: datasetChecks.length,
      warningCount,
      errorCount,
      lastGeneratedAt: new Date().toISOString(),
      lastDataSyncAt,
    },
    contentItems,
    seoChecks,
    datasetChecks,
    sectionIssues,
  };
});

export function formatAdminTimestamp(value: string | null) {
  if (!value) {
    return "Ikke tilgjengelig";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getAdminStatusClasses(status: AdminStatus) {
  switch (status) {
    case "ok":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-800";
  }
}

export function getAdminAbsoluteUrl(value: string | null) {
  if (!value) {
    return null;
  }

  return new URL(value, siteConfig.siteUrl).toString();
}
