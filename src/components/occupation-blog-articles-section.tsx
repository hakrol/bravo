import Link from "next/link";
import type { BlogPostPreview } from "@/lib/blog-shared";

type OccupationBlogArticlesSectionProps = {
  categoryHref: string;
  occupationLabel: string;
  posts: BlogPostPreview[];
};

export function OccupationBlogArticlesSection({
  categoryHref,
  occupationLabel,
  posts,
}: OccupationBlogArticlesSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  const sentenceLabel = occupationLabel.toLocaleLowerCase("nb-NO");

  return (
    <section
      aria-labelledby="artikler-heading"
      className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
      id="artikler"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl" id="artikler-heading">
          Artikler om {sentenceLabel}
        </h2>
        <Link
          className="text-sm font-semibold text-[var(--primary-strong)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]"
          href={categoryHref}
        >
          Se alle artikler <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              className="group flex items-center justify-between gap-4 py-4 text-base font-semibold leading-6 text-slate-800 transition hover:text-[var(--primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)] sm:text-lg"
              href={`/blogg/${post.slug}`}
            >
              <span>{post.title}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--primary-strong)]"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
