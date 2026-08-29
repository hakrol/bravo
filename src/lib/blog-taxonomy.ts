import type { BlogCategorySlug } from "@/lib/blog-shared";

export type BlogCategory = {
  slug: BlogCategorySlug;
  label: string;
  href: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  occupationSlug?: string;
};

export const blogCategories = [
  {
    slug: "lonn",
    label: "Lønn",
    href: "/blogg/kategori/lonn",
    title: "Lønn",
    description:
      "Datadrevne artikler om lønn, yrker, årslønn, timelønn og lønnsutvikling.",
    seoTitle: "Blogg om lønn, yrker og lønnsstatistikk",
    seoDescription:
      "Les datadrevne artikler om lønn i Norge, med SSB-tall, yrkessammenligninger, årslønn, timelønn og lønnsutvikling.",
  },
  {
    slug: "lonnsforhandling",
    label: "Lønnsforhandling",
    href: "/blogg/kategori/lonnsforhandling",
    title: "Lønnsforhandling",
    description:
      "Praktiske råd om lønnssamtale, lønnsøkning, argumentasjon og timing.",
    seoTitle: "Guider til lønnsforhandling og lønnssamtale",
    seoDescription:
      "Les konkrete guider til lønnsforhandling, lønnssamtale, realistiske lønnskrav og hvordan du ber om mer lønn.",
  },
  {
    slug: "politikere",
    label: "Politikere",
    href: "/blogg/kategori/politikere",
    occupationSlug: "politikere-lonn",
    title: "Politikere",
    description:
      "Artikler om godtgjørelse, lønnsnivå og økonomiske ordninger for norske folkevalgte og politisk ledelse.",
    seoTitle: "Godtgjørelse og lønn for politikere i Norge",
    seoDescription:
      "Les om godtgjørelsen til norske politikere, blant annet ordførere, stortingspresidenten, statsministeren og øvrig politisk ledelse.",
  },
] as const satisfies BlogCategory[];

export function getBlogCategory(slug: string) {
  return blogCategories.find((category) => category.slug === slug) ?? null;
}

export function getBlogCategoryByOccupationSlug(occupationSlug: string): BlogCategory | null {
  const matches = blogCategories.filter(
    (category) =>
      "occupationSlug" in category && category.occupationSlug === occupationSlug,
  );

  if (matches.length > 1) {
    throw new Error(`Flere bloggkategorier er knyttet til yrket: ${occupationSlug}`);
  }

  return matches[0] ?? null;
}

export function getBlogCategoryLabel(slug: BlogCategorySlug) {
  return getBlogCategory(slug)?.label ?? slug;
}
