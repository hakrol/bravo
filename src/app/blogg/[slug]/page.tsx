import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { AdsenseAd } from "@/components/adsense-ad";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogProse } from "@/components/blog-prose";
import { BlogSidebar } from "@/components/blog-sidebar";
import { getAllNewsPosts } from "@/lib/nyheter";
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
  const [post, blogPosts, newsPosts] = await Promise.all([
    getBlogPostBySlug(slug), getAllBlogPosts(), getAllNewsPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const latestBlogPosts = blogPosts.slice(0, 3);
  const relatedSlugs = [
    "dette-er-norges-vanligste-yrker",
    "hva-er-gjennomsnittlig-lonnsvekst-i-norge",
    "hvilke-yrker-tjener-over-1-million",
    "hva-tjener-ordforer-i-oslo",
    "lonnen-til-den-politiske-ledelsen-2026",
    "de-10-best-betalte-laerlingyrkene",
    "de-10-yrkene-med-mest-overtidsbetaling",
  ];
  const relatedPosts = relatedSlugs.flatMap((relatedSlug) =>
    blogPosts.filter((candidate) => candidate.slug === relatedSlug),
  );
  const salaryTips = blogPosts
    .filter((candidate) => candidate.category === "lonnsforhandling" && candidate.slug !== post.slug)
    .slice(0, 4);
  const latestNews = newsPosts.filter((candidate) => !candidate.isTest).slice(0, 4);
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
      <div className="blog-post-shell mx-auto flex w-full flex-col">
        <Link className="blog-post-back-link" href="/blogg">
          ← Tilbake til blogg
        </Link>

        <article>
          <BlogPostHeader post={post} />
          <div className="blog-post-layout">
            <div className="blog-post-main">
              <div className="blog-post-lonnsjekk-callout-wrap mx-auto max-w-3xl">
                <BlogLonnsjekkCallout className="blog-post-lonnsjekk-callout" />
              </div>
              <div className="mx-auto my-8 w-full max-w-3xl sm:my-10 xl:hidden">
                <AdSlot placement="blog-after-intro" />
              </div>
              <div className="blog-post-content mx-auto max-w-3xl">
                <BlogProse>{post.content}</BlogProse>
              </div>
              <div className="mx-auto mt-10 w-full max-w-3xl sm:mt-12">
                <AdsenseAd key={post.slug} />
              </div>
            </div>
            <BlogSidebar relatedPosts={relatedPosts} salaryTips={salaryTips} latestNews={latestNews} />
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
