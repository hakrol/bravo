import type { ReactNode } from "react";

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
