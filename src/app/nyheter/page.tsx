import type { Metadata } from "next";
import { NewsCard } from "@/components/news-card";
import { getAllNewsPosts } from "@/lib/nyheter";
import { siteConfig } from "@/lib/site-config";

const description =
  "Siste nytt om lønn, lønnsoppgjør, minstelønn, tariff og regler som påvirker lønnen din.";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getAllNewsPosts();
  const hasPublishedNews = posts.some((post) => !post.isTest);

  return {
    title: "Nyheter om lønn",
    description,
    alternates: { canonical: "/nyheter" },
    robots: hasPublishedNews ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      url: "/nyheter",
      siteName: siteConfig.name,
      title: `Nyheter om lønn | ${siteConfig.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `Nyheter om lønn | ${siteConfig.name}`,
      description,
    },
  };
}

export default async function NewsPage() {
  const posts = await getAllNewsPosts();
  const [featuredPost, ...morePosts] = posts;

  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      <section className="border-b border-black/10 bg-[#fffdf8] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <h1 className="text-5xl font-extrabold leading-none tracking-[-0.065em] text-slate-950 sm:text-7xl">
            Nyheter om lønn
          </h1>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          {featuredPost ? <NewsCard featured post={featuredPost} /> : <p>Ingen nyheter er publisert ennå.</p>}

          {morePosts.length > 0 ? (
            <div className="mt-14 border-t border-black/10 pt-10">
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Flere nyheter</h2>
              <div className="mt-7 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {morePosts.map((post) => (
                  <NewsCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
