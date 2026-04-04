import type { Metadata } from "next";
import Link from "next/link";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

const description = "Artikler om lønn, statistikk og praktisk bruk av SSB-data.";

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
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-8 shadow-sm sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">Blogg</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Innsikt og forklaringer
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Artikler som forklarer tallene bak nettstedet og hvordan de kan brukes i praksis.
          </p>
        </section>

        {posts.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-950">Ingen innlegg ennå</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Legg til MDX-filer i <code>src/content/blog</code> for å publisere innlegg.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-6 shadow-sm sm:px-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                  <span>{formatBlogDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span>{post.readingTimeMinutes} min lesetid</span>
                  {post.author ? (
                    <>
                      <span>·</span>
                      <span>{post.author}</span>
                    </>
                  ) : null}
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  <Link href={`/blogg/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted)]">{post.description}</p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
