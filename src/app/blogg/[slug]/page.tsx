import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogProse } from "@/components/blog-prose";
import { BlogLonnsjekkCallout } from "@/components/blog-lonnsjekk-callout";
import { HomeExploreOccupationsSection } from "@/components/home-explore-occupations-section";
import { HomeLatestBlogSection } from "@/components/home-latest-blog-section";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostSlugs,
  getBlogPostUrl,
  getBlogUpdatedAt,
} from "@/lib/blog";
import { editorialIdentity } from "@/lib/editorial-identity";
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
  const updatedAt = getBlogUpdatedAt(post.publishedAt, post.updatedAt);

  return {
    title,
    description,
    authors: [
      {
        name: editorialIdentity.authorName,
        url: getAbsoluteUrl(editorialIdentity.authorPath),
      },
    ],
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
      modifiedTime: updatedAt,
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

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, blogPosts] = await Promise.all([getBlogPostBySlug(slug), getAllBlogPosts()]);

  if (!post) {
    notFound();
  }

  const latestBlogPosts = blogPosts.slice(0, 3);
  const canonicalUrl = getBlogPostUrl(post.slug);
  const updatedAt = getBlogUpdatedAt(post.publishedAt, post.updatedAt);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
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
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
  };

  return (
    <div className="blog-post-page min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        <Link className="blog-post-back-link" href="/blogg">
          ← Tilbake til blogg
        </Link>

        <article>
          <BlogPostHeader post={post} />
          <div className="blog-post-lonnsjekk-callout-wrap mx-auto max-w-3xl">
            <BlogLonnsjekkCallout className="blog-post-lonnsjekk-callout" />
          </div>
          <div className="blog-post-content mx-auto max-w-3xl">
            <BlogProse>{post.content}</BlogProse>
          </div>
        </article>

        <div className="mt-12 sm:mt-16 lg:mt-20">
          <HomeExploreOccupationsSection />
        </div>
        <HomeLatestBlogSection posts={latestBlogPosts} />
      </div>
    </div>
  );
}
