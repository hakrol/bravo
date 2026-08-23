import Image from "next/image";
import Link from "next/link";
import { formatNewsDate, type NewsPostPreview } from "@/lib/nyheter";

type NewsCardProps = {
  post: NewsPostPreview;
  featured?: boolean;
};

export function NewsCard({ post, featured = false }: NewsCardProps) {
  return (
    <article
      className={[
        "group overflow-hidden rounded-[5px] border border-black/10 bg-white shadow-[0_20px_55px_rgba(27,36,48,0.08)]",
        featured ? "grid lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.85fr)]" : "flex h-full flex-col",
      ].join(" ")}
    >
      <Link
        aria-label={`Les ${post.title}`}
        className={[
          "relative block overflow-hidden bg-[#e9eee7]",
          featured ? "min-h-64 lg:min-h-[31rem]" : "aspect-[16/10]",
        ].join(" ")}
        href={`/nyheter/${post.slug}`}
      >
        <Image
          alt={post.coverImageAlt}
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          fill
          priority={featured}
          sizes={featured ? "(max-width: 1024px) 100vw, 760px" : "(max-width: 768px) 100vw, 420px"}
          src={post.coverImage}
        />
      </Link>

      <div className={["flex min-w-0 flex-1 flex-col", featured ? "p-7 sm:p-9 lg:justify-center lg:p-10" : "p-6"].join(" ")}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
          <span>{post.topic}</span>
          {post.isTest ? (
            <span className="rounded-[3px] bg-[#fff0d9] px-2 py-1 text-[#8a4307]">Testartikkel</span>
          ) : null}
        </div>

        <h2
          className={[
            "mt-5 break-words font-extrabold leading-[1.02] tracking-[-0.055em] text-slate-950 hyphens-auto [overflow-wrap:anywhere]",
            featured ? "text-4xl sm:text-5xl" : "text-3xl",
          ].join(" ")}
          lang="nb"
        >
          <Link className="transition hover:text-[var(--primary-strong)]" href={`/nyheter/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time>
          <Link className="font-bold text-[var(--primary-strong)] hover:underline" href={`/nyheter/${post.slug}`}>
            Les nyheten <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
