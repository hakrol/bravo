import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPostPreview } from "@/lib/blog";

type BlogCardProps = {
  post: BlogPostPreview;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="grid gap-8 border-t border-[var(--border)] py-10 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1.1fr)_340px] md:items-center lg:grid-cols-[minmax(0,1.2fr)_420px]">
      <div className="order-2 flex flex-col gap-4 md:order-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span aria-hidden="true">•</span>
          <span>{post.readingTimeMinutes} min lesetid</span>
        </div>

        <div className="space-y-4">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-balance text-[var(--foreground)] sm:text-4xl">
            <Link className="transition hover:text-[var(--primary-strong)]" href={`/blogg/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            {post.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-sm font-medium text-[var(--muted)]">{post.author}</span>
          <Link
            className="text-sm font-semibold text-[var(--foreground)] transition hover:text-[var(--primary-strong)]"
            href={`/blogg/${post.slug}`}
          >
            Les innlegget →
          </Link>
        </div>
      </div>

      <Link
        aria-label={`Les ${post.title}`}
        className="order-1 block md:order-2"
        href={`/blogg/${post.slug}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#e9efe9,#f4eadc)]">
          <Image
            alt={post.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            src={post.coverImage}
          />
        </div>
      </Link>
    </article>
  );
}
