import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { cache } from "react";
import type { ReactNode } from "react";
import { buildForklarerMdxComponents } from "@/components/forklarer-mdx-components";
import type { BlogTableOfContentsItem } from "@/lib/blog-shared";
import { siteConfig } from "@/lib/site-config";

const FORKLARER_DIRECTORY = path.join(process.cwd(), "src", "content", "forklarer");

export type ForklarerFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  author: string;
  term: string;
  draft?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  relatedTerms?: string[];
};

export type ForklarerPreview = ForklarerFrontmatter & {
  readingTimeMinutes: number;
};

export type ForklarerPost = ForklarerPreview & {
  content: ReactNode;
  tableOfContents: BlogTableOfContentsItem[];
};

function trimOptionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function assertRequiredString(value: unknown, fieldName: keyof ForklarerFrontmatter) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Forklareringsinnlegget mangler gyldig felt: ${fieldName}`);
  }

  return value.trim();
}

function normalizeRelatedTerms(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const terms = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return terms.length > 0 ? terms : undefined;
}

function normalizeFrontmatter(frontmatter: unknown): ForklarerFrontmatter {
  if (!frontmatter || typeof frontmatter !== "object") {
    throw new Error("Forklareringsinnlegget mangler frontmatter.");
  }

  const data = frontmatter as Record<string, unknown>;

  return {
    title: assertRequiredString(data.title, "title"),
    description: assertRequiredString(data.description, "description"),
    slug: assertRequiredString(data.slug, "slug"),
    publishedAt: assertRequiredString(data.publishedAt, "publishedAt"),
    author: assertRequiredString(data.author, "author"),
    term: assertRequiredString(data.term, "term"),
    draft: data.draft === true,
    seoTitle: trimOptionalString(data.seoTitle),
    seoDescription: trimOptionalString(data.seoDescription),
    relatedTerms: normalizeRelatedTerms(data.relatedTerms),
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

async function getForklarerFileNames() {
  const entries = await fs.readdir(FORKLARER_DIRECTORY, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).map((entry) => entry.name);
}

export const getAllForklarerPosts = cache(async (): Promise<ForklarerPreview[]> => {
  const fileNames = await getForklarerFileNames();

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const source = await fs.readFile(path.join(FORKLARER_DIRECTORY, fileName), "utf8");
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

  return posts
    .filter((post): post is ForklarerPreview => Boolean(post))
    .sort((left, right) => left.term.localeCompare(right.term, "nb-NO"));
});

export const getForklarerPostBySlug = cache(async (slug: string): Promise<ForklarerPost | null> => {
  try {
    const source = await fs.readFile(path.join(FORKLARER_DIRECTORY, `${slug}.mdx`), "utf8");
    const { data } = matter(source);
    const normalizedFrontmatter = normalizeFrontmatter(data);

    if (normalizedFrontmatter.draft) {
      return null;
    }

    const tableOfContents = extractTableOfContents(source);
    const { content } = await compileMDX<ForklarerFrontmatter>({
      source,
      components: buildForklarerMdxComponents(tableOfContents),
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

export async function getForklarerPostSlugs() {
  const posts = await getAllForklarerPosts();
  return posts.map((post) => post.slug);
}

export function getForklarerPostUrl(slug: string) {
  return new URL(`/forklarer/${slug}`, siteConfig.siteUrl).toString();
}

export async function getRelatedForklarerPosts(post: ForklarerFrontmatter) {
  if (!post.relatedTerms || post.relatedTerms.length === 0) {
    return [];
  }

  const posts = await getAllForklarerPosts();
  const relatedTerms = new Set(post.relatedTerms.map((term) => term.toLowerCase()));

  return posts.filter(
    (candidate) => candidate.slug !== post.slug && relatedTerms.has(candidate.term.toLowerCase()),
  ).slice(0, 5);
}
