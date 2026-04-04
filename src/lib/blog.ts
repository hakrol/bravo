import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { cache } from "react";
import { blogMdxComponents } from "@/components/blog-mdx-components";
import { siteConfig } from "@/lib/site-config";

const BLOG_DIRECTORY = path.join(process.cwd(), "src", "content", "blog");

export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  coverImage: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPostPreview = BlogFrontmatter & {
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostPreview & {
  content: ReactNode;
};

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

      return {
        ...frontmatter,
        readingTimeMinutes: calculateReadingTimeMinutes(content),
      };
    }),
  );

  return posts.sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const source = await fs.readFile(path.join(BLOG_DIRECTORY, `${slug}.mdx`), "utf8");
    const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
      source,
      components: blogMdxComponents,
      options: {
        parseFrontmatter: true,
      },
    });

    const normalizedFrontmatter = normalizeFrontmatter(frontmatter);

    return {
      ...normalizedFrontmatter,
      content,
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

export function formatBlogDate(dateString: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getBlogPostUrl(slug: string) {
  return new URL(`/blogg/${slug}`, siteConfig.siteUrl).toString();
}
