import Image from "next/image";
import Link from "next/link";
import { formatNewsDate, type NewsPostPreview } from "@/lib/nyheter";

type OccupationNewsSectionProps = {
  occupationLabel: string;
  posts: NewsPostPreview[];
};

export function OccupationNewsSection({
  occupationLabel,
  posts,
}: OccupationNewsSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-[5px] border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-7"
      id="nyheter"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
          Nyheter for {occupationLabel}
        </h2>
        <Link
          className="text-sm font-semibold text-[var(--primary-strong)] hover:underline"
          href="/nyheter"
        >
          Se alle nyheter <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article
            className="group overflow-hidden rounded-[5px] border border-slate-200 bg-slate-50 transition hover:border-emerald-700/25 hover:bg-white hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
            key={post.slug}
          >
            <Link
              aria-label={`Les ${post.title}`}
              className="relative block aspect-[16/9] overflow-hidden bg-[#e9eee7]"
              href={`/nyheter/${post.slug}`}
            >
              <Image
                alt={post.coverImageAlt}
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                src={post.coverImage}
              />
            </Link>
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
                <span className="uppercase tracking-[0.14em] text-[var(--primary-strong)]">
                  {post.topic}
                </span>
                <time className="text-slate-500" dateTime={post.publishedAt}>
                  {formatNewsDate(post.publishedAt)}
                </time>
              </div>
              <h3 className="mt-3 text-xl font-semibold leading-tight text-slate-950">
                <Link
                  className="transition hover:text-[var(--primary-strong)]"
                  href={`/nyheter/${post.slug}`}
                >
                  {post.title}
                </Link>
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
