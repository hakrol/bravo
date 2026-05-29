import type { Metadata } from "next";
import Link from "next/link";
import { getAllForklarerPosts } from "@/lib/forklarer";
import { siteConfig } from "@/lib/site-config";

const description =
  "Det er ikke alle ord som er like enkle. Her får du en enkel forklaring på vanlige ord og begreper du vil støtte på i lønnssammenheng.";

export const metadata: Metadata = {
  title: "Forklarer lønn, statistikk og arbeidslivsbegreper",
  description,
  alternates: {
    canonical: "/forklarer",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/forklarer",
    siteName: siteConfig.name,
    title: `Forklarer lønn, statistikk og arbeidslivsbegreper | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Forklarer lønn, statistikk og arbeidslivsbegreper | ${siteConfig.name}`,
    description,
  },
};

function groupPostsByLetter(posts: Awaited<ReturnType<typeof getAllForklarerPosts>>) {
  return posts.reduce<Record<string, typeof posts>>((groups, post) => {
    const letter = post.term.charAt(0).toUpperCase();
    groups[letter] = groups[letter] ?? [];
    groups[letter].push(post);
    return groups;
  }, {});
}

export default async function ForklarerPage() {
  const posts = await getAllForklarerPosts();
  const groupedPosts = groupPostsByLetter(posts);
  const letters = Object.keys(groupedPosts).sort((left, right) => left.localeCompare(right, "nb-NO"));

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <section className="bg-[#f4f7f1] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
              Forklarer
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-[0.98] text-slate-950 sm:text-7xl">
              Lønnsord enkelt forklart
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
              Det er ikke alle ord som er like enkle. Her får du en enkel forklaring på vanlige ord og
              begreper du vil støtte på i lønnssammenheng.
            </p>
          </div>

          <div aria-hidden="true" className="hidden lg:block">
            <div className="relative mx-auto h-56 w-56">
              <div className="absolute left-8 top-6 h-28 w-28 rounded-[5px] bg-[#14532d] opacity-12" />
              <div className="absolute right-4 top-12 h-24 w-24 rounded-[5px] bg-[#b45309] opacity-16" />
              <div className="absolute bottom-7 left-12 grid h-32 w-32 place-items-center rounded-[5px] border border-[rgba(20,83,45,0.16)] bg-white shadow-[0_22px_54px_rgba(27,36,48,0.08)]">
                <span className="text-6xl font-extrabold text-[var(--primary-strong)]">Å</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10">
          <div className="grid gap-12">
            {letters.map((letter) => (
              <section key={letter} aria-labelledby={`forklarer-letter-${letter}`} className="grid gap-5">
                <h3 id={`forklarer-letter-${letter}`} className="text-4xl font-extrabold text-slate-950">
                  {letter}
                </h3>
                <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedPosts[letter].map((post) => (
                    <Link
                      key={post.slug}
                      className="text-lg font-semibold leading-7 text-[var(--primary-strong)] underline underline-offset-4 transition hover:text-[var(--accent)]"
                      href={`/forklarer/${post.slug}`}
                    >
                      {post.term}
                      <span className="sr-only">: {post.description}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
