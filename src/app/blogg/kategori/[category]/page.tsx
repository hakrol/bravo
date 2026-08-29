import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog-card";
import { getBlogPostsByCategory } from "@/lib/blog";
import type { BlogPostPreview } from "@/lib/blog-shared";
import { blogCategories, getBlogCategory } from "@/lib/blog-taxonomy";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

type BlogCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getBlogCategory(categorySlug);

  if (!category) {
    return {};
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: {
      canonical: category.href,
    },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: category.href,
      siteName: siteConfig.name,
      title: `${category.seoTitle} | ${siteConfig.name}`,
      description: category.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.seoTitle} | ${siteConfig.name}`,
      description: category.seoDescription,
    },
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getBlogCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = await getBlogPostsByCategory(category.slug);
  const [featuredPost, ...remainingPosts] = posts;
  const heroIcon =
    category.slug === "lonn"
      ? "/images/ikon-lonn-blogg.png"
      : category.slug === "lonnsforhandling"
        ? "/images/ikon-lonnsforhandling-blogg.png"
        : null;

  return (
    <main className="blog-category-page min-h-screen overflow-hidden px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-10 lg:gap-12">
        <Link className="blog-post-back-link" href="/blogg">
          ← Tilbake til blogg
        </Link>

        <section
          className={[
            "blog-category-hero fade-up",
            heroIcon ? "" : "blog-category-hero-without-icon",
          ].join(" ")}
        >
          <div className="blog-category-hero-copy">
            <p className="blog-category-kicker">Bloggkategori</p>
            <h1>{category.title}</h1>
            <p>{category.description}</p>
          </div>

          {heroIcon ? (
            <div className="blog-category-hero-icon" aria-hidden="true">
              <Image
                alt=""
                className="blog-category-hero-icon-image"
                fill
                priority
                sizes="(max-width: 900px) 42vw, 260px"
                src={heroIcon}
              />
            </div>
          ) : null}
        </section>

        {featuredPost ? <FeaturedCategoryPost post={featuredPost} /> : null}

        <section className="fade-up-delay flex flex-col gap-8">
          <h2 className="blog-category-section-title">Alle artikler om {category.label.toLowerCase()}</h2>

          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {remainingPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Blogg",
                  item: getAbsoluteUrl("/blogg"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: category.label,
                  item: getAbsoluteUrl(category.href),
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );
}

function FeaturedCategoryPost({ post }: { post: BlogPostPreview }) {
  return (
    <article className="blog-category-featured fade-up-delay">
      <div className="blog-category-featured-content">
        <h2>
          <Link href={`/blogg/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.description}</p>
        <div className="blog-category-featured-footer">
          <span>{post.readingTimeMinutes} min lesetid</span>
          <Link href={`/blogg/${post.slug}`}>Les artikkelen</Link>
        </div>
      </div>
      <Link aria-label={`Les ${post.title}`} className="blog-category-featured-image-link" href={`/blogg/${post.slug}`}>
        <Image
          alt={post.title}
          className="blog-category-featured-image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 620px"
          src={post.coverImage}
        />
      </Link>
    </article>
  );
}
