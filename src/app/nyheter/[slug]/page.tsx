import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogProse } from "@/components/blog-prose";
import { NewsArticleHeader } from "@/components/news-article-header";
import {
  getNewsPostBySlug,
  getNewsPostSlugs,
  getNewsPostUrl,
  getNewsUpdatedAt,
} from "@/lib/nyheter";
import { editorialIdentity } from "@/lib/editorial-identity";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getNewsPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    return {};
  }

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.description;
  const canonicalUrl = getNewsPostUrl(post.slug);
  const imageUrl = getAbsoluteUrl(post.coverImage);
  const updatedAt = getNewsUpdatedAt(post.publishedAt, post.updatedAt);

  return {
    title,
    description,
    authors: [{ name: editorialIdentity.authorName, url: getAbsoluteUrl(editorialIdentity.authorPath) }],
    alternates: { canonical: canonicalUrl },
    robots: post.isTest ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      locale: "nb_NO",
      url: canonicalUrl,
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: updatedAt,
      authors: [post.author],
      images: [{ url: imageUrl, alt: post.coverImageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = getNewsPostUrl(post.slug);
  const updatedAt = getNewsUpdatedAt(post.publishedAt, post.updatedAt);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.description,
    mainEntityOfPage: canonicalUrl,
    datePublished: post.publishedAt,
    dateModified: updatedAt ?? post.publishedAt,
    image: getAbsoluteUrl(post.coverImage),
    author: {
      "@type": "Organization",
      name: editorialIdentity.authorName,
      url: getAbsoluteUrl(editorialIdentity.authorPath),
    },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.siteUrl },
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      {!post.isTest ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      ) : null}

      <article className="mx-auto w-full max-w-6xl">
        <NewsArticleHeader post={post} />

        {post.isTest ? (
          <div className="mx-auto mt-10 max-w-3xl rounded-[5px] border border-[#e7b56d] bg-[#fff8ec] px-5 py-4 text-sm leading-6 text-[#6f3909]">
            Dette er en designartikkel med illustrerende innhold. Den er ikke en publisert lønnsnyhet.
          </div>
        ) : null}

        <div className="mx-auto mt-10 max-w-3xl">
          <BlogProse>{post.content}</BlogProse>
        </div>

        <footer className="mx-auto mt-12 max-w-3xl border-t border-black/10 pt-7">
          <Link className="font-bold text-[var(--primary-strong)] hover:underline" href="/nyheter">
            ← Tilbake til alle lønnsnyheter
          </Link>
        </footer>
      </article>
    </main>
  );
}
