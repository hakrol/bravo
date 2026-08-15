import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache } from "react";
import type { ReactNode } from "react";
import { buildNewsMdxComponents } from "@/components/news-mdx-components";
import { editorialIdentity } from "@/lib/editorial-identity";
import { siteConfig } from "@/lib/site-config";

const NEWS_DIRECTORY = path.join(process.cwd(), "src", "content", "nyheter");

export type NewsFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage: string;
  coverImageAlt: string;
  imageCaption?: string;
  author: string;
  topic: string;
  occupationSlugs: string[];
  isTest?: boolean;
  draft?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type NewsPostPreview = NewsFrontmatter & {
  readingTimeMinutes: number;
};

export type NewsPost = NewsPostPreview & {
  content: ReactNode;
};

function trimOptionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function assertRequiredString(value: unknown, fieldName: keyof NewsFrontmatter) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Nyhetsartikkelen mangler gyldig felt: ${fieldName}`);
  }

  return value.trim();
}

function assertOccupationSlugs(value: unknown) {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((slug) => typeof slug !== "string" || slug.trim().length === 0)
  ) {
    throw new Error(
      "Nyhetsartikkelen må ha minst ett gyldig yrke i feltet occupationSlugs.",
    );
  }

  return [...new Set(value.map((slug) => slug.trim()))];
}

function normalizeFrontmatter(frontmatter: unknown): NewsFrontmatter {
  if (!frontmatter || typeof frontmatter !== "object") {
    throw new Error("Nyhetsartikkelen mangler frontmatter.");
  }

  const data = frontmatter as Record<string, unknown>;
  const author = assertRequiredString(data.author, "author");

  if (author !== editorialIdentity.authorName) {
    throw new Error(`Nyhetsartikkelen må bruke forfatteren ${editorialIdentity.authorName}.`);
  }

  return {
    title: assertRequiredString(data.title, "title"),
    description: assertRequiredString(data.description, "description"),
    slug: assertRequiredString(data.slug, "slug"),
    publishedAt: assertRequiredString(data.publishedAt, "publishedAt"),
    updatedAt: trimOptionalString(data.updatedAt),
    coverImage: assertRequiredString(data.coverImage, "coverImage"),
    coverImageAlt: assertRequiredString(data.coverImageAlt, "coverImageAlt"),
    imageCaption: trimOptionalString(data.imageCaption),
    author,
    topic: assertRequiredString(data.topic, "topic"),
    occupationSlugs: assertOccupationSlugs(data.occupationSlugs),
    isTest: data.isTest === true,
    draft: data.draft === true,
    seoTitle: trimOptionalString(data.seoTitle),
    seoDescription: trimOptionalString(data.seoDescription),
  };
}

function calculateReadingTimeMinutes(source: string) {
  const wordCount = source
    .replace(/---[\s\S]*?---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 220));
}

async function getNewsFileNames() {
  const entries = await fs.readdir(NEWS_DIRECTORY, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).map((entry) => entry.name);
}

export const getAllNewsPosts = cache(async (): Promise<NewsPostPreview[]> => {
  const fileNames = await getNewsFileNames();
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const source = await fs.readFile(path.join(NEWS_DIRECTORY, fileName), "utf8");
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

  return posts.filter((post): post is NewsPostPreview => Boolean(post)).sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
});

export const getNewsPostBySlug = cache(async (slug: string): Promise<NewsPost | null> => {
  try {
    const source = await fs.readFile(path.join(NEWS_DIRECTORY, `${slug}.mdx`), "utf8");
    const { data } = matter(source);
    const frontmatter = normalizeFrontmatter(data);

    if (frontmatter.draft) {
      return null;
    }

    const { content } = await compileMDX<NewsFrontmatter>({
      source,
      components: buildNewsMdxComponents(),
      options: { parseFrontmatter: true },
    });

    return {
      ...frontmatter,
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

export async function getNewsPostSlugs() {
  const posts = await getAllNewsPosts();
  return posts.map((post) => post.slug);
}

export async function getNewsPostsByOccupationSlug(occupationSlug: string) {
  const posts = await getAllNewsPosts();
  return posts.filter((post) => post.occupationSlugs.includes(occupationSlug));
}

export function getNewsPostUrl(slug: string) {
  return new URL(`/nyheter/${slug}`, siteConfig.siteUrl).toString();
}

export function formatNewsDate(dateString: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getNewsUpdatedAt(publishedAt: string, updatedAt?: string) {
  if (!updatedAt) {
    return undefined;
  }

  const publishedTime = new Date(publishedAt).getTime();
  const updatedTime = new Date(updatedAt).getTime();

  return !Number.isNaN(updatedTime) && updatedTime > publishedTime ? updatedAt : undefined;
}
