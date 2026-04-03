import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPost } from "@/lib/blog";

type BlogPostHeaderProps = {
  post: BlogPost;
};

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const authorInitials = post.author
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#eef4ff_0%,#d8e5ff_42%,#eef1f8_100%)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] lg:items-center">
        <div className="space-y-6">
          <nav aria-label="Brødsmuler" className="flex flex-wrap items-center gap-2 text-sm text-[rgba(27,36,48,0.68)]">
            <Link className="transition hover:text-[var(--foreground)]" href="/blogg">
              Blogg
            </Link>
            <span aria-hidden="true">→</span>
            <span className="text-[var(--foreground)]">{post.title}</span>
          </nav>

          <div className="space-y-4">
            <time className="block text-sm text-[rgba(27,36,48,0.68)]" dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-balance sm:text-5xl lg:text-[3.75rem]">
              {post.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#243347,#47679f)] text-sm font-semibold tracking-[0.08em] text-white">
              {authorInitials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--foreground)]">{post.author}</p>
              <p className="text-sm text-[rgba(27,36,48,0.68)]">{post.readingTimeMinutes} min lesetid</p>
            </div>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#dfe9ff,#5e84d6)] shadow-[0_20px_50px_rgba(70,103,159,0.18)]">
          <Image
            alt={post.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 520px"
            src={post.coverImage}
          />
        </div>
      </div>
    </header>
  );
}