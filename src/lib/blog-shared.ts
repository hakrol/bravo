import type { ReactNode } from "react";

export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  coverImage: string;
  coverImageAlt?: string;
  author: string;
  category: BlogCategorySlug;
  tags?: string[];
  draft?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogCategorySlug = "lonn" | "lonnsforhandling";

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
