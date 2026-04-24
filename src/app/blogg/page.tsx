import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { BlogHeroCarousel } from "@/components/blog-hero-carousel";
import { getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

const description =
  "Praktiske guider, lønnsanalyser og innsikt fra norske data som hjelper deg å forstå hva du bør tjene.";

export const metadata: Metadata = {
  title: "Blogg om lønn, karriere og smartere valg",
  description,
  alternates: {
    canonical: "/blogg",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/blogg",
    siteName: siteConfig.name,
    title: `Blogg om lønn, karriere og smartere valg | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blogg om lønn, karriere og smartere valg | ${siteConfig.name}`,
    description,
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="min-h-screen overflow-hidden px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-14 lg:gap-20">
        <BlogHeroCarousel posts={posts} />

        <section className="fade-up-delay flex flex-col gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.07em] text-[var(--foreground)] sm:text-5xl">
                Siste artikler
              </h2>
              <p className="mt-1 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Flere konkrete guider og analyser som hjelper deg å forstå lønn, marked og realistiske
                neste steg.
              </p>
            </div>
            <p className="text-sm text-[var(--muted)]">{posts.length} artikler</p>
          </div>

          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
