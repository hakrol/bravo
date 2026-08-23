import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { getAllBlogPosts } from "@/lib/blog";
import { blogCategories } from "@/lib/blog-taxonomy";
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
  const [featuredPost, ...morePosts] = posts;

  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      <section className="border-b border-black/10 bg-[#fffdf8] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <h1 className="text-5xl font-extrabold leading-none tracking-[-0.065em] text-slate-950 sm:text-7xl">
            Blogg
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Innsikt om lønn, karriere og valg i arbeidslivet, skrevet for norske arbeidstakere og
            jobbsøkere.
          </p>

          <nav aria-label="Bloggkategorier" className="mt-8 flex flex-wrap gap-3">
            {blogCategories.map((category) => (
              <Link key={category.slug} className="blog-category-nav-link" href={category.href}>
                <span>{category.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          {featuredPost ? (
            <BlogCard featured post={featuredPost} variant="news" />
          ) : (
            <p>Ingen artikler er publisert ennå.</p>
          )}

          {morePosts.length > 0 ? (
            <div className="mt-14 border-t border-black/10 pt-10">
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Flere artikler</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                Flere konkrete guider og analyser som hjelper deg å forstå lønn, marked og realistiske
                neste steg.
              </p>
              <div className="mt-7 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {morePosts.map((post) => (
                  <BlogCard key={post.slug} post={post} variant="news" />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
