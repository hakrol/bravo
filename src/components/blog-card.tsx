import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPostPreview } from "@/lib/blog-shared";

type BlogCardProps = {
  post: BlogPostPreview;
};

export function BlogCard({ post }: BlogCardProps) {
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
        <div className="text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Artikkel · {post.readingTimeMinutes} min lesetid
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
