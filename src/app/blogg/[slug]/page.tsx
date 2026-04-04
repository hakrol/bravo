import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogProse } from "@/components/blog-prose";
import { getBlogPostBySlug, getBlogPostSlugs, getBlogPostUrl } from "@/lib/blog";
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
  const canonicalUrl = getBlogPostUrl(post.slug);
  const imageUrl = getAbsoluteUrl(post.coverImage);

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
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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
    <main className="min-h-screen px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <Link className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]" href="/blogg">
          ← Tilbake til blogg
        </Link>

        <article className="space-y-12">
          <BlogPostHeader post={post} />
          <div className="mx-auto max-w-3xl pt-2">
            <BlogProse>{post.content}</BlogProse>
          </div>
        </article>
      </div>
    </main>
  );
}
