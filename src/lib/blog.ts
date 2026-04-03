import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { blogMdxComponents } from "@/components/blog-mdx-components";
import { siteConfig } from "@/lib/site-config";

const BLOG_CONTENT_DIRECTORY = path.join(process.cwd(), "src", "content", "blog");

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  coverImage: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPostPreview = BlogPostFrontmatter & {
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostPreview & {
  content: ReactNode;
};

function assertString(value: unknown, fieldName: keyof BlogPostFrontmatter) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Blogginnlegget mangler gyldig felt: ${fieldName}`);
  }

  return value.trim();
}

function normalizeFrontmatter(data: unknown): BlogPostFrontmatter {
  if (!data || typeof data !== "object") {
    throw new Error("Blogginnlegget mangler frontmatter.");
  }

  const frontmatter = data as Record<string, unknown>;

  return {
    title: assertString(frontmatter.title, "title"),
    description: assertString(frontmatter.description, "description"),
    slug: assertString(frontmatter.slug, "slug"),
    publishedAt: assertString(frontmatter.publishedAt, "publishedAt"),
    coverImage: assertString(frontmatter.coverImage, "coverImage"),
    author: assertString(frontmatter.author, "author"),
    seoTitle: typeof frontmatter.seoTitle === "string" ? frontmatter.seoTitle.trim() : undefined,
    seoDescription:
      typeof frontmatter.seoDescription === "string"
        ? frontmatter.seoDescription.trim()
        : undefined,
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

async function getBlogPostFileNames() {
  const entries = await fs.readdir(BLOG_CONTENT_DIRECTORY, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name);
}

async function readBlogPostSource(slug: string) {
  const filePath = path.join(BLOG_CONTENT_DIRECTORY, `${slug}.mdx`);

  return fs.readFile(filePath, "utf8");
}

export function formatBlogDate(dateString: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export const getAllBlogPosts = cache(async (): Promise<BlogPostPreview[]> => {
  const fileNames = await getBlogPostFileNames();

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const source = await fs.readFile(path.join(BLOG_CONTENT_DIRECTORY, fileName), "utf8");
      const { data, content } = matter(source);
      const frontmatter = normalizeFrontmatter(data);

      return {
        ...frontmatter,
        readingTimeMinutes: calculateReadingTimeMinutes(content),
      };
    }),
  );

  return posts.sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime(),
  );
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const source = await readBlogPostSource(slug);
    const { content, frontmatter } = await compileMDX<BlogPostFrontmatter>({
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

export function getBlogPostUrl(slug: string) {
  return new URL(`/blogg/${slug}`, siteConfig.siteUrl).toString();
}
