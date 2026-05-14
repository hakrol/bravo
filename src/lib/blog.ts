import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache } from "react";
import { buildBlogMdxComponentsFixed } from "@/components/blog-mdx-components-fixed";
import type { BlogFrontmatter, BlogPost, BlogPostPreview, BlogTableOfContentsItem } from "@/lib/blog-shared";
import { siteConfig } from "@/lib/site-config";

const BLOG_DIRECTORY = path.join(process.cwd(), "src", "content", "blog");

export { formatBlogDate } from "@/lib/blog-shared";
export type { BlogFrontmatter, BlogPost, BlogPostPreview, BlogTableOfContentsItem } from "@/lib/blog-shared";

function trimOptionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function assertRequiredString(value: unknown, fieldName: keyof BlogFrontmatter) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Blogginnlegget mangler gyldig felt: ${fieldName}`);
  }

  return value.trim();
}

function normalizeFrontmatter(frontmatter: unknown): BlogFrontmatter {
  if (!frontmatter || typeof frontmatter !== "object") {
    throw new Error("Blogginnlegget mangler frontmatter.");
  }

  const data = frontmatter as Record<string, unknown>;

  return {
    title: assertRequiredString(data.title, "title"),
    description: assertRequiredString(data.description, "description"),
    slug: assertRequiredString(data.slug, "slug"),
    publishedAt: assertRequiredString(data.publishedAt, "publishedAt"),
    coverImage: assertRequiredString(data.coverImage, "coverImage"),
    author: assertRequiredString(data.author, "author"),
    draft: data.draft === true,
    seoTitle: trimOptionalString(data.seoTitle),
    seoDescription: trimOptionalString(data.seoDescription),
  };
}

function calculateReadingTimeMinutes(source: string) {
  const wordCount = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 220));
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9æøå\s-]/gi, "")
    .replace(/[æÆ]/g, "ae")
    .replace(/[øØ]/g, "o")
    .replace(/[åÅ]/g, "a")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractTableOfContents(source: string): BlogTableOfContentsItem[] {
  const headingMatches = source.matchAll(/^(##|###)\s+(.+)$/gm);
  const slugCounts = new Map<string, number>();

  return Array.from(headingMatches, (match) => {
    const level = match[1] === "##" ? 2 : 3;
    const title = match[2].trim();
    const baseId = slugifyHeading(title);
    const currentCount = slugCounts.get(baseId) ?? 0;
    slugCounts.set(baseId, currentCount + 1);

    return {
      id: currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`,
      title,
      level,
    } satisfies BlogTableOfContentsItem;
  });
}

async function getBlogFileNames() {
  const entries = await fs.readdir(BLOG_DIRECTORY, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).map((entry) => entry.name);
}

export const getAllBlogPosts = cache(async (): Promise<BlogPostPreview[]> => {
  const fileNames = await getBlogFileNames();

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const source = await fs.readFile(path.join(BLOG_DIRECTORY, fileName), "utf8");
      const { data, content } = matter(source);
      const frontmatter = normalizeFrontmatter(data);

      if (frontmatter.draft) {
        return null;
      }

      return {
        ...frontmatter,
        readingTimeMinutes: calculateReadingTimeMinutes(content),
      };
    }),
  );

  return posts.filter((post): post is BlogPostPreview => Boolean(post)).sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const source = await fs.readFile(path.join(BLOG_DIRECTORY, `${slug}.mdx`), "utf8");
    const { data } = matter(source);
    const normalizedFrontmatter = normalizeFrontmatter(data);

    if (normalizedFrontmatter.draft) {
      return null;
    }

    const tableOfContents = extractTableOfContents(source);
    const { content } = await compileMDX<BlogFrontmatter>({
      source,
      components: buildBlogMdxComponentsFixed(tableOfContents),
      options: {
        parseFrontmatter: true,
      },
    });

    return {
      ...normalizedFrontmatter,
      content,
      tableOfContents,
      readingTimeMinutes: calculateReadingTimeMinutes(source),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
});

export async function getBlogPostSlugs() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => post.slug);
}

export function getBlogPostUrl(slug: string) {
  return new URL(`/blogg/${slug}`, siteConfig.siteUrl).toString();
}
