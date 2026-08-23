import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPostPreview } from "@/lib/blog-shared";
import { getBlogCategory } from "@/lib/blog-taxonomy";

type BlogCardProps = {
  post: BlogPostPreview;
  featured?: boolean;
  variant?: "default" | "news";
};

export function BlogCard({ post, featured = false, variant = "default" }: BlogCardProps) {
  const category = getBlogCategory(post.category);

  if (variant === "news") {
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
          href={`/blogg/${post.slug}`}
        >
          <Image
            alt={post.title}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            fill
            priority={featured}
            sizes={featured ? "(max-width: 1024px) 100vw, 760px" : "(max-width: 768px) 100vw, 420px"}
            src={post.coverImage}
          />
        </Link>

        <div className={["flex flex-1 flex-col", featured ? "p-7 sm:p-9 lg:justify-center lg:p-10" : "p-6"].join(" ")}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
            {category ? <span>{category.label}</span> : null}
            <span>Artikkel · {post.readingTimeMinutes} min lesetid</span>
          </div>

          <h2
            className={[
              "mt-5 font-extrabold leading-[1.02] tracking-[-0.055em] text-slate-950",
              featured ? "text-4xl sm:text-5xl" : "text-3xl",
            ].join(" ")}
            lang="nb"
          >
            <Link className="transition hover:text-[var(--primary-strong)]" href={`/blogg/${post.slug}`}>
              {post.title}
            </Link>
          </h2>

          <p className={["leading-7 text-slate-600", featured ? "mt-6 text-lg" : "mt-4 text-base"].join(" ")}>
            {post.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            <Link className="font-bold text-[var(--primary-strong)] hover:underline" href={`/blogg/${post.slug}`}>
              Les artikkelen <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col transition duration-200 hover:-translate-y-0.5">
      <Link aria-label={`Les ${post.title}`} className="block overflow-hidden rounded-[5px]" href={`/blogg/${post.slug}`}>
        <div className="relative aspect-[16/10] bg-[linear-gradient(135deg,#eef2ea,#f6efe4)]">
          <Image
            alt={post.title}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 420px"
            src={post.coverImage}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 pt-5">
        <div className="flex flex-wrap items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {category ? (
            <Link className="blog-meta-chip" href={category.href}>
              {category.label}
            </Link>
          ) : null}
          <span>Artikkel · {post.readingTimeMinutes} min lesetid</span>
        </div>

        <div className="space-y-3">
          <h2
            className="blog-title-fit max-w-[15ch] text-[1.95rem] font-semibold tracking-[-0.065em] text-balance text-[var(--foreground)]"
            lang="nb"
          >
            <Link
              className="transition duration-200 group-hover:text-[var(--primary-strong)]"
              href={`/blogg/${post.slug}`}
            >
              {post.title}
            </Link>
          </h2>
          <p className="max-w-[34ch] text-base leading-7 text-[var(--muted)]">{post.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-sm text-[var(--muted)]">{formatBlogDate(post.publishedAt)}</span>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] transition duration-200 group-hover:text-[var(--primary-strong)]"
            href={`/blogg/${post.slug}`}
          >
            Les artikkelen
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
