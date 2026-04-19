import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

const description =
  "Les guider om lønn, lønnssamtale, lønnsforhandling og hvordan du bruker lønnsdata bedre.";

export const metadata: Metadata = {
  title: "Blogg om lønn og lønnssamtale",
  description,
  alternates: {
    canonical: "/blogg",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/blogg",
    siteName: siteConfig.name,
    title: `Blogg om lønn og lønnssamtale | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blogg om lønn og lønnssamtale | ${siteConfig.name}`,
    description,
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <section className="fade-up">
          <div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-balance sm:text-6xl">
              Blogg – Få innsikt i hva du burde tjene
            </h1>
          </div>
        </section>

        <section className="fade-up-delay">
          <div className="space-y-6">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
