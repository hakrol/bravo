import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

const description =
  "Artikler om lønn, statistikk, forhandlinger og hvordan du bruker lønnsdata bedre.";

export const metadata: Metadata = {
  title: "Blogg",
  description,
  alternates: {
    canonical: "/blogg",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/blogg",
    siteName: siteConfig.name,
    title: `Blogg | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blogg | ${siteConfig.name}`,
    description,
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <section className="fade-up grid gap-8 border-b border-[var(--border)] pb-10 lg:grid-cols-[minmax(0,1.1fr)_220px] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary-strong)]">
              Blogg
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-balance sm:text-6xl">
              Artikler skrevet med samme presisjon som dataene våre
            </h1>
          </div>

          <p className="max-w-sm text-base leading-8 text-[var(--muted)] sm:text-lg lg:justify-self-end">
            Forklaringer, analyser og praktiske råd som gjør lønnsdata mer nyttig i virkelige
            beslutninger.
          </p>
        </section>

        <section className="fade-up-delay">
          <div>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}