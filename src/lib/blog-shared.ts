import type { ReactNode } from "react";

export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage: string;
  coverImageAlt?: string;
  coverImageAiGenerated?: boolean;
  author: string;
  category: BlogCategorySlug;
  tags?: string[];
  draft?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogCategorySlug = "lonn" | "lonnsforhandling" | "politikere";

export type BlogPostPreview = BlogFrontmatter & {
  readingTimeMinutes: number;
};

export type BlogTableOfContentsItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type BlogPost = BlogPostPreview & {
  content: ReactNode;
  tableOfContents: BlogTableOfContentsItem[];
};

export function formatBlogDate(dateString: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getBlogUpdatedAt(publishedAt: string, updatedAt?: string) {
  if (!updatedAt) {
    return undefined;
  }

  const publishedTime = new Date(publishedAt).getTime();
  const updatedTime = new Date(updatedAt).getTime();

  if (Number.isNaN(publishedTime) || Number.isNaN(updatedTime) || updatedTime <= publishedTime) {
    return undefined;
  }

  return updatedAt;
}
