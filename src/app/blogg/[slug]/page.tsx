import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBlogDate, getBlogPostBySlug, getBlogPostSlugs, getBlogPostUrl } from "@/lib/blog";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.description;
  const imageUrl = post.coverImage ? getAbsoluteUrl(post.coverImage) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: getBlogPostUrl(post.slug),
    },
    openGraph: {
      type: "article",
      locale: "nb_NO",
      url: getBlogPostUrl(post.slug),
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-white/95 px-6 py-8 shadow-sm sm:px-8">
        <Link className="text-sm font-medium text-[var(--primary-strong)] transition hover:opacity-80" href="/blogg">
          Tilbake til blogg
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
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

        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted)] sm:text-lg">{post.description}</p>

        <div className="prose prose-slate mt-10 max-w-none">{post.content}</div>
      </article>
    </main>
  );
}
