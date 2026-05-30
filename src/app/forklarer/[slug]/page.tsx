import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogProse } from "@/components/blog-prose";
import {
  getAllForklarerPosts,
  getForklarerPostBySlug,
  getForklarerPostSlugs,
  getForklarerPostUrl,
} from "@/lib/forklarer";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

type ForklarerPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getForklarerPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ForklarerPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getForklarerPostBySlug(slug);

  if (!post) {
    return {};
  }

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.description;
  const canonicalUrl = getForklarerPostUrl(post.slug);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "nb_NO",
      url: canonicalUrl,
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function ForklarerPostPage({ params }: ForklarerPostPageProps) {
  const { slug } = await params;
  const post = await getForklarerPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllForklarerPosts();
  const sidebarItems = allPosts.filter((item) => item.slug !== post.slug).slice(0, 25);
  const canonicalUrl = getForklarerPostUrl(post.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: post.term,
    description: post.seoDescription ?? post.description,
    url: canonicalUrl,
    inDefinedTermSet: getAbsoluteUrl("/forklarer"),
    datePublished: post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
  };

  return (
    <main className="min-h-screen bg-[#fbfbf8] px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />

      <article className="mx-auto grid w-full max-w-6xl gap-12">
        <header className="w-full max-w-3xl min-w-0">
          <div className="min-w-0">
            <nav aria-label="Brødsmuler" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
              <Link className="text-[var(--primary-strong)] no-underline hover:underline" href="/forklarer">
                Forklarer
              </Link>
              <span aria-hidden="true">→</span>
              <span>{post.term}</span>
            </nav>

            <p className="mt-8 text-lg font-extrabold text-slate-950">Hva er</p>
            <h1 className="mt-2 max-w-full text-[2.25rem] font-extrabold leading-[1.02] text-slate-950 [overflow-wrap:anywhere] sm:text-7xl sm:leading-[0.98] sm:[overflow-wrap:normal]">
              {post.term}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{post.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-slate-500">
              <span>{post.readingTimeMinutes} min lesetid</span>
            </div>
          </div>
        </header>

        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,42rem)_12rem] lg:items-start lg:gap-10">
          <div className="w-full max-w-3xl min-w-0">
            <BlogProse>{post.content}</BlogProse>
          </div>

          {sidebarItems.length > 0 ? (
            <aside>
              <h2 className="text-sm font-extrabold leading-5 text-slate-950">Andre ord og begreper</h2>
              <ul className="mt-4 grid gap-2 border-l border-[rgba(20,83,45,0.14)] pl-3">
                {sidebarItems.map((item) => (
                  <li key={item.slug} className="text-sm leading-5">
                    <Link
                      className="font-semibold text-[var(--primary-strong)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                      href={`/forklarer/${item.slug}`}
                    >
                      {item.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </article>
    </main>
  );
}
